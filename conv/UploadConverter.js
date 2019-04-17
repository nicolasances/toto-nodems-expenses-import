
exports.toTO = (po) => {
  return {
    id: po.id,
    yearMonth: po.yearMonth,
    uploadedOn: po.uploadedOn,
    total: po.total,
    count: po.count
  }
}
