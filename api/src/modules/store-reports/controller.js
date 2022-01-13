const mongoose = require('mongoose'),
  MImports = require('../store-imports/model'),
  MExports = require('../store-exports/model'),
  MExportItems = require('../store-exports/model-items'),
  MImportItems = require('../store-imports/model-items'),
  MProducts = require('../products/model'),
  MCategories = require('../categories/model'),
  moment = require('moment')

const name = 'store-reports'
module.exports.name = name
module.exports.date = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const curent = moment().date()
    const labelsLength = 25
    const conditions = [
      // Having
      // { $match: { flag: 1 } },
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
          bills: { $sum: 1 },
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
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = imports.find((x) => x._id.labels === i)
        if (item) {
          result.imports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = exports.find((x) => x._id.labels === i)
        if (item) {
          result.exports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.weekly = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const curent = moment().week()
    const labelsLength = 8
    const conditions = [
      {
        $group: {
          _id: {
            curent: { $isoWeek: '$createdAt' },
            labels: { $isoDayOfWeek: '$createdAt' }
          },
          bills: { $sum: 1 },
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
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = imports.find((x) => x._id.labels === i)
        if (item) {
          result.imports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = exports.find((x) => x._id.labels === i)
        if (item) {
          result.exports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.month = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const curent = moment().month() + 1
    const labelsLength = moment().daysInMonth() + 1
    const conditions = [
      // Having
      // { $match: { flag: 1 } },
      // Group
      {
        $group: {
          _id: {
            curent: { $month: '$createdAt' },
            labels: { $dayOfMonth: '$createdAt' }
          },
          bills: { $sum: 1 },
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
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = imports.find((x) => x._id.labels === i)
        if (item) {
          result.imports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = exports.find((x) => x._id.labels === i)
        if (item) {
          result.exports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.quarter = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const curent = moment().year()
    const labelsLength = 5
    const conditions = [
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
          bills: { $sum: 1 },
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
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = imports.find((x) => x._id.labels === i)
        if (item) {
          result.imports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = exports.find((x) => x._id.labels === i)
        if (item) {
          result.exports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.year = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const curent = moment().year()
    const labelsLength = 13
    const conditions = [
      {
        $group: {
          _id: {
            curent: { $year: '$createdAt' },
            labels: { $month: '$createdAt' }
          },
          bills: { $sum: 1 },
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
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = imports.find((x) => x._id.labels === i)
        if (item) {
          result.imports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = 1; i < labelsLength; i++) {
        const item = exports.find((x) => x._id.labels === i)
        if (item) {
          result.exports.push({
            curent: item._id.curent,
            labels: item._id.labels,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}

module.exports.fiveYear = async function (req, res, next) {
  try {
    const result = {
      imports: [],
      exports: []
    }
    const labelsLength = moment().year() + 1
    const curent = labelsLength - 5
    const conditions = [
      {
        $group: {
          _id: { $year: '$createdAt' },
          bills: { $sum: 1 },
          products: { $sum: '$products' },
          prices: { $sum: '$prices' },
          quantities: { $sum: '$quantities' }
        }
      },
      // Having
      { $match: { _id: { $gt: curent } } },
      // Sort
      { $sort: { _id: 1 } }
    ]
    // imports
    const imports = await MImports.aggregate(conditions)
    if (imports) {
      for (let i = curent; i < labelsLength; i++) {
        const item = imports.find((x) => x._id === i)
        if (item) {
          result.imports.push({
            curent: item._id,
            labels: item._id,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.imports.push({
            curent: i,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    // exports
    const exports = await MExports.aggregate(conditions)
    if (exports) {
      for (let i = curent; i < labelsLength; i++) {
        const item = exports.find((x) => x._id === i)
        if (item) {
          result.exports.push({
            curent: item._id,
            labels: item._id,
            data: {
              bills: item.bills,
              products: item.products,
              prices: item.prices,
              quantities: item.quantities
            }
          })
        } else {
          result.exports.push({
            curent: i,
            labels: i,
            data: {
              bills: 0,
              products: 0,
              prices: 0,
              quantities: 0
            }
          })
        }
      }
    }
    return res.status(200).json(result)
  } catch (e) {
    console.log(e)
    return res.status(500).send('invalid')
  }
}
