title: 前方有坑，请绕道——Zepto 中使用 CORS
subtitle: "一直以来，我们在移动端上面使用 zepto 并没有出现太大的问题。直至我们将 Ajax 跨域请求从 iframe 的方式切换成 CORS 之后。"
date: 2015-10-26 12:24:22
cover: //img.aotu.io/Koppthe/cors-zepto.jpg
categories: Web开发
tags:
  - Zepto
  - CORS
author:
  nick: koppt
  github_name: Koppthe
---

众所周知，现在移动 Web 开发中，`Zepto.js` 是使用频率比较高的库之一。由于它的体积小，加载速度快，有着和 `jquery` 类似的 API，而备受开发者喜爱。可随着时间的推移，我们遇到了不少 `Zepto` 的坑，而且文件体积的大小跟代码的执行效率并没有什么关系，最后我们发现 `Zepto` 并没有太大的卵用。

jsperf 上有个 `zepto` 和 `jquery` DOM 操作的对比测试，有兴趣可以看一下：[zepto vs jquery - selectors](http://jsperf.com/zepto-vs-jquery-2013/25)

>开源项目好坏的一个评判标准之一：是否有一个强大的社区和一批积极的贡献者


我们简单的看一个对比：
![zepto github](http://jdc.jd.com/fd/blog_image/cors_pic_01.jpg)
![jquery github](http://jdc.jd.com/fd/blog_image/cors_pic_02.jpg)

很明显，`Zepto` 的活跃度远远没有 `jquery` 高。不过言归正传，还是回到 `Zepto` 的话题上。

---

一直以来，我们在移动端上面使用 `zepto`并没有出现太大的问题。直至我们将 Ajax 跨域请求从 iframe 的方式切换成 `CORS` 之后，一个比较隐蔽的 Bug 出现了。

### 问题描述

1. 页面在Webview中，点击按钮无效
2. 页面在部分浏览器中，无法拉取到用户的信息

### 问题定位

我通过 `Fiddler` 或 `Charles` 抓包发现，在 webview 中，点击按钮之后的 Ajax 请求并未发出，但是页面在手机QQ浏览器和 PC 上表现都是正常的。因为是在切换 CORS 之后，页面才出现异常的，在此之前并没有版本迭代。所以 CORS 代码首当其冲要进行深层次的 code-review，于是我直接在 `CORS` 的代码块上进行 `try-catch`，结果捕获到异常：

`INVALID_STATE_ERR: DOM Exception 11`


### 问题深入剖析

先来看看测试代码：

```
if (options.withCredentials) {
    options = $.extend(options, {
        xhr: function() {
            var xhr = new window.XMLHttpRequest()
         xhr.withCredentails = true
         return xhr
     }
}}
delete options.withCredentails

$.ajax(options)
```


这段代码在大多数浏览器中都可以正常执行，但是在 Android 的 webview 和一些旧版本的手机浏览器中会抛出错误。

以上代码和普通的 Ajax 请求不同的地方在于设置了 `CORS` 的 `withCredentials` 属性。（`CORS` 请求默认是不会带上 `cookies` 等身份信息的，如果需要在请求中带上 `cookies`，则需要设置 `XMLHttpRequest` 的 `withCredentials` 属性值为 true）

下面通过两个例子来分析一下：

例一：

```
var xhr = new XMLHttpRequest()
xhr.withCrendentials = true
xhr.open('POST', 'url', true)
xhr.send()
```

这段代码在部分浏览器中依旧会抛出异常：`INVALID_STATE_ERR: DOM Exception 11`

例二：

```
var xhr = new XMLHttpRequest()
xhr.open('POST', 'url', true)
xhr.withCredentials = true
xhr.send()
```

这段代码可以正常执行，并不会抛出异常
为什么 `xhr.withCredentials` 赋值在 `xhr.open()` 方法之前就会出错呢？

秉着科(xian)学(de)严(dan)谨(teng)的态度，翻看了 W3C 在 2011 年和 2012 年关于 `XMLHttpRequest` 的规范文档，发现使用 `withCredentials` 属性的规范发生了改变。

2011 年的规范：
![2011 CORS](http://jdc.jd.com/fd/blog_image/cors_pic_03.png)

2012 年的规范：
![2012 CORS](http://jdc.jd.com/fd/blog_image/cors_pic_04.png)

对比两份文档，我们重点看一下 step 1：
2011 年的规范中规定当 `XMLHttpRequest` 的 `readyState` 状态不是 `OPENED` 时，会报错；
2012 年的规范中规定当 `XMLHttpRequest` 的 `readyState` 状态不是 `UNSENT` 或 `OPENDED` 时，会报错；

下面简单介绍一下 `XMLHttpRequest` 的 `readyState` 值：

| Value  | State | Description |
| ------ | ----------- | -----------|
| 0 | UNSENT | open() has not been called yet. |
| 1 | OPENED | send() has not been called yet. |
| 2 | HEADERS_RECEIVED | send() has been called,and headers and status are available. |
| 3 | LOADING | Downloading;responseText holds partial data |
| 4 | DONE | The operation is complete |

由此可以看出，当一个 `XMLHttpRequest` 对象被创建时，默认的 `readyState` 状态为 `UNSENT`，只有执行了 open() 方法并且还没有执行 send() 方法时，`readyState` 的状态才为 `OPENED`。

由于一些老版本的浏览器是按照 2012 年之前的规范来实现的，所以这一部分浏览器中，open() 方法要在设置 `withCredentials` 属性之前调用。因此为了兼容，正确的做法应该是在 open() 方法之后再设置 `withCredentials` 属性。

下面来看看 zepto.js v1.1.3 的源码：
```
if (settings.xhrFields) for (name in settings.xhrFields) xhr[name] = settings.xhrFields[name]

var async = 'async' in settings ? settings.async : true

xhr.open(settings.type, settings.url, async, settings.username, settings.password)
```

`zepto` 是在 open() 方法之前设置 `XMLHttpRequest` 的属性值的，所以这会导致在使用 `CORS` 并且设置 `withCredentials` 的时候，代码在部分浏览器中报错。Android webview 中重现的几率很大。

----

总结：在使用 `CORS` 时，如果要给 `withCredentials` 赋值，请务必要在 open() 方法之后，否则无法向后兼容。

对于 zepto.js 的问题，已经有用户向作者提交了 PR，作者也表示会在下个版本中修复（可是直到今天，都更新到 v1.1.6 版本了，还是没有修复这个问题，更改一下代码顺序就那么难吗？！难怪阿里也嫌 zepto 更新速度太慢，问题多，所以自己 fork 代码进行了定制化）。

所以目前如果要用 `zepto` 来进行 `CORS` 的话，还是需要自己更改 `zepto` 的 ajax 模块代码，然后手动构建。

----

### 参考资料：

[XMLHttpRequest Level 2 2011](http://www.w3.org/TR/2011/WD-XMLHttpRequest2-20110816/#the-withcredentials-attribute)
[XMLHttpRequest Level 1 2014](http://www.w3.org/TR/XMLHttpRequest/)
[XMLHttpRequest Level 2 2014](http://www.w3.org/TR/XMLHttpRequest2/)
[Zepto issues](https://github.com/madrobby/zepto/issues/921)

