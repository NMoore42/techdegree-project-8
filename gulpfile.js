'use strict'

//Required variables list
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps');

gulp.task('concatScripts', function () {
  gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js',
    'js/global.js'])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', function () {
  gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function () {
  gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(write('./'))
    .pipe(gulp.dest('css'));
});

gulp.task('default', ['hello']);
