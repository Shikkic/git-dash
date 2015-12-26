'use strict'

var gulp = require('gulp'),
    exec = require('child_process').exec,
    jshint = require('gulp-jshint'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass');

gulp.task('default', ['run', 'watch']);

gulp.task('run', function(cb) {
    exec('mongod', function (err, stdout, stderr) {
        cb(err);
    });
    var nodeChild = exec('node ./server/index.js');
    nodeChild.stdout.on('data', function(data) {
        console.log('node: ' + data);
    });
    nodeChild.stderr.on('data', function(data) {
        console.log('node: ' + data);
    });
    nodeChild.on('close', function(code) {
        console.log('closing code: ' + code);
    });
});

gulp.task('ngrok', function(cb) {
    exec('ngrok http 3000', function (err, stdout, stderr) {
        cb(err);
    });
});

gulp.task('jshint', function() {
    return gulp.src('./public/js/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true})); 
});

gulp.task('sass:build', function() {
    gulp.src('./public/sass/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'));
});

gulp.task('watch', function() {
    gulp.watch('./public/js/app.js', ['jshint']);
    gulp.watch('./public/sass/*.scss', ['sass:build']);
});
