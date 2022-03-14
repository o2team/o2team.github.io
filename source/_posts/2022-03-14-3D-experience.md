title: Web3D 从入门到跑路 · 3D 初体验
subtitle: Hey 3D what's up，最近在Web圈混得怎样
cover: https://img13.360buyimg.com/ling/jfs/t1/219885/25/14820/455761/622efa98Ef9dc0bb7/d96f49bae2e360da.jpg
categories: Web开发
tags:
  - 3D
  - 3D选型
  - 小程序
author:
  nick: 赛米老冯
  github_name: sm450203924
date: 2022-03-14 15:50:00
wechat:
  share_cover: https://img20.360buyimg.com/ling/jfs/t1/113463/14/22033/227965/622efa98Eb0a6d412/ae4088f9ddad0c54.jpg
  share_title: Web3D 从入门到跑路 · 3D 初体验
  share_desc: Hey 3D what's up，最近在Web圈混得怎样
---

# 3D初体验

> Hey 3D what's up，最近在Web圈混得怎样

<br>

在“元宇宙”概念越来越火热的背景下，我们准备了一系列的3D元宇宙公开课及教学文章，教大家如何从0到1快速搭建一个3D项目，从中可以学习到WebGL 底层原理、图形学、热门引擎的使用方法等。在入门前，我们先从案例、应用、技术生态出发，让大家了解一下3D在Web端的现状。

<br>

## 一、案例展示

### 1.1 组成部分
先从一个基础的DEMO出发，一个基础的3D一般会有以下模块组成：
#### （1）渲染
打开一个3D页面，首先会下载模型文件，然后渲染到页面中
![](//storage.360buyimg.com/model-rendering-tool/sammy/paste1.png)

#### （2）动画
逐帧渲染动画
![](//storage.360buyimg.com/model-rendering-tool/sammy/screencast-ani.gif)

#### （3）事件绑定
通过js的事件绑定，触发对应的渲染。比如点击地面人物移动
![](//storage.360buyimg.com/model-rendering-tool/sammy/screencast-event.gif)

#### （4）场景切换
众所周知，游戏里有很多场景，比如游戏加载、游戏开始、游戏结束，就是三个不同的场景。如图就是从主玩法到编辑场景
![](//storage.360buyimg.com/model-rendering-tool/sammy/editor.png)

<br>


### 1.2 完整案例
#### （1）PC端
下面来看一些有趣的例子，先从PC端开始
![](//storage.360buyimg.com/model-rendering-tool/sammy/bruno-simon.png)
这是一名开发者博客，他从开始场景切换成主场景，然后渲染一些树、车3D模型，用键盘控制模型的方向，碰撞后将模型旋转，并同时播放对应的音频等。
*点击体验一下 👉 [https://bruno-simon.com/](https://bruno-simon.com/)*

![](//storage.360buyimg.com/model-rendering-tool/sammy/car.png)
这是playcanvas官网上的宝马demo，它渲染了动画，点击下面的图片，可以更换这个模型的纹理。
*点击体验一下 👉 [https://playcanv.as/p/RqJJ9oU9](https://playcanv.as/p/RqJJ9oU9)*

#### （2）H5端
再看看移动端的案例
![](//storage.360buyimg.com/model-rendering-tool/sammy/h5-car.png)
上面的赛车游戏，也是从开始场景切到主玩法，之后通过下方的touch bar对车/地图的进行位移和其他物体碰撞后，检测触发加速等事件。
*扫码或点击体验一下👉 [Mercedes-EQ Formula E Team - Speedboard Game](https://www.mercedes-benz.com/storage/formula-e/2021-eq-house-digital-showroom/speedboard/20211129-v2.html)*

![](//storage.360buyimg.com/model-rendering-tool/sammy/run.png)
然后是大家熟知的例子，神庙逃亡，也可以看到很明显的场景切换、碰撞检测等。
*扫码或点击体验一下👉 [Play Temple Run 2 on Poki](https://poki.com/en/g/temple-run-2#)*

<br>


## 二、应用场景
再来看看3D在国内一些正式的应用场景。
### 2.1 App端
![](//storage.360buyimg.com/model-rendering-tool/sammy/apartment.png)
比如VR看房，VR线上看房可以没有导购员的干扰，节省带看成本，用户操作上也为该房产留下了大量的数据留存；

![](//storage.360buyimg.com/model-rendering-tool/sammy/shoe-group.png)
还有如果在一些购物App上看鞋，它会有鞋3D模型预览，以及AR试穿，可以看清鞋子的细节以及个人试穿后的样子。

### 2.2 H5端

一些互动小游戏中，也有3D的部分
![](//storage.360buyimg.com/model-rendering-tool/sammy/life.png)

微信小游戏中，也有3D的小游戏
![](//storage.360buyimg.com/model-rendering-tool/sammy/wechat-game.png)

<br>


## 三、技术生态
### 3.1 游戏引擎的定义
首先，想要“快速”实现一个3D游戏，需要3D的游戏引擎，那么到底什么是游戏引擎呢？

**（1）已编写好的可编辑电脑游戏系统**
**（2）交互式实时图像应用程序的核心组件**
**（3）能容易和快速地做出游戏程式**

<br>

### 3.2 游戏引擎的组成
大多数游戏引擎包含以下系统：
**（1）渲染引擎**
即“渲染器”，绘制图像，并向外部表达图像的系统，含二维图像引擎和三维图像引擎

**（2）物理引擎**
通过为刚性物体赋予真实的物理属性的方式来计算运动、旋转和碰撞反映

**（3）脚本引擎**
提供脚本接口，让开发者通过脚本设计游戏，使游戏的开发更加灵活

**（4）网络引擎**
数据交换的模块，在开发多人在线游戏时使用

**（5）人工智能**
代替游戏开发中部分劳动密集型内容的生成，如道路检测

<br>

### 3.3 如何选择合适的游戏引擎
如何选择适合游戏引擎，我们一般从以下三个方面考虑：
#### （1）入门
- 开发语言
- 学习资源与技术支持能力
- 工作流支持力度

如果是刚入门的先要考虑是否是自己熟悉的开发语言，考察该引擎的官方的资源文档、团队的问题修复能力、社区活跃度，以及引擎的工作流支持力度，如是否有playground等。

#### （2）参考
- 商业化成熟案例
- 应用广度

从参考实例上考虑，该引擎是否有现实的有名的项目正在使用，使用的广度；

#### （3）设计
- 设计理念
- 性能

从设计上面考虑，引擎的设计理念是否容易理解、方便第三方介入接入。以及需要结合项目的规模及功能要求，需要选择符合要求的性能优化、内存管理、资源管理的引擎。

<br>

### 3.4 技术栈
选取了Github上star数最多的游戏引擎，选几个来分析一下其优点及不足：

#### （1）Three.js
Three.js是最流行的JavaScript库之一，用于使用WebGL在Web浏览器中创建和动画化3D计算机图形。

A. 优点：
- 易于学习：非常容易上手，同样适合新手
- 大型社区：示例多，用户多，社区丰富
- 好的文档：强大的文档通常是一个强大的库的一个很好的指标，而Three.js具有出色的文档
- 性能优势：出色的性能，能很好地执行复杂的渲染功能
- PBR渲染：具有内置的PBR渲染，这使得渲染图形更加准确

B. 不足：
- 不算是游戏引擎：渲染以外的功能很少
- 面向新手：由于API面向新手，因此隐藏了许多高级功能

#### （2）Babylon.js
Babylon.js是一个强大的、简单的、开放的游戏和渲染引擎。

A. 优点：
- 出色的测试工具：Playground是在进行全面开发之前对事物进行测试的出色工具，并且具有出色的启动文档
- 强大的社区支持：社区活跃和丰富
- 更新迭代频繁：该框架拥有频繁更新的代码库，并且第三方工具正在积极开发中
- PBR渲染：对PBR渲染的支持非常出色
- 大牌支持：Babylon得到Adobe，Microsoft等大型品牌的使用和支持
- 问题修复：BUG修复很快，问题很快能得到解决

B. 不足：
- 成熟度：2013年的第一个版本，与许多竞争对手相比，它还算年轻；
- 文档：API文档部分参数字段描述不够清晰；
- 规模：不适合较小的项目

#### （3）Aframe
- 使用简单，声明性HTML：A-Frame只需插入`<a-scene>`
- 实体组件体系结构：A-Frame是three.js之上的强大框架，为Three.js提供了声明性，可组合且可重用的实体组件结构
- 性能：一个框架是在three.js之上的一个瘦框架
- 跨平台，有视觉检查器，功能丰富
- 设计理：由于设计理念与其他引擎不同，接入第三方物理引擎的时候，不太方便做适配

#### （4）Playcanvas
侧重于游戏引擎而不是渲染引擎，是一款优秀的全功能游戏引擎。但是私有项目收费，没有碰撞偏移，缺少示例。

#### （5）Whs
- 使用简单，集成Three.js渲染引擎，rendering渲染自动化，加速3D场景原型制作，based基于组件的场景图
- 即使使用Worker（多线程），也可以轻松集成任何高性能物理
- 基于ES2015+，pack Webpack友好

#### （6）其他
A. Egret 白鹭、LayaAir
还有国内的一些引擎，当我们用中文搜索“游戏引擎”，一般都会推荐白鹭、LayaAir这两个，它们的优点就是有专门的企业进行开发和维护，也可以花钱让其做定制化需求，并且支持多端开发。
白鹭的话比较偏向于2D，3D是近几年开始在2D基础上迭代的。而Laya比较多的人用来做微信小游戏。不足的是，他们的社区不够活跃，文档更新不及时，对于开发者来说，开发体验不是非常友好。

B. oasis
去年淘宝开源oasis，用于支付宝的蚂蚁庄园以及其他的一些互动游戏。现在已经有3500个star了，从它的官方文档上看，使用方式与three类似，API 比较简单，也具有基础的物理相关示例，还是比较实用小型、功能小的项目的。

#### 7. 小程序

如果想要兼容微信小程序端，微信官方有Adapter的示例: [Adapter | 微信开放文档](https://developers.weixin.qq.com/minigame/dev/guide/best-practice/adapter.html)

有以下开源仓库，可供大家参考一下：
- [weapp-adapter 仓库](https://github.com/finscn/weapp-adapter)
- [three-platformize 仓库](https://github.com/deepkolos/three-platformize)
- [threejs-miniprogram 仓库](https://github.com/wechat-miniprogram/threejs-miniprogram)

<br>


# 参考资料
1. [游戏引擎 - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/%E6%B8%B8%E6%88%8F%E5%BC%95%E6%93%8E)
2. [XR地产：VR、AR看房场景](https://zhuanlan.zhihu.com/p/370788498)
3. [Choosing the right game engine](https://www.gdquest.com/tutorial/getting-started/learn-to/choosing-a-game-engine)
4. [如何选择H5游戏引擎](https://cloud.tencent.com/developer/article/1073996)
5. [JavaScript Game Engines](https://github.com/collections/javascript-game-engines)
6. [HTML5 Game Engines](https://html5gameengine.com/)
7. [H5游戏开发：游戏引擎入门推荐](https://aotu.io/notes/2017/12/27/h5-game-engine-recommend/index.html)
8. [Top 6 JavaScript and HTML5 game engines](https://blog.logrocket.com/top-6-javascript-and-html5-game-engines/)
9. [Top JS Gaming Engines and Libraries for 2020](https://blog.bitsrc.io/9-1.top-js-gaming-engines-and-libraries-for-2020-81707d9f095)
