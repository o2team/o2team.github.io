'use strict';

var pathFn = require('path');
var _ = require('lodash');

hexo.extend.helper.register('raw_link', function(path){
    return 'https://github.com/o2team/o2team.github.io/edit/master/source/' + path;
});

hexo.extend.helper.register('post_img', function(path){
    if(path.indexOf('http://') === 0 || path.indexOf('https://') === 0) return path;
    path = this.url_for('img/post/' + path);
    return path;
});
