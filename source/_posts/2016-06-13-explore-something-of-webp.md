title: 探究WebP一些事儿
subtitle: WebP图片格式是提升用户体验的一大利器，本文通过探究WebP的一些细节来说明WebP能够给我们带来的提升。
cover: //img.aotu.io/FufVMQ_IV5Z_fGJa12AHNgs63sR2
categories: 性能优化
tags:
  - WebP
  - 图片
author:
  nick: WEN
  github_name: wengeek
date: 2016-06-23 10:43:31
---

<!-- more -->

### 前言

不管是PC还是移动端，图片一直是流量大头。不管是在京东首页还是频道页，商品图片以及广告图片占据了大部分的流量。

评价网站性能好坏的一个主要指标就是页面响应时间，也就是说用户打开完整页面的时间。基于JEPG还有PNG图片格式的网页，其图片资源加载往往都占据了页面耗时的主要部分，那么如何保证图片质量的前提下缩小图片体积，成为了一件有价值的事情。

而如今，对JPEG、PNG以及GIF这些格式的图片已经没有太大的优化空间。但是，Google推出的WebP图片格式给图片优化提供了另一种可能。

WebP是一种支持有损压缩和无损压缩的图片文件格式，根据Google的测试，无损压缩后的WebP比PNG文件少了26％的体积，有损压缩后的WebP图片相比于等效质量指标的JPEG图片减少了25％~34%的体积。

通过研究WebP图片格式，尽可能全面地了解WebP图片的优劣势以及应用WebP图片给我们带来的收益以及风险，最终提升用户体验。

### WebP探究

京东商品图以及频道页广告图目前基本为JPG图片，以下数据主要为JPG和WebP图片的对比，测试图片采用京东商品图。

#### WebP兼容性

![](//img.aotu.io/FmUIiSK5GnaMRnywosGR2wARtOhx)

WebP目前支持桌面上的Chrome和Opera浏览器，手机支持仅限于原生的Android浏览器、Android系统上的Chrome浏览器、Opera Mini浏览器。

![](//img.aotu.io/FimDJyH6sC_n3qQeNQiVMHmBF831)

根据对目前浏览器占比与WebP的兼容性分析，如果采用WebP图片，大约有42%的用户可以直接体验到。

#### WebP命令行工具安装

Google提供了命令行工具用于将图片转换为webp。

在Mac下，可以使用homebrew安装webp工具：

```sh
brew install webp
```

Linux采用源码包来安装（CentOS下）：

```sh
yum install -y gcc make autoconf automake libtool libjpeg-devel libpng-devel# 安装编译器以及依赖包
wget https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-0.5.0.tar.gz
tar -zxvf libwebp-0.5.0.tar.gz
cd libwebp-0.5.0
./configure
make
make install
```

安装完命令行工具后，就可以使用cwebp将JPG或PNG图片转换成WebP格式。

```sh
cwebp [-preset <...>] [options] in_file [-o out_file]
```

options参数列表中包含质量参数q，q为0～100之间的数字，比较典型的质量值大约为80。

也可以使用dwebp将WebP图片转换回PNG图片（默认）。

```sh
dwebp in_file [options] [-o out_file]
```

更多细节详见[使用文档](https://developers.google.com/speed/webp/docs/using)

#### WebP优势

下面我们以一张图片为例，分别用不同质量进行压缩。

![](//img.aotu.io/FsK4nvnPq8-LKmgUMAyQpPVzX0Wk)

WebP图片相比于JPG，拥有：

1. 更小的文件尺寸;
2. 更高的质量——与其他相同大小不同格式的压缩图像比较。

目标图像的质量和文件大小之间存在明显的折中关系。在很多情况下，可以很大程度降低图像的大小，而用户却几乎不会注意到其中的差别。

抽取100张商品图片，采用80%有损压缩，大约能减少60%的文件大小。

更多[测试](http://labs.qiang.it/wen/webp/compare.html)。

#### WebP劣势

根据Google的测试，目前WebP与JPG相比较，编码速度慢10倍，解码速度慢1.5倍。

在编码方面，一般来说，我们可以在图片上传时生成一份WebP图片或者在第一次访问JPG图片时生成WebP图片，对用户体验的影响基本忽略不计，主要问题在于1.5倍的解码速度是否会影响用户体验。

下面通过同样质量的WebP与JPG图片加载的速度进行[测试](http://labs.qiang.it/wen/webp/test.html)。测试的JPG和WebP图片大小如下：

![](//img.aotu.io/Fng21Plg7-00b3HKFe48nLIgP_fn)

测试数据折线图如下：

![](//img.aotu.io/FrvS4mf268RBStCsJSt-gbXuINrz)

从折线图可以看到，WebP虽然会增加额外的解码时间，但由于减少了文件体积，缩短了加载的时间，页面的渲染速度加快了。同时，随着图片数量的增多，WebP页面加载的速度相对JPG页面增快了。所以，使用WebP基本没有技术阻碍，还能带来性能提升以及带宽节省。

### 技术方案

在浏览器中可以采用JavaScript检测是否支持WebP，对支持WebP的用户输出WebP图片，否则输出其他格式的图片。

JavaScript检测是否支持WebP代码如下：（出自Google官方文档）

```javascript
function check_webp_feature(feature, callback) {
    var kTestImages = {
        lossy: "UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA",
        lossless: "UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==",
        alpha: "UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==",
        animation: "UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA"
    };
    var img = new Image();
    img.onload = function () {
        var result = (img.width > 0) && (img.height > 0);
        callback(feature, result);
    };
    img.onerror = function () {
        callback(feature, false);
    };
    img.src = "data:image/webp;base64," + kTestImages[feature];
}
```

在浏览器向服务器发起请求时，对于支持WebP图片的浏览器，会在请求头Accept中带上image/webp的信息，服务器便能识别到浏览器是否支持WebP，在服务器中处理图片。

#### 懒加载图片

采用JavaScript能力检测的方式来加载WebP图片，通常的做法是通过图片懒加载的方式来完成。主要流程如下：

![](//img.aotu.io/Fslo9RsJ9z99hptjl5aRIkFVrGU5)

页面加载会很快，无需等待图片加载。之后，javascript代码会动态地更新图片标签，根据浏览器支持WebP格式与否，动态生成WebP图像或JPG图像链接。

#### PageSpeed自动转换模块

Google开发的PageSpeed模块有一个功能，会自动将图像转换成WebP格式或者是浏览器所支持的其它格式。

以nginx为例，它的设置很简单。

首先在http模块开启pagespeed属性。

```
pagespeed on;
pagespeed FileCachePath "/var/cache/ngx_pagespeed/";
```

然后在你的主机配置添加如下一行代码，就能启用这个特性。

```
pagespeed EnableFilters convert_png_to_jpeg,convert_jpeg_to_webp;
```

我们可以看下经过转换后的代码：

页面原始代码：

```html
<!doctype html>
<html>
  <head>
    <title>pagespeed</title>
  </head>
  <body>
    <img src="./574ceeb8N73b24dc2.jpg" />
    <img src="./6597241290470949609.png" />
  </body>
</html>
```

Chrome打开后源码如下：

```html
<!doctype html>
<html>
  <head>
    <title>pagespeed</title>
  </head>
  <body>
    <img src="x574ceeb8N73b24dc2.jpg.pagespeed.ic.YcCPjxQL4t.webp"/>
    <img src="x6597241290470949609.png.pagespeed.ic.6c5y5LYYUu.webp"/>
  </body>
</html>
```

Safari打开如下：

```html
<!doctype html>
<html>
  <head>
    <title>pagespeed</title>
  </head>
  <body>
    <img src="x574ceeb8N73b24dc2.jpg.pagespeed.ic.3TXX_PUg99.jpg"/>
    <img src="x6597241290470949609.png.pagespeed.ic.rrgw7vPMd6.png"/>
  </body>
</html>
```

更多详见ngx_pagespeed文档：[https://developers.google.com/speed/pagespeed/module/build_ngx_pagespeed_from_source#dependencies](https://developers.google.com/speed/pagespeed/module/build_ngx_pagespeed_from_source#dependencies)

### 总结

很明显，WebP格式是提升用户体验的又一利器，虽然浏览器对WebP的支持仍有很多需要改进的地方，但是通过是使用一些工具和技术，能够体会到WebP的好处，使得页面加载速度更快，同时节省了带宽。
