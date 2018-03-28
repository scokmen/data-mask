const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const jasmine = require('gulp-jasmine');
const jshint = require('gulp-jshint');

const testFile = './spec/data-mask.spec.js';
const sourceFilePath = './src/data-mask.js';
const destinationFileName = 'data-mask.min.js';

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
