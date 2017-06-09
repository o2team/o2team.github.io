title: 探讨判断横竖屏的最佳实现
subtitle: 简述多种横竖屏判断的实现方式以及其中的优缺点，并探讨最佳的实现方式
cover: //misc.aotu.io/Tingglelaoo/detect-orientation_900x500.png
date: 2017-01-31 09:27
categories: Web开发
tags:
  - 横竖屏
  - Javascript
author:
    nick: Tingglelaoo
    github_name: Tingglelaoo
wechat:
    share_cover: http://misc.aotu.io/Tingglelaoo/detect-orientation_200x200.png
    share_title: 探讨判断横竖屏的最佳实现
    share_desc: 简述多种横竖屏判断的实现方式以及其中的优缺点，并探讨最佳的实现方式


---
<!-- more -->

在移动端，判断横竖屏的场景并不少见，比如根据横竖屏以不同的样式来适配，抑或是提醒用户切换为竖屏以保持良好的用户体验。
判断横竖屏的实现方法多种多样，本文就此来探讨下目前有哪些实现方法以及其中的优缺点。

## CSS Media Queries

通过媒体查询的方式，我们可以通过以下方法来实现根据横竖屏不同的情况来适配样式：

### 1.内联样式

```scss
@media screen and (orientation:portrait) {
    //竖屏
}

@media screen and (orientation:landscape) {
    //横屏
}
```

### 2.外联样式

```html
<!-- 竖屏 -->
<link rel="stylesheet" media="all and (orientation:portrait)" href="..." />

<!-- 横屏 -->
<link rel="stylesheet" media="all and (orientation:landscape)" href="..." />
```

## window.matchMedia()

除此之外，[CSS Object Model（CSSOM）Views](http://www.w3.org/TR/cssom-view/#dom-window-matchmedia) 规范增加了对 JavaScript 操作 CSS Media Queries 的原生支持，它在 window 对象下增加了 matchMedia() 方法，让我们能够通过脚本的方式来实现媒体查询。

 `window.matchMedia()` 方法接受一个 Media Queries 语句的字符串作为参数，返回一个 MediaQueryList 对象。该对象有 media 和 matches 两个属性：
- media：返回所查询的 Media Queries 语句字符串
- matches：返回一个布尔值，表示当前环境是否匹配查询语句

同时，它还包含了两个方法，用来监听事件：
- addListener(callback)：绑定回调 callback 函数
- removeListener(callback)：注销回调 callback 函数

那么，通过 `window.matchMedia()` 的方法，我们可以这样判断横竖屏：

```javascript
var mql = window.matchMedia("(orientation: portrait)");
function onMatchMeidaChange(mql){
    if(mql.matches) {
        // 竖屏
    }else {
        // 横屏
    }
}
onMatchMeidaChange(mql);
mql.addListener(onMatchMeidaChange);
```

通过[Can I Use - matchMeida](http://caniuse.com/#search=matchmedia)可以知道，该API在移动端得到良好的支持，并无兼容性问题。

## window.innerHeight/window.innerWidth

> The ‘orientation’ media feature is ‘portrait’ when the value of the ‘height’ media feature is greater than or equal to the value of the ‘width’ media feature. Otherwise ‘orientation’ is ‘landscape’.
—— [CSS/Mediaqueries/orientation](https://www.w3.org/community/webed/wiki/CSS/Mediaqueries/orientation)

在 CSS Media Queries 中，Orientation 属性有两个值：
- portrait，指的是当 height 大于等于 width 的情况
- landscape，指的是当 height 小于 width 的情况

所以，还有一种最为常见的方法是通过比较页面的宽高，当页面的高大于等于宽时则认为是竖屏，反之则为横屏。

```javascript
function detectOrient(){
    if(window.innerHeight >= window.innerWidth) {
        // 竖屏
    }else {
        // 横屏 
    }
}
detectOrient();
window.addEventListener('resize',detectOrient); 
```

## window.orientation

在 iOS 平台以及大部分 Android 手机都有支持 `window.orientation` 这个属性，它返回一个与默认屏幕方向偏离的角度值：
- 0：代表此时是默认屏幕方向
- 90：代表顺时针偏离默认屏幕方向90度
- -90：代表逆时针偏离默认屏幕方向90度
- 180：代表偏离默认屏幕方向180度

在 iOS 的开发者文档（[iOS Developer Library - Handling Orientation Events](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html)）是这样明确定义的：

```javascript
switch(window.orientation) {
    case 0:
        displayStr += "Portrait";
        break;

    case -90:
        displayStr += "Landscape (right, screen turned clockwise)";
        break;

    case 90:
        displayStr += "Landscape (left, screen turned counterclockwise)";
        break;

    case 180:
        displayStr += "Portrait (upside-down portrait)";
        break;
}
```

也就是如下图所示：
<div style="margin:0 auto;width:fit-content;">![iPhone-orientation.png](//misc.aotu.io/Tingglelaoo/iPhone-orientation.png)</div>
<small style="display:block;text-align:center;">（图来自[William Malone - DETECT IOS DEVICE ORIENTATION WITH JAVASCRIPT](http://www.williammalone.com/articles/html5-javascript-ios-orientation/)）</small>

在实际应用中，对于 iPhone 和大部分 Android 是没有180度的手机竖屏翻转的情况的，但是 iPad 是存在的。所以，简化下代码，我们可以绑定`orientationchange`事件来判断横竖屏：

```javascript
function detectOrient(){
    if (Math.abs(window.orientation) === 90) {
        // 横屏
    } else {
        // 竖屏
    }
}
detectOrient();
window.addEventListener('orientationchange',detectOrient);
```

## 影响判断的问题所在

### 1.对window.orientation属性值的不一致

在 iOS 平台，对 `window.orientation` 属性值是无异议的，规范当中有明确规定每个值对应的情况。但是对于 Android 平台，就有不一致的特殊情况出现。

[A misconception about window.orientation](https://notes.matthewgifford.com/a-misconception-about-window-orientation-7231235a94c2#.dm7css274)中作者 Matthew Gifford 就有提到部分 Android 机型(该文章中测试用的 Toshiba Thrive 机型)返回的情况是与期望情况是相反的；除此之外，在 StackOverflow 上也有反馈过这样的问题（例如，[window.orientation returns different values in iOS and Android](http://stackoverflow.com/questions/14019939/window-orientation-returns-different-values-in-ios-and-android)中提到的 Samsung Tab 2 机型）。

其实，Matthew Gifford 认为这并不是 BUG（笔者也认同），按照[Compatibility Standard - 4.2 window.orientation API](https://compat.spec.whatwg.org/#event-orientationchange)规范中的定义，`0` 值指的是 natural 、 default 的屏幕方向，所以如果生厂商对 natural 、 default 状态是用户应当手持设备方向为横屏，那么 `0` 值对应为 landscape 的横屏方向了。
针对这种不一致情况的出现，对于追求完美的开发者来说，通过 `window.orientation` 的方法来判断横竖屏则变得有点不可靠的。

### 2.软键盘的弹出

是否除了 `window.orientation` 的其它方法都是可靠的呢？
然而，实际上是事与愿违的。在 Android 下，如果页面中出现软键盘弹出的情况（存在有 Input 的元素）时，页面有时会因为软键盘的弹出而导致页面回缩，即页面的宽度（竖屏时）或者高度（横屏时）被改变。
无论是 CSS Media Queries 还是 `window.matchMedia()` 方法，还是根据 `window.innerWidth` 、`window.innerHeight`的页面宽高比对方法来实现的横竖屏判断方法，都会因此受到影响，出现判断失误的情况（ Samsung SCH-i699 机型，在竖屏时由于软键盘弹出导致页面高度小于宽度，被错误地判定为横屏）。
所以，在这样的情况下，这几种方式也变得不可靠。

## 探讨最佳实现方式

本着核心的原则——具体情况具体解决来讨论。

如果你没有遇上以上两个问题所在，恭喜你！上面所提到的方法都可以被应用，选择你最为喜欢的方法就好。

但是如果想要避免以上两个问题所在，有没有更好的办法呢？

经过实际情况的研究，针对开发环境兼容的情况（ iOS 与 Android 下的微信内置浏览器与原生浏览器）来说，屏幕分辨率是不会改变的，那么我们可以尝试比对页面宽高和屏幕分辨率来判断横竖屏。

需要注意的是，微信内置浏览器页面宽度不包括顶栏部分的，而 Android 和 iOS 的原生浏览器都是带有底栏或顶栏兼有的，如下图所示。

<div style="margin:0 auto;width:fit-content;">![inset-bars.jpg](//misc.aotu.io/Tingglelaoo/inset-bars.jpg)</div>
<small style="display:block;text-align:center;">（图为 iPhone 6s 下的微信内置浏览器与原生浏览器截图）</small>

那么，我们可以确定为：

假如屏幕分辨率固定值为：`screen.width` 和 `screen.height`（需要注意，这里很重要的一点是：<del>**在移动端，屏幕翻转时，`screen.width` 和 `screen.height` 的值依然是不变的**</del>**后面有补充修正，可以直接跳到下一个章节阅读**）

- 若获取 当前页面的宽（`document.documentElement.clientWidth`），等于屏幕分辨率的宽(`screen.width`)，则可认定当前属于**竖屏**。

<div style="margin:0 auto;width:fit-content;">![portrait.jpg](//misc.aotu.io/Tingglelaoo/portrait.jpg)</div>
<small style="display:block;text-align:center;">（图为以 iPhone 6s 竖屏下的微信内置浏览器为例的截图）</small>


- 若获取 当前页面的宽（`document.documentElement.clientWidth`），等于屏幕分辨率的高(`screen.height`)，则可认定当前属于**横屏**。

<div style="margin:0 auto;width:fit-content;">![landscape.jpg](//misc.aotu.io/Tingglelaoo/landscape.jpg)</div>
<small style="display:block;text-align:center;">（图为以 iPhone 6s 横屏下的微信内置浏览器为例的截图）</small>


如此，对应的代码为：

```javascript
function detectOrient() {
    var storage = localStorage;
    var data = storage.getItem('J-recordOrientX');
    var w = document.documentElement.clientWidth,
        h = document.documentElement.clientHeight;

    var _Width = 0,
        _Height = 0;
    if(!data) {
        _Width = window.screen.width;
        _Height = window.screen.height;
        storage.setItem('J-recordOrientX',_Width + ',' + _Height);
    }else {
        var str = data.split(',');
        _Width = str[0];
        _Height = str[1];
    }

    if(w == _Width) {
        // 竖屏
        return;
    }
    if(w == _Height){
        // 横屏
        return;
    }
}
detectOrient();
window.addEventListener('resize',detectOrient);
```

以上是笔者拙劣的见解，如果你有更好的办法解决，欢迎来分享！

## 今后的发展

目前，W3C 引入[Screen Orientation API](https://www.w3.org/TR/screen-orientation/)，该标准能够帮助 Web 应用获得屏幕方向的状态，在状态改变时获得通知，并能够从应用程序中将屏幕状态锁定到特定状态。
但截止目前，该标准仍在 W3C 草案阶段。在移动端，它在 Android 和 iOS 平台上仍未得到支持，仅仅在 Chrome for Android 39 版本及以上才得到实现，所以对目前的开发来说意义不大。只能期待它能够尽快通过并得到广泛支持，这样的检测屏幕方向的问题就能够得到规范化的解决。

## 20170425更新
感谢各位读者的反馈，笔者的自测确实是没有覆盖全面，有些读者反馈的以下几点问题确实存在：
1.在 华为P9 的微信（6.5.4）、华为荣耀的微信（6.5.7）和 Chrome 浏览器上，`screen.width` 与 `screen.height` 均会随着横竖屏的切换而变。
2.另外，笔者也发现在移动端还有一点很重要的点会影响到 `document.documentElement.clientWidth/clientHeight` 的值 —— Meta Viewport的设置。
3.在微信内（其他移动浏览器也会），会多次触发resize事件。

然而，以上三个问题都是不影响本文所提出的方法的核心思想，而只需要将方法进行bug的修正即可。
这里先丢出[体验地址](http://jdc.jd.com/demo/ting/detectOrientation.html)，其中，修正后的源码如下：

```javascript
// 判断横竖屏
var utils = {
    debounce: function(func,delay){
        var timer = null;
        return function(){
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                func.apply(context,args);
            },delay);
        }
    }
}

var detectRes = document.getElementById('J_detectRes');
var detectData = document.getElementById('J_detectData');

function detectOrient() {
    var storage = localStorage; // 不一定要使用localStorage，其他存储数据的手段都可以
    var data = storage.getItem('J-recordOrientX');
    var cw = document.documentElement.clientWidth;

    var _Width = 0,
        _Height = 0;
    if(!data) {
        sw = window.screen.width;
        sh = window.screen.height;
        // 2.在某些机型（如华为P9）下出现 srceen.width/height 值交换，所以进行大小值比较判断
        _Width = sw < sh ? sw : sh;
        _Height = sw >= sh ? sw : sh;
        storage.setItem('J-recordOrientX',_Width + ',' + _Height);
    }else {
        var str = data.split(',');
        _Width = str[0];
        _Height = str[1];
    }

    if(cw == _Width) {
        // 竖屏
        return;
    }
    if(cw == _Height){
        // 横屏
        return;
    }

}

// 3.函数去抖处理
window.onresize = utils.debounce(detectOrient,300);
detectOrient();
```

然后，下面则讲诉如何针对性逐一突破。

### 1.横竖屏切换时，`screen.width`与`screen.height`的值可能会改变

随着横竖屏幕的切换，`screen.width`与`screen.height`在大部分机型上会维持不变，而在一些机型上如@Jc、@百思不得姐夫
提出的华为 P9 微信内置浏览器(6.5.4版本)、Chrome桌面端浏览器模拟器中会出现值交换的现象。

例如，在Chome上 iPhone 6 模拟器中，竖屏时`screen.width`与`screen.height`等于375px、667px，而横屏时，`sreen.width`与`screen.height`等于 667px 、 375px，两者属性值出现了值交换现象。

这个问题很容易解决，虽然出现了值交换，但是值大小还是不变的，那么我们可以先通过比较大小来判断出属性值较小的是`screen.width`，而属性值较大的是`screen.height`，然后再用来与`document.documentElement.clientWidth/clientHeight`进行比较，从而判断出横竖屏。

### 2.Meta Viewport的设置会影响`document.documentElement.clientWidth/clientHeight`

Peter-Paul Koch 的[《两个 Viewport 的故事》](http://weizhifeng.net/viewports.html)的一文中提出的关于 Viewport 的理论被认为是业界的主流论调，它指出 Layout Viewport 的尺寸可以通过`document.documentElement.clientWidth/clientHeight`进行度量。而通过设置 Meta Viewport （也就是 viewport meta 标签）是可以改变 Layout Viewport 的尺寸。

所以，Meta Viewport的属性设置如何是会影响到`document.documentElement.clientWidth/clientHeight`的值，这就是一部分读者迷惑到”为什么会我测量`document.documentElement.clientWidth/clientHeight`的值与`screen.width/height`的值不相同？“的原因所在。

因此，在这里也补充一点，在笔者提出的方法中，有个忘记跟大家说明的前提——页面设置了以下属性以保证页面的适配：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0;" />
```
这句语句的设置就保证了页面是始终适配屏幕的，在横竖屏切换的场景中`document.documentElement.clientWidth/clientHeight`必然与`screen.width/height`其中一值相等，并且这也是本文提出的横竖屏检测方法的核心。


### 3.resize事件的多次触发

笔者是通过绑定监听resize事件来响应执行横竖屏检测方法的，而在实际应用中确实出现了resize事件触发两次的情况。

虽然并没有影响到事件的判断结果，但是这也算个值得优化的点，而且问题也不大，我们只要通过**函数去抖（ Debounce Function )** 办法来进行简单的解决就好。

```javascript
// 函数去抖的简单封装
var utils = {
    debounce: function(func,delay){
        var timer = null;
        return function(){
            var context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                func.apply(context,args);
            },delay);
        }
    },
    ...
}
```

## 参考文档

- [A misconception about window.orientation](https://notes.matthewgifford.com/a-misconception-about-window-orientation-7231235a94c2#.dm7css274)
- [Trouble with web browser orientation](https://alxgbsn.co.uk/2012/08/27/trouble-with-web-browser-orientation/)
- [Compatibility Standard - 4.2 window.orientation API](https://compat.spec.whatwg.org/#event-orientationchange)



