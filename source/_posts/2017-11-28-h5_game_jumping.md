title: H5游戏开发：指尖大冒险
subtitle: 对《指尖大冒险》的核心技术点进行剖析，涉及游戏场景循环与游戏开发中随机算法的应用。
cover: http://misc.aotu.io/Tingglelaoo/h5game_jumping_900x500.png
date: 2017-11-28 8:10
categories: H5游戏开发
tags:
  - H5
  - 游戏
  - createjs
  - 随机算法
author:
    nick: Tingglelaoo
    github_name: Tingglelaoo
wechat:
    share_cover: http://misc.aotu.io/Tingglelaoo/h5game_jumping_200x200.png
    share_title: H5游戏开发：指尖大冒险
    share_desc: 对《指尖大冒险》的核心技术点进行剖析，涉及游戏场景循环与游戏开发中随机算法的应用。


---
<!-- more -->

在今年八月中旬，《指尖大冒险》SNS 游戏诞生，其具体的玩法是通过点击屏幕左右区域来控制机器人的前进方向进行跳跃，而阶梯是无穷尽的，若遇到障碍物或者是踩空、或者机器人脚下的阶砖陨落，那么游戏失败。

> 笔者对游戏进行了简化改造，可通过扫下面二维码进行体验。

<div style="margin:0 auto;width:fit-content;">![demo.png](//misc.aotu.io/Tingglelaoo/demo.png)</div>
<small style="display:block;text-align:center;">《指尖大冒险》SNS 游戏简化版</small>

该游戏可以被划分为三个层次，分别为景物层、阶梯层、背景层，如下图所示。

<div style="margin:0 auto;width:fit-content;">![layers.png](//misc.aotu.io/Tingglelaoo/layers.png)</div>
<small style="display:block;text-align:center;">《指尖大冒险》游戏的层次划分</small>

整个游戏主要围绕着这三个层次进行开发：

- 景物层：负责两侧树叶装饰的渲染，实现其无限循环滑动的动画效果。
- 阶梯层：负责阶梯和机器人的渲染，实现阶梯的随机生成与自动掉落阶砖、机器人的操控。
- 背景层：负责背景底色的渲染，对用户点击事件监听与响应，把景物层和阶梯层联动起来。

而本文主要来讲讲以下几点核心的技术内容：

1. 无限循环滑动的实现
2. 随机生成阶梯的实现
3. 自动掉落阶砖的实现

下面，本文逐一进行剖析其开发思路与难点。

## 一、无限循环滑动的实现
景物层负责两侧树叶装饰的渲染，树叶分为左右两部分，紧贴游戏容器的两侧。

在用户点击屏幕操控机器人时，两侧树叶会随着机器人前进的动作反向滑动，来营造出游戏运动的效果。并且，由于该游戏是无穷尽的，因此，需要对两侧树叶实现循环向下滑动的动画效果。
  
  <div style="margin:0 auto;width:fit-content;">![Leafheight.png](//misc.aotu.io/Tingglelaoo/Leafheight.png)</div>
  <small style="display:block;text-align:center;">循环场景图设计要求</small>
  
对于循环滑动的实现，首先要求设计提供可前后无缝衔接的场景图，并且建议其场景图高度或宽度大于游戏容器的高度或宽度，以减少重复绘制的次数。
  
然后按照以下步骤，我们就可以实现循环滑动：

- 重复绘制两次场景图，分别在定位游戏容器底部与在相对偏移量为贴图高度的上方位置。
- 在循环的过程中，两次贴图以相同的偏移量向下滑动。
- 当贴图遇到刚滑出游戏容器的循环节点时，则对贴图位置进行重置。

  
<div style="margin:0 auto;width:fit-content;">![leafmove.gif](//misc.aotu.io/Tingglelaoo/leafmove.gif)</div>
<small style="display:block;text-align:center;">无限循环滑动的实现</small>
  
用伪代码描述如下：
```Javascript
// 设置循环节点
transThreshold = stageHeight;

// 获取滑动后的新位置，transY是滑动偏移量
lastPosY1 = leafCon1.y + transY;  
lastPosY2 = leafCon2.y + transY;

// 分别进行滑动
if leafCon1.y >= transThreshold // 若遇到其循环节点，leafCon1重置位置
  then leafCon1.y = lastPosY2 - leafHeight;
  else leafCon1.y = lastPosY1;


if leafCon2.y >= transThreshold // 若遇到其循环节点，leafCon2重置位置
  then leafCon2.y = lastPosY1 - leafHeight;
  else leafCon2.y = lastPosY2;
  
```

在实际实现的过程中，再对位置变化过程加入动画进行润色，无限循环滑动的动画效果就出来了。

## 二、随机生成阶梯的实现

随机生成阶梯是游戏的最核心部分。根据游戏的需求，阶梯由「无障碍物的阶砖」和「有障碍物的阶砖」的组成，并且阶梯的生成是随机性。

### 无障碍阶砖的规律
其中，无障碍阶砖组成一条畅通无阻的路径，虽然整个路径的走向是随机性的，但是每个阶砖之间是相对规律的。

因为，在游戏设定里，用户只能通过点击屏幕的左侧或者右侧区域来操控机器人的走向，那么下一个无障碍阶砖必然在当前阶砖的左上方或者右上方。

<div style="margin:0 auto;width:fit-content;">![stairsguilv.png](//misc.aotu.io/Tingglelaoo/stairsguilv.png)</div>
<small style="display:block;text-align:center;">无障碍路径的生成规律</small>


用 0、1 分别代表左上方和右上方，那么我们就可以建立一个无障碍阶砖集合对应的数组（下面简称无障碍数组），用于记录无障碍阶砖的方向。

而这个数组就是包含 0、1 的随机数数组。例如，如果生成如下阶梯中的无障碍路径，那么对应的随机数数组为 [0, 0, 1, 1, 0, 0, 0, 1, 1, 1]。

<div style="margin:0 auto;width:fit-content;">![stairArr.png](//misc.aotu.io/Tingglelaoo/stairArr.png)</div>
<small style="display:block;text-align:center;">无障碍路径对应的 0、1 随机数</small>

### 障碍阶砖的规律

障碍物阶砖也是有规律而言的，如果存在障碍物阶砖，那么它只能出现在当前阶砖的下一个无障碍阶砖的反方向上。

根据游戏需求，障碍物阶砖不一定在邻近的位置上，其相对当前阶砖的距离是一个阶砖的随机倍数，距离范围为 1～3。

<div style="margin:0 auto;width:fit-content;">![barrguilv.png](//misc.aotu.io/Tingglelaoo/barrguilv.png)</div>
<small style="display:block;text-align:center;">障碍阶砖的生成规律</small>

同样地，我们可以用 0、1、2、3 代表其相对距离倍数，0 代表不存在障碍物阶砖，1 代表相对一个阶砖的距离，以此类推。

因此，障碍阶砖集合对应的数组就是包含 0、1、2、3 的随机数数组（下面简称障碍数组）。例如，如果生成如下图中的障碍阶砖，那么对应的随机数数组为 [0, 1, 1, 2, 0, 1, 3, 1, 0, 1]。

<div style="margin:0 auto;width:fit-content;">![barrArr.png](//misc.aotu.io/Tingglelaoo/barrArr.png)</div>
<small style="display:block;text-align:center;">障碍阶砖对应的 0、1、2、3 随机数</small>

除此之外，根据游戏需求，障碍物阶砖出现的概率是不均等的，不存在的概率为 50% ，其相对距离越远概率越小，分别为 20%、20%、10%。

### 利用随机算法生成随机数组

根据阶梯的生成规律，我们需要建立两个数组。

对于无障碍数组来说，随机数 0、1 的出现概率是均等的，那么我们只需要利用 `Math.random()`来实现映射，用伪代码表示如下：
```javascript
// 生成随机数i，min <= i < max
function getRandomInt(min, max) { 
  return Math.floor(Math.random() * (max - min) + min);
}
```
```javascript
// 生成指定长度的0、1随机数数组
arr = [];
for i = 0 to len
  arr.push(getRandomInt(0,2));
return arr;
```

而对于障碍数组来说，随机数 0、1、2、3 的出现概率分别为：P(0)=50%、P(1)=20%、P(2)=20%、P(3)=10%，是不均等概率的，那么生成无障碍数组的办法便是不适用的。

那如何实现生成这种满足指定非均等概率分布的随机数数组呢？

我们可以利用概率分布转化的理念，将非均等概率分布转化为均等概率分布来进行处理，做法如下：

1. 建立一个长度为 L 的数组 A ，L 的大小从计算非均等概率的分母的最小公倍数得来。
2. 根据非均等概率分布 P 的情况，对数组空间分配，分配空间长度为 L * Pi ，用来存储记号值 i 。
3. 利用满足均等概率分布的随机办法随机生成随机数 s。
4. 以随机数 s 作为数组 A 下标，可得到满足非均等概率分布 P 的随机数 A[s] ——记号值 i。

我们只要反复执行步骤 4 ，就可得到满足上述非均等概率分布情况的随机数数组——障碍数组。

结合障碍数组生成的需求，其实现步骤如下图所示。

<div style="margin:0 auto;width:fit-content;">![alg1_demo.png](//misc.aotu.io/Tingglelaoo/alg1_demo.png)</div>
<small style="display:block;text-align:center;">障碍数组值随机生成过程</small>

用伪代码表示如下：
```javascript
// 非均等概率分布Pi
P = [0.5, 0.2, 0.2, 0.1]; 

// 获取最小公倍数
L = getLCM(P); 

// 建立概率转化数组
A = [];
l = 0;
for i = 0 to P.length
  k = L * P[i] + l
  while l < k
    A[l] = i;
    l++;

// 获取均等概率分布的随机数
s = Math.floor(Math.random() * L);

// 返回满足非均等概率分布的随机数
return A[s];
```
对这种做法进行性能分析，其生成随机数的时间复杂度为 O(1) ，但是在初始化数组 A 时可能会出现极端情况，因为其最小公倍数有可能为 100、1000 甚至是达到亿数量级，导致无论是时间上还是空间上占用都极大。

有没有办法可以进行优化这种极端的情况呢？
经过研究，笔者了解到 [Alias Method](https://en.wikipedia.org/wiki/Alias_method) 算法可以解决这种情况。

Alias Method 算法有一种最优的实现方式，称为 Vose's Alias Method ，其做法简化描述如下：

1. 根据概率分布，以概率作为高度构造出一个高度为 1（概率为1）的矩形。
2. 根据构造结果，推导出两个数组 Prob 数组和 Alias 数组。
3. 在 Prob 数组中随机取其中一值 Prob[i] ，与随机生成的随机小数 k，进行比较大小。
4. 若 k <= Prob[i] ，那么输出符合期望概率分布的随机数为 i，否则输出的值是 Alias[i] 。

<div style="margin:0 auto;width:fit-content;">
![alg3_demo.png](//misc.aotu.io/Tingglelaoo/alg3_demo.png)</div>
<small style="display:block;text-align:center;">对障碍阶砖分布概率应用 Vose's Alias Method 算法的数组推导过程 </small>

> 如果有兴趣了解具体详细的算法过程与实现原理，可以阅读 Keith Schwarz 的文章[《Darts, Dice, and Coins》](http://www.keithschwarz.com/darts-dice-coins/)。

根据 Keith Schwarz 对 Vose's Alias Method 算法的性能分析，该算法在初始化数组时的时间复杂度始终是 O(n) ，而且随机生成的时间复杂度在 O(1) ，空间复杂度也始终是 O(n) 。

<div style="margin:0 auto;width:fit-content;">![suanfaxingneng.png](//misc.aotu.io/Tingglelaoo/suanfaxingneng.png)</div>
<small style="display:block;text-align:center;">两种做法的性能比较（引用  Keith Schwarz 的[分析结果](http://www.keithschwarz.com/darts-dice-coins/)) </small>

两种做法对比，明显 Vose's Alias Method 算法性能更加稳定，更适合非均等概率分布情况复杂，游戏性能要求高的场景。

> 在 Github 上，@jdiscar 已经对 Vose's Alias Method 算法进行了很好的实现，你可以到[这里](https://github.com/jdiscar/vose-alias-method.js)学习。

最后，笔者仍选择一开始的做法，而不是 Vose's Alias Method 算法。因为考虑到在生成障碍数组的游戏需求场景下，其概率是可控的，它并不需要特别考虑概率分布极端的可能性，并且其代码实现难度低、代码量更少。

### 根据相对定位确定阶砖位置
利用随机算法生成无障碍数组和障碍数组后，我们需要在游戏容器上进行绘制阶梯，因此我们需要确定每一块阶砖的位置。

我们知道，每一块无障碍阶砖必然在上一块阶砖的左上方或者右上方，所以，我们对无障碍阶砖的位置计算时可以依据上一块阶砖的位置进行确定。

<div style="margin:0 auto;width:fit-content;">![stairPos.gif](//misc.aotu.io/Tingglelaoo/stairPos.gif)</div>
<small style="display:block;text-align:center;">无障碍阶砖的位置计算推导</small>

如上图推算，除去根据设计稿测量确定第一块阶砖的位置，第n块的无障碍阶砖的位置实际上只需要两个步骤确定：

1. 第 n 块无障碍阶砖的 x 轴位置为上一块阶砖的 x 轴位置偏移半个阶砖的宽度，若是在左上方则向左偏移，反之向右偏移。
2. 而其 y 位置则是上一块阶砖的 y 轴位置向上偏移一个阶砖高度减去 26 像素的高度。

其用伪代码表示如下：
```javascript
// stairSerialNum代表的是在无障碍数组存储的随机方向值
direction = stairSerialNum ? 1 : -1;

// lastPosX、lastPosY代表上一个无障碍阶砖的x、y轴位置
tmpStair.x = lastPosX + direction * (stair.width / 2);
tmpStair.y = lastPosY - (stair.height - 26);
```

接着，我们继续根据障碍阶砖的生成规律，进行如下图所示推算。

<div style="margin:0 auto;width:fit-content;">![barrPos.gif](//misc.aotu.io/Tingglelaoo/barrPos.gif)</div>
<small style="display:block;text-align:center;">障碍阶砖的位置计算推导</small>

可以知道，障碍阶砖必然在无障碍阶砖的反方向上，需要进行反方向偏移。同时，若障碍阶砖的位置相距当前阶砖为 n 个阶砖位置，那么 x 轴方向上和 y 轴方向上的偏移量也相应乘以 n 倍。

其用伪代码表示如下：
```javascript
// 在无障碍阶砖的反方向
oppoDirection = stairSerialNum ? -1 : 1;

// barrSerialNum代表的是在障碍数组存储的随机相对距离
n = barrSerialNum;

// x轴方向上和y轴方向上的偏移量相应为n倍
if barrSerialNum !== 0  // 0 代表没有
  tmpBarr.x = firstPosX + oppoDirection * (stair.width / 2) * n, 
  tmpBarr.y = firstPosY - (stair.height - 26) * n;
```

至此，阶梯层完成实现随机生成阶梯。

## 三、自动掉落阶砖的实现
当游戏开始时，需要启动一个自动掉落阶砖的定时器，定时执行掉落末端阶砖的处理，同时在任务中检查是否有存在屏幕以外的处理，若有则掉落这些阶砖。

所以，除了机器人碰障碍物、走错方向踩空导致游戏失败外，若机器人脚下的阶砖陨落也将导致游戏失败。

而其处理的难点在于：

1. 如何判断障碍阶砖是相邻的或者是在同一 y 轴方向上呢？
2. 如何判断阶砖在屏幕以外呢？

### 掉落相邻及同一y轴方向上的障碍阶砖

对于第一个问题，我们理所当然地想到从底层逻辑上的无障碍数组和障碍数组入手：判断障碍阶砖是否相邻，可以通过同一个下标位置上的障碍数组值是否为1，若为1那么该障碍阶砖与当前末端路径的阶砖相邻。

但是，以此来判断远处的障碍阶砖是否是在同一 y 轴方向上则变得很麻烦，需要对数组进行多次遍历迭代来推算。

而经过对渲染后的阶梯层观察，我们可以直接通过 y 轴位置是否相等来解决，如下图所示。

<div style="margin:0 auto;width:fit-content;">![autodrop1.png](//misc.aotu.io/Tingglelaoo/autodrop1.png)</div>
<small style="display:block;text-align:center;">掉落相邻及同一 y 轴方向上的障碍阶砖</small>

因为不管是来自相邻的，还是同一 y 轴方向上的无障碍阶砖，它们的 y 轴位置值与末端的阶砖是必然相等的，因为在生成的时候使用的是同一个计算公式。

处理的实现用伪代码表示如下：
```javascript
// 记录被掉落阶砖的y轴位置值
thisStairY = stair.y;
 
// 掉落该无障碍阶砖
stairCon.removeChild(stair);

// 掉落同一个y轴位置的障碍阶砖
barrArr = barrCon.children;
for i in barrArr
  barr = barrArr[i],
  thisBarrY = barr.y;
  if barr.y >= thisStairY // 在同一个y轴位置或者低于
    barrCon.removeChild(barr);
```

### 掉落屏幕以外的阶砖

那对于第二个问题——判断阶砖是否在屏幕以外，是不是也可以通过比较阶砖的 y 轴位置值与屏幕底部y轴位置值的大小来解决呢？

不是的，通过 y 轴位置来判断反而变得更加复杂。

因为在游戏中，阶梯会在机器人前进完成后会有回移的处理，以保证阶梯始终在屏幕中心呈现给用户。这会导致阶砖的 y 轴位置会发生动态变化，对判断造成影响。

但是我们根据设计稿得出，一屏幕内最多能容纳的无障碍阶砖是 9 个，那么只要把第 10 个以外的无障碍阶砖及其相邻的、同一 y 轴方向上的障碍阶砖一并移除就可以了。

<div style="margin:0 auto;width:fit-content;">![autodrop2.png](//misc.aotu.io/Tingglelaoo/autodrop2.png)</div>
<small style="display:block;text-align:center;">掉落屏幕以外的阶砖</small>

所以，我们把思路从视觉渲染层面再转回底层逻辑层面，通过检测无障碍数组的长度是否大于 9 进行处理即可，用伪代码表示如下：
```javascript
// 掉落无障碍阶砖
stair = stairArr.shift();
stair && _dropStair(stair);

// 阶梯存在数量超过9个以上的部分进行批量掉落
if stairArr.length >= 9
  num = stairArr.length - 9,
  arr = stairArr.splice(0, num);
  for i = 0 to arr.length
    _dropStair(arr[i]);
}
```
至此，两个难点都得以解决。

## 后言
为什么笔者要选择这几点核心内容来剖析呢？
因为这是我们经常在游戏开发中经常会遇到的问题：

  - 怎样处理游戏背景循环？
  - 有 N 类物件，设第 i 类物件的出现概率为 P(X=i) ，如何实现产生满足这样概率分布的随机变量 X ？

而且，对于阶梯自动掉落的技术点开发解决，也能够让我们认识到，游戏开发问题的解决可以从视觉层面以及逻辑底层两方面考虑，学会转一个角度思考，从而将问题解决简单化。

这是本文希望能够给大家在游戏开发方面带来一些启发与思考的所在。最后，还是老话，行文仓促，若错漏之处还望指正，若有更好的想法，欢迎留言交流讨论！
  
另外，本文同时发布在[「H5游戏开发」专栏](https://zhuanlan.zhihu.com/snsgame)，如果你对该方面的系列文章感兴趣，欢迎关注我们的专栏。

## 参考资料
- [《Darts, Dice, and Coins》](http://www.keithschwarz.com/darts-dice-coins/)