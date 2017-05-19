const
  secret = require('./secret')
;

module.exports = {
  host: 'localhost',
  port: 1338,
  frontUrl: 'http://wheretoeat.pichot.fr',
  apis: {
    slack: {
      verificationToken: secret.slack.verificationToken
    },
    place: {
      baseUrl: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      token: secret.place.token
    },
    streetview: {
      baseUrl: 'https://maps.googleapis.com/maps/api/streetview',
      token: secret.streetview.token
    }
  }
}
