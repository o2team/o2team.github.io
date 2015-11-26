
require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$,
        idx = 0;

    echo('------ O2 is doing some cleanup ------');
    ['imgs','fonts','css','js', 'temp'].forEach(function(fd){
        idx++;
        echo(idx + '. remove "' + dirs[fd] + '"');
        rm('-rf', dirs[fd]);    
    });
    echo('------ Cleanup done by O2!      ------');
};

module.exports.dependencies = ['replace'];
