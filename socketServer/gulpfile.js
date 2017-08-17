const gulp = require('gulp');
const runSequence = require('run-sequence');
const eslint = require('gulp-eslint');
const mocha = require('gulp-mocha');
const nodemon = require('gulp-nodemon');
const {exec} = require('child_process');
const logger = require('winston');

let paths = {
    functionaltests: 'test/functionalTest/**/*.js',
    unittests: 'test/unitTest/**/*.js',
    multinodetests: 'test/multiNode/**/*.js',
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
    let server1, server2;
    return new Promise((resolve) => {
        server1 = exec('node src/app.js --NODE_CONFIG=\'{"port":3000,"url":"http://localhost","redisUrl":"http://localhost"}\'', (err, stdout, stderr) => {
            logger.info(stdout);
            logger.info(stderr);
        });
        server2 = exec('node src/app.js --NODE_CONFIG=\'{"port":3001,"url":"http://localhost","redisUrl":"http://localhost"}\'', (err, stdout, stderr) => {
            logger.info(stdout);
            logger.info(stderr);
        });

        resolve(gulp.src(paths.multinodetests)
            .pipe(mocha()));
    }).then(() => {
        server1.kill('SIGINT');
        server2.kill('SIGINT');
    });
});

gulp.task('serve', () => {
    return nodemon({
        script: 'src/app.js',
        env: { 'NODE_ENV': 'develop' }
    });
});
