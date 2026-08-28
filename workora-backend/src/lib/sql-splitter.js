/**
 * Split a SQL file into individual statements so one failing statement
 * cannot roll back the whole schema (pg runs a multi-statement query as
 * a single transaction). Handles single-quoted strings and $$ … $$ blocks.
 */
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

module.exports = { splitSqlStatements };
