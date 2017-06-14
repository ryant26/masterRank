let gulp = require('gulp');
let runSequence = require('run-sequence');
let eslint = require('gulp-eslint');
let mocha = require('gulp-mocha');

let paths = {
    tests: 'test/**/*.js',
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

gulp.task('test', () => {
    process.env.NODE_ENV = 'functionalTest';
    return gulp.src(paths.tests)
        .pipe(mocha());
});
