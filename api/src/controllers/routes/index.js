const mongoose = require('mongoose'),
  Model = require('../../models/routes'),
  tmp_routes = require('../../utils/tmp_routes'),
  pagination = require('../../utils/pagination'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger');

const name = 'routes';
module.exports.name = name;
const generateRoutes = (routes, dependent = null) => {
  const rs = [];
  try {
    const children = routes.filter((x) => x.dependent !== null);
    routes.forEach((e) => {
      if (e.dependent === dependent) {
        const child = generateRoutes(children, e._id.toString());
        if (child.length > 0) e.children = child;
        rs.push(e);
      }
    });
  } catch (e) {
    console.log(e);
  }
  return rs;
};
module.exports.get = async function (req, res, next) {
  try {
    let conditions = {};
    if (req.query.flag) conditions = { $and: [{ flag: req.query.flag }] };
    if (req.query.filter) {
      conditions.$and.push({
        $or: [
          { path: new RegExp(req.query.filter, 'i') },
          { name: new RegExp(req.query.filter, 'i') },
        ],
      });
    }
    req.query.rowsNumber = await Model.where(conditions).countDocuments();
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'orders']: req.query.descending === 'true' ? -1 : 1 }, // 1 ASC, -1 DESC
    };
    Model.find(conditions, null, options, function (e, rs) {
      if (e) return res.status(500).send(e);
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
    if (
      !req.body ||
      Object.keys(req.body).length < 1 ||
      req.body.path.length < 1 ||
      req.body.name.length < 1
    ) {
      return res.status(500).send('invalid');
    }
    const x = await Model.findOne({ name: req.body.name });
    if (x) return res.status(501).send('exist');
    req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) };
    const data = new Model(req.body);
    if (!req.body.dependent) data.dependent = null;
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

const insertTemplateR = async (routers) => {
  const rs = [];
  for await (let e of routers) {
    const data = new Model(e);
    data.save().then((x) => {
      if (x) rs.push(e);
      if (e.children) insertTemplateR(e.children);
    });
  }
  return rs;
};

module.exports.insertTemplate = async function (req, res, next) {
  try {
    const rs = [];
    for await (let e of tmp_routes.data) {
      const x = await Model.findOne({ name: e.name });
      if (x) continue;
      const data = await new Model(e).save();
      if (data) rs.push(e);
    }
    return res.status(201).json(rs);
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.put = async function (req, res, next) {
  try {
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid');
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      const x = await Model.findOne({ _id: { $nin: [req.body._id] }, name: req.body.name });
      if (x) return res.status(501).send('exist');
      if (req.body.meta) {
        req.body.meta.forEach((e) => {
          if (e.key === 'hidden') e.value = e.value === 'true' ? true : false;
        });
      }
      Model.updateOne(
        { _id: req.body._id },
        {
          $set: {
            path: req.body.path,
            name: req.body.name,
            component: req.body.component,
            redirect: req.body.redirect,
            // title: req.body.title,
            // icon: req.body.icon,
            orders: req.body.orders,
            // hidden: req.body.hidden,
            meta: req.body.meta,
            flag: req.body.flag,
          },
        },
        (e, rs) => {
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

module.exports.updateOrder = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1 || !req.body._id) {
      return res.status(500).send('invalid');
    }
    if (!req.body.dependent) req.body.dependent = null;
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      Model.updateOne(
        { _id: req.body._id },
        {
          $set: {
            dependent: req.body.dependent,
            level: req.body.level,
            orders: req.body.orders,
          },
        },
        (e, rs) => {
          // { multi: true, new: true },
          if (e) return res.status(500).send(e);
          // Push logs
          // logs.push(req, { user_id: req.verify._id, collection: 'roles', collection_id: req.body._id, method: 'update' })
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
