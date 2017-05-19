const
  express           = require('express'),
  bodyParser        = require('body-parser'),
  https             = require('https'),
  url               = require('url'),
  path              = require('path'),
  config            = require('./config'),
  RestaurantFinder  = require('./RestaurantFinder')
;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/images', express.static('images'));

app.post('/eatnow', (req, res) => {
  console.log(req.body);

  if (req.body.token !== config.apis.slack.verificationToken || !req.body.response_url) {
    res.send('Error');
    return;
  }

  const finder = new RestaurantFinder();
  finder.search('48.844749,2.383247', false, (items, err) => {
    if (err) {
      console.log(err);
      return;
    }

    const selected = items[Math.floor(Math.random() * items.length)];
    
    finder.retrieveImage(selected.location, (imageUrl) => {
      const postData = JSON.stringify({
        response_type: 'in_channel',
        attachments: [
          {
            author_name: selected.address,
            author_link: '#', // link to google map
            title: selected.name,
            title_link: '#', // link to restaurant website,
            text: 'Test Test Test',
            image_url: imageUrl,
            footer: 'wheretoeat',
          }
        ]
      });

      const parsedUrl = url.parse(req.body.response_url, true);
      const postRequest = https.request({
        host: parsedUrl.host,
        port: parsedUrl.protocol === 'https:' ? '443' : '80',
        path: parsedUrl.path,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (httpsResponse) => {
        let buffer = '';
        httpsResponse.on('data', (chunk) => buffer += chunk);
        //httpsResponse.on('end', () => console.log('Response: ' + buffer));
      });
      postRequest.write(postData);
      postRequest.end();
    });
  });

  res.send('Searching...');
});

app.listen(config.port, config.host, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://' + config.host + ':' + config.port);
});
