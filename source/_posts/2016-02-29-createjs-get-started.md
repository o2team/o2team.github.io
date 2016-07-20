title: createjs开发入门
subtitle: 通过实例浅析createjs
cover: //img.aotu.io/youing/20160229/createjs-get-started-cover.jpg
categories: Web开发
tags:
  - createjs
  - tweenjs
  - zoe
  - preloadjs
  - soundjs
  - easeljs
author:
  nick: 圆姑娘她爹
  github_name: youing
date: 2016-02-29 20:10:15
---
通过实例简单介绍createjs的使用方法
<!-- more -->


## PRELOADJS

PreloadJS是一个用来管理和协调相关资源加载的类库，它可以方便的帮助你预先加载相关资源。


### LoadQueue类介绍

LoadQueue是一个加载管理器，可以预先加载一个文件或者一个文件队列。

LoadQueue包含了几个可以订阅的事件：


- complete: 当队列完成全部加载后触发
- error: 当队列遇到错误时触发
- progress: 整个队列变化时展示的进度
- fileload: 一个单独文件加载完毕
- fileprogress: 一个单独文件变化的进度，请注意只有文件使用XHR加载才会触发，其它只会显示0或者100%


LoadQueue支持相关文件类型如下：

- BINARY:  XHR调用的二进制文件
- CSS: CSS文件
- IMAGE: 一般图片文件格式
- JAVASCRIPT: JavaScript文件
- JSON: JSON数据
- JSONP: 跨域JSON文件
- MANIFEST: JSON格式的文件列表
- SOUND: 音频文件
- SVG: SVG文件
- TEXT: 文本文件 - 仅支持XHR
- XML: XML数据


### 示例：


```
manifest = [
	{src: "art/sky.png", id: "sky"},
	{src: "art/ground.png", id: "ground"},
	{src: "art/hill2.png", id: "hill2"},
	{src: "art/hill1.png", id: "hill"},
	{src: "static/grant.json", id:"grant", type:"spritesheet"}
];

var loader = new createjs.LoadQueue(true, "../_assets/");
loader.on("fileload", handleFileLoad);
loader.on("complete", handleComplete);
loader.loadManifest(manifest);


```

- 预加载音频文件

```
//初始化插件
preload.installPlugin(createjs.Sound);

```

- 设置加载路径

```
preload = new createjs.LoadQueue(true, "../_assets/art/");

```

- 获取预加载资源


```
preload.getResult(‘id’);

```

通常进度条可以通过`fileload`和`complete`来实现。


## SOUNDJS

一个音频播放引擎，能够根据浏览器性能选择音频播放方式。将音频文件作为模块，可随时加载和卸载。


### 单个音频基本用法


```
var assetsPath = "../_assets/audio/";
src = assetsPath + "M-GameBG.ogg";

createjs.Sound.alternateExtensions = ["mp3"];	// 源格式不支持时，用此格式替换
createjs.Sound.addEventListener("fileload", playSound); // 加载完回调
createjs.Sound.registerSound(src);  // 注册

function playSound(event) {
	soundInstance = createjs.Sound.play(event.src);  // 播放实例
}



```


### 多个音频用法

`registerSounds`

```
var assetsPath = "../_assets/audio/";
var sounds = [
	{src: "Game-Break.ogg", id: 1},
	{src: "Game-Spawn.ogg", id: 2},
	{src: "Game-Shot.ogg", id: 3},

	{src: "GU-StealDaisy.ogg", id: 4},
	{src: "Humm.ogg", id: 5},
	{src: "R-Damage.ogg", id: 6},

	{src: "Thunder1.ogg", id: 7},
	{src: "S-Damage.ogg", id: 8},
	{src: "U-CabinBoy3.ogg", id: 9},

	{src: "ToneWobble.ogg", id: 10},
	{src: "Game-Death.ogg", id: 11},
	{src: "Game-Break.ogg", id: 12} 
];

createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.addEventListener("fileload", createjs.proxy(soundLoaded, this)); 
createjs.Sound.registerSounds(sounds, assetsPath);

```


### 声音合成

- AudioSprite例子

```
createjs.Sound.initializeDefaultPlugins();
var assetsPath = "./assets/";
var sounds = [{
    src:"MyAudioSprite.ogg", data: {
        audioSprite: [
            {id:"sound1", startTime:0, duration:500},
            {id:"sound2", startTime:1000, duration:400},
            {id:"sound3", startTime:1700, duration: 1000}
        ]}
    }
];
createjs.Sound.alternateExtensions = ["mp3"];
createjs.Sound.on("fileload", loadSound);
createjs.Sound.registerSounds(sounds, assetsPath);
// after load is complete
createjs.Sound.play("sound2");

```


- AudioSprite安装


```
npm install -g audiosprite

```

- homebrew安装ffmpeg

FFmpeg and the ogg codecs on OSX using brew:

```
brew install ffmpeg --with-theora --with-libogg --with-libvorbis
```

- 生成音频文件

```
audiosprite --autoplay bg_loop --output mygameaudio bg_loop.wav *.mp3
```

可选参数可以设置是否自动播放等，具体请参考[这里](https://github.com/tonistiigi/audiosprite)


- 在线导出

把生成好的json文件，导入到以下链接，才能供soundjs使用

http://jsfiddle.net/bharat_battu/g8fFP/12/




## TWEENJS

TweenJS类库主要用来调整和动画HTML5和Javascript属性。提供了简单并且强大的tweening接口。支持数字对象属性和CSS样式属性，允许你使用链式语法来生成复杂的过程


### 示例

![img](//img.aotu.io/youing/20160229/tweenjs.gif)


### 使用方法

```
createjs.Tween.get(target)
    .to({x:300},400,createjs.Ease.bounceInOut)
    .set({label:"hello!"})
    .wait(500)
    .to({alpha:0,visible:false},1000)
    .call(onComplete);

 ```

- `get` 获取目标元素
- `to` 执行动画
- `set` 设置属性
- `wait` 队列等待
- `call` 执行回调函数
- `createjs.Ease.bounceInOut` 缓动效果


### 引导动画

```
createjs.MotionGuidePlugin.install(createjs.Tween);


createjs.Tween.get(target).to({guide:{ path:[0,0, 0,200,200,200, 200,0,0,0] }},7000);
//path所设置的坐标等同于下面画曲线的坐标
graphics.moveTo(0,0).curveTo(0,200,200,200).curveTo(200,0,0,0);


```

- 例子


![img](//img.aotu.io/youing/20160229/guidemotion.gif)



## EASELJS

EaselJS 是一个用以与 HTML5 canvas 协作的库。它包含一个完整的分层展示列表、一个核心交互模型以及一些辅助类，通过其来使与 Canvas 的协作更简单。


### 先看例子

![img](//img.aotu.io/youing/20160229/grantrun.gif)

下面介绍这个例子的制作过程

### 素材准备

![img](//img.aotu.io/youing/20160229/1.pic.jpg)


人物精灵图会用到**flash**+**zoe**来生成


打开flash，新建一个新的as3项目，导入图片，只要文件名是有序的，会自动导入到每一帧，如下图

![img](//img.aotu.io/youing/20160229/2.pic.png)

![img](//img.aotu.io/youing/20160229/3.pic.png)


导入完之后，新建一个图层，来放动作标签，如上面的`run`和`jump`


最后再新建一个新的图层用来放动作脚本，这里只需要写`stop()`就可以了，这样整个动画是处于静止状态。


然后用快捷键`Ctrl + enter`发布成swf格式，并把它导入到**zoe**工具,效果如下


![img](//img.aotu.io/youing/20160229/4.pic.png)


tab选项卡切换到`Animations` 可以预览和设置刚才在flash设置的动作。

最后导出json代码供后续使用


### 开发阶段

createjs中，元素都是放到舞台中


1. 舞台创建

```
<canvas id="testCanvas" width="960" height="400"></canvas>

var stage = new createjs.Stage("testCanvas");


```

2. 天空



```
sky = new createjs.Shape();
sky.graphics.beginBitmapFill(loader.getResult("sky")).drawRect(0, 0, w, h);

```

`Shape`类，通常用于画图，例如画矩形，圆形时会使用到



3. 地板


```
var groundImg = loader.getResult("ground");
ground = new createjs.Shape();
ground.graphics.beginBitmapFill(groundImg).drawRect(0, 0, w + groundImg.width, groundImg.height);
ground.tileW = groundImg.width;
ground.y = h - groundImg.height;

```


4. 山

```
hill = new createjs.Bitmap(loader.getResult("hill"));
hill.setTransform(Math.random() * w, h - hill.image.height * 4 - groundImg.height, 4, 4);
hill.alpha = 0.5;

```

`Bitmap`类，常用于位图处理



5. 人物

```
var spriteSheet = new createjs.SpriteSheet(
{
	framerate: 30,
	"images": [loader.getResult("grant")],
	"frames": {"regX": 82, "height": 292, "count": 64, "regY": 0, "width": 165},
	"animations": {
		"run": [0, 25, "run", 1.5],
		"jump": [26, 63, "run"]
	}
})

var grant = new createjs.Sprite(spriteSheet, "run");


```

人物用到`Sprite`类，精灵图存放在`SpriteSheet`中，刚才用**flash** + **zoe** 生成的json，可以直接传入到`SpriteSheet`初始化对象中。

还可以直接使用代码`gotoAndPlay('run')`来进行动作间的切换。


6. 元素加入舞台

```
stage.addChild(sky, hill, hill2, ground, grant);

```

7. 让物体动起来

```
createjs.Ticker.setFPS(30);

createjs.Ticker.addEventListener("tick", handleTick);
function handleTick(event) {
//物品移动逻辑
    stage.update();
}

```


## 知识点


### 开启鼠标检测

```
stage.enableMouseOver(20);
```


### 开启触摸

```
createjs.Touch.enable(this.stage)
```

### Request Animation Frame

```
createjs.Ticker.timingMode = createjs.Ticker.RAF;
```


### 缓存

```
shape.cache(x,y,width,height)
```


### Mask

```
bmp.mask = star;

```

### 碰撞检测

```
myShape.hitTest(x,y)
```


## 参考


1. [http://createjs.com/](http://createjs.com/)
2. [https://github.com/CreateJS](https://github.com/CreateJS)
3. [https://github.com/tonistiigi/audiosprite](https://github.com/tonistiigi/audiosprite)











