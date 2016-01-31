/*
///////////////////////////////////
//      Import Libraries        ///
///////////////////////////////////
*/
var path = require('path'),
    express = require('express'),
    app = express(),
    request = require('request'),
    async = require('async'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mustacheExpress = require('mustache-express'),
    gh = require('gh-scrape');

/*
/////////////////////////////////////
//          Set up DB              //
/////////////////////////////////////
*/
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database
require('./config/passport.js')(passport);

/*
/////////////////////////////////////
//           MIDDLEWARE            //
/////////////////////////////////////
*/
// Setting up Mustache Rendering
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
