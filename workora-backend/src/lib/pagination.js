function parsePagination(query = {}, options = {}) {
  const defaultLimit = Number.isInteger(options.defaultLimit) ? options.defaultLimit : 20;
  const maxLimit = Number.isInteger(options.maxLimit) ? options.maxLimit : 50;

  const rawPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const rawLimit = Array.isArray(query.limit) ? query.limit[0] : query.limit;

  const parsedPage = Number.parseInt(rawPage, 10);
  const parsedLimit = Number.parseInt(rawLimit, 10);

  const page = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const normalizedLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : defaultLimit;
  const limit = Math.min(Math.max(normalizedLimit, 1), maxLimit);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

module.exports = { parsePagination };
