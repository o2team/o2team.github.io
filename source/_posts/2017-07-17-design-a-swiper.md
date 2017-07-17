title: 实现一个 Swiper
subtitle: 前方多图慎入！！！！！
cover: https://cdn.rawgit.com/o2team/misc/gh-pages/leeenx/swiper/cover.png
categories: Web开发
tags:
  - swiper
  - js
author:
  nick: leeenx
  github_name: leeenx
date: 2017-07-17 13:23:19
wechat:
    share_cover: https://cdn.rawgit.com/o2team/misc/gh-pages/leeenx/swiper/share_cover.png
    share_title: 实现一个 Swiper
    share_desc: 老司机手把手教你如何实现一个无限循环的 swiper
---

<!-- more -->

设计一个五图的 Swiper，设计稿如下：
![插图](//misc.aotu.io/leeenx/swiper/swiper.png)

Swiper 的功能如下： 
1. 左右切换
2. 无限轮播
3.  任意图片数 

接下来，详细介绍这三个功能的实现过程：

## 左右切换

这里指触发左右切换的手指交互，目前主要是以下两种： 

| 方案 | 示意图 |
| :--: | :--: |
| **手指拖拽** | ![拖拽](//misc.aotu.io/leeenx/swiper/drag.gif?v=2) | 
| **手势判断** | ![手势](//misc.aotu.io/leeenx/swiper/gesture.gif?v=2) |

**手指拖拽**容易有性能问题并且实现相对麻烦，所以笔者果断采用了手势判断，伪代码如下： 

```javascript
swiper.on("touchstart", startHandle); 
swiper.on("touchmove", moveHandle); 
function startHandle(e) {
	var x0 = e.touch.pageX, y0 = e.touch.pageY; 
}
function moveHandle(e) {
	var x = e.touch.pageX, y = e.touch.pageY, offsetX = x0 - x, offsetY = y0 - y; 
	if(offsetX <= -50) {
		// 向右
		// to do
	} else if(offsetX >= 50) {
		// 向左
		// to do
	} 
}
```


## 无限轮播

无限轮播要面对的是两个问题： 

- 轮播的数据结构；
- 前端渲染

### 数据结构

无限轮播笔者联想到旋转木马。
![轮圈圈](//misc.aotu.io/leeenx/swiper/20170712_4.gif?v=2)

在数据结构中有一个叫**循环链表**的结构，可以完美地模拟旋转木马。
![循环链表](//misc.aotu.io/leeenx/swiper/20170713_1.jpg)

javascript 没有指针，链表需要由数组来模拟。分析循环链表的两个重点特征： 

1. 数据项都由头指针访问
2. 链表头尾有指针串联

笔者用 `pop&unshift/shift&push` APIs 模拟指针的前后移动，解决了链表头尾串联的问题，然后用数组的第一个元素（Arrayy[0]）作为头指针。

![循环链表](//misc.aotu.io/leeenx/swiper/20170716_2.gif)

伪代码如下： 

```
if(left) {
	queue.push(this.queue.shift()); 
	swap("left"); // 渲染
}
else {
	queue.unshift(this.queue.pop()); 
	swap("right"); // 渲染
}
```


### 前端渲染

swiper 换个角度来看，它其实是一个金字塔： 
<img src="//misc.aotu.io/leeenx/swiper/20170713_5.png?v=4" width="60%">

梳理好层级问题再把过渡补间写上，swiper 的渲染就已经OK了。以下是伪代码： 

```
function swap() {
	// queue 循环链表
	// nodelist 图片列表
	for(var i=0; i<5; ++i) {
		nodelist[queue[i]].style.cssText = css[i]; 
	}
}
// 层级与补间
css = [
	"z-index: 3; other css...", // pic1
	"z-index: 2; other css...", // pic2
	"z-index: 1; other css...", // pic3
	"z-index: 1; other css...", // pic4
	"z-index: 2; other css..."  // pic5
]; 
```


## 任意图片数 

图片数可以分成三种情况来讨论：`count == 5; count > 5; count < 5`。其中 `count == 5` 是理想条件，上几节就是围绕它展开的。本节将分析 `count > 5` 与 `count < 5` 的解决思路。

### count > 5

将循环链表（5节）扩容：
![扩容](//misc.aotu.io/leeenx/swiper/20170714_2.gif) 

扩容后的工作过程如下： 

1. 循环链表指针移动；
2. 渲染节点（1, 2, 3, n-1, n）；
3. 回收节点（4, 5, ..., n-2）。

*注：这里的回收节点指隐藏节点（display: none/visibility: hidden）*

渲染金字塔如下： 

<img src="//misc.aotu.io/leeenx/swiper/20170716_3.png" width="60%" alt="渲染金字塔">

为了提高性能笔者在循环链表与节点中间创建了一个快照数组 snapshot，snapshot 映射节点上的属性，循环链表每一次变动都会生成一个新的快照数组 nextSnap，通过 nextSnap 来更新 snapshot 与 节点样式。以下是实现的伪代码：  

```javascript
// 初始化
function init() {
	nodelist = document.querySelectorAll("li"); // nodelist 
	n = nodelist.length; 
	queue = [0, 1, 2, ..., n]; // 循环链表
	snapshot = new Array(n); // 映射 nodelist 的快照
	// 初始化 nodelist 样式
	for(var i=0; i<n; ++i) {
		nodelist[i].style.cssText = defaultCssText; 
	}
}
// 缺省样式 
var defaultCssText = "visibility: hidden"; 
// 层级与补间
css = [
	"z-index: 3; other css...", // pic1
	"z-index: 2; other css...", // pic2
	"z-index: 1; other css...", // pic3
	"z-index: 1; other css...", // pic(n-1)
	"z-index: 2; other css..."  // picn
]; 
// 切换渲染 
function swap() { 
	nextSnap = new Array(n); // swiper切换后的快照
	for(var i in [0, 1, 2, n-1, n]) {
		nextSnap[queue[i]] = css[i]; 
	}
	// 更新 snapshot 与 nodelist
	for(var i=0; i<n; ++i) {
		if(snapshot[i] != nextSnap[i]) { 
			// 快照更新
			snapshort[i] = nextSnap[i]; 
			// 样式更新
			nodelist[i].style.cssText = snapshort[i] || defaultCssText); 
		}
	}
}
```

### count < 5

当`count >= 5`时，渲染节点是一个稳定的金字塔：

<img src="//misc.aotu.io/leeenx/swiper/20170716_3.png" width="60%" alt="渲染金字塔">

当 `count < 5`时，渲染金字塔变得不确定：

| count | 金字塔 |
| :--: | :--: |
| 1 | <img src="//misc.aotu.io/leeenx/swiper/20170716_7.png" width="50%" alt="渲染金字塔">|
| 2 | <img src="//misc.aotu.io/leeenx/swiper/20170716_6.png" width="50%" alt="渲染金字塔">|
| 3 | <img src="//misc.aotu.io/leeenx/swiper/20170716_5.png" width="50%" alt="渲染金字塔">|
| 4 | <img src="//misc.aotu.io/leeenx/swiper/20170716_4.png" width="50%" alt="渲染金字塔">|

由于只有 `count == 1 ~ 4` 四种情况，可以直接用个 `swith` 把状态列表出来：

```
// 层级与补间
css1 = [
	"z-index: 1; other css...", // pic1
]
css2 = [
	"z-index: 2; other css...", // pic1
	"z-index: 1; other css..."  // pic2
] 
css3 = [
	"z-index: 2; other css...", // pic1
	"z-index: 1; other css...", // pic2
	"z-index: 1; other css..."  // pic3
] 
css4 = [
	"z-index: 3; other css...", // pic1
	"z-index: 2; other css...", // pic2
	"z-index: 2; other css...", // pic3
	"z-index: 1; other css..."  // pic4
] 
switch(n) {
	case 4: css = css4, renderList = [1, 4, 2, 3], break;  
	case 3: css = css3, renderList = [1, 3, 2], break; 
	case 2: css = css2, renderList = [1, 2], break;  
	default: css = css1, renderList = [1], break; 
}
function swap() {
	// queue 循环链表
	// nodelist 图片列表
	for(var i in renderList) {
		nodelist[queue[renderList[i]]].style.cssText = css[i]; 
	}
}
```

上面的伪代码显得很冗长，并不是个好实现方式。不过仍能从上面代码获得启发: 渲染列表(renderList) 与循环链表(queue)的对应关系 ------ [shift, pop, shift, pop, shift]。于是伪代码可以简化为： 

```
function swap() {
	// queue 循环链表
	// renderList 渲染列表
	while(queue.length > 0 && renderList.length < 5) {
		renderList.push(renderList.length % 2 ? queue.pop() : queue.shift()); 
	}
	// nodelist 图片列表
	for(var i=0; i<renderList.length; ++i) {
		nodelist[queue[i]].style.cssText = css[i]; 
	}
} 
// 层级与补间
css = [
	"z-index: 3; other css...", // pic1
	"z-index: 2; other css...", // picn
	"z-index: 2; other css...", // pic2
	"z-index: 1; other css...", // pic(n-1)
	"z-index: 1; other css..."  // pic3
]; 
```

## 细节优化

笔者实现的 swiper: [https://leeenx.github.io/mobile-swiper/v1.html](https://leeenx.github.io/mobile-swiper/v1.html)

(count >= 5)运行效果如下：
![v1](//misc.aotu.io/leeenx/swiper/20170716_10.gif?v=2)

仔细观察能看到切换效果上的小瑕疵： 
![v1](//misc.aotu.io/leeenx/swiper/20170716_9.png?v=2)

造成这个瑕疵是因为同值 `z-index` 节点的渲染层级与 DOM 树的出现顺序相关： 后出现的节点层级更高。

解决方案很简单，为 swiper 添加一个 `translateZ` 。如下伪代码： 

```
// 支持 3d 透视
swiper.style["-webkit-transform-style"] = "preserve-3d"; 
// 层级与补间
css = [
	"z-index: 3; transfomr: translateZ(10px)", // pic1
	"z-index: 2; transfomr: translateZ(6px)", // picn
	"z-index: 2; transfomr: translateZ(6px)", // pic2
	"z-index: 1; transfomr: translateZ(2px)", // pic(n-1)
	"z-index: 1; transfomr: translateZ(2px)"  // pic3
];
```
添加 `z-index` 后的swiper: [https://leeenx.github.io/mobile-swiper/v2.html](https://leeenx.github.io/mobile-swiper/v2.html) 
![v2](//misc.aotu.io/leeenx/swiper/20170717_1.gif)

再看看 `count < 5` 的运行效果： 

| count | 效果图 | 地址 |
| :-- | :-- | :-- |
| 1 | <img src="//misc.aotu.io/leeenx/swiper/20170717_2.gif"> | [https://leeenx.github.io/mobile-swiper/v2.html?count=1](https://leeenx.github.io/mobile-swiper/v2.html?count=1) |
| 2 | <img src="//misc.aotu.io/leeenx/swiper/20170717_3.gif"> | [https://leeenx.github.io/mobile-swiper/v2.html?count=2](https://leeenx.github.io/mobile-swiper/v2.html?count=2) |
| 3 | <img src="//misc.aotu.io/leeenx/swiper/20170717_4.gif"> | [https://leeenx.github.io/mobile-swiper/v2.html?count=3](https://leeenx.github.io/mobile-swiper/v2.html?count=3) |
| 4 | <img src="//misc.aotu.io/leeenx/swiper/20170717_5.gif"> | [https://leeenx.github.io/mobile-swiper/v2.html?count=4](https://leeenx.github.io/mobile-swiper/v2.html?count=4) |


当 `count == 2` / `count == 4` 时，swiper 向右切换时怪怪的，总感觉有什么不对！！其实问题出在渲染金字塔上，偶数swiper 在视觉在不是一个对称的图形： 

<img src="//misc.aotu.io/leeenx/swiper/20170716_4.png" width="50%" alt="渲染金字塔"> 

由于笔者使用定势渲染的原因造成金字塔底被固定在左侧，当向右侧切换时会觉得很奇怪。这里其实只要加一个方向修正即可，以下是修正的伪代码：  

```
function swap(orientation) {
	odd = 1; // 奇偶标记 
	total = queue.length; // 渲染列表长度
	last = total - 1; // renderList 最后一个索引
	while(queue.length > 0 && renderList.length < 5) {
		renderList.push(odd ? queue.pop() : queue.shift()); 
		odd = !odd; // 取反
	}
	// nodelist 图片列表
	for(var i=0; i<5; ++i) {
		// 偶数并且向右切换，将最后一个节点右置
		nodelist[queue[i]].style.cssText = (orientation == "right" && !odd && i == last) ? css[i+1] : css[i]; 
	}
} 
```

修复后的效果如下：  

| count | 效果图 | 地址 |
| :-- | :-- | :-- |
| 2 | <img src="//misc.aotu.io/leeenx/swiper/20170717_6.gif?v=2"> | [https://leeenx.github.io/mobile-swiper/index.html?count=2](https://leeenx.github.io/mobile-swiper/index.html?count=2) |
| 4 | <img src="//misc.aotu.io/leeenx/swiper/20170717_7.gif?v=2"> | [https://leeenx.github.io/mobile-swiper/index.html?count=4](https://leeenx.github.io/mobile-swiper/index.html?count=4) |

## 总结

感谢阅读完本文章的读者。本文最终实现的 swiper 笔者托管在 Github 仓库，有兴趣的读者可以看一下：[https://github.com/leeenx/mobile-swiper](https://github.com/leeenx/mobile-swiper)

希望对你们有帮助。