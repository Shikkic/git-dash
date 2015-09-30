var path = require('path');
var fs = require('fs');
var gh = require('gh-scrape');
var moment = require('moment');
var LOGIN_PAGE = path.join(__dirname, '..', 'public', 'pages', 'login.html');

module.exports = function(app, request, async, passport) {
    
    // TEST TODO might need to remove this code?
    app.get('/lol', function(req, res) { 
        var name = req.user.github.username;
        var userToken = req.user.github.token;
        getFriendsList(name, userToken, function(names) {
            userData(name, names, userToken, function(results) {
                console.log(results);
                res.render('login', {data: results});
            });
        });
    });

    ///////////////////////////////////////////
    ///      Default landing page / login   ///
    ///////////////////////////////////////////
    app.get('/', isLoggedIn, function(req, res) {
        //res.sendfile('./public/pages/app.html');
        //res.render('app', {lol: 'hey'});
        var name = req.user.github.username;
        var userToken = req.user.github.token;
        // Grabs Friends List, returns array of names
        getFriendsList(name, userToken, function(names) {
            // Retrieves Data For Each Friend
            userData(names, names, userToken, function(results) {
                var data = {data: createModels(results)};
                res.render('app', data);
            });
        });
    });

    //////////////////////////////////////////
    ///             AUTHENTICATION         ///
    //////////////////////////////////////////
    app.get('/auth/github', passport.authenticate('github', { scope: ['user:email']}));

    /////////////////////////////////////////
    ///             CALL BACK             ///
    /////////////////////////////////////////

    app.get('/auth/github/callback', 
        passport.authenticate('github', { failureRedirect : '/'}),
        function(req, res) {
            res.redirect('/');  
    });
    
    //////////////////////////////////////////
    ///             LOGOUT                 ///
    //////////////////////////////////////////
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
  
    ///////////////////////////////////////////
    ///             LOGIN                   ///
    ///////////////////////////////////////////    
    app.get('/login',  function(req, res) {
        res.status(200).set('Content-Type', 'text/html').sendFile(LOGIN_PAGE);
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
        getRequest(gitUrl, options, 1, function(gitObj) {
            res.send(gitObj);
        });
    });

    ///////////////////////////////////////
    /// Returns info of users following ///
    ///////////////////////////////////////
    app.get('/geet', isLoggedIn, function(req, res) {
        var name = req.user.github.username;
        var userToken = req.user.github.token;
        getFriendsList(name, userToken, function(names) {
            var names = names;
            getFriendsEventData(name, userToken, names, function(data){
                console.log("THIS IS DATA ",data);
                getFriendsProfileData(name, names, function(results){
                    console.log("THIS IS FINAL RESULT ",results);
                    res.send(results);
                });
                //res.send(data);
            });
        });
    });


    function getFriendsEventData(name, userToken, friendsList, callback) {
        var count = 0; 
        async.times(friendsList.length, function(_, next) {
            var gitUrl = 'https://api.github.com/users/'+friendsList[count]+'/events?access_token='+userToken;
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
            callback(results);
        }); 
    };

    function getFriendsProfileData(name, friendsList, callback) {
        var count = 0; 
        async.times(friendsList.length, function(_, next) { 
            console.log("Scraping commensing");
            console.log("FRIENDS NAME = ", friendsList[count]);
            var name = friendsList[count];
            count++;
            getRequest2("https://github.com/"+friendsList[count], function(html) {
                console.log("running process");
                scrapeCon(html, function(body) {
                    var data = body;
                    console.log(body);
                    var total = data.total;
                    var longestStreak = data.longestStreak;
                    var currentStreak = data.currentStreak;
                    console.log(total, "+", longestStreak, "+", currentStreak);

                    return next(_, ({totals: total, longestStreaks: longestStreak, currentStreaks: currentStreak}));
                });
            });
        }, function(err, results) {
            console.log("This is the end of the async = ", results);
            callback(results);
        });       
    };

    function createModels(data) {
        var userArray = [];
        for(var i in data) {
            if(data[i].pushEvents ) {
                var gitUser = {
                    imgUrl: data[i].pushEvents.actor.avatar_url,
                    user: data[i].pushEvents.actor.login,
                    userID: data[i].pushEvents.actor.login.toLowerCase(),
                    repoName: data[i].pushEvents.repo.name,
                    commitMsg: data[i].pushEvents.payload.commits[0].message,
                    commitSha: data[i].pushEvents.payload.commits[0].sha.slice(0,5),
                    commitUrl: 'http://github.com/'+data[i].pushEvents.repo.name+'/commit/'+data[i].pushEvents.payload.commits[0].sha,
                    date: "Last pushed "+moment(data[i].pushEvents.created_at).fromNow(),
                    dateString: data[i].pushEvents.created_at
                };
                if(data[i].watchEvents) {
                    gitUser.watch = data[i].watchEvents.repo.name;
                    gitUser.watchUrl = 'http://www.github.com/'+data[i].watchEvents.repo.name;
                };
                userArray.push(gitUser);
            }
        }
        return userArray;
    };
    
    function userData(name, names, userToken, callback) {
        var count = 0; 
        async.times(names.length, function(_, next) {
            var gitUrl = 'https://api.github.com/users/'+names[count]+'/events?access_token='+userToken;
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
            //console.log(results);
            callback(results);
        });
    };

    function getFriendsList(name, userToken, callback) {
        var page = 1;
        var done = false;
        var names = [];
        async.whilst(
            function () { return done === false },
            function (next) {
                var gitUrl = 'https://api.github.com/users/'+ name +"/following?access_token="+userToken+'&page='+page;
                var options = {
                    url: gitUrl,
                    headers: {
                        'User-Agent': name
                    }
                };
                request.get(options, function(error, response, body) {
                    var data = JSON.parse(body);
                    for (i in data) {
                        names.push(data[i].login);
                    }
                    if (data.length > 0) {
                        console.log("Data is NOT empty");
                        page++;
                        
                    } else {
                        done = true;
                    }
                        return next(error, ({friends: names}));
                });
            },
            function (err) {
                callback(names);
            }); 
    };

    function getRequest(url, options, page, callback) {
        request.get(options,  function(error, response, body){
            if(!error) {
                var data = JSON.parse(body);
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
                callback(data[count]); 
            }
            return Error;
        });
    };

    function getRequest2(gitUrl, callback) {
    var options = {
        url: gitUrl
    };
    request.get(options, function(error, response, body){
        if(!error) {
            callback(body);
        }
        return Error;
    });
};

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/login');
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

function scrapeCon(html, callback) {
    console.log("made it to the begining");
    var user = {},
        j = 0,
        z = 0,
        index = 0,
        character = '',
        word = "",
        found = false,
        len = html.length - 1;

    for (i = 0; i < len; i++) {
        // Loop over every char on the page
        character = html[i];
        // Finding Contributions in the last year
        if (character === 'C') {
            index = i + 30;
            word = html.slice(i, index);
            // Contributions in the last year
            if (word === "Contributions in the last year") {
                j = i + 30;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j + 14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.total = word;
                            //console.log("total = ", user.total);
                        }
                    }
                    j++;
                }
            }
            index = i + 14;
            word = html.slice(i, index);
            if (word === "Current streak") {
                j = i + 14;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j +14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.currentStreak = word;
                            //console.log("Current streak = ", user.currentStreak);
                        }
                    }
                    j++;
                } 
            }
        }
        // Finding Longest Streak
        if (character === 'L') {
            index = i + 14;
            word = html.slice(i, index); 
            if (word === 'Longest streak') {
                j = i + 15;
                found = false;
                while (j < len && !found) {
                    character = html[j];
                    if (character === 'c') {
                        word = html.slice(j, j +14);
                        if (word === "contrib-number") {
                            found = true;
                            word = "";
                            z = j + 16;
                            character = html[z];
                            while (character != '<') {
                                word += character;
                                z++;
                                character = html[z];
                            }
                            user.longestStreak = word;
                            //console.log("Longest Streak = ", user.streak);
                        }
                    }
                    j++;
                }
            }
        }
    }
    callback(user);
};

};
