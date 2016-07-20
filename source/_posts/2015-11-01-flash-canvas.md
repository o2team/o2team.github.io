title: 使用Adobe FLASH CC制作Canvas动画
subtitle: "flash可以导出canvas动画，大大缩短制作动画所需要的时间。它是可视化IDE，可以让我们写少很多代码。做出来的动画，可以更加精确。"
date: 2015-11-01 18:44:25
cover: //img.aotu.io/youing/flash-canvas.png
categories: Web开发
tags:
  - Flash
  - Canvas
author:
  nick: 圆姑娘她爹
  github_name: youing

---


flash可以导出canvas动画，大大缩短制作动画所需要的时间。它是一个可视化IDE，可以让我们写少很多代码。做出来的动画，可以更加精确。同时，可以通用使用帧脚本中的 Javascript，为资源添加交互性。

<!-- more -->

## 新建HTML5 Canvas项目

![新建](//img.aotu.io/youing/1.png)

### 舞台设置

舞台大小修改为：600x600 (_这里可以根据设计稿调整所需要的舞台大小_)

### 帧频

是指每秒钟放映或显示的帧或图像的数量，这个数值设置越大，动画越快，但同时也是性能消耗大户。这里我们设置为36

![帧频](//img.aotu.io/youing/2.png)

## 导入资源

文件 > 导入 > 导入到库

## 布局

快捷键Ctrl + L或者窗口菜单下 > 库

从资源库中把资源拖到舞台进去,通过移动拖拽的形式进行布局

![布局](//img.aotu.io/youing/3.png)

## 图形与影片剪辑

我们可以将单独的动画，放到一个独立的影片剪辑里，这样可以更好的控制动画。几个独立的剪片剪辑，可以组成一个完整的动画。

当我们把图片从资源库拖到舞台时，它这个时候，只是普通的位图，并不能做补帧动画，所以我们必须把它转换成元件。

* **图形**由矢量图或者是位图组成。
* **影片剪辑**包含在动画影片中的影片片段，有自己的时间轴和属性。具有交互性，是用途最广、功能最多的部分。

下面制作以飘动的钱，做个例子说明

选择位图，右键 > 转换为元件，这个时候，弹出一个对话窗口，我们首先选择“影片剪辑”，保存。双击进入刚才创始的影片剪辑，这个时候，由于刚才我们只是把位图转成了影片剪辑，但实际上，它里面，仍然是一个位图，所以并不能做动画操作。所以我们需要在影片剪辑里，把图片转换了“图形”。

![图形与影片](//img.aotu.io/youing/4.png)

## 时间轴

上面已经把图片转成图形元件，所以我们现在需要时间轴某个地方中插入关键帧。这里我们在30,60帧处插入关键帧。然后在30帧处，移动元件的位置，然后在每个关键帧的中间右键，选择“创建传统补间”。速度可以通过删除或者增加两个关键帧的补间动画时间长度来控制。

![时间轴](//img.aotu.io/youing/5.png)

![时间轴](//img.aotu.io/youing/6.png)

## 动作播放控制

如果我们希望动画可以连续从头再播放，可以在动画的最后一帧插入一个空白关键帧，打开动作面板，然后写上

```
this.gotoAndPlay(0)
```

![动作播放控制](//img.aotu.io/youing/7.png)


即可回到第一帧重新播放，如果希望停止动画，则

```
this.stop();
```

如果希望跳到某帧去播放

```
this.gotoAndPlay(n)
```

如果希望跳到某帧并停止

```
this.gotoAndStop(n)
```


## 发布

文件 > 发布设置

### 文件输出

* 循环时间轴(_表示是否循环整个动画_)
* 覆盖HTML(_第一次发布时可以选上，如果对html有修改，记得把这个选项去掉,否则会对文件进行覆盖操作_)

### 资源导出选项

* 图像(_是否导出雪碧图_)
* javascript命名空间(_基本上不需要修改_)，这几个属于全局变量，可以在发布后的js文件中再修改。


![资源导出](//img.aotu.io/youing/8.png)



## 生成html

最终会生成一个html文件和一个js文件

### 生成的html文件

* 框架自带的preloadjs,可以轻松管理资源预加载，它提供了相关api可以进行loading等操作。


``` html
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>people</title>

<script src="http://code.createjs.com/easeljs-0.8.1.min.js"></script>
<script src="http://code.createjs.com/tweenjs-0.6.1.min.js"></script>
<script src="http://code.createjs.com/movieclip-0.8.1.min.js"></script>
<script src="http://code.createjs.com/preloadjs-0.6.1.min.js"></script>
<script src="people.js"></script>

<script>
var canvas, stage, exportRoot;

function init() {
	canvas = document.getElementById("canvas");
	images = images||{};

	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", handleFileLoad);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(lib.properties.manifest);
}

function handleFileLoad(evt) {
	if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
}

function handleComplete(evt) {
	exportRoot = new lib.people();

	stage = new createjs.Stage(canvas);
	stage.addChild(exportRoot);
	stage.update();

	createjs.Ticker.setFPS(lib.properties.fps);
	createjs.Ticker.addEventListener("tick", stage);
}
</script>
</head>

<body onload="init();" style="background-color:#D4D4D4">
	<canvas id="canvas" width="600" height="620" style="background-color:#FFFFFF"></canvas>
</body>
</html>
```

### 生成的js文件

* 生成的动画配置及脚本都在这个js文件里面，如果需要，可以手动修改相关数据。

``` javascript
(function (lib, img, cjs, ss) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 600,
	height: 620,
	fps: 36,
	color: "#FFFFFF",
	manifest: [
		{src:"images/bigband.png", id:"bigband"},
		{src:"images/Bitmap1.png", id:"Bitmap1"},
		{src:"images/body.png", id:"body"},
		{src:"images/eye1.png", id:"eye1"},
		{src:"images/eye2.png", id:"eye2"},
		{src:"images/face1.png", id:"face1"},
		{src:"images/face2.png", id:"face2"},
		{src:"images/face3.png", id:"face3"},
		{src:"images/hair.png", id:"hair"},
		{src:"images/hand2.png", id:"hand2"},
		{src:"images/hand3.png", id:"hand3"},
		{src:"images/hand4.png", id:"hand4"},
		{src:"images/index30.png", id:"index30"},
		{src:"images/index302.png", id:"index302"},
		{src:"images/index40.png", id:"index40"},
		{src:"images/index5.png", id:"index5"},
		{src:"images/shadow.png", id:"shadow"}
	]
};



// symbols:



(lib.bigband = function() {
	this.initialize(img.bigband);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,295,538);


(lib.Bitmap1 = function() {
	this.initialize(img.Bitmap1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,543,577);


(lib.body = function() {
	this.initialize(img.body);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,521,242);


(lib.eye1 = function() {
	this.initialize(img.eye1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,73,58);


(lib.eye2 = function() {
	this.initialize(img.eye2);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,72,35);


(lib.face1 = function() {
	this.initialize(img.face1);
}).prototype = p = new cjs.Bitmap();
p.nominalBounds = new cjs.Rectangle(0,0,297,368);



...

// stage content:



(lib.people = function() {
	this.initialize();

	// people
	this.instance = new lib.peoplemc();
	this.instance.setTransform(295,312.5);

	// qpmask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("EgpUgqAMBU1AAAMAAABaIMhU1AAAg");
	mask.setTransform(278.5,308.1);

	// qp
	this.instance_1 = new lib.qpmc();
	this.instance_1.setTransform(291.5,263.5);

	this.instance_1.mask = mask;

	this.addChild(this.instance_1,this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(263,31.5,617,905.5);

})(lib = lib||{}, images = images||{}, createjs = createjs||{}, ss = ss||{});
var lib, images, createjs, ss;
```


## 附上最终效果

[点我看效果](http://b.gengshu.net/doc/flash/people.html)
 
