
require('shelljs/global');

module.exports = function(){
    
	var gulp = this.gulp,
		dirs = this.opts.dirs,
		cfg = this.opts.cfg,
		$ = this.opts.$;

    cd('themes/o2/');
    exec('git pull origin master');
    cd('../../');
    exec('git pull');
     
};
