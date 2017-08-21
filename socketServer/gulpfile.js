const gulp = require('gulp');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const exec = require('child_process').exec;

let paths = {
    functionaltests: 'test/functionalTest/**/*.js',
    unittests: 'test/unitTest/**/*.js',
    multinodetests: 'test/multiNode/**/*.js',
    src: 'src/**/*.js'
};

gulp.task('default', () => {
    return runSequence('lint', 'unittest', 'functionaltest', 'multinodetest');
});

gulp.task('lint', () => {
    return gulp.src([paths.functionaltests, paths.unittests, paths.src])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('functionaltest', () => {
    process.env.NODE_ENV = 'functionalTest';
    return gulp.src(paths.functionaltests)
        .pipe(mocha());
});

gulp.task('unittest', () => {
    process.env.NODE_ENV = 'unitTest';
    return gulp.src(paths.unittests)
        .pipe(mocha());
});

gulp.task('multinodetest', () => {
    process.env.NODE_ENV = 'multiNodeTest';
    return gulp.src(paths.multinodetests)
        .pipe(mocha());
});

gulp.task('serve', () => {
    return nodemon({
        script: 'src/app.js',
        env: { 'NODE_ENV': 'develop' }
    });
});
