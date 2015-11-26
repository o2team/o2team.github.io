'use strict';

var gulp    = require('gulp'),
    $       = require('gulp-load-plugins')(),
    yaml    = require('js-yaml'),
    fs      = require('fs'),
    cfg     = yaml.safeLoad(fs.readFileSync('_config.yml')),
	htmlMinifierOptions = {
		removeComments: true,
		collapseWhitespace: true,
		collapseBooleanAttributes: true,
		removeScriptTypeAttributes: true,
		removeStyleLinkTypeAttributes: true,
		removeOptionalTags: true,
		minifyJS: true,
		minifyCSS: true
	},
	dirs = {
		public: 'public',
		fonts: 'public/fonts',
		imgs: 'public/img',
		css: 'public/css',
		js: 'public/js',
        temp: 'temp',
		assetsDir:'public/assets'
	};

require('gulp-task-loader')({
	$: $,
	cfg: cfg,
    htmlMinifierOptions: htmlMinifierOptions,
	dirs: dirs
});

gulp.task('rev', ['rev:replace']);
gulp.task('default', ['rev', 'replace', 'imgmin', 'cleanup']);
