title: 使用border-img和SVG制作有趣的边框特效
subtitle:
cover: https://img12.360buyimg.com/imagetools/jfs/t1/146532/24/17935/284587/5fd20b60Efa935641/cd945128fecce28a.jpg
category: 经验分享
tags: 
    - border-image
    - CSS3
    - SVG
    - 动画
    - 特效
author:
    nick: 大坑
date: 2020-12-10 19:00:00
---

## 引言

我们都知道border-image可以使用图片、渐变或者SVG来替代原始的边框，来实现原本单调的效果。但是有些时候，需求方或者设计师同学依然无法满足，想给边框加点动画什么的，按照以往的做法，我们会推荐他们用gif来给容器添加背景以实现这个效果，可是一旦容器尺寸发生改变，gif本身就带着很多“狗牙齿”，实际效果非常差，无法达到预期。

而这个时候，SVG的优势就特别凸显了，SVG可以实现动画，又是矢量图形，并且能作为资源替代图片，我们使用SVG本身的动画，配合border-image的特性，就可以实现一些以往不好实现的效果。

## 要实现的效果
![](http://storage.360buyimg.com/sourse/QQ20201210-160454-HD.gif?Expires=3755073363&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=9LFBz8BOjm8GKmfWRJiLMDLmStY%3D)

啊，这...看到效果时，首先想到的是是否能用gif，但是正如前面我们所说的，一旦容器的尺寸发生改变，那么gif就不适应了，会被拉伸或者扭曲，且大家看图片，狗牙齿很严重，肯定不行。

## 我们可以使用background吗？

首先，一开始我们并没有想到 `border-image`，因为我首先想到的是使用 `background`，然后利用 `background-position` 配合 `animation` 来解决这个问题，于是我写了个demo：

![](http://storage.360buyimg.com/sourse/2.gif?Expires=3755078890&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=iBK0XqX9eCVAUJuHyF4tQAhGuZ4%3D)

我使用了 `:before` 配合 `animation` 来实现了这个效果，但是，这样的话，要实现我们上面的效果，必须用很多个元素来拼接，而且经过实践，4个角无法流畅衔接，最终无法达到我们需要的效果。

于是我去google了一下有没有类似的解决方案，在国外的博客有人提示可以试试 `border-image`，利用图片，来实现这个效果。

## Border-Image

`border-image` 类似 `background-image`，只不过渲染的区域是最外围的border区域，具体如何使用相信大家都已经了解了，当然，如果你还没有用过，可以通过 [border-image 的正确用法](https://aotu.io/notes/2016/11/02/border-image/index.html) 这篇文章复习下，这里就不赘述了。

看过文章，我们可以知道，如果使用 `border-image`，我们不得不提供一张九宫格的图片，九宫格的每个角，代表了容器的4条边和4个角（中间区域可以忽略）。按照我们的需求，我们做了一个图：

![](http://storage.360buyimg.com/sourse/3.png?Expires=3755078169&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=1mIzELrE1ECmpNr9P%2BJD0EYBbSI%3D)

然后我们使用 `border-image` 将这张图加载到边框上：

![](http://storage.360buyimg.com/sourse/4.png?Expires=3755078128&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=BOyLZY68r%2BGRugl8XnnRqw8c2VU%3D)

代码如下：

```
.demo {
  border-image: url(bg.png) 30px round;
}
```

嗯，看起来不错，辣么问题来了，怎么让他动起来呢？

## SVG登场

众所周知，SVG也算图片，并且可以在内部实现动画，刚好契合我们的需求，根据这个特性，我们将上述图片改造成了一个九宫格的SVG文件，代码如下：

```
<svg version="1.1" height="90" width="90" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <circle id="round" cx="16" cy="10" r="10" fill="red"/>
    </defs>
    <use href="#round" x="0" y="0" />
    <use href="#round" x="30" y="0" />
    <use href="#round" x="60" y="0" />
    <use href="#round" x="0" y="30" />
    <use href="#round" x="0" y="60" />
    <use href="#round" x="30" y="60" />
    <use href="#round" x="60" y="60" />
    <use href="#round" x="60" y="30" />
</svg>
```

更改引用

```
border-image: url(round.svg) 30 / 30px round;
```

刷新，效果出来了

嗯，还缺点动画，我们的思路是为边界图像的每个区域创建一个不同的动画。例如，在左上角，我们有一个圆从右到左，而第二个圆则同时从上到下。

我们将为所有的 `use` 的 `transform` 属性设置动画。我们还将利用SVG的特性来避免对每个头骨重复冗长的定义:

```
@keyframes down {to {transform: translate(0, 30px)}}

<use href="#round" x="0" y="0" style="animation: down .4s infinite linear" />
```

以此类推，根据4个边，制作4个角的动画：

```
@keyframes left {to {transform: translate(-30px, 0)}}
@keyframes down {to {transform: translate(0, 30px)}}
@keyframes right {to {transform: translate(30px, 0)}}
@keyframes up {to {transform: translate(0, -30px)}}
```

应用，保存，刷新

yes, it works!

[点击查看效果](https://codepen.io/larthas/full/YzGGowK)

## 我能玩这个玩一整天！

虽然我们实现了效果，但是我在研究的过程当中，我想起来用SVG替代GIF的原因：能够非常方便的通过修改代码来修改动画的表现，并且能够作为图片进行渲染，更不用说更小的体积，尤其是处理渐变的时候，最最重要的是，他无论怎么缩放，都能表现如初，甚至，还能改变颜色！

想到这一点，我尝试继续改造这个动画的效果，我给圆加上了渐变：

```
@keyframes color {to {fill: green}}

use { fill: red; animation: .4s infinite ease, color 1s infinite linear alternate;}

<use href="#round" x="0" y="0"  style="animation-name: down, color"/>
```

保存，刷新，效果如下：

![](http://storage.360buyimg.com/sourse/5.gif?Expires=3755082554&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=DTzHjRUTb3Nch%2FveCgy3g1RcEgI%3D)

哇哦，感觉还行哦。但是，这还不够，我还可以玩！

刚才说了，SVG最大的优势就是自由，可以自由的更换颜色、尺寸，辣么，元素我也可以换呀，于是我把圆形换成了箭头。

```
<defs>
  <polygon id="arrow" fill="red" transform="translate(9.000000, 15.000000) rotate(270.000000) translate(-9.000000, -15.000000) " points="9 6 24 24 -6 24"></polygon>
</defs>
```

效果如下

![](http://storage.360buyimg.com/sourse/6.gif?Expires=3755082846&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=tVt4C4mur33kNOSbsYuqGUP%2BRYQ%3D)

嘿，有点意思，不过好像哪里不对，箭头的方向不对，既然可以换元素、颜色、尺寸，那方向也能换！小意思，上！

```
@keyframes left {to {transform: translate(-32px, 0)}}
@keyframes down {to {transform: translate(0, 32px) rotate(-90deg)}}
@keyframes right {to {transform: translate(32px, 0) rotate(180deg)}}
@keyframes up {to {transform: translate(0, -32px) rotate(90deg)}}
```

同时，SVG文件也必须改造一下，SVG的4条边的元素本身的位置和动画都得修改，具体SVG整体代码如下：

```
<defs>
    <polygon id="arrow" transform="translate(9.000000, 15.000000) rotate(270.000000) translate(-9.000000, -15.000000) " points="9 6 24 24 -6 24"></polygon>
  </defs>
  <use href="#arrow" x="96" y="0" style="animation-name: left, color"/>
  <use href="#arrow" x="64" y="0" style="animation-name: left, color"/>
  <use href="#arrow" x="32" y="0" style="animation-name: left, color"/>

  <use href="#arrow" x="0" y="0" style="animation-name: down, color; transform: rotate(-90deg); transform-origin: 16px 16px"/>
  <use href="#arrow" x="0" y="32" style="animation-name: down, color; transform: rotate(-90deg); transform-origin: 16px 48px"/>
  <use href="#arrow" x="0" y="64" style="animation-name: down, color; transform: rotate(-90deg); transform-origin: 16px 80px"/>

  <use href="#arrow" x="0" y="226" style="animation-name: right, color; transform: rotate(180deg); transform-origin: 16px 176px;"/>
  <use href="#arrow" x="32" y="226" style="animation-name: right, color; transform: rotate(180deg); transform-origin: 48px 176px;"/>
  <use href="#arrow" x="64" y="226" style="animation-name: right, color; transform: rotate(180deg); transform-origin: 80px 176px;"/>

  <use href="#arrow" x="160" y="160" style="animation-name: up, color; transform: rotate(90deg); transform-origin: 176px 112px"/>
  <use href="#arrow" x="160" y="128" style="animation-name: up, color; transform: rotate(90deg); transform-origin: 176px 80px"/>
  <use href="#arrow" x="160" y="96" style="animation-name: up, color; transform: rotate(90deg); transform-origin: 176px 48px"/>
```

每条边3个 `use` 元素，每个元素动画要写好，最后我们保存，刷新，效果如何呢？

![](http://storage.360buyimg.com/sourse/7.gif?Expires=3755083245&AccessKey=PoTZSCrI5Z0Ul1TD&Signature=aKBCQAUVPeoYUDBeOaOtkq2b0dE%3D)

看起来不错哦，我们还可以将箭头换成你要的任何元素，并且定制自己要的动画。

## 总结

### 优势

+ `border-image` 能够实现以往单调的线段边框所不能实现的效果，可以扩展页面的展示内容
+ SVG非常自由，我们能够定制元素的 `颜色`、`尺寸`、`动画` 等很多内容，相比GIF每次都得打开PS进行编辑，或者找设计师重新制作，简直不要太省事
+ SVG能够替代图片作为页面资源进行引用，并且体积非常小，就类似我们用的SVG图标字体，在非常高清的同时，还能够提高页面性能

### 缺点

+ `border-image` 在一些浏览器还是不够支持，不过目前大部分移动端都已经支持，在使用时要稍微注意
+ `border-image` 对图片或者SVG的内容栅格是有要求的，使用的时候，要注意对每条边框的设计进行详细测试
+ `SVG` 编辑起来还是有点难度和工作量的，有时候元素复杂的时候，挺费时间
+ 虽然容器尺寸改变，`border-image` 能够扩展，但是有些地方还是会露馅，需要进行微调

## 参考文献

* [border-image 的正确用法](https://aotu.io/notes/2016/11/02/border-image/index.html)


