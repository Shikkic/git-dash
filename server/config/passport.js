// config/passport.js

// load all the things we need
var GithubStrategy = require('passport-github2').Strategy;
// load up the user model
var User = require('../models/user');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID; 
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// expose this function to our app using module.exports
module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use(new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/callback"
      },
      function(token, refreshToken, profile, done) {
        User.findOne({ githubId: profile.id }, function (err, user) {
        if (err) {
            return done(err);
        }
        // if the user is found, then log them in
        if (user) {
            return done(null, user); // user found, return that user
        } else {
            // if there is no user found with that facebook id, create them
            var newUser            = new User();

            // set all of the facebook information in our user model
            newUser.github.id    = profile.id; // set the users facebook id                   
            newUser.github.token = token; // we will save the token that facebook provides to the user                    
            newUser.github.name  = profile.displayName; 
            newUser.github.username = profile.username;
            newUser.github.url = profile.profileUrl;
            // save our user to the database
            newUser.save(function(err) {
                if (err)
                    throw err;

                // if successful, return the new user
                return done(null, newUser);
            });
        }
 
        
        });
      }
    ));

};
