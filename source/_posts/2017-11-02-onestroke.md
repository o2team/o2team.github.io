title: H5游戏开发：一笔画
subtitle: 一笔画游戏与自动识别连通图插件的实现
cover: https://misc.aotu.io/leeenx/onestroke/cover.jpg
categories: H5游戏开发
tags:
  - H5
  - game
  - 游戏
  - 一笔画
  - canvas
author:
  nick: leeenx
  github_name: leeenx
date: 2017-11-02 19:30:37
wechat:
    share_cover: https://misc.aotu.io/leeenx/onestroke/share.jpg
    share_title: H5游戏开发：一笔画
    share_desc: 一笔画游戏与自动识别连通图插件的实现
---

<!-- more -->

一笔画是<u>图论</u><sup>[科普](https://zh.wikipedia.org/wiki/%E5%9B%BE%E8%AE%BA)</sup>中一个著名的问题，它起源于<u>柯尼斯堡七桥问题</u><sup>[科普](https://zh.wikipedia.org/wiki/%E6%9F%AF%E5%B0%BC%E6%96%AF%E5%A0%A1%E4%B8%83%E6%A1%A5%E9%97%AE%E9%A2%98)</sup>。数学家欧拉在他1736年发表的论文《柯尼斯堡的七桥》中不仅解决了七桥问题，也提出了一笔画定理，顺带解决了一笔画问题。用图论的术语来说，对于一个给定的<u>连通图</u><sup>[科普](https://zh.wikipedia.org/wiki/%E8%BF%9E%E9%80%9A%E5%9B%BE)</sup>存在一条恰好包含所有线段并且没有重复的路径，这条路径就是「一笔画」。

寻找连通图这条路径的过程就是「一笔画」的游戏过程，如下：

![一笔画](https://misc.aotu.io/leeenx/onestroke/2017-10-31-demo.gif)

## 游戏的实现

「一笔画」的实现不复杂，笔者把实现过程分成两步：

1. 底图绘制
2. 交互绘制

「底图绘制」把连通图以「点线」的形式显示在画布上，是游戏最容易实现的部分；「交互绘制」是用户绘制解题路径的过程，这个过程会主要是处理点与点动态成线的逻辑。

### 底图绘制
「一笔画」是多关卡的游戏模式，笔者决定把关卡（连通图）的定制以一个配置接口的形式对外暴露。对外暴露关卡接口需要有一套描述连通图形状的规范，而在笔者面前有两个选项：

- 点记法
- 线记法

举个连通图 ------ 五角星为例来说一下这两个选项。

![五角星](https://misc.aotu.io/leeenx/onestroke/2017-10-31-five.png?v=2)

点记法如下：
```javascript
levels: [
	// 当前关卡
	{
		name: "五角星",
		coords: [
			{x: Ax, y: Ay},
			{x: Bx, y: By},
			{x: Cx, y: Cy},
			{x: Dx, y: Dy},
			{x: Ex, y: Ey},
			{x: Ax, y: Ay}
		]
	}
	...
]
```
线记法如下：
```javascript
levels: [
	// 当前关卡
	{
		name: "五角星",
		lines: [
			{x1: Ax, y1: Ay, x2: Bx, y2: By},
			{x1: Bx, y1: By, x2: Cx, y2: Cy},
			{x1: Cx, y1: Cy, x2: Dx, y2: Dy},
			{x1: Dx, y1: Dy, x2: Ex, y2: Ey},
			{x1: Ex, y1: Ey, x2: Ax, y2: Ay}
		]
	}
]
```

「点记法」记录关卡通关的一个答案，即端点要按一定的顺序存放到数组 `coords`中，它是有序性的记录。「线记法」通过两点描述连通图的线段，它是无序的记录。「点记法」最大的优势是表现更简洁，但它必须记录一个通关答案，笔者只是关卡的搬运工不是关卡创造者，所以笔者最终选择了「线记法」。：）

### 交互绘制

在画布上绘制路径，从视觉上说是「选择或连接连通图端点」的过程，这个过程需要解决2个问题：

- 手指下是否有端点
- 选中点到待选中点之间能否成线

收集连通图端点的坐标，再监听手指滑过的坐标可以知道「手指下是否有点」。以下伪代码是收集端点坐标：

```javascript
// 端点坐标信息
let coords = [];
lines.forEach(({x1, y1, x2, y2}) => {
	// (x1, y1) 在 coords 数组不存在
	if(!isExist(x1, y1)) coords.push([x1, y1]);
	// (x2, y2) 在 coords 数组不存在
	if(!isExist(x2, y2)) coords.push([x2, y2]);
});
```

以下伪代码是监听手指滑动：
```javascript
easel.addEventListener("touchmove", e => {
	let x0 = e.targetTouches[0].pageX, y0 = e.targetTouches[0].pageY;
	// 端点半径 ------ 取连通图端点半径的2倍，提升移动端体验
	let r = radius * 2;
	for(let [x, y] of coords){
		if(Math.sqrt(Math.pow(x - x0, 2) + Math.pow(y - y0), 2) <= r){
			// 手指下有端点，判断能否连线
			if(canConnect(x, y)) {
				// todo
			}
			break;
		}
	}
})
```
在未绘制任何线段或端点之前，手指滑过的任意端点都会被视作「一笔画」的起始点；在绘制了线段（或有选中点）后，手指滑过的端点能否与选中点串连成线段需要依据现有条件进行判断。

![示意图](https://misc.aotu.io/leeenx/onestroke/2017-10-31-five-2.png)

上图，点A与点B可连接成线段，而点A与点C不能连接。笔者把「可以与指定端点连接成线段的端点称作**有效连接点**」。连通图端点的有效连接点从连通图的线段中提取：
```javascript
coords.forEach(coord => {
	// 有效连接点（坐标）挂载在端点坐标下
	coord.validCoords = [];
	lines.forEach(({x1, y1, x2, y2}) => {
		// 坐标是当前线段的起点
		if(coord.x === x1 && coord.y === y1) {
			coord.validCoords.push([x2, y2]);
		}
		// 坐标是当前线段的终点
		else if(coord.x === x2 && coord.y === y2) {
			coord.validCoords.push([x1, y1]);
		}
	})
})
```
But...有效连接点只能判断两个点是否为底图的线段，这只是一个静态的参考，在实际的「交互绘制」中，会遇到以下情况：

![AB成线](https://misc.aotu.io/leeenx/onestroke/2017-11-01-five.png)
如上图，AB已串连成线段，当前选中点B的有效连接点是 A 与 C。AB 已经连接成线，如果 BA 也串连成线段，那么线段就重复了，所以此时 BA 不能成线，只有 AC 才能成线。

对选中点而言，它的有效连接点有两种：

- 与选中点「成线的有效连接点」
- 与选中点「未成线的有效连接点」

其中「未成线的有效连接点」才能参与「交互绘制」，并且它是动态的。

![未成线的有效连接点](https://misc.aotu.io/leeenx/onestroke/2017-11-01-valid-vertexes.gif)

回头本节内容开头提的两个问题「手指下是否有端点」 与 「选中点到待选中点之间能否成线」，其实可合并为一个问题：**手指下是否存在「未成线的有效连接点」**。只须把监听手指滑动遍历的数组由连通图所有的端点坐标 `coords` 替换为当前选中点的「未成线的有效连接点」即可。

至此「一笔画」的主要功能已经实现。可以抢先体验一下：

![demo](https://misc.aotu.io/leeenx/onestroke/2017-10-31-qr.png?v=2)

[https://leeenx.github.io/OneStroke/src/onestroke.html](https://leeenx.github.io/OneStroke/src/onestroke.html)


## 自动识图

笔者在录入关卡配置时，发现一个7条边以上的连通图很容易录错或录重线段。笔者在思考能否开发一个自动识别图形的插件，毕竟「一笔画」的图形是有规则的几何图形。

![底图](https://misc.aotu.io/leeenx/onestroke/2017-11-02-shape.png)

上面的关卡「底图」，一眼就可以识出三个颜色：

- 白底
- 端点颜色
- 线段颜色

并且这三种颜色在「底图」的面积大小顺序是：白底 > 线段颜色 >  端点颜色。底图的「采集色值表算法」很简单，如下伪代码：

```javascript
let imageData = ctx.getImageData();
let data = imageData.data;
// 色值表
let clrs = new Map();
for(let i = 0, len = data.length; i < len; i += 4) {
	let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
	let key = `rgba(${r}, ${g}, ${b}, ${a})`;
	let value = clrs.get(key) || {r, g, b, a, count: 0};
	clrs.has(key) ? ++value.count : clrs.set(rgba, {r, g, b, a, count});
}
```

对于连通图来说，只要把端点识别出来，连通图的轮廓也就出来了。

### 端点识别
理论上，通过采集的「色值表」可以直接把端点的坐标识别出来。笔者设计的「端点识别算法」分以下2步：

1. 按像素扫描底图直到遇到「端点颜色」的像素，进入第二步
2. 从底图上清除端点并记录它的坐标，返回继续第一步

伪代码如下：
```javascript
for(let i = 0, len = data.length; i < len; i += 4) {
	let [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
	// 当前像素颜色属于端点
	if(isBelongVertex(r, g, b, a)) {
		// 在 data 中清空端点
		vertex = clearVertex(i);
		// 记录端点信息
		vertexes.push(vertext);
	}
}
```

But... 上面的算法只能跑无损图。笔者在使用了一张手机截屏做测试的时候发现，收集到的「色值表」长度为 5000+ ！这直接导致端点和线段的色值无法直接获得。

经过分析，可以发现「色值表」里绝大多数色值都是相近的，也就是在原来的「采集色值表算法」的基础上添加一个近似颜色过滤即可以找出端点和线段的主色。伪代码实现如下：

```javascript
let lineColor = vertexColor = {count: 0};
for(let clr of clrs) {
	// 与底色相近，跳过
	if(isBelongBackground(clr)) continue;
	// 线段是数量第二多的颜色，端点是第三多的颜色
	if(clr.count > lineColor.count) {
		[vertexColor, lineColor] = [lineColor, clr]
	}
}
```

取到端点的主色后，再跑一次「端点识别算法」后居识别出 203 个端点！这是为什么呢？

![局部](https://misc.aotu.io/leeenx/onestroke/2017-11-02-vertex.png?v)

上图是放大5倍后的底图局部，蓝色端点的周围和内部充斥着大量噪点（杂色块）。事实上在「端点识别」过程中，由于噪点的存在，把原本的端点被分解成十几个或数十个小端点了，以下是跑过「端点识别算法」后的底图：

![识别后](https://misc.aotu.io/leeenx/onestroke/2017-11-02-after-scan.png)

通过上图，可以直观地得出一个结论：识别出来的小端点只在目标（大）端点上集中分布，并且大端点范围内的小端点叠加交错。

如果把叠加交错的小端点归并成一个大端点，那么这个大端点将十分接近目标端点。小端点的归并伪代码如下：

```javascript
for(let i = 0, len = vertexes.length; i < len - 1; ++i) {
	let vertexA = vertexes[i];
	if(vertextA === undefined) continue;
	// 注意这里 j = 0 而不是 j = i +1
	for(let j = 0; j < len; ++j) {
		let vertexB = vertexes[j];
		if(vertextB === undefined) continue;
		// 点A与点B有叠加，点B合并到点A并删除点B
		if(isCross(vertexA, vertexB)) {
			vertexA = merge(vertexA, vertexB);
			delete vertexA;
		}
	}
}
```

加了小端点归并算法后，「端点识别」的准确度就上去了。经笔者本地测试已经可以 100% 识别有损的连通图了。

### 线段识别

笔者分两个步骤完成「线段识别」：

1.  给定的两个端点连接成线，并采集连线上N个「样本点」；
2.  遍历样本点像素，如果像素色值不等于线段色值则表示这两个端点之间不存在线段

如何采集「样式点」是个问题，太密集会影响性能；太疏松精准度不能保证。

在笔者面前有两个选择：N 是常量；N 是变量。
假设 `N === 5`。局部提取「样式点」如下：

![局部](https://misc.aotu.io/leeenx/onestroke/2017-11-01-pattern.gif)

上图，会识别出三条线段：AB, BC 和 AC。而事实上，AC不能成线，它只是因为 AB 和 BC 视觉上共一线的结果。当然把 N 值向上提高可以解决这个问题，不过 N 作为常量的话，这个常量的取量需要靠经验来判断，果然放弃。

为了避免 AB 与 BC 同处一直线时 AC 被识别成线段，其实很简单 ------ **两个「样本点」的间隔小于或等于端点直径**。
假设 `N = S / (2 * R)`，S 表示两点的距离，R 表示端点半径。局部提取「样式点」如下：

![局部](https://misc.aotu.io/leeenx/onestroke/2017-11-01-pattern-2.gif)

如上图，成功地绕过了 AC。「线段识别算法」的伪代码实现如下：
```javascript
for(let i = 0, len = vertexes.length; i < len - 1; ++i) {
	let {x: x1, y: y1} = vertexes[i];
	for(let j = i + 1; j < len; ++j) {
		let {x: x2, y: y2} = vertexes[j];
		let S = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
		let N = S / (R * 2);
		let stepX = (x1 - x2) / N, stepY = (y1 - y2) / n;
		while(--N) {
			// 样本点不是线段色
			if(!isBelongLine(x1 + N * stepX, y1 + N * stepY)) break;
		}
		// 样本点都合格 ---- 表示两点成线，保存
		if(0 === N) lines.push({x1, y1, x2, y2})
	}
}
```

## 性能优化

由于「自动识图」需要对图像的的像素点进行扫描，那么性能确实是个需要关注的问题。笔者设计的「自动识图算法」，在识别图像的过程中需要对图像的像素做两次扫描：「采集色值表」 与 「采集端点」。在扫描次数上其实很难降低了，但是对于一张 `750 * 1334` 的底图来说，「自动识图算法」需要遍历两次长度为 `750 * 1334 * 4 = 4,002,000` 的数组，压力还是会有的。笔者是从压缩被扫描数组的尺寸来提升性能的。

**被扫描数组的尺寸怎么压缩？**
笔者直接通过缩小画布的尺寸来达到缩小被扫描数组尺寸的。伪代码如下：

```javascript
// 要压缩的倍数
let resolution = 4;
let [width, height] = [img.width / resolution >> 0, img.height / resolution >> 0];
ctx.drawImage(img, 0, 0, width, height);
let imageData = ctx.getImageData(), data = imageData;
```
把源图片缩小4倍后，得到的图片像素数组只有原来的 `4^2 = 16倍`。这在性能上是很大的提升。

## 使用「自动识图」的建议

尽管笔者在本地测试的时候可以把所有的「底图」识别出来，但是并不能保证其它开发者上传的图片能否被很好的识别出来。笔者建议，可以把「自动识图」做为一个单独的工具使用。

笔者写了一个「自动识图」的单独工具页面：[https://leeenx.github.io/OneStroke/src/plugin.html](https://leeenx.github.io/OneStroke/src/plugin.html)
可以在这个页面生成对应的关卡配置。

## 结语

下面是本文介绍的「一笔画」的线上 [DEMO](https://leeenx.github.io/OneStroke/src/onestroke.html) 的二维码：

![demo](https://misc.aotu.io/leeenx/onestroke/2017-10-31-qr.png?v=2)

游戏的源码托管在：[https://github.com/leeenx/OneStroke](https://github.com/leeenx/OneStroke)
其中游戏实现的主体代码在：[https://github.com/leeenx/OneStroke/blob/master/src/script/onestroke.es6](https://github.com/leeenx/OneStroke/blob/master/src/script/onestroke.es6)
自动识图的代码在：[https://github.com/leeenx/OneStroke/blob/master/src/script/oneStrokePlugin.es6](https://github.com/leeenx/OneStroke/blob/master/src/script/oneStrokePlugin.es6)


感谢耐心阅读完本文章的读者。本文仅代表笔者的个人观点，如有不妥之处请不吝赐教。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。

<style>
	.post-content sup a {
		vertical-align: unset;
	}
</style>
