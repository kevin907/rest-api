const env = require('../config').environment
const dev = env === 'development' || process.env.DEBUG === 'true'

module.exports = function(cb) {
  return async function(req, res, next) {
    try {
      /* istanbul ignore if */
      if(dev) console.time(req.url)
      const resp = await cb(req, res, next)      
      res.json(resp)
    } catch (err) {
      /* istanbul ignore if */
      next(err)
    } finally {
      /* istanbul ignore if */
      if(dev) console.timeEnd(req.url)
    }
  }
}
