title: CSS技巧：逐帧动画抖动解决方案
subtitle: 详细分析抖动的原因和寻找终极解决方案
cover: https://misc.aotu.io/leeenx/sprite/cover.jpg
categories: Web开发
tags:
  - sprite
  - 逐帧
  - 抖动
  - svg
author:
  nick: leeenx
  github_name: leeenx
date: 2017-08-14 21:09:53
wechat:
    share_cover: https://misc.aotu.io/leeenx/sprite/share_icon.jpg
    share_title: 逐帧动画抖动解决方案
    share_desc: 详细分析抖动的原因和寻找终极解决方案
---

<!-- more -->

笔者所在的前端团队主要从事移动端的H5页面开发，而团队使用的适配方案是: `viewport units + rem`。具体可以参见凹凸实验室的文章 -- [利用视口单位实现适配布局](https://aotu.io/notes/2017/04/28/2017-4-28-CSS-viewport-units/) 。

笔者目前（2017.08.12）接触到的移动端适配方案中，「利用视口单位实现适配布局」是最好的方案。不过使用 `rem` 作为单位会遇到以下两个难点：

- 微观尺寸（20px左右）定位不准
- 逐帧动画容易有抖动

第一个难点的通常出现在 `icon` 绘制过程，可以使用**图片**或者 **svg-icon** 解决这个问题，笔者强烈建议使用 **svg-icon**，具体理由可以参见：「[拥抱Web设计新趋势：SVG Sprites实践应用](https://aotu.io/notes/2016/07/09/SVG-Symbol-component-practice/)」。

第二个难点笔者举个例子来分析抖动的原因和寻找解决方案。

## 一个抖动的例子

做一个8帧的逐帧动画，每帧的尺寸为：360x540。

```css
.steps_anim {
  position: absolute;
  width: 9rem;
  height: 13.5rem;
  background: url(//misc.aotu.io/leeenx/sprite/m.png) 0 0 no-repeat;
  background-size: 45rem 13.5rem;
  top: 50%;
  left: 50%;
  margin: -5.625rem 0 0 -5.625rem;
  animation: step 1.2s steps(5) infinite; 
}

@keyframes step {
  100% {
    background-position: -45rem;
  }
}
```

观察在主流（手机）分辨率下的播放情况：

<table id="J_table1" style="margin: 0;"><thead><th style="text-align: center;">iPhone 6<br />(375x667)</th><th style="text-align: center;">iPhone 6+<br />(414x736)</th><th style="text-align: center;">iPhone 5<br />(320x568)</th><th style="text-align: center;">Android<br />(360x640)</th></thead><tbody><tr><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip6.gif" width="178" ></td><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip6+.gif" width="178" ></td><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip5-3.gif" width="178" ></td><td><img src="//misc.aotu.io/leeenx/sprite/20170815-android.gif" width="178" ></td></tr></tbody></table>

<table style="max-width: 420px; text-align: center; margin: 0; display: none;" id="J_table2"><tr><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip6.gif" width="178"><br />iPhone 6 (375x667)</td><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip6+.gif" width="178"><br /> iPhone 6+ (414x736)</td></tr><tr><td><img src="//misc.aotu.io/leeenx/sprite/20170815-ip5-3.gif" width="178"><br />iPhone 5 (320x568)</td><td><img src="//misc.aotu.io/leeenx/sprite/20170815-android.gif" width="178"><br />Android (360x640)</td></tr></table>

<script type="text/javascript">
~function() {
	var _resize = function() {
		var w = document.body.clientWidth; 
		if(w < 540) {
			J_table1.style.display = "none"; 
			J_table2.style.display = "block"; 
		} else {
			J_table1.style.display = "block"; 
			J_table2.style.display = "none"; 
		}
	}
	_resize(); 
	window.addEventListener("resize", _resize); 
}(); 
</script>

四种分辨率下，可以看到除了 `ip6` 其它的三种分辨率都发生了抖动。*（`ip6` 不抖动的原因是适配方案是基本于 `ip6` 的分辨率订制的。）*

## 分析抖动

图像由终端（屏幕）显示，而终端则是一个个光点（物理像素）组成的矩阵，换句话说图片也一组光点矩阵。为了方便描述，笔者假设终端上的一个光点代表css中的1px。

以下是一张 `9px * 3px` 的sprite:
![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-1.png)

每帧的尺寸为 `3px * 3px`，逐帧的取位过程如下：
![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-2.gif)

把 sprite 的 background-size 的宽度取一半，那么终端会怎么处理？
9  / 2 = 4.5
终端的光点都是以自然数的形式出现的，这里需要做取整处理。取整一般是三种方式：`round/ceil/floor`。假设是 round ，那么 `background-size: 5px`，sprite 会是以下三种的一个：

| 情况一 | 情况二 | 情况三 |
| :----: | :----: | :----: |
| ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-3.png) | ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-4.png) | ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-5.png) |


理论上，`5 / 3 = 1.666...`。但实际上光点取整后，三个帧的宽度都不可能等于 `1.666...`，而是有一个帧的宽度降级为 `1px`（亏），另外两个宽度升级为 `2px`（盈），笔者把这个现象称作「盈亏互补」。

再看一下盈亏互补后，逐帧的取位过程：

| 情况一 | 情况二 | 情况三 |
| :----: | :----: | :----: |
| ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-3.gif) | ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-4.gif) | ![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-5.gif) |

可以看到由于盈亏互补导致了三个帧的宽度不一致，亏的那一帧在动画中的表示就是**抖动**。

笔者总结抖动的原因是：**sprite在尺寸缩放后，帧与帧之间的盈亏互补现象导致动画抖动**

*附注：1px 由几个光点表示是由以终端的 dpr 决定*

## 解决方案

「盈亏互补」也可以说是「盈亏不一致」，如果尺寸在缩放后「盈亏一致」那么抖动现象可以解决。

### 解决构想一

笔者根据「盈亏一致」设计了「解决构想一」：

![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-6.gif)

根据上图，其实很容易就联想到一个简单的方案：**不用雪碧图（即一帧对应一张图片）**。
这个方案确实是可以解决抖问题，不过笔者并不推荐使用它，因为它有两个负面的东西：

- KB变大与请求数增多
- 多余的 animation 代码

这个方案很简单，这里就不赘述了。

### 解决构想二

把逐帧取位与图像缩放拆分成两个独立的过程，就是笔者的「解决构想二」：
![9px * 3px](//misc.aotu.io/leeenx/sprite/20170814-7.gif)

实现「构想二」，笔者首先想到的是使用 `transform: scale()`，于是整理了一个实现方案A： 

```css
.steps_anim {
  position: absolute;
  width: 360px;
  height: 540px;
  background: url(//misc.aotu.io/leeenx/sprite/m.png) 0 0 no-repeat;
  background-size: 1800px 540px;
  top: 50%;
  left: 50%; 
  transform-origin: left top; 
  margin: -5.625rem 0 0 -5.625rem; 
  transform: scale(.5); 
  animation: step 1.2s steps(5) infinite;
}
@keyframes step {
  100% {
    background-position: -1800px;
  }
}
/* 写断点 */
@media screen and (width: 320px) {
	.steps_anim {
		transform: scale(0.4266666667); 
	}
}
@media screen and (width: 360px) {
	.steps_anim {
		transform: scale(0.48); 
	}
}
@media screen and (width: 414px) {
	.steps_anim {
		transform: scale(0.552); 
	}
}
```

这个实现方案A存在明显的缺陷：**scale 的值需要写很多断点代码**。于是笔者结全一段 js 代码来改善这个实现方案B：

css: 
```css
.steps_anim {
  position: absolute;
  width: 360px;
  height: 540px;
  background: url("//misc.aotu.io/leeenx/sprite/m.png") 0 0 no-repeat;
  background-size: 1800 540px;
  top: 50%;
  left: 50%; 
  transform-origin: left top; 
  margin: -5.625rem 0 0 -5.625rem; 
  animation: step 1.2s steps(5) infinite;
}
@keyframes step {
  100% {
    background-position: -1800px;
  }
}
```
javascript: 
```javascript
// 以下代码放到 <head></head> 中
<script>
document.write("<style id='scaleStyleSheet'>.steps_anim {scale(.5); }</style>"); 
function doResize() {
  scaleStyleSheet.innerHTML = ".steps_anim {-webkit-transform: scale(" + (document.documentElement.clientWidth / 750) + ")}"; 
}
window.onresize = doResize; 
doResize(); 
</script>
```

通过改善后的方案 CSS 的断点没了，感觉是不错了，不过笔者觉得这个方案不是个纯粹的构建方案。

我们知道 `<img>` 是可以根据指定的尺寸自适应缩放尺寸的，如果逐帧动画也能与 `<img>` 自适应缩放，那就可以从纯构建角度实现「构想二」。

`SVG`刚好可以解决难题！！！`SVG` 的表现与 `<img>` 类似同时可以做动画。以下是笔者的实现方案C。

html: 
```html
<svg viewBox="0, 0, 360, 540" class="steps_anim">
  <image xlink:href="//misc.aotu.io/leeenx/sprite/m.png" width="1800" height="540" />
</svg>
```
css: 
```css
.steps_anim {
  position: absolute;
  width: 9rem;
  height: 13.5rem;
  top: 50%;
  left: 50%; 
  margin: -5.625rem 0 0 -5.625rem; 
  image {
  	animation: step 1.2s steps(5) infinite; 
  }
}

@keyframes step {
  100% {
    transform: translate3d(-1800px, 0, 0);
  }
}
```

## 方案C的改良

实现方案C很好地解决了方案A和方案B的缺陷，不过方案C也有它的问题：**不利于自动化工具去处理图片**。

自动化工具一般是怎么处理图片的？
自动化工具一般是扫描 CSS 文件找出所有的 `url(...)` 语句，然后再处理这些语句指向的图片文件。

如果 `<image>` 可以改用 CSS 的 `background-image` 就可以解决这个问题，不过 `SVG` 不支持 CSS 的 `background-image`。但是，`SVG`有一个扩展标签：`foreignObject`，它允许向 `<svg></svg>` 插入 `html` 代码。在使用它前，先看一下它的兼容情况：

![caniuse](//misc.aotu.io/leeenx/sprite/caniuse.png)

iOS 与 Android 4.3 一片草绿兼容情况算是良好，笔者实机测试腾讯 `X5` 内核的浏览器兼容仍旧良好。以下是改良后的方案。 

html: 
```html
<svg viewBox="0, 0, 360, 540" class="steps_anim">
  <foreignObject class="html" width="360" height="540">
    <div class="img"></div>
  </foreignObject>
</svg>
```

css:
```css
.steps_anim {
  position: absolute;
  width: 9rem;
  height: 13.5rem;
  top: 50%;
  left: 50%; 
  margin: -5.625rem 0 0 -5.625rem; 
}
.html {
	width: 360px; 
	height: 540px; 
}
.img { 
	width: 1800px; 
	height: 540px; 
	background: url(//misc.aotu.io/leeenx/sprite/m.png) 0 0 no-repeat; 
	background-size: 1800px 540px; 
	animation: step 1.2s steps(5) infinite; 
}

@keyframes step {
  100% {
    background-position: -1800px 0;
  }
}
```

改良后的方案DEMO: [http://jdc.jd.com/fd/promote/leeenx/201708/svg-sprite.html](http://jdc.jd.com/fd/promote/leeenx/201708/svg-sprite.html)



## 结语

感谢阅读完本文章的读者。本文是笔者的个人观点，希望能帮助到有相关问题的朋友，如果本文有不妥之处请不吝赐教。


-------

## 参考资料：

https://stackoverflow.com/questions/9946604/insert-html-code-inside-svg-text-element
https://www.w3.org/TR/SVG/extend.html
https://developer.mozilla.org/en-US/docs/Web/SVG/Element/foreignObject


