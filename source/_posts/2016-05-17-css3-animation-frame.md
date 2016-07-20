title: CSS3动画之逐帧动画
subtitle: CSS3动画开发指南第二弹
date: 2016-05-17 00:00:00
cover: //img.aotu.io/Yettyzyt/css3-animation-frame/840.png
categories: Web开发
tags:
  - 动画
author:
  nick: 燕婷 
  github_name: Yettyzyt
---


## 什么是逐帧动画
---
要了解 CSS3 逐帧动画，首先要明确什么是逐帧动画。

看一下[维基百科](https://zh.wikipedia.org/zh-cn/%E5%AE%9A%E6%A0%BC%E5%8A%A8%E7%94%BB)中的定义：

> 定格动画，又名逐帧动画，是一种动画技术，其原理即将每帧不同的图像连续播放，从而产生动画效果。

简而言之，实现逐帧动画需要两个条件：**（1）相关联的不同图像，即动画帧；（2）连续播放。**

[](http://zhuanlan.zhihu.com/p/19855108)

我们儿时的记忆，手翻书，他所实现的就是逐帧动画：

![逐帧动画](//img.aotu.io/Yettyzyt/css3-animation-frame/sfs.jpg)

（图片来源：[知乎](http://zhuanlan.zhihu.com/p/19855108)）

## 前端逐帧动画实现方案
---
在细聊 css3 逐帧动画之前，我们先大致了解下前端实现逐帧动画有哪些方案。

其实不外乎三种技术（视频可以实现所有类型的动画，暂不纳入）：gif、JavaScript、CSS3 Animation。

前文提到，实现逐帧动画需要两个条件：（1）动画帧；（2）连续播放。

下面我们仔细自己分析下这三种技术是怎么实现上述条件的：

### （1）gif
在触屏页中，gif 常被用来做加载动画。如[《陌陌不孤独饭局》](http://w.benbun.com/momo/shaibingxiang/?from=timeline&isappinstalled=0)的加载动画：

![gif](//img.aotu.io/Yettyzyt/css3-animation-frame/momo_loading.gif)

**gif 可以有多个动画帧，连续播放是其自身属性，是否循环也是由其本身决定的。**它往往用来实现小细节动画，成本较低、使用方便。

但其缺点也是很明显的：

- 画质上，gif 支持颜色少(最大256色)、Alpha 透明度支持差，图像锯齿毛边比较严重；
- 交互上，不能直接控制播放、暂停、播放次数，灵活性差；
- 性能上，gif 会引起页面周期性的 paint ，性能较差。

### （2）JavaScript

**JS 与 CSS3，一般是将动画帧放到背景图中。**

不同的是， **JS 是使用脚本来控制动画的连续播放的**：

- 可以直接改变元素的 `background-image`
- 也可以将动画帧合并成雪碧图，通过改变 `background-position` 来实现

还是[《陌陌不孤独饭局》](http://w.benbun.com/momo/shaibingxiang/?from=timeline&isappinstalled=0)的例子：

其中有一个伸手取饭盒的动画，一共有19帧，且在第11帧处有一个交互，将雪碧图放入背景中，通过不同的样式实现不同的 `background-position` ，使用 JS 改变样式名：

```
.sprite-rice-1,
.sprite-rice-2,
…
.sprite-rice-19{
	background-image:url(http://7xnvb2.com2.z0.glb.qiniucdn.com/img/rice.jpg);
	background-repeat:no-repeat
}

```
```
.sprite-rice-1{background-position:-1800px 0}
.sprite-rice-2{background-position:-900px -489px}
…
.sprite-rice-19{background-position:-1200px 0}

```

![sprite](//img.aotu.io/Yettyzyt/css3-animation-frame/momo_rice.jpg)

使用 JS 的优点是兼容性佳，交互灵活。

### （3）CSS3 Animation

**CSS3 实际上是使用 `animation-timing-function` 的阶梯函数 `steps(number_of_steps, direction)` 来实现逐帧动画的连续播放的。**

在移动端，CSS3 Animation 兼容性良好，相对于 JS，CSS3 逐帧动画使用简单，且效率更高，因为许多优化都在浏览器底层完成。

因此在触屏页面中 CSS3 逐帧动画使用广泛，下文将对其进行详细介绍。

## CSS3 逐帧动画的实现
---

### （1）将动画帧合并为雪碧图

在触屏页面中，动画往往承担页面样式实现的角色（即不需要替换），因此我们会将图片放到元素的背景中（`background-image`）。

逐帧动画有不同的动画帧，我们可以通过更改 `background-image` 的值实现帧的切换，但多张图片会带来多个 HTTP 请求，且不利于文件的管理。

比较合适的做法，是将所有的动画帧合并成一张雪碧图（sprite），通过改变 `background-position` 的值来实现动画帧切换。因此，逐帧动画也被称为“精灵动画（sprite animation）”。

以京东到家的触屏页面[《年货送到家》](http://jdc.jd.com/fd/promote/201601/djnianhuo/)为例：

这个动画一个有三帧，将3个动画帧合并，并放到 `.p8 .page_key` 的背景中：

![](//img.aotu.io/Yettyzyt/css3-animation-frame/p8.png)

```
.p8 .page_key {
    position: absolute;
    width: 572px;
    height: 586px;
    background-image: url("../img/p8.png");
}
```

### （2）使用 steps 实现动画播放

steps 指定了一个阶梯函数，包含两个参数：

- 第一个参数指定了函数中的间隔数量（必须是正整数）；
- 第二个参数可选，指定在每个间隔的起点或是终点发生阶跃变化，接受 start 和 end 两个值，默认为 end。

（参考自[W3C](https://www.w3.org/TR/2012/WD-css3-transitions-20120403/#transition-timing-function-property)）

通过[W3C](https://www.w3.org/TR/css3-transitions/)中的这张图片来理解 steps 的工作机制：

![steps](//img.aotu.io/Yettyzyt/css3-animation-frame/1-2.png)


回到上述的例子，我们在 keyframes 中定义好每个动画帧：

```
@-webkit-keyframes p8{
    0%{background-position: 0 0;}
    33.33%{background-position: 0 -586px;}
    66.66%{background-position: 0 -1172px;}
    100%{background-position: 0 -1758px;}
}
```

然后，给他加上 `animation`：

```
.p8 .page_key{
	-webkit-animation: p8 steps(1,end) 1.5s infinite;
}
```


**为什么第一个参数是1？**

前文中提到，steps 是 `animation-timing-function` 的一个属性值，在 [W3C](https://www.w3.org/TR/css3-animations/#animation-timing-function-property) 中有如下说明：
> For a keyframed animation, the ‘animation-timing-function’ applies between keyframes, not over the entire animation. 

也就是说，`animation-timing-function` 应该于两个 keyframes 之间，而非整个动画。在上面的 keyframes 中，我们已经把每个帧都写出来了，所以两个 keyframes 之间的间隔是1。

**更加简便的写法？**

既然说 steps 第一个参数是指函数的间隔数量，那么我们就可以把 keyframes 的计算直接交给 steps 来完成。

```
.p8 .page_key{
	-webkit-animation: p8 steps(3,end) 1.5s infinite;
}
@-webkit-keyframes p8 {
    100% {background-position: 0 -1758px;}
}

```
以上两种写法效果是等同的。

## CSS3 逐帧动画使用技巧
---
### （1）step-start 与 step-end
除了 `steps` 函数，`animation-timing-function` 还有两个与逐帧动画相关的属性值 `step-start` 与 `step-end`：

- `step-start` 等同于 `steps(1,start)`：动画执行时以开始端点为开始；
- `step-end` 等同于 `steps(1,end)`：动画执行时以结尾端点为开始。

### （2）动画帧的计算：

```
$spriteWidth: 140px; // 精灵宽度 
@keyframes ani {
  100% {
    background-position: -($spriteWidth * 12) 0; // 12帧
  }
}
```

### （3）适配方案：rem+scale

我们知道，rem 的计算会存在误差，因此使用雪碧图时我们并不推荐用 rem。如果是逐帧动画的话，由于计算的误差，会出现抖动的情况。

那么在触屏页中，如何实现页面的适配？

这里小编提供一个思路：

- 非逐帧动画部分，使用 `rem` 做单位；
- 逐帧动画部分，使用 `px` 做单位，再结合 `js` 对动画部分使用 `scale` 进行缩放。
