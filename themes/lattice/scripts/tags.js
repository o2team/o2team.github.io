'use strict';
var util        = require('hexo-util');

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
