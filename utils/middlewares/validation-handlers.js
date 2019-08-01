const Joi = require('joi')

const validate = (data, schema) => {
  const { error } = Joi.validate(data, schema)
  return error
}

const validationHandler = (schema, check = "body") => (req, res, next) => {
  const error = validate(req[check], schema)
  error ? next(new Error(error)) : next()
}

module.exports = validationHandler