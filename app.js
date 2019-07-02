const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const routes = require('./routes')

const app = express()

app.enable('trust proxy')

app
  .use(cors({
    maxAge: 30 * 24 * 3600 * 1000,
  }))
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json({limit: '5MB'}))
  .use(routes)

module.exports = app