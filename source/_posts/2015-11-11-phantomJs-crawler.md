title: 基于phantomJs的网络爬虫
subtitle: "phantomJs是一个基于WebKit的服务器端JavaScript API。可以用于页面自动化，网络监测，网页截屏，以及无界面测试等。"
date: 2015-11-11 09:59:33
cover: //img.aotu.io/panxinwu/phantomjs.png
categories: Web开发
tags:
  - PhantomJS
  - Crawler
author:
  nick: 潘潘
  github_name: panxinwu
---
# 基于phantomJs2.0的网络爬虫

**phantomJs**是一个基于WebKit的服务器端JavaScript API。它全面支持web而不需浏览器支持，其快速，原生支持各种Web标准： DOM 处理, CSS 选择器, JSON, Canvas, 和 SVG。PhantomJS可以用于页面自动化，网络监测，网页截屏，以及无界面测试等。
### 用途概述：

 
- **屏幕快照** ：官方提供的API中[page.render](http://phantomjs.org/api/webpage/method/render.html) 提供了强大的屏幕快照功能；
- **网络爬虫** ：[page.evaluate](http://phantomjs.org/api/webpage/method/evaluate.html) 方法提供了一个沙箱来帮助你像用js操作dom一样简单的获取你想要的内容，避免了使用复杂的正则匹配内容；
- **网络情况监控** ：定期对网站进行pageSpeed检查、可用于打开速度缓慢短信报警等服务(本文暂不做深入介绍)。
- **页面自动化操作** ：phantomJs2.0 提供了丰富的API用于页面自动化操作

-------------------

## 关于安装

> 网络上有大量的安装教程，如果你用的osx，建议直接`brew update && brew install phantomjs`。此处只叙述下在安装过程中遇到的一个坑。

在Mac OS Yosemite  版本可能都会遇到这样一个问题：
运行 `phantomjs hello.js` 后得到了报错信息：`Killed: 9`
这个问题的原始链接在这里[github:issue/12928](https://github.com/ariya/phantomjs/issues/12928) 解决方案如下：[stackoverflow](http://stackoverflow.com/questions/28267809/phantomjs-getting-killed-9-for-anything-im-trying)
1. Install UPX. UPX is an executable packer and unpacker
    `$ brew install upx`
2. Unpack the phantomjs executable
    `$ upx -d phantomjs-2.0.0-macosx/bin/phantomjs`
3. Run the phantomjs executable
    `$ ./phantomjs-2.0.0-macosx/bin/phantomjs`

## 先感受下phantomJs的强大
``` 
var page = require('webpage').create();
page.open('http://jd.com', function() {
page.render('jd.png');
phantom.exit();
});
```
把以上代码保存到screen.js，切到terminal：
`$ phantomejs screen.js`

**可以得到如下的网站截图：**
![Alt text](http://ww1.sinaimg.cn/large/80c4aaf9gw1ey49t6wl41j20rb0d1jxj.jpg)

>当然还可以继续[page.scrollPosition](http://phantomjs.org/api/webpage/property/scroll-position.html)以及Js脚本做延时截图，来避免截图中出现图片未加载完全等问题。

## 页面自动化操作

### 自动登录京东
```
var page = require('webpage').create();

page.onLoadStarted =function() {
    loadInProgress =true;
    console.log("load started");
};
 
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};
page.onUrlChanged = function() {
    console.log("onUrlChanged");
};
 page.open('https://passport.jd.com/new/login.aspx', function() {
    page.includeJs("http://apps.bdimg.com/libs/jquery/1.6.4/jquery.js", function() {
        var rect = page.evaluate(function() {
            $('#loginname').val('username');
            $('#nloginpwd').val('passwd');
            $('#loginsubmit')[0].click();
            return document.title;
        });
        //若引入jQuery 则用这种方法来实现click
        page.sendEvent('click', rect.left + rect.width / 2, rect.top + rect.height / 2);
        console.log(rect);
        var clock =setTimeout(function(){
            page.render('jdlogin.png');
            phantom.exit();
        },2000);
    });
});
```
 > phantomJs2.0中click事件不是标准事件
 若 `page.evaluate`中操作dom时并未引入jQuery，则应自己实现一个click事件如下：

```
function click(el){
    var ev = document.createEvent("MouseEvent");
    ev.initMouseEvent(
        "click",
        true /* bubble */, true /* cancelable */,
        window, null,
        0, 0, 0, 0, /* coordinates */
        false, false, false, false, /* modifier keys */
        0 /*left*/, null
    );
    el.dispatchEvent(ev);
}
```
解决方案来自[stackoverflow:questions/15739263](http://stackoverflow.com/questions/15739263/phantomjs-click-an-element)

**登录后截屏**
![Alt text](http://ww3.sinaimg.cn/large/80c4aaf9gw1ey49s5j9pjj20rd0hiaic.jpg)

> 可以看到此登录并未触发验证，若用别的网站被脱库的账号密码来批量查询的话，有很大概率撞库。

## 网络爬虫
### 数据抓取的快感
> 众所周知知乎的搜索如此之烂，刚看过的问题，再搜就搜不到了，那把知乎上你想要的分类的问题抓取下来，自己搜索咯。（当然想这么一个烂理由来抓人家的数据也是醉人）。随便抓人家的数据不好，此处只做技术分享，切勿用于商业用途。

##### 批量抓取知乎某个分类下的所有问题

```
var page = require('webpage').create(),
    testindex = 0,
    finalAns = [],
    fs = require("fs");
page.onLoadStarted =function() {
    loadInProgress =true;
    console.log("load started");
};
 
page.onLoadFinished = function() {
    loadInProgress = false;
    console.log("load finished");
};
page.onUrlChanged = function() {
    console.log("onUrlChanged");
};
var circle = setInterval(function(){
    testindex++;
    if(testindex === 51){
        clearInterval(circle);
        phantom.exit();
    }
    page.open('http://www.zhihu.com/topic/19559937?page='+testindex, function(status) {
        if(status == 'fail'){
            testindex--;
            return;
        }
        var rect = page.evaluate(function() {
            var titleArr = [];
            window.scrollTo(0,document.body.scrollHeight);
                var title = $('.feed-item .question_link');
                for(var j = 0; j < title.length; j++){
                    titleArr[j] = title[j].text;
                }
            return titleArr;
        });
        if(rect == null){
            testindex--;
            return;
        }
        file = fs.open("liuxue.txt", 'a');
        for(var h = 0; h < rect.length; h++){
            file.write(rect[h]+'\n');
        }
        file.close();
    });
},2000);
```
> 其中用到了批量page.open 页面来控制翻页到所有的问题，然后将查询到的数据写入文件中，用到了File System API.

### 运用场景畅想
 1. 网络性能测试可用于批量、定期对竞品网站做查询，进行竞品分析如打开速度、改版频率等等。
 2. 网络爬虫可批量获取数据进行竞品分析、行业报告等。
 3. 页面自动化操作可用于网站自动化测试等。
