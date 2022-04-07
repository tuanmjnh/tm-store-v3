const mongoose = require('mongoose'),
  MNews = require('./model'),
  Request = require('../../utils/Request')

module.exports.get = ({ conditions }) => {
  const rs = MNews.aggregate([
    { $match: conditions },
    {
      $lookup: {
        from: 'categories',
        let: { categories: '$categories' },
        as: 'categoryList',
        pipeline: [
          { $match: { $expr: { $eq: ['$_id', '$$categories'] } } },
          { $project: { _id: 1, code: 1, title: 1, level: 1, position: 1, icon: 1, color: 1, meta: 1, orders: 1 } }
        ]
      }
    },
    // { $unwind: "$categoryList" }
  ])
  return rs
}



