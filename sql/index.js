const Promise = require('bluebird')
const readFileAsync = Promise.promisify(require('fs').readFile)
const path = require('path')
const _ = require('lodash')
const {highlight} = require('cli-highlight')
const log = require('debug')('sql')
const schema = require('../db/schema')

const dev = process.env.NODE_ENV != 'production'
const rex = /\/\*([\s\S]*?)\*\//gm

let cache = {}

const fetchFile = async function(fileName) {
  if(cache[fileName]) return cache[fileName]
  const filePath = path.resolve(__dirname, fileName)
  const content = _.template(await readFileAsync(filePath, 'utf8'))(schema)
  if(!dev) cache[fileName] = content
  return content
}

module.exports = Promise.coroutine(function*(knex, qpath, args = {}, cb) {
  let qstring = yield fetchFile(`./${qpath}.sql`)

  if(dev) {
    const pretty = highlight(qstring, {
      language: 'sql',
      ignoreIllegals: false,
    })
    log(pretty)
  }
  if(typeof cb === 'function') qstring = cb(qstring)

  qstring = qstring.replace(/\/\*[\s\S]*?\*\//gm, '')

  if(args.sql) return qstring

  if(dev) console.time(qpath)

  var query = knex.raw(qstring, args)

  return query.then(result => {
    if(dev) console.timeEnd(qpath)
    return result.rows
  }).catch(err => {
    err.qpath = qpath
    if(dev) {
      console.error('Failed query: ' + qpath)
      console.error(err)
    }
    throw err
  })
})

module.exports.enable = function(qstring, attr, insert = {}) {
  return qstring.replace(rex, (comment, match) => {
    var pipeIndex = match.indexOf('|')
    if(pipeIndex < 0) return comment
    if(!~match.indexOf(attr)) return comment
    var keys = match.slice(0, pipeIndex).split(',').map(w => w.trim())
    if(!~keys.indexOf(attr)) return comment
    var value = match.slice(pipeIndex + 1)
    for(var key of Object.keys(insert)) {
      const search = new RegExp(`\\|${key}\\|`)
      value = value.replace(search, insert[key])
    }
    return value
  })
}
