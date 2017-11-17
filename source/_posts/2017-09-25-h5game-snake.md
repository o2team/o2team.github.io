title: H5游戏开发：贪吃蛇
subtitle: 介绍经典游戏贪吃蛇的开发思路和性能上的优化
cover: https://misc.aotu.io/leeenx/snake/cover.jpg
categories: H5游戏开发
tags:
  - h5
  - game
  - 贪吃蛇
  - 游戏
  - canvas
author:
  nick: leeenx
  github_name: leeenx
date: 2017-09-25 10:19:06
wechat:
    share_cover: https://misc.aotu.io/leeenx/snake/share.jpg
    share_title: H5游戏开发：贪吃蛇
    share_desc: 介绍经典游戏贪吃蛇的开发思路和性能上的优化
---

<!-- more -->

贪吃蛇的经典玩法有两种：
1. 积分闯关
2. 一吃到底

第一种是笔者小时候在掌上游戏机最先体验到的（不小心暴露了年龄），具体玩法是蛇吃完一定数量的食物后就通关，通关后速度会加快；第二种是诺基亚在1997年在其自家手机上安装的游戏，它的玩法是吃到没食物为止。笔者要实现的就是第二种玩法。

## MVC设计模式

基于贪吃蛇的经典，笔者在实现它时也使用一种经典的设计模型：MVC（即：Model - View - Control）。游戏的各种状态与数据结构由 Model 来管理；View 用于显示 Model 的变化；用户与游戏的交互由 Control 完成（Control 提供各种游戏API接口）。

Model 是游戏的核心也是本文的主要内容；View 会涉及到部分性能问题；Control 负责业务逻辑。 这样设计的好处是： Model完全独立，View 是 Model 的状态机，Model 与 View 都由 Control 来驱动。

## Model
看一张贪吃蛇的经典图片。

![诺基亚](//misc.aotu.io/leeenx/snake/20170922_nokia.png)

贪吃蛇有四个关键的参与对象：
1. 蛇（snake）
2. 食物（food）
3. 墙（bounds）
4. 舞台（zone）

舞台是一个 `m * n`  的矩阵（二维数组），矩阵的索引边界是舞台的墙，矩阵上的成员用于标记食物和蛇的位置。

空舞台如下：
```javascript
[
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
]
```

食物（F）和蛇（S）出现在舞台上：
```javascript
[
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,F,0,0,0,0,0,0,0],
	[0,0,0,S,S,S,S,0,0,0],
	[0,0,0,0,0,0,S,0,0,0],
	[0,0,0,0,S,S,S,0,0,0],
	[0,0,0,0,S,0,0,0,0,0],
	[0,0,0,0,S,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
	[0,0,0,0,0,0,0,0,0,0],
]
```
由于操作二维数组不如一维数组方便，所以笔者使用的是一维数组， 如下：
```javascript
[
	0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,
	0,0,F,0,0,0,0,0,0,0,
	0,0,0,S,S,S,S,0,0,0,
	0,0,0,0,0,0,S,0,0,0,
	0,0,0,0,S,S,S,0,0,0,
	0,0,0,0,S,0,0,0,0,0,
	0,0,0,0,S,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,
	0,0,0,0,0,0,0,0,0,0,
]
```
舞台矩阵上蛇与食物只是舞台对二者的映射，它们彼此都有独立的数据结构：

- 蛇是一串坐标索引链表；
- 食物是一个指向舞台坐标的索引值。

### 蛇的活动

蛇的活动有三种，如下：
- 移动（move）
- 吃食（eat）
- 碰撞（collision）

#### 移动

蛇在移动时，内部发生了什么变化？

![蠕动](//misc.aotu.io/leeenx/snake/20170922_snake.gif)

蛇链表在一次移动过程中做了两件事：**向表头插入一个新节点，同时剔除表尾一个旧节点**。用一个数组来代表蛇链表，那么蛇的移动就是以下的伪代码：
```javascript
function move(next) {
	snake.pop() & snake.unshift(next);
}
```
**数组作为蛇链表合适吗？**
这是笔者最开始思考的问题，毕竟数组的 `unshift & pop` 可以无缝表示蛇的移动。不过，方便不代表性能好，`unshift` 向数组插入元素的时间复杂度是 O(n)， `pop` 剔除数组尾元素的时间复杂度是 O(1)。

蛇的移动是一个高频率的动作，如果一次动作的算法复杂度为 O(n) 并且蛇的长度比较大，那么游戏的性能会有问题。笔者想实现的贪吃蛇理论上讲是一条长蛇，所以笔者在本文章的回复是 ------ **数组不适合作为蛇链表**。

**蛇链表必须是真正的链表结构。**
链表删除或插入一个节点的时间复杂度为O(1)，用链表作为蛇链表的数据结构能提高游戏的性能。javascript 没有现成的链表结构，笔者写了一个叫 [Chain](https://github.com/leeenx/es6-utils#chain) 的链表类，`Chain` 提供了 `unshfit & pop`。以下伪代码是创建一条蛇链表：

```javascript
let snake = new Chain();
```

_由于篇幅问题这里就不介绍 `Chain` 是如何实现的，有兴趣的同学可以移步到: [https://github.com/leeenx/es6-utils#chain](https://github.com/leeenx/es6-utils#chain)_

#### 吃食 & 碰撞

「吃食」与「碰撞」区别在于吃食撞上了「食物」，碰撞撞上了「墙」。笔者认为「吃食」与「碰撞」属于蛇一次「移动」的三个可能结果的两个分支。蛇移动的三个可能结果是：「前进」、「吃食」和「碰撞」。

回头看一下蛇移动的伪代码：
```javascript
function move(next) {
	snake.pop() & snake.unshift(next);
}
```
代码中的 `next` 表示蛇头即将进入的格子的索引值，只有当这个格子是`0`时蛇才能「前进」，当这个格子是 `S` 表示「碰撞」自己，当这个格子是 `F`表示吃食。

**好像少了撞墙？**
笔者在设计过程中，并没有把墙设计在舞台的矩阵中，而是通过索引出界的方式来表示撞墙。简单地说就是 `next === -1` 时表示出界和撞墙。

以下伪代码表示蛇的整上活动过程：
```javascript
// B 表示撞墙
let cell = -1 === next ? B : zone[next];
switch(cell) {
	// 吃食
	case F: eat(); break;
	// 撞到自己
	case S: collision(S); break;
	// 撞墙
	case B: collision(B): break;
	// 前进
	default: move;
}
```

### 随机投食
随机投食是指随机挑选舞台的一个索引值用于映射食物的位置。这似乎很简单，可以直接这样写：
```javascript
// 伪代码
food = Math.random(zone.length) >> 0;
```
如果考虑到投食的前提 ------ 不与蛇身重叠，你会发现上面的随机代码并不能保证投食位置不与蛇身重叠。由于这个算法的安全性带有赌博性质，且把它称作「赌博算法」。为了保证投食的安全性，笔者把算法扩展了一下：
```javascript
// 伪代码
function feed() {
	let index = Math.random(zone.length) >> 0;
	// 当前位置是否被占用
	return zone[index] === S ? feed() : index;
}
food = feed();
```
上面的代码虽然在理论上可以保证投食的绝对安全，不过笔者把这个算法称作「不要命的赌徒算法」，因为上面的算法有致命的BUG ------ 超长递归 or 死循环。

为了解决上面的致命问题，笔者设计了下面的算法来做随机投食：
```javascript
// 伪代码
function feed() {
	// 未被占用的空格数
	let len = zone.length - snake.length;
	// 无法投食
	if(len === 0) return ;
	// zone的索引
	let index = 0,
	// 空格计数器
	count = 0,
	// 第 rnd 个空格子是最终要投食的位置
	rnd = Math.random() * count >> 0 + 1;
	// 累计空格数
	while(count !== rnd) {
		// 当前格子为空，count总数增一
		zone[index++] === 0 && ++count;
	}
	return index - 1;
}
food = feed();
```
这个算法的平均复杂度为 O(n/2)。由于投食是一个低频操作，所以 O(n/2)的复杂度并不会带来任何性能问题。不过，笔者觉得这个算法的复杂度还是有点高了。回头看一下最开始的「赌博算法」，虽然「赌博算法」很不靠谱，但是它有一个优势 ------ 时间复杂度为 O(1)。

「赌博算法」的靠谱概率 = (zone.length - snake.length) / zone.length。`snake.length` 是一个动态值，它的变化范围是：`0 ~ zone.length`。推导出「赌博算法」的平均靠谱概率是：
>**「赌博算法」平均靠谱概率 = 50%**

看来「赌博算法」还是可以利用一下的。于是笔者重新设计了一个算法：
```javascript
// 伪代码
function bet() {
	let rnd = Math.random() * zone.length >> 0;
	return zone[rnd] === 0 ? rnd : -1;
}
function feed() {
	...
}
food = bet();
if(food === -1) food = feed();
```
新算法的平均复杂度可以有效地降低到 O(n/4)，人生有时候需要点运气 : )。


## View

在 View 可以根据喜好选择一款游戏渲染引擎，笔者在 View 层选择了 `PIXI` 作为游戏游戏渲染引擎。

View 的任务主要有两个：
1. 绘制游戏的界面；
2. 渲染 Model 里的各种数据结构

也就是说 View 是使用渲染引擎还原设计稿的过程。本文的目的是介绍「贪吃蛇」的实现思路，如何使用一个渲染引擎不是本文讨论的范畴，笔者想介绍的是：「如何提高渲染的效率」。

在 View 中显示 Model 的蛇可以简单地如以下伪代码：
```javascript
// 清空 View 上的蛇
view.snake.clean();
model.snake.forEach(
	(node) => {
		// 创建 View 上的蛇节点
		let viewNode = createViewNode(node);
		// 并合一条新蛇
		view.snake.push(viewNode);
	}
);
```
上面代码的时间复杂度是 O(n)。上面介绍过蛇的移动是一个高频的活动，我们要尽量避免高频率地运行 O(n) 的代码。来分析蛇的三种活动：「移动」，「吃食」，「碰撞」。
首先，Model 发生了「碰撞」，View 应该是直接暂停渲染 Model 里的状态，游戏处在死亡状态，接下来的事由 Control 处理。
Model 中的蛇（链表）在一次「移动」过程中做了两件事：**向表头插入一个新节点，同时剔除表尾一个旧节点**；蛇（链表）在一次「吃食」过程中只做一件事：**向表头插入一个新节点**。


![compare](//misc.aotu.io/leeenx/snake/20170923_before_after.png)

如果在 View 中对 Model 的蛇链表做差异化检查，View 只增量更新差异部分的话，算法的时间复杂度即可降低至 O(1) ~ O(2) 。以下是优化后的伪代码：

```javascript
let snakeA = model.snake, snakeB = view.snake;
// 增量更新尾部
while(snakeB.length <= snakeA.length) {
	headA = snakeA.next();
	// 头节点匹配
	if(headA.data === headB.data) break;
	// 不匹配
	else {
		// 向snakeB插入头节点
		if(snakeA.HEAD === headA.index) {
			snakeB.unshift(headA.data);
		}
		// 向snakeB插入第二个节点
		else snakeB.insertAfter(0, headA.data);
	}
}
// 增量更新头部
let tailA = snakeA.last(), tailB;
while(snakeB.length !== 0) {
	tailB = snakeB.last();
	// 尾节点匹配
	if(tailA.data === tailB.data) break;
	// 不匹配
	else snakeB.pop();
}
```


## Control

Control 主要做 3 件事：
1. 游戏与用户的互动
2. 驱动 Model
3. 同步 View 与 Model

「游戏与用户的互动」是指向外提供游戏过程需要使用到的 APIs 与 各类事件。笔者规划的 APIs 如下：

| name | type | deltail |
| :-- | :-- | :-- |
| init | method | 初始化游戏 |
| start | method | 开始游戏 |
| restart | method | 重新开始游戏 |
| pause | method | 暂停 |
| resume | method | 恢复 |
| turn | method | 控制蛇的转向。如：turn("left") |
| destroy | method | 销毁游戏 |
| speed | property | 蛇的移动速度 |

事件如下：

| name | detail |
| :-- | :-- |
| countdown |  倒时计 |
| eat | 吃到食物 |
| before-eat | 吃到食物前触发 |
| gameover | 游戏结束 |

事件统一挂载在游戏实例下的 `event` 对象下。
```javascript
snake.event.on("countdown", (time) => console.log("剩余时间：", time));
```

「驱动 Model 」只做一件事 ------ **将 Model 的蛇的方向更新为用户指定的方向**。
「同步 View 与 Model 」也比较简单，检查 Model 是否有更新，如果有更新通知 View 更新游戏界面。

## 结语

下面是本文介绍的贪吃蛇的线上 [DEMO](https://leeenx.github.io/snake/src/snake.html) 的二维码：

![demo](//misc.aotu.io/leeenx/snake/20170923_qr.png)

游戏的源码托管在：https://github.com/leeenx/snake

感谢耐心阅读完本文章的读者。本文仅代表笔者的个人观点，如有不妥之处请不吝赐教。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。
