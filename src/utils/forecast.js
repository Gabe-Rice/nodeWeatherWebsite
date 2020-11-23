const request = require('postman-request');

const forecast = (lat, long, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=1247792cc33d7752170ba8df4a8f6f1d&query=' + lat + ',' + long + '&units=f';

    //Destructured response to just use body instead of: 
    // (err, response) then response.body.current,etc.
    request({ url, json: true }, (err, {body}) => {
        if (err) {
            callback('Unable to connect to weather service!', undefined);
        } else if (body.error) {
            callback('Unable to find location.', undefined);
        } else {
            callback(undefined, body.current.weather_descriptions + ' and currently ' + body.current.temperature + ' degrees out. It feels like ' + body.current.feelslike + '. There is a ' + body.current.precip + '% chance of rain with ' + body.current.humidity + '% humidity.');
        }
    })
}

module.exports = forecast;