module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        manifest = gulp.src([dirs.assetsDir + '/rev-*.json']);

    return gulp.src([ dirs.public + "/**/*.html"])
        .pipe($.revReplace({
            manifest: manifest,
            modifyReved:function(fileName){
                if(fileName.indexOf('/dist') > -1){
                    //special files proccessed by gulp-useref
                    fileName = cfg.root + 'assets/' + fileName;
                }else {
                    fileName = 'assets/' + fileName; 
                }
                return fileName;
            }
        }))
        .pipe(gulp.dest(dirs.public));
};

module.exports.dependencies = ['rev:scripts'];
