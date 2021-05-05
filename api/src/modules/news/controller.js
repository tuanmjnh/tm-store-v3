const mongoose = require('mongoose'),
  MNews = require('./model'),
  pagination = require('../../utils/pagination'),
  request = require('../../utils/request'),
  Logger = require('../../services/logger');

const name = 'news';
module.exports.name = name;
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? req.query.flag : 1 }] };
    if (req.query.filter) {
      // conditions.$and.push({
      //   $or: [
      //     { title: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { code: new RegExp(search.normalize(req.query.filter), 'i') },
      //     { author: new RegExp(search.normalize(req.query.filter), 'i') }
      //   ]
      // })
      conditions.$and.push({ $text: { $search: req.query.filter } });
    }
    if (req.query.categories) conditions.$and.push({ categories: req.query.categories });
    if (!req.query.sortBy) req.query.sortBy = 'orders';
    req.query.rowsNumber = await MNews.where(conditions).countDocuments();
    const options = {
      skip: (parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage),
      limit: parseInt(req.query.rowsPerPage),
      sort: { [req.query.sortBy || 'level']: req.query.descending === 'true' ? -1 : 1 }, // 1 ASC, -1 DESC
    };
    MNews.find(conditions, null, options, function (e, rs) {
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
        MNews.findById(req.query._id, (e, rs) => {
          if (e) return res.status(500).send(e);
          if (!rs) return res.status(404).send('no_exist');
          return res.status(200).json(rs);
        });
      } else {
        return res.status(500).send('invalid');
      }
    } else if (!req.query.key) {
      MNews.findOne({ key: req.query.key }, (e, rs) => {
        if (e) return res.status(500).send(e);
        if (!rs) return res.status(404).send('no_exist');
        return res.status(200).json(rs);
      });
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.getAttr = async function (req, res, next) {
  try {
    const conditions = req.query.key
      ? { 'attr.key': new RegExp(req.query.filter, 'i') }
      : { 'attr.value': new RegExp(req.query.filter, 'i') };
    const qry = MNews.distinct(req.query.key ? 'attr.key' : 'attr.value', conditions, (e, rs) => {
      if (e) return res.status(500).send(e);
      const rowsNumber = rs.length;
      if (req.query.page && req.query.rowsPerPage) {
        return res.status(200).json(pagination.get(rs, req.query.page, req.query.rowsPerPage));
      } else {
        return res.status(200).json({ rowsNumber: rowsNumber, data: rs });
      }
    });
  } catch (e) {
    return res.status(500).send('invalid');
  }
};

module.exports.post = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.categories))
      return res.status(500).send('invalid');
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.title) {
      return res.status(500).send('invalid');
    }
    req.body.created = { at: new Date(), by: req.verify._id, ip: request.getIp(req) };
    const data = new MNews(req.body);
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
    if (mongoose.Types.ObjectId.isValid(req.body._id)) {
      MNews.updateOne(
        { _id: req.body._id },
        {
          $set: {
            // type: req.body.type,
            categories: req.body.categories,
            title: req.body.title,
            code: req.body.code,
            desc: req.body.desc,
            content: req.body.content,
            url: req.body.url,
            images: req.body.images,
            author: req.body.author,
            date: req.body.date,
            pin: req.body.pin,
            tags: req.body.tags,
            attr: req.body.attr,
            meta: req.body.meta,
            attach: req.body.attach,
            startAt: req.body.startAt,
            endAt: req.body.endAt,
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
      const x = await MNews.findById(_id);
      if (x) {
        var _x = await MNews.updateOne({ _id: _id }, { $set: { flag: x.flag === 1 ? 0 : 1 } });
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
      MNews.deleteOne({ _id: req.params._id }, (e, rs) => {
        if (e) return res.status(500).send(e);
        // Push logs
        Logger.set(req, path, req.params._id, 'delete');
        return res.status(204).json(rs);
      });
    } else {
      return res.status(500).send('invalid');
    }
  } catch (e) {
    return res.status(500).send('invalid');
  }
};
