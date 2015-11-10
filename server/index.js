var path = require('path');
var express = require('express');
var app = express();
var request = require('request');
var async = require('async');
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mustacheExpress = require('mustache-express');
var gh = require('gh-scrape');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url); // connect to our database

require('./config/passport.js')(passport);

/*
/////////////////////////////////////
//           MIDDLEWARE            //
/////////////////////////////////////
*/
// Setting up Mustache 
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', path.join(__dirname, 'views'));

app.set('port', (process.env.PORT || 3000));
app.use(morgan('dev'));
app.use(express.static('./public'));
app.use(cookieParser());
app.use(bodyParser.json());;
app.use(session({ 
    secret: 'iloveketchup',
    resave: false,
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

/*
//////////////////////////////////////
//              ROUTES              //
//////////////////////////////////////
*/
require('./routes.js')(app, request, async, passport);

app.listen(app.get('port'), function() {
    console.log("listening on port: " + app.get('port'));
});
