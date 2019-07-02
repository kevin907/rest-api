const error = require('http-errors')
const serialize = require('../../middlewares/serialize')

async function erase(req, res) {

}

module.exports = [
  serialize(erase),
]
