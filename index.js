const express = require('express'),
      path = require('path'),
      bodyParser = require('body-parser'),
      productsRouter = require('./routes/views/products'),
      productsApiRouter = require('./routes/api/products'),
      { config } = require('./config'),
      { logErrors, clientErrorHandler, errorHandler } = require('./utils/middlewares/error-handlers')

// app
const app = express()

// middlewares
app.use(bodyParser.json())

// static files
app.use("/static", express.static(path.join(__dirname, "public")))

// view engine setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "pug")

// routes
app.use('/products', productsRouter)
app.use('/api/products', productsApiRouter)

// redirect
app.get('/', (req, res) => {
    res.redirect('/products')
})

app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

// server
const server = app.listen(config.port, () => {
    console.log(`Listening http://localhost:${server.address().port}`);
})