title: H5游戏开发：推金币
subtitle: 一款让人欲罢不能，根本停不下来的小游戏及其技术实现思路和细节
cover: https://misc.aotu.io/samgui/coindozer/cover.jpg?v=1
categories: Web开发
tags:
  - h5
  - game
  - 游戏
  - 推金币
  - canvas
  - createjs
  - matter.js
author:
  nick: 三桂
  github_name: aNd1coder
date: 2017-11-06 19:53:08
wechat:
    share_cover: https://misc.aotu.io/samgui/coindozer/share.png
    share_title: H5游戏开发：推金币
    share_desc: 一款让人欲罢不能，根本停不下来的小游戏及其技术实现思路和细节
---

<!-- more -->

近期参与开发的一款「京东11.11推金币赢现金」（已下线）小游戏一经发布上线就在朋友圈引起大量传播。看到大家玩得不亦乐乎，同时也引发不少网友激烈[讨论](https://www.smzdm.com/p/7990202/)，有的说很带劲，有的大呼被套路被耍猴（无奈脸），这都与我的预期相去甚远。在相关业务数据呈呈上涨过程中，曾一度被微信「有关部门」盯上并要求做出调整，真是受宠若惊。接下来就跟大家分享下开发这款游戏的心路历程。

### 背景介绍

一年一度的双十一狂欢购物节即将拉开序幕，H5 互动类小游戏作为京东微信手Q营销特色玩法，在今年预热期的第一波造势中，势必要玩点新花样，主要肩负着社交传播和发券的目的。推金币以传统街机推币机为原型，结合手机强大的能力和生态衍生出可玩性很高的玩法。

### 前期预研

在体验过 AppStore 上好几款推金币游戏 App 后，发现游戏核心模型还是挺简单的，不过 H5 版本的实现在网上很少见。由于团队一直在做 2D 类互动小游戏，在 3D 方向暂时没有实际的项目输出，然后结合此次游戏的特点，一开始想挑战用 3D 来实现，并以此项目为突破口，跟设计师进行深度合作，抹平开发过程的各种障碍。

![推金币 App](https://misc.aotu.io/samgui/coindozer/app.jpg?v=1)

由于时间紧迫，需要在短时间内敲定方案可行性，否则项目延期人头不保。在快速尝试了 `Three.js + Ammo.js` 方案后，发现不尽人意，最终因为各方面原因放弃了 3D 方案，主要是不可控因素太多：时间上、设计及技术经验上、移动端 WebGL 性能表现上，主要还是业务上需要对游戏有绝对的控制，加上是第一次接手复杂的小游戏，担心项目无法正常上线，有点保守，此方案遂卒。

如果读者有兴趣的话可以尝试下 3D 实现，在建模方面，首推 [Three.js](http://threejs.org/) ，入手非常简单，文档和案例也非常详实。当然入门的话必推这篇 [Three.js入门指南](https://read.douban.com/ebook/7412854/)，另外同事分享的这篇 [Three.js 现学现卖](https://aotu.io/notes/2017/08/28/getting-started-with-threejs/) 也可以看看，这里奉上粗糙的 [推金币 3D 版 Demo](http://samgui.com/coindozer-3d/) 

### 技术选型

放弃了 3D 方案，在 2D 技术选型上就很从容了，最终确定用 `CreateJS + Matter.js` 组合作为渲染引擎和物理引擎，理由如下：

- **CreateJS** 在团队内用得比较多，有一定的沉淀，加上有老司机带路，一个字「稳」；
- **Matter.js** 身材纤细、文档友好，也有同事[试玩过](https://aotu.io/notes/2017/04/17/Matter-js/)，完成需求绰绰有余。

### 技术实现

因为是 2D 版本，所以不需要建各种模型和贴图，整个游戏场景通过 canvas 绘制，覆盖在背景图上，然后再做下机型适配问题，游戏主场景就处理得差不多了，其他跟 3D 思路差不多，核心元素包含障碍物、推板、金币、奖品和技能，接下来就分别介绍它们的实现思路。

#### 障碍物

通过审稿确定金币以及奖品的活动区域，然后把活动区域之外的区域都作为障碍物，用来限制金币的移动范围，防止金币碰撞时超出边界。这里可以用 Matter.js 的 `Bodies.fromVertices` 方法，通过传入边界各转角的顶点坐标一次性绘制出形状不规则的障碍物。 不过 Matter.js 在渲染不规则形状时存在问题，需要引入 [poly-decomp](https://github.com/schteppe/poly-decomp.js) 做兼容处理。

![障碍物](https://misc.aotu.io/samgui/coindozer/barrier.jpg?v=1)

``` js
World.add(this.world, [
  Bodies.fromVertices(282, 332,[ 
    // 顶点坐标
    { x: 0, y: 0 },
    { x: 0, y: 890 },
    { x: 140, y: 815 },
    { x: 208, y: 614 },
    { x: 548, y: 614 },
    { x: 612, y: 815 },
    { x: 750, y: 890 },
    { x: 750, y: 0 }
  ])
]);
```

#### 推板

- **创建**：CreateJS 根据推板图片创建 Bitmap 对象比较简单，就不详细讲解了。这里着重讲下推板刚体的创建，主要是跟推板 Bitmap 信息进行同步。因为推板视觉上表现为梯形，所以这里用的梯形刚体，实际上方形也可以，只要能跟周围障碍物形成封闭区域，防止出现缝隙卡住金币即可，创建的刚体直接挂载到推板对象上，方便后续随时提取（金币的处理也是一样），代码大致如下：

``` js
var bounds = this.pusher.getBounds();
this.pusher.body = Matter.Bodies.trapezoid(
  this.pusher.x,
  this.pusher.y,
  bounds.width,
  bounds.height
});

Matter.World.add(this.world, [this.pusher.body]);
```

- **伸缩**：由于推板会沿着视线方向前后移动，为了达到近大远小效果，所以需要在推板伸长和收缩过程中进行缩放处理，这样也可以跟两侧的障碍物边沿进行贴合，让场景看起来更具真实感（伪 3D），当然金币和奖品也需要进行同样的处理。由于推板是自驱动做前后伸缩移动，所以需要对推板及其对应的刚体进行位置同步，这样才会与金币刚体产生碰撞达到推动金币的效果。同时在外部改变（伸长技能）推板最大长度时，也需要让推板保持均匀的缩放比而不至于突然放大／缩小，所以整个推板代码逻辑包含方向控制、长度控制、速度控制、缩放控制和同步控制，代码大致如下：

``` js
var direction, velocity, ratio, deltaY, minY = 550, maxY = 720, minScale = .74;
Matter.Events.on(this.engine, 'beforeUpdate', function (event) {
  // 长度控制（点击伸长技能时）
  if (this.isPusherLengthen) {
    velocity = 90;
    this.pusherMaxY = maxY;
  } else {
    velocity = 85;
    this.pusherMaxY = 620;
  }

  // 方向控制
  if (this.pusher.y >= this.pusherMaxY) {
    direction = -1;

    // 移动到最大长度时结束伸长技能
    this.isPusherLengthen = false;
  } else if (this.pusher.y <= this.pusherMinY) {
    direction = 1;
  }

  // 速度控制
  this.pusher.y += direction * velocity;

  // 缩放控制，在最大长度变化时保持同样的缩放量，防止突然放大／缩小
  ratio = (1 - minScale) * ((this.pusher.y - minY) / (maxY - minY))
  this.pusher.scaleX = this.pusher.scaleY = minScale + ratio;

  // 同步控制，刚体跟推板位置同步
  Body.setPosition(this.pusher.body, { x: this.pusher.x, y: this.pusher.y });
})
```

- **遮罩**：推板伸缩实际上是通过改变坐标来达到位置上的变化，这样存在一个问题，就是在其伸缩时必然会导致缩进的部分「溢出」边界而不是被遮挡。

![推板溢出](https://misc.aotu.io/samgui/coindozer/overflow.jpg?v=1)

所以需要做遮挡处理，这里用 CreateJS 的 mask 遮罩属性可以很好的做「溢出」裁剪：

``` js
var shape = new createjs.Shape();
shape.graphics.beginFill('#ffffff').drawRect(0, 612, 750, 220);
this.pusher.mask = shape
```

最终效果如下：

![正常表现](https://misc.aotu.io/samgui/coindozer/normal.jpg?v=1)

#### 金币

按正常思路，应该在点击屏幕时就在出币口创建金币刚体，让其在重力作用下自然掉落和回弹。但是在调试过程中发现，金币掉落后跟台面上其他金币产生碰撞会导致乱飞现象，甚至会卡到障碍物里面去（原因暂未知），后面改成用 TweenJS 的 `Ease.bounceOut` 来实现金币掉落动画，让金币掉落变得更可控，同时尽量接近自然掉落效果。这样金币从创建到消失过程就被拆分成了三个阶段：

- 第一阶段

点击屏幕从左右移动的出币口创建金币，然后掉落到台面。需要注意的是，由于创建金币时是通过 `appendChild` 方式加入到舞台的，这样金币会非常有规律的在 z 轴方向上叠加，看起来非常怪异，所以需要随机设置金币的 z-index，让金币叠加更自然，伪代码如下：

``` js
var index = Utils.getRandomInt(1, Game.coinContainer.getNumChildren());
Game.coinContainer.setChildIndex(this.coin, index);
```

- 第二阶段

由于金币已经不需要重力场，所以需要设置物理世界的重力为 0，这样金币不会因为自身重量（需要设置重量来控制碰撞时移动的速度）做自由落体运动，安安静静的平躺在台面上，等待跟推板、其他金币和障碍物之间产生碰撞：

``` js
this.engine = Matter.Engine.create();
this.engine.world.gravity.y = 0;
```

由于游戏主要逻辑都集中这个阶段，所以处理起来会稍微复杂些。真实情况下如果金币掉落并附着在推板上后，会跟随推板的伸缩而被带动，最终在推板缩进到最短时被背后的墙壁阻挡而挤下推板，此过程看起来简单但实现起来会非常耗时，最后因为时间上紧迫的这里也做了简化处理，就是不管推板是伸长还是缩进，都让推板上的金币向前「滑行」尽快脱离推板。**一旦金币离开推板则立即为其创建同步的刚体**，为后续的碰撞做准备，这样就完成了金币的碰撞处理。

``` js
Matter.Events.on(this.engine, 'beforeUpdate', function (event) {
  // 处理金币与推板碰撞
  for (var i = 0; i < this.coins.length; i++) {
    var coin = this.coins[i];

    // 金币在推板上
    if (coin.sprite.y < this.pusher.y) {
      // 无论推板伸长／缩进金币都往前移动
      if (deltaY > 0) {
        coin.sprite.y += deltaY;
      } else {
        coin.sprite.y -= deltaY;
      }

      // 金币缩放
      if (coin.sprite.scaleX < 1) {
        coin.sprite.scaleX += 0.001;
        coin.sprite.scaleY += 0.001;
      }
    } else {
      // 更新刚体坐标
      if (coin.body) {
        Matter.Body.set(coin.body, { position: { x: coin.sprite.x, y: coin.sprite.y } })
      } else {
        // 金币离开推板则创建对应刚体
        coin.body = Matter.Bodies.circle(coin.sprite.x, coin.sprite.y);
        Matter.World.add(this.world, [coin.body]);
      }
    }
  }
})
```

- 第三阶段

随着金币不断的投放、碰撞和移动，最终金币会从台面的下边沿掉落并消失，此阶段的处理同第一阶段，这里就不重复了。

#### 奖品

由于奖品需要根据业务情况进行控制，所以把它跟金币进行了分离不做碰撞处理（内心是拒绝的），所以产生了「螃蟹步」现象，这里就不做过多介绍了。

#### 技能设计

写好游戏主逻辑之后，技能就属于锦上添花的事情了，不过让游戏更具可玩性，想想金币哗啦啦往下掉的感觉还是很棒的。

**抖动**：这里取了个巧，是给舞台容器添加了 CSS3 实现的抖动效果，然后在抖动时间内让所有的金币的 y 坐标累加固定值产生整体慢慢前移效果，由于安卓下支持系统震动 API，所以加了个彩蛋让游戏体验更真实。

CSS3 抖动实现主要是参考了 [csshake](http://elrumordelaluz.github.io/csshake/) 这个样式，非常有意思的一组抖动动画集合。

JS 抖动 API

``` js
// 安卓震动
if (isAndroid) {
  window.navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
  window.navigator.vibrate([100, 30, 100, 30, 100, 200, 200, 30, 200, 30, 200, 200, 100, 30, 100, 30, 100]);
  window.navigator.vibrate(0); // 停止抖动
}
```

**伸长**：伸长处理也很简单，通过改变推板移动的最大 y 坐标值让金币产生更大的移动距离，不过细节上有几点需要注意的地方，在推板最大 y 坐标值改变之后需要保持移动速度不变，不然就会产生「瞬移」(不平滑)问题。

#### 调试方法

由于用了物理引擎，当在创建刚体时需要跟 CreateJS 图形保持一致，这里可以利用 Matter.js 自带的 Render 为物理场景独立创建一个透明的渲染层，然后覆盖在 CreateJS 场景之上，这里贴出大致代码：

``` js
Matter.Render.create({
  element: document.getElementById('debugger-canvas'),
  engine: this.engine,
  options: {
    width: 750,
    height: 1206,
    showVelocity: true,
    wireframes: false // 设置为非线框，刚体才可以渲染出颜色
  }
});
```

设置刚体的 render 属性为半透明色块，方便观察和调试，这里以推板为例：

``` js
this.pusher.body = Matter.Bodies.trapezoid(
... // 略
{
  isStatic: true,
  render: {
    opacity: .5,
    fillStyle: 'red'
  }
});
```

效果如下，调试起来还是很方便的：

![调试模式](https://misc.aotu.io/samgui/coindozer/debugger.gif)

### 性能／体验优化

#### 控制对象数量

随着游戏的持续台面上累积的金币数量会不断增加，金币之间的碰撞计算量也会陡增，必然会导致手机卡顿和发热。这时就需要控制金币的重叠度，而金币之间重叠的区域大小是由金币刚体的尺寸大小决定的，通过适当的调整刚体半径让金币分布得比较均匀，这样可以有效控制金币数量，提升游戏性能。

#### 安卓卡顿

一开始是给推板一个固定的速度进行伸缩处理，发现在 iOS 上表现流畅，但是在部分安卓机上却显得差强人意。由于部分安卓机型 FPS 比较低，导致推板在单位时间内位移比较小，表现出来就显得卡顿不流畅。后面让推板位移根据刷新时间差进行递增／减，保证不同帧频机型下都能保持一致的位移，代码大致如下：

``` js
var delta = 0, prevTime = 0;
Matter.Events.on(this.engine, 'beforeUpdate', function (event) {
  delta = event.timestamp - prevTime;
  prevTime = event.timestamp;
  // ... 略
  this.pusher.y += direction * velocity * (delta / 1000)
})
```

#### 对象回收

这也是游戏开发中常用的优化手段，通过回收从边界消失的对象，让对象得以复用，防止因频繁创建对象而产生大量的内存消耗。

#### 事件销毁

由于金币和奖品生命周期内使用了 Tween，当他们从屏幕上消失后记得移除掉：

``` js
createjs.Tween.removeTweens(this.coin);
```

至此，推金币各个关键环节都有讲到了，最后附上一张实际游戏效果：
![](https://misc.aotu.io/samgui/coindozer/game.gif)

### 结语

感谢各位耐心读完，希望能有所收获，有考虑不足的地方欢迎留言指出。

### 相关资源

[Three.js 官网](http://threejs.org/)

[Three.js入门指南](https://read.douban.com/ebook/7412854/)

[Three.js 现学现卖](https://aotu.io/notes/2017/08/28/getting-started-with-threejs/)

[Matter.js 官网](brm.io/matter-js/)

[Matter.js 2D 物理引擎试玩报告](https://aotu.io/notes/2017/04/17/Matter-js/)

<style>
	.post-content img {
		display: block;
    margin: 20px auto; 
	}
</style>