const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const runSequence = require('run-sequence');
const mocha = require('gulp-mocha');

let paths = {
    functionaltests: 'test/functionalTest/**/*.js',
    unittests: 'test/unitTest/**/*.js',
    src: 'src/**/*.js'
};

gulp.task('default', () => {
    return runSequence('unitTest', 'functionaltest');
});

gulp.task('unitTest', () => {
    process.env.NODE_ENV = 'unitTest';
    return gulp.src(paths.unittests)
        .pipe(mocha());
});

gulp.task('functionaltest', () => {
    process.env.NODE_ENV = 'develop';
    return gulp.src(paths.functionaltests)
        .pipe(mocha());
});

gulp.task('serve', function () {
    process.env.NODE_ENV = 'develop';
    livereload.listen();
    nodemon({
        script: 'app.js',
        stdout: false
    }).on('readable', function () {
        this.stdout.on('data', function (chunk) {
            if(/^Express server listening on port/.test(chunk)){
                livereload.changed(__dirname);
            }
        });
        this.stdout.pipe(process.stdout);
        this.stderr.pipe(process.stderr);
    });
});


