function parseSortBy(value) {
  if (typeof value === 'undefined') {
    return '_id';
  }
  const keys = ['_id', 'name', 'year', 'createdAt'];
  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
}

function parseSortOrder(value) {
  if (typeof value === 'undefined') {
    return 'asc';
  }
  if (value !== 'asc' && value !== 'desc') {
    return 'asc';
  }
  return value;
}

export function parceSortParams(query) {
  const sortBy = query.sortBy;
  const sortOrder = query.sortOrder;
  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);
  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
