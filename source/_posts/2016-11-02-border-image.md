title: border-image 的正确用法
subtitle: 尽管经常使用 border-image，但我们真的了解它的吗？
cover: //misc.aotu.io/leeenx/border-image/cover_900x500.png?v=1
categories: Web开发
tags:
  - border image
  - css3 border-image
  - 边框图片
author:
  nick: leeenx
  github_name: leeenx
coeditor:
    name: leeenx
    url: https://github.com/leeenx
wechat:
    share_cover: http://misc.aotu.io/leeenx/border-image/share.png
    share_title: border-image 的正确用法
    share_desc: 尽管经常使用 border-image，但我们真的了解它的吗？
date: 2016-11-02 21:22:23
---

<!-- more -->

# border-image 的正解用法

border-image 边框图片，顾名思义: 指定边框使用的图片。
尽管经常使用 border-image(-webkit-border-image)，但我们真的了解它的吗？

本文分两部分来介绍 border-image：

1. border-image 简史
2. border-image 用法

## 1. border-image 简史

CSS3 border 最开始是做为一个独立模块(CSS3 module: Border)被维护，后来(2005.2.16) W3C工作组将 border 和 background 两个模块合并作为一个新模块：**CSS3 Backgrounds and Borders Module**，08年又将其改名为 **CSS Backgrounds and Borders Module Level 3**。以下是具体过程：

- **CSS3 module: Border**
[W3C Working Draft 7 November 2002](https://www.w3.org/TR/2002/WD-css3-border-20021107/)
- **CSS3 Backgrounds and Borders Module**
[W3C Working Draft 16 February 2005](https://www.w3.org/TR/2005/WD-css3-background-20050216/)
- **CSS Backgrounds and Borders Module Level 3**
[W3C Working Draft 10 September 2008](https://www.w3.org/TR/2008/WD-css3-background-20080910/)
[W3C Working Draft 15 October 2009](https://www.w3.org/TR/2009/WD-css3-background-20091015/)
[W3C Candidate Recommendation 17 December 2009](https://www.w3.org/TR/2009/CR-css3-background-20091217/)
[W3C Working Draft 12 June 2010](https://www.w3.org/TR/2010/WD-css3-background-20100612/)
[W3C Candidate Recommendation 15 February 2011](https://www.w3.org/TR/2011/CR-css3-background-20110215/)
[W3C Working Draft 14 February 2012](https://www.w3.org/TR/2012/WD-css3-background-20120214/)
[W3C Candidate Recommendation 17 April 2012](https://www.w3.org/TR/2012/CR-css3-background-20120417/)
[W3C Candidate Recommendation 24 July 2012](https://www.w3.org/TR/2012/CR-css3-background-20120724/)
[W3C Last Call Working Draft 4 February 2014](https://www.w3.org/TR/2014/WD-css3-background-20140204/)
[W3C Candidate Recommendation 9 September 2014](https://www.w3.org/TR/css3-background/)

在 CSS3 border 的第一个工作草案(WD)『[W3C Working Draft 7 November 2002](https://www.w3.org/TR/2002/WD-css3-border-20021107/)』 定义了 border-image 的用法，经过漫长的十几年修订，border-image 经历了三次重要的演变：

### 1.1 草创阶段

>The border-image properties allow the author to assign images to borders. There are four groups of border image properties:
Specifying border images
These properties are used to specify the URI of the border image.
Fitting border images
These properties are used to specify how the image(s) are fitted in the border area.
Transforming border images
These properties are used to make the images of a side or a corner to be reflected or rotated versions of another.
The border image properties override the border style properties.
—— 摘录自：『[W3C Working Draft 7 November 2002 #the-border-image](https://www.w3.org/TR/2002/WD-css3-border-20021107/#the-border-image)』。

此时的 border-image 由3组属性成，分别是：
- border-image/border-corner-image
- border-fit/border-corner-fit
- border-transform/border-corner-transform

(ps: W3C 文档里提到有四组属性。不过笔者只找到上述三组)

**1.  border-image/border-corner-image**
border-image 指定四边的图像，border-corner-image 指定四个角的图像，注意这里分开指定四条边和四个角的图片即需要使用8个图像。如下：

![W3C示例图](//misc.aotu.io/leeenx/border-image/pow.png)

另外，每条边都可以指定三张图片：
![W3C示例图](//misc.aotu.io/leeenx/border-image/2016-10-28.png)

**2. border-fit/border-corner-fit**
指定 border-image/border-corner-image 的平铺方式。

**3.border-transform/border-corner-transform**
指定 border-image/border-corner-image 的变换方式。

具体可以参见：https://www.w3.org/TR/2002/WD-css3-border-20021107/#the-border-image

这个古老的版本对 bordr-image 做了全面的定义，甚至比当前(2016.11.1)的标准还要周到详细，但是这个版本过于笨重，很快被 W3C 的新标准替代。


### 1.2 发展阶段

『[W3C Working Draft 16 February 2005](https://www.w3.org/TR/2005/WD-css3-background-20050216/)』对上个版本做了极大的精简工作，并重新定义了一个简洁的 border-image ，语法如下：

```css
border-image: none | <uri> [<number> | <percentage>]{4} [ / <border-width>{1,4} ]? [stretch | repeat | round]{0,2}
```

>The four numbers or percentages immediately following the <uri> specify which part of that image is used for which part of the border. They divide the image into nine parts: four corners, four edges and a middle part. The middle part is used as an extra background image.
—— 摘录自：https://www.w3.org/TR/2005/WD-css3-background-20050216/#the-border-image

这个版本提出了九宫格的概念(border-image的精髓)并提供了简洁的语法。 Chrome/Safari 私有的 `-webkit-border-image` 实现了这个版本的语法，并将其发扬光大。至今(2016.11.1)国内不少介绍 border-image 技术文章都是在介绍这个版本。


### 1.3 成熟阶段

修订版 『[W3C Working Draft 15 October 2009](https://www.w3.org/TR/2009/WD-css3-background-20091015/)』在上个版本的基础上将 border-image 分拆成 border-image-* 家族，同时加入一个新的成员 border-image-outset。border-image-* 成员如下：

- border-image-source
- border-image-slice
- border-image-width
- border-image-outset
- border-image-repeat

border-image 成为上述五个属性的简写，语法也从此稳定下来，俨然已是一个正式的 W3C 标准(REC)。

## 2. border-image 的正确用法

>Authors can specify an image to be used in place of the border styles. In this case, the border's design is taken from the sides and corners of an image specified with ‘border-image-source’, whose pieces may be sliced, scaled and stretched in various ways to fit the size of the border image area. The border-image properties do not affect layout: layout of the box, its content, and surrounding content is based on the ‘border-width’ and ‘border-style’ properties only.
—— 摘录自： https://www.w3.org/TR/css3-background/#border-images

border-image 通过指定一张图片来取替 border-style 定义的样式，但 **border-image 生效的前提是： border-style 和 border-width 同时为有效值(即 border-style 不为 none，border-width 不为 0)。**

本章按 『[W3C Candidate Recommendation 9 September 2014](https://www.w3.org/TR/css3-background/)』规范来介绍 border-image 的用法。


### 2.1 border-image-source

语法：
```
border-image: none | <image>
```
指定边框图片的地址。 none 表示border-image不做任何效果，边框使用 border-style 指定的样式。

### 2.2 bordre-image-slice

语法：
```css
bordre-image-slice [<number> | <percentage>]{1,4} && fill?
```
border-image-slice 从名字上看就很好理解：边框图像切片。指定4个值(4条分割线：top, right, bottom, left)将 border-image-source 分割成9宫格，如下：

![gif 动图](//misc.aotu.io/leeenx/border-image/2ia2uu.gif)

**四条分割线的值**

border-image-slice 四条线的值类型为：number | percentage。

`number` 不带单位的数值。1 代表 1个图片像素。
`percentage` 百分比。

错误的写法：
```scss
border-image-slice: 27px 27px 27px 27px;
```

正确的写法：
```scss
border-image-slice: 27 27 27 27;
```



**关键字：fill**

> Specifies an image to use in place of the rendering specified by the ‘border-style’ properties and, if given the ‘fill’ keyword in ‘border-image-slice’, as an additional image backdrop for the element. 

**关键字fill的作用是：将border-image-source九宫格中间那一块切片作为DOM节点的背景。**

素材图片box.png:   
![box.png](//misc.aotu.io/leeenx/border-image/box.png)


CSS 代码：
```
.box {
	width: 27px;
	height:27px;
	border: 27px solid;
	border-image: url(box.png) 27 27 27 27 fill repeat stretch;//fil？
}
```
测试结果如下：
![结果截图](//misc.aotu.io/leeenx/border-image/result.png)

线上DEMO：
![qr](//misc.aotu.io/leeenx/border-image/qr.png)


### 2.3 border-image-width

语法：

```css
border-image-width: [ <length> | <percentage> | <number> | auto ]{1,4}
```

border-image-width 字面意思是边框图片宽度，作用是将 DOM 节点分割成九宫格。 假设 border-image-slice 分割 border-image-source 的九宫格为A， border-image-width 分割 DOM 的九宫格为 B，A 与 B 的每个格子存在一一对应关系，具体如下：

![border-image-width与border-image-slice的对应关系](//misc.aotu.io/leeenx/border-image/border-image-width.gif?v=4)

**border-image-width 参数的四种类型:**

`length` 带 px, em, in ... 单位的尺寸值
`percentage` 百分比
`number` 不带单位的数字；它表示 border-width 的倍数
`auto` 使用 auto， border-image-width 将会使用 border-image-slice 的值

**border-image-width 的参数不能为负值**
**border-image-width的缺省值是 number 类型：1** 

#### 2.3.1 border image area

border image area 是**成熟阶段**被引入用于解释 border-image-width 和 border-imaeg-out 的概念。

> The border image is drawn inside an area called the border image area. This is an area whose boundaries by default correspond to the border box
—— 摘录自: https://www.w3.org/TR/css3-background/#border-image-width

用于绘画 border image 的区域叫 border image area，它默认与边框盒子(border box)完全重合。简单地说，**border image area 就是 border-image-width 分割出来的九宫格**。

![border image area](//misc.aotu.io/leeenx/border-image/border-image-area.gif)

#### 2.3.2 border-box 与 border image area 的关系

上面有提到，border image area 默认与 border-box 是重合关系。如果把标准后退到发展阶段：

 

```css
border-image: none | <uri> [<number> | <percentage>]{4} [ / <border-width>{1,4} ]? [stretch | repeat | round]{0,2}
```



在发展阶段，DOM节点由 border-width 分割为九宫格，这个时期的 border-box 就是 border image area。

到了成熟阶段（即本章介绍的版本），**border-box 与 border image area 是默认重合的两个空间**，border-box 只负责盒子模型上的事务，border image area 则专注于边框图像空间分割。

#### 2.3.3 border-width 可以分割 border image area?

在实际使用过程中，笔者发现 border-width 也可以分割 border image area。如下：

测试CSS代码：
```css
.box {
	margin: 0 auto;
	width: 27px;
	height: 27px;
	border: 27px solid rgba(242,181,78,.3);
	border-image-source: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png);
	border-image-slice: 27 27 27 27 fill;
	border-image-repeat: stretch stretch;
}
```
截图如下：

![border-width](//misc.aotu.io/leeenx/border-image/border-width.jpg) ![border-width](//misc.aotu.io/leeenx/border-image/border-width2.jpg)

如果单从上述测试结果而言，border-width 可以分割 border image area 是正确。不过，这个结论有一个前提：border-image-border 与  border-image-outset 同时缺省。如果将 CSS 代码修为：

```css
.box {
	margin: 0 auto;
	width: 27px;
	height: 27px;
	border: 27px solid rgba(242,181,78,.3);
	border-image-source: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png);
	border-image-slice: 27 27 27 27 fill;
	border-image-outset: 10px;
	border-image-repeat: stretch stretch;
}
```

截图如下：

![border-width](//misc.aotu.io/leeenx/border-image/border-width3.jpg) ![border-width](//misc.aotu.io/leeenx/border-image/border-width4.jpg)

设置了 border-image-outset 后 border-width 的分割 border image area 的假像就被揭穿了！！
border-width 分割 border image area 的假象源自 border-image-width 的缺省值1，数值1表示 border-image-width 是 1x border-width，大白话就是**border-image-width 的默认值是border-width**。

**尽管在最新的CSS3标准中 “border-width 分割 border image area” 只是个假像，但当前(2016.11.1)阶段，为了更多浏览器兼容建议 border-width 与 border-image-width 保持一致，即使用 border-width 暂代 border-image-width。**

### 2.4 border-image-outset

语法：
```css
border-image-outset: [ <length> | <number> ]{1,4}
```
border-image-outset 字面意思是边框图片开端。作用是重新指定 border image area 的边界。

> The values specify the amount by which the border image area extends beyond the border box. If it has four values, they set the outsets on the top, right, bottom and left sides in that order. If the left is missing, it is the same as the right; if the bottom is missing, it is the same as the top; if the right is missing, it is the same as the top.
—— 摘录自：https://www.w3.org/TR/css3-background/#border-image-outset

通过指定 border-image-outset 的值，可以把 border image area 的区域延伸到 border-box 之外。如下：

```css
.box {
	margin: 0 auto;
	width: 81px;
	height: 81px;
	border: 27px solid rgba(0,0,0,.1);
	border-image-source: url(//misc.aotu.io/leeenx/border-image/box.png);
	border-image-slice: 27 27 27 27;
	border-image-repeat: repeat;
}
.outset {
	border-image-outset: 27px;
}
```

对比：
![border-image-outset](//misc.aotu.io/leeenx/border-image/demo3.png)

二维码:  
![二维码](//misc.aotu.io/leeenx/border-image/qr2.png?v=1)


 **border-image-outset 与 border-image-width 参数的意义是一样的。**
 **border-image-outset 的值不能为负值**

### 2.5 border-image-repeat

语法：
```scss
border-image-repeat: [ stretch | repeat | round | space ]{1,2}
```

border-image-repeat 字面意义是 边框图片平铺。作用是指定 border-image 的平铺方式。语法上最多可接收两个参数，第一个参数指定水平方向边框的平铺方式，第二个参数指定垂直方向边框的平铺方式，九宫格的中间区域受这两参数的共同影响，如下：

![round round](//misc.aotu.io/leeenx/border-image/demo2_1.jpg) 
![round round](//misc.aotu.io/leeenx/border-image/demo2_2.jpg) 
![round round](//misc.aotu.io/leeenx/border-image/demo2_3.jpg) 
![round round](//misc.aotu.io/leeenx/border-image/demo2_4.jpg)

目前只能四值可供选择：stretch,  repeat, round, space。
其中，stretch 是默认值，space 目前chrome浏览器按 repeat 来渲染。这四个参数的效果如下：

![border-image-outset](//misc.aotu.io/leeenx/border-image/stretch.png) ![border-image-outset](//misc.aotu.io/leeenx/border-image/repeat.png) ![border-image-outset](//misc.aotu.io/leeenx/border-image/round.png) ![border-image-outset](//misc.aotu.io/leeenx/border-image/space.png) 

repeat 与 round 的区别：round 除了能平铺外还能通过伸缩使背景完整显示。
round 与 space 的区别：虽然都使背景完整显示，但是 space 在小方块之间有一定的空隙。


二维码:  
![二维码](//misc.aotu.io/leeenx/border-image/qr4.png)


### 简写：border-image

语法：

```css
border-image: <‘border-image-source’> || <‘border-image-slice’> [ / <‘border-image-width’> | / <‘border-image-width’>? / <‘border-image-outset’> ]? || <‘border-image-repeat’>
```

简写其实没什么好说的，不过由于 border-image-slice、border-image-width 与 border-image-outset 这三者的参数相似，所以有必要说一下，这三个参数在简写里有两个注意点:

**一、 border-image-outset 参数一定要在 border-image-width 之后，假设border-image-width缺省，仍然需要在原来 border-image-width 写上 /**，如下：

正确的写法：
```scss
border-image: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png) 27 27 27 27 / / 10px;
```

错误的写法：
```scss
border-image: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png) 27 27 27 27 / 10px;//这样写 10px会被当作 border-width
```

**二、 如果有 border-image-width/ border-image-outset 属性值，border-image-slice必须指定数值，否则不合语法**，如下：

正确的写法:
```scss
border-image: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png) 27 27 27 27 / 10px / 10px;
```
错误的写法：
```scss
border-image: url(http://7xv39r.com1.z0.glb.clouddn.com/box.png) / 10px / 10px;
```

### 后记

实践过程中遇到BUG：

safari浏览器下，border-color不能使用 `transparent` 与 `rgba(x,x,x, 0)`。否则，border-image 会失效。

补记于：2016.12.26

-------
参考资料：
- [W3C Working Draft 7 November 2002](https://www.w3.org/TR/2002/WD-css3-border-20021107/)
- [W3C Working Draft 16 February 2005](https://www.w3.org/TR/2005/WD-css3-background-20050216/)
- [W3C Candidate Recommendation 9 September 2014](https://www.w3.org/TR/css3-background/)
- [css3：border-image边框图像详解](http://www.tuicool.com/articles/EJZnUnm)
- [CSS3 border-image详解、应用及jQuery插件](http://www.zhangxinxu.com/wordpress/2010/01/css3-border-image/)

