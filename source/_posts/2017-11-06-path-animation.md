title: H5动画：轨迹移动
subtitle: 介绍几种轨迹动画的实现方式。
date: 2017-11-06 18:27:36
cover: //misc.aotu.io/booxood/path-animation/cover_900.png
categories: Web开发
tags:
  - H5
  - css
  - animation
  - svg
  - canvas
  - AE
author:
  nick: Avin
  github_name: booxood
wechat:
  share_cover: http://misc.aotu.io/booxood/path-animation/cover_200.png
  share_title: H5动效：轨迹动画
  share_desc: 介绍几种轨迹动画的实现方式。

---

<!-- more -->

> [动画][animation_wiki]，是指由许多帧静止的画面，以一定的速度（如每秒16张）连续播放时，肉眼因视觉残象产生错觉，而误以为画面活动的作品。

在 Web 开发中，经常需要实现各种动画效果，例如：移动、变形、透明度变化等，今天我们主要来讨论各种移动的实现。

#### 直线移动

![straight-line](//misc.aotu.io/booxood/path-animation/straight-line.png)

通常可以直接由各个点的位置，以及到点的时间与整个动画持续时间的比值，写出类似下面的代码并可实现动画。

```css
.cray {
  animation: move 2s alternate infinite;
}

@keyframes move {
  0% { transform: translate(0, 0); }
  30% { transform: translate(100px, 0); }
  60% { transform: translate(100px, 100px); }
  100% { transform: translate(200px, 0); }
}
```

#### 曲线移动

![curve](//misc.aotu.io/booxood/path-animation/curve.png)

在 CSS 中可以通过 `transform-origin` 配合 `rotate` 实现曲线移动，不过这种 `曲线` 都是圆的一部分且不太好控制。

这种移动我们可以把它拆分成两个方向的运动叠加，如

![curve-gif](//misc.aotu.io/booxood/path-animation/curve.gif)

更详细的说明可以参考这篇文章 [《curved-path-animations-in-css》][curved-path-animations-in-css]。


#### 路径移动

![path](//misc.aotu.io/booxood/path-animation/path.png)

这也是曲线移动，但是想像上面那样，这个很难拆分成几个方向的运动叠加。这样的移动路径可以尝试以下几个方法：

- **SVG Animation**

这样的路径可以比较好的用 SVG path 来描述，然后使用 SVG Animation 做跟随动画，并可以达到预期的轨迹效果。

主要代码（[在线示例][codepen1]）：

```html
<svg width="420px" height="260px" viewBox="0 0 420 260" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <g stroke="#979797" stroke-width="1" fill="none">
    <path id="motionPath" d="M370.378234,219.713623 C355.497359,218.517659 ..." ></path>
  </g>
  <g id="cray" transform="translate(0, -24)" stroke="#979797">
  	<image id="cray-img" xlink:href="http://7xt5iu.com1.z0.glb.clouddn.com/img/cray.png" x="0" y="0" width="100px"/>
  </g>
  <animateMotion 
    xlink:href="#cray"
    dur="5s"
    begin="0s"
    fill="freeze"
    repeatCount="indefinite"
    rotate="auto-reverse"
  >
    <mpath xlink:href="#motionPath" />
  </animateMotion>
</svg>
```
效果：

![cray-gif](//misc.aotu.io/booxood/path-animation/cray.gif)

- **JavaScript**

使用 JavaScript 可以直接操作元素进行运动，理论上可以实现任何动画，只是实现一些复杂的动画成本比较高，好在有各种已经开发好了的工具库可以供我们使用。例如，使用 Greensock 的 TweenMax 和 MorphSVGPlugin（收费），通过 MorphSVGPlugin 提供的 pathDataToBezier 方法将 SVG path 转成曲线数组，然后给 TweenMax 使用：

```js
var hill = document.getElementById('hill')
var path = MorphSVGPlugin.pathDataToBezier("#motionPath");

TweenMax.to(hill, 5, {
  bezier:{
    values:path, 
    type:"cubic", 
    autoRotate: 180
  },
  ease:Linear.easeNone, 
  repeat: -1
})
```

[在线示例][codepen2]


- **CSS**

实现动画，其实就是在相应的时间点做相应的“变化”。再回头看直线移动的实现方式，其实如果能给出足够多点的位置和该点的时间与持续时间的比值，那其实曲线也可以直接用 CSS 来实现。

很多时候设计师使用 AE 来设计动画，当我们拿到设计稿后，可以给动画增加关键帧，然后借助一些工具把关键帧的信息导出来，这里介绍一个 [keyframes-cli][keyframes-cli]，可以导出这样结构的数据

![ae](//misc.aotu.io/booxood/path-animation/ae.png)

从属性名字可以判断出来 `X_POSITION` 和 `Y_POSITION` 是 `x` 和 `y` 的位置信息，而 `key_values` 里的 `data` 就是我们需要的`点位置`， `该点的时间与持续时间的比值` 可以根据 `start_frame` 得出，
写个脚本把这些数据处理下，可得到类似下面的 CSS 代码

![ae-css](//misc.aotu.io/booxood/path-animation/ae-css.jpeg)

设置的关键帧越多，动画会越流畅，但 CSS 也会增多。

> 注意：不是 AE 关键帧里所有的信息都可以导出来，还跟 AE 里使用的过渡属性有关，这里有[介绍][AfterEffectsGuideline]。



最后，总结一下，移动动画就是用一种合适的方式把时间和位置的变化关系展示出来。除了上面方法，肯定还有很多其他的方法和帮助工具，欢迎留言交流讨论。


  [curved-path-animations-in-css]: http://tobiasahlin.com/blog/curved-path-animations-in-css/
  [animation_wiki]: https://zh.wikipedia.org/wiki/%E5%8A%A8%E7%94%BB
  [codepen1]: https://codepen.io/booxood/pen/MOjyVe
  [codepen2]: https://codepen.io/booxood/pen/BRJNyQ
  [keyframes-cli]: https://www.npmjs.com/package/keyframes-cli
  [AfterEffectsGuideline]: https://github.com/facebookincubator/Keyframes/blob/master/docs/AfterEffectsGuideline.md
  [1]: https://css-tricks.com/guide-svg-animations-smil/