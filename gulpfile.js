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

//Requires concatScripts as dependancy, minifys files and writes to dist/scripts
gulp.task('scripts', ['concatScripts'], function () {
  return gulp.src('js/app.js')
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest('dist/scripts'));
});

//Concatenates SCSS files, creates map file, writes both to css folder
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

//Requires compileSass as dependancy, minigys file and writes to dist/styles
gulp.task('styles', ['compileSass'], function () {
  return gulp.src('css/global.css')
    .pipe(uglyCSS())
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest('dist/styles'));
});

//Starts imagesJPG and imagesPNG
gulp.task('images', function () {
  return gulp.start(['imagesJPG', 'imagesPNG']);
});

//Resizes JPG files in images folder, writes to dist/images
gulp.task('imagesJPG', function () {
  return gulp.src('images/*.jpg')
    .pipe(resize({
      format: 'jpg',
      width: "25%",
      height: "25%"
    }))
  .pipe(gulp.dest('dist/images'))
});

//Resizes PNG files in images folder, writes to dist/images
gulp.task('imagesPNG', function () {
  return gulp.src('images/*.png')
    .pipe(resize({
      width: "90%",
      height: "90%"
    }))
  .pipe(gulp.dest('dist/images'))
});

//Watches changes to scss files, envokes "styles" and reloads browser if changes detected
gulp.task('watchSass', ['browserSync', 'styles'], function () {
  return gulp.watch('sass/*.scss', ['styles']);
});

//Cleans
gulp.task('clean', function () {
   del(['dist', 'css/*', 'js/app*.js*']);
});

//Reloads broswer
gulp.task('browserSync', function () {
  return bSync.init({
    server: {
      baseDir: './'
    },
  })
});

//Calls prebuild task, directs index.html and icons to dist folder
gulp.task('build', ['preBuild'], function (){
  return gulp.src(['index.html', 'icons/**'], { base: './' })
    .pipe(gulp.dest('dist'));
});

//Sequencially cleans, then runs 'scripts', 'styles', 'images'
gulp.task('preBuild', function () {
  return sequence('clean', ['scripts', 'styles', 'images'])
});

//Default gulp
gulp.task('default', function () {
  return sequence('build', 'watchSass')
});
