const
  express           = require('express'),
  config            = require('./config'),
  RestaurantFinder  = require('./RestaurantFinder')
;

const app = express();

app.post('/eatnow', (req, res) => {
  console.log(req.query);
});

app.listen()
