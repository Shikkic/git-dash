var express = require('express');
var app = express();
var request = require('request');
var async = require('async');
app.set('port', (process.env.PORT || 3000));
app.use(express.static('./public'));

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
            var count = 0;
            var found = false;

            while(found != true && count < data.length) {
                console.log(data[count].type);
                if(data[count].type == "PushEvent") {
                    found = true;
                    break;
                }
                count++;
            }
            
            res.send(data[count]);
        }
        console.log(response);
    });
});

app.listen(app.get('port'), function() {
    console.log("listening on port: " + app.get('port'));
});


