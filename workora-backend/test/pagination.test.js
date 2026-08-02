const test = require('node:test');
const assert = require('node:assert/strict');

const { parsePagination } = require('../src/lib/pagination');

test('parsePagination applies defaults when query is empty', () => {
  const pagination = parsePagination({});

  assert.deepEqual(pagination, {
    page: 1,
    limit: 20,
    offset: 0
  });
});

test('parsePagination clamps invalid values to safe bounds', () => {
  const pagination = parsePagination({ page: '-2', limit: '500' }, { defaultLimit: 20, maxLimit: 50 });

  assert.deepEqual(pagination, {
    page: 1,
    limit: 50,
    offset: 0
  });
});
