const app = require('./app')
const config = require('./config')

app.listen(config.port, () => {
  console.log(`Listening on ${config.port}`)
})
