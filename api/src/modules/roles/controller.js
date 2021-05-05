const mongoose = require('mongoose'),
  MRoles = require('./model'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger');

const name = 'roles';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { key: new RegExp(req.query.filter, 'i') },
          { name: new RegExp(req.query.filter, 'i') },
        ],
      });
    }
    if (!req.query.sortBy) req.query.sortBy = 'level';
    req.query.rowsNumber = await MRoles.where(conditions).countDocuments();
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'level']: req.query.descending === 'true' ? -1 : 1 }, // 1 ASC, -1 DESC
    };
    MRoles.find(conditions, null, options, function (e, rs) {
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
        MRoles.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e);
          if (!rs) return res.status(404).send('no_exist');
          return res.status(200).json(rs);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } else if (!req.query.key) {
      MRoles.findOne({ key: req.query.key }, (e, rs) => {
        if (e) return res.status(500).send(e);
        if (!rs) return res.status(404).send('no_exist');
        return res.status(200).json(rs);
      });
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.post = async function (req, res, next) {
  try {
    if (
      !req.body ||
      Object.keys(req.body).length < 1 ||
      req.body.key.length < 1 ||
      req.body.name.length < 1
    ) {
      return res.status(500).send('invalid');
    }
    const x = await MRoles.findOne({ key: req.body.key });
    if (x) return res.status(501).send('exist');
    req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) };
    const data = new MRoles(req.body);
    // data.validate()
    data.save((e, rs) => {
      if (e) return res.status(500).send(e);
      // Push logs
      Logger.set(req, name, rs._id, 'insert');
      return res.status(201).json(rs);
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MRoles.updateOne(
        { _id: req.body._id },
        {
          $set: {
            name: req.body.name,
            desc: req.body.desc,
            level: req.body.level,
            color: req.body.color,
            routes: req.body.routes,
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
      const x = await MRoles.findById(_id);
      if (x) {
        var _x = await MRoles.updateOne({ _id: _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
        if (_x.nModified) {
          rs.success.push(_id);
          // Push logs
          Logger.set(req, name, _id, x.flag === 1 ? 'lock' : 'unlock');
        } else rs.error.push(_id);
      }
    }
    return res.status(203).json(rs);

    // req.body.id.forEach(async e => {
    //   if (mongoose.Types.ObjectId.isValid(e)) {
    //     const x = await MRoles.findById(e)
    //     if (x) {
    //       MRoles.updateOne({ _id: req.params.id }, { $set: { flag: req.body.flag } }, (e, rs) => {
    //         if (e) return res.status(500).send(e)
    //         if (!rs) return res.status(404).send('no_exist')
    //         return res.status(202).json(rs)
    //       })
    //     }
    //     return res.status(202).json(req.body.id)
    //   } else {
    //     return res.status(500).send('invalid')
    //   }
    // })
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.delete = async function (req, res, next) {
  try {
    if (mongoose.Types.ObjectId.isValid(req.params._id)) {
      MRoles.deleteOne({ _id: req.params._id }, (e, rs) => {
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
