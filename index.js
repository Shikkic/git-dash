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

app.get('/', function(req, res) {
    res.sendfile('./public/index.html');
});

app.get('/git', function(req, res) {
    var name = req.query.name;
    var gitUrl = "https://api.github.com/users/"+ name +"/events?access_token="+ght;
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
        //console.log(data[count]);
    });
});

app.get('/geet', function(req, res) {
    var name = req.query.name;
    var gitUrl = 'https://api.github.com/users/'+ name +"/following?access_token="+ght;
    console.log("GitURL "+gitUrl);
    var options = {
        url: gitUrl,
        headers: {
            'User-Agent': name
        }
    };
    
    request.get(options, function(error, response, body) {
        if(!error) {
            var data = JSON.parse(body);
            var names = [];
            for (i in data) {
                names.push(data[i].login);
            }
            console.log(names);
            var count = 0;
            console.log(names.length);
            async.times(names.length, function(_, next) {
                var gitUrl = 'https://api.github.com/users/'+names[count]+'/events?access_token='+ght;
                var options = {
                    url: gitUrl,
                    headers: {
                        'User-Agent': name
                    } 
                };
                console.log("count = "+ count);
                console.log(names[count]);
                count++;
                request.get(options, function(error, response, body) {
                    var data = JSON.parse(body);
                    //console.log(response);
                    var count2 = 0;
                    var found = false;
                    //console.log(response);
                    while(found != true && count2 < data.length) {
                        console.log("data " + data[count2].type);
                        if(data[count2].type == "PushEvent") {
                            found = true;
                            break;
                        }
                        count2++;
                    }
                    console.log(data[count2]);
                    return next(error, data[count2]);
                });
            }, function(err, results) {
                res.send(results);
            });
        }
    });
    

});

app.listen(app.get('port'), function() {
    console.log("listening on port: " + app.get('port'));
});



