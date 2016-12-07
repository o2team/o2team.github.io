title: 源码赏析 - 1K的Firewatch游戏
subtitle: 逗我呢！1K的代码能干啥？JQ都不够吧！
cover: //misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-900x500.jpg
tags:
  - js1k 游戏 3D
author:
  nick: Littly
  github_name: Littly
date: 2016-12-04 23:33
---


### 前言

讲真，做前端越久，我们就越容易被思维所束缚。比如，应该没几个人会相信用1K代码能够写出一个游戏，而且还是3d的游戏。

在看这段代码之前我们不得不提到一个一年一度的比赛：[js1k](http://js1k.com)。每年，主办方会提出一个比赛主题，参赛者们必须围绕这个主题，用1024个字节以内的JS代码做一个参赛作品。比赛的要求有以下几个：

* **Create a fancy pancy JavaScript demo** (用JS做出一个华丽的demo)

* **Submissions may be up to 1024 bytes** (最多1024字节)

* **Externals are strictly forbidden** (禁止引用外部资源)

* **Must work current generation browsers** (必须能在现代浏览器中运行)

* **Minification and hacks allowed** (允许代码压缩或者hack)

另外，作为基础，demo运行的环境中**内置了一部分变量**供调用：

* `window.a` 是一个canvas元素

* `window.b` 是document.body

* `window.c` 是a元素对应的2D/3D上下文

* `window.d` 是document对象

是不是还挺贴心？只需要用一个字母就可以调用原本一长串代码才能拿到的对象喔。

除了这些，比赛还有一些小规则，可以查看比赛的 [规则页](http://js1k.com/2016-elemental/rules) ，里面有详细描述，这里就不再多说。

今年比赛的主题是 **Let's get eleMental!**，我们今天要看的 [Firewatch](http://js1k.com/2016-elemental/demo/2512) 就是其中第三位的作品（第一名作品是 [Romanesco 2.0](http://js1k.com/2016-elemental/demo/2552) 3D分形展示，有强烈的不明觉厉感，建议前往围观；第二名 [Voxeling](http://js1k.com/2016-elemental/demo/2497) 是一个3D像素Demo）。

![前二甲作品](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-thetop2.jpg)

### Demo介绍

游戏通过键盘**上下左右+空格键**操作。在开始游戏后，面前会有一颗烟花炸开。紧接着烟花下的树开始着火。玩家的任务就是按下空格，用水枪将火扑灭。在一定时间后，树上的火还会点燃周围的树。如果不慎走神，很有可能就救不回这片森林了喔。

![游戏画面](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-gameui.jpg)

### 源码解析

粗略地讲，这份源码总共就分为两个部分：

1. **创建对象**
2. 绑定用户交互，进行**事件循环**

#### 创建对象

下面是创建对象部分的代码：

```javascript
// add trees
for (entities = [playerA = 256]; s = playerX = playerZ = playerA--;)
    for (
        // create trunk
        entities.push({
          c: [i = 12, 60, 30],
          x: X = Math.sqrt(playerA) * 12 * Math.cos(playerA) + Math.random() * 12,
          h: 1,
          y: Y = Math.random() * 3 - 1,
          z: Z = Math.sqrt(playerA) * 12 * Math.sin(playerA) + Math.random() * 12,
          s: 2,
          S: Y * 2 + 16
        });
        i--;
        // create leaf
        entities.push({
          c: [150, 60, i * 2],
          x: X + f * Math.cos(e = Math.random() * 7),
          z: Z + f * Math.sin(e),
          h: 860,
          y: Y - i / 2 + 10,
          s: 8
        })
    )
      // create fallen fruit
      f = Math.random() * 7,
      i % 2 || entities.push({
        c: [50, 60, i * 2],
        x: X + f * Math.cos(e = Math.random() * 7),
        z: Z + f * Math.sin(e),
        h: 860,
        y: -8,
        s: 1
      });
// burn a leaf (doubles as object for active keys)
entities[30].p = burn = function (e, f) {
  // update fire
  e.h--;
  e.c = [Math.random() * 60, 100, 0],
  e.s = Math.random() * 5 + 6,

  // create smoke / fireworks
  s % 16 || entities.push({
    c: [0, 0, e.w ? -30 : 10],
    x: e.x + Math.random() * 6,
    y: e.y,
    z: e.z,
    h: 90,
    v: 60,
    p:
      s ? function (e, f) {
        e.h--;
        e.y += .5
      } : function (e, f) {
        e.h--;
        e.c = [Math.random() * 60, 100, 0],
        e.h < 12 ? e.s += 3 : e.y += 3
      },
    s: 4
  });

  // spread fire
  entities.some(function (f) {
    return(s % 300 || f.s == 8 && Math.abs(e.x - f.x) + Math.abs(e.z - f.z) < 40 && Math.random() * 50 < 1 && (f.p = burn))
  });

  e.w = 0
};

```

为了减少代码占用的空间，作者大量使用了单字母的变量名与属性名，比如`entities.c`，`entities.x`等等，代码可读性非常差。

浏览一遍，我们是根本看不出上面这些变量是什么含义了。

但是，我们能够确定的是，这段代码初始化了`playerA`，`playerX`，`playerZ`变量，然后把所有的对象设定好属性后都存入了`entities`数组中，包括树干，树底下的水果，还有树干等等。没办法，只能先跳过这部分了。

#### 用户交互

这是代码中主管用户交互的代码：

```javascript
onkeydown = onkeyup = function (e, f) {
  burn[e.keyCode - 32] = e.type[5]
};
```

蛤？就这么短？

...

**真是这么短。**

上面这段代码，看着更像是定义了onkeydown跟onkeyup俩函数，后面理应还有类似于addEventListener之类的语句将这个函数绑定给某个元素某个事件的代码。因为身为前端，我们早已习惯绑定事件的那几种套路：

```javascript
DomEl.addEventListener(eventname, callback); // webkit
DomEl.attachEvent(eventname, callback); // IE
$.bind(eventname, callback); // jQ
// ...
```

可是任凭老司机怎么 Ctrl+f 搜索代码，也并没有找到所谓的绑定事件的语句。

事实上，作者在定义这两个函数的时候，并没有使用var关键字。意味着，这后面定义的变量，是直接挂在window下的。那么凭空定义的这两个函数，就分别会变成 `window.onkeydown` 和 `window.onkeyup` 。没错，这就是我们**极度不推崇的绑定回调的方式**了。

回调函数的内容，是在用户按下按键的时候将burn中下标为 `keyCode - 32` 的属性设定为 `keydown` 或者 `keyup` 的第六个字母，也就是 `w` 或者 `undefined` 。这个做法十分精妙，下面举例说明。

假设我们按下了空格键（keyCode=32），执行 `onkeydown` 函数，`burn[0] = 'w'`；而放手的时候，则执行 `onkeyup` 函数， `burn[0] = undefined` 。这样一来，在事件循环里面只需要判断`burn[0]`是`true`还是`false`，就可以知道空格键按下了没有。同理，`burn[5]`，`burn[6]`，`burn[7]`，`burn[8]`分别代表了左，上，右，下键的状态。

可是，印象中burn是个函数呀，`entities[30].p = burn = function (e, f) {...}`，怎么就用来表示按键状态了呢？目的只能有一个，省下一个声明变量的语句。

**为了省下多几个字符，程序员真是什么事都做得出来啊...**

#### 事件循环

终于到了事件循环部分了。这部分代码占了源码大概一半的篇幅。折叠后，代码结构大概是这样的：

![事件循环](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-eventloop.png)

结构大概清晰了：首先是玩家的移动，接着是水枪的处理，紧接着是背景天空森林地板的渲染。

每个事件循环一开始，先是移动玩家。
```javascript
// move player
playerA += (!!burn[7] - !!burn[5]) / 20,
playerX += (e = !!burn[6] - !!burn[8]) * Math.sin(playerA),
playerZ += e * Math.cos(playerA),
```

理解了用户交互部分的内容，这里就很好理解了。burn[5]与burn[7]分管左右两键，那么`playerA`很明显就是用户的朝向。而burn[6]与burn[8]分管前后，在经过换算后，我们很快也就能知道`playerX`与`playerZ`分别是玩家在**x-z平面上**的坐标。别忘了这游戏可是3D的，所以并不用x-y坐标系。

接下来是水枪的代码：

```javascript
// discharge water
burn[0] && entities.push({
  c: [200, 60, -5 * Math.sin(s)],
  x: playerX + 12 * Math.cos(playerA),
  z: playerZ - 12 * Math.sin(playerA),
  e: playerA - .5,
  s: 2,
  h: 20,
  p: function (e, f) {
    e.h--;
    e.x += 2 * Math.sin(e.e),
    e.z += 2 * Math.cos(e.e),
    e.y = 5 - (e.h / 2 - 5) * (e.h / 2 - 5) / 2,
    entities.some(function (f) {
      f.p == burn && Math.abs(e.x - f.x) + Math.abs(e.z - f.z) < e.s / 2 + f.s / 2 && (
        f.h -= f.w = 9
      )
    });
  }
});
```

只要空格被按下，就会有新的对象被插入`entities`数组中。不过既然是水枪的代码，我们很容易可以想到，这里插进去的对象正是水流。

水流浇到火上是可以灭火的，所以下面这段带有一堆abs的代码，十有八九是用来**判断水流跟火焰的位置关系**的。

```javascript
entities.some(function (f) {
  f.p == burn && Math.abs(e.x - f.x) + Math.abs(e.z - f.z) < e.s / 2 + f.s / 2 && (
    f.h -= f.w = 9
  )
});
```

后面可以证明我们的猜测并没有错。另外，这段代码最后的&&符号后面的代码，就是灭火的处理函数了。

遍历数组，我们一般是用`forEach`，而作者在这个例子中全都是用`some`来做的。我猜作者并没有别的用意，纯粹是因为长度的原因。所以我觉得这里使用`map`应该更好。

接下来是一些零散的处理。

```javascript
// prepare canvas
c.translate(90, (a.height += 0) / 2 - 120 | 0);

// update entities
entities.some(function (f) {
  f.p && f.p(f)
});
```

首先是平移了画布，其次是遍历对象数组，执行对象的p函数。这样一来就很清晰了。对象的**属性p，就是在每个事件循环中处理对象的函数**。

```javascript
// draw sky
for (i = 30; i--;)
  c.fillStyle = 'hsla(' + [160, 60 + '%', 50 + i + '%', 1],
  c.fillRect(0, i * 4, 320, 4);
```

接下来，作者巧妙地用**循环 + hsla**渲染了一个带渐变色的天空。

```javascript
// remove entities no longer needed
entities = entities.filter(function (e, f) {
  return(e.h > 0)
});
```

这段代码过滤掉了对象数组中h属性不大于0的对象。

回想一下，我们前面看到的每种对象的p函数，都带着h--，而p函数在每个事件循环都会执行。那么这个h属性表示的就是对象的寿命了。这个事件循环的间隔是33ms，也就是30h相当于1秒。

```javascript
// draw background forest
for (i = 30; i--;)
  c.fillStyle = 'hsla(' + [160, 60 + '%', 10 + i + '%', 1],
  c.fillRect(0, 220 - i * 4, 320, 4);

// sort entities by distance from the screen
entities.some(function (f) {
  f.Z = (f.x - playerX) * Math.sin(playerA) + (f.z - playerZ) * Math.cos(playerA)
});
entities.sort(function (e, f) {
  return(f.Z - e.Z)
});

// draw ground
for (i = 30; i--;)
  c.fillStyle = 'hsla(' + [10 + 60, 60 + '%', 50 + i + '%', 1],
  c.fillRect(0, 236 - i * 4, 320, 4);
```

接下来的这部分，前面的画背景与后面的画地板还是跟前面一样的套路，分别使用循环来绘制带渐变色的森林与地板。可是中间这段是什么鬼？

根据注释说明，这个部分是将Z属性设置为对象到屏幕的距离，随后做了一次从近到远排序。

至于对象到屏幕的距离如何计算，这里直接画图说明，就不再赘述。

![计算距离](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-calcdist.jpg)

```javascript
  // draw entities
  entities.some(function (f) {
    !f.v && f.Z > 160 || f.Z < 8 ||
    Math.abs(e = (f.x - playerX) * Math.cos(playerA) * 160 / f.Z - (f.z - playerZ) * Math.sin(playerA) * 160 / f.Z) < 160 && (
      c.fillStyle = 'hsla(' + [f.c[0], f.c[1] + '%', f.Z / 6 - f.c[2] + 46 + '%', f.S ? 1 : .8],
      c.fillRect(
        160 + e - f.s * 160 / f.Z / 2,
        120 - f.y * 160 / f.Z - (f.S || f.s) * 160 / f.Z / 2,
        f.s * 160 / f.Z,
        (f.S || f.s) * 160 / f.Z
      )
    )
  });
```

接下来的这段代码就是这个游戏的灵魂所在了。

这是一个遍历entities数组的操作。以 `||` 符号分割，这个操作可以分为三个部分：

1. `!f.v && f.Z > 160`
2. `f.Z < 8`
3. `Math.abs(...) < 160 && (...)`

语句1跟2只要有一个成立，语句3就不会被执行。语句1跟2也很好理解，主要是判断对象跟屏幕之间的距离是不是处在(8, 160)的区间内，如果不是就直接跳过该对象。

这里有一个例外情况，在距离大于160的情况下，如果对象带有v属性则还是可以继续后面的判断的。纵观整个代码，带有v属性的只有前面提到的烟雾以及烟花。这就说明烟雾与烟花就算是在160距离开外，依然是可以看到的，事实上也的确如此。


语句3被 `&&` 符号分割为了两部分：

1. `Math.abs(e = (f.x - playerX) * Math.cos(playerA) * 160 / f.Z - (f.z - playerZ) * Math.sin(playerA) * 160 / f.Z) < 160` 
2. `(c.fillStyle='...',c.fillRect(...))`

语句1中的比较，转换为代数式，经过简单的代数变换后，可以变为：

`dx*cos(α) - dz*sin(α) < f.Z`

结合刚刚的图，这个语句意义就是指，线段a需要小于f.Z。而从图上我们可以知道，线段a就是对象投影在屏幕上后与玩家的距离。这样一来，**视角90°**以外的对象就不会被渲染了。

![参考图](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-example.jpg)

语句2就是渲染对象的语句了。看到这里的`fillStyle`函数我们才明白，前面所定义的`f.c`属性，其实就是定义了对象颜色的hsl值。另外，从`fillRect`函数的传参情况来看，也很容易看出`f.y`指的就是对象的y坐标，`f.s`表示对象的宽高，而`f.S`则是在绘制树干的时候作为对象的高度来使用。

#### 再回首

现在我们对这段代码有大概的理解了，是时候回头看一看了。

首先是创建对象的部分，此处开了两重循环，种下了256课树，每棵树分别有一根树干，12个对象组成的叶子，另外地上有6个果实。

![树](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-tree.png)

接下来，第30棵树被恶意纵了火（将`f.p`设置为`burn`函数），第一棵着火的树还会发出一个烟花作为信号。而由于每一帧最后都有`s--`语句，这个`s`被作为一个计数器，让着火的树每16帧发出一个烟圈。

![烟雾](//misc.aotu.io/Littly/2016-12-04-firewatcher-appreciation-smoke.png)

过后，就是熟悉的与用户交互的环节了。这部分已经十分清晰，就不再赘述。

### 写在最后

这段代码虽然短，却是麻雀虽小五脏俱全。实现了游戏的基本功能不说，有一些小细节也是让我大吃一惊。比如树着火时冒出的烟，在普通情况下是深灰色的，而在被水枪浇到的时候，会变成浅灰色；又比如寿命的设定，使树叶在着火之后一段时间会被烧完。

在编程思想上，作者也是很有见地。使用entities数组存储所有对象的信息，给每种对象一个变换函数，这本身就有粒子的思想在其中。此外，`setInterval`的使用，则是再正常不过的事件循环机制的实现。

编程手法就不用多说了。比如各种利用`some`函数代替`forEach`来省字数，又或者是利用`burn[e.keyCode - 32] = e.type[5]`来判断按键的状态......作者是老司机，这一点是没跑了。

这段代码构思巧妙，思路行云流水...类似的溢美之词说再多也没用。更关键的是，我们**干前端这一行的，绝对不只是jQ，选择器，或者node小工具**。偶尔看一看别人的代码，还是能够学到很多意想不到的知识的。

### 参考资料

* js1k官网 [http://js1k.com](http://js1k.com)
* js1k规则页 [http://js1k.com/2016-elemental/rules](http://js1k.com/2016-elemental/rules)
* Romanesco 2.0 [http://js1k.com/2016-elemental/demo/2552](http://js1k.com/2016-elemental/demo/2552)
* Voxeling [http://js1k.com/2016-elemental/demo/2497](http://js1k.com/2016-elemental/demo/2497)
* Firewatch [http://js1k.com/2016-elemental/demo/2512](http://js1k.com/2016-elemental/demo/2512)
* Firewatch 源码 [http://js1k.com/2016-elemental/details/2512](http://js1k.com/2016-elemental/details/2512)