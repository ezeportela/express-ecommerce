const Sentry = require('@sentry/node')
const { config } = require('../../config')

const { sentryDns, sentryId } = config 
Sentry.init({ dsn: `https://${sentryDns}@sentry.io/${sentryId}` });

const logErrors = (err, req, res, next) => {
  Sentry.captureException(err)
  console.log(err.stack)
  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).json({ err: err.message })
  } else {
    next(err)  
  }
}

const errorHandler = (err, req, res, next) => {
  if (req.headersSent) {
    next(err)
  }

  if (!config.dev) {
    delete error.stack
  }

  res.status(err.status || 500)
  res.render('error', { error: err })
}

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler,
}