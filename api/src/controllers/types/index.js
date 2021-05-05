const mongoose = require('mongoose'),
  Model = require('../../models/types'),
  pagination = require('../../utils/pagination'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger');

const name = 'types';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
    if (req.query.key) conditions.$and.push({ key: req.query.key });
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { name: new RegExp(req.query.filter, 'i') },
          { 'meta.title': new RegExp(req.query.filter, 'i') },
        ],
      });
    }
    if (!req.query.sortBy) req.query.sortBy = 'orders';
    req.query.rowsNumber = await Model.where(conditions).countDocuments();
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { key: 1, [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 }, // 1 ASC, -1 DESC
    };
    Model.find(conditions, null, options, function (e, rs) {
      if (e) return res.status(500).send(e);
      // if (!rs) return res.status(404).send('No data exist!')
      return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.find = async function (req, res, next) {
  try {
    if (!req.query._id) {
      if (mongoose.Types.ObjectId.isValid(req.query._id)) {
        Model.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e);
          if (!rs) return res.status(404).send('no_exist');
          return res.status(200).json(rs);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } else if (!req.query.key) {
      Model.findOne({ key: req.query.key }, (e, rs) => {
        if (e) return res.status(500).send(e);
        if (!rs) return res.status(404).send('no_exist');
        return res.status(200).json(rs);
      });
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

// module.exports.getKey = async function (req, res, next) {
//   try {
//     Model.distinct('key', req.body.conditions, (e, rs) => {
//       if (e) return res.status(500).send(e);
//       if (req.query.filter) rs = rs.filter((x) => new RegExp(req.query.filter, 'i').test(x));
//       const rowsNumber = rs.length;
//       if (req.query.page && req.query.rowsPerPage)
//         rs = pagination.get(rs, req.query.page, req.query.rowsPerPage);
//       return res.status(200).json({ rowsNumber: rowsNumber, data: rs });
//     });
//   } catch (e) {
//     return res.status(500).send('invalid');
//   }
// };

module.exports.getMeta = async function (req, res, next) {
  try {
    Model.distinct(req.query.key ? 'meta.key' : 'meta.value', null, (e, rs) => {
      if (e) return res.status(500).send(e);
      if (req.query.filter) rs = rs.filter((x) => new RegExp(req.query.filter, 'i').test(x));
      const rowsNumber = rs.length;
      if (req.query.page && req.query.rowsPerPage)
        rs = pagination.get(rs, req.query.page, req.query.rowsPerPage);
      return res.status(200).json({ rowsNumber: rowsNumber, data: rs });
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.post = async function (req, res, next) {
  try {
    // if (!req.body || Object.keys(req.body).length < 1 || req.body.key.length < 1 || req.body.name.length < 1) {
    //   return res.status(500).send('invalid')
    // }
    const x = await Model.findOne({ key: req.body.key, code: req.body.code });
    if (x) return res.status(501).send('exist');
    req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) };
    const data = new Model(req.body);
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e);
      // Push logs
      Logger.set(req, name, rs._id, 'insert');
      return res.status(201).json(rs);
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send('invalid');
  }
};

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    const x = await Model.findOne({
      _id: { $nin: [req.body._id] },
      key: req.body.key,
      code: req.body.code,
    });
    if (x) return res.status(501).send('exist');
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne(
        { _id: req.body._id },
        {
          $set: {
            key: req.body.key,
            code: req.body.code,
            name: req.body.name,
            desc: req.body.desc,
            meta: req.body.meta,
            orders: req.body.orders,
            flag: req.body.flag,
          },
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e);
          // Push logs
          Logger.set(req, name, req.body._id, 'update');
          return res.status(202).json(rs);
        },
      );
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.patch = async function (req, res, next) {
  try {
    let rs = { success: [], error: [] };
    for await (let _id of req.body._id) {
      const x = await Model.findById(_id);
      if (x) {
        var _x = await Model.updateOne({ _id: _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
        if (_x.nModified) {
          rs.success.push(_id);
          // Push logs
          Logger.set(req, name, _id, x.flag === 1 ? 'lock' : 'unlock');
        } else rs.error.push(_id);
      }
    }
    return res.status(203).json(rs);
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      Model.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set(req, name, req.params._id, 'delete');
        return res.status(204).json(rs);
      });
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
