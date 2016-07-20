title: 精致化页面重构
subtitle: "刚完成了一个项目的开发，本文将分享给大家一些项目中的一些经验与小技巧。"
cover: //img.aotu.io/liqinuo/cover.png
categories: 项目总结
tags:
  - summary
author:
  nick: NoNo
  github_name: liqinuo
date: 2015-11-23 20:23:44
---

<!-- more -->

## 一 布局方式

作为一个注重用户体验的 H5 页面，合适的页面布局方式很重要。
移动端页面常规布局基本分两种：

### 1. 流式布局（响应式宽度自适应布局）

这是普遍使用的方法，流式布局使用这个标签即可自适应所有尺寸的屏幕。
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
```
优点：响应式、简单、兼容好。
缺点：非设计稿尺寸屏幕展现效果可能不是很理想。

### 2. 版式布局（页面等比缩放布局）
**可行方案：**
1. 页面使用 REM 作为页面数值单位运算。
2. 通过 zoom/scale 整体缩放页面。

优点：页面等比缩放，比例与设计稿一致。
缺点：大屏手机等比放大后的体验可能不佳。

### 结论：

两种布局方式各有优劣，项目最终选用流式布局，原因：
1. 部分页面还是与现有项目模块共用，版式布局改动成本偏高，不好维护。
2. 考虑到页面在大屏手机等比放大后的体验可能不佳。
3. 流式布局可以针对大屏手机做一些更灵活的排版（配合媒体查询），达到更好的用户体验。


## 二 设计规范

设计规范也是重要元素之一，条件允许情况下，从开发前期就需要跟设计师达成共识制定了一套设计规范。

**设计规范需要包括：**
页面背景色、文字颜色、边框颜色、各种按钮样式、图标等等全局通用样式。

![设计规范](//img.aotu.io/liqinuo/1.png)


当然除了前期到设计规范，开发过程中这边也需要分离出一些可复用的组件、公共样式，包括：
公共底部、商品组模块、轮播组件等等。


## 三 技巧

### 1. 还原设计稿的 0.5px

> 在 2014 年的 WWDC，“设计响应的 Web 体验” 一讲中，Ted O’Connor 讲到关于“retina hairlines”（retina 极细的线）：在 retina 屏上仅仅显示 1 物理像素的边框。

简单点说就是：在 Retina 屏的设备上，1px 其实相当于  2 个物理像素，所以 1 个物理像素 = 0.5px。

![精致化重构](//img.aotu.io/liqinuo/2.png)

实现 0.5px 有很多种方法，这里比较一下各种处理的优缺点：

#### 1. iOS8 以上支持 0.5px
实现原理：常规属性。

```css
.border {
    border: 0.5px solid red;
}
```
优点：原生、简单、常规写法。
缺点：目前只有 iOS8 以上系统才能支持，iOS7及以下、安卓系统都显示为 0px，可以通过脚本判断系统然后区分处理。

#### 2. CSS 渐变模拟
实现原理：设置 1px 通过 css 实现的背景图片，50%有颜色，50%透明。
```css
.border {
    background-image:linear-gradient(180deg, red, red 50%, transparent 50%), linear-gradient(270deg, red, red 50%, transparent 50%), linear-gradient(0deg, red, red 50%, transparent 50%), linear-gradient(90deg, red, red 50%, transparent 50%);
    background-size: 100% 1px, 1px 100%, 100% 1px, 1px 100%;
    background-repeat: no-repeat;
    background-position: top, right top, bottom, left top;
    padding: 10px;
}
```
优点：兼容性较好，单边框、多边框可实现，大小、颜色可配置。
缺点：代码量多、无法实现圆角、同时占用了背景样式

#### 3. 阴影
实现原理：利用 css 对阴影处理的方式模拟。
```css
.border {
    -webkit-box-shadow: 0 1px 1px -1px rgba(0, 0, 0, 0.5);
}
```
优点：兼容性较好，单边框、多边框、圆角可实现，大小、颜色、可配置。
缺点：模拟效果强差人意，颜色不好配置。

#### 4. viewport + rem
实现原理：通过设置页面 viewport 与对应 rem 基准值。

```html
<!-- devicePixelRatio = 2：-->
<meta name="viewport" content="initial-scale=0.5, maximum-scale=0.5, minimum-scale=0.5, user-scalable=no">

<!-- devicePixelRatio = 3：-->
<meta name="viewport" content="initial-scale=0.3333333333333333, maximum-scale=0.3333333333333333, minimum-scale=0.3333333333333333, user-scalable=no">
```
优点：兼容比较好，写法跟常规写法无异。
缺点：老项目改用 rem 单位成本较高。

#### 5. border-image
实现原理：通过图片配合边框背景模拟。
```css
.border-image{
    border-image: url() 2 0 stretch;
    border-width: 0 0 1px;
}
```
优点：无。
缺点：图片边缘模糊，大小、颜色更改不灵活。

#### 6. CSS3 缩放
实现原理：利用 :before/:after 重做 border，配合 scale 使得伪元素缩小一半
```scss
$bor_style : 1px solid #ddd;
%border-top-1pt {
    content: '';
    height: 0;
    display: block;
    border-bottom: $bor_style;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
}
@media only screen and (-webkit-min-device-pixel-ratio:2) {
    %border-top-1pt {
        -webkit-transform: scaleY(0.5);
        -webkit-transform-origin: 50% 0%;
    }
}
```
优点：实现简单、单边框、多边框、圆角可实现，大小、颜色可配置。
缺点：代码量多，可通过 sass 预处理器处理。

#### 总结：
经过比较与实操测试，最好的处理方式是 CSS3 缩放，目前项目已经在广泛使用。


### 2. Flexbox 布局

> Flexbox Layout（弹性盒模型）模块（目前W3C工作草案正在最后通过）的目的是为了提供一种更有效的方式来布局，使各模块即使大小是未知或者动态的也可以在项目空间中合理分配位置（就像“弹性”这个词一样）。

项目哪些地方可以使用 flexbox？比如这些

![精致化重构](//img.aotu.io/liqinuo/3.png)

#### 基本语法：
```css
ul {
    display: box;
    display: -webkit-box;
    display: flex;
    display: -webkit-flex;
}
ul li {
    display: block;
    flex: 1;
    -webkit-flex: 1;
    box-flex: 1;
    -webkit-box-flex: 1;
}
```

### 3. 元素水平垂直居中

实现的方法有很多种，下面几种比较常用：

#### 1. 表格方法：
实现方法：表格内容本来就是垂直居中的，可以通过模拟表格处理。
```html
<div class="box_center">
    <div class="inner"></div>
</div>
```
```scss
.box_center {
    display: table-cell;
    width: 300px;
    height: 300px;
    text-align: center;
    vertical-align: middle;
}
.box_center .inner {
    display: inline-block;
}
```
#### 2. vertical-align: middle
实现方法：利用空元素占位实现
```html
<div class="box_center">
    <div class="placeholder"></div>
    <div class="inner"></div>
</div>
```
```css
.box_center {
    width: 300px;
    height: 300px;
    text-align: center;
}
.box_center .inner {
    display: inline-block;
}
.box_center .placeholder {
    display: inline-block;
    width: 0;
    height: 100%;
    vertical-align: middle;
}
```

#### 3. 绝对定位
```css
%box_center {
    width: 300px;
    height: 300px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
}
```

#### 4. 使用 transform 实现
```css
%box_center {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}
```
兼容性：Android2.3 系统浏览器不支持容器直接使用 fixed 进行定位，外加 fixed 容器可解决。

#### 结论：

经过各种场景的适用型比较，项目使用  transform 实现，兼容性好且使用方便。


### 4. 图片占位

图片未加载出来之前浏览器是无法计算出图片实际尺寸的，所以会出现一个问题，页面刚打开各种元素会因为图片未完全加载而跳动/错位。

这里推荐一种兼容性很好做法简单的方法：

**实现原理：**
通过图片宽高比例计算出图片所需占位空间，赋值于外容器，图片再绝对定位在等比缩放的容器当中。
```css
.placeholder {
    position: relative;
    overflow: hidden;
    width: 100%:
    height: 0;
    padding-top: 100%:
}
.placeholder img {
    display: block;
    width: 100%;
    height: auto;
    position: absolute;
    left: 0;
    top: 0;
}
```

**计算公式：**
padding-top = 图片高度(px)/图片宽度(px) * 100%

**比如：**
1:1 比例的图片 padding-top: 100%;
2:1 比例的图片 padding-top: 50%;


## 四 尽可能减少样式图片

大多图标元素都可以使用 CSS 样式绘制，可以大大减少样式图资源请求还有增强图标可维护性。
比如：链接箭头、圆点、优惠券点点、选择框、checkbox等等。

![精致化重构](//img.aotu.io/liqinuo/4.png)


## 五 使用 WebP 格式图片

> WebP 格式，由 google 于 2010 年推出的新一代图片格式，在压缩方面比 JPEG 格式更优越，并能节省大量的服务器带宽资源和数据空间。与 JPEG 相同，WebP 也是一种有损压缩，主要优势在于高效率。在质量相同的情况下，WebP 格式图像的体积要比 JPEG 格式图像小 40%。

项目中大部分页面素材图都使用了 WebP 格式，兼容方案：

1. **打开场景是浏览器：**通过 javascript 检测，对支持 WebP 的用户输出 WebP 格式图片。
WebP 支持 插件：http://webpjs.appspot.com/

2. **打开场景是APP：**根据不同系统使用 Android WebP 解析库或iOS WebP 解析库做兼容解析。
Android4.0 以下解析库：https://github.com/alexey-pelykh/webp-android-backport
iOS 解析库：https://github.com/carsonmcdonald/WebP-iOS-example

PS：除了 Android4.0 以上提供原生支持

资料参考：http://isux.tencent.com/introduction-of-webp.html

**结论：**
保证图片高清质量的同时，大大压缩了图片大小，节省了服务器带宽资源和数据空间。

## 六 APP缓存策略
注： APP缓存策略由开发同学提供

### 1. 缓存方式

- 模块化的使用 APP 缓存，写入磁盘，包括 HTML、JS、CSS。

- 图片使用浏览器缓存，稳定后的背景图以及常用图片也使用 APP 缓存。

### 2. 缓存更新
 
- **主模块更新：**APP 打开就发送主模块版本号到服务端，返回有更新的模块内容以及版本号，并且返回所有模块版本索引。

- **子模块更新：**进去一个主模块，在加载完成后，会检查所有子模块版本索引，并获取需要更新的模块内容。

- **当前模块更新：**在直接打开模块时（非首页进入），会去 check/更新一下当前版本，然后在加载。

