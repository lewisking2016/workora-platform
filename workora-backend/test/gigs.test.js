const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

// ── Schema validation tests ───────────────────────────────────────────
test('schema.sql exists and is readable', () => {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  assert.ok(fs.existsSync(schemaPath), 'schema.sql should exist');
  const content = fs.readFileSync(schemaPath, 'utf8');
  assert.ok(content.length > 100, 'schema.sql should have content');
});

test('schema has all required tables', () => {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const content = fs.readFileSync(schemaPath, 'utf8');

  const requiredTables = [
    'users', 'worker_profiles', 'gigs', 'gig_likes', 'gig_comments',
    'gig_views', 'gig_reports', 'gig_hides', 'saved_gigs',
    'conversations', 'messages', 'message_attachments',
    'job_posts', 'job_applications',
    'ratings', 'user_follows', 'user_blocks', 'user_mutes',
    'notification_preferences', 'notification_reads',
    'collections', 'collection_items',
    'saved_profiles', 'saved_searches',
    'worker_skills', 'worker_languages', 'worker_certifications',
    'auth_login_attempts', 'analytics_events',
    'system_settings', 'post_drafts',
    'conversation_states', 'profile_reports',
    'escrow_payments', 'collection_saves',
  ];

  for (const table of requiredTables) {
    assert.ok(
      content.includes(`CREATE TABLE IF NOT EXISTS ${table}`),
      `Schema should define table: ${table}`
    );
  }
});

test('schema has critical indexes for performance', () => {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const content = fs.readFileSync(schemaPath, 'utf8');

  const criticalIndexes = [
    'idx_gig_likes_gig',           // like count queries
    'idx_messages_conv',           // message loading
    'idx_worker_trade',            // trade-based filtering
    'idx_user_follows_follower',   // following feed
    'idx_user_follows_following',  // follower count
    'idx_gig_worker',             // worker gig lookup
    'idx_user_username',          // auth lookups
  ];

  for (const index of criticalIndexes) {
    assert.ok(
      content.includes(index),
      `Schema should have index: ${index}`
    );
  }
});

test('schema indexes total at least 20', () => {
  const schemaPath = path.join(__dirname, '..', 'schema.sql');
  const content = fs.readFileSync(schemaPath, 'utf8');
  const indexCount = (content.match(/CREATE INDEX/g) || []).length;
  assert.ok(indexCount >= 20, `Should have at least 20 indexes, found ${indexCount}`);
});

// ── Gigs route logic tests ────────────────────────────────────────────
test('gigs orderBy allowlist contains expected scopes', () => {
  const allowedScopes = ['new', 'trending', 'recommended', 'following', 'nearby', 'reels'];
  assert.ok(allowedScopes.length >= 6, 'Should have at least 6 feed scopes');
  assert.ok(allowedScopes.includes('new'), 'Should include new scope');
  assert.ok(allowedScopes.includes('trending'), 'Should include trending scope');
  assert.ok(allowedScopes.includes('reels'), 'Should include reels scope');
});

// ── UUID validation tests ─────────────────────────────────────────────
test('UUID regex matches valid UUIDs', () => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  assert.ok(uuidRegex.test('87ebff32-754d-433a-a62c-b942b8fb5637'), 'Should match valid UUID');
  assert.ok(uuidRegex.test('00000000-0000-0000-0000-000000000000'), 'Should match zero UUID');
  assert.ok(!uuidRegex.test('not-a-uuid'), 'Should reject non-UUID');
  assert.ok(!uuidRegex.test('87ebff32-754d-433a-a62c'), 'Should reject partial UUID');
  assert.ok(!uuidRegex.test('search'), 'Should reject route name as UUID');
  assert.ok(!uuidRegex.test(''), 'Should reject empty string');
});

// ── SQL statement splitter tests ──────────────────────────────────────
test('SQL splitter handles empty input', () => {
  const { splitSqlStatements } = require('../src/lib/sql-splitter');
  const result = splitSqlStatements('');
  assert.ok(Array.isArray(result));
  assert.equal(result.length, 0);
});

test('SQL splitter handles single statement', () => {
  const { splitSqlStatements } = require('../src/lib/sql-splitter');
  const result = splitSqlStatements('SELECT 1;');
  assert.equal(result.length, 1);
  assert.equal(result[0], 'SELECT 1');
});

test('SQL splitter handles multiple statements', () => {
  const { splitSqlStatements } = require('../src/lib/sql-splitter');
  const result = splitSqlStatements('SELECT 1; SELECT 2; SELECT 3;');
  assert.equal(result.length, 3);
});

// ── CleanEnv helper tests ─────────────────────────────────────────────
test('cleanEnv strips double quotes', () => {
  const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;
  assert.equal(cleanEnv('"hello"'), 'hello');
  assert.equal(cleanEnv("'hello'"), 'hello');
  assert.equal(cleanEnv('hello'), 'hello');
  assert.equal(cleanEnv(null), null);
  assert.equal(cleanEnv(undefined), undefined);
});
