'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();
var pkg = require('./package.json');
var src = [
  'src/sm.js',
  'src/sm-core.js',
  'src/*/*.js'
];

var banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.version %>',
  ' * <%= pkg.description %>',
  ' * ',
  ' * <%= pkg.homepage %>',
  ' * Released under the <%= pkg.license %> license.',
  ' * Copyright <%= (new Date()).getFullYear() %> <%= pkg.author %> and contributors.',
  ' */',
  ''].join('\n');

gulp.task('build', function () {
  return gulp
    .src( src )
    .pipe( plugins.concat('angular-semantic-ui.js') )
    .pipe( plugins.header(banner, { pkg : pkg } ))
    .pipe( gulp.dest('.') );
});

gulp.task('build-min', function () {
  return gulp
    .src( src )
    .pipe( sourcemaps.init() )
      .pipe( plugins.concat('angular-semantic-ui.min.js') )
      .pipe( plugins.uglify({mangle:true}) )
    .pipe( sourcemaps.write('.') )
    .pipe( plugins.header(banner, { pkg : pkg } ))
    .pipe( gulp.dest('.') );
});

gulp.task('default', ['build', 'build-min']);
