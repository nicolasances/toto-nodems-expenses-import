
exports.toTO = (po) => {
  return {
    id: po._id,
    yearMonth: po.yearMonth,
    uploadedOn: po.uploadedOn,
    total: po.total,
    count: po.count
  }
}

/**
 * Exports including the expenses
 */
exports.toTOFull = (po) => {
  return {
    id: po._id,
    yearMonth: po.yearMonth,
    uploadedOn: po.uploadedOn,
    total: po.total,
    count: po.count,
    expenses: po.expenses
  }
}
