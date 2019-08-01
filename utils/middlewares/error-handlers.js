const boom = require('boom')
const Sentry = require('@sentry/node')
const { config } = require('../../config')
const isRequestAjaxOrApi = require('../request-ajax-api.js')

const { sentryDns, sentryId } = config 

if(sentryDns && sentryId)
  Sentry.init({ dsn: `https://${sentryDns}@sentry.io/${sentryId}` });

const withErrorStack = (err, stack) => {
  if(config.dev) {
    return { ...err, stack }
  }
}

const logErrors = (err, req, res, next) => {
  Sentry.captureException(err)
  console.log(err.stack)
  next(err)
}

const wrapErrors = (err, req, res, next) => {
  if (!err.isBoom) {
    next(boom.badImplementation(err))
  }

  next(err)
}

const clientErrorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err

  // catch errors for AJAX request or if an error ocurrs while streaming
  if (isRequestAjaxOrApi(req) || res.headersSent) {
    res.status(statusCode).json(withErrorStack(payload, err.stack))
  } else {
    next(err)
  }
}

const errorHandler = (err, req, res, next) => {
  const {
    output: { statusCode, payload }
  } = err

  res.status(statusCode)
  res.render('error', withErrorStack(payload, err.stack))
}

module.exports = {
  logErrors,
  wrapErrors,
  clientErrorHandler,
  errorHandler,
}