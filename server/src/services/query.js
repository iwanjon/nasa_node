const DEFAULT_PAGE_LIMIT = 50;
const DEFAULT_PAGE = 1;
function getPagination(query) {
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const page = Math.abs(query.page) || DEFAULT_PAGE;

  const skip = (page - 1) * limit;
  return {
    skip,
    limit,
  };
}

module.exports = { getPagination };
