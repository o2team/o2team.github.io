---
title: 3D 沙盒游戏之人物的点击行走移动
subtitle: 讲述实现“点击地面，人物移动到点击处”功能，需要的前置条件及其具体实现思路、步骤
cover: https://img10.360buyimg.com/ling/jfs/t1/164213/26/22846/233034/625fb53bE076fcac0/d1679972049705f3.jpg
categories: Web开发
tags:
  - 3D
  - 3D模型
author:
  nick: 赛米老冯
  github_name: sm450203924
date: 2022-04-20 16:16:00
wechat:
  share_cover: https://img12.360buyimg.com/ling/jfs/t1/195291/33/23550/129115/625fb53bE7f03d831/457bd45709999821.jpg
  share_title: 3D 沙盒游戏之人物的点击行走移动
  share_desc: 讲述实现“点击地面，人物移动到点击处”功能，需要的前置条件及其具体实现思路、步骤
---
# 3D 沙盒游戏之人物的点击行走移动

在 3D 游戏中，都会有一个主人公。我们可以通过点击游戏中的其他位置，使游戏主人公向点击处移动。

那当我们想要实现一个“点击地面，人物移动到点击处”的功能，需要什么前置条件，并且具体怎么实现呢？本文带大家一步步实现人物行走移动，同时进行状态改变的功能。

<br >

## 一、骨骼动画

**骨骼动画**（Skeleton animation 又称骨架动画，是一种计算机动画技术，它将三维模型分为两部分：用于绘制模型的蒙皮（Skin），以及用于控制动作的骨架。

一般在 3D 游戏中的主人公，它的跑步、走路、站立的动作，都是模型文件的自带骨骼动画。

**骨骼动画权重**
改变骨骼动画的权重，可以使得动画间的过渡更为自然。比如体测时，当你到达终点后，会逐渐减慢速度，跑步动作的幅度越来越小，然后变成走路，最后停止。

让我们看看一个俩动作权重渐变的例子：
![](https://img12.360buyimg.com/ling/jfs/t1/179436/33/21869/341962/6232a39fE84b9bb52/79c7153ffb05ae6d.jpg)

这个例子中，从休闲变到走路，休闲动画的权重从1到0递减，同时走路动画的权重从0到1递增。可以的点击👉 [这个网站中 > Crossfading > from idle to walk](https://threejs.org/examples/webgl_animation_skinning_blending.html) 体验一下。

在本次 3D 沙盒游戏中，人物状态改变，主要是鼠标点击地面后，人物从休闲状态转为跑步状态，当人物到达目的地后，又变为休闲状态。我们先来看看这些状态改变是如何实现的。

首先，我们需要设计师提供一个拥有骨骼动画的模型，它有两个骨骼动画，一个为休闲（idle）状态，一个为跑步（run）状态。


### 1.1 思路
![](https://img13.360buyimg.com/ling/jfs/t1/116318/38/21155/86770/6231fdf4Edf23a55b/87756695ee6da7a8.png)

<br >

### 1.2 动画初始化
先让我们将骨骼动画、动画名称、权重放到一个对象中存储起来，
```
idleAnimConfig = {
  name: string;
  anim: AnimationGroup;
  weight: number;
}
```

那么如何判断是否正在行走呢？就需要一个当前动画的 flag，初始化时将 idle 设为当前动画
```
currentAnimConfig = idleAnimConfig
```

<br >

### 1.3 动画权重改变
![](https://img12.360buyimg.com/ling/jfs/t1/110333/9/24874/105276/6231fdf4E97464f9a/61be4c2bfce2dd65.png)

如图，我们在人物状态改变时，需要将当前状态的动画权重递增，另一状态的动画权重递减（注意，权重值需要限制在[0, 1]）。让我们看下伪代码，假设 `deltaWeight` 为正数
```
changeAnimWeight() {
  // 当前动画 -> 递增
  if (currentAnimConfig) {
    setAnimationWeight(currentAnimConfig, deltaWeight)
  }
  // 其他动画 -> 递减，如站立动作切换到走路
  if (currentAnimConfig !== idleAnimConfig) {
    setAnimationWeight(idleAnimConfig, -deltaWeight)
  }
  // 其他动画 -> 递减，如走路动作切换到站立
  if (currentAnimConfig !== runAnimConfig) {
    setAnimationWeight(runAnimConfig, -deltaWeight)
  }
}
```

然后在 render 的时候，进行状态切换
```
onRender() {
  if (准备到达目的地) {
    setCurAnimation(runAnimConfig)
  } else {
    setCurAnimation(idleAnimConfig)
  }

  changeAnimWeight()
}
```

<br >

### 1.4 缺少动画
如果 animationGroup 里只有一个 run 动画怎么办呢？
答案还是一样的，只要将 idle 动画的骨骼动画设为 `null` 即可，像这样：
```
idleAnimConfig = {
  name: string;
  anim: null;
  weight: number;
}
```
这么做即使后来更换了具有两个动画的人物模型，也能复用。

<br >

**动画状态切换实现效果**

![](https://storage.360buyimg.com/model-rendering-tool/sammy/weight-compress.gif)


<br >
<br >

## 二、行走移动

当我们平常写动画时，会用到 rAF 并递归调用渲染函数，实现一个逐帧渲染动画。当人物行走在平地上时，也可以利用逐帧移动，来实现一个位移的动画。例如 Babylon 已经封装好了[ render 的事件 API](https://doc.babylonjs.com/typedoc/classes/babylon.scene#onbeforerenderobservable)，只要我们将渲染动画绑定 render 事件，就可以使用了。

让我们看看具体思路：
![](https://img30.360buyimg.com/ling/jfs/t1/167606/20/27171/149922/6232a6b0E8ba7f07c/ec0f1456ca4f46cb.jpg)

<br >

### 2.1 移动
由上面的思路可以看出，我们移动的时候需要用到几个变量：
- 距终点的距离（distance）
- 移动的方向（direction）

那么就需要在点击的时候，获取到这些变量。distance 可以利用矩阵对应坐标相加减计算，direction 就是目标位置减初始位置的法向量
```
directToPath() {
  // 将人物的位置设为初始位置
  initVec = this.player.position
  // 计算初始位置与终点的距离
  distance = Distance(targetVec, initVec)

  // 将终点位置与初始位置相减
  targetVec = targetVec.subtract(initVec)
  // 使用法向量计算出与终点的朝向
  direction = Normalize(targetVec)

  player.lookAt(targetVec)
}

onClick() {
  // ...
  directToPath()
}
```

在 render 的时候进行位移
```
onRender() {
  if (distance > READY_ARRIVE) {
    distance -= SPEED

    // 人物朝 direction 方向移动 SPEED 距离
    player.translate(direction, SPEED, Space.WORLD)
  }
}
```

<br >

**位移实现效果**

![](https://storage.360buyimg.com/model-rendering-tool/sammy/move-compress.gif)

<br >


### 2.2 结合动画

当我们的移动结合模型的骨骼动画

![](https://img10.360buyimg.com/ling/jfs/t1/216623/9/14893/72162/62316f4aEe4ef8765/a26bf421f1afd443.jpg)

让我们看看伪代码：
```
onRender() {
  if (distance > READY_ARRIVE) {
    distance -= SPEED

    // 人物朝 direction 方向移动 SPEED 距离
    player.translate(direction, SPEED, Space.WORLD)

    setCurAnimation(runAnimConfig)
  } else {
    setCurAnimation(idleAnimConfig)
  }

  changeAnimWeight()
}
```

<br >

**位移及状态变化实现效果**

![](https://storage.360buyimg.com/model-rendering-tool/sammy/move-weight-compress.gif)

<br >
<br >

## 三、人物避障
### 3.1 思路
人物行走避障，实际上就是从起点到终点，在这之中添加了**中间点**。如图
![](https://img10.360buyimg.com/ling/jfs/t1/159290/12/28563/39510/6231f996Ed1b5d277/68c408d3cd39fbe6.png)

所以我们只要记录下当前起点到终点这个路径数组，每次都朝数组的第N个点行走，就能做到转向。下面我们来根据思路及伪代码进行步骤细化。

<br >

(1) 记录路径和初始化当前的路径索引
```
path = getPath(targetVec)
prePathIdx = 0
```

(2) 当到达当前中间点时，切换到下一个中间点。当走到最后一个，则停止
```
onRender() {
  if (distance > READY_ARRIVE) {
    // ...移动及动画权重切换...
  } else {
    switchPath()
    // ...
  }
  // ...
}

switchPath() {
  prePathIdx += 1
  directToPath()
}

directToPath() {
  const curPath = path[prePathIdx]
  if (!curPath) return

  // ...人物移动及转向...
}
```

<br >


### 3.2 接入实际避障算法
由 **3.1** 得知，人物的行走移动要接入避障算法，需要利用到该算法提供的路径规划数组。实际应用中，我们只需要把，伪代码里的`getPath()`方法，换成算法计算道路的方法即可。


#### 3.2.1 RecastJSPlugin
下面我们使用 Babylon 自带的 [Recast 插件](https://doc.babylonjs.com/extensions/crowdNavigation) ，来具体说明一下如何接入避障算法。


**方法 1**

在 recast 中，可以通过 `computePath` 获取路径：
```
const closestPoint = this.navigationPlugin.getClosestPoint(pickedPoint)
const path = this.navigationPlugin.computePath(
  this._crowd.getAgentPosition(0),
  closestPoint
)
```
然后利用 **3.1** 的思路，通过路径索引切换进行移动。

<br >

**方法 2**

recast 首先会创建一个导航网格，然后通过添加 `agent` 让它们约束在这个导航网格中，而这些 `agent` 的集合，称为 `crowd`。

并且 recast 自带了移动的 API —— `agentGoto`，此时可以不需要再去计算距离和方向，并且也不需要手动切换移动路径，让我们看看具体是怎么做的。

(1) 初始化插件，并设置 Web Worker 来获取网格数据以优化性能
```
initNav() {
  navigationPlugin = new RecastJSPlugin()

  // 设置Web Worker，在里面获取网格数据
  navigationPlugin.setWorkerURL(WORKER_URL)

  // 创建导航mesh
  navigationPlugin.createNavMesh([
    ground,
    ...obstacleList, // 障碍物列表mesh
  ], NAV_MESH_CONFIG, (navMeshData) => {
    navigationPlugin.buildFromNavmeshData(navMeshData)
  }

  this.navigationPlugin = navigationPlugin
}

```

(2) 初始化 crowd（crowd：约束在导航网格中 `agent` 的集合）
```
initCrowd() {
  this.crowd = this.navigationPlugin.createCrowd(1, MAX_AGENT_RADIUS, this.scene)

  const transform = new TransformNode('playerTrans')
  this.crowd.addAgent(this.player.position, AGENTS_CONFIG, transform)
}
```

(3) 点击时利用 `agentGoto` API进行移动，`pickedPoint` 为点击点的三维坐标，由于 crowd 里只有一个对象，所以索引是 0
```
const closestPoint = this.navigationPlugin.getClosestPoint(pickedPoint)
this.crowd.agentGoto(0, closestPoint)
```

(4) 判断是否停止，未停止则改变人物朝向

那么如何改变人物的朝向呢，我们需要下一个中间点的位置，让人物看向它即可。
所以回到之前初始化的地方，创建一个 `navigator`。
```
initCrowd() {
  // ...

  const navigator = MeshBuilder.CreateBox('navBall', {
    size: 0.1,
    height: 0.1,
  }, this.scene)
  navigator.isVisible = false
  this.navigator = navigator

  // ...
}
```

在 render 的时候，人物是否停止，可以通过当前 `agent` 的移动速度来进行判断。而改变方向，则是通过将 `navigator` 移动到下一个 `path` 的中间点，让人物看向它。

```
onRender () {
  // 第一个agent对象的移动速度
  const velocity = this.crowd.getAgentVelocity(0)

  // 移动人物到agent的位置
  this.player.position = this.crowd.getAgentPosition(0)

  // 将navigator的位置移到下一个点
  this.crowd.getAgentNextTargetPathToRef(0, this.navigator.position)

  if (velocity.length() > 0) {
    this.player.lookAt(this.navigator.position)
    // ...
  } else {
    // ...
  }

 // ...
}
```

<br >


**4. 避障实现效果**

让我们看看最后的效果

![](https://storage.360buyimg.com/model-rendering-tool/sammy/obstacle-compress.gif)

<br >

**5. 遇到的问题**

整个开发过程中，其实也不是非常顺利，总结了一些遇到的问题，可以给大家参考一下。

(1) 年兽移动时，有时会“无法刹车”，导致在终点时反复来回停不下来；
这是因为在这一帧里，由于年兽的加速度较小，无法使得短时间内将速度降为0。所以只能“走过头”再“走回来”直到速度降为0之后，停止在终点。
此时，只需要 hack 一下，将 agent 的 maxAcceleration 设为极大，让其有种匀速行走并立马停下的感觉。
```
export const AGENTS_CONFIG: IAgentParameters = {
  maxAcceleration: 1000
  // ...
}
```

<br >

(2) 障碍物的动态添加与移除

如果障碍物在该场景初始化后，位置发生了改变，此时再去销毁创建一次 navMesh 是很消耗性能的。

于是我们通过查找文档，看到还有[动态添加障碍物](https://doc.babylonjs.com/extensions/crowdNavigation/obstacles)的 API。再立马调了下[文档中的Playground](https://playground.babylonjs.com/#WCSDE1#25)，发现是可以用的。但是当我们把障碍物放大了之后，穿模了👉 [看看这里](https://playground.babylonjs.com/#WCSDE1#27)。

于是在 Babylon 的论坛上提了[这个问题](https://forum.babylonjs.com/t/recastjsplugins-obstacles-api-fails-when-the-obstacle-is-big/28469)，20分钟后就得到了 reply，这个速度👍。

原来是需要调整 `NavMeshParameters` 的 `ch` / `cs` / `tileSize` 参数，对项目做适配。

那如果想要自己实现避障，创建更快的navMesh，我们应该怎么做呢？可以看看这篇文章：[3D 沙盒游戏之避障踩坑和实现之旅](https://mp.weixin.qq.com/s/wqlUD6gQfnZGbpebSKcovg)

<br >

## 总结
这篇文章，我们从骨骼动画的介绍及使用、模型的移动及状态改变、路径规划的适配三个方面，讲解了3D沙盒游戏中实现人物行走移动并进行状态改变的思路及步骤，希望新人阅读结束之后，能更快上手这个功能。

当然，本篇文章介绍的实现方式还仍有不足之处，比如移动可以加上加速度，让动作与移动速度匹配得更自然等。

如果还有什么合适的建议，也欢迎大家积极留言交流。

<br >


## 参考资料
1. [骨骼动画 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E9%AA%A8%E9%AA%BC%E5%8A%A8%E7%94%BB)
2. [Grouping Animations | Babylon.js Documentation](https://doc.babylonjs.com/divingDeeper/animation/groupAnimations)
3. [Advanced Animation Methods | Babylon.js Documentation](https://doc.babylonjs.com/divingDeeper/animation/advanced_animations)
4. [Vector3 | Babylon.js Documentation](https://doc.babylonjs.com/typedoc/classes/babylon.vector3)
5. [Crowd Navigation System | Babylon.js Documentation](https://doc.babylonjs.com/extensions/crowdNavigation)
6. [Web Workers API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API)
7. [Make crowd agent move at constant speed - Questions - Babylon.js](https://forum.babylonjs.com/t/make-crowd-agent-move-at-constant-speed/19739)

