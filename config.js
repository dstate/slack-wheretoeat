const
  secret = require('./secret')
;

module.exports = {
  host: 'localhost',
  port: 1338,
  secret: secret,
  apis: {
    place: {
      baseUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
    },
    streetview: {
      baseUrl: 'https://maps.googleapis.com/maps/api/streetview'
    }
  }
}
