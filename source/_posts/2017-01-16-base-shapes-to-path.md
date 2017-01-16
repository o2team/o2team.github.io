title: 聊聊 SVG 基本形状转换那些事
subtitle: 介绍如何把SVG基本形状转换为更紧凑的path形式
cover: //misc.aotu.io/pfan123/svgpath/svgpath_banner.png?t=123
categories: 移动开发
tags:
  - svg
  - path
  - circle
  - rect
  - ellipse
  - polygon
  - polyline
  - line
author:
    nick: 高大师
    github_name: pfan123
wechat:
    share_cover: http://misc.aotu.io/pfan123/svgpath/svgpath_200x200.png
    share_title: 聊聊 SVG 基本形状转换那些事
    share_desc: 介绍如何把SVG基本形状转换为更紧凑的path形式
date: 2017-1-16 12:36:37

---

<!-- more -->
## 前言

前段时间研究 SVG 压缩优化，发现SVG预定义的 `rect`、`circle`、`ellipse`、`line`、`polyline`、`polygon`  六种基本形状可通过path路径转换实现，这样可以在一定程度上减少代码量。不仅如此，我们常用的 SVG Path 动画(路径动画)，是以操作path中两个属性值`stroke-dasharray`和`stroke-dashoffset`来实现，基本形状转换为path路径，有利于实现路径动画。

## SVG基本形状

SVG 提供了`rect`、`circle`、`ellipse`、`line`、`polyline`、`polygon`六种基本形状用于图形绘制，这些形状可以直接用来绘制一些基本的形状，如矩形、椭圆等，而复杂图形的绘制则需要使用 path 路径来实现。

![svg基本形状](//img.pfan123.com/svgpath1.jpg)

#### 1.`rect` 矩形

```
<rect x="10" y="10" width="30" height="30"/>
<rect x="60" y="10" rx="10" ry="10" width="30" height="30"/>
```

SVG中`rect`元素用于绘制矩形、圆角矩形，含有6个基本属性用于控制矩形的形状以及坐标，具体如下：

```
 x       矩形左上角x位置, 默认值为 0 
 y       矩形左上角y位置, 默认值为 0
 width   矩形的宽度, 不能为负值否则报错, 0 值不绘制
 height  矩形的高度,  不能为负值否则报错, 0 值不绘制
 rx      圆角x方向半径, 不能为负值否则报错
 ry      圆角y方向半径, 不能为负值否则报错
```

这里需要注意，`rx` 和 `ry` 的还有如下规则：

- `rx` 和 `ry` 都没有设置, 则 rx = 0 ry = 0
- `rx` 和 `ry` 有一个值为0, 则相当于 rx = 0 ry = 0，圆角无效
- `rx` 和 `ry` 有一个被设置, 则全部取这个被设置的值
- `rx` 的最大值为 `width` 的一半, `ry` 的最大值为 `height` 的一半

```
 rx = rx || ry || 0;
 ry = ry || rx || 0;

 rx = rx > width / 2 ? width / 2 : rx;
 ry = ry > width / 2 ? width / 2 : ry;

 if(0 === rx || 0 === ry){
  rx = 0,
  ry = 0;  //圆角不生效，等同于，rx，ry都为0
 }

```

#### 2.`circle` 圆形 

```
<circle cx="100" cy="100" r="50" fill="#fff"></circle>
```

SVG中`circle`元素用于绘制圆形，含有3个基本属性用于控制圆形的坐标以及半径，具体如下：

```
 r       半径
 cx      圆心x位置, 默认为 0
 cy      圆心y位置, 默认为 0
```

#### 3.`ellipse` 椭圆 

```
<ellipse cx="75" cy="75" rx="20" ry="5"/>
```

SVG中`ellipse`元素用于绘制椭圆，是`circle`元素更通用的形式，含有4个基本属性用于控制椭圆的形状以及坐标，具体如下：

```
 rx      椭圆x半径
 ry      椭圆y半径
 cx      圆心x位置, 默认为 0
 cy      圆心y位置, 默认为 0
```

#### 4.`line` 直线 

```
<line x1="10" x2="50" y1="110" y2="150"/>
```

`Line`绘制直线。它取两个点的位置作为属性，指定这条线的起点和终点位置。

```
x1 起点的x位置
y1 起点的y位置
x2 终点的x位置
y2 终点的y位置
```

#### 5.`polyline` 折线 

```
<polyline points="60 110, 65 120, 70 115, 75 130, 80 125, 85 140, 90 135, 95 150, 100 145"/>
```

`Polyline`是一组连接在一起的直线。因为它可以有很多的点，折线的的所有点位置都放在一个points属性中：

```
points 点集数列，每个数字用空白、逗号、终止命令符或者换行符分隔开，每个点必须包含2个数字，一个是x坐标，一个是y坐标 如0 0, 1 1, 2 2”
```

#### 6.`polygon` 多边形 

```
<polygon points="50 160, 55 180, 70 180, 60 190, 65 205, 50 195, 35 205, 40 190, 30 180, 45 180"/>
```

`polygon`和折线很像，它们都是由连接一组点集的直线构成。不同的是，`polygon`的路径在最后一个点处自动回到第一个点。需要注意的是，矩形也是一种多边形，如果需要更多灵活性的话，你也可以用多边形创建一个矩形。

```
points 点集数列，每个数字用空白、逗号、终止命令符或者换行符分隔开，每个点必须包含2个数字，一个是x坐标，一个是y坐标 如0 0, 1 1, 2 2， 路径绘制完闭合图形”
```

## SVG path 路径

SVG 的路径`<path>`功能非常强大，它不仅能创建其他基本形状，还能创建更多复杂的形状，路径是由一些命令来控制的，每一个命令对应一个字母，并且区分大小写，大写主要表示绝对定位，小写表示相对定位。`<path>` 通过属性 d 来定义路径， d 是一系列命令的集合，主要有以下几个命令：

![svg基本形状](//img.pfan123.com/svgpath2.jpg)

通常大部分形状，都可以通过指令`M(m)`、`L(l)`、`H(h)`、`V(v)`、`A(a)`来实现，注意特别要区分大小写，相对与绝对坐标情况，转换时推荐使用相对路径可减少代码量，例如：

```
  // 以下两个等价
  d='M 10 10 20 20'     // (10, 10) (20 20) 都是绝对坐标
  d='M 10 10 L 20 20'

  // 以下两个等价
  d='m 10 10 20 20'     // (10, 10) 绝对坐标, (20 20) 相对坐标
  d='M 10 10 l 20 20'
```


## SVG 基本形状路径转换原理

#### 1.rect to path

如下图所示，一个 rect 是由 4 个弧和 4 个线段构成；如果 rect 没有设置 rx 和 ry 则 rect 只是由 4 个线段构成。rect 转换为 path 只需要将 A ~ H 之间的弧和线段依次实现即可。

![svg基本形状](//img.pfan123.com/rect2path.png)

```
 function rect2path(x, y, width, height, rx, ry) {
     /*
     * rx 和 ry 的规则是：
     * 1. 如果其中一个设置为 0 则圆角不生效
     * 2. 如果有一个没有设置则取值为另一个
     */
     rx = rx || ry || 0;
     ry = ry || rx || 0;

    //非数值单位计算，如当宽度像100%则移除
    if (isNaN(x - y + width - height + rx - ry)) return;

    rx = rx > width / 2 ? width / 2 : rx;
    ry = ry > height / 2 ? height / 2 : ry;

    //如果其中一个设置为 0 则圆角不生效
    if(0 == rx || 0 == ry){
          // var path =
          //     'M' + x + ' ' + y +
          //     'H' + (x + width) +     不推荐用绝对路径，相对路径节省代码量
          //     'V' + (y + height) +
          //     'H' + x +
          //     'z';
          var path =
              'M' + x + ' ' + y +
              'h' + width +
              'v' + height +
              'h' + -width +
              'z';                
    }else{
          var path =
              'M' + x + ' ' + (y+ry) +
              'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + (-ry) + 
              'h' + (width - rx - rx) +
              'a' + rx + ' ' + ry + ' 0 0 1 ' + rx + ' ' + ry + 
              'v' + (height - ry -ry) +
              'a' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' ' + ry + 
              'h' + (rx + rx -width) +
              'a' + rx + ' ' + ry + ' 0 0 1 ' + (-rx) + ' ' + (-ry) + 
              'z';        
    }

    return path;
 }
```

#### 2.circle/ellipse to path

圆可视为是一种特殊的椭圆，即 rx 与 ry 相等的椭圆，所以可以放在一起讨论。 椭圆可以看成A点到C做180度顺时针画弧、C点到A做180度顺时针画弧即可。

![svg基本形状](//img.pfan123.com/ellipse2path.png)

```
 function ellipse2path(cx, cy, rx, ry) {
    //非数值单位计算，如当宽度像100%则移除
    if (isNaN(x - y + width - height + rx - ry)) return;

    var path =
        'M' + (cx-rx) + ' ' + cy +
        'a' + rx + ' ' + ry + ' 0 1 0 ' + 2*rx + ' 0' +
        'a' + rx + ' ' + ry + ' 0 1 0 ' + (-2*rx) + ' 0' +
        'z'; 

    return path;
 }
```

#### 3.line to path

```
 function line2path(x1, y1, x2, y2) {
     x1 = x1 || 0;
     y1 = y1 || 0;
     x2 = x2 || 0;
     y2 = y2 || 0;

     var path = 'M' + x1 + ' '+ y1 + 'L' + x2 + ' ' + y2;
     return path;
 }
```

#### 4.polyline/polygon to path

`polyline`折线、`polygon`多边形的转换为path比较类似，差别就是`polygon`多边形会闭合。

```
 // polygon折线转换
 points = [x1, y1, x2, y2, x3, y3 ...];
 function polyline2path (points) {
     var path = 'M' + points.slice(0,2).join(' ') +
                       'L' + points.slice(2).join(' '); 
     return path;
 }

 // polygon多边形转换
 points = [x1, y1, x2, y2, x3, y3 ...];
 function polygon2path (points) {
     var path = 'M' + points.slice(0,2).join(' ') +
                       'L' + points.slice(2).join(' ') + 'z'; 
     return path;
 } 
```

## `convertpath`转换工具 

为了方便处理SVG基本元素路径转换，我写了`convertpath`库工具，可很方便处理基本元素路径转换问题 ，具体如下：

安装：
```
npm i convertpath
```

使用：

```
const parse = require('convertpath');
parse.parse("./test/test.svg")
/**
 * <circle cx="500" cy="500" r="20" fill="red"/>
 */
console.log(parse.toSimpleSvg())

/**
 * <path d="M500,500,m-20,0,a20,20,0,1,0,40,0,a20,20,0,1,0,-40,0,Z" fill="red"/>
 */
```

参考资料：

[w3c Basic shapes](https://www.w3.org/TR/SVG/shapes.html)
[基本形状](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Basic_Shapes)
[SVG (一) 图形, 路径, 变换总结; 以及椭圆弧线, 贝塞尔曲线的详细解释](https://segmentfault.com/a/1190000004393817)
[路径](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Tutorial/Paths)
[xmldom](https://github.com/jindw/xmldom)  
