'use strict'

//Required variables list
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
 uglyCSS = require('gulp-uglifycss'),
  rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
   bSync = require('browser-sync').create(),
     del = require('del');

gulp.task('concatScripts', function () {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js',
    'js/global.js'])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});

gulp.task('scripts', ['concatScripts'], function () {
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

gulp.task('styles', ['compileSass'], function () {
  return gulp.src('css/global.css')
    .pipe(uglyCSS())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('css'));
});

gulp.task('watchSass', ['browserSync', 'styles'], function () {
  return gulp.watch('sass/*.scss', ['styles']);
});

gulp.task('clean', function () {
  del(['dist', 'css/*', 'js/app*.js*']);
});

gulp.task('browserSync', function () {
  bSync.init({
    server: {
      baseDir: './'
    },
  })
});

gulp.task('build', ['scripts', 'styles'], function (){
  return gulp.src(['css/all.min.css', 'js/app.min.js', 'index.html', 'images/**', 'icons/**'], { base: './' })
    .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean', 'watchSass'], function () {
  gulp.start('build');
});
