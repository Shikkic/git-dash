var express = require('express');
var app = express();
var request = require('request');
var async = require('async');
var ght = process.env.GITHUB_API_TOKEN;
console.log("GHT="+ght);
app.set('port', (process.env.PORT || 3000));
app.use(express.static('./public'));

var morgan = require('morgan');

//Middleware
app.use(morgan('dev'));

/*
//////////////////////////////////////
//              ROUTES              //
//////////////////////////////////////
*/

require('./public/js/app/routes.js')(app, request, async, ght);

app.listen(app.get('port'), function() {
    console.log("listening on port: " + app.get('port'));
});



