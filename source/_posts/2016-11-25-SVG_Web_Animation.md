title: 三看 SVG Web 动效
subtitle: 800字作文再也不用担心凑不够字数啦！
cover: //misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/svg_web_animation_900x500.png
categories: Web开发
tags:
  - SVG
  - 动效
author:
  nick: EC
  github_name: lyxuncle
wechat:
    share_cover: http://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/svg_web_animation_200x200.png
    share_title: 三看 SVG Web 动效
    share_desc: 800字作文再也不用担心凑不够字数啦！
date: 2016-11-22 17:33:00
---

CSS3 动效玩腻了吗？没关系的，我们还有 SVG。

<!-- more -->

[Welikesmall](http://www.welikesmall.com/) 是一个互联网品牌宣传代理，这是我见过的最喜欢使用 SVG 做动效的网页设计团队。事实上，越来越多的网页动效达人选择在 SVG 的疆土上开辟动效的土壤，即便 SMIL 寿将终寝，事实上这反而将 SVG 动效推向了一个新的世界：CSS3 Animation + SVG。

![Alt text](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/1479630242685.png)

（[SMIL is dead! Long live SMIL! A Guide to Alternatives to SMIL Features](https://css-tricks.com/smil-is-dead-long-live-smil-a-guide-to-alternatives-to-smil-features/)）

还记得我在久远的[《以电影之眼看 CSS3 动画》](https://aotu.io/notes/2015/11/23/css3-animation-to-movie-part_1/)中说道：“CSS3 动画简直拥有了整个世界！”那么带上 SVG 的 CSS3 动画则已突破天际向着宇宙级的可能性前进（感觉给自己挖了一个无比巨大的坑，网页动画界可不敢再出新技术了[扶额]）。

CSS 与 SVG 的打通无疑将 html 代码的可读性又推上一个台阶，我们可以通过 CSS 控制 SVG 图形的尺寸、填色、边框色、过渡、移动变幻等相当实用的各种属性，除此之外，将图形分解的动画在这种条件下也变得相当简单。

## 索引

本文将讲到三个动效例子：
  - [**箭头**描线动效](http://codepen.io/lyxuncle/pen/wozzrV)
  - [**播放按钮**滤镜动效](http://codepen.io/lyxuncle/pen/qqbopp)
  - [**虚线**描线动效](http://codepen.io/lyxuncle/pen/bBejZZ)

动效来源：[WLS-Adobe](http://www.welikesmall.com/work/adobe/)

即将聊到的 SVG 标签：
  - `<path>`
  - `<g>`
  - `<symbol>`
  - `<defs>`
  - `<use>`
  - `<clipPath>`
  - `<mask>`

以及属性：
  - `viewBox`
  - `preserveAspectRatio`
  - `fill`
  - `stroke`
  - `stroke-dasharray`
  - `stroke-dashoffset`
  - `d`
  - `clip-path`
  - `mask`

## 从一个简单的例子说起

![arrow hover](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/arrow_hover_svg.gif)

要做出这样的效果，第一步是将图形画出来。徒手敲代码这种事还是留给图形工具来做，但是，为了更好地控制与制作动效，咱至少要做到读懂 SVG 代码。

SVG 的基本格式是使用 `<svg>` 标签对代码进行包裹，可直接将代码段插入 html 中，也可以保存成 svg 文件之后使用 `img`、`object` 进行引用。

```html
<svg width="100%" height="100%">   
  <!-- SVG markup here. -->    
</svg>
```

由于交互动效所需，这里仅介绍直接使用 `svg` 标签的情况。

```html
<svg width="90" height="13" viewBox="0 0 89.4 12.4">
  <line x1="0" y1="6.2" x2="59.6" y2="6.2"></line>
  <line x1="54.7" y1="0.7" x2="60.5" y2="6.5"></line>
  <line x1="54.7" y1="11.7" x2="60.5" y2="5.8"></line>
</svg>
```

这是箭头的代码段，使用了最简单的线条进行绘制。可以看到其中包裹了许多坐标样的属性值。有坐标就意味着有坐标系。

SVG 的坐标系存在三个概念：视窗、视窗坐标系、用户坐标系。视窗坐标系与用户坐标系属于 SVG 的两种坐标系统，默认情况下这两个坐标系的点是一一对应的。与 web 其他坐标系相同，原点位于视窗的左上角，x 轴水平向右，y 轴垂直向下。

![Canvas Default Grid](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/Canvas_default_grid.png)

（图片来源：[MDN-SVG Tutorial-Positions](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions)）

SVG 的位置、大小与文档流中的块级元素相同，都可由 CSS 进行控制。

视窗即为在页面中 SVG 设定的尺寸可见部分，默认情况下 SVG 超出隐藏。

SVG 能通过 viewBox 属性就完成图形的位移与缩放。

> viewBox属性值的格式为(x0,y0,u_width,u_height)，每个值之间用逗号或者空格隔开，它们共同确定了视窗显示的区域：视窗左上角坐标设为(x0,y0)、视窗的宽设为 u_width，高为 u_height；这个变换对整个视窗都起作用。

下图展示了当 viewBox 尺寸与 SVG 尺寸相同、放大一倍、缩小一倍时的表现：

![viewBox 1:1](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/viewBox1-1.gif)

![viewBox 1:2](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/viewBox1-2.gif)

![viewBox 2:1](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/viewBox2-1.gif)

一句话总结，就是用户坐标系需要以某种方式铺满整个视窗。默认的方式是以最短边为准铺满，也就是类似 background-size 中的 cover 值。通过 `preserveAspectRatio` 属性你可以控制用户坐标系的展开方式与位置，完美满足你的各种需求。

> preserveAspectRatio 是一個以對齊為主，然後再選擇要自動填滿還是咖掉的屬性。——引用来源[《SVG 研究之路 (23) - 理解 viewport 與 viewbox》](http://www.oxxostudio.tw/articles/201409/svg-23-viewpoint-viewBox.html)

属性的语法如下：`preserveAspectRatio="[defer] <align> [<meetOrSlice>]"`

注意3个参数之间需要使用空格隔开。

> **`defer`**：可选参数，只对 `image` 元素有效，如果 `image` 元素中 `preserveAspectRatio` 属性的值以 `defer` 开头，则意味着 `image` 元素使用引用图片的缩放比例，如果被引用的图片没有缩放比例，则忽略 `defer`。所有其他的元素都忽略这个字符串。
>
> **meetOrSlice**：可选参数，可以去下列值：
>  - `meet` - 默认值，统一缩放图形，让图形全部显示在 viewport 中。
>  - `slice` - 统一缩放图形，让图形充满 viewport，超出的部分被剪裁掉。
> 
> ——引用来源[《突袭 HTML5 之 SVG 2D 入门6 - 坐标与变换》](http://www.cnblogs.com/dxy1982/archive/2012/05/07/2395732.html)

**align**：必选参数。由两个名词组成。

> 這兩個名詞分別代表 viewbox 與 viewport 的 x 方向對齊模式，以及 y 方向的對齊模式，換句話說，可以想成：「水平置中 + 垂直靠上對齊」的這種感覺，不過在這個 align 的表現手法倒是很抽象，可以用下方的表格看出端倪：
> 
> ![preserveAspectRatio align](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/preserveAspectRatio-align.png)
>
> 也因此我們要做一個「水平置中 + 垂直靠上對齊」的 viewbox 設定，就必須寫成：xMidYMin，做一個「水平靠右對齊 + 垂直靠下對齊」的 viewbox 設定，就必須寫成：xMaxYMax，不過這裡有個細節請特別注意，「Y」是大寫呀！真是不知道為什麼會這樣設計，我想或許跟命名規則有關吧！
>
> ——引用来源[《SVG 研究之路 (23) - 理解 viewport 與 viewbox》](http://www.oxxostudio.tw/articles/201409/svg-23-viewpoint-viewBox.html)

下图诠释了各种填充的效果：

![PreserveAspectRatio](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/PreserveAspectRatio.png)

（图片来源：[7 Coordinate Systems, Transformations and Units](https://www.w3.org/TR/SVG/coords.html)）

在这一层面处理好图形的展示之后，剩下的所有变换，无论是 translate、rotate 还是 opacity，我们都可以全权交给 CSS 来处理，并且可以将图形细化到形状或者路径的层面进行变换。

然而实际情况是，刚才的那段代码，放进codepen之后是什么也看不见的，原因就在于这个路径的绘制既没有填充颜色也没有描边。

### 填充——`fill`

`fill` 属性用于给形状填充颜色。

```css
svg line {
	fill: #000; /* 填充黑色 */
}
```

填充色的透明度通过 `fill-opacity` 设置。

> `fill-rule` 用于设置填充方式，算法较为抽象，除了 `inherit` 这个取值，还可取以下两种值：
> 
> `nonzero`：这个值采用的算法是：从需要判定的点向任意方向发射线，然后计算图形与线段交点的处的走向；计算结果从0开始，每有一个交点处的线段是从左到右的，就加1；每有一个交点处的线段是从右到左的，就减1；这样计算完所有交点后，如果这个计算的结果不等于0，则该点在图形内，需要填充；如果该值等于0，则在图形外，不需要填充。看下面的示例：
>
> ![Alt text](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/1479651074890.png)
>
> `evenodd`：这个值采用的算法是：从需要判定的点向任意方向发射线，然后计算图形与线段交点的个数，个数为奇数则改点在图形内，需要填充；个数为偶数则点在图形外，不需要填充。看下图的示例：
>
> ![Alt text](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/1479651086456.png)
>
> ——引用来源[《突袭 HTML5 之 SVG 2D 入门4 - 笔画与填充》](http://www.cnblogs.com/dxy1982/archive/2012/04/14/2395734.html)

然而我们发现，我们的箭头即使填充了颜色，还是什么也看不见，问题就出在我们绘制的时候使用了没有面积的 `line` 标签。这个时候，就需要出动描边了。

### 描边——`stroke`

这个 `stroke` 可得大书特书，因为光是这个 `stroke` 就能搞定80%的描线动效。

直接通过 `stroke` 设置描边色，我们就能立刻看到刚才的箭头了。通过 `stroke-width` 则可以对描边的粗细进行修改。

```css
svg line {
  stroke: #000;
  stroke-width: 1px;
}
```

![arrow](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/arrow.png)

#### 线的虚实：`stroke-dasharray`
（敲黑板）王牌属性出现辣！
这个属性的属性值是1到 n 个数字，多个数字由逗号隔开，CSS 中的定义则由空格分开，每个数字定义了实线段的长度，分别是按照绘制、不绘制这个顺序循环下去。

下面是设置了1个、2个、3个数字时虚线的描绘情况对比：

![stroke-dasharray](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/stroke-dasharray.png)

#### `stroke-dashoffset`
（敲黑板）这个也是重点属性！
当我们将描边虚实设置成实线部分与图形描边长度相同时，我们是看不到空白段的部分的。这时形状的描边就像完全描绘出来了一样。这时我们使用这个属性，将虚线开始的位置稍微做一下移动，无论是往前移还是往后移，我们都能看到图形描边出现了一段空白，当这个移动形成一个连续的动作时，描线动效就这么不经意的出现了（蓦然回首）。

```css
svg line {
  stroke-dasharray: 60;
	stroke-dashoffset: 60;
	transition: stroke-dashoffset ease-in .5s;
}

svg:hover line {
	stroke-dashoffset: 0;
}
```
![arrow animation](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/arrow_ani_1.gif)

再对头部做个延时处理，修改一下虚线移动的方向，动效看起来会更顺眼一些。这个时候，SVG 可以分路径编辑的优势就体现出来了。对每个 `line` 添加一个类，我们就能对每条路径进行差异化处理（[Codepen](http://codepen.io/lyxuncle/pen/KNaJad)）。

```html
<svg width="360" height="52" viewBox="0 0 89.4 12.4">
  <line class="arrow-line" x1="0" y1="6.2" x2="59.6" y2="6.2"></line>
  <line class="arrow-head" x1="54.7" y1="0.7" x2="60.5" y2="6.5"></line>
  <line class="arrow-head" x1="54.7" y1="11.7" x2="60.5" y2="5.8"></line>
</svg>
```

```css
svg line {
  fill: #000;
  stroke: #000;
  stroke-width: 1px;
}
.arrow-line {
  stroke-dasharray: 60;
  stroke-dashoffset: 60;
  transition: stroke-dashoffset ease-in .5s .2s;
}
.arrow-head {
  stroke-dasharray: 9;
  stroke-dashoffset: -9;
  transition: stroke-dashoffset ease-in .2s;
}
svg:hover line {
  stroke-dashoffset: 0;
}
svg:hover .arrow-line {
  transition: stroke-dashoffset ease-in .5s;
}
svg:hover .arrow-head {
  transition: stroke-dashoffset ease-in .2s .5s;
}
```

![arrow animation](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/arrow_ani_2.gif)

了解了这两个重点属性，动效剩下的重担，就落在了 dasharray 与 dashoffset 值的计算上了。这个步骤或许没有什么捷径，简单的直线、弧线之类的或许还能口算口算，其余的不规则图形也就只有多试这条傻路可走，如果你是图形高手就当我没说。

另外三个描边属性：`stroke-linecap`、`stroke-linejoin`、`stroke-miterlimit` 由于暂时用不上惨遭抛弃，具体可参考[MDN-SVG Tutorial-Fills and Strokes](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes)，`stroke-miterlimit` 详解[SVG 研究之路（16）- Stroke-miterlimit](http://www.oxxostudio.tw/articles/201409/svg-16-storke-miterlimit.html)。

### 图形绘制

箭头的绘制只用到了路径中最简单的直线路径 `line`，SVG 中还有矩形 `rect`、圆形 `circle`、椭圆 `ellipse`、折线 `polyline`、多边形 `polygon` 以及万能的路径 `path`。之所以将一些规整的图形单独出标签，是为了代码的可读性更强些，毕竟 SVG 的可读性已经没那么强了……

规整图形的属性较好理解（具体可参考[MDN-SVG Tutorial-Path](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)），这里深入讲解一下如何阅读路径 `path` 的代码。

#### 绝对坐标绘制指令

> 这组指令的参数代表的是绝对坐标。假设当前画笔所在的位置为(x0,y0)，则下面的绝对坐标指令代表的含义如下所示：
> 
> ![Alt text](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/1479654445931.png)
> 
> 移动画笔指令 `M`，画直线指令：`L`，`H`，`V`，闭合指令 `Z` 都比较简单；下面重点看看绘制曲线的几个指令。

##### 绘制圆弧指令：`A` rx ry x-axis-rotation large-arc-flag sweep-flag x y
> 用圆弧连接2个点比较复杂，情况也很多，所以这个命令有7个参数，分别控制曲线的的各个属性。下面解释一下数值的含义：
> rx,ry 是弧所在的椭圆的半长轴、半短轴长度，rx 为 x 轴上的轴长，ry 为 y 轴上的周长。
> x-axis-rotation 是此段弧的顺时针旋转角度，负数代表逆时针转动的角度。
> large-arc-flag 两个值：`1`或`0`。`1`表示大角度弧线，`0`代表小角度弧线。
> sweep-flag 两个值：`1`或`0`。`1`代表从起点到终点弧线绕中心顺时针方向，`0`代表逆时针方向。
> x,y 是弧终端坐标。

为了更好的理解圆弧的绘制，我们来试试手动画一下 [MDN 上的范例](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Arcs)：

```html
<svg width="320px" height="320px" viewBox="0 0 320 320">
  <path d="M10 315
           L 110 215
           A 30 50 0 0 1 162.55 162.45
           L 172.55 152.45
           A 30 50 -45 0 1 215.1 109.9
           L 315 10" stroke="black" fill="green" stroke-width="2" fill-opacity="0.5"/>
</svg>
```

![SVG Arcs XAxisRotation with grid](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/SVGArcs_XAxisRotation_with_grid.png)

首先是 `M` 和 `L` 指令：

![path d first step](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-first-step.png)

然后是 `A` 指令的绘制，在这一步可以看到 large-arc-flag（大小弧）与 sweep-flag（弧度方向）值的影响。

在本例中，弧度标记值为`0`，意味着选择小弧；弧度方向标记值为`1`，意味着选择起点到终点为顺时针方向的那条弧（别眨眼）：

![path d arcs](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-step-3.gif)

接下来我们省略掉 `L` 指令的绘制，来看看下一个圆弧。这个圆弧的旋转角度（x-axis-rotation）发生了变化，体会一下差异：

![path d last step](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-last-step.png)

看了这么久，是不是挺纳闷这么难看的东西为什么一定要读懂？其实也不是强求各位看官能成为脑补 SVG 图形的天才，只是大概读懂这些难看的数字，在做动画的时候才会心里有底手上有劲点，至少大概知道这条东西画出来是什么样，而后再针对它写写动效。所以，我们继续看看图形界的万金油——[贝塞尔曲线](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)吧～！

> ……贝塞尔曲线被广泛地在计算机图形中用来为平滑曲线建立模型。贝塞尔曲线是矢量图形文件和相应软件（如 PostScript、PDF 等）能够处理的唯一曲线，用于光滑地近似其他曲线。二次和三次贝塞尔曲线最为常用。
> 引用来源：[维基百科——贝塞尔曲线——应用](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A#.E6.87.89.E7.94.A8)

[维基上](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A#.E5.BB.BA.E6.A7.8B.E8.B2.9D.E8.8C.B2.E6.9B.B2.E7.B7.9A)有详细的贝塞尔曲线绘制公式与动图展示，这里就不做展开。

`path` 中的贝塞尔曲线指令共有四个：`C`，`S`，`Q`，`T`。SVG 只提供了最高阶到三次的贝塞尔曲线绘制指令，事实上大部分绘图软件也是如此。

##### 三次贝塞尔曲线：`C` x1 y1, x2 y2, x y （或者 `c` dx1, dy1, dx2, dy2, dx dy）

> 三次贝塞尔曲线有两个控制点，就是(x1,y1)和(x2,y2)，最后面(x,y)代表曲线的终点。

这个时候还是上动图比较省心。以下面的代码段为例：

```html
<svg width="300" height="100" viewBox="0 0 60 30">
  <path d="M10 10 C 20 20, 40 20, 50 10" stroke="#000" fill="transparent"></path>
</svg>
```

绘制过程如下：

![path d bezier](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-bezier.gif)

（手残，顺滑绘制过程请还是参考[维基君](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A#.E5.BB.BA.E6.A7.8B.E8.B2.9D.E8.8C.B2.E6.9B.B2.E7.B7.9A)。）

借助 PS 中的钢笔工具根据辅助线能迅速画出路径，可以免去那抽象的计算过程。

![draw bezier curve with ps](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-bezier-ps.gif)

##### 简化版三次贝塞尔曲线：`S` x2 y2, x y （或者 `s` dx2 dy2, dx dy）

很多时候，曲线不止一个弧，为了平滑过渡，第二个曲线的控制点常常是第一个曲线控制点在曲线另外一边的映射点。这个时候可以使用这个简化版本。

> 这里要注意的是，如果 `S` 指令前面没有其他的 `S` 指令或 `C` 指令，这个时候会认为两个控制点是一样的，退化成二次贝塞尔曲线的样子；如果 `S` 指令是用在另外一个 `S` 指令或者 `C` 指令后面，这个时候后面这个 `S` 指令的第一个控制点会默认设置为前面的这个曲线的第二个控制点的一个映射点。——[《突袭 HTML5 之 SVG 2D 入门2 - 图形绘制》](http://www.cnblogs.com/dxy1982/archive/2012/04/06/2395729.html)

这里重点讲解一下 `S` 指令中每个点对应的位置。同样借用 MDN 上的示例：

```html
<svg width="190" height="160">
  <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent"/>
</svg>
```

![S command](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-bezier-s.gif)

##### 二次贝塞尔曲线：`Q` x1 y1, x y （或者 `q` dx1 dy1, dx dy）

经历了三次贝塞尔曲线的洗礼，二次贝塞尔曲线看起来真是亲切。

```html
<svg width="190" height="160">
  <path d="M10 80 Q 95 10, 180 80" stroke="black" fill="transparent"/>
</svg>
```

![Q command](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/path-d-bezier-q.gif)

注：PS 中的钢笔工具绘制二次贝塞尔曲线只能通过三次贝塞尔曲线进行模拟，或许二次贝塞尔曲线最准确的绘制方法就是通过代码了吧。这里有一个可视化 Canvas 绘制贝塞尔曲线的网站——[Canvas Quadratic Curve Example](http://blogs.sitepointstatic.com/examples/tech/canvas-curves/quadratic-curve.html)，实现方式比 SVG 还复杂[抠鼻]。

##### 简化版二次贝塞尔曲线：`T` x y（或者 `t` dx dy）

与 `S` 指令类似，为了更顺滑的多弧曲线，`T` 指令直接指定曲线终点，控制点自动计算。

同时，如果 `T` 指令只在上一个指令为 `Q` 或者 `T` 指令的情况下有效，否则当作 `L` 指令执行。

终于把贝塞尔讲完了……

## 第二个神奇的动效

偷偷用一个箭头把 SVG 的填色、描边、路径都给讲完了，然而，SVG 能用到的还不止这些。开玩笑，Web 界的猪——浑身都是宝——可不是吹的。

![play button hover animation](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/play_btn_hover-svg.gif)

首先，我们观察一下这个播放键的结构的实现方法（[Codepen](http://codepen.io/lyxuncle/pen/rWmdMG)）（注：为了能直观地看到效果，我将 .play-icon-blend 的填充与描边改为了黑色，[原例子](http://codepen.io/lyxuncle/pen/qqbopp)中为白色）：

```html
<svg class="play-icon-vector" x="0" y="0" width="50" height="50" viewBox="0 0 50 50">
    <defs>
        <circle id="play-circle-template" cx="25" cy="25" r="25"></circle>
    </defs>

    <use class="play-icon-blend" xlink:href="#play-circle-template" fill="#000" stroke="#000" stroke-width="4px"></use>
    <use class="play-icon-circle" xlink:href="#play-circle-template" fill="#fff" stroke="#fff" stroke-width="2px"></use>
    <path class="play-icon-polygon" d="M31.49,24.31a0.73,0.73,0,0,1,0,1.38l-8.27,5.64A0.74,0.74,0,0,1,22,30.64V19.36a0.74,0.74,0,0,1,1.22-.69Z" fill="#fff"></path>
</svg>
```

```css
.play-icon-vector {
  overflow: visible;
}
.play-icon-circle ,
.play-icon-polygon {
  mix-blend-mode: exclusion;
  transition: opacity .3s cubic-bezier(.08,.03,.22,.87);
}
.play-icon-blend {
  transform-origin: center;
  transform: scale(0);
  transition: transform .25s cubic-bezier(.08,.03,.22,.87);
}
.play-icon-vector:hover .play-icon-blend {
  transform: scale(1.1);
}
```

这里顺带用了一下下 [CSS3 的滤镜](https://css-tricks.com/almanac/properties/m/mix-blend-mode/) `mix-blend-mode`（SVG 也有滤镜功能，这里不做介绍，感兴趣的可以移步[《突袭 HTML5 之 SVG 2D 入门10 - 滤镜》](http://www.cnblogs.com/dxy1982/archive/2012/06/13/2530529.html)）。这里用到的值 `exclusion` 的效果，是在叠加区域只显示亮色，下面是使用了同样滤镜的图片与正常图片的对比图，感受一下：

![exclusion](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/exclusion.jpg)

图片来源：[CSS-Tricks-mix-blend-mode](https://css-tricks.com/almanac/properties/m/mix-blend-mode/)

可以看到代码里还出现了一些了不得的标签—— `<defs>`、`<use>`。接下来，我们就来了解一下它们。

首先我们知道，通过中间圆圈的缩放，再加上外围圆圈与中心三角的叠加效果，完成了这个 hover 效果。也就意味着，圆圈在这里用到两次。这个时候就可以使用 SVG 里路径的重用与引用功能。

### SVG 的重用与引用

三种集合标签：`<g>`、`<symbol>`、`<defs>`，都是用于将零散的图形组合成一个整体。区别在于：

- `<g>`：组合标签。添加 `id` 属性来作为引用的钩子，可在 `<g>` 标签上设置这组元素的相关属性（填色、描边等等）。
- `<symbol>`：模板标签。与 `<g>` 标签一样，通过 `id` 进行引用。不同点在于，`symbol` 元素本身不会被渲染；`symbol` 元素拥有属性 `viewBox` 和 `preserveAspectRatio`，这些允许 `symbol` 缩放图形。
- `<defs>`：定义标签。不仅仅是图形对象的合集，还可以是渐变效果、蒙版、滤镜等等，设置好 `id`，在对应的属性（例如渐变就是 `fill`、蒙版就是 `mask`、滤镜就是 `filter`）中引用即可，引用格式为“`url(#id)`”。具体例子参看[《SVG 研究之路 (18) - 再談 defs》](http://www.oxxostudio.tw/articles/201409/svg-18-defs.html)。

更详细的区别见[《突袭 HTML5 之 SVG 2D 入门7 - 重用与引用》](http://www.cnblogs.com/dxy1982/archive/2012/05/17/2503782.html)。

以上三种集合的引用统一使用 `<use>` 标签。`xlink:href` 属性指定引用的 `id`。

> `use` 元素的作用过程就相当于把被引用的对象深拷贝一份到独立的非公开的 DOM 树中；这棵树的父节点是 `use` 元素。虽然是非公开的DOM节点，但是本质上还是 DOM 节点，所以被引用对象的所有属性值、动画、事件、 CSS 的相关设置等都会拷贝多来并都还是会起作用，而且这些节点也会继承 `use` 元素和 `use` 祖先的相关属性（注意引用元素是深拷贝，这些拷贝过来的元素与原来的元素已经无关系了，所以这里不会继承被引用元素祖先节点的属性），如果这些节点本身有相关（CSS）属性，还会覆盖继承来的属性，这些与普通的DOM节点是一致的，所以对use元素使用“`visibility:hidden`”时要小心，并不一定会起作用。但是由于这部分节点是非公开的，在 DOM 操作中，也只能看到 `use` 元素，所以也只能操作到 `use` 元素。

在 SVG Sprite 中，`<use>` 的使用比较猖狂（[《拥抱 Web 设计新趋势：SVG Sprites 实践应用》](https://aotu.io/notes/2016/07/09/SVG-Symbol-component-practice/)，同时也提到了 SVG 的兼容情况），而当 SVG 图形代码与引用部分分离开时，想针对图形中的某一部分进行处理就会显得特别麻烦（只能看到 `use` 结点），这个时候，打开 shadow DOM 的显示，包你一览无余（具体操作方法见[《神奇的 Shadow DOM》](https://aotu.io/notes/2016/06/24/Shadow-DOM/)）。

![svg shadow root](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/shadow-root.png)

打开了 shadow DOM 显示的 `use` 标签

下面就来看一个非图形引用的例子。在前面我们知道了，如果要描边动效，那修改 `stroke-dashoffset` 就可以达到效果。然而这种方法本身就是利用了虚线的 hack，如果我们想要做一个虚线的描线动效呢？比如：

![grid icon hover](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/grid_icon_hover.gif)

这个时候 `stroke-dasharray` 与 `stroke-offset` 的合作是无法完成的，因为他俩动起来本身就是虚线在移动。所以我们需要换个思路，描线动画还是那个描线动画，只是虚线的绘制需要使用另一个 hack —— 蒙版。

### 蒙版
SVG 中的蒙版有两种——剪裁cliping `<clipPath>` 与遮罩mask `<mask>`，都需要在 `<defs>` 中定义，然后通过对应的属性进行引用。
```html
<svg>
  <defs>
    <!-- 剪裁的定义 -->
    <clipPath id="cliping">...</clipPath>
    <!-- 遮罩的定义 -->
    <mask id="mask">...</mask>
  </defs>

  <!-- 剪裁的引用 -->
  <circle clip-path="url(#cliping)"></circle>
  <!-- 遮罩的引用 -->
  <circle clip-path="url(#mask)"></circle>
</svg>
```
注：以上代码为了直观体现两者的使用方法，已剔除其余不相干代码，不可直接运行。

剪裁与遮罩的区别在于，剪裁是按照定义的形状界限分明地进行图像的展示与隐藏：

而遮罩相较于剪裁，多了渐变显示图像的功能，只要在 `<mask>` 中包裹渐变的定义即可。遮罩的展示策略是：

> 越黑越透明，越白越不透明，而遮色片（注：即遮罩）只有黑到白的灰階分布，所以如果作為遮色片的顏色是灰階以外的顏色，都會被轉換為灰階。——引用来源[《SVG 研究之路 (9) - Clipping and Masking》](http://www.oxxostudio.tw/articles/201406/svg-09-clipping-masking.html)

因此遮罩的功能其实是包含剪裁的，当遮罩使用的是纯黑的图像时，功能等同于剪裁。

![cliping and mask](https://misc.aotu.io/lyxuncle/20161125_SVG_Web_Animation/cliping_mask.jpg)

虚线的描线动效结合剪裁或者遮罩即可以完成（[Codepen](http://codepen.io/lyxuncle/pen/PbmdxO)）：

```html
<svg width="300" height="100" viewBox="0 0 300 100">
  <defs>
    <clipPath id="dash" class="dash">
      <rect x="0" y="20" width="10" height="34"></rect>
      <rect x="20" y="20" width="10" height="34"></rect>
      <rect x="40" y="20" width="10" height="34"></rect>
      <rect x="60" y="20" width="10" height="34"></rect>
      <rect x="80" y="20" width="10" height="34"></rect>
    </clipPath>
    <mask id="mask-dash" class="mask_dash">
      <rect x="0" y="20" width="10" height="34"></rect>
      <rect x="20" y="20" width="10" height="34"></rect>
      <rect x="40" y="20" width="10" height="34"></rect>
      <rect x="60" y="20" width="10" height="34"></rect>
      <rect x="80" y="20" width="10" height="34"></rect>
    </mask>
  </defs>
  
  <g clip-path="url(#dash)">
    <line class="line" x1="0" y1="28" x2="100" y2="28"></line>
  </g>
  <g mask="url(#mask-dash)">
    <rect x="0" y="36" width="100" height="8" fill="#eee"></rect>
    <line class="line" x1="0" y1="40" x2="100" y2="40"></line>
  </g>
</svg>
```

```css
.mask_dash rect{
  fill: #fff;
}
.line {
  stroke: #000;
  stroke-width: 8px;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset ease-in .5s;
}
svg:hover .line {
  stroke-dashoffset: 0;
}
```

注意到上方使用了遮罩的集合里多了一个方形图像，是因为遮罩对于图形尺寸的要求更加严苛，`line` 在它的眼里不是东西，不提供任何效果支持，但是一旦加个方形垫背，`line` 就被接受了[翻白眼]。所以涉及到切割的蒙版，请尽量使用 `clipPath`。

### 总结

写到这里，阿婆主气数已尽，SVG 是个深坑，这里也只能借着三个例子扯扯若干特性，等下回心情好了，阿婆主再拎几个出来说说（也是任性，人的 SVG 笔记都是一个属性一篇的）。下面我们来给这篇凌乱的文章做个梳理：

- 今天我们实现了三个动效——
  - [**箭头**描线动效](http://codepen.io/lyxuncle/pen/wozzrV)
  - [**播放按钮**滤镜动效](http://codepen.io/lyxuncle/pen/qqbopp)
  - [**虚线**描线动效](http://codepen.io/lyxuncle/pen/bBejZZ)
- 动效来源于 [WLS-Adobe](http://www.welikesmall.com/work/adobe/)
- 聊到了 SVG 的几个标签
  - `<path>`
  - `<g>`
  - `<symbol>`
  - `<defs>`
  - `<use>`
  - `<clipPath>`
  - `<mask>`
- 以及属性
  - `viewBox`
  - `preserveAspectRatio`
  - `fill`
  - `stroke`
  - `stroke-dasharray`
  - `stroke-dashoffset`
  - `d`
  - `clip-path`
  - `mask`
- 动效实现对应的关键点
  - **箭头**——`stroke-dasharray`、`stroke-dashoffset`
  - **播放按钮**——`<defs>`、`<use>`
  - **虚线**——`<clipPath>`、`<mask>`、`clip-path`、`mask`、`stroke-dasharray`、`stroke-dashoffset`

文中引用到的资料（前方高能预警）：
- [《突袭 HTML5 之 SVG 2D 入门》](http://www.cnblogs.com/dxy1982/tag/svg/)，沙场秋点兵
  - [2.图形绘制](http://www.cnblogs.com/dxy1982/archive/2012/04/06/2395729.html)
  - [4.笔画与填充](http://www.cnblogs.com/dxy1982/archive/2012/04/14/2395734.html)
  - [6.坐标与变换](http://www.cnblogs.com/dxy1982/archive/2012/05/07/2395732.html)
  - [7.重用与引用](http://www.cnblogs.com/dxy1982/archive/2012/05/17/2503782.html)
  - [9.蒙板](http://www.cnblogs.com/dxy1982/archive/2012/06/01/2395742.html)
  - [10.滤镜](http://www.cnblogs.com/dxy1982/archive/2012/06/13/2530529.html)
- 《SVG 研究之路》，[Oxxo Studio](http://www.oxxostudio.tw/)
  - [9.Clipping and Masking](http://www.oxxostudio.tw/articles/201406/svg-09-clipping-masking.html)
  - [16.Stroke-miterlimit](http://www.oxxostudio.tw/articles/201409/svg-16-storke-miterlimit.html)
  - [18.再談 defs](http://www.oxxostudio.tw/articles/201409/svg-18-defs.html)
  - [23.理解 viewport 與 viewbox](http://www.oxxostudio.tw/articles/201409/svg-23-viewpoint-viewBox.html)
- [SVG Tutorial](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial)，[MDN](https://developer.mozilla.org/en-US/)
  - [Positions](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Positions)
  - [Fills and Strokes](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Fills_and_Strokes)
  - [Path](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)
- [贝塞尔曲线](https://zh.wikipedia.org/wiki/%E8%B2%9D%E8%8C%B2%E6%9B%B2%E7%B7%9A)，维基百科
- [mix-blend-mode](https://css-tricks.com/almanac/properties/m/mix-blend-mode/)，[Robin Rendle](https://css-tricks.com/author/robinrendle/)，[CSS-Tricks](https://css-tricks.com/)
- [《拥抱 Web 设计新趋势：SVG Sprites 实践应用》](https://aotu.io/notes/2016/07/09/SVG-Symbol-component-practice/)，高大师，[凹凸实验室](https://aotu.io/)
- [《神奇的 Shadow DOM》](https://aotu.io/notes/2016/06/24/Shadow-DOM/)，暖暖，[凹凸实验室](https://aotu.io/)