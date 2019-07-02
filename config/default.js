module.exports = {
  port: 3080,
  stage: process.env.STAGE || process.env.NODE_ENV || 'development',
  databases: {
    core: process.env.CORE_DATABASE_URL || 'postgres://localhost/stocks',
  },
}
