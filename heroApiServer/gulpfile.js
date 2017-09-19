const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const livereload = require('gulp-livereload');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const proxy = require('./devTools/proxy');

let paths = {
    functionaltests: 'test/functionalTest/**/*.js',
    unittests: 'test/unitTest/**/*.js',
    src: 'src/**/*.js'
};

gulp.task('default', () => {
    return runSequence('lint', 'unittest', 'functionaltest');
});

gulp.task('lint', () => {
    return gulp.src([paths.functionaltests, paths.unittests, paths.src])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('unittest', () => {
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
    proxy();
    livereload.listen();
    nodemon({
        script: 'src/app.js',
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


