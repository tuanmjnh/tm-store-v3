// prototypes
require('./utils/prototypes')
// config
process.env.ROOT_PATH = __dirname
require('./config')

const express = require('express'),
  bodyParser = require('body-parser'),
  // cors = require('cors'),
  session = require('express-session'),
  flash = require('express-flash'),
  compression = require('compression'),
  // lusca = require('lusca'),
  router = require('./router'),
  mongoose = require('./services/mongoose'),
  middleware = require('./services/middleware'),
  packageData = require(process.env.PACKAGE)

// console.log(process.env.ROOT_PATH)
// if (process.env.NODE_ENV.toString() === 'development') dotenv.config({ path: '.env.development' })
// else dotenv.config({ path: '.env' })

// if (process.env.NODE_ENV !== 'production') {
//   process.env.BASE_URL = '/'
// }
// Connection MongoDB
mongoose.initialize()
// app express
const app = express()
// trust proxy ip
app.set('trust proxy', true)
// static public
// app.use(express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 }))
// app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(`${process.env.BASE_URL}${process.env.PUBLIC_PATH}`, express.static(process.env.PUBLIC_DIR))
app.use(`${process.env.BASE_URL}${process.env.STATIC_PATH}`, express.static(process.env.STATIC_DIR))
app.use(`${process.env.BASE_URL}${process.env.UPLOAD_PATH}`, express.static(process.env.UPLOAD_DIR))
// bodyParser
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
// CORS middleware
// app.use(cors())
// app.options('*', cors())
// compression
app.use(compression())
// secret variable
app.set('secret', process.env.SECRET)
// session
// app.use(express.session({ cookie: { maxAge: 60000 } }))
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET
    // store: new MongoStore({
    //   url: mongoUrl,
    //   autoReconnect: true
    // })
  })
)
// flash
app.use(flash())
// lusca
// app.use(lusca.xframe('SAMEORIGIN'))
// app.use(lusca.xssProtection(true))
// app.use((req, res, next) => {
//   res.locals.user = req.user
//   next()
// })
// Error Handler. Provides full stack - remove for production
// if (process.env.NODE_ENV !== 'production') {
//   const errorHandler = require('errorHandler')
//   app.use(errorHandler())
// }

// middleware JWT
app.use(middleware.verify)
/**
 * Primary app routes.
 */
/* GET home page. */
app.get(process.env.BASE_URL, function (req, res, next) {
  // res.render('index', { title: 'Express' })
  // var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl
  // res.end('TM-Store Express Server api', { title: 'Express' })
  res.end(`TM-Store Express Server api. version: ${packageData.version}`) // process.env.npm_package_version
})
// Mount the router at /api so all its routes start with /api
app.use(`${process.env.BASE_URL}api`, router)

// listen
app
  .listen(process.env.PORT) //, '192.168.1.10' // '127.0.0.1'
  .on('listening', () => {
    // process.env.HOST = `http://${server.address().address}:${port}`
    console.log(`Web server listening on: http://127.0.0.1:${process.env.PORT}`)
    console.log(`Mode: ${process.env.NODE_ENV}`)
    console.log(`Base URL: ${process.env.BASE_URL}`)
  })
  .on('error', (err) => {
    console.log(err)
  })

// const a = [
//   {
//     _id: '61f25f7a439e7e9b60ee4c96',
//     categories: ['6125b5d69b2efc2d4c4befe1', '612c8dc594b6cc2da8c47d06'],
//     category: 'Hanvico',
//     subCategory: 'Bộ',
//     code: 'HVC-BO-BSM66-200220',
//     title: 'Bộ Hanvico HVC-BO-BSM66-200220',
//     price: 7060000,
//     priceOld: 7060000,
//     priceExport: 7060000,
//     priceDiscount: 0,
//     quantity: 10,
//     quantityOld: 1,
//     quantityStore: 10,
//     priceUnit: 'vnd',
//     priceUnitName: 'vnđ',
//     unit: 'cai',
//     unitName: 'Cái',
//     amount: 0
//   },
//   {
//     _id: '61f25f7a439e7e9b60ee4c9c',
//     categories: ['6125b5d69b2efc2d4c4befe1', '612c8dc594b6cc2da8c47d06'],
//     category: 'Hanvico',
//     subCategory: 'Bộ',
//     code: 'HVC-BO-BSM72-200220',
//     title: 'Bộ Hanvico HVC-BO-BSM72-200220',
//     price: 6550000,
//     priceOld: 6550000,
//     priceExport: 6550000,
//     priceDiscount: 0,
//     quantity: 2,
//     quantityOld: 1,
//     quantityStore: 4,
//     priceUnit: 'vnd',
//     priceUnitName: 'vnđ',
//     unit: 'cai',
//     unitName: 'Cái',
//     amount: 0
//   }
// ]
// const b = a.map(x => x.priceExport * x.quantity).sum()
// console.log(b)