title: 一个例子上手SVG动画
subtitle: 本文通过一个例子来一步一步展示使用SVG制作动效的过程，并且在过程中讲解所用到的svg的标签和特性。完成了整个例子后会对svg绘制图形和制作动画有一个系统的认识。
cover: //o2team.github.io/misc/Simbachen/svg/banner.png
categories: Web开发
tags:
  - SVG
  - CSS
  - animation
author:
  nick: Simba
  github_name: Simbachen
wechat:
    share_cover: //o2team.github.io/misc/Simbachen/svg/share.png
    share_title: 一个例子上手SVG动画
    share_desc: CSS3动画已足够强大，不过还是有一些它做不到的地方，配合SVG，让Web动效有更多的可能性。
    
date: 2017-05-04 19:21:03
---

CSS3动画已足够强大，不过还是有一些它做不到的地方。配合SVG，让Web动效有更多的可能性。这次要做的效果是一个loading动画（如图）：其中旋转通过CSS来完成，但是旋转之后圆弧缩短变成笑脸的嘴巴需要借助SVG来实现。

![img](//o2team.github.io/misc/Simbachen/svg/loading.gif)

### Step1、声明SVG视口

```html
<svg width="100" height=“100”></svg>
```
指定一个宽高都为100像素的区域，width="100"和width="100px"是等价的，当然也可以使用其他的合法单位，例如cm、mm、em等。
阅读器会设置一个默认的坐标系统，见图：左上角为原点，其中水平（x）坐标向右递增，垂直（y）坐标向下递增。


![img](//o2team.github.io/misc/Simbachen/svg/view.png)

> 在没有指定的情况下，所有的的数值默认单位都是像素。




### Step2、绘制购物袋

`购物袋由两个部分组成，先画下面的主体：`

```html
<path d="M 20 40 L 80 40 L 80 90 A 10 10 90 0 1 70 100 L 30 100 A 10 10 90 0 1 20 90" style="fill: #e9e8ee;" />
```
任何形状都可以使用路径<path>元素画出，描述轮廓的数据放在它的d属性中。
a.样式中的fill用来设置填充色。
b.路径数据由命令和坐标构成:

| 指令    |   说明 |
| :-----: | :--------: |
| M 20 40  | 表示移动画笔到(20,40) |  
| L 80 40     | 表示绘制一条线到(80, 40)| 
| A 10 10 90 0 1 70 100 | 绘制一个椭圆弧|

>圆弧命令以字母A开始，后面紧跟着7个参数，这7个参数分别用来表示：
- 椭圆的x半径和y半径
- 椭圆的x轴旋转角度
- 圆弧的角度小于180度，为0；大于或等于180度，则为1
- 以负角度绘制为0，否则为1
- 终点的x、y坐标




![img](//o2team.github.io/misc/Simbachen/svg/cart.png)

`接下来绘制购物袋上面的部分`

```html
<path d="M 35 40 A 15 15 180 1 1 65 40" style="fill: none; stroke: #e9e8ee; stroke-width: 5;” />

```
上面的部分是一个半圆弧，我同样用路径来画出，也可以使用基础形状<circle>来完成。
样式中的`stoke`和`stroke-width`分别用来设置描边色和描边的宽度。

![img](//o2team.github.io/misc/Simbachen/svg/cart2.png)

### Step3、绘制眼睛

```html
<circle cx=“40" cy="60" r="2.5" style="fill: #fff;" />
<circle cx="60" cy="60" r="2.5" style="fill: #fff;" />

```

使用基础形状，画两个个小圆点。四个属性分别是位置坐标、半径和填充颜色。
![img](//o2team.github.io/misc/Simbachen/svg/eye.png)

### Step4、绘制嘴巴

```html
<circle cx="50" cy="70" r="15" style="fill: none; stroke: #fff; stroke-width: 5; stroke-linecap: round;transform: rotate(280deg); transform-origin: 50% 50%; stroke-dashoffset: -23; stroke-dasharray: 42, 95;”>

```

嘴巴是一段圆弧，我绘制了一个圆，然后描边了其中的一段，并且做了一个旋转，来让它的角度处于正确的位置。
>- `stroke-linecap`：用来定义开放路径的终结,可选round|butt|square
- `stroke-dasharray`：用来创建虚线
- `stroke-dashoffset`：设置虚线位置的起始偏移值，在下一步骤里，它会和stroke-dasharray一起用来实现动效。

![img](//o2team.github.io/misc/Simbachen/svg/mouth.png)


### Step5、给嘴巴部分添加动效

```html
@keyframes mouth {
  0% {
    transform: rotate(-80deg);
    stroke-dasharray: 60, 95;
    stroke-dashoffset: 0;
  }
  40% {
    transform: rotate(280deg);
    stroke-dasharray: 60, 95;
    stroke-dashoffset: 0;
  }
  70%, 100% {
    transform: rotate(280deg);
    stroke-dashoffset: -23;
    stroke-dasharray: 42, 95;
  }
}

```
动画分为两个部分：
1. 圆弧旋转
2. 旋转之后缩短变形


>在一个循环里，最后留有30%的时间保持一个停留。

![img](//o2team.github.io/misc/Simbachen/svg/mouth.gif)

### Step6、给眼睛添加动画
两只眼睛都是沿着圆弧运动 ，例如左眼，首先用一个路径来规定它的运动轨迹：
```html
<path id="eyeright"  d="M 40 60 A 15 15 180 0 1 60 60" style="fill: none; stroke-width: 0;" />
```
然后使用animateMotion来设置动画：
```html
<circle class="eye" cx="" cy="" r="2.5" style="fill: #fff;">
  <animateMotion
    dur="0.8s"
    repeatCount="indefinite"
    keyPoints="0;0;1;1"
    keyTimes="0;0.3;0.9;1"
    calcMode="linear">
    <mpath xlink:href="#eyeleft"/>
  </animateMotion>
</circle>
```

>- `dur`：动画的时间
- `repeatCount`：重复次数
- `keyPoints`：运动路径的关键点
- `timePoints`：时间的关键点
- `calcMode`：控制动画的运动速率的变化，discrete | linear | paced | spline四个属性可选
- `mpath`：指定一个外部定义的路径

![img](//o2team.github.io/misc/Simbachen/svg/eye.gif)

### Step7、将不同部位的动画组合到一起
- 眼睛的动画是从嘴巴旋转完成开始，到嘴巴变形完成结束，因此和嘴巴的动画一样，我设置了四个对应的关键时间点。
- 为了让衔接更顺畅，眼睛的动画开始比嘴巴变形开始稍微提前了一点点。

![img](//o2team.github.io/misc/Simbachen/svg/end.gif)


参考：

- [MDN-SVG文档](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/animateMotion)
- 《SVG精髓》- 人民邮电出版社