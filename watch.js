var fs = require('fs');
var browserify = require('browserify');
var watchify = require('watchify');
var glob = require('glob-all');
var tsify = require('tsify');
var gulp = require('gulp');
var tap = require('gulp-tap');
var chalk = require('chalk');
var moment = require('moment');
var buffer = require('vinyl-buffer');
var source = require("vinyl-source-stream");
var sourcemaps = require('gulp-sourcemaps');

var b = browserify({
	  entries: glob.sync(['**/*.ts', '!node_modules/**/*.ts']),
	  cache: {},
	  packageCache: {},
	  plugin: [watchify]
}).plugin(tsify, {noImplicitAny: true, lib:['es2015', 'es2017', 'dom']});

b.on('update', bundle);
bundle();

function bundle() {
	b.bundle()
	.on('error', console.error)
	.pipe(source("bundle.js"))
	.pipe(buffer())
	.pipe(sourcemaps.init({loadMaps: true}))
	.pipe(sourcemaps.write('./'))
	.pipe(tap(function(file, t){
			console.log(chalk.green(file.path + "\twritten\t"+moment().format()));
			return t.through(gulp.dest, ['.']);
	}));
}
