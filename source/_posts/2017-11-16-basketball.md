title: H5游戏开发：决胜三分球
subtitle: 结合 Matter.js 物理引擎实现的投篮游戏
cover: //misc.aotu.io/ONE-SUNDAY/basketball/basketball_900x500.jpg
categories: H5游戏开发
date: 2017-11-16 20:55:06
tags:
  - H5游戏开发
  - Matter.js
  - LayaAir
author:
  nick: TH
  github_name: ONE-SUNDAY
wechat:
    share_cover: //misc.aotu.io/ONE-SUNDAY/basketball/basketball_200x200.png
    share_title: H5游戏开发：决胜三分球
    share_desc: 结合 Matter.js 物理引擎实现的投篮游戏

---

<!-- more -->

## 前言

本次是与腾讯手机充值合作推出的活动，用户通过氪金充值话费或者分享来获得更多的投篮机会，根据最终的进球数排名来发放奖品。

用户可以通过滑动拉出一条辅助线，根据辅助线长度和角度的不同将球投出，由于本次活动的开发周期短，在物理特性实现方面使用了物理引擎，所有本文的分享内容是如何结合物理引擎去实现一款投篮小游戏，如下图所示。

![show](//misc.aotu.io/ONE-SUNDAY/basketball/show.gif)


## 准备

![layaAir](//misc.aotu.io/ONE-SUNDAY/basketball/layaAir.jpg)

此次我使用的游戏引擎是 [LayaAir](https://www.layabox.com/)，你也可以根据你的爱好和实际需求选择合适的游戏引擎进行开发，为什么选择该引擎进行开发 ，总的来说有以下几个原因：

* LayaAir 官方文档、API、示例学习详细、友好，可快速上手
* 除了支持 2D 开发，同时还支持 3D 和 VR 开发，支持 AS、TS、JS 三种语言开发
* 在开发者社区中提出的问题，官方能及时有效的回复
* 提供 IDE 工具，内置功能有打包 APP、骨骼动画转换、图集打包、SWF转换、3D 转换等等

![matterjs](//misc.aotu.io/ONE-SUNDAY/basketball/matterjs.jpg)

物理引擎方面采用了 [Matter.js](http://brm.io/matter-js/)，篮球、篮网的碰撞弹跳都使用它来实现，当然，还有其他的物理引擎如 planck.js、p2.js 等等，具体没有太深入的了解，Matter.js 相比其他引擎的优势在于：

* 轻量级，性能不逊色于其他物理引擎
* 官方文档、Demo 例子非常丰富，配色有爱
* API 简单易用，轻松实现弹跳、碰撞、重力、滚动等物理效果
* Github Star 数处于其他物理引擎之上，更新频率更高


## 开始

#### 一、初始化游戏引擎

首先对 LayaAir 游戏引擎进行初始化设置，`Laya.init` 创建一个 1334x750 的画布以 WebGL 模式去渲染，渲染模式下有 WebGL 和 Canvas，使用 WebGL 模式下会出现锯齿的问题，使用 `Config.isAntialias` 抗锯齿可以解决此问题，并且使用引擎中自带的多种屏幕适配 `screenMode`。

如果你使用的游戏引擎没有提供屏幕适配，欢迎阅读另一位同事所写的文章[【H5游戏开发：横屏适配】](https://aotu.io/notes/2017/10/18/landscape_mode_in_html5_game/)。

```js
...
Config.isAntialias = true; // 抗锯齿
Laya.init(1334, 750, Laya.WebGL); // 初始化一个画布，使用 WebGL 渲染，不支持时会自动切换为 Canvas
Laya.stage.alignV = 'top'; // 适配垂直对齐方式
Laya.stage.alignH = 'middle'; // 适配水平对齐方式
Laya.stage.screenMode = this.Stage.SCREEN_HORIZONTAL; // 始终以横屏展示
Laya.stage.scaleMode = "fixedwidth"; // 宽度不变，高度根据屏幕比例缩放，还有 noscale、exactfit、showall、noborder、full、fixedheight 等适配模式
...
```

#### 二、初始化物理引擎、加入场景

然后对 Matter.js 物理引擎进行初始化，`Matter.Engine` 模块包含了创建和处理引擎的方法，由引擎运行这个世界，`engine.world` 则包含了用于创建和操作世界的方法，所有的物体都需要加入到这个世界中，`Matter.Render` 是将实例渲染到 Canvas 中的渲染器。

`enableSleeping` 是开启刚体处于静止状态时切换为睡眠状态，减少物理运算提升性能，`wireframes` 关闭用于调试时的线框模式，再使用 LayaAir 提供的 `Laya.loading`、`new Sprite` 加载、绘制已简化的场景元素。

```js
...
this.engine;
var world;
this.engine = Matter.Engine.create({
    enableSleeping: true // 开启睡眠
});
world = this.engine.world;
Matter.Engine.run(this.engine); // Engine 启动
var render = LayaRender.create({
    engine: this.engine,
    options: { wireframes: false, background: "#000" }
});
LayaRender.run(render); // Render 启动
...
```

![engine-and-world](//misc.aotu.io/ONE-SUNDAY/basketball/engine-and-world.jpg)

```js
...
// 加入背景、篮架、篮框
var bg = new this.Sprite();
Laya.stage.addChild(bg);
bg.pos(0, 0);
bg.loadImage('images/bg.jpg');
...
```

![scene](//misc.aotu.io/ONE-SUNDAY/basketball/scene.jpg)

#### 三、画出辅助线，计算长度、角度

投球的力度和角度是根据这条辅助线的长短角度去决定的，现在我们加入手势事件 `MOUSE_DOWN`、`MOUSE_MOVE`、`MOUSE_UP` 画出辅助线，通过这条辅助线起点和终点的 X、Y 坐标点再结合两个公式： `getRad`、`getDistance` 计算出距离和角度。

```js
...
var line = new this.Sprite();
Laya.stage.addChild(line);
Laya.stage.on(this.Event.MOUSE_DOWN, this, function(e) { ... });
Laya.stage.on(this.Event.MOUSE_MOVE, this, function(e) { ... });
Laya.stage.on(this.Event.MOUSE_UP, this, function(e) { ... });
...
```

```js
...
getRad: function(x1, y1, x2, y2) { // 返回两点之间的角度
    var x = x2 - x1;
    var y = y2 - x2;
    var Hypotenuse = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    var angle = x / Hypotenuse;
    var rad = Math.acos(angle);
    if (y2 < y1) { rad = -rad; } return rad;
},
getDistance: function(x1, y1, x2, y2) { // 计算两点间的距离
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
...
```

#### 四、生成篮球施加力度

大致初始了一个简单的场景，只有背景和篮框，接下来是加入投篮。

每次在 `MOUSE_UP` 事件的时候我们就生成一个圆形的刚体， `isStatic: false` 我们要移动所以不固定篮球，并且设置 `density` 密度、`restitution` 弹性、刚体的背景 `sprite` 等属性。

将获得的两个值：距离和角度，通过 `applyForce` 方法给生成的篮球施加一个力，使之投出去。

```js
...
addBall: function(x, y) {
    var ball = Matter.Bodies.circle(500, 254, 28, { // x, y, 半径
        isStatic: false, // 不固定
        density: 0.68, // 密度
        restitution: 0.8, // 弹性
        render: {
            visible: true, // 开启渲染
            sprite: {
                texture: 'images/ball.png', // 设置为篮球图
                xOffset: 28, // x 设置为中心点
                yOffset: 28 // y 设置为中心点
            }
        }
    });
}
Matter.Body.applyForce(ball, ball.position, { x: x, y: y }); // 施加力
Matter.World.add(this.engine.world, [ball]); // 添加到世界
...
```

#### 五、加入其他刚体、软体

现在，已经能顺利的将篮球投出，现在我们还需要加入一个篮球网、篮框、篮架。

通过 Matter.js 加入一些刚体和软体并且赋予物理特性 `firction` 摩擦力、`frictionAir` 空气摩擦力等， `visible: false` 表示是否隐藏，`collisionFilter` 是过滤碰撞让篮球网之间不产生碰撞。

```js
...
addBody: function() {
    var group = Matter.Body.nextGroup(true);
    var netBody = Matter.Composites.softBody(1067, 164, 6, 4, 0, 0, false, 8.5, { // 篮球网
        firction: 1, // 摩擦力
        frictionAir: 0.08, // 空气摩擦力
        restitution: 0, // 弹性
        render: { visible: false },
        collisionFilter: { group: group }
    }, {
        render: { lineWidth: 2, strokeStyle: "#fff" }
    });
    netBody.bodies[0].isStatic = netBody.bodies[5].isStatic = true; // 将篮球网固定起来
    var backboard = Matter.Bodies.rectangle(1208, 120, 50, 136, { // 篮板刚体
        isStatic: true,
        render: { visible: true }
    });
    var backboardBlock = Matter.Bodies.rectangle(1069, 173, 5, 5, { // 篮框边缘块
        isStatic: true,
        render: { visible: true }
    });
    Matter.World.add(this.engine.world, [ // 四周墙壁
        ...
        Matter.Bodies.rectangle(667, 5, 1334, 10, { // x, y, w, h
            isStatic: true
        }),
        ...
    ]);
    Matter.World.add(this.engine.world, [netBody, backboard, backboardBlock]);
}
```

![body](//misc.aotu.io/ONE-SUNDAY/basketball/body.jpg)

#### 六、判断进球、监听睡眠状态

通过开启一个 `tick` 事件不停的监听球在运行时的位置，当到达某个位置时判定为进球。

另外太多的篮球会影响性能，所以我们使用 `sleepStart` 事件监听篮球一段时间不动后，进入睡眠状态时删除。

```js
...
Matter.Events.on(this.engine, 'tick', function() {
    countDown++;
    if (ball.position.x > 1054 && ball.position.x < 1175 && ball.position.y > 170 && ball.position.y < 180 && countDown > 2) {
        countDown = 0;
        console.log('球进了！');
    }
});
Matter.Events.on(ball, 'sleepStart', function() {
    Matter.World.remove(This.engine.world, ball);
});
...
```

到此为止，通过借助物理引擎所提供的碰撞、弹性、摩擦力等特性，一款简易版的投篮小游戏就完成了，也推荐大家阅读另一位同事的文章[【H5游戏开发】推金币](https://aotu.io/notes/2017/11/06/coindozer/) ，使用了 CreateJS + Matter.js 的方案，相信对你仿 3D 和 Matter.js 的使用上有更深的了解。

最后，此次项目中只做了一些小尝试，Matter.js 能实现的远不止这些，移步官网发现更多的惊喜吧，文章的完整 Demo 代码可[【点击这里】](http://jdc.jd.com/demo/ball-demo/)。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。


## 参考

[Matter.js](http://brm.io/matter-js/)

[LayaAir Demo](https://layaair.ldc.layabox.com/demo/?2d&Sprite&DisplayImage)
