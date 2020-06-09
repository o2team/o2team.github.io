title: 应用物理模型剖析惯性滚动原理
subtitle: 惯性滚动最早出现在 iOS 系统中，旨在优化用户滑动页面的体验，现在已被各类终端环境所广泛应用，本文通过应用基础的物理模型来剖析惯性滚动在 web 环境的实现原理，并基于 vue 框架提供基本实现。
cover: https://img30.360buyimg.com/ling/jfs/t1/125583/27/4454/199245/5ede6381E5fedb493/4e3d9eb00ff9cae3.jpg
categories: web 开发
tags:
  - 惯性滚动
  - ui 组件
  - 移动端 h5
author:
  nick: 吖伟
  github_name: JunreyCen
wechat:
    share_cover: https://img11.360buyimg.com/ling/jfs/t1/138130/1/248/65389/5ede65abE88d3e46f/983c167499fa7e26.png
    share_title: 应用物理模型剖析惯性滚动原理
    share_desc: 惯性滚动最早出现在 iOS 系统中，旨在优化用户滑动页面的体验，现在已被各类终端环境所广泛应用，本文通过应用基础的物理模型来剖析惯性滚动在 web 环境的实现原理，并基于 vue 框架提供基本实现。
date:
---

`惯性滚动`（也叫 `滚动回弹`，`momentum-based scrolling`）最早是出现在 iOS 系统中，是指 **当用户在终端上滑动页面然后把手指挪开，页面不会马上停下而是继续保持一定时间的滚动效果，并且滚动的速度和持续时间是与滑动手势的强烈程度成正比**。抽象地理解，就像高速行驶的列车制动后依然会往前行驶一段距离才会最终停下。而且在 iOS 系统中，当页面滚动到顶/底部时，还有可能触发 “回弹” 的效果。这里录制了微信 APP 【账单】页面中的 iOS 原生时间选择器的惯性滚动效果：

![微信原生 date-picker](https://storage.360buyimg.com/ling-gif/1_1591633403251_173.gif)

熟悉 CSS 开发的同学或许会知道，在 Safari 浏览器中有这样一条 CSS 规则：

```css
-webkit-overflow-scrolling: touch;
```

当其样式值为 `touch` 时，浏览器会使用具有回弹效果的滚动, 即“当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果”。除此之外，在丰富多姿的 web 前端生态中，很多经典组件的交互都一定程度地沿用了惯性滚动的效果，譬如下面提到的几个流行 H5 组件库中的例子。

## 流行 UI 库效果

为了方便对比，我们先来看看一个 H5 普通长列表在 iOS 系统下（开启了滚动回弹）的滚动表现：

![iOS 下长列表滚动表现](https://img12.360buyimg.com/img/jfs/t1/120413/24/4522/2003463/5ede6e3aEc70a4e76/44fdfbb236023afe.gif)

- [weui](https://weui.io/#picker) 的 picker 组件

  ![weui picker](https://img12.360buyimg.com/img/jfs/t1/135674/30/1792/1015829/5ede71ebEa52d996d/2b30bf4abedf9565.gif)

  明显可见，weui 选择器的惯性滚动效果非常弱，基本上手从屏幕上移开后滚动就很快停止了，体验较为不好。

- [vant](https://youzan.github.io/vant/mobile.html#/zh-CN/picker) 的 picker 组件

  ![vant picker](https://img12.360buyimg.com/img/jfs/t1/120072/29/4454/1023756/5ede72baEbb4bf501/99816824e9dcce8a.gif)

  相比之下，vant 选择器的惯性滚动效果则明显清晰得多，但是由于触顶/底回弹时依然维持了普通滚动时的系数或持续时间，导致整体来说回弹的效果有点脱节。

## 应用物理学模型

`惯性` 一词来源于物理学中的惯性定律（即 [牛顿第一定律](https://baike.baidu.com/item/%E7%89%9B%E9%A1%BF%E7%AC%AC%E4%B8%80%E8%BF%90%E5%8A%A8%E5%AE%9A%E5%BE%8B?fromtitle=%E6%83%AF%E6%80%A7%E5%AE%9A%E5%BE%8B&fromid=452930)）：一切物体在没有受到力的作用的时候，运动状态不会发生改变，物体所拥有的这种性质就被称为惯性。可想而知，惯性滚动的本质就是物理学中的惯性现象，因此，我们可以恰当利用中学物理上的 `滑块模型` 来描述惯性滚动全过程。

为了方便描述，我们把浏览器惯性滚动效果中的滚动目标（如浏览器中的页面元素）模拟成滑块模型中的 `滑块`。而且分析得出，惯性滚动的全过程可以模拟为（人）使滑块滑动一定距离然后释放的过程，那么，全流程可以拆解为以下两个阶段：

- 第一阶段，**滑动滑块使其从静止开始做加速运动；**

  ![滑块模型第一阶段](https://img12.360buyimg.com/img/s265x53_jfs/t1/133894/20/1859/1134/5ede7d7fE5732b7c6/b2bcae0e4785db9d.png)

  在此阶段，滑块受到的 `F拉` 大于 `F摩` 使其从左到右匀加速前进。

  > 需要注意的是，对于浏览器的惯性滚动来说，我们一般关注的是用户即将释放手指前的一小阶段，而非滚动的全流程（全流程意义不大），这一瞬间阶段可以简单模拟为滑块均衡受力做 [匀加速运动](https://baike.baidu.com/item/%E5%8C%80%E5%8F%98%E9%80%9F%E7%9B%B4%E7%BA%BF%E8%BF%90%E5%8A%A8/8704911?fr=aladdin)。

- 第二阶段，**释放滑块使其在只受摩擦力的作用下继续滑动，直至最终静止；**

  ![滑块模型第二阶段](https://img12.360buyimg.com/img/s264x68_jfs/t1/134807/39/1760/1131/5ede7dd4E0db49e81/47ddf6ca0818290c.png)

  在此阶段，滑块只受到反向的摩擦力，会维持从左到右的运动方向减速前进然后停下。

基于滑块模型，我们需要找到适合的量化指标来建立惯性滚动的计算体系。结合模型和具体实现，我们需要关注 `滚动距离`、`速度曲线` 以及 `滚动时长` 这几个关键指标，下面会一一展开解析。

## 滚动距离

对于滑动模型的第一阶段，滑块做匀加速运动，我们不妨设滑块的滑动距离为 `s1`，滑动的时间为 `t1`，结束时的临界点速度（末速度）为 `v1` ，根据位移公式

![位移公式](https://img12.360buyimg.com/img/s77x30_jfs/t1/123550/23/4382/885/5ede8396E803b9513/ad325baebf856a53.png)

可以得出速度关系

![第一阶段末速度](https://img12.360buyimg.com/img/s57x33_jfs/t1/147227/24/251/773/5ede8475E55d55c32/5aa71d52c2c3097e.png)

对于第二阶段，滑块受摩擦力 `F拉` 做匀减速运动，我们不妨设滑动距离为 `s2`，滑动的时间为 `t2`，滑动加速度为 `a`，另外初速度为 `v1`，末速度为 `0m/s`，结合位移公式和加速度公式

![加速度公式](https://img12.360buyimg.com/img/s68x33_jfs/t1/132476/4/1729/789/5ede873eEe7c6fa9f/d5d4a6ae8eba3383.png)

可以推算出滑动距离 `s2`

![第二阶段滑动距离](https://img12.360buyimg.com/img/s62x35_jfs/t1/137356/39/1742/842/5ede87d5E52dd3950/3f0c5861a8bacbd5.png)

由于匀减速运动的加速度为负（即 `a < 0`），不妨设一个加速度常量 `A`，使其满足 `A = -2a` 的关系，那么滑动距离

![第二阶段滑动距离和常量关系](https://img12.360buyimg.com/img/s50x36_jfs/t1/139756/32/262/752/5ede8895E0df4f6e0/96045c7dfadeb315.png)

然而在浏览器实际应用时，**`v1` 算平方会导致最终计算出的惯性滚动距离太大（即对滚动手势的强度感应过于灵敏），我们不妨把平方运算去掉**：

![两阶段关系](https://img12.360buyimg.com/img/s95x34_jfs/t1/115211/21/9641/1208/5edeef98Eb1bdcb80/e2c881d9f60d2b12.png)

所以，求惯性滚动的距离（即 `s2`）时，我们只需要记录用户滚动的 **距离 `s1`** 和 **滚动时长 `t1`**，并设置一个合适的 **加速度常量 `A`** 即可。

> 经大量测试得出，加速度常量 `A` 的合适值为 `0.003`。

另外，需要注意的是，对于真正的浏览器惯性滚动效果来说，这里讨论的滚动距离和时长是指能够作用于惯性滚动的范围内的距离和时长，而非用户滚动页面元素的全流程，详细的可以看【启停条件】这一节内容。

## 惯性滚动速度曲线

针对惯性滚动阶段，也就是第二阶段中的匀减速运动，根据位移公式可以得到位移差和时间间距 `T` 的关系

![位移差和时间关系](https://img12.360buyimg.com/img/s100x18_jfs/t1/112281/4/9764/1008/5edefbb5E1d957034/523aaeac82fd865f.png)

不难得出，**在同等时间间距条件下，相邻两段位移差会越来越小，换句话说就是惯性滚动的偏移量增加速度会越来越小**。这与 CSS3 `transition-timing-function` 中的 `ease-out` 速度曲线非常吻合，`ease-out` （即 `cubic-bezier(0, 0, .58, 1)`）的贝塞尔曲线为

![ease-out 贝塞尔曲线](https://img12.360buyimg.com/img/s350x349_jfs/t1/132800/5/1832/13323/5edefd30E395dbfe3/f09150b02e194ad6.png)

> 曲线图来自 [在线绘制贝塞尔曲线网站](http://cubic-bezier.com/)。

其中，图表中的纵坐标是指 **动画推进的进程**，横坐标是指 **时间**，原点坐标为 `(0, 0)`，终点坐标为 `(1, 1)`，假设动画持续时间为 2 秒，`(1, 1)` 坐标点则代表动画启动后 2 秒时动画执行完毕（100%）。根据图表可以得出，时间越往后动画进程的推进速度越慢，符合匀减速运动的特性。

我们试试实践应用 `ease-out` 速度曲线：

![ease-out 曲线应用](https://img12.360buyimg.com/img/jfs/t1/146891/28/278/798915/5edefe63E0473ae1f/9e3084cb617d8f36.gif)

很明显，这样的速度曲线过于线性平滑，减速效果不明显。我们参考 iOS 滚动回弹的效果重复测试，调整贝塞尔曲线的参数为 `cubic-bezier(.17, .89, .45, 1)`：

![调整后的贝塞尔曲线](https://img12.360buyimg.com/img/s350x350_jfs/t1/147483/21/257/14064/5edeff10E5b0342b2/c19ab15cacfcff93.png)

调整曲线后的效果理想很多：

![调整后的曲线效果](https://img12.360buyimg.com/img/jfs/t1/143922/18/263/841326/5edeff5cE03e2c27a/5c5c0039d6cfc8d9.gif)

## 回弹

接下来模拟惯性滚动时触碰到容器边界触发回弹的情况。

我们基于滑块模型来模拟这样的场景：滑块左端与一根弹簧连接，弹簧另一端固定在墙体上，在滑块向右滑动的过程中，当滑块到达临界点（弹簧即将发生形变时）而速度还没有降到 `0m/s` 时，滑块会继续滑动并拉动弹簧使其发生形变，同时滑块会受到弹簧的反拉力作减速运动（动能转化为内能）；当滑块速度降为 `0m/s` 时，此时弹簧的形变量最大，由于弹性特质弹簧会恢复原状（内能转化成动能），并拉动滑块反向（左）运动。

类似地，回弹过程也可以分为下面两个阶段：

- 滑块拉动弹簧往右做变减速运动；

  ![回弹第一阶段模型](https://img12.360buyimg.com/img/s293x68_jfs/t1/121984/29/4358/1773/5edf04f7E5bf007c2/31bdc4c96c370e64.png)

此阶段滑块受到摩擦力 `F摩` 和越来越大的弹簧拉力 `F弹` 共同作用，加速度越来越大，导致速度降为 `0m/s` 的时间会非常短。

- 弹簧恢复原状，拉动滑块向左做先变加速后变减速运动；

  ![回弹第二阶段模型](https://img12.360buyimg.com/img/s293x68_jfs/t1/119416/13/8362/1800/5edf066bEc546e213/7a1938aa852db6af.png)

  此阶段滑块受到的摩擦力 `F摩` 和越来越小的弹簧拉力 `F弹` 相互抵消，刚开始 `F弹 > F摩`，滑块做加速度越来越小的变加速运动；随后 `F弹 < F摩`，滑块做加速度越来越大的变减速运动，直至最终静止。这里为了方便实际计算，我们不妨假设一个理想状态：**当滑块静止时弹簧刚好恢复形变**。

## 回弹距离

根据上面的模型分析，回弹的第一阶段做加速度越来越大的变减速直线运动，不妨设此阶段的初速度为 `v0`，末速度为 `v1`，那么可以与滑块位移建立关系：

![回弹第一阶段位移](https://img12.360buyimg.com/img/s91x36_jfs/t1/137853/4/268/1283/5edf08d2E219e7af8/9cd93dca291f8881.png)

其中 `a` 为加速度变量，这里暂不展开讨论。那么，根据物理学的弹性模型，第二阶段的回弹距离为

![回弹第二阶段位移](https://img12.360buyimg.com/img/s104x37_jfs/t1/128668/37/4401/1550/5edf0b47E2569110f/dc217d575e0d85a7.png)

微积分都来了，简直没法计算……

然而，我们可以根据运动模型适当简化 `S回弹` 值的计算。由于 `回弹第二阶段的加速度` 是大于 `非回弹惯性滚动阶段的加速度`（`F弹 + F摩 > F摩`）的，不妨设非回弹惯性滚动阶段的总距离为 `S滑`，那么

![回弹距离关系](https://img12.360buyimg.com/img/s107x20_jfs/t1/148859/23/246/1230/5edf1676E29d5eabd/81053843ad015066.png)

因此，我们可以设置一个较为合理的常量 `B`，使其满足这样的等式：

![回弹距离等式](https://img12.360buyimg.com/img/s112x38_jfs/t1/121780/24/4432/1428/5edf17c3Ef65c9bfb/8bfdf3e58ed635a1.png)

> 经大量实践得出，常量 `B` 的合理值为 10。

## 回弹速度曲线

触发回弹的整个惯性滚动轨迹可以拆分成三个运动阶段：

![触发回弹的运动轨迹](https://img12.360buyimg.com/img/s905x323_jfs/t1/135000/38/1833/6723/5edf21aeE803e8081/01efb58ada451651.png)

然而，如果要把阶段 `a` 和阶段 `b` 准确描绘成 CSS 动画是有很高的复杂度的：

- 阶段 `b` 中的变减速运动难以准确描绘；
- 这两个阶段虽运动方向相同但动画速度曲线不连贯，很容易造成用户体验断层；

为了简化流程，我们把阶段 `a` 和 `b` 合并成一个运动阶段，那么简化后的轨迹就变成：

![简化后的回弹运动轨迹](https://img12.360buyimg.com/img/s657x323_jfs/t1/129414/19/4461/5193/5edf2270Eab9227ae/789bb4e119bbeae5.png)

鉴于在阶段 `a` 末端的反向加速度会越来越大，所以此阶段滑块的速度骤减同比非回弹惯性滚动更快，对应的贝塞尔曲线末端就会更陡。我们选择一条较为合理的曲线 `cubic-bezier(.25, .46, .45, .94)`：

![回弹阶段 a 曲线](https://img12.360buyimg.com/img/s350x349_jfs/t1/141070/7/291/35799/5edf25e1Eedd9ec05/18daa8ad67840883.png)

对于阶段 `b`，滑块先变加速后变减速，与 `ease-in-out` 的曲线有点类似，实践尝试：

![ease-in-out 曲线实践](https://img12.360buyimg.com/img/jfs/t1/127474/10/4433/336458/5edf266aE83ac9cdf/e844e8e99e409836.gif)

仔细观察，我们发现阶段 `a` 和阶段 `b` 的衔接不够流畅，这是由于 `ease-in-out` 曲线的前半段缓入导致的。所以，为了突出效果我们选择只描绘变减速运动的阶段 `b` 末段。贝塞尔曲线调整为 `cubic-bezier(.165, .84, .44, 1)`

![调整后的贝塞尔曲线](https://img12.360buyimg.com/img/s349x350_jfs/t1/122474/9/4452/38669/5edf2755Ea44602ab/9a0ec7f74664fec5.png)

实践效果：

![调整后的贝塞尔曲线实践](https://img12.360buyimg.com/img/jfs/t1/126992/23/4463/331517/5edf278eE02e02083/928538c867d9d519.gif)

> 由于 gif 转格式导致部分掉帧，示例效果看起来会有点卡顿，建议直接体验 [demo](https://codepen.io/JunreyCen/pen/arRYem)

## CSS 动效时长

我们对 iOS 的滚动回弹效果做多次测量，定义出体验良好的动效时长参数。在一次惯性滚动中，可能会出现下面两种情况，对应的动效时间也不一样：

- **没有触发回弹**

  惯性滚动的合理持续时间为 `2500ms`。

- **触发回弹**

  对于阶段 `a`，当 `S回弹` 大于某个关键阈值时定义为 **强回弹**，动效时长为 `400ms`；反之则定义为 **弱回弹**，动效时长为 `800ms`。

  而对于阶段 `b`，反弹的持续时间为 `500ms` 较为合理。

## 启停条件

前文中有提到，如果把用户滚动页面元素的整个过程都纳入计算范围是非常不合理的。不难想象，当用户以非常缓慢的速度使元素滚动比较大的距离，这种情况下元素动量非常小，理应不触发惯性滚动。因此，惯性滚动的触发是有条件的。

- **启动条件**

  惯性滚动的启动需要有足够的动量。我们可以简单地认为，当用户滚动的距离足够大（大于 `15px`）和持续时间足够短（小于 `300ms`）时，即可产生惯性滚动。换成编程语言就是，最后一次 `touchmove` 事件触发的时间和 `touchend` 事件触发的时间间隔小于 `300ms`，且两者产生的距离差大于 `15px` 时认为可启动惯性滚动。

- **暂停时机**

  当惯性滚动未结束（包括处于回弹过程），用户再次触碰滚动元素时，我们应该暂停元素的滚动。在实现原理上，我们需要通过 `getComputedStyle` 和 `getPropertyValue` 方法获取当前的 `transform: matrix()` 矩阵值，抽离出元素的水平 y 轴偏移量后重新调整 `translate` 的位置。

## 示例代码

基于 vuejs 提供了示例代码，也可以直接访问 [codepen demo](https://codepen.io/JunreyCen/pen/arRYem) 体验。

```js
<html>
  <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">
    <style>
      body, ul {
        margin: 0;
        padding: 0;
      }
      ul {
        list-style: none;
      }
      .wrapper {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        margin: 0 auto;
        height: 80%;
        width: 80%;
        max-width: 300px;
        max-height: 500px;
        border: 1px solid #000;
        transform: translateY(-50%);
        overflow: hidden;
      }
      .list {
        background-color: #70f3b7;
      }
      .list-item {
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        border-bottom: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <div id="app"></div>
  
    <template id="tpl">
      <div
        class="wrapper"
        ref="wrapper"
        @touchstart.prevent="onStart"
        @touchmove.prevent="onMove"
        @touchend.prevent="onEnd"
        @touchcancel.prevent="onEnd"
        @mousedown.prevent="onStart"
        @mousemove.prevent="onMove"
        @mouseup.prevent="onEnd"
        @mousecancel.prevent="onEnd"
        @mouseleave.prevent="onEnd"
        @transitionend="onTransitionEnd">
        <ul
          class="list"
          ref="scroller"
          :style="scrollerStyle">
          <li 
            class="list-item"
            v-for="item in list">
            {{item}}
          </li>
        </ul>
      </div>
    </template>

    <script src="https://cdn.jsdelivr.net/npm/vue"></script>
    <script>
      new Vue({
        el: '#app',
        template: '#tpl',
        computed: {
          list() {
            const list = [];
            for (let i = 0; i < 100; i++) {
              list.push(i);
            }
            return list;
          },
          scrollerStyle() {
            return {
              'transform': `translate3d(0, ${this.offsetY}px, 0)`,
              'transition-duration': `${this.duration}ms`,
              'transition-timing-function': this.bezier,
            };
          },
        },
        data() {
          return {
            wrapper: null,
            scroller: null,
            minY: 0,
            maxY: 0,
            wrapperHeight: 0,
            offsetY: 0,
            duration: 0,
            bezier: 'linear',
            startY: 0,
            pointY: 0,
            startTime: 0,                 // 惯性滑动范围内的 startTime
            momentumStartY: 0,            // 惯性滑动范围内的 startY
            momentumTimeThreshold: 300,   // 惯性滑动的启动 时间阈值
            momentumYThreshold: 15,       // 惯性滑动的启动 距离阈值
            isStarted: false,             // start锁
          };
        },
        mounted() {
          this.$nextTick(() => {
            this.wrapper = this.$refs.wrapper;
            this.scroller = this.$refs.scroller;
            const { height: wrapperHeight } = this.wrapper.getBoundingClientRect();
            const { height: scrollHeight } = this.scroller.getBoundingClientRect();
            this.wrapperHeight = wrapperHeight;
            this.minY = wrapperHeight - scrollHeight;
          });
        },
        methods: {
          onStart(e) {
            const point = e.touches ? e.touches[0] : e;
            this.isStarted = true;
            this.duration = 0;
            this.stop();
            this.pointY = point.pageY;
            this.momentumStartY = this.startY = this.offsetY;
            this.startTime = new Date().getTime();
          },
          onMove(e) {
            if (!this.isStarted) return;
            const point = e.touches ? e.touches[0] : e;
            const deltaY = point.pageY - this.pointY;
            // 浮点数坐标会影响渲染速度
            let offsetY = Math.round(this.startY + deltaY);
            // 超出边界时增加阻力
            if (offsetY < this.minY || offsetY > this.maxY) {
              offsetY = Math.round(this.startY + deltaY / 3);
            }
            this.offsetY = offsetY;
            const now = new Date().getTime();
            // 记录在触发惯性滑动条件下的偏移值和时间
            if (now - this.startTime > this.momentumTimeThreshold) {
              this.momentumStartY = this.offsetY;
              this.startTime = now;
            }
          },
          onEnd(e) {
            if (!this.isStarted) return;
            this.isStarted = false;
            if (this.isNeedReset()) return;
            const absDeltaY = Math.abs(this.offsetY - this.momentumStartY);
            const duration = new Date().getTime() - this.startTime;
            // 启动惯性滑动
            if (duration < this.momentumTimeThreshold && absDeltaY > this.momentumYThreshold) {
              const momentum = this.momentum(this.offsetY, this.momentumStartY, duration);
              this.offsetY = Math.round(momentum.destination);
              this.duration = momentum.duration;
              this.bezier = momentum.bezier;
            }
          },
          onTransitionEnd() {
            this.isNeedReset();
          },
          momentum(current, start, duration) {
            const durationMap = {
              'noBounce': 2500,
              'weekBounce': 800,
              'strongBounce': 400,
            };
            const bezierMap = {
              'noBounce': 'cubic-bezier(.17, .89, .45, 1)',
              'weekBounce': 'cubic-bezier(.25, .46, .45, .94)',
              'strongBounce': 'cubic-bezier(.25, .46, .45, .94)',
            };
            let type = 'noBounce';
            // 惯性滑动加速度
            const deceleration = 0.003;
            // 回弹阻力
            const bounceRate = 10;
            // 强弱回弹的分割值
            const bounceThreshold = 300;
            // 回弹的最大限度
            const maxOverflowY = this.wrapperHeight / 6;
            let overflowY;

            const distance = current - start;
            const speed = 2 * Math.abs(distance) / duration;
            let destination = current + speed / deceleration * (distance < 0 ? -1 : 1);
            if (destination < this.minY) {
              overflowY = this.minY - destination;
              type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
              destination = Math.max(this.minY - maxOverflowY, this.minY - overflowY / bounceRate);
            } else if (destination > this.maxY) {
              overflowY = destination - this.maxY;
              type = overflowY > bounceThreshold ? 'strongBounce' : 'weekBounce';
              destination = Math.min(this.maxY + maxOverflowY, this.maxY + overflowY / bounceRate);
            }

            return {
              destination,
              duration: durationMap[type],
              bezier: bezierMap[type],
            };
          },
          // 超出边界时需要重置位置
          isNeedReset() {
            let offsetY;
            if (this.offsetY < this.minY) {
              offsetY = this.minY;
            } else if (this.offsetY > this.maxY) {
              offsetY = this.maxY;
            }
            if (typeof offsetY !== 'undefined') {
              this.offsetY = offsetY;
              this.duration = 500;
              this.bezier = 'cubic-bezier(.165, .84, .44, 1)';
              return true;
            }
            return false;
          },
          stop() {
            // 获取当前 translate 的位置
            const matrix = window.getComputedStyle(this.scroller).getPropertyValue('transform');
            this.offsetY = Math.round(+matrix.split(')')[0].split(', ')[5]);
          },
        },
      });
    </script>
  </body>
</html>
```

## 参考资料

- [weui-picker](https://github.com/Tencent/weui.js/blob/master/src/picker/scroll.js)
- [better-scroll](https://ustbhuangyi.github.io/better-scroll/doc/)