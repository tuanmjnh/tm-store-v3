// const path = require('path')
// dotenv = require('dotenv')

// dotenv
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toString()}` })
// process.env.NODE_ENV = process.env.NODE_ENV || 'production'
process.env.PUBLIC_PATH = 'public'
process.env.STATIC_PATH = 'static'
process.env.UPLOAD_PATH = 'uploads'
if (process.env.NODE_ENV && process.env.NODE_ENV.toString().trim() === 'development') {
  // dotenv.config({ path: '.env.development' })
  process.env.PORT = 8080
  process.env.BASE_URL = '/'
  process.env.MONGODB = 'mongodb://localhost:27017/tm-store' //+ '?replicaSet=rs0'
  // secret variable
  process.env.SECRET = '03890a36-8888-45fe-8aa4-efb24469afb0'
  // package
  // process.env.PACKAGE = '../package.json'
} else {
  process.env.PORT = 8080
  process.env.BASE_URL = '/'
  process.env.MONGODB = 'mongodb+srv://tuanmjnh:sWeirDXzqysxirxH@cluster0-sb5wt.gcp.mongodb.net/tm-store?retryWrites=true&w=majority'
  // secret variable
  process.env.SECRET = '03890a36-8888-45fe-8aa4-efb24469afb0'
  // package
  // process.env.PACKAGE = './package.json'
  // dotenv.config({ path: '.env' })
}
// Root path
process.env.PUBLIC_DIR = `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}` // path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH)
process.env.STATIC_DIR = `${process.env.PUBLIC_DIR}/${process.env.STATIC_PATH}` // path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH)
process.env.UPLOAD_DIR = `${process.env.PUBLIC_DIR}/${process.env.UPLOAD_PATH}` // path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH)
process.env.PORT = process.env.PORT || 8080

// console.log(process.env.PUBLIC_DIR)
// console.log(process.env.STATIC_DIR)
// console.log(process.env.UPLOAD_DIR)
