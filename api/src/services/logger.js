const MLogger = require('../models/logger'),
  requestHelper = require('../utils/request');
// console.log(ip.get(req), req.headers['user-agent'])

module.exports.set = async (request, name, id, action) => {
  try {
    if (process.env.LOGGER) return;
    const logger = {
      userId: request.verify._id,
      collName: name,
      collId: id,
      method: action,
      userAgent: requestHelper.getUserAgent(request),
      at: new Date(),
      ip: requestHelper.getIp(request)
    };
    const data = new MLogger(logger);
    // data.validate()
    data.save((e, rs) => {
      if (e) return false;
      return true;
    });
  } catch (e) {
    console.log(e);
  }
};
module.exports.setOne = async (logger) => {
  try {
    // const data = new Model({
    //   c: logger.collection_name,
    //   cid: logger.collection_id,
    //   method: logger.method,
    //   at: new Date(),
    //   by: logger.user_id, // mongoose.Schema.Types.ObjectId(by)
    //   ip: logger.ip,
    //   com: req.headers['user-agent'],
    // });
    const data = new MLogger(logger);
    // data.validate()
    data.save((e, rs) => {
      if (e) return false;
      return true;
    });
  } catch (e) {
    console.log(e);
  }
};
