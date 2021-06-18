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
            curent: { $dayOfMonth: '$created_at' },
            labels: {
              $hour: {
                date: '$created_at',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
              }
            }
          },
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
            curent: { $isoWeek: '$created_at' },
            labels: { $isoDayOfWeek: '$created_at' }
          },
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
            curent: { $month: '$created_at' },
            labels: { $dayOfMonth: '$created_at' }
          },
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
          total_product: 1,
          total_price: 1,
          total_quantity: 1,
          year: { $year: '$created_at' },
          quarter: {
            $trunc: {
              $add: [
                {
                  $divide: [
                    {
                      $subtract: [
                        {
                          $month: '$created_at'
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
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
            curent: { $year: '$created_at' },
            labels: { $month: '$created_at' }
          },
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: curent,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
          _id: { $year: '$created_at' },
          total_bill: { $sum: 1 },
          total_product: { $sum: '$total_product' },
          total_price: { $sum: '$total_price' },
          total_quantity: { $sum: '$total_quantity' }
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.imports.push({
            curent: i,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
              total_bill: item.total_bill,
              total_product: item.total_product,
              total_price: item.total_price,
              total_quantity: item.total_quantity
            }
          })
        } else {
          result.exports.push({
            curent: i,
            labels: i,
            data: {
              total_bill: 0,
              total_product: 0,
              total_price: 0,
              total_quantity: 0
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
