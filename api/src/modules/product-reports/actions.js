const moment = require('moment')
module.exports.getType = ({ type, match }) => {
  if (type === 'day') {
    const curent = moment().date()
    const labels = 25
    const conditions = [
      // Match
      { $match: match },
      // Group
      {
        $group: {
          _id: {
            curent: { $dayOfMonth: '$createdAt' },
            labels: {
              $hour: {
                date: '$createdAt',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              }
            }
          },
          orders: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      { $match: { '_id.curent': curent } },
      // Sort
      { $sort: { '_id.curent': -1, '_id.labels': 1 } }
    ]
    return { curent, labels, conditions }
  } else if (type === 'week') {
    const curent = moment().isoWeek()
    const labels = 8
    const conditions = [
      // Match
      { $match: match },
      // Group
      {
        $group: {
          _id: {
            curent: { $isoWeek: '$createdAt' },
            labels: { $isoDayOfWeek: '$createdAt' }
          },
          orders: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      // { $match: { '_id.curent': curent } },
      // Sort
      { $sort: { '_id.curent': -1, '_id.labels': 1 } }
    ]
    return { curent, labels, conditions }
  } else if (type === 'month') {
    const curent = moment().month() + 1
    const labels = moment().daysInMonth() + 1
    const conditions = [
      // Match
      { $match: match },
      // Group
      {
        $group: {
          _id: {
            curent: { $month: '$createdAt' },
            labels: { $dayOfMonth: '$createdAt' }
          },
          orders: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      { $match: { '_id.curent': curent } },
      // Sort
      { $sort: { '_id.curent': -1, '_id.labels': 1 } }
    ]
    return { curent, labels, conditions }
  } else if (type === 'quarter') {
    const curent = moment().year()
    const labels = 5
    const conditions = [
      // Match
      { $match: match },
      // project
      {
        $project: {
          products: 1,
          prices: 1,
          quantities: 1,
          year: { $year: '$createdAt' },
          quarter: {
            $trunc: {
              $add: [
                {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $month: '$createdAt'
                        },
                        1
                      ]
                    },
                    3
                  ]
                },
                1
              ]
            }
          }
        }
      },
      {
        $group: {
          _id: {
            curent: '$year',
            labels: '$quarter'
          },
          orders: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      { $match: { '_id.curent': curent } },
      // Sort
      { $sort: { '_id.curent': -1, '_id.labels': 1 } }
    ]
    return { curent, labels, conditions }
  } else if (type === 'year') {
    const curent = moment().year()
    const labels = 13
    const conditions = [
      // Match
      { $match: match },
      {
        $group: {
          _id: {
            curent: { $year: '$createdAt' },
            labels: { $month: '$createdAt' }
          },
          orders: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      { $match: { '_id.curent': curent } },
      // Sort
      { $sort: { '_id.curent': -1, '_id.labels': 1 } }
    ]
    return { curent, labels, conditions }
  }
}