'use strict'

//Required variables list
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
   bSync = require('browser-sync').create();

gulp.task('concatScripts', function () {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js',
    'js/global.js'])
  .pipe(concat('app.js'))
  .pipe(gulp.dest('js'));
});

gulp.task('minifyScripts', ['concatScripts'], function () {
  return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('js'));
});

gulp.task('compileSass', function () {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'))
    .pipe(bSync.reload({
      stream: true
    }));
});

gulp.task('watchSass', ['browserSync', 'compileSass'], function () {
  return gulp.watch('sass/*.scss', ['compileSass']);
});

gulp.task('browserSync', function () {
  bSync.init({
    server: {
      baseDir: './'
    },
  })
});

gulp.task('build', ['minifyScripts', 'compileSass']);

gulp.task('default', ['build', 'watchSass']);
