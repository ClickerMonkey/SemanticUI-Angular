'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();

gulp.task('build', function () {
  return gulp
    .src([
      'src/sm-core.js',
      'src/sm-addons.js',
      'src/*/*.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(plugins.concat('angular-semantic-ui.js'))
      .pipe(plugins.uglify({mangle:false}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['build']);
