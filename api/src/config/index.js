const path = require('path'),
  dotenv = require('dotenv');

// dotenv
// dotenv.config({ path: `.env.${process.env.NODE_ENV.toString()}` });
// process.env.NODE_ENV = process.env.NODE_ENV || 'production';
if (process.env.NODE_ENV && process.env.NODE_ENV.toString().trim() === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  dotenv.config({ path: '.env' });
}
// Root path
process.env.PUBLIC_DIR = path.join(process.env.ROOT_PATH, process.env.PUBLIC_PATH); // `${process.env.ROOT_PATH}/${process.env.PUBLIC_PATH}`
process.env.STATIC_DIR = path.join(process.env.PUBLIC_DIR, process.env.STATIC_PATH);
process.env.UPLOAD_DIR = path.join(process.env.PUBLIC_DIR, process.env.UPLOAD_PATH);
process.env.PORT = process.env.PORT || 8001;
