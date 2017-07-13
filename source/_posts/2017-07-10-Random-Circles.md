title: 2D圆形随机分布
subtitle: Canvas 上画圈圈诅咒你。
cover: https://misc.aotu.io/lyxuncle/20170710_random_circles/cover.gif
categories: Web开发
tags:
  - 游戏
  - 2D圆形随机分布
  - Canvas
author:
  nick: EC
  github_name: lyxuncle
wechat:
  share_cover:
  share_title: 2D圆形随机分布
  share_desc: Canvas 上画圈圈诅咒你。
date: 2017-07-10 10:11:34
---

如何画出又快又多的圈圈。

<!-- more -->

## 命题

一个游戏：在一个平面、一定时间内消灭一定的目标。

![游戏截图](https://misc.aotu.io/lyxuncle/20170710_random_circles/game.jpg)

要实现这个游戏，我们首先要确定，这些元素使用什么形状判定有效点击范围。因为按照图示形状又复杂又没必要，选择一个近似的规则几何图形即可。

在这里，我们使用圆形作为目标的形状。

假设世界观是圆形互不重叠。那么会有一下两种可能性：目标大小是否相同；目标是否静止。复杂度依次递增。

本文主要针对目标大小相同、目标静止的情况进行探讨，并会附上目标大小相同且目标静止、目标大小不同且目标静止两种情况的代码。

> 本文的探讨不考虑重力因素。有关目标移动的情况，感兴趣的可以参考[《HTML5 Canvas 基础教程》](https://item.jd.com/10903394.html)。

## 直线思维

随机生成一个点，圈好占地范围，继续随机生成一个点，判断是否与之前生成的圆形重叠，如果是，则抛弃，如果不是，则继续。

![基础流程图](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_circles_diagram_basic.png)

### 算法

#### 生成一个点

```javascript

/**
 * @desc 随机生成一个点
 * @param {w, h} {object} w: 画布宽，h：画布高
 * @return {x, y} {object} 点坐标
 */
function randomPoint ({w, h}) {
  const x = parseInt(Math.random() * w)
  const y = parseInt(Math.random() * h)
  return {x, y}
}

```

随机生成的点要排除两种情况：

- A、距离边界过近。距离边界过近的目标可能出现隐藏部分过多而难以点击甚至无法点击的情况。
![超出边界无效点示意](https://misc.aotu.io/lyxuncle/20170710_random_circles/points_unavailable.png)
- B、与已有点重叠。
![重叠与非重叠示意](https://misc.aotu.io/lyxuncle/20170710_random_circles/circles_cover.png)

情况A，需要通过合理地设置单位值与无效范围来避免。

事实上，在0至画布宽度之间随机生成的点保证了目标至少有一半留在画布中。因此第一种情况可以暂时忽略。

情况B，则涉及到了碰撞检测。

#### 少壮几何残，老大徒伤悲

节操哥在《[“等一下，我碰！”——常见的2D碰撞检测](https://aotu.io/notes/2017/02/16/2d-collision-detection/index.html)》总结了多种碰撞检测的方式。在这里，我们就简单的过一遍圆形碰撞检测的原理。

这个原理一句话就能概括：两个圆形圆心距离是否大于两个圆形的半径之和。

![两个圆的碰撞检测示意](https://misc.aotu.io/lyxuncle/20170710_random_circles/points_distance.png)

翻译成坐标语言就是：

```javascript
/**
 * @desc 碰撞检测
 * @param pointA {object} A目标坐标、半径
 * @param pointB {object} B目标坐标、半径
 * @return {boolean} 是否重叠
 */
function testOverlay (pointA, pointB) {
	const xGap = Math.abs(pointA.x - pointB.x)
	const yGap = Math.abs(pointA.y - pointB.y)
	const distance = Math.sqrt(xGap * xGap + yGap * yGap)
	const rGap = pointA.r + pointB.r
	return distance >= rGap
}

```

将之应用到整个画布上，则需要遍历现有所有的圆形，以检测新生成的点是否是有效点。

我们将所有有效点都放入一个数组中，一到碰撞检测时就遍历一次，一旦遇到检测失败的点，则意味着这是个无效点；而一旦整个数组都检测结束，且所有点都与新生成的这个点距离大于半径之和，则这个点才是有效点。

流程图如下：

![完善流程图](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_circles_diagram_testoverlay.png)

对应遍历检测代码：

```javascript

/**
 * @desc 有效点检测
 * @param pointArr {array} 已有点坐标、半径集合数组
 * @param newPoint {object} 新点坐标、半径
 * @return {boolean} 新点是否有效
 */
function testAvailable (pointArr, newPoint) {
  let arr = Array.from(pointArr)
  let aval = true
  while(arr.length > 0) {
    let lastPoint = arr.pop()
    if (testOverlay(lastPoint, newPoint)) {
      aval = false
      break;
    }
  }
  return aval
}

```

#### 放大招

在刚才的流程中，没有做次数限制，结局就是当画布差不多填满的时候，它会一直运行下去，但却再也找不到能填补的空白了。因此我们需要对它的尝试次数做一个限制，增加一个计数器，每尝试一次加一。

完善了最初的流程图，我们可以得到：

![完善流程图](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_circles_diagram_complete.png)

将碰撞检测的流程加进去，就是这样子的——

![随机算法完整流程图](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_circles_diagram_random_algorithm.png)

按照这个流程图撸代码，思路清晰到飞起哦～

完整代码：
- [固定半径](https://codepen.io/lyxuncle/pen/GEyXWq)
<p data-height="265" data-theme-id="0" data-slug-hash="GEyXWq" data-default-tab="js,result" data-user="lyxuncle" data-embed-version="2" data-pen-title="随机平铺圆形" class="codepen">See the Pen <a href="https://codepen.io/lyxuncle/pen/GEyXWq/">随机平铺圆形</a> by EC (<a href="https://codepen.io/lyxuncle">@lyxuncle</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
- [随机半径](https://codepen.io/lyxuncle/pen/YQYBZQ)
<p data-height="265" data-theme-id="0" data-slug-hash="YQYBZQ" data-default-tab="js,result" data-user="lyxuncle" data-embed-version="2" data-pen-title="随机平铺圆形（随机半径）" class="codepen">See the Pen <a href="https://codepen.io/lyxuncle/pen/YQYBZQ/">随机平铺圆形（随机半径）</a> by EC (<a href="https://codepen.io/lyxuncle">@lyxuncle</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 另一种解法

其实上面的算法，已经够小游戏用了。但我们换个思路，是不是会得到更加优秀的代码君呢？

随机生成一个点，圈好占地范围。然后再这个点的周围，寻找N个有效目标，直到没有地方为止。然后再在这个点周围生成的有效点的周围寻找有效点，直到再也找不到其他有效点为止。

这个时候，再到画布范围随机生成一个点，然后重复上一步。直到画布没有位置了为止。

![广搜算法与随机算法结合流程图](https://misc.aotu.io/lyxuncle/20170710_random_circles/radom_circles_diagram_random_and_bfs_algorithm.png)

这种算法我们暂且将之称为广搜算法（[广度优先搜索](https://zh.wikipedia.org/wiki/%E5%B9%BF%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2)，Breadth First Search，BFS）与随机算法的结合。

### 生成相对随机点

生成相对随机点的思路其实是碰撞检测的逆推，首先在有效范围内生成一个 x（或 y）点，同时在有效范围内随机生成一个半径值，根据这两个值，计算出对应的 y（或 x）点。

#### x （或 y）轴的有效范围

我们以 x 轴坐标为例。

大家看到，上面的方法描述中，对于坐标的要求是在“有效范围”生成。对于这个有效范围，第一反应就是以相对点为中心，在两个目标半径之和间的范围。

但是，在第一种算法中，由于 x 与 y 的取值永远在画布范围内，因此能保证至少4/1个圆形出现在画布中，不影响用户的定位与操作。但在这种算法中，由于是相对取点，如果相对位置已经处于画布边缘，那就有极大的可能出现随机产生的相对点过于超出画布的情况。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_and_bfs_after_judge.png)

我们可以通过两种方法来解决这个问题：
一、在有效范围可以确定的情况下，提前排除这种情况，可以减少无效点生成的次数。这种方法的劣势在于增加了算法复杂度。我们姑且将它称为坐标预判断的算法。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_and_bfs_pre_judge.png)

```javascript

/**
 * @desc 生成相对随机点
 * @param prev {object} 参照点坐标、半径
 * @param size {object} 画布长宽、半径范围
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, size) {
  const { maxR, minR} = size
  const nextR = parseInt(Math.random() * (maxR - minR) + minR)
  const dia = prev.r + nextR
  const xGap = prev.x - dia < 0 ? Math.random() * (prev.x + dia) : prev.x + dia > size.w ? Math.random() * (size.w - prev.x + dia) : Math.random() * (dia * 2)
  const x = prev.x - dia < 0 ? parseInt(xGap) : parseInt(xGap + prev.x - dia)
  // ...
}

```

其中对于 x 的随机生成做了限制。如图所示，如果相对目标超出了边界，则将随机范围划定为边界至 x 加上两目标半径之和这个绝对距离之间。

二、在判断有效点的逻辑中增加坐标是否超出画布（或者更为苛刻）的判断。这种方法也增加了算法复杂度，但比上一个方法少了一些计算量，不过会有更多的无效点生成，消耗计数器的计数，可能会导致更多的空白区域。这个算法我们起名坐标后判断。

```javascript

/**
 * @desc 生成相对随机点
 * @param prev {object} 参照点坐标、半径
 * @param radius {number} 固定半径
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, radius) {
  const dia = radius * 2
  const xGap = Math.random() * (dia * 2)
  const x = parseInt(xGap + prev.x - dia)
  // ...
}

```

#### 依赖已生成 x（或 y）轴坐标推导出 y（或 x）轴坐标

在这个步骤里，需要考虑的是，根据已知坐标与已知半径值，可以得出两个 y （或 x）轴坐标。对于这两个可能坐标，需要再做一次随机处理。

![随机y轴坐标示意图](https://misc.aotu.io/lyxuncle/20170710_random_circles/random_y.png)

以 y 轴坐标的求值为例。

首先，求得三角形三边中的 b 边长度。

接着，随机出一个正负值，然后求得最终的 y 轴坐标。

同样的，坐标预判断方法：

```javascript

/**
 * @desc 生成相对随机点（随机半径）
 * @param prev {object} 参照点坐标、半径
 * @param size {object} 画布长宽、半径范围
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, size) {
  const { maxR, minR} = size
  const nextR = parseInt(Math.random() * (maxR - minR) + minR)
  const dia = prev.r + nextR
  // ...
  const sign = Math.random() - 0.5 > 0 ? 1 : -1
  const yGap = parseInt(Math.sqrt(dia * dia - (prev.x - x) * (prev.x - x)))
  const y = prev.y - yGap < 0 ? prev.y + yGap : prev.y + yGap > size.h ? prev.y - yGap : yGap * sign + prev.y
  return {x, y, r: nextR}
}

```

坐标后判断方法：

```javascript

/**
 * @desc 生成相对随机点
 * @param prev {object} 参照点坐标、半径
 * @param radius {number} 固定半径
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, radius) {
  const dia = radius * 2
  // ...
  const sign = Math.random() - 0.5 > 0 ? 1 : -1
  const yGap = parseInt(Math.sqrt(dia * dia - (prev.x - x) * (prev.x - x)))
  const y = yGap * sign + prev.y
  return {x, y}
}

```

合到一起，就得到一个生成相对随机点的方法。

坐标预判断方法：

```javascript

/**
 * @desc 生成相对随机点（随机半径）
 * @param prev {object} 参照点坐标、半径
 * @param size {object} 画布长宽、半径范围
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, size) {
  const { maxR, minR} = size
  const nextR = parseInt(Math.random() * (maxR - minR) + minR)
  const dia = prev.r + nextR
  const xGap = prev.x - dia < 0 ? Math.random() * (prev.x + dia) : prev.x + dia > size.w ? Math.random() * (size.w - prev.x + dia) : Math.random() * (dia * 2)
  const x = prev.x - dia < 0 ? parseInt(xGap) : parseInt(xGap + prev.x - dia)
  const sign = Math.random() - 0.5 > 0 ? 1 : -1
  const yGap = parseInt(Math.sqrt(dia * dia - (prev.x - x) * (prev.x - x)))
  const y = prev.y - yGap < 0 ? prev.y + yGap : prev.y + yGap > size.h ? prev.y - yGap : yGap * sign + prev.y
  return {x, y, r: nextR}
}

```

坐标后判断方法：

```javascript

/**
 * @desc 生成相对随机点
 * @param prev {object} 参照点坐标、半径
 * @param {minR, maxR} {object} 半径范围
 * @return {object} 新点坐标、半径
 */
function randomRelativePoint (prev, radius) {
  const dia = radius * 2
  const xGap = Math.random() * (dia * 2)
  const x = parseInt(xGap + prev.x - dia)
  const sign = Math.random() - 0.5 > 0 ? 1 : -1
  const yGap = parseInt(Math.sqrt(dia * dia - (prev.x - x) * (prev.x - x)))
  const y = yGap * sign + prev.y
  return {x, y}
}

```

完整代码：
- [固定半径](https://codepen.io/lyxuncle/pen/jwzxXG)
<p data-height="265" data-theme-id="0" data-slug-hash="jwzxXG" data-default-tab="js,result" data-user="lyxuncle" data-embed-version="2" data-pen-title="随机平铺圆形（广搜+随机）" class="codepen">See the Pen <a href="https://codepen.io/lyxuncle/pen/jwzxXG/">随机平铺圆形（广搜+随机）</a> by EC (<a href="https://codepen.io/lyxuncle">@lyxuncle</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
- 随机半径
	- [算法一：坐标预判断](https://codepen.io/lyxuncle/pen/GEYqZJ)
  <p data-height="265" data-theme-id="0" data-slug-hash="GEYqZJ" data-default-tab="js,result" data-user="lyxuncle" data-embed-version="2" data-pen-title="随机平铺圆形（广搜+随机，随机半径。相对随机点算法2）" class="codepen">See the Pen <a href="https://codepen.io/lyxuncle/pen/GEYqZJ/">随机平铺圆形（广搜+随机，随机半径。相对随机点算法2）</a> by EC (<a href="https://codepen.io/lyxuncle">@lyxuncle</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
	- [算法二：坐标后判断](https://codepen.io/lyxuncle/pen/XgqZJP)
  <p data-height="265" data-theme-id="0" data-slug-hash="XgqZJP" data-default-tab="js,result" data-user="lyxuncle" data-embed-version="2" data-pen-title="随机平铺圆形（广搜+随机，随机半径。坐标后判断）" class="codepen">See the Pen <a href="https://codepen.io/lyxuncle/pen/XgqZJP/">随机平铺圆形（广搜+随机，随机半径。坐标后判断）</a> by EC (<a href="https://codepen.io/lyxuncle">@lyxuncle</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## 两种算法的对比

> 由于广搜算法与随机算法结合中随机半径的两种算法效率差距较为明显，因此只取坐标后判断算法与随机算法对比。

在320x550的画布上，两种算法的效率差距不大，覆盖率（也就是密度）的差距在10%以内，相当于多画了4-5个左右圈。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/algoritm_compare.png)

但在2000x2000的画布上，随机算法的效率就远高于两种算法结合的效率。在随机半径的情况下，两种算法结合的方法有时甚至需要1s的时间。而覆盖率的差距依然在10%以内，由于画布的增大，意味着圈的数量差距也随之增加。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/algorithm_compare_2000.png)

## 游戏中的算法

Human Resource Machine 是一个汇编编程的小游戏，通过罗列代码段来完成游戏中的命题。从最简单的 in/out，到简单的数值计算，再到最后的排序算法的实现，而仅有11个编程语句可以使用。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/hr_machine_io.jpg)

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/hr_machine_expertCode.png)

每一关都会对你编写的代码进行数量与效率的评估，你所要做到的就是对数量与效率兼顾到最好。

![](https://misc.aotu.io/lyxuncle/20170710_random_circles/hr_machine_code_judge.jpg)

通过这个游戏，会让你对底层数据的存储与处理有比较深的了解，同时对代码的优化进行追根溯源。

有人说这游戏真是反人类，现在的代码都讲究的是可读性，以这个游戏的评判标准，有时候是要以牺牲可读性为代价的。但在这种极端的情况下比较容易激发大家对于算法的探索与思考，跳出思维定式，以便找到更佳甚至最佳算法。毕竟，人家只是个游戏（虽然过几天你再打开代码也许就看不懂了）。

## 完整范例

[食在会玩](http://jdc.jd.com/demo/if_food_had_voice_chips/chips.html)

> 范例中的代码使用的是第二种算法。从画布面积来看效率上是没啥问题的，但其实当时是从第一种算法改为第二种算法的，因为当时使用的第一种算法并没有这次 demo 整理出来的那样顺利。阿婆主也不明白发生了什么，也许是因为没画流程图吧[抠鼻]。
