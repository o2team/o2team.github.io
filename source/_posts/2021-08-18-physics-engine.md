title: 不懂物理的前端不是好的游戏开发者（一）—— 物理引擎基础
subtitle: 逐步解析游戏物理引擎开发过程
cover: https://img10.360buyimg.com/ling/jfs/t1/203423/24/1925/585678/611cb771Ee5c95c82/a30911afa53e7f35.jpg
categories: 技术探索
tags:
  - 物理引擎
  - 游戏开发
author:
  nick: 小波老师
  github_name: TTImmortal
date: 2021-08-18 15:30:44
wechat:
  share_cover: https://img12.360buyimg.com/ling/jfs/t1/180178/36/18881/189157/61148e16E55cfbfc8/6d7a392aac0e37a3.jpg
  share_title: 不懂物理的前端不是好的游戏开发者（一）—— 物理引擎基础
  share_desc: 逐步解析游戏物理引擎开发过程
---

### 概述
游戏现在似乎已经成为了大家绕不开的一个娱乐方式，从大型端游到手游，到页游，再到各种 APP 里面的 H5 小游戏，它以各种方式入侵了我们的生活。那么在享受游戏的同时，作为一名前端开发，也开始思考如何开发一款游戏，在技术层面它应当具备什么？

除了基本的游戏画面、动效开发、渲染功能，还有一项值得探究的东西，那就是物理引擎。一个好的物理引擎，保证了游戏内的交互体验和现实中相似，给人提供了更优质的体验。现在好用的物理引擎有很多，大部分都是开箱即用，但物理引擎的基础和底层逻辑是什么样子的，可能有些人并不了解。从这期开始我们将分多个部分介绍物理引擎的基础，让大家对此更加了解。以下的内容部分参考自《游戏物理引擎开发》。

### 何为引擎
引擎是什么？当然这里是延展了汽车中引擎的概念。在汽车中，引擎——一种能量转换的装置，将其他能变为机械能提供给汽车，是汽车能够运动的核心模块。

那对应的，在开发当中的引擎是什么呢？在我的理解中，是一个可以将一个个功能快速加入到项目中，并且保证功能运转的核心模块。渲染引擎，就能够快速实现内容的渲染。游戏引擎，就能够快速实现一个游戏的基础开发。而物理引擎，就是可以快速模拟现实中物理状态。

了解完引擎是什么之后，我们可以再来关注一下，引擎有什么特点。引擎最大的特点就是两个——**快速**，**通用**。它能够快速实现需要的功能，并且有很强的通用性，它并非是针对某个专门的业务开发的，而是针对一大类情况进行开发，所以必须拥有强大的通用性。

快速意味着需要做到功能完善，API 封装完整，使用便捷。通用意味着代码本身的逻辑需要足够底层，应用最基本的逻辑才能做到最大的通用性。

### 物理引擎的基础
一个物理引擎的基础是什么呢？那就是物理和数学。其实一个物理系统在游戏中的体现是整个物理系统内各个对象的位置。每一帧都需要计算物体的位置，使得他们能出现在正确的地方。所以符合物理学规律的数学运算，是一个物理引擎的基础。我们下面的一切都是以此为依据来进行阐述的。

### 代码中的数学
首先要看一下，在游戏世界中，数学在哪些地方起到了作用。无论是在二维还是三维的世界中，针对对象的位置的描述都是由向量来完成的。而向量的处理，免不了的就是向量本身的一些分解、加减、点积、向量积等知识。

所以我们要先建立一个最基础的向量类：
```ts
class Vector {
  x: number
  y: number
  z: number
  constructor(x: number,y: number,z: number) {
      this.x = x
      this.y = y
      this.z = z
  }

  setX(x: number) {
    this.x = x
  }

  setY(y: number) {
    this.y = y
  }

  setZ(z: number) {
    this.z = z
  }
}
```
向量的分解，应用的是三角函数的内容，将一个向量通过角度分解到 x 轴、y 轴、z 轴，或者根据不同轴上的坐标来计算对应的角度。
<center>
    <img src="https://img10.360buyimg.com/ling/jfs/t1/187655/26/15116/36501/60fe5e98E34fe5aa7/0ed9686b387c2d38.png" width=400>
    </img>
    <p>三角函数</p>
</center>

而向量的计算原理，就不仔细阐述了。在游戏世界中，最后都会被分解到对应坐标轴的方向进行计算，即便是点积或者向量积也不例外。所以只要熟练运用三角函数和向量计算公式，就能够进行向量的处理了。

我们将给向量增加以下计算方法：
```ts
class VectorOperation {
  add (vectorA: Vector, vectorB: Vector) { //  向量相加
    return new Vector(
        vectorA.x + vectorB.x,
        vectorA.y + vectorB.y,
        vectorA.z + vectorB.z
    )
  }

  minus (vectorA: Vector, vectorB: Vector) { // 向量相减
    return new Vector(
        vectorA.x - vectorB.x,
        vectorA.y - vectorB.y,
        vectorA.z - vectorB.z
    )
  }

  multiply (vectorA: Vector, times: number) { // 向量缩放
    return new Vector(
        vectorA.x * times,
        vectorA.y * times,
        vectorA.z * times
    )
  }

  dotProduct (vectorA: Vector, vectorB: Vector) { // 向量点积
    return vectorA.x* vectorB.x + vectorA.y* vectorB.y + vectorA.z* vectorB.z
  }

  vectorProduct (vectorA: Vector, vectorB: Vector) { // 向量外积
    return new Vector(
      vectorA.y * vectorB.z - vectorA.z * vectorB.y,
      vectorA.z * vectorB.x - vectorA.x * vectorB.z,
      vectorA.x * vectorB.y - vectorA.y * vectorB.x,
      )
  }
}
```

而在游戏物理学中，还需要用到一门很重要的数学知识，那就是微积分。

这么说大家可能体会不到，都是一些基础的物理内容，为什么会用到微分和积分呢？来举个例子，先看看最基本的速度公式，先从平均速度开始，是经过的路程除以经过的时间：
$$ v = \frac {s_{1} - s_{0}}{t_{1} - t_{0}} \tag{平均速度}$$

然后是某个时刻的速度的计算，其实就是在平均速度的基础上，将时间差缩小到无穷小：
$$ v = \lim_{\Delta t \to 0} \frac {\Delta s}{\Delta t} = \frac{ds}{dt} \tag{速度}$$


<center>
    <img src="https://img11.360buyimg.com/ling/jfs/t1/185224/37/20023/79749/611cb271E555947b1/fb03f04909f34df0.png" width=400>
    </img>
    <p>微分的原理</p>
</center>

这就是微分的应用。那么积分的应用呢？

再来看看最基本的速度和路程的公式，在匀速运动中的公式如下，其中 t 为运动时间：
$$ s_{1} = s_{0} + v_{0}t \tag{匀速运动}$$

其实这个公式的本质应该是：
$$ s_{1} = s_{0} + \int_{t_{0}}^{t_{1}}v_{0}dt \tag{匀速运动}$$

以上只是微积分的简单应用，说明了在游戏中微积分的使用也十分重要，那么我们在代码中也应该加入对应的方法。

### 物理基础

在一个虚拟的世界里面，我们要是想要获得和现实一样的体验，也必然要遵循现实中的物理法则，不可能出现苹果朝天上飞的状况。由此我们先来构建一个模拟真实环境的对象。

在物理引擎中，一个物体应该具有什么样子的属性呢？最重要的就是上文提到的位置信息，那么对应的，是改变位置的信息，也就是速度。随之又引出了一个值，那就是改变速度的信息，也就是加速度了。在这样的基础上，我们可以得到一个最基本的物体所应该拥有的属性：

```ts
class GameObj {
  pos: Vector
  velocity: Vector
  acceleration: Vector

  constructor(pos?: Vector, velocity?: Vector, acceleration?: Vector) {
      this.pos = pos || new Vector(0, 0, 0)
      this.velocity = velocity || new Vector(0, 0, 0)
      this.acceleration = acceleration || new Vector(0, 0, 0)
  }

  setPos (pos: Vector) {
    this.pos = pos
  }

  setVelocity (velocity: Vector) {
    this.velocity = velocity
  }

  setAcceleration (acceleration: Vector) {
    this.acceleration = acceleration
  }
}
```

我们现在拥有了最基本的一个物体，想要使这个物体融入物理体系由我们任意操作，就需要将物体与力结合在一起。而结合两者的，正是牛顿三大定律。

首先是牛顿第二定律，作用力可以改变物体的运动状态。用一个简单的公式表达就是：

$$ \vec F = m\vec a \tag{牛顿第二定律}$$

那也就是说，我们要结合加速度和力的话，需要给物体一个变量，那就是质量 m。那我们给上述对象再添加上质量属性：

```ts
class GameObj {
  mess: number // 质量不得为 0

  constructor(mess?: number) {
    if (mess > 0) {
      this.mess = mess
    }
  }

  setMess (mess: number) {
    if (mess > 0) {
      this.mess = mess
    }
  }
}
```

但是这个时候我们会有两个问题：第一，物体的质量不能为0，如果设置了0，就会导致质量设置出错；第二，某些物体，我们需要它有着无穷大的质量，比如地面，墙体，我们是需要它在游戏场景中保持固定的。那么一方面是不允许出现的0，另一方面是难以设置的无穷大，应该怎么办呢？

在游戏物理学中提出了一个概念，叫做逆质量，巧妙的解决了这个问题。逆质量其实就是质量的倒数，也就是 $\frac{1}{m}$,这样的话，我们只需要将需要固定的物体的逆质量设置为0就可以使其的质量无穷大了，并且也避免了质量设置为0的情况。

```ts
class GameObj {
  inverseMess: number // 质量不得为 0

  constructor(inverseMess?: number) {
    if (inverseMess >= 0) {
      this.inverseMess = inverseMess
    }
  }

  setInverseMess (inverseMess: number) {
    if (inverseMess >= 0) {
      this.inverseMess = inverseMess
    }
  }
}
```

### 结语
到这里为止，我们所需要的最基础的数学和物理知识已经成功的被注入了物理引擎中，但是这仅仅是一个物理引擎的基石，在此基础上，我们还要添加各种各样的东西，比如重力、阻力、动量、角动量、碰撞等等一系列的内容。在这后面还有很长的路要走，我将会在这个系列中一一展示。

