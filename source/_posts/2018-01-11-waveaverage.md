title: 波动均分算法
subtitle: 波动均分不是严格意义上的「均分」，但它却跟「均分」很相似。
cover: https://misc.aotu.io/leeenx/waveAverage/cover.jpg
categories: Web开发
tags:
  - javascript
  - 均分
  - average
  - 算法
author:
  nick: leeenx
  github_name: o2team
date: 2018-01-11 11:49:03
wechat:
    share_cover: https://misc.aotu.io/leeenx/waveAverage/share.jpg
    share_title: 波动均分算法
    share_desc: 波动均分不是严格意义上的「均分」，但它却跟「均分」很相似。
---

「波动」和「均分」大部分读者朋友是知道的，但看到「波动均分」应该是一头雾水的。其实，这个名词是笔者拼凑出来的。

**什么是「波动均分」？**

把指定的数值 A，分成 N 份，此时每份的数值在一个固定的区间 [max, min] 内。 从视觉上看，每份的数量在平均线上下波动，并带有随机性：

![正余弦波线图](https://misc.aotu.io/leeenx/waveAverage/2017-12-06-waveAverage.gif)

这种分配不是严格意义上的「均分」，但它却跟「均分」很相似，按笔者的理解给这个算法取个名字 ------ 「波动均分」。

**波动均分算法应该具备的特征如下：**

- 分配数量
- 波峰高度
- 波谷深度
- 随机分配
- 组合全面
 
前三个特征是提供对外配置的接口，保证算法的使用者可以指定分配的数量和定制波动的波峰和波谷（尽管大部分情况下，波峰 = 波谷）；「随机分配」表示算法的结果是随机的；
「 组合全面」表示算法的结果是可以覆盖所有可能的结果。

接下来，笔者将介绍两种实现「波动均分」的算法：

- 穷举法
- 快速分配

**备注：本文算法中使用到的平均值是0**

## 穷举法

「穷举法」顾名思义就是列举所有可能出现的组合，再随机抽取一个组合作为输出结果。

下面是一个「波动均分」任务：
> 有一张 10x10 的表格，需要对格子上5种颜色并要求每种颜色的数量在区间 [18, 22] 内。

由上述可得：每种颜色都会有5种分配结果（18, 19, 20, 21, 22）。穷举这些颜色分配数量的组合其实就是建设一棵高度为 6 的 5 叉树的过程。

![5叉树](https://misc.aotu.io/leeenx/waveAverage/20180110_tree.gif?v=5)

第 6 层的叶子数就是「所有可能出现的组合」的总数。换而言之，从树的第六层的一片叶子到第二层节点的路径即是一种分配组合。

以下是「穷举法」的代码实现：
```javascript
function exhaustWave(n = 5, crest = 4, trough = 4) { 
	let root = {parent: null, count: null, subtotal: 0}; // 根节点
	let leaves = [root]; // 叶子（数组）
	let level = 0; // 层数 
	// 检查当前组合是否合法
	let isOK = subtotal => {
		if(level < n - 1) {
			if(-subtotal <= (n - level) * crest || subtotal <= (n - level) * trough) return true; 
		}
		else if(subtotal === 0) return true; 
		else return false; 
	}
	// 生成组合树 
	while(level < n) { 
		let newLeaves = []; // 存储最新叶子
		leaves.forEach(node => {
			for(let count = -trough; count <= crest; ++count) {
				let subtotal = node.subtotal + count; 
				isOK(subtotal) && newLeaves.push(
					{parent: node, count: count, subtotal: subtotal}
				); 
			}
		}); 
		leaves = newLeaves, ++level; 
	}
	// 随机取一片叶子
	let leaf = leaves[Math.random() * leaves.length >> 0]; 
	let group = [leaf.count]; 
	for(let i = 0; i < 4; ++i) { 
		leaf = leaf.parent; 
		group.push(leaf.count); 
	}
	return group; 
}
```

**穷举法的局限：**

1.  「无穷集合」不适用
2.  穷举算法效率低下

由于「穷举法」的这两个致命限制，所以它不是适用于业务。事实上，笔者主要是使用「穷举法」校验「快速分配」方案的全面性。

## 快速分配

「快速分配」方案的思路：

1. 获取可分配波动范围；
2. 在波动范围内随机取值

代码的实现过程如下：
```javascript
function quickWave(n = 5, crest = 4, trough = 4, isInteger = true) { 
	let list = []; 
	// 无法进行波动均分，直接返回完全平分
	if(crest > (n - 1) * trough || trough > (n - 1) * crest) {
		return new Array(n).fill(0); 
	}
	let base = 0; // 最少需要消除的高度
	let wave = 0; // 波动量
	let high = crest; // 高位
	let low = -trough; // 低位
	let sum = 0; // 累计量 
	let count = n; // 剩余数量 
	while(--count >= 0) { 
		// 动态当前的波动量
		if(crest > count * trough - sum) {
			high = count * trough - sum; 
		}
		if(trough > count * crest + sum) {
			low = -sum - count * crest; 
		}
		base = low; 
		wave = high - low; 
		let rnd; // 随机波动量 
		if(count > 0) {
			rnd = base + Math.random() * (wave + 1); // 随机波动
		} else {
			rnd = -sum; 
		}
		if(isInteger === true) {
			rnd = Math.floor(rnd); 
		} 
		sum += rnd; 
		list.push(rnd); 
	}
	return list; 
}
```
波动均分的「快速分配」方案在算法效率上是高效的，并且「快速分配」适用于「无穷集合」。

**如何使用「穷举法」校验「快速分配」的全面性？**
「穷举法」能直接返回分配组合的总数，而「快速分配」只能随机返回一次组合，笔者是通过大数量地调用「快速分配」算法并累积不重复组合来验证「快速分配」的全面性。代码如下： 

```javascript
console.log(exhaustWave(5, 4, 4)); // 组合总数: 3951
let res = {}, count = 0, len = 10000; 
for(let i = 0; i < len; ++i) { 
	let name = quickWave(5, 4, 4).join("_"); 
	res[name] !== true && (res[name] = true, ++count);  
}
console.log(count); // len次快速分配后的组合总数
```
通过调整变量 `len` 可以发现，当 `len` 越来越大输出的结果就越逼近 3951，当到达一定量级后，输出的结果就是 3951。 

## 结语

可能网上有类似的算法存在，不过笔者学识太浅没有找到对应的算法，所以自己生造了这个算法，如果有何不妥之处欢迎指正。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。 
