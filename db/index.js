const DB = require('knex')

const config = require('../config')

let cache = {}

function connect(name) {
  if(!cache[name]) {
    cache[name] = DB({
      client: 'pg',
      connection: config.databases[name],
    })
  }
  return cache[name]
}

connect.core    = connect('core')

module.exports  = connect
