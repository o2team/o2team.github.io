title: js创建一条通用链表
subtitle: js 开发中你会用到链表来提高性能吗？
cover: https://misc.aotu.io/leeenx/chain/cover.png
categories: Web开发
tags:
  - javascript
  - chain
  - Linked list
author:
  nick: leeenx
  github_name: leeenx
date: 2017-10-13 22:30:48
wechat:
    share_cover: https://misc.aotu.io/leeenx/chain/share.jpg
    share_title: 你会用到链表来提高性能吗？
    share_desc: 老司机带你用 javascript 制作双向链表
---

<!-- more -->
**什么是「链表<sup>[科普](https://baike.baidu.com/item/%E9%93%BE%E8%A1%A8/9794473?fr=aladdin)</sup>」？**
> 链表是一种物理存储单元上非连续、非顺序的存储结构，数据元素的逻辑顺序是通过链表中的指针链接次序实现的。

**什么是「顺序存储结构<sup>[科普](https://baike.baidu.com/item/%E9%A1%BA%E5%BA%8F%E5%AD%98%E5%82%A8%E7%BB%93%E6%9E%84/1347176?fr=aladdin)</sup>」？**

> 在计算机中用一组地址连续的存储单元依次存储线性表的各个数据元素,称作线性表的顺序存储结构。

多数高级语言的「数组」使用「顺序存储结构」，不过早期的 javascript 引擎用了「链式存储结构」。Chrome 的 V8 的数组使用了「顺序存储结构」与「链式存储结构」混合模式；大多数情况下，V8 下的数组是「顺序存储结构」，所以我们就假装 V8 的数组使用的是「顺序存储结构」吧！（-_-! 心虚）

**javascript 开发需要「链表」吗？<sup>自问自答</sup>**  
大多数情况下 javascript 开发关心的是「数据的逻辑结构」而非「数据的存储结构」，似乎「链表」跟 javascript 开发没什么关系。But...「链表」在一些情况下能有效提升代码的性能，特别是在H5游戏的过程中。

假设有一个业务需要高频率地向一张「线性表<sup>[科普](https://baike.baidu.com/item/%E7%BA%BF%E6%80%A7%E8%A1%A8/3228081?fr=aladdin)</sup>」插入或删除节点。通常笔者会用数组表示「线性表」，因为 javascript 的数组有一系列成熟好用的 APIs （如：unshift / push / shift / pop / splice 等）可以完成插入与删除节点的操作。但是数组（顺序存储结构）的 `unshift` & `shift` & `splice` 的算法时间复杂度是 O(n) ，这情况可能「链表」是更好的选择。


##  图解链表

先看一下最简单的单向链表：

![单链表结构图](https://misc.aotu.io/leeenx/chain/20171014-single-link.png)

往链表里插入一个节点：
![插入节点](https://misc.aotu.io/leeenx/chain/20171014-single-link-insert.gif)

剔除链表里的节点：
![剔除节点](https://misc.aotu.io/leeenx/chain/20171014-remove-node.gif)

往链表里插入一条链表：
![插入链表](https://misc.aotu.io/leeenx/chain/20171014-insert-chain.gif)

剪除链表的一段切片：
![剪除切片](https://misc.aotu.io/leeenx/chain/20171014-remove-chain.gif)

通过上面的图示，可以很清晰地了解到单链表的优势：**插入节点或链表片段的算法时间复杂度为O(2)；删除节点或链表片段的算法时间复杂度为O(1)**

## 实现双向链表

「单向链表」效率虽然高，不过局限性比较大。所以笔者想实现的是「双向链表」。**双向链表插入节点或链表的算法时间复杂度为 O(4)，删除节点或链表片段的算法时间复杂度为O(2)**。
双向链表的结构如下：
* 节点指针 ------「前驱」与「后继」
* 链表指针 ------ 「头指针」、「尾指针」和「游标指针」

![双向链表](https://misc.aotu.io/leeenx/chain/20171014-double-chain.png)

用一个匿名对象作为链表上的节点，如下伪代码：
```javascript
function generateNode(data) {
	return {
		data: data, // 数据域
		next: null, // 前驱指针
		prev: null // 后继指针
	} 
}
```

声明变量 `HEAD`, `TAIL`, `POINTER` & `length` 分别指代「头指针」，「尾指针」，「游标指针」和 「链表长度」，那么构建一个双向链表如下伪代码：

```javascript
let HEAD, TAIL, POINTER, length = 0; 
// 创建一条长度为5的双向链表
[0, 1, 2, 3, 4].forEach((data, index, arr) => {
	let node = generateNode(data); 
	// 第一个节点
	if(index === 0) {
		HEAD = node; 
	} 
	else {
		// 指定前驱后继指针
		[node.prev, POINTER.next] = [POINTER, node]; 
		// 最后一个节点
		index === arr.length - 1 && (TAIL = node)
	}
	// 指向当前节点
	POINTER = node; 
	++length; 
}); 
// 游标指针回退到头部
POINTER = HEAD; 
```

链表结构本身是个很简单的结构，20行左右代码可以完成双向链表数据结构的构建。

## 定制 APIs

上一节虽然实现了「双向链表」的数据结构，但链表还处在很原始的状态，操作起来比较麻烦，为了方便操作链表得为链表量身定做一套 APIs。数组有一系列成熟且好用的  APIs，笔者想借鉴数组的 APIs 为链表定制以下的 APIs: 

| Name | Detail | Name | Detail | Name | Detail | Name | Detail |
| :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: |
| shift | 参见数组 | unshift | 参见数组 | pop | 参见数组 | push | 参见数组 |
| slice | 参见数组 | splice | 参见数组 | concat | 参见数组 | reverse | 参见数组 |
| sort | 参见数组 | indexOf | 参见数组 | length<sup>[属性]</sup> | 参见数组 | - | - |
| at | 指针定位 | prev | 指针前移 | next | 指针后退 | curr | 当前指针 |
| first | 头节点 | last | 尾节点 | remove | 删除节点 | clone | 克隆链表 |
| insertAfter | 插入节点 | insertBefore | 插入节点 | insertChainAfter | 插入链表 | insertChainBefore | 插入链表 |
| HEAD<sup>[属性]</sup> | 头指针 | TAIL<sup>[属性]</sup> | 尾指针 | setHead | 重置头指针 | setTail | 重置尾指针 |
| POINTER<sup>[属性]</sup> | 游标指针（当前位置） | setPointer | 设置当前指针 | - | - | - | - |


_上表与数组同名的 APIs，表示用法与功能与数组一样。_

 为了突显「链表性」笔者添加了四个 `insert*`。`insert*` 的作用是向主链表指定位置插入节点或链表。APIs 不小心被笔者写多了，这里就不展开介绍它们的实现过程了。有兴趣的同学可以移步：[https://github.com/leeenx/es6-utils/blob/master/modules/Chain_v2.js](https://github.com/leeenx/es6-utils/blob/master/modules/Chain_v2.js)

## 循环链表

笔者以往都是用数组来模拟循环链表，如下：
```javascript
Array.prototype.next = function() { 
	var cur = this[0]; 
	this.push(this.shift()); 
	return cur;
}
var arr = [1, 2, 3, 4, 5]; 
var count = 0; 
while(count++<20) {
	console.log(arr.next());
}
```
有了 `Chain` 类后，可以直接这样写：

```javascript
let circle = new Chain([1, 2, 3, 4, 5]); 
// 链表头咬尾
circle.TAIL.next = circle.HEAD; 
for(let i = 0; i < 20; ++i) {
	console.log(chain.next()); 
}
```

## 结语

近期有些同学在问笔者，使用 `Chain` 类真的可以提升性能吗？这个需要分情况，如果是比较长的「线性表」做高频的「删除」或「插入」操作，自然是使用 `Chain` 有算法上的优势。但是，对于短的「线性表」来说，使用数组更快一些，因为 V8 的数组性能相当高，笔者认为小于 200 的「线性表」都可以直接使用数组。

本文实现的 `Chain` 类托管在：[https://github.com/leeenx/es6-utils/blob/master/modules/Chain_v2.js](https://github.com/leeenx/es6-utils/blob/master/modules/Chain_v2.js)

感谢耐心阅读完本文章的读者。本文仅代表笔者的个人观点，如有不妥之处请不吝赐教。

<style>
	.post-content sup a {
		vertical-align: unset; 
	}
</style>

