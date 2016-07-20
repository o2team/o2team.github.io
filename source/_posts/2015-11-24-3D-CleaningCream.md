subtitle: 看官别走啊，这真不是软文。
title: 使用ThreeJS在浏览器中展示3D物件
cover: //img.aotu.io/Littly/title.png
date: 2015-11-24 13:00:35
categories: Web开发
tags: three.js
author: 
	nick: Littly
	github_name: Littly
---
这是一篇介绍如何在浏览器中展示<del style="background-color: #333!important;color: #333 !important;">洗面奶</del>3D物件的文章。
<!-- more --> 

### 前言

这篇文章仅仅是向你介绍应对下面这种的场景的方法：如果有人突然跟你说，你的皮肤挺不错的耶，你用的什么洗面奶，我也想买一个，你会怎么回答呢？手头又没法拿出你的洗面奶给他看，光凭言语无法准确地形容出你的洗面奶到底长什么样。作为前端的程序猿，我会想，这种时候如果可以有一个链接让对方自己去看一下把玩一下，对方势必会对你的洗面奶<del style="background-color: #333!important;color: #333 !important;">高Bigger</del>有更深刻的认识。本文的目的，就是向屏幕对面的程序猿介绍这种高效<del style="background-color: #333!important;color: #333 !important;">搞笑</del>的方式。


### 走进3D的世界

在页面里面放几个图片是完全无法满足让观看者自己看自己把玩的要求的。所以这里我们将会使用3D的形式来展现我们的洗面奶。老话说得好，同样是山，却有横看成岭侧成峰的不同。比起2D渲染，3D渲染多了一个维度，由于透视效果，物体遮挡、光照角度、光的反射折射等的存在，观看者在不同的角度观看会得到不同的结果。

在浏览器里面，CSS3提供了3D变换的相关属性，但对于光照相关的需求却是无能为力。而使用Canvas进行绘制的话，如果不依赖封装好的图形库，进行图形变换又是相当麻烦的事情。就算是在CSS中一个简单的2D旋转或者是放大，在Canvas的像素操作中，我们还需要通过矩阵计算才能知道变换后每个像素的位置。正因如此，图形库出现了。

说到图形库，我们不得不提到[OpenGL](http://www.opengl.org)。OpenGL是一个跨平台的图形编程规范，定义了2D与3D绘制中所需要各种接口，进行图形绘制中所需要的变换，纹理映射，光照等。OpenGL定义的接口很多是为硬件加速设计的。有了各大硬件厂商的支持，OpenGL的渲染效率比起软件渲染高了不止一点点。同时，OpenGL不局限于某平台或者是语言，它只是一个关于图形渲染的规范，对外提供关于图形渲染的各种接口，所以有许多的语言绑定，而在浏览器中用到的是Javascript的绑定WebGL。

### ThreeJS

[ThreeJS](http://threejs.org/)是一款在浏览器中进行3D绘制的Javascript库，为使用canvas绘制，WebGL渲染等图形操作提供了简便的API。到底有多简便？在[PixiJS](http://www.pixijs.com)等2D绘制库中，我们需要场景+物件+贴图来搞定一张图，而在ThreeJS中我们只需要在这基础上额外添加适当光照与一台照相机而已，下面是一个最简单的Demo，绘制了一个旋转的绿色立方体。

```javascript
	var scene = new THREE.Scene();
	/*创建场景*/
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
	/*创建照相机*/
	var renderer = new THREE.WebGLRenderer();
	/*创建渲染器*/
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	/*创建几何模型*/
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	/*创建材质*/
	var cube = new THREE.Mesh( geometry, material );
	/*几何模型与材质合成为物件*/
	scene.add( cube );
	/*将物件添加入场景*/

	camera.position.z = 5;

	var render = function () {
		requestAnimationFrame( render );
		cube.rotation.x += 0.1;
		cube.rotation.y += 0.1;
		renderer.render(scene, camera);
		/*渲染出在相机camera中看到的scene场景*/
	};

	render();
```

画出来就像这样子：
![旋转立方体](//img.aotu.io/Littly/rollingCube.png)

ThreeJS中提供了少量基础的几何模型，如长方体(Box3)，球体(Sphere)等，但面对我们要实现的洗面奶还是太小儿科了。这是不是说明我们的洗面奶没办法做了？文章都写到这里了，办法肯定是有的。ThreeJS提供了加载外部模型的模块(Loader)，可以加载外部的Obj，json等格式的模型。另外，ThreeJS的[Github仓库](https://github.com/mrdoob/three.js/tree/master/utils/exporters)中还提供了在3ds Max、Blender等3D绘制软件中导出模型的工具。是的，我们就可以用别的3D建模软件建模再导出成ThreeJS所需要的格式了。

### 动手

我们这里使用的是建模工具是Blender。我们需要先拍下物体的三视图作为建模的参考。导入Blender后，依据三视图，我们很快就可以建出洗面奶的模型。

模型的样子
![建模](//img.aotu.io/Littly/modeling.png)

在Blender中加上ThreeJS的插件之后，我们可以在Blender的文件菜单中见到Export/Three.js(.json)选项。点击之后，选择导出的目录，然后记得在左下角勾上我们要导出的元素。在这个例子中，我们需要导出的是Scene，也就是场景本身。
![导出菜单](//img.aotu.io/Littly/exporting.jpg)

在ThreeJS中进行导入的操作也十分简单。ThreeJS中提供了许多种类的Loader，分别针对不同的使用需求。比如，JSONLoader针对的是.json格式的模型，OBJLoader针对的是.obj格式的模型等等。翻阅网上资料的时候还可以看到SceneLoader的踪影，这就是用来加载整个场景的.json格式文件的。可是在ThreeJS的新版本中，SceneLoader已经被废弃，取而代之的是更为牛叉更为智能的ObjectLoader。ObjectLoader可以判断导出的模型到底是什么种类，从而将它们转化为ThreeJS中的对应对象便于开发者使用。

在这个例子中，我们导出的.json文件中包含的是场景本身。所以，除了需要添加部分ObjectLoader的代码，其余部分的代码甚至比上面那个例子还要简单：

```javascript
	var scene,
		camera,
		renderer,
		loader,
		wid,
		hei,
		animate;
		
	animate = function () {
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	};

	wid = window.innerWidth;
	hei = window.innerHeight;
	camera = new THREE.PerspectiveCamera(45, wid / hei, 1, 1000);
	/*创建照相机*/

	camera.position.set(10, 10, 10);
	camera.lookAt(new THREE.Vector3(-1, -1, -1));

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(wid, hei);

	loader = new THREE.ObjectLoader();
	/*创建ObjectLoader*/

	document.body.appendChild(renderer.domElement);

	loader.load('objs/object.json', function (_sce) {
		scene = _sce;
		scene.add(camera);
		animate();
	});
	/*加载Scene，成功后执行回调开始动画*/
```
	
浏览器中一看，却不太对劲。形状对了，可是颜色呢？高端黑的洗面奶怎么就变成这么山寨的颜色了，而且每次刷新都变颜色。活了二十几年，小便表示还真没见到过这样的洗面奶。

![跑马灯](//img.aotu.io/Littly/neverseen.png)

出现这种情况，毫无疑问是材质的问题。原来我们在建模软件中还没给洗面奶加过材质，所以ThreeJS加载完我们的.json文件后，发现只有模型却没有材质，就给模型加上了一个随机颜色的材质。解决办法也很简单，在ThreeJS中手动贴上贴图就好了。而更简单且有效的办法是，在建模软件中上好贴图再一起导出。

回到Blender中，将洗面奶的表面进行UV展开后导出展开图后，我们新建一张图片，将我们要贴的图放到展开图上的相应位置，再回到Blender中将这张新的图片设为瓶身的材质。渲染一下，检查到效果无误后，将模型导出。这次要记得将左下角的Materials勾上，另外还需要勾上texture的复选框。

将这次导出的模型放到先前的目录下，我们会发现，浏览器中并没有出现想象中的场景。在控制台中可以看到，由于我们没有将贴图一起放到一个目录下，贴图加载失败了。按照要求放好后，我们会更惊奇地发现，浏览器中除了一片黑，什么都没有。这是为什么呢？
![一片黑](//img.aotu.io/Littly/dark.png)

> 神说要有光，所以就有了光。

在3D的世界中，光是非常重要的存在。我们之所以能看见物体，都是因为有光进入了我们的眼球。除去本身会发光的物体，我们能看见的其他的物体，都是因为这些物体将外界的光反射后进入我们眼球了。换句话说，没有光的话我们就什么都看不到。

在ThreeJS中也是如此。如果没有光，我们就看不到自发光以外的材质，视野中将是一片黑。在ThreeJS中，光照也有很多种：全局光照(AmbientLight),有向光(DirectionalLight)，点光源(PointLight)等。在这个例子中，为了360观看整个物体，我们添加一个全局光照。

```javascript
	var light = new THREE.AmbientLight( 0xffffff );
	scene.add( light );
```
	
再刷新一下，就可以看见我们的洗面奶了。大功告成!
![成功](//img.aotu.io/Littly/completed.png)


### 小结

进行3D建模，将物体在浏览器中展示，目前已经有了不少的应用，有的公司在宣传新产品的时候会使用上这样的技术，让消费者可以在浏览器中亲自把玩产品，观察产品的每个小角落，起到了不错的效果。同样的技术并不只是在展示商品的时候能用上。将适当的全景图贴在立方体的内表面，用户视角置于立方体中心点的话，还可以让用户有置身其境的感觉，可以上下左右转动视角观察一个地点周围的景象，做出街景的效果。可以说，浏览器中的3D技术将会有越来越多的用武之地。
