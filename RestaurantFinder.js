const
    https = require('https'),
    querystring = require('querystring'),
    config = require('./config')
;

module.exports = class RestaurantFinder {
    constructor() {
    }

    search(location, retrieveImages, callback, pagetoken = null) {
        let params = {
            location: location,
            radius: 300,
            type: 'restaurant',
            opennow: true,
            key: config.apis.place.token
        };
        if (pagetoken) {
            params.pagetoken = pagetoken;
        }

        const url = config.apis.place.baseUrl + '?' + querystring.stringify(params);
        setTimeout(() => {
            https.get(url, (httpsRes) => {
                if (httpsRes.statusCode !== 200) {
                    callback(null, 'bad status code received from place api');
                    return;
                }

                let rawData = '';
                httpsRes.on('data', (chunk) => rawData += chunk);
                httpsRes.on('end', () => {
                    let json = null;

                    try {
                        json = JSON.parse(rawData);
                    } catch(e) {
                        callback(null, 'response received from place api is not correctly json formatted');
                        return;
                    }

                    if (!json.results) {
                        callback(null, 'bad response received from place api');
                        return;
                    }

                    if (json.results.length === 0) {
                        callback([]);
                        return;
                    }

                    let res = [];
                    json.results.forEach((result, index) => {
                        const imageLocation = result.geometry.location.lat + ',' + result.geometry.location.lng;

                        const resFct = (image) => {
                          res.push({
                            name: result.name,
                            image: image
                          });

                          if (index === json.results.length - 1) { // last result
                            if (json.next_page_token) {
                              this.search(location, retrieveImages, (nextRes) => {
                                  callback([...res, ...nextRes]);
                              }, json.next_page_token);
                            } else {
                              callback(res);
                            }
                          }
                        };

                        if (retrieveImages) {
                          this.retrieveImage(imageLocation, (image, errorMsg) => {
                              errorMsg && console.log('Error: ' + errorMsg);
                              image = (image ? image.toString('base64') : image);

                              resFct(image)
                          });
                        } else {
                          resFct(null);
                        }
                    });
                });
            });
        }, 2000);
    }

    retrieveImage(location, callback) {
        let params = {
            size: '200x200',
            location: location,
            key: config.apis.streetview.token
        };

        const url = config.apis.streetview.baseUrl + '?' + querystring.stringify(params);
        https.get(url, (httpsRes) => {
            if (httpsRes.statusCode !== 200) {
                callback(null, 'bad status code received from streetview api');
                return;
            }

            let buf = Buffer.alloc(0);
            httpsRes.on('data', (chunk) => buf = Buffer.concat([buf, Buffer.from(chunk)]));
            httpsRes.on('end', () => {
                callback(buf);
            });
        });
    }
}
