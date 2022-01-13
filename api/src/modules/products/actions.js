const mongoose = require('mongoose'),
  MProducts = require('./model')

module.exports.insert = async (item, createdBy, createdIp) => {
  const rs = { success: null, error: null }
  try {
    const findOne = await MProducts.findOne({ code: item.code })
    if (findOne) {
      rs.error = 'exist'
      return rs
    }
    item.created = { at: new Date(), by: createdBy, ip: createdIp }
    const data = new MProducts(item)
    data.validateSync()
    rs.success = await data.save()
  } catch (e) {
    rs.error = e
  }
  return rs
}
