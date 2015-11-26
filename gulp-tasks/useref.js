
var cssnano = require('cssnano');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
		htmlMinifierOptions = this.opts.htmlMinifierOptions;

	return gulp.src('public/**/*.html')
		.pipe($.useref({
			searchPath:'public',
			transformPath: function(filePath) {
				return filePath.replace(dirs.public + cfg.root, dirs.public + '/');
			}
		}))
		.pipe($.if('*.css', $.postcss([
			cssnano()
		])))
		.pipe($.if('*.css', $.minifyCss()))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.html', $.htmlMinifier(htmlMinifierOptions)))
		.pipe(gulp.dest('public'));
     
};

module.exports.dependencies = ['hexo'];
