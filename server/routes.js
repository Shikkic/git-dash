var path = require('path'),
    fs = require('fs'),
    gh = require('gh-scrape'),
    moment = require('moment'),
    LOGIN_PAGE = path.join(__dirname, '..', 'public', 'pages', 'login.html'),
    _ = require('underscore');

module.exports = function(app, request, async, passport) {
    
    // TEST TODO might need to remove this code?
    app.get('/lol', function(req, res) { 
        var name = req.user.github.username;
        var userToken = req.user.github.token;
        getFriendsList(name, userToken, function(names) {
            userData(name, names, userToken, function(results) {
                res.render('login', {data: results});
            });
        });
    });

    ///////////////////////////////////////////
    ///      Default landing page / login   ///
    ///////////////////////////////////////////
    app.get('/', isLoggedIn, function(req, res) {
        // Parse name and user token and set request options
        var name = req.user.github.username,
            userToken = req.user.github.token,
            gitUrl = "https://api.github.com/user?access_token="+userToken,
            options = {
                url: gitUrl,
                headers: {
                    'User-Agent': name
                }
            };

        // Make requests for nav bar 
        // TODO REMOVE THIS AND MAKE FE GRAB THIS DATA 
        request.get(options, function(error, response, userData) {
            if (!error) {
                res.render('app', {data: JSON.parse(userData)});
            }
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
                getFriendsProfileData(name, names, data, function(results){
                    getFriendsPersonalData(name, userToken, names, function(personalData) {
                    var userList = [];
                    // TODO create a function for this!
                    for (var i = 0; i < data.length - 1; i++) {
                        var user = {
                            contributions: results[i],
                            eventData: data[i],
                            personalData: personalData[i]
                        };
                        userList.push(user);
                    }
                    res.send(userList);
                    });
                });
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

    function getFriendsPersonalData(name, userToken, friendsList, callback) {
        var count = 0; 
        async.times(friendsList.length, function(_, next) {
            var gitUrl = 'https://api.github.com/users/'+friendsList[count]+'?access_token='+userToken;
            var options = {
                url: gitUrl,
                headers: {
                    'User-Agent': name
                } 
            };
            count++;
            request.get(options, function(error, response, body) {
                var data = JSON.parse(body);
                return next(error, ({personalData: data}));
            });
        }, function(err, results) {
            callback(results);
        }); 
    };

    function getFriendsProfileData(name, friendsList, eventData, callback) {
        console.log(friendsList);
        var count = 0; 
        async.times(friendsList.length, function(_, next) { 
            var name = friendsList[count];
            var gitUrl = "https://github.com/"+friendsList[count];
            var options = {
                url: gitUrl,
                headers: {
                    'User-Agent': name
                } 
            };
            count++;
            request.get(options, function(error, response, body) {
                scrapeCon(body, function(body) {
                    var data = body;
                    var total = data.total;
                    var longestStreak = data.longestStreak;
                    var currentStreak = data.currentStreak;
                    var contributions = {totals: total, longestStreaks: longestStreak, currentStreaks: currentStreak};

                    return next(null, contributions);
                });
            });
        }, function(err, results) {
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
                    if(data[count].type == "PushEvent") {
                        found = true;
                        break;
                    }
                    count++;
                }
                callback(data[count]); 
            }
            return error;
        });
    };

    // TODO This is a fucked function remove
    function getRequest2(gitUrl, callback) {
    var options = {
        url: gitUrl
    };
    request.get(options, function(error, response, body){
        if(!error) {
            callback(body);
        }
        return error;
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
