const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

// Same splitter as src/index.js
function splitSqlStatements(sql) {
  const statements = [];
  let current = '';
  let i = 0;
  const n = sql.length;

  while (i < n) {
    const ch = sql[i];

    if (ch === '-' && sql[i + 1] === '-') {
      // Line comment: copy to end of line so apostrophes inside comments
      // are never mistaken for string delimiters.
      while (i < n && sql[i] !== '\n') {
        current += sql[i];
        i += 1;
      }
      continue;
    }

    if (ch === "'") {
      current += ch;
      i += 1;
      while (i < n) {
        current += sql[i];
        if (sql[i] === "'") {
          if (sql[i + 1] === "'") {
            current += sql[i + 1];
            i += 2;
            continue;
          }
          i += 1;
          break;
        }
        i += 1;
      }
      continue;
    }

    if (ch === '$' && sql[i + 1] === '$') {
      const start = i;
      i += 2;
      while (i < n && !(sql[i] === '$' && sql[i + 1] === '$')) {
        i += 1;
      }
      i += 2;
      current += sql.slice(start, i);
      continue;
    }

    if (ch === ';') {
      if (current.trim()) statements.push(current.trim());
      current = '';
      i += 1;
      continue;
    }

    current += ch;
    i += 1;
  }

  if (current.trim()) statements.push(current.trim());
  return statements;
}

const schemaPath = path.join(__dirname, '..', 'schema.sql');
const sql = fs.readFileSync(schemaPath, 'utf8');

test('splitter keeps DO $$ blocks intact', () => {
  const stmts = splitSqlStatements(sql);
  const doBlocks = stmts.filter((s) => s.includes('DO $$ BEGIN'));
  assert.equal(doBlocks.length, 1, 'exactly one DO $$ migration block');
  assert.ok(doBlocks[0].endsWith('END $$'), 'DO block ends properly');
  assert.ok(doBlocks[0].includes('participant_1'), 'DO block contains conversation migration');
});

test('splitter finds all CREATE TABLE statements', () => {
  const stmts = splitSqlStatements(sql);
  const creates = stmts.filter((s) => s.includes('CREATE TABLE IF NOT EXISTS'));
  assert.ok(creates.length >= 30, `expected 30+ tables, got ${creates.length}`);
});

test('splitter finds index statements', () => {
  const stmts = splitSqlStatements(sql);
  const indexes = stmts.filter((s) => s.includes('CREATE INDEX IF NOT EXISTS'));
  assert.ok(indexes.length >= 20, `expected 20+ indexes, got ${indexes.length}`);
});

test('splitter handles single-quoted strings with semicolons', () => {
  const stmts = splitSqlStatements(`SELECT 'a;b' AS x; SELECT 2;`);
  assert.equal(stmts.length, 2);
  assert.match(stmts[0], /'a;b'/);
});
