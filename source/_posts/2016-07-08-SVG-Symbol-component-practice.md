title: 拥抱Web设计新趋势：SVG Sprites实践应用
subtitle: 文章从讲解SVG用法到快速导出到SVG、SVG Symbol组件化在项目中实战进行讲解，并提供SVG Symbol快速导出工具，教你如何提高SVG开发效率减少成本。
cover: "//misc.aotu.io/pfan123/hob/svg.png"
tags:
  - svg
  - svg symbol
  - svg sprites
categories:
  - Web开发
author:
  nick: 高大师
  github_name: pfan123
date: 2016-07-08 18:01:17
---

<!-- more -->
## 前言

随着移动互联网的到来，各种高清屏幕移动设备的层出不穷，导致H5应用在移动设备`retina`屏幕下经常会遇到图标不清晰的问题。

为了解决屏幕分辨率对图标影响的问题，通常采用CSS Sprite，Icon Font，CSS Icon以及SVG以适应@x1屏、@2屏、@3屏，相对比较而言SVG矢量性、缩放无损等诸多优点，更应受前端设计师的青睐，可在许多公司的移动项目应用中却很鲜见，究其主因在于SVG开发学习成本比较高以及在绘制的性能上比PNG要差。此篇文章将从SVG快速导出到SVG、SVG Symbol组件化在项目中实战进行讲解，并提供SVG Symbol快速导出工具，教你如何提高SVG开发效率减少成本。

## SVG简介

SVG是一种开放标准的矢量图形语言，使用`svg`格式我们可以直接用代码来描绘图像，可以用任何文字处理工具打开`svg`图像，通过改变部分代码来使图像具有交互功能，并可以随时插入到HTML中通过浏览器来浏览。

### SVG优缺点：

优点 | 缺点 
--- | --- 
1.缩放无损还原，显示清晰 | 1.SVG在绘制的性能上比PNG要差
2.语义性良好 | 2.局限性，对应单色或普通渐变没什么问题，但对不规则的渐变以及特效叠加效果显示不全
3.可用CSS控制图标样式以及动画 | 3.兼容性稍差，android4.1才开始支持
4.减少http请求 | 4.学习应用成本较高

### PS：SVG 为什么没有替代 iconfont？

1.PC 端 SVG 有兼容性问题，因此 PC 端还是用 iconfont 比较靠谱。那么，与其为移动端多弄一套 SVG 方案，为什么不直接公用同一套 iconfont 库？成本问题。

2.知道 SVG Sprite 的人不多，而 iconfont 俨然成为前端面试必考题了。

3.抛开兼容，再就是SVG的局限性:单色或线性渐变(从左向右笔直进行渐变)，径向渐变(从内到外进行圆形渐变)都没问题、但是不规则的渐变、就实现不了了。

4.SVG比图片麻烦、设计稿如果不优化节点、直接导出、代码量那个惊人，然而ai导出的SVG代码、节点优化后，也不能直接用、还得小改、总体来说SVG比图片好耗费功力太多。

## Web应用中SVG的使用方式

#### 1.使用img、object、embed 标签直接引用SVG
此方法的缺点主要在于每个图标都需单独保存成一个 SVG 文件，使用时单独请求，增加了HTTP请求数量。

```
<img src="http://www.w3school.com.cn/svg/rect1.svg"  width="300" />

```

#### 2.Inline SVG，直接把SVG写入 HTML 中

Inline SVG 作为HTML文档的一部分，不需要单独请求。临时需要修改某个图标的形状也比较方便。但是Inline SVG使用上比较繁琐，需要在页面中插入一大块SVG代码不适合手写，图标复用起来也比较麻烦。

```
<body>
    <svg width="100%" height="100%">
        <rect x="20" y="20" width="250" height="250" style="fill:#fecdddd;"/>
    </svg>
</body>
```

#### 3.SVG Sprite

这里的Sprite技术，类似于CSS中的Sprite技术。图标图形整合在一起，实际呈现的时候准确显示特定图标。其实基础的SVG Sprite也只是将原来的位图改成了SVG而已，控制SVG大小、颜色需要重新合并SVG文件。

```
.icon-bg{
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url(./res/svg-sprite-background.svg);
    background-size:100% 100%;
}
.icon-facebook-logo{
    background-position: 0 0;
}
.icon-earth{
    background-position: 0 -30px;
}


<span class="icon-bg icon-facebook-logo"></span>
<span class="icon-bg icon-earth"></span>
```
#### 4.使用 SVG 中的 symbol，use 元素来制作SVG Sprite
SVG Symbols的使用，本质上是对Sprite的进一步优化，通过`<symbol>`元素来对单个SVG元素进行分组，使用`<use>`元素引用并进行渲染。这种方法的解决了上述三种方式带来的弊端，少量的http请求，图标能被缓存方便复用，每个SVG图标可以更改大小颜色，整合、使用以及管理起来非常简单。

①SVG Symbols作为body的第一个元素插入在HTML中使用：

```
<body>
    <svg style="width:0; height:0; visibility:hidden;position:absolute;z-index:-1">
        <symbol viewBox="0 0 24 24" id="heart">
            <path fill="#E86C60" d="M17,0c-1.9,0-3.7,0.8-5,2.1C10.7,0.8,8.9,0,7,0C3.1,0,0,3.1,0,7c0,6.4,10.9,15.4,11.4,15.8 c0.2,0.2,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C13.1,22.4,24,13.4,24,7C24,3.1,20.9,0,17,0z"></path>
        </symbol>
    </svg>

    <svg>
        <use xlink:href="#heart"/> 
    </svg>
</body>
```

②使用完整路径引用Icon（此方法涉及到跨域问题）

存在跨域问题，同域可以使用。

```
<body>
    //路径形式进行获取icon
    <svg>
        <use xlink:href="/asset/svg-symbols.svg#heart"/> 
    </svg>
     <svg>
        <use xlink:href="/asset/svg-symbols.svg#heart"/> 
    </svg> 
</body>
```

③js控制SVG写入body进行引用

推荐使用，有效分离结构和展现、解决缓存以及跨域问题。

svg.js:
```
var symbols = '<svg style="width:0; height:0; visibility:hidden;position:absolute;z-index:-1">
        <symbol viewBox="0 0 24 24" id="heart">
            <path fill="#E86C60" d="M17,0c-1.9,0-3.7,0.8-5,2.1C10.7,0.8,8.9,0,7,0C3.1,0,0,3.1,0,7c0,6.4,10.9,15.4,11.4,15.8 c0.2,0.2,0.4,0.2,0.6,0.2s0.4-0.1,0.6-0.2C13.1,22.4,24,13.4,24,7C24,3.1,20.9,0,17,0z"></path>
        </symbol>
    </svg>';
document.body.insertAdjacentHTML("afterBegin",symbols)
```
svg.html:
```
<body>
    //脚本需在svg use引用之前引入
    <script src = "/asset/svg.js"></script>
    
    <svg>
        <use xlink:href="#heart"/> 
    </svg>
</body>
```
## SVG快速导出

### SVG导出工具：
- Photoshop CC 2015 以上版本均支持导出SVG功能
- Adobe Illustrator 导出
- [export-photoshop-layer-to-svg](http://hackingui.com/design/export-photoshop-layer-to-svg/)基于photoshop的SVG导出插件
- [export-svg-with-fireworks](http://firetuts.com/export-svg-with-fireworks/)基于firework的SVG导出插件

### Photoshop CC 2015 导出SVG使用

Ps可以对矢量图层进行导出，即通过矢量工具绘制所在图层或图层文件夹进行导出，若对不是矢量图形进行导出，可能会引起错误或者导出的文件是位图。

SVG导出，建议图形一定要撑满整个画布，若存在间隙，网页使用时图标居中对齐就会比较麻烦。

1.批量导出SVG
批量导出SVG，只需在矢量图层或失落图层文件夹名后添加相应格式后缀（如.svg)，依次点击菜单“文件->生成->图像资源”，确认该菜单项已被勾选。但是此方法会根据icon实际大小进行导出，若icon图标存在小数导出就不太适用，我们需要手动去调节。

![export](//misc.aotu.io/pfan123/hob/export.png)

2.设置导出为单个导出
设置导出为单个导出，选中矢量图层单击右键，依次点击“导出为->设置参数->导出”，此方法可以设置SVG的图像实际大小，以及画布大小。

导出为：

![export](//misc.aotu.io/pfan123/hob/export2.png)

设置导出SVG图像实际大小，以及画布大小：

![export](//misc.aotu.io/pfan123/hob/export1.png)

## SVG Symbol自动化合并生成
Photoshop导出来的是单个SVG文件，需要将这些单个SVG文件进行合并生产`symbol`的SVG，这样才能通过`symbol＋use`进行引用。可以使用手工合并，推荐使用工具，安利给大家一个专门用于处理SVG Symbols用的glup插件[gulp-svg-symbols](https://github.com/Hiswe/gulp-svg-symbols)。

下面我们就来以一个实例一步一步来使用下这个插件。

首先新建一个文件夹，目录结构如下图所示：

```
 assets
    ├── svg   //存放ps导出的大量svg文件
        ├── xxx.svg
        ├── xxx.svg
        ├── xxx.svg
    ├── out
    ├── gulpfile.js 
    ├── package.json 
    ├── index.html
```

安装gulp-svg-symbols插件,若没有预先安装gulp请先行安装:

```
npm i gulp-svg-symbols  --save
```

`gulpfile.js`写入如下执行任务：

```
'use strick';
const gulp = require("gulp");
const symbols = require("gulp-svg-symbols");

//转换svg
gulp.task('svg', () => {
  return gulp.src('./svg/**')
    .pipe(symbols())
    .pipe(gulp.dest('out/'))
});
```

执行任务导出svg-symbols：
```
gulp svg  //out文件夹，生成svg-symbols.svg，svg-symbols.css（此文件对应svg样式，基本无用）
```

## SVG Symbol可视化工具

为了方便快速批量合成SVG图标生成 SVG Symbol，提高效率，我们开发了简易版的SVG Symbol可视化工具`svg tool`。

### svg tool使用：

打开后界面

![export](//misc.aotu.io/pfan123/hob/svgtool.png)

#### 使用范围：

主要支持单层结构SVG进行合并生产symbol，对于多层结构SVG合并注意手动修改对应颜色。

#### 功能：

- 1.支持拖拽文件夹，自动遍历SVG文件合并生成symbol文件。

- 2.提供两种导出方式，正常模式、修正模式。

- 3.对文件viewBox大小不为整进行提示，可以选择自动修正模式系统自动放大处理。

- 4.导出svg-symbol.svg、svg-symbol.js，可直接引入svg-symbol.js方便使用。


svg tool下载地址：

mac：[http://jdc.jd.com/svg/svgtoolfile/svgtool-1.0.0.dmg](http://jdc.jd.com/svg/svgtoolfile/svgtool-1.0.0.dmg)

win32: [http://jdc.jd.com/svg/svgtoolfile/svgtool-win32-ia32.zip](http://jdc.jd.com/svg/svgtoolfile/svgtool-win32-ia32.zip)

win64: [http://jdc.jd.com/svg/svgtoolfile/svgtool-win32-x64.zip](http://jdc.jd.com/svg/svgtoolfile/svgtool-win32-ia32.zip)

参考资料：

- [Web 设计新趋势: 使用 SVG 代替 Web Icon Font](https://io-meter.com/2014/07/20/replace-icon-fonts-with-svg/)
- [Android微信上的SVG](http://mp.weixin.qq.com/s?__biz=MzAwNDY1ODY2OQ==&mid=207863967&idx=1&sn=3d7b07d528f38e9f812e8df7df1e3322&scene=4#wechat_redirect)
- [使用SVG中的Symbol元素制作Icon](https://isux.tencent.com/16292.html)
- [突袭HTML5之SVG 2D入门](http://www.cnblogs.com/dxy1982/tag/svg/)
- [CSS Trick 中总结的 Icon Font使用缺陷](http://css-tricks.com/icon-fonts-vs-svg/)
- [svg理解与运用](https://jarevrygo.gitbooks.io/webbook/content/5-2-1svgli_jie_yu_yun_yong.html)