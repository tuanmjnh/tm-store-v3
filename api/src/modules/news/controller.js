const mongoose = require('mongoose'),
  MNews = require('./model'),
  ANews = require('./actions'),
  pagination = require('../../utils/pagination'),
  Request = require('../../utils/Request'),
  Logger = require('../../services/logger')

module.exports.name = MNews.collection.collectionName
module.exports.get = async function (req, res, next) {
  try {
    let conditions = { $and: [{ flag: req.query.flag ? parseInt(req.query.flag) : 1 }] }
    if (req.query.filter) conditions.$and.push({ $text: { $search: req.query.filter } })
    if (req.query.categories) conditions.$and.push({ categories: req.query.categories })
    if (!req.query.sortBy) req.query.sortBy = 'orders'
    req.query.rowsNumber = (await ANews.get({ conditions: conditions })).length
    const rs = await ANews.get({ conditions: conditions })
      .skip((parseInt(req.query.page) - 1) * parseInt(req.query.rowsPerPage))
      .limit(parseInt(req.query.rowsPerPage))
      .sort({ [(req.query.sortBy) || 'orders']: req.query.descending === 'true' ? -1 : 1 }) // 1 ASC, -1 DESC
      .exec()

    return res.status(200).json({ rowsNumber: req.query.rowsNumber, data: rs });
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.find = async function (req, res, next) {
  try {
    if (req.query.id) {
      if (!mongoose.Types.ObjectId.isValid(req.query.id)) return res.status(500).send('invalid')
      if (Array.isArray(req.query.id)) {
        const conditions = { $and: [{ _id: { $in: req.query.id } }] }
        const rs = await ANews.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ _id: mongoose.Types.ObjectId(req.query.id) }] }
        const rs = await ANews.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    } else if (req.query.code) {
      if (Array.isArray(req.query.code)) {
        const conditions = { $and: [{ code: { $in: req.query.code } }] }
        const rs = await ANews.get({ conditions: conditions }).exec()
        if (!rs) return res.status(404).send('no_exist')
        return res.status(200).json(rs)
      } else {
        const conditions = { $and: [{ code: req.query.code }] }
        const rs = await ANews.get({ conditions: conditions }).exec()
        if (!rs || rs.length < 1) return res.status(404).send('no_exist')
        return res.status(200).json(rs[0])
      }
    }
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.getAttr = async function (req, res, next) {
  try {
    const conditions = req.query.key
      ? { 'attr.key': new RegExp(req.query.filter, 'i') }
      : { 'attr.value': new RegExp(req.query.filter, 'i') }
    const qry = MNews.distinct(req.query.key ? 'attr.key' : 'attr.value', conditions, (e, rs) => {
      if (e) return res.status(500).send(e)
      const rowsNumber = rs.length
      if (req.query.page && req.query.rowsPerPage) {
        return res.status(200).json(pagination.get(rs, parseInt(req.query.page), parseInt(req.query.rowsPerPage)))
      } else {
        return res.status(200).json({ rowsNumber: rowsNumber, data: rs })
      }
    })
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.post = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.body.categories)) return res.status(500).send('invalid')
    if (!req.body || Object.keys(req.body).length < 1 || !req.body.title) return res.status(500).send('invalid')
    req.body.created = { at: new Date(), by: req.verify._id, ip: Request.getIp(req) }
    req.body.date = req.body.date ? req.body.date : new Date()
    const data = new MNews(req.body)
    data.validateSync()
    const rs = await data.save()
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MNews.collection.collectionName, collectionID: rs._id, method: 'insert' })
    return res.status(201).json(rs)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.put = async function (req, res, next) {
  try {
    // if (!req.params.id) return res.status(500).send('Incorrect Id!')
    if (!req.body || Object.keys(req.body).length < 1) return res.status(500).send('invalid')
    if (!mongoose.Types.ObjectId.isValid(req.body._id)) return res.status(500).send('invalid')
    const rs = await MNews.updateOne(
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
          flag: req.body.flag
        }
      })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MNews.collection.collectionName, collectionID: req.body._id, method: 'update' })
    return res.status(202).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}

module.exports.patch = async function (req, res, next) {
  const session = await mongoose.startSession()
  const rs = { success: [], error: [] }
  await session.withTransaction(async () => {
    let rs = { success: [], error: [] }
    for await (let _id of req.body._id) {
      try {
        const exist = await MNews.findById(_id)
        if (exist) {
          const update = await MNews.updateOne({ _id: _id }, { $set: { flag: exist.flag === 1 ? 0 : 1 } })
          if (update) {
            rs.success.push(_id)
            //Set Logger
            Logger.set({ request: req, collectionName: MNews.collection.collectionName, collectionID: req.body._id, method: 'flag' })
          } else rs.error.push(_id)
        }
      } catch (e) { continue }
    }
  })
  session.endSession()
  return res.status(203).json(rs)
}

module.exports.delete = async function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params._id)) return res.status(500).send('invalid')
    const rs = await MNews.deleteOne({ _id: req.params._id })
    if (!rs) return res.status(500).send('invalid')
    //Set Logger
    Logger.set({ request: req, collectionName: MNews.collection.collectionName, collectionID: req.params._id, method: 'delete' })
    return res.status(204).json(rs)
  } catch (e) {
    return res.status(500).send('invalid')
  }
}
