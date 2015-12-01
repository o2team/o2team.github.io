require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$;

    echo('------ O2 is doing some replacements ------');

    return gulp.src('public/**/*.html')
        .pipe($.replace(/\"\/img\//g, '"/assets/img/'))
        .pipe($.replace(/\(\/img\//g, '(/assets/img/'))
        .pipe(gulp.dest('public'));
     
};

module.exports.dependencies = ['rev'];
