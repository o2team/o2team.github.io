title: 让console充满情怀
subtitle: 打开console控制台,你有一份前端情怀在这里~~
cover: //img10.360buyimg.com/ling/jfs/t1/43329/16/6828/37541/5d0777aaE5a3d04f3/7b69d7b0140869d3.jpg
tags:
  - console
  - 占位符
  - 字符画
categories: Web开发
author:
  nick: 暖暖
  github_name: Newcandy
date: 2016-06-22 15:51:18
---

一般情况下只是用console 控制台输出简单的文字信息，但是当console遇到了前端的情怀，故事就不是这么发展的了~
<!-- more -->


## 1. 基本语法：

console.log的基本语法如下：

```javascript
console.log(object [, object, …])
```


## 2. 占位符

一打开天猫、知乎的页面console，招聘信息就袭来啦！

天猫招聘：
![天猫招聘](//img20.360buyimg.com/ling/jfs/t1/66201/15/2174/129423/5d0777c7Ee4e51d74/6bf5ad8e4f120209.png)

知乎招聘：
![知乎招聘](//img14.360buyimg.com/ling/jfs/t1/56427/32/2610/150307/5d0777e0E1bf5ef35/61c94680f50a1fd3.png)

小女子就好奇了，怎么做的呢，可以更酷炫一点吗？

原来啊，故事是这样开始的：浏览器提供了这么一个API：第一个参数可以包含一些格式占位符比如%c，console.log方法将依次用后面的参数替换占位符，然后再进行输出。

| 格式占位符  |  作用  |
| ------------- |-------------|
| %s   |  字符串   |
| %d or %i  |   整数   |
| %f  |   浮点数  |
| %o  |   可展开的DOM  |
| %O  |   列出DOM的属性  |
| %c  |   根据提供的css样式格式化字符串  |

给爷来一段全部用上占位符的代码，然后小女子遵命了：

```javascript
// 第一个参数有五个占位符（%s），第二~六个参数会依次替换掉占位符。
console.log("%c Look %o and %O , it %s and %d ","color: #6190e8;",{AA: "WCN",BB: "wcn"},{AA: "WCN",BB: "wcn"},"CC",123);
```

截图如下：

![占位符](//img30.360buyimg.com/ling/jfs/t1/69808/15/2143/63690/5d077802E1c9bf5f5/601ac7a2dfe9fa82.png)

%o和%O在普通对象上的表现是一样的，但是在DOM上就有区别了：

```javascript
// 格式成可展开的的DOM，像在开发者工具Element面板那样可展开
console.log('%o',document.body.firstElementChild)

// 像JS对象那样访问DOM元素，可查看DOM元素的属性
// 等同于console.dir(document.body.firstElementChild)
console.log('%O',document.body.firstElementChild)
```

随意打开的一个页面测试，firefox总是可以查看可展开的DOM节点，即行为是%o；IE不支持%o和%O ；chrome显示正常，截图如下

![%o和%O的区别](//img13.360buyimg.com/ling/jfs/t1/39715/20/9152/135176/5d077826E32bd5ee2/d5305ce333d49fab.png)

使用%c占位符时，对应的后面的参数必须是CSS语句，用来对输出内容进行CSS渲染。于是，利用%c配合CSS可以做出吊炸天的效果，比如背景色、字体颜色渐变、字体3D效果、图片等，情况允许再用颜文字、emoji卖个萌，萌萌哒~

什么，竟然也支持图片？！log一个图片试试：

```javascript
console.log("%c    ","background: url(http://aotu.io/assets/img/o2logo.png) no-repeat left center;font-size: 60px;","\n");
```

firebug截图如下：

![图片](//img13.360buyimg.com/ling/jfs/t1/64394/15/2133/96852/5d07783eE55be9797/0500d0d1c3ee54c3.png)

不过要注意了：
* console不能定义img，因此用背景图片代替。
* console不支持width和height，利用空格和font-size代替；还可以使用padding和line-height代替宽高。
* chrome没出来？没出来就对了……不支持啊！原因是[ConsoleViewMessage.js源码把url和谐掉了](https://src.chromium.org/viewvc/blink/trunk/Source/devtools/front_end/console/ConsoleViewMessage.js?pathrev=197345#l797)。不过可以下载firebug插件查看啦~ gif图片也是支持的~~~
* console是默认换行的。

学习了以上的东东，就是为了这个的出世，铛铛铛~~~：

firebug截图如下：

![凹凸实验室招聘](https://img20.360buyimg.com/ling/jfs/t1/36566/30/11298/183388/5d07785bE08643ca7/a2336515230ad39b.png)

点击 [此处](http://labs.qiang.it/qqpai/test/wcn/console/console.html) 可查看例子啦~~

## 3. 字符画

那字符画是怎么做到的呢？臣妾可以做到，哈哈哈哈。

把下面的代码粘贴在console控制台可查看效果哟~~

```
console.log("%c\n                                           :J:    \n                                          :. i    \n                  ..:::::::,:.,.,..:..::rr    J   \n               ::i:,               FB         ,v  \n  .i:i:   .:::7                     B.         :7 \n  7:  ,rri:  @B      .vOB@B@B@BY                ,:\n  Y          1       B@B@BkB@Pr        7,        :\n ::                                  ,7:.:      .i\n.i          .                      :7: .r.::i:::: \nr         i .7:,               .:ri:  ;i          \n7        77;.  .iii:::::::::iii:.    7,           \n :i:.,::;.  :r,      .....         i7             \n   .. .       :ii.               .v:              \n                .ii:.          .rr                \n                   .iii.      ii.                 \n                        i@8GB@                    \n                        vj1ULri                   \n                       7.     r.                  \n                  .,  ,r      ,;                  \n                  .E  0   %cJD   %c7                  \n                   jii2        u                  \n                    1i,   ::i. J                  \n                    i J  E   L v                  \n                   ,:iY 17   ::7                  \n                   iL ,iL7    rr                  \n                   Si r::5    i7                  \n                   ,  r       .v                  ","color: #000","color: #f00","color: #000")
```

没错了，效果是长这样子的：

![JOY](https://img20.360buyimg.com/ling/jfs/t1/38744/5/9180/212546/5d077880Ec3a39991/65d4eedc44e19220.jpg)

你不会天真地认为，我是手打这个京东狗出来的吧？！

不不不，有神器相助！

这里推荐三个ASCII字符画制作工具：

* 在线工具[picascii](http://picascii.com/)

* 在线工具[img2txt](http://www.degraeve.com/img2txt.php)

* ASCII Generator功能比较齐全，不过需要下载使用噢~ 下载参考地址：[ASCII Generator Portable(将图片转为字符画) v2.0下载](http://pan.baidu.com/share/link?shareid=3161588673&uk=3509597415)


ASCII Generator使用方法如下：

1. 首先载入图片，然后调节大小、字体、亮度对比度、抖动程度，直到自己满意后，将其复制出来： ![joy and ascii gen](https://img14.360buyimg.com/ling/jfs/t1/58861/40/2517/60222/5d0778a1E02a18418/9045db15995e78ee.jpg)

2. 复制到sublime中，将每行开头的换行删除，且替换成\n。最后只有一行代码，即保证没有换行。

3. 最后再丢到console.log("")代码中即可，当然，也可以添加结合%c做出更酷炫的效果。


## 4. 总结

关于兼容性总结：

* 只有开发者工具打开的时候IE8/9才支持console；IE6/7不支持console且抛出错误。
* %c以及%o、%O，IE不支持；而firefox的%o和%O的行为都支持%o。
* %c的背景图展示目前只有firebug支持，chrome故意不支持。
* 链接的不同显示：chrome可点击跳转；火狐默认开发者工具的链接前面需要有一个空格隔开文本才可点击跳转，而firebug总是不可点击；IE不可点击跳转。

最后想说的： 前端人对chrome情有独钟，那招聘信息就只在chrome或者webkit浏览器下显示吧，哈哈。

## 5. 参考链接：

[Diagnose and Log to Console | Web Tools - Google Developers](https://developers.google.com/web/tools/chrome-devtools/debug/console/console-write#string-substitution-and-formatting)

[Console API Reference - Google Chrome](https://developer.chrome.com/devtools/docs/console-api)

[Javascript生成字符画](http://7demo.github.io/Javascript%E7%94%9F%E6%88%90%E5%AD%97%E7%AC%A6-%E5%B7%A5%E5%85%B7%E7%AF%87/)

[Can I use console ](http://caniuse.com/#search=console)

