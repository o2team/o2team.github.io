'use strict';

var pathFn      = require('path');
var _           = require('lodash');
var cheerio     = require('cheerio');
var util        = require('hexo-util');
var publicDir   = hexo.public_dir;
var sourceDir   = hexo.source_dir;
var route       = hexo.route;

var postImgDir  = 'img/post/';      

// Utils
function startsWith(str, start){
    return str.substring(0, start.length) === start;
}

// Hexo extensions
hexo.extend.helper.register('raw_link', function(path){
    return 'https://github.com/o2team/o2team.github.io/edit/master/source/' + path;
});

hexo.extend.helper.register('page_anchor', function(str){
  var $ = cheerio.load(str, {decodeEntities: false});
  var headings = $('h1, h2, h3, h4, h5, h6');

  if (!headings.length) return str;

  headings.each(function(){
    var id = $(this).attr('id');

    $(this)
      .addClass('post-heading')
      .append('<a class="post-anchor" href="#' + id + '" aria-hidden="true"></a>');
  });

  return $.html();
});

hexo.extend.helper.register('post_img', function(path){
    if(path.indexOf('http://') === 0 || path.indexOf('https://') === 0) return path;
    path = this.url_for((hexo.theme.config.post.img_dir || postImgDir) + path);
    return path;
});

hexo.extend.helper.register('header_menu', function(className){
  var menu = this.site.data.menu,
    result = '',
    self = this,
    lang = this.page.lang,
    isDefaultLang = lang === 'zh-cn',
    path1 = this.path,
    isActive = function(path0){
        if(path0 === 'index.html') {
            return path1 === path0;    
        }
        return (path1.indexOf(path0)!==-1);    
    }

  _.each(menu, function(path, title){
    if (!isDefaultLang && ~localizedPath.indexOf(title)) path = lang + '/' + path;
    var activeClass  = isActive(path) ? " active" : "";
    result += '<li class="' + className + '-item' + activeClass + '">';
    result += '<a href="' + self.url_for(path) + '" class="' + className + '-link">' + self.__('menu.' + title) + '</a>';
    result += '</li>';
  });

  return result;
});

hexo.extend.helper.register('lang_name', function(lang){
    var data = this.site.data.languages[lang];
    return data.name || data;
});

hexo.extend.helper.register('canonical_path_for_nav', function(){
    var path = this.page.canonical_path;

    if (startsWith(path, 'docs/') || startsWith(path, 'api/')){
        return path;
    }
    return '';
});
hexo.extend.helper.register('page_keywords', function(asStr){
    var tags = this.page.tags,
        siteKeywords = hexo.config.keywords.split(', ');

    if (tags) {
        tags.each(function(tag){
            siteKeywords.splice(0, 0, tag.name);
        }); 
    }
    if (asStr) {
        return siteKeywords.join(',');
    }
    return siteKeywords;
});

// Custom hexo tags
/**
 * post img
 * usage: {% pimg imageName [alt text] [JSONImageAttibutes] %}
 * ref: https://github.com/wsk3201/hexo-local-image
 */
hexo.extend.tag.register('pimg', function(args,content){
    var imageName = args[0],
        altText = "",
        imgAttr = "{}",
        themeConfig = hexo.theme.config;

    switch(args.length){
        case 1:
            break;
        case 2:
            altText = args[1]
            if(altText.length > 1 && altText[0] === '{' && altText[altText.length-1] === '}'){
                imgAttr = altText;
            }
            break;
        case 3:
            altText = args[1];
            imgAttr = args[2];
            break;       
    }
    try {
        imgAttr = JSON.parse(imgAttr);
    }catch(e){
        console.log('scripts.helpers.pimg', e);
        imgAttr = {};
    }
    imgAttr.src   = hexo.config.root + (themeConfig.post.img_dir||postImgDir) + imageName;
    imgAttr.alt = imgAttr.alt || altText;

    // spaces proccess
    for(var p in imgAttr){
        if(typeof imgAttr[p] !== 'string') continue;
        imgAttr[p] = imgAttr[p].replace(/\%20/g, ' ');
    }

    return util.htmlTag('img', imgAttr);
});

hexo.extend.tag.register('tag_cfg', function(args, content){
    var fieldName = args[0],
        cls = args[1] || 'cfg-val',
        fields = fieldName.split('.'),
        cfg = hexo.config,
        cfg1 = hexo.theme.config,
        getPro = function(obj, fds){
            var len = fds.length,
                val = "";
            for (var i = 0; i < len; i++) {
                val = obj[fds[i]];
                if (typeof val === 'object') {
                    if (fds.shift()){
                        return getPro(val, fds);
                    }
                    return JSON.stringify(val);
                }
                return val;
            }
        };
    
    return util.htmlTag('div', {
        "class": cls
    }, getPro(cfg, fields) || getPro(cfg1, fields));

});
