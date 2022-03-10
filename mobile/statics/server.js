const express = require('express'),
  path = require('path'),
  serveStatic = require('serve-static'),
  history = require('connect-history-api-fallback')

const app = express()
app.use(history())
app.use(serveStatic(path.join(__dirname, 'spa')))
const server = app.listen(process.env.PORT || 5000, function() {
  var port = server.address().port
  console.log('App now running on port', port)
})

// const express = require('express'),
//   path = require('path'),
//   // serveStatic = require('serve-static'),
//   history = require('connect-history-api-fallback')

// const app = express()
// const staticFileMiddleware = express.static(path.join(__dirname + '/spa'))
// app.use(staticFileMiddleware)
// // app.use(serveStatic(__dirname + "/spa"))
// app.use(history({
//   disableDotRule: true,
//   verbose: true
// }))
// app.use(staticFileMiddleware)
// app.get('/', function(req, res) {
//   res.render(path.join(__dirname + '/dist/index.html'))
// })
// const server = app.listen(process.env.PORT || 5000, function() {
//   var port = server.address().port
//   console.log('App now running on port', port)
// })
