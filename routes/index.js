const router = require('express').Router()
const db = require('../middlewares/db')

router.get('/', (req, res)=> res.json({status: 'ok'}))
router.get('/ping', (req, res)=> res.json({status: 'ok'}))

router.use(db())

router.use('/stocks', require('./stocks'))

module.exports = router
