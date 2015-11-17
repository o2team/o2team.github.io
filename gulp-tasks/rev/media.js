module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$;

     return gulp.src([dirs.fonts + '/**/*', dirs.imgs + '/**/*'], {base: dirs.public})
        .pipe($.rev())
        .pipe(gulp.dest(dirs.assetsDir))
        .pipe($.rev.manifest('rev-media.json'))
        .pipe(gulp.dest(dirs.assetsDir));
     
};
