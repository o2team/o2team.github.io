(function($,H,B,X){

  if($.support){
      $.support.cors = true;
  };

  X.heredoc = function(fn){return (fn.toString().split('\n').slice(1,-1).join('\n') + '\n');};
  X.toHtml = function(tpl,obj,ext){tpl = H.compile(tpl);return (tpl.render(obj,ext));};

  /**
   * 将指定数据渲染指定模板
   * @param {Object} opts 配置对象
   * @param {String} opts.target 渲染目标的css选择器,例如#test
   * @param {String} opts.tpl 模板的id选择器或者模板的内容（支持远程模板文件例如http://faso.me/xhogan/tpl/test.html）。如果是模板id，需要以#开始，例如#tpl1
   * @param {String} opts.data 渲染模板所需数据，json对象或者远程json文件例如http://faso.me/xhogan/data/test.json
   * @param {String} opts.tplVersion 模板版本号
   * @param {String} opts.dataVersion 数据版本号
   * @param {String} opts.appendToTarget 是否将最后的dom追加到目标元素中
   * @param {Object} opts.extraTplData 模板渲染的额外数据
   * @param {Function} opts.cbk 回调函数cbk(err,html,tpl,data)
   * @param {String} opts.dataType 数据格式，默认json
   */
  X.render = function(opts){
      opts = getOpts(opts);
      
      new renderer(opts).render(opts.extraTplData);
  };

  //utility methods
  var t = function(o){
      return (typeof(o));
  },
  l = function(txt){
      window['console']&&window['console'].log&&window['console'].log(txt);
  },
  isUrl = function(s){
      return ( (t(s)==='string') && ( ( s.indexOf('http://')===0 ) || ( s.indexOf('https://') === 0 ) ) );
  },
  localDB = window['localStorage']||{},
  defaultOpts = {
      target:"body",
      tpl:"#xhoganTpl",
      data:{},
      tplVersion:"1",
      dataVersion:"1",
      appendToTarget:true,
      dataType:'json',
      cbk:function(err,html,tpl,data){}
  },
  getOpts = function(opts){
      opts = $.extend({},defaultOpts,opts||{});
      opts.$target = $(opts.target);
      
      return opts;
  },
  renderer = function(opts){
      this.opts = opts;
      this.id = B.encode(opts.target);
      this.init();
  };

  renderer.prototype = {
      init:function(){
          this.isTplRemote =isUrl(this.opts.tpl);
          this.isDataRemote = isUrl(this.opts.data);
          this.tplId = this.isTplRemote?B.encode(this.opts.tpl):"localTpl";
          this.dataId = this.isDataRemote?B.encode(this.opts.data):"localData";
          
          this.tplKey = [this.id,this.tplId].join('-');
          this.dataKey = [this.id,this.dataId].join('-');
          this.tplVersionKey = this.tplKey+'-Version';
          this.dataVersionKey = this.dataKey+'-Version';
          
      },
      render:function(extData){
          var me = this;
          this.getHtml(function(err,html,tpl,data){
              if(err){
                  //alert("xhogan:在getHtml方法中发生错误,"+err);
                  l("xhogan:在getHtml方法中发生错误->"+err);
                  me.opts.cbk && me.opts.cbk(err);
                  return;
              }
              if(me.opts.appendToTarget){
                  me.opts.$target.append(html);
              }else{
                  me.opts.$target.html(html);
              }
              
              me.opts.cbk && me.opts.cbk(err,html,tpl,data);
              
          },extData);
      },
      getHtml:function(cbk,extData){
          var me = this;
          this.getTpl(this.opts.tpl,function(err1,tplData){
              if(err1){
                  cbk(err1);
                  return;
              };
              me.getData(me.opts.data,function(err2,data){
                  if(err2){
                      cbk(err2);
                      return;
                  }
                  cbk(null,X.toHtml(tplData,data,extData),tplData,data);
              });
          });
      },
      getTpl : function(tpl,cbk){
      
          if(tpl.indexOf('#')===0){
              cbk(null,$(tpl)[0].innerHTML);
              return;
          };
          
          var me = this,
              localVersion = localDB[this.tplVersionKey];
          //本地缓存未过期
          if(localVersion && localVersion === this.opts.tplVersion){
              cbk(null,localDB[this.tplKey]);
              return;
          };
          
          //load tpl from remote
          $.ajax({
              url:tpl,
              cache:false,
              success:function(data, status, xhr){
                  localDB[me.tplVersionKey] = me.opts.tplVersion;
                  localDB[me.tplKey] = data;
                  cbk(null,data);
              },
              error:function(xhr, errorType, error){
                  cbk(error);
              }
          });
      },
      getData:function(d,cbk){
          if(t(d)==='object'){
              cbk(null,d);
              return;
          }
          var me = this,
              localVersion = localDB[this.dataVersionKey];
          //本地缓存未过期
          if(localVersion && localVersion === this.opts.dataVersion){
              cbk(null,JSON.parse(localDB[this.dataKey]));
              return;
          };
          
          //load tpl from remote
          $.ajax({
              crossDomain:true,
              url:d,
              cache:false,
              success:function(data, status, xhr){
                  localDB[me.dataVersionKey] = me.opts.dataVersion;
                  localDB[me.dataKey] = JSON.stringify(data);
                  cbk(null,data);
              },
              error:function(xhr, errorType, error){
                  cbk(error);
              }
          });
      }
  };

})( (window["jQuery"]||window["Zepto"]), Hogan, Base64, (window["xhogan"]={}) );
