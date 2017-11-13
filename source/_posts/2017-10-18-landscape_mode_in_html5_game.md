title: H5游戏开发：横屏适配
subtitle: 横屏场景对于H5轻互动来说并不少见，让我们来探讨横屏的处理点与解决方案吧。
cover: http://misc.aotu.io/Tingglelaoo/landscape_in_h5_900x500.png
date: 2017-10-18 9:10
categories: H5游戏开发
tags:
  - H5
  - 游戏
  - 适配
  - 横屏
author:
    nick: Tingglelaoo
    github_name: Tingglelaoo
wechat:
    share_cover: http://misc.aotu.io/Tingglelaoo/landscape_in_h5_200x200.png
    share_title: H5游戏开发：横屏适配
    share_desc: 横屏场景对于H5轻互动来说并不少见，让我们来探讨横屏的处理点与解决方案吧。


---
<!-- more -->
对于移动端的轻量级 HTML5 互动小游戏（简称为 H5 轻互动)，如果从屏幕呈现模式来划分的话，可以归类为：竖屏式和横屏式。

<div style="margin:0 auto;width:fit-content;">![cases.jpg](//misc.aotu.io/Tingglelaoo/cases.jpg)</div>
<small style="display:block;text-align:center;">HTML5互动小游戏案例截图</small>

平常我们做过的需求里，主要是以竖屏式为主，而横屏式较少。对于竖屏式场景来说，大家的经验会比较丰富，因此，此次主要式探讨下横屏式场景下的一些需要注意的点，特别是怎样去做横屏适配。

对于 H5 轻互动游戏来说，要实现横屏的话，主要是解决两点：
1.无论用户手持方向如何，都需要保证屏幕横向显示。
2.由于屏幕分辨率的多样化，因此就算是横屏下也是需要进行横屏适配，保证画面在所有分辨率下都能够合理适配。
  
下面，我们针对这两点分别阐述如何解决。
  
## 强制横屏显示

页面内容显示方向可分为竖排方向和横排方向，如下图所示。

<div style="margin:0 auto;width:fit-content;">![landscape&orient.png](//misc.aotu.io/Tingglelaoo/landscape&orient.png)</div>
<small style="display:block;text-align:center;">页面内容显示方式：竖向排版和横向排版</small>

对于竖屏式 H5 轻互动来说，页面会被期望保持竖排方向显示。而如果页面出现横排方向显示的情况，开发者往往会选择利用提示蒙层来进行友好提示，让用户自主保持竖屏体验，如下图所示。

<div style="margin:0 auto;width:fit-content;">![orient_function.png](//misc.aotu.io/Tingglelaoo/orient_tips.png)</div>
<small style="display:block;text-align:center;">提示蒙层提醒用户保持竖屏体验</small>

同样地，在横屏式 H5 轻互动游戏中可以采取相同的措施进行简单处理，在页面内容按竖排方向显示时，开发者进行对用户提示其保持横屏体验。

但是，这对用户体验并不友好，因为这对于那些习惯于打开锁定为竖排方向功能（如下图所示）的 iOS 平台用户，或者是关闭屏幕旋转功能（如下图所示）的 Android 平台用户来说，他们需要多一个处理步骤——先关闭竖排方向锁定或是开启屏幕旋转，然后再横向手持设备。

<div style="margin:0 auto;width:fit-content;">![orient_function.png](//misc.aotu.io/Tingglelaoo/orient_function.png)</div>
<small style="display:block;text-align:center;">竖排方向锁定功能（iOS）与屏幕旋转（Android）功能</small>

因此，更好的做法是强制横屏显示，对屏幕 resize 事件进行监听，当判断为竖屏时将整个根容器进行逆时针 CSS3 旋转 90 度即可，代码如下所示。

```javascript
// 利用 CSS3 旋转 对根容器逆时针旋转 90 度
var detectOrient = function() {
  var width = document.documentElement.clientWidth,
      height =  document.documentElement.clientHeight,
      $wrapper =  document.getElementById("J_wrapper"),
      style = "";

  if( width >= height ){ // 横屏
      style += "width:" + width + "px;";  // 注意旋转后的宽高切换
      style += "height:" + height + "px;";
      style += "-webkit-transform: rotate(0); transform: rotate(0);";
      style += "-webkit-transform-origin: 0 0;";
      style += "transform-origin: 0 0;";
  }
  else{ // 竖屏
      style += "width:" + height + "px;"; 
      style += "height:" + width + "px;"; 
      style += "-webkit-transform: rotate(90deg); transform: rotate(90deg);";
      // 注意旋转中点的处理
      style += "-webkit-transform-origin: " + width / 2 + "px " + width / 2 + "px;";
      style += "transform-origin: " + width / 2 + "px " + width / 2 + "px;";
  }
  $wrapper.style.cssText = style;
}
window.onresize = detectOrient;
detectOrient();
```

但是！这里有[坑](https://github.com/CreateJS/EaselJS/issues/772)：如果你是采用 CreateJS 框架进行开发，那么就不能通过 CSS3 途径对包含 Canvas 的根容器进行旋转处理，因为旋转后会导致 Canvas 内的舞台元素的事件响应位置错乱。
解决办法是，换成利用 CreateJS 框架内的 Stage 的 `rotation` 属性对整个舞台旋转处理，代码如下：

```javascript
if(self.isPortrait) { // 竖屏
  // 舞台旋转
  self.stage.x = self.canvasHeight; // 注意：x偏移相当于旋转中点处理，更简单
  self.stage.rotation = 90;
  // more...
}else { // 横屏
  self.stage.x = 0;
  self.stage.rotation = 0;
  // more...
}
```

## 横屏适配处理

面对移动端多分辨率繁复冗杂的情况，我们对于一般情况下（也就是常见的竖屏式）页面适配处理可以说是烂熟于心，但是切换到横屏式场景下，同样的页面适配方法可以直接应用吗？会不会有什么问题呢？

下面笔者分别从 DOM 和 Canvas 两方面去着手阐述如何做横屏适配处理。

### 解决 DOM 的横屏适配问题

在移动端，常见的移动端适配方案是 REM 方案，而为了减少 JS 与 CSS 的耦合，笔者团队开发页面时采用的是 VW + REM 方案。（想要了解该方案的同学可详细阅读[《利用视口单位实现适配布局》](https://aotu.io/notes/2017/04/28/2017-4-28-CSS-viewport-units/)）。

因为页面适配的场景往往是竖屏式的，因此 VW + REM 方案表现得十分完美。但是遇上横屏式，它的缺点就暴露了出来。

<div style="margin:0 auto;width:fit-content;">![vw.jpeg](//misc.aotu.io/Tingglelaoo/vw.jpeg)</div>
<small style="display:block;text-align:center;">现行的 vw 单位适配方案带来的问题</small>

如上图所示，由于响应断点的限制最大宽度处理，会导致页面两侧留白，当然这可以通过去掉最大宽度限制来解决。而真正的缺点在于，由于 vw 单位的特性，适配换算大小是根据屏幕宽度而言的，因此屏幕宽度越大导致容器、文字会越大，还可能导致 DOM 元素超出屏幕外，且文字过大并不是我们所想要的用户体验。

那么，换成 px 单位的固定布局如何？

但 px 单位的固定布局只适合于部分场景，对于需要内容全屏覆盖的场景（如下图所示），就可能存在这样的不理想的用户体验：绝对定位的元素之间空隙过大，导致布局不美观，又或者空隙过小，导致元素叠放被遮挡。

<div style="margin:0 auto;width:fit-content;">![px.jpeg](//misc.aotu.io/Tingglelaoo/px.jpeg)</div>
<small style="display:block;text-align:center;">px单位固定布局适配方案带来的问题</small>

我们了解到，vw 单位的特点是适配换算大小时是根据屏幕宽度而定的，那么**在强制横屏显示时，我们就可以同理转换为屏幕高度来而定，也就是 vw 单位替换成 vh 单位**。

这样进一步改良之后就会得到满意的适配效果，如下图所示。

<div style="margin:0 auto;width:fit-content;">![vh.jpeg](//misc.aotu.io/Tingglelaoo/vh.jpeg)</div>
<small style="display:block;text-align:center;">更好的适配解决方案—— vw、vh 单位搭配</small>

具体实现可参考如下 SCSS 代码：
```scss
$vw_base: 375;
$vw_fontsize: 20;
html {
  font-size: 20px; //不支持vw单位时，回退到px单位
  font-size: ($vw_fontsize / $vw_base) * 100vw;
}
@media screen and (orientation: landscape) {
  html {
    font-size: 20px;
    font-size: ($vw_fontsize / $vw_base) * 100vh;
  }
}
```

### 解决 Canvas 的横屏适配问题

解决 Canvas 的横屏适配问题，目前在实际应用中有两种主流的方案：
1. 通过做**两套Canvas**的方案。
2. 采用**缩放**的手段进行适配的方案。

两套 Canvas 的方案的做法是，页面包含两个 Canvas 分别用于横竖屏时的相应显示，但是它们的数据是打通的。但是，该方案难免会有局限性，比较适合游戏逻辑数据处理简单、且舞台元素少且居中的场景；

而缩放适配方案做法是，采用的最为常见的缩放手段——利用 CSS3 Transform 的 `scale` 属性，达到“一种设计尺寸适配多种分辨率屏幕”的目的。

<div style="margin:0 auto;width:fit-content;">![solvements.png](//misc.aotu.io/Tingglelaoo/solvements.png)</div>
<small style="display:block;text-align:center;">采用了不同适配方案的案例</small>


在市面上的一些成熟的主流 HTML5 游戏引擎，例如 Cocos2D、Laya、Egret 等等，它们本身就集成了横屏适配的方案。如果你有去了解过，可以发现它们普遍都是采用缩放的理念进行适配。

但是，对于我们常用的 CreateJS、PixiJS 框架来说，它们并没有配套的现成的横屏适配解决方案可以被采用的，尤其是我们如果采用原生 Javascript 去开发一个横屏游戏的时候。

因此，下面我们来研究下如何解决 Canvas 横屏适配问题。

> 注意：下面文中示例代码都是在 CreateJS 框架的基础上进行编写的。

#### 选用合适的缩放模式

**横屏适配的核心是缩放，通过 `scale` 属性等手法将Canvas缩放至适合屏幕窗口大小**。类似于 `background-size` 属性的表现，缩放适配也可以有很多种模式，或有裁剪或无裁剪，或根据长边缩放或根据短边缩放等等。根据一些常见的实际应用场景，有比较常用的五种缩放模式：Contain、Cover、Fill、Fixed-Width、Fixed-Height。根据游戏的不同的实际场景需求，我们可以选其中一种缩放模式进行适配。

下面，我们逐一解释以上五种缩放模式的定义、实现与其适用的场景。

**a. Contain模式**

Canvas可以类比为一张图，而图片的适配，我们可以联想到经常用以适配背景图片的属性 `background-size` ，其属性值包括 `contain`、`cover`。

借助 `contain` 的概念，我们把缩放的其中一种模式称为 Contain 模式。因为在这种模式下，舞台内容（gameArea）会保持宽高比进行缩放适配浏览器可视窗口（window），缩放至其能显示完整的舞台内容。

根据下图推导，我们可以得出在这种缩放模式下的缩放比例（scaleRadio），为**浏览器可视窗口与游戏内容的宽度比或高度比之间较小者**。

<div style="margin:0 auto;width:fit-content;">![contain.jpg](//misc.aotu.io/Tingglelaoo/contain.jpg)</div>
<small style="display:block;text-align:center;">Contain 模式下的缩放比例推导图</small>

根据推导结论，简单代码实现如下：

```javascript
// Contain模式核心原理函数
CONTAIN: function(){
  var self = this;
  self.radioX = self.radioY = Math.min((self.winWidth / self.designWidth) , (self.winHeight / self.designHeight));
  self.canvasWidth = self.designWidth;
  self.canvasHeight = self.designHeight;
}
```

可以看出，在 Contain 模式下，如果舞台内容宽高比与浏览器可视窗口的宽高比不相等时，舞台内容并没有填满整个浏览器可视窗口，此时就会出现上下或左右两侧会存在留空部分。

对于这种 Contain 模式，会比较适合舞台背景为纯色或者是渐变类型的H5轻互动，舞台内容与窗口的紧邻处得以自然过渡衔接，不会突兀。

**b. Cover模式**

同样地，借助 `cover` 的概念把其中一种模式称为 Cover 模式。在这种模式下，舞台内容（gameArea）会保持宽高比进行缩放适配浏览器可视窗口（window），缩放至舞台内容填满窗口。

根据下图推导，我们可以得出在这种缩放模式下的缩放比例（scaleRadio），为**浏览器可视窗口与游戏内容的宽度比或高度比之间较大者**。

<div style="margin:0 auto;width:fit-content;">![cover.jpeg](//misc.aotu.io/Tingglelaoo/cover.jpeg)</div>
<small style="display:block;text-align:center;">Cover 模式下的缩放比例推导图</small>

根据推导结论，简单代码实现如下：
```javascript
// Cover模式核心原理函数
COVER: function(){
  var self = this;
  self.radioX = self.radioY = Math.max((self.winWidth / self.designWidth) , (self.winHeight / self.designHeight));
  self.canvasWidth = self.designWidth;
  self.canvasHeight = self.designHeight;
}
```

在 Cover 模式下，如果舞台内容宽高比与浏览器可视窗口的宽高比不相等时，由于舞台内容需要填满整个浏览器可视窗口，此时就会出现上下或者左右两侧被裁剪的情况。

那么，如果能保证游戏场景内的重点显示内容全部显示，被裁剪内容无关紧要时，那么这种 H5 轻互动类型就可以考虑采用 Cover 模式。

怎么做到保证想要重点显示的内容可以不被裁剪呢？这时要谈到一个“安全区域”的概念，指的是绝对不会被裁剪的内容区域，它应该是由最小的屏幕可视窗口（目前应该是 iPhone 4 ）与最大的屏幕可视窗口（目前应该是 iPhone 7 Plus）叠加后得出的重叠区域，如下图所示。

<div style="margin:0 auto;width:fit-content;">![safeArea.jpeg](//misc.aotu.io/Tingglelaoo/safeArea.jpeg)</div>
<small style="display:block;text-align:center;">“安全区域”即为红色虚线框内部分</small>

开发者应该在设计阶段与设计师、产品等相关人员进行沟通，告知其不想被裁剪的内容都应该在“安全区域”进行设计布局。

**c. Fill模式**

Fill 模式，可以类比为 `backgrouns-size: 100% 100%` 的表现，在这种模式下，不会保持宽高比，舞台内容（gameArea）的宽高分别按照舞台内容与浏览器可视窗口（window）的宽度比与高度比进行缩放，缩放至舞台内容拉伸铺满窗口。

根据下图推导，我们可以得出在这种缩放模式下的缩放比例（scaleRadio），为**对于游戏内容的宽应用其与可视窗口的宽度比，而游戏内容的高应用其与可视窗口的高度比**。

<div style="margin:0 auto;width:fit-content;">![fill.jpeg](//misc.aotu.io/Tingglelaoo/fill.jpeg)</div>
<small style="display:block;text-align:center;">Fill 模式下的缩放比例推导图</small>

根据推导结论，简单代码实现如下：
```javascript
// Fill模式核心原理函数
FILL: function(){
  var self = this;
  self.radioX = (self.winWidth / self.stageWidth);
  self.radioY = (self.winHeight / self.stageHeight);
  self.canvasWidth = self.designWidth;
  self.canvasHeight = self.designHeight;
}
```
这种模式下既不会留空，也不会被裁剪，但是在舞台内容宽高比与浏览器可视窗口的宽高比不相等时，显示的内容会有一定程度的拉伸形变。

这种暴力的处理方式虽然免去了留空和裁剪的烦恼，但是会存在拉伸形变，这就得看是否能够被接受了。

**d. Fixed-Width模式**

区别于图像，Canvas 是可以进行动态绘制大小的。所以，我们可以考虑根据屏幕窗口大小变化来动态绘制 Canvas。
从保持舞台横向内容不变的角度考虑，我们提出这样的模式：舞台内容（gameArea）等比进行缩放至与浏览器可视窗口的一致的宽度大小，而舞台的高度（Canvas高度）进行重新绘制其高度为浏览器可视窗口的高度，称之为 Fixed-Width 模式。

根据下图推导，我们可以得出在这种缩放模式下的缩放比例（scaleRadio），为**浏览器可视窗口与游戏内容的宽度比**。

<div style="margin:0 auto;width:fit-content;">![fixed_width.jpeg](//misc.aotu.io/Tingglelaoo/fixed_width.jpeg)</div>
<small style="display:block;text-align:center;">Fixed-Width 模式下的缩放比例推导图</small>

根据推导结论，简单代码实现如下：
```javascript
// Fixed-Width模式核心原理函数
FIXED_WIDTH: function(){
  var self = this;
  self.radioX = self.radioY = self.winWidth / self.designWidth;
  self.canvasWidth = self.designWidth;
  self.canvasHeight =  self.winHeight / self.radioY;
}
```

在 Fixed-Width 模式下，无论在什么分辨率下，舞台横向内容保持不变，而纵向高度则会动态裁补，这就会比较适用于那些场戏场景可以纵向拓展的 H5 轻互动类型。

**e. Fixed-Height模式**

说完 Fixed-Width 模式，换个角度考虑便得出 Fixed-Height 模式，舞台内容（gameArea）等比进行缩放至与浏览器可视窗口的一致的高度大小，而舞台的宽度（Canvas宽度）进行重新绘制其宽度为浏览器可视窗口的宽度。

根据下图推导，我们可以得出在这种缩放模式下的缩放比例（scaleRadio），为**浏览器可视窗口与游戏内容的高度比**。

<div style="margin:0 auto;width:fit-content;">![fixed_height.jpeg](//misc.aotu.io/Tingglelaoo/fixed_height.jpeg)</div>
<small style="display:block;text-align:center;">Fixed-Height 模式下的缩放比例推导图</small>

根据推导结论，简单代码实现如下：
```javascript
// Fixed-Height模式核心原理函数
FIXED_HEIGHT: function(){
  var self = this;
  self.radioX = self.radioY= self.winHeight / self.designHeight;
  self.canvasWidth = self.winWidth / self.radioX;
  self.canvasHeight = self.designHeight;
}
```

与 Fixed-Width 模式相反，Fixed-Height 模式下，舞台纵向内容保持不变，而横向宽度则会动态裁补。对于这种模式的应用场景应该会比较广泛，譬如常见的跑酷游戏类型H5轻互动。

#### 加入重定位和重绘制策略

综合以上五种缩放模式，我们可以看到对于 Cover、Fixed-Width、Fixed-Height 模式而言，有存在被裁剪的可能性。特别是 Fixed-Height 模式，对于横屏游戏来说这是比较常用的模式，但是在屏幕较小的时候难免会被裁剪，而且我们是不希望贴边元素被裁剪掉的，譬如位于右上角的音乐图标。而对于 Fixed-Width、Fixed—Height 模式，它们还存在舞台区域需要补充绘制的情况，因此对某些舞台元素来说需要重新设定其渲染大小。

所以，除了基本的缩放适配模式实现之外，为了解决贴边元素不被裁剪以及对一些舞台元素重绘制的需求，我们还需要加入两个策略：重定位和重绘制。

**a. 重定位**

贴边元素重定位策略的实现原理很简单，对需要重新定位的元素对象额外设置 `top`、`left`、`right`、`bottom` 的自定义属性（当然你可以命名为其他属性名），这样我们就可以在适配的时候根据这些自定义属性以及实际显示的 Canvas 大小进行重新计算位置。

为了保证性能，下面是策略里需要注意的地方：
1. 在舞台里，并不是所有游戏元素都是需要被重定位的，因此我们只需要创建一个数组记录需要被重定位的元素。
2. 适当控制重定位次数，我们不需要在每一帧 tick 绘制的时候都进行重定位，只需要在 Canvas 大小改变的时候进行处理。

以下是重定位策略相关的代码：
```javascript
// halfCutHeight、halfCutWidth是根据适配后的实际Canvas大小计算出来的相对距离
_setSize: function(){
  // ...
  if(self.isPortrait) {
    // ...
    self.halfCutWidth =  (self.canvasWidth * self.radioY - this.winWidth ) / 2 / self.radioY;
    self.halfCutHeight = (self.canvasHeight * self.radioX - this.winHeight) / 2 / self.radioX;
  }else {
    // ...
    self.halfCutWidth = (self.canvasWidth * self.radioX - this.winWidth ) / 2 / self.radioX;
    self.halfCutHeight = (self.canvasHeight * self.radioY - this.winHeight) / 2 / self.radioY;
  }
  // ...
},
// 贴边元素重定位核心处理函数
_adjustPosition: function(item){
  var self = this;
  item && self.adjustPositionArr.push(item);
  self.adjustPositionArr.map(function(item, index, arr){
    (typeof item.top == "number") && (item.y = item.top + self.halfCutHeight >= 0 ? self.halfCutHeight : 0);
    (typeof item.left == "number") && (item.x =  item.left + self.halfCutWidth >= 0 ? self.halfCutWidth : 0);
    (typeof item.bottom == "number") && (item.y = self.canvasHeight - item.getBounds().height - item.bottom + self.halfCutHeight >= 0 ? self.halfCutHeight : 0);
    (typeof item.right == "number") && (item.x = self.canvasWidth - item.getBounds().width - item.right  - self.halfCutWidth);
  });
},
// 暴露方法：提供给开发者记录需要重定位的贴边元素
adjustPosition: function(item){
  var self = this;
  self._adjustPosition(item);        
}
```

**b. 重绘制**

对于一些以舞台区域（gameArea）作为其大小设置的参考标准的元素，在适配时遇到需要补全绘制区域时，舞台区域大小发生变化，相应地，该元素就需要进行重新绘制，这就是重绘制策略的存在意义。

同样地，为了保证性能，重绘制策略也是同样需要保证：
1. 创建对应的数组记录全显图形对象。
2. 不在每一帧 tick 时进行重绘制，只在适配的时候重绘制。

以下是重绘制策略的相关代码：
```javascript
// 全显图形重绘制核心处理函数
_adjustFullSize: function(item){
  var self = this;
  item && self.adjustFullSizeArr.push(item);
  self.adjustFullSizeArr.map(function(item, index, arr){
    item.drawRect(0, 0, self.canvasWidth, self.canvasHeight);
  });
},
// 暴露方法：提供给开发者记录需要重绘制的全显图形
adjustPosition: function(item){
  var self = this;
  self._adjustPosition(item);        
}
```

至此，Canvas 横屏适配问题才得以完全解决。

这部分内容篇幅较长，笔者简单总结下，一个简单的解决 Canvas 横屏适配问题的方案至少需要包括两点实现：
- **选用合适的缩放模式**。
  方案内置五种缩放模式，在实际应用中根据场景不同而采用不同的缩放进行适配。

- **加入重定位和重绘制策略**。
  为了保证贴边元素不被裁剪以及舞台元素动态渲染大小以适应舞台区域的动态变化。

> 最终的整体效果可前往[体验地址](http://jdc.jd.com/demo/ting/landscape/index.html)进行体验，体验时可点击文本元素进行切换模式。另外，整体的实现方案是基于 CreateJS 框架进行实现的，文中的实现方案的代码会托管笔者[github](https://github.com/Tingglelaoo/landscapeforh5)上。

## 后话

本文主要的核心在于探讨横屏游戏中的处理点与解决方案，因此如果实现代码方面有任何错漏之处，请大胆地提出纠正吧！又或者读者们有更好的见解之处，也欢迎留言分享噢。

## 参考资料
[《如何打造一个高效适配的H5》](http://isux.tencent.com/how-to-make-webpage-fit-screen.html)
[《Cocos2d-JS的屏幕适配方案》](http://www.cocos.com/docs/js/4-essential-concepts/4-4-resolution-policies/zh.html)
[《Cocos2d-JS 多分辨率适配方案》](http://www.cocos.com/docs/creator/ui/multi-resolution.html)
[《Cocos2d-JS 对齐策略》](http://www.cocos.com/docs/creator/ui/widget-align.html)
[《Laya引擎－自动横屏适配》](https://layaair.ldc.layabox.com/demo/?2d&SmartScale&Landscape)
[《Phaser－scaleManager对象》](http://www.phaserengine.com/docs/detail/scalemanager)
[《How to create mobile games for different screen sizes and resolutions》](https://v-play.net/doc/vplay-different-screen-sizes/)
[《Egret－屏幕适配策略》](http://edn.egret.com/cn20/index.php/article/index/id/181)