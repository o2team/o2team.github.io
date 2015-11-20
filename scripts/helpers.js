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

hexo.extend.helper.register('header_menu', function(className){
  var menu = this.site.data.menu;
  var result = '';
  var self = this;
  var lang = this.page.lang;
  var isDefaultLang = lang === 'zh-cn';

  _.each(menu, function(path, title){
    if (!isDefaultLang && ~localizedPath.indexOf(title)) path = lang + '/' + path;

    result += '<li class="' + className + '-item">';
    result += '<a href="' + self.url_for(path) + '" class="' + className + '-link">' + self.__('menu.' + title) + '</a>';
    result += '</li>';
  });

  return result;
});
