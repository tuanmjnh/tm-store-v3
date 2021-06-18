const webServer = require('./services/web-server.js')
// const oracleDB = require('./services/oracle.js')
// const oracleConfig = require('./config/oracle.js')
const defaultThreadPoolSize = 4
// const path = require('path')
process.env.ROOT = __dirname // Root path

if (process.env.NODE_ENV !== 'production') {
  process.env.BASE_URL = '/'
}

// Increase thread pool size by poolMax
// process.env.UV_THREADPOOL_SIZE = oracleConfig.dulieubkn.poolMax + defaultThreadPoolSize

/**
 * Start Express server.
 */
async function startup () {
  console.log('Starting application')

  try {
    console.log('Initializing database module')

    // await oracleDB.initialize()
  } catch (err) {
    console.error(err)

    process.exit(1) // Non-zero failure code
  }

  try {
    console.log('Initializing web server module')

    await webServer.initialize()
  } catch (err) {
    console.error(err)

    process.exit(1) // Non-zero failure code
  }
}

startup()

async function shutdown (e) {
  let err = e

  console.log('Shutting down application')

  try {
    console.log('Closing web server module')

    await webServer.close()
  } catch (e) {
    console.error(e)

    err = err || e
  }

  try {
    console.log('Closing database oracle module')

    // await oracleDB.closePool()
  } catch (e) {
    console.error(e)

    err = err || e
  }

  console.log('Exiting process')

  if (err) {
    process.exit(1) // Non-zero failure code
  } else {
    process.exit(0)
  }
}

process.on('SIGTERM', () => {
  console.log('Received SIGTERM')

  shutdown(undefined)
})

process.on('SIGINT', () => {
  console.log('Received SIGINT')

  shutdown(undefined)
})

process.on('uncaughtException', err => {
  console.log('Uncaught exception')
  console.error(err)

  shutdown(err)
})

// const server = app.listen(app.get('port'), () => {
//   console.log(
//     '  App is running at http://localhost:%d in %s mode',
//     app.get('port'),
//     app.get('env')
//   )
//   console.log('  Press CTRL-C to stop\n')
// })

// export default server
