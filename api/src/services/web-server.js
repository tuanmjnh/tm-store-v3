const http = require('http');
const express = require('express');
// const path = require('path');
const compression = require('compression'); // compresses requests
const session = require('express-session');
const bodyParser = require('body-parser');
// import logger from '../util/logger';
const lusca = require('lusca');
const dotenv = require('dotenv');
// import mongo from 'connect-mongo';
const flash = require('express-flash');
const cors = require('cors');
// const expressValidator = require('express-validator');
// import bluebird from 'bluebird';
const router = require('./router');
const webServerConfig = require('../config/web-server');
// const secrets = require('../util/secrets');

// const MongoStore = mongo(session);

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

let httpServer;

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    // Controllers (route handlers)
    // import * as homeController from '../controllers/home';
    // import * as userController from './controllers/user';
    // import * as apiController from './controllers/api';
    // import * as contactController from './controllers/contact';

    // API keys and Passport configuration
    // import * as passportConfig from './config/passport';

    // Create Express server
    const app = express();
    httpServer = http.createServer(app);
    // // Connect to MongoDB
    // const mongoUrl = MONGODB_URI;
    // (<any>mongoose).Promise = bluebird;
    // mongoose.connect(mongoUrl).then(
    //   () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
    // ).catch(err => {
    //   console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
    //   // process.exit();
    // });

    // Express configuration
    // console.log(process.env.PORT)
    // app.set('port', process.env.PORT || 8000);
    // app.set('views', path.join(__dirname, '../../views'));
    // app.set('view engine', 'pug');
    // CORS middleware
    app.use(cors());
    app.options('*', cors());
    app.use(compression());
    /*
    * Error Handler. Provides full stack - remove for production
    */
    if (process.env.NODE_ENV !== 'production') {
      const errorHandler = require('errorHandler');
      app.use(errorHandler());
    }
    // secret variable
    app.set('superSecret', webServerConfig.secret);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    // app.use(expressValidator);
    app.use(session({
      resave: true,
      saveUninitialized: true,
      secret: webServerConfig.secret
      // store: new MongoStore({
      //   url: mongoUrl,
      //   autoReconnect: true
      // })
    }));
    // app.use(passport.initialize());
    // app.use(passport.session());
    app.use(flash());
    app.use(lusca.xframe('SAMEORIGIN'));
    app.use(lusca.xssProtection(true));
    app.use((req, res, next) => {
      res.locals.user = req.user;
      next();
    });

    app.use(
      express.static(process.env.PUBLIC_PATH, { maxAge: 31557600000 })
    );

    /**
     * Primary app routes.
     */
    /* GET home page. */
    app.get(process.env.BASE_URL, function (req, res, next) {
      // res.render('index', { title: 'Express' });
      res.end('TM-Store Express Server api', { title: 'Express' });
    });
    // Mount the router at /api so all its routes start with /api
    app.use(`${process.env.BASE_URL}api`, router);

    httpServer
      .listen(process.env.PORT)
      .on('listening', () => {
        console.log(`Web server listening on http://localhost:${process.env.PORT}`);
        resolve();
      })
      .on('error', (err) => { reject(err); });
  });
}

module.exports.close = function () {
  return new Promise((resolve, reject) => {
    httpServer.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

const iso8601RegExp = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/;

module.exports.reviveJson = function (key, value) {
  // revive ISO 8601 date strings to instances of Date
  if (typeof value === 'string' && iso8601RegExp.test(value)) {
    return new Date(value);
  } else {
    return value;
  }
}

// export default app;
