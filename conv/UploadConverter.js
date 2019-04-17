
exports.toTO = (po) => {
  return {
    id: po._id,
    yearMonth: po.yearMonth,
    uploadedOn: po.uploadedOn,
    total: po.total,
    count: po.count
  }
}
