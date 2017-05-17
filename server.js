const
  express           = require('express'),
  bodyParser       = require('body-parser'),
  config            = require('./config'),
  RestaurantFinder  = require('./RestaurantFinder')
;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/eatnow', (req, res) => {
  console.log(req.body);
  res.json({success: 'true'});
});

app.listen(config.port, config.host, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://' + config.host + ':' + config.port);
});
