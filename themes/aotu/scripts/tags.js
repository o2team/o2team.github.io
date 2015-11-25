'use strict';
var util        = require('hexo-util');

var postImgDir  = 'img/post/';      
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
        tagName = args[1] || 'p',
        cls = args[2] || 'cfg-val',
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
    
    return util.htmlTag(tagName, {
        "class": cls
    }, getPro(cfg, fields) || getPro(cfg1, fields));

});
