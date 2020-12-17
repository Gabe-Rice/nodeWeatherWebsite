const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000; //set port for heroku or local

// Define paths for express config
const publicDirPath = path.join(__dirname, '../public'); //Get to "public" folder
const viewsPath = path.join(__dirname, '../templates/views'); 
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirPath)); //To serve static files, images, css, etc etc

// Route handlers:
app.get('', (req, res) => {
    res.render('index', {  //Allows to render "views", like hbs template
        title: 'Weather',
        name: 'Gabe Rice'
    });  
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Gabe Rice'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Gabe Rice',
        helpMsg: 'Simply type a city, zip code, address, or geographical coordinates.'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide a location!'
        })
    }
                                                // use = {} to set as default
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({error});
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({error});
            }
    
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            });
        })
    })
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({ // must return so not res twice
            error: 'You must provide a search term!'
        })
    }

    console.log(req.query.search);
    res.send ({
        products: []
    })
})

// 404 help menu error
app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help Page',
        name: 'Gabe Rice',
        error404: 'Help article not found.'
    })
})

// 404 wildcard error
app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Gabe Rice',
        error404: 'Page not found.'
    })
})

//Server
app.listen(port, () => {
    console.log('Server is up on port ' + port);
})