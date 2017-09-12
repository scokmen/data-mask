var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');

var testFile = './spec/data-mask.spec.js';
var sourceFilePath = './src/data-mask.js';
var destinationFileName = 'data-mask.min.js';

/**
 * @name js:build
 * @description Build js file.
 */
gulp.task('js:build', function () {
    return gulp.src(sourceFilePath)
      .pipe(uglify())
      .pipe(rename(destinationFileName))
      .pipe(gulp.dest('dist'));
});

/**
 * @name js:test
 * @description Run unit tests.
 */
gulp.task('js:test', function () {
    gulp.src(testFile)
		.pipe(jasmine());
});

/**
 * @name js:hint
 * @description Run js-hint for source file.
 */
gulp.task('js:hint', function () {
    gulp.src(sourceFilePath)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});
