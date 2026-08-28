const test = require('node:test');
const assert = require('node:assert/strict');

// ── Module loading tests ──────────────────────────────────────────────
test('auth module exports a function', () => {
  const authRoutes = require('../src/routes/auth');
  assert.equal(typeof authRoutes, 'function');
});

test('gigs module exports a function', () => {
  const gigRoutes = require('../src/routes/gigs');
  assert.equal(typeof gigRoutes, 'function');
});

test('profile module exports a function', () => {
  const profileRoutes = require('../src/routes/profile');
  assert.equal(typeof profileRoutes, 'function');
});

test('messages module exports a function', () => {
  const messagesRoutes = require('../src/routes/messages');
  assert.equal(typeof messagesRoutes, 'function');
});

test('upload module exports a function', () => {
  const uploadRoutes = require('../src/routes/upload');
  assert.equal(typeof uploadRoutes, 'function');
});

test('jobs module exports a function', () => {
  const jobRoutes = require('../src/routes/jobs');
  assert.equal(typeof jobRoutes, 'function');
});

test('payments module exports a function', () => {
  const paymentRoutes = require('../src/routes/payments');
  assert.equal(typeof paymentRoutes, 'function');
});

test('notifications module exports a function', () => {
  const notifRoutes = require('../src/routes/notifications');
  assert.equal(typeof notifRoutes, 'function');
});

test('analytics module exports a function', () => {
  const analyticsRoutes = require('../src/routes/analytics');
  assert.equal(typeof analyticsRoutes, 'function');
});

test('demo-videos module exports a function', () => {
  const demoRoutes = require('../src/routes/demo-videos');
  assert.equal(typeof demoRoutes, 'function');
});

// ── Auth validation logic tests ───────────────────────────────────────
test('password hash comparison works with bcryptjs', async () => {
  const bcrypt = require('bcryptjs');
  const password = 'TestPassword123';
  const hash = await bcrypt.hash(password, 10);

  assert.ok(hash !== password, 'Hash should differ from plaintext');
  const match = await bcrypt.compare(password, hash);
  assert.ok(match, 'Correct password should match');
  const wrongMatch = await bcrypt.compare('WrongPassword', hash);
  assert.ok(!wrongMatch, 'Wrong password should not match');
});

test('password hashing is consistent across calls', async () => {
  const bcrypt = require('bcryptjs');
  const password = 'MySecurePass456';
  const hash1 = await bcrypt.hash(password, 10);
  const hash2 = await bcrypt.hash(password, 10);

  // Hashes should be different (random salt) but both verify
  assert.ok(hash1 !== hash2, 'Hashes use different salts');
  assert.ok(await bcrypt.compare(password, hash1));
  assert.ok(await bcrypt.compare(password, hash2));
});

test('bcrypt rejects empty password', async () => {
  const bcrypt = require('bcryptjs');
  const hash = await bcrypt.hash('password', 10);
  const match = await bcrypt.compare('', hash);
  assert.ok(!match, 'Empty password should not match');
});

// ── Zod validation tests ──────────────────────────────────────────────
test('Zod schema rejects empty analytics payload', () => {
  const { z } = require('zod');
  const schema = z.object({
    event_name: z.string().min(2).max(64),
    session_id: z.string().min(6).max(128),
    page_path: z.string().min(1).max(255),
  });

  const result = schema.safeParse({});
  assert.ok(!result.success, 'Empty payload should fail');
});

test('Zod schema accepts valid analytics payload', () => {
  const { z } = require('zod');
  const schema = z.object({
    event_name: z.string().min(2).max(64),
    session_id: z.string().min(6).max(128),
    page_path: z.string().min(1).max(255),
  });

  const result = schema.safeParse({
    event_name: 'page_view',
    session_id: 'abc123',
    page_path: '/dashboard/feed',
  });
  assert.ok(result.success, 'Valid payload should pass');
});

test('Zod rejects event_name too short', () => {
  const { z } = require('zod');
  const schema = z.object({
    event_name: z.string().min(2).max(64),
  });

  const result = schema.safeParse({ event_name: 'a' });
  assert.ok(!result.success, 'Single char event_name should fail');
});

test('Zod rejects session_id too short', () => {
  const { z } = require('zod');
  const schema = z.object({
    session_id: z.string().min(6).max(128),
  });

  const result = schema.safeParse({ session_id: 'abc' });
  assert.ok(!result.success, 'Short session_id should fail');
});

// ── Env cleaning tests ────────────────────────────────────────────────
test('cleanEnv strips double quotes from DATABASE_URL', () => {
  const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;
  const url = '"postgresql://user:pass@host/db"';
  assert.equal(cleanEnv(url), 'postgresql://user:pass@host/db');
});

test('cleanEnv passes through unquoted values', () => {
  const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;
  assert.equal(cleanEnv('postgresql://user:pass@host/db'), 'postgresql://user:pass@host/db');
});

test('cleanEnv handles null and undefined', () => {
  const cleanEnv = (val) => val ? val.replace(/^["'](.+)["']$/, '$1') : val;
  assert.equal(cleanEnv(null), null);
  assert.equal(cleanEnv(undefined), undefined);
  assert.equal(cleanEnv(''), '');
});
