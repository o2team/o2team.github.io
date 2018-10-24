title: 单屏页面响应式适配玩法
subtitle: 单屏页面响应式适配
cover: https://img13.360buyimg.com/ling/jfs/t1/41/28/11924/322549/5bcc7032Eb10d58a1/4d2d427681ef624c.png
categories: 项目总结
date: 2018-10-22 19:30:00
ckey: 2018-10-22-design
tags:
  - 单屏页面响应式
  - 响应式适配
author:
  nick: Barrior
  github_name: Barrior
wechat:
    share_cover: https://img12.360buyimg.com/ling/jfs/t1/69/12/11779/12990/5bcc7235Ee7fec1dd/c5bfbd397d2d3d8d.jpg
    share_title: 单屏页面响应式适配玩法
    share_desc: 单屏页面响应式适配

---

<!-- more -->

首先瞅一下效果图

<video autoplay preload loop muted width="1000">
  <source src="https://storage.360buyimg.com/barrior-bucket/ling_animation.mp4">
</video>

接着就是思考怎么做，我的想法如下图。

![image](https://img20.360buyimg.com/ling/jfs/t25669/138/2279683884/36312/4ce2fb64/5bc72d72Nbc1df109.png)

把公共的 `页头` 、`页脚`、`导航栏`、`边框` 放到最顶层，比方说设置层级为 `999`，其他每个独立页则放在下面，然后切换页面的时候更新独立页的层级以达到效果图的效果（当然不能超过最顶层）。

### 适配

> 上面的方式已经把效果做出来了，接下来就是响应式适配了。

#### 1、Mac OS + Chrome

先考虑一下我自己的系统及显示器，

`MacBook Pro 1440 x 900` + `外设 hp 1920 x 1080`

也就是说 `Chrome` 的网页可视区高度大概为： `900(或1080) - 180 = 720px`

180 = 60 + 20 + 100
```
60: MAC 桌面程序坞动态尺寸，60 可能是我常用的尺寸吧，那就先这个
20: MAC 桌面最顶部 icon 放置栏高度
100: Chrome 标签页高度 + 地址栏高度 + 书签栏高度
```

#### 2、Windows + Chrome

然后我们再看看 `Windows + Chrome` 的情况，以 `1366 x 768` 为例，

`Chrome` 的网页可视区高度大概为 `768 - 150 = 618px`

150 = 40 + 110
```
40: Windows 桌面底部程序坞尺寸
110: Chrome 标签页高度 + 地址栏高度 + 书签栏高度
```

#### 3、总结上面两点

1. 以上两点的高度计算通过截图获得，可能会有些许误差。
2. 所以不管在哪种系统下，浏览器的宽度与分辨率是保持一致的（程序坞在底部的时候，程序坞在左右两边一般情况对宽度没有影响），高度则根据系统及浏览器的不同各有不同，比方说 `Safari` 没有书签高度。
3. 不同系统加浏览器占用的最高高度约为 180，最小约为 0（全屏的时候）

#### 4、主流系统分辨率尺寸

然后我们看下当前主流系统及分辨率有哪些

PC  &  MAC  &  Chrome
```
常用
1280 x 800
1366 x 1024 (IPad Pro)
1440 x 900
1680 x 1050
1600 x 900
1920 x 1200
2560 x 1440

更高忽略
2880 x 1620
3200 x 1800
5120 x 2880
```

PC  &  Windows  &  Chrome （或 PC & MAC & Chrome & 外设显示器）
```
1280 x 720/1024
1366 x 768
1440 × 900
1600 x 900
1920 x 1080
```

Mobile  &  Android
```
360 x 480
412 x 732
待补充
```

Mobile  &  IOS
```
IPhone 6:         375 x 667
IPhone 6 Plus:    414 x 736
IPhone X:         375 x 812
```

不上不下的 IPad: 
```
768 x 1024
```

#### 5、分析

我们以宽度 `1024` 及以下算作移动端，以上算作 PC 端，所以两种选择
 1. 移动端适配一个移动端页面，PC 端适配一个 PC 端页面。
 1. 设计之初就想好一个页面适配两端，当然这个设计稿需要比较符合适配两端的条件。

#### 6、别人适配是怎么做的？

贴几个录制的视频~

<video autoplay preload loop muted width="1000">
  <source src="https://storage.360buyimg.com/barrior-bucket/qqbrowser.mp4">
</video>

<video autoplay preload loop muted width="1000">
  <source src="https://storage.360buyimg.com/barrior-bucket/dngj.mp4">
</video>

<video autoplay preload loop muted width="1000">
  <source src="https://storage.360buyimg.com/barrior-bucket/uc.mp4">
</video>


所以，单屏页面最好页面内容言简意赅，设计层面倾向于水平垂直都居中的情况，是最适合做好这个页面的，并且在各种尺寸变化的情况下能比较良好地展示UI，且开发成本也比较合理。

#### 7、自身情况及实现

我们是分两个页面做的，先看一下 PC 端设计稿

<img width="600" src="https://img12.360buyimg.com/ling/jfs/t26869/116/1204025888/170822/21c9021a/5bc739bbN85aad796.png">

> 结合动画的展现形式，其实并不是很理想做响应式，但还是要适配。

本来想用 `rem` 做适配的，但是 `rem` 需要些写很多个匹配，即下面的代码
```
@media all and (max-width: 1024px) {
  html, body {
    font-size: 10px;
  }
}

@media all and (max-width: 1366px) {
  html, body {
    font-size: 12px;
  }
}

// 1680 1920 2560 等
```

然后有个问题就是，`@media` 是根据 `width` 的变化来匹配的，完全按照桌面分辨率来显示是没问题的，不过高度随便调节一下（变小），而宽度还是很宽，这时候页面底部的部分文本就会溢出被隐藏掉。

我们不需要考虑更低端的浏览器，所以可以使用比较前沿的特性，如 `pointer-events` 等特性。

所以使用 `vh` 做适配方案，`vh` 是什么单位详情可以看下[这篇文章](https://aotu.io/notes/2017/04/28/2017-4-28-CSS-viewport-units/index.html)，这里做个简单介绍。

```
vw: 相对于浏览器可视区的宽度     1vw = 浏览器可视区宽度的 1%
vh: 相对于浏览器可视区的高度     1vh = 浏览器可视区高度的 1%
```
也就是说 `100vh` 实际上等于浏览器可视区的高度，所以 `px` 与 `vh` 的换算我们举个例子说明一下（一个很简单的数学换算）。假设浏览器可视区高度为 `720px`，某个元素的宽度为 `300px`，那应该写成多少 `vh` 才与 `300px` 相等呢，如下。
```
300 ÷ (720 ÷ 100) ≈ 41.666
```

比如设计稿为 `1920x1080`（单屏设计高度应该更小一点，如适配第一节所说），可以写个 `CSS` 预处理函数，这样方便直接使用设计稿的尺寸，以 `Sass` 为例如下。

```
@function vh( $value ) {
    @return ( $value / 1080 / 100 ) + vh;
}

或者

@function vw( $value ) {
    @return ( $value / 1920 / 100 ) + vw;
}
```

然后，`300px` 可以无缝写成 `vh(300)` 或 `vw(300)`。

so... 对于我们的页面选择 `vh` 一举两得，不用写很多 `rem` 匹配，也不会出现溢出的问题。

因为高度变矮，内容的尺寸会随之变小，而页面是 `1190` 宽，水平居中布局，所以当只改变浏览器宽度的情况下，不会出现宽度变化溢出问题（除非分辨率超大，然后高度居很高，只把宽度缩很小的情况，这个下面会说到）。写完后在上面列举的主流分辨率下一一测试通过。

看看效果（当然这个是最终效果，只改变宽度的拉伸适配在最后会说）：

<video autoplay preload loop muted width="1000">
  <source src="https://storage.360buyimg.com/barrior-bucket/ling.mp4">
</video>

#### 8、特殊场景

这里就是刚刚说到的 `分辨率超大，然后高度居很高，只把宽度缩很小的情况`，因为设计稿是长宽比例为横向矩形，所以明显与用长宽比为竖向的矩形来看页面是背道而驰的。

![view](https://img13.360buyimg.com/ling/jfs/t1/8536/38/1609/18493/5bcf1e4cEc61106f8/50f6e7c5b8b9d139.jpg)

委屈委屈，但还是要兼容下，至少看起来要显示正常。

##### 8.1、尝试 `rem + vh` 方案

一开始想的是 `rem + vh` 结合使用，根元素 `html` 使用 `vh`，其他单位则使用 `rem`，然后找到有问题的宽高比，通过 `@media` 方式设置 `html` 为 `vw` 来达到适配。

事实是，`rem` 缩小到一定值就不会再缩小了，这个跟浏览器对字体大小限制为最小 `12px` 一样，看个例子。

![rem min](https://img10.360buyimg.com/ling/jfs/t1/7261/10/957/110108/5bcc5169Eb6dbe8be/d220d56b6fe45501.jpg)

根字体小于 `12px` 以后，`rem` 对应的值则都是设置的倍数乘以 `12`；设置根字体为 `vh, vw` 单位同理，`rem` 会在 `vh, vw` 换算达到 `12` 以后就不再改变。

> PPPS: 是不是有点坑，应该字体的属性最小值为 12，而其他属性的值没有控制才对

所以，如果使用 `rem + vh` 方案，在界面缩小到一定尺寸后继续缩小，有些值达到最小值固定不变，而有些值仍在变小，UI 的展示就变得混乱。

##### 8.2、落地方案，`vh + vw + JavaScript 计算`

而直接在元素的属性值上设置为 `vh 或 vw`，所有的值都会实时变动，没有最小值（除了属性为字体有最小值），这样就最大程度减少 UI 变乱的情况了，除非缩到很小很小，那就...（此处省略 1000 个字）。

于是乎，现在的想法是

1. 在原来以 `vh` 为基础的情况下，拷贝所有带 `vh` 单位的代码，把 `vh` 换成 `vw`，当然这些改动都在一个比如叫 `.vw-mode` 的类下面，基本上可以无缝迁移，只需替换 `vh` 函数名即可。
2. 把 `.vw-mode` 下的内容设置为上下居中。 
3. 通过 `JS` 计算，当可视区比例为竖向比例时，则在顶层元素加上 `.vw-mode` 类名，当比例为横向比例时，则去掉 `.vw-mode` 类名。

大致的代码如下

CSS
```
.homepage.vw-mode {
  font-size: vw(14);
  .com-width {
    width: vw(1190);
  }
  .hp-header {
    padding-top: vw(30);
    // ...更多代码
  }
  // ...更多代码
}
```

JS
```
this.resizeHandler = () => {
  const clientWidth = document.documentElement.clientWidth
  const clientHeight = document.documentElement.clientHeight

  // 当长宽比为竖向比例时
  const isVerticalRatio = clientWidth / clientHeight < 1370 / 890
  $homepageElem.classList[isVerticalRatio ? 'add' : 'remove']('vw-mode')
}
this.resizeHandler()
window.addEventListener('resize', this.resizeHandler)
```

最后的结果就是上面那个 `GIF` 效果图了。

#### 9、移动端

移动端用户是没法操作浏览器的，所以基本上都是标准的长宽比，用 `vh` 最合适不过了，或 `vw`。

#### 10、最后

体验（官网）：[https://ling.jd.com](https://ling.jd.com/)

体验浏览器：Chrome、Safari 新版，其他浏览器暂不支持
