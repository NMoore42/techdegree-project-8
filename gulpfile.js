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
     del = require('del'),
sequence = require('run-sequence'),
  resize = require('gulp-images-resizer');

//Concatenates JS files, creates map file, writes both to JS folder
gulp.task('scripts', function () {
  return gulp.src([
    'js/circle/autogrow.js',
    'js/circle/circle.js',
    'js/global.js'])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(rename('all.min.js'))
  .pipe(uglify())
  .pipe(maps.write('./'))
  .pipe(gulp.dest('dist/scripts'));
});

//Concatenates SCSS files, creates map file, writes both to css folder
gulp.task('styles', function () {
  return gulp.src('sass/global.scss')
    .pipe(maps.init())
    .pipe(sass())
    .pipe(rename('all.min.css'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(bSync.reload({
      stream: true
    }));
});

//Starts imagesJPG and imagesPNG
gulp.task('images', function () {
  return gulp.src('images/*')
    .pipe(resize({
      width: "25%",
      height: "25%"
    }))
  .pipe(gulp.dest('dist/content'))
});

//Resizes JPG files in images folder, writes to dist/images
gulp.task('imagesJPG', function () {
  return gulp.src('images/*.jpg')
    .pipe(resize({
      format: 'jpg',
      width: "25%",
      height: "25%"
    }))
  .pipe(gulp.dest('dist/content'))
});

//Resizes PNG files in images folder, writes to dist/images
gulp.task('imagesPNG', function () {
  return gulp.src('images/*.png')
    .pipe(resize({
      width: "90%",
      height: "90%"
    }))
  .pipe(gulp.dest('dist/content'))
});

//Watches changes to scss files, envokes "styles" and reloads browser if changes detected
gulp.task('watchSass', ['browserSync', 'styles'], function () {
  return gulp.watch('sass/*.scss', ['styles']);
});

//Cleans
gulp.task('clean', function () {
  return del(['dist', 'css/*', 'js/app*.js*']);
});

//Reloads broswer
gulp.task('browserSync', function () {
  return bSync.init({
    server: {
      baseDir: './'
    },
  })
});

//Add index file and icons to dist folder
gulp.task('addFiles', function () {
  return gulp.src(['index.html', 'icons/**'], { base: './' })
    .pipe(gulp.dest('dist'));
});

//Calls prebuild task, directs index.html and icons to dist folder
gulp.task('build', ['clean'], function (){
  return sequence('scripts', 'styles', 'images', 'addFiles');
});

//Default gulp
gulp.task('default', ['clean'], function () {
    return sequence('scripts', 'styles', 'images', 'addFiles', 'watchSass');
});
