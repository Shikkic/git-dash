var express = require('express');
var app = express();
var request = require('request');

var morgan = require('morgan');

//Middleware
app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.get('/git', function(req, res) {
    var name = req.query.name;
    var gitUrl = "https://api.github.com/users/"+ name +"/events"
    var options = {
        url: gitUrl,
        headers: {
            'User-Agent': name
        }
    };
    
    request.get(options,  function(error, response, body){
        if(!error) {
            var data = JSON.parse(body);
            console.log("made it");
            res.send(data);
        }
    });
});

app.listen(3000, function() {
    console.log("listening on port: " + 3000);
});
