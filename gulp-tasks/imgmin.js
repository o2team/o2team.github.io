module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        pngquant = require('imagemin-pngquant');

    return gulp.src(dirs.assetsDir + '/img/**/*', {base: dirs.assetsDir})
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox:false}],
            use:[pngquant()]
        }))
        .pipe(gulp.dest(dirs.assetsDir))

};

module.exports.dependencies = ['rev:media'];
