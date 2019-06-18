title: JavaScript中Math.random的种子设定方法
subtitle: 曾为JS中无法设定种子随机数而苦恼吧？实例讲解了JS中种子随机数的设定方法
cover: https://img30.360buyimg.com/ling/jfs/t1/66110/5/2147/144781/5d08572dEf165d12a/377dd424b31a4047.png
categories: Web开发
tags:
  - JavaScript
  - Random
author:
  nick: panxinwu
  github_name: panxinwu
date: 2016-04-14 16:30:45
---

<!-- more -->
### JavaScript中Math.random的种子设定方法
 CodeWars上有这么个题目： `《Don't rely on luck》` 的奇葩题目，先看一下题目描述：
##### Description:
> The test fixture I use for this kata is pre-populated.
It will compare your guess to a random number generated in  JavaScript by:
`Math.floor(Math.random() * 100 + 1)`
You can pass by relying on luck or skill but try not to rely on luck.
"The power to define the situation is the ultimate power." - Jerry Rubin
Good luck!

##### 给出的Test Case:
```
var lucky_number = Math.floor(Math.random() * 100 + 1);
Test.assertEquals(guess, lucky_number, "Sorry. Unlucky this time.");
```

出题者大约是想让每次随机数与你guess到的数字相同，So ‘Don't rely on luck’.
这是一个大坑，原本读完题后百思不得其解，当UnSolution后，心里真的是万马奔腾。

This is solution 
```
Math.random=function(n){return 0;}
var guess = 1;
```

或者 
```
var guess = 10
Math.floor = function(v) { return guess; } 
```

是的，你没看错。就是将Math.random 或者 Math.floor 重写。
看到有个老外估计也是UnLock solution后心里愤恨写了这么一个答案：
```
Math.floor = function(){return "F*** ***"; }
guess = "F*** ***"; 
```

然而这道题目明显是想让你了解伪随机数产生的原理以及种子随机数在JavaScript实现方法。

> 代码虐我千百遍，我待代码如初恋。



#### 那么JavaScript中的种子随机数到底怎么实现呢？
在C或者Ruby中都有低层的重置seed的方法，比如C中的seed值当计算机正常开机后，这个种子的值是定了的，C提供了 `srand()`函数，它的原形是`void srand( int a)`。而Ruby中默认是根据系统时间、进程id、一个可升序的数字来生成随机数种子。然而JavaScript中并没有类似上面底层语言提供的seedRandomR函数，我的第一反应就是自己实现一个，也就是重写`Math.random()`方法。
> 在开始我的重写`Math.random()`方法前还是需要做一些知识储备工作：
> 实现随机函数的方法很多，如斐波那契法、线性同余法、梅森旋转算法Mersenne twister， 现在最好的随机数产生算法是梅森旋转算法Mersenne twister。[维基百科](https://zh.wikipedia.org/zh/%E6%A2%85%E6%A3%AE%E6%97%8B%E8%BD%AC%E7%AE%97%E6%B3%95)

chrome v8 引擎使用的随机函数算法：(每个浏览器厂商实现Math.random并不相同)
```
// ECMA 262 - 15.8.2.14
var rngstate;  // Initialized to a Uint32Array during genesis.
function MathRandom() {
  var r0 = (MathImul(18030, rngstate[0] & 0xFFFF) + (rngstate[0] >>> 16)) | 0;
  rngstate[0] = r0;
  var r1 = (MathImul(36969, rngstate[1] & 0xFFFF) + (rngstate[1] >>> 16)) | 0;
  rngstate[1] = r1;
  var x = ((r0 << 16) + (r1 & 0xFFFF)) | 0;
  // Division by 0x100000000 through multiplication by reciprocal.
  return (x < 0 ? (x + 0x100000000) : x) * 2.3283064365386962890625e-10;
}
// Non-standard extension.
function MathImul(x, y) {
  return %NumberImul(TO_NUMBER_INLINE(x), TO_NUMBER_INLINE(y));
}
```
From: [chrome v8引擎随机数实现方法](https://github.com/v8/v8/blob/dae6dfe08ba9810abbe7eee81f7c58e999ae8525/src/math.js#L144)

可以看得出V8引擎中的seed 值是通过`MathImul`方法创造出来的。所以并没有为我们预留开发者传入seed值的参数。

那我们要想实时掌握每次随机产生的值相同（预留seed参数），只能自己重写`Math.random`方法了。 ##### 比较经典的获取随机数的写法：
```
Math.random = function(seed){
return ('0.'+Math.sin(seed).toString().substr(6));
} 
```

打开Node终端跑一下：
```
Math.random = function(seed){return ('0.'+Math.sin(seed).toString().substr(6));}
Math.random(1) 
```
seed值始终为1时始终得到：`0.709848078965`
至此我们可以探索种子随机数的用途：
> 比如我们在开发京东的H5活动页面的小游戏时，可能需要随机产生一些背景、随机掉落道具、小怪物；当用户中途退出(微信不小心右滑，一定有不少人被这个恶心到[当然现在已经优化])，当用户重新打开小游戏时，用户整体进度、积分我们可以很容易记录到本地或者存储到微信ID建立的存储机制中从而得以恢复，但是随机产生的场景、随机掉落道具、小怪物等并不是那么容易存储恢复，重新获取场景、小怪物那未免用户体验太差！！！把画布上的所有物件、怪物属性全部存储下来更是没有必要。此时我们就可以利用我们重写的`Math.random()`(此时可不重写内置方法，可另起别名)。只要我们保存下来一个随机数seed值，利用seed值来恢复所有的场景就好了。

另外[ David Bau](https://github.com/davidbau/seedrandom)提供了一个seedrandom库以供开发者调用:
###### Script tag usage
```
<script src="//cdnjs.cloudflare.com/ajax/libs/seedrandom/2.4.0/seedrandom.min.js"></script>
```
###### Require.js usage
```
$ bower install seedrandom
```
###### Node.js usage
```
$ npm install seedrandom
```

当然不管我们如何优化种子随机数，产生的随机数都是伪随机数也就是假的随机数，它是根据某种已知的方法获取随机数，本质上已经去除了真正随机的可能。这种方法一旦重复，则获取到的随机数也会重复。
  
那么计算机能否产生真的随机数呢？
GitHub上有一个叫[RealRand](https://github.com/maik/RealRand) 的项目。包装了3个真正的随机数服务生成服务：(基于Ruby)
- random.org：此网站根据大气噪声来生成随机数
- FourmiLab（HotBits）：使用放射性衰变来生成随机数
- random.hd.org（EntropyPool）：声称使用各种来源来产生随机数，包括本地程序/文件/设备，网页的点击率，以及远程Web站点。

跑偏了，再回到JavaScript中种子随机数的话题：
> 可以看出来：随机数种子的存在可以让随机数在开发者手中实现可控。而实现随机数“种子的随机”可以来实现H5小游戏道具的随机掉落的可控性更甚至真随机数的可能性(像上文中提到的通过大气噪声、放射性衰变等物理随机坏境来产生随机数种子)。

-EOF-

