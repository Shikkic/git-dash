var gulp = require('gulp'),
    exec = require('child_process').exec,
    jshint = require('gulp-jshint');

gulp.task('default', ['run', 'watch']);

gulp.task('run', function(cb) {
    exec('mongod', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
    exec('node ./server/index.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('ngrok', function(cb) {
    exec('ngrok http 3000', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('jshint', function() {
    return gulp.src('./public/js/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {verbose: true})); 

});

gulp.task('watch', function() {
    gulp.watch('./public/js/app.js', ['jshint']);
});
