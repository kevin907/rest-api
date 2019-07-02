const Joi = require('joi')

module.exports = function(schema) {
  validate.schema = schema
  function validate(req, res, next) {
    var validation = schema
    var data = Object.assign({}, req.body, req.query, req.params)
    Joi.validate(data, validation, {stripUnknown: {objects: true}}, (err, value) => {
      if(err) {
        const [ error ] = err.details
        const namespace = ['@validation', 'error']
        return res
          .status(422)
          .json({
            message: namespace.concat(error.path).concat(error.type).join('.'),
            details: error.context,
            error: error.message,
          })
      }
      req.joi = value
      return next()
    })
  }
  return validate
}
