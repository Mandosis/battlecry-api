module.exports = {
  port: process.env.PORT || 4567,
  mongoURL: 'mongodb://localhost/battlecry-api',
  secret: process.env.SECRET || 'secret' // Change or set environment variable for production!
}
