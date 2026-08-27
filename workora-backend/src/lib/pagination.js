/**
 * Parse pagination from query params.
 * Supports two modes:
 *   - Page-based: ?page=2&limit=20  (offset pagination)
 *   - Cursor-based: ?cursor=<uuid>&limit=20  (keyset pagination, preferred for feeds)
 *
 * Returns { limit, offset, cursor, useCursor }
 */
function parsePagination(query = {}, options = {}) {
  const defaultLimit = Number.isInteger(options.defaultLimit) ? options.defaultLimit : 20;
  const maxLimit = Number.isInteger(options.maxLimit) ? options.maxLimit : 50;

  const rawCursor = Array.isArray(query.cursor) ? query.cursor[0] : query.cursor;
  const rawLimit = Array.isArray(query.limit) ? query.limit[0] : query.limit;

  const parsedLimit = Number.parseInt(rawLimit, 10);
  const normalizedLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit;
  const limit = Math.min(Math.max(normalizedLimit, 1), maxLimit);

  // Cursor-based pagination (preferred for infinite scroll feeds)
  if (rawCursor && typeof rawCursor === 'string' && rawCursor.length > 0) {
    return { limit, offset: 0, cursor: rawCursor, useCursor: true };
  }

  // Fall back to page-based pagination
  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const parsedPage = Number.parseInt(rawPage, 10);
  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const offset = (page - 1) * limit;

  return { page, limit, offset, cursor: null, useCursor: false };
}

module.exports = { parsePagination };
