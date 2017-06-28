let gulp = require('gulp');
let runSequence = require('run-sequence');
let eslint = require('gulp-eslint');
let mocha = require('gulp-mocha');
let nodemon = require('gulp-nodemon');

let paths = {
    functionaltests: 'test/functionalTest/**/*.js',
    unittests: 'test/unitTest/**/*.js',
    src: 'src/**/*.js'
};

gulp.task('default', () => {
    return runSequence('lint', 'test');
});

gulp.task('lint', () => {
    return gulp.src([paths.tests, paths.src])
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

gulp.task('serve', () => {
    return nodemon({
        script: 'src/app.js',
        env: { 'NODE_ENV': 'develop' }
    });
});
