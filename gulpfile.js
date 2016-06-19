var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var jasmine = require('gulp-jasmine');
var jshint = require('gulp-jshint');

var testFile = './spec/maskspec.js';
var sourceFilePath = './src/data-mask.js';
var destinationFileName = 'data-mask.min.js'

//Compress source file.
gulp.task('compress', function () {
    return gulp.src(sourceFilePath)
      .pipe(uglify())
      .pipe(rename(destinationFileName))
      .pipe(gulp.dest('dist'));
});

//Run jasmine tests.
gulp.task('jasmine', function () {
    gulp.src(testFile)
		.pipe(jasmine());
});

//Run  JsHint.
gulp.task('jshint', function () {
    gulp.src(sourceFilePath)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'))
});