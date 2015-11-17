module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        manifest = gulp.src(dirs.assetsDir + '/rev-media.json');

    return gulp.src([dirs.public + '/css/dist*.css', dirs.public + '/js/dist*.js'], {base: dirs.public})
        .pipe($.rev())
        .pipe($.revReplace({
            manifest: manifest
        }))
        .pipe(gulp.dest(dirs.assetsDir))
        .pipe($.rev.manifest())
        .pipe(gulp.dest(dirs.assetsDir));
};

module.exports.dependencies = ['useref', 'rev:media'];
