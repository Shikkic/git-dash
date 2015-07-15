// config/passport.js

// load all the things we need
var GithubStrategy = require('passport-github2').Strategy;
// load up the user model
var User = require('../models/user');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID; 
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

console.log(GITHUB_CLIENT_ID);
console.log(GITHUB_CLIENT_SECRET);

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
        callbackURL: "http://www.gitdash.me/auth/github/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        User.findOrCreate({ githubId: profile.id }, function (err, user) {
           return done(err, user);         
        });
      }
    ));

};
