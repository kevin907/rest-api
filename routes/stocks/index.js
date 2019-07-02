const router = require('express').Router()
const _ = require('lodash')


router.delete('/erase', require('./erase'))


module.exports = router
