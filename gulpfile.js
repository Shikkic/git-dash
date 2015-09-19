var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('run', function(cb) {
    exec('node server/index.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    // Launch Mongo incombination for deploy
    /*exec('mongod --dbpath ./data', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });*/
})
