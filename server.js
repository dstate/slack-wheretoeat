const
  express           = require('express'),
  config            = require('./config'),
  RestaurantFinder  = require('./RestaurantFinder')
;

const app = express();

app.post('/eatnow', (req, res) => {
  console.log(req.query);
});

app.listen(config.port, config.host, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://' + config.host + ':' + config.port);
});
