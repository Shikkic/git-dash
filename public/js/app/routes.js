module.exports = function(app, request, async, ght, passport) {
    
    ///////////////////////////////////////////
    ///      Default landing page / login   ///
    ///////////////////////////////////////////
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html');
    });

    //////////////////////////////////////////
    ///             LOGIN                  ///
    //////////////////////////////////////////
    app.get('/auth/github', passport.authenticate('github', {
        successRedirect : '/app', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
    }));

    /////////////////////////////////////////
    ///             CALL BACK             ///
    /////////////////////////////////////////

    app.get('/auth/github/callback', passport.authenticate('github', {
        successRedirect : '/app',
        failureRedirect : '/'
    }));

    //////////////////////////////////////////
    ///             LOGOUT                 ///
    //////////////////////////////////////////
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
  
    ///////////////////////////////////////////
    ///               APP                   ///
    ///////////////////////////////////////////    
    app.get('/app', isLoggedIn, function(req, res) {
        res.sendfile('./public/app.html');
    });

    /////////////////////////////////////
    ///  Returns a single user's info ///
    /////////////////////////////////////
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

    ///////////////////////////////////////
    /// Returns info of users following ///
    ///////////////////////////////////////
    app.get('/geet', function(req, res) {
        console.log("MADE IT TO GEET");
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
                // To loop through array of names
                var count = 0;
                async.times(names.length, function(_, next) {
                    var gitUrl = 'https://api.github.com/users/'+names[count]+'/events?access_token='+ght;
                    var options = {
                        url: gitUrl,
                        headers: {
                            'User-Agent': name
                        } 
                    };
                    count++;
                    request.get(options, function(error, response, body) {
                        var data = JSON.parse(body);
                        var pushEventNum = findPush(data);
                        var watchEventNum = findWatch(data); 

                        var pushEvent = data[pushEventNum];
                        var watchEventNum = data[watchEventNum];
                        return next(error, ({pushEvents: pushEvent, watchEvents: watchEventNum}));
                    });
                }, function(err, results) {
                    res.send(results);
                });
            }
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    };

    function findPush(data) {
        var count = 0;
        var found = false;
        while(found != true && count < data.length) {
            if(data[count].type == "PushEvent") {
                found = true;
                break;
            }
            count++;
        }
        return count;
    };
   
    function findWatch(data) {
        var count = 0;
        var found = false;
        while(found != true && count < data.length) {
            if(data[count].type == "WatchEvent") {
                found = true;
                break;
            }
            count++;
        }
        return count;
    };

};
