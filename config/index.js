const config = require('config-node')

let defaults = config({ env: 'default', dir: __dirname })

module.exports = config({
  env: process.env.NODE_ENV || 'development',
  dir: __dirname,
})
