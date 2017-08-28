title: Three.js 现学现卖
subtitle: 听说七夕过后再看，效果比较好（相信我）。
cover: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/cover.png
date: 2017-08-28 12:00
categories: Web开发
tags:
  - three.js
  - webgl
  - 3d
  - opengl
author:
    nick: J.c
    github_name: JChehe
wechat:
    share_cover: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/wx_cover.jpg
    share_title: Three.js 现学现卖
    share_desc: 内容无法描述


---

<!-- more -->
## 引言
 > 三维计算机图形和二维计算机图形的不同之处在于计算机存储了几何数据的三维表示，其用于计算和绘制最终的二维图像。——[《3D computer graphics》][1]

随着 WebGL 标准的快速推进，越来越多团队尝试在浏览器上推出可交互的 3D 作品。相较于二维场景，它更能为用户带来真实和沉浸的体验。

然而 OpenGL 和 WebGL（基于 OpenGL ES） 都比较复杂，Three.js 则更适合初学者。本文将分享一些 Three.js 的基础知识，希望能让你能有所收获。

当然，分享的知识点也不会面面俱到，想更深入的学习，还得靠大家多看多实践。另外，为了控制篇幅，本文更倾向于通过案例中的代码和注释进行阐述一些细节。

若想系统学习，笔者认为看书是一个不错的选择：

![Three.js开发指南（原书第2版）][2]  
Three.js开发指南（原书第2版） [购买链接>>][3]

尽管由于 Three.js 的不断迭代，书本上的某些 API 已改变（或弃用），甚至难免还有一些错误，但这些并不影响整体的阅读。

## Canvas 2D
如引言中说道，3D 图像在计算机中最终以 2D 图像呈现。因此，渲染模式只是作为一个载体。下面我们用 JavaScript（无依赖） 在 Canvas 2D 渲染一个在正视图/透视图中的立方体。

正视图中的立方体：
<p data-height="292" data-theme-id="0" data-slug-hash="obapXL" data-default-tab="result" data-user="SitePoint" data-embed-version="2" data-pen-title="3D Orthographic View" class="codepen">See the Pen <a href="https://codepen.io/SitePoint/pen/obapXL/">3D Orthographic View</a> by SitePoint (<a href="https://codepen.io/SitePoint">@SitePoint</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script> 


透视图中的立方体：
<p data-height="265" data-theme-id="0" data-slug-hash="VeEyvm" data-default-tab="result" data-user="SitePoint" data-embed-version="2" data-pen-title="3D Perspective View" class="codepen">See the Pen <a href="https://codepen.io/SitePoint/pen/VeEyvm/">3D Perspective View</a> by SitePoint (<a href="https://codepen.io/SitePoint">@SitePoint</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


若要将三维图形渲染在二维屏幕上，需要将三维坐标以某种方式转为二维坐标。但对于更复杂的场景，大量坐标的转换和阴影等耗性能操作无疑需要 Web 提供更高效的渲染模式。

另外，想了解上述两个案例的实现原理，可查看译文：[《用 JavaScript 构建一个3D引擎》][4]。

## WebGL
[WebGL][5]（Web Graphics Library）在 GPU 中运行。因此需要使用能够在 GPU 上运行的代码。这样的代码需要提供成对的方法（其中一个叫顶点着色器， 另一个叫片段着色器），并且使用一种类 C/C++ 的强类型语言 GLSL（OpenGL Shading Language)。 每一对方法组合起来称为一个 program（着色程序）。

顶点着色器的作用是计算顶点的位置。根据计算出的一系列顶点位置，WebGL 可以对点、线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片段着色器方法。片段着色器的作用是计算出当前绘制图元中每个像素的颜色值。


用 WebGL 绘制一个三角形：
<p data-height="380" data-theme-id="0" data-slug-hash="OjoYbW" data-default-tab="js,result" data-user="JChehe" data-embed-version="2" data-pen-title="WebGL - Fundamentals" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/OjoYbW/">WebGL - Fundamentals</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


查看上述案例的代码实现后，我们发现绘制一个看似简单的三角形其实并不简单，它需要我们学习更多额外的知识。

因此，对于刚入门的开发者来说，直接使用 WebGL 来绘制并拼装出几何体是不现实的。但我们可以在了解 WebGL 的基础知识后，再通过 Three.js 这类封装后的库来现实我们的需求。

## Three.js

打开 [Three.js 官方文档][6] 并阅览左侧的目录，发现该文档对初学者并不友好。但相对于其他资料，它提供了最新的 API 说明，尽管有些描述并不详细（甚至需要在懂 WebGL 等其他知识的前提下，才能了解某个术语的意思）。下面提供两个 Three.js 的相关图片资料，希望它们能让你对 Three.js 有个整体的认识：

![Three.js 文档的结构][7]  
Three.js 文档结构：[图片来自>>][8]

![Three.js 核心对象结构和基本的渲染流程][9]  
Three.js 核心对象结构和基本的渲染流程：[图片来自>>][10]

### Three.js 的基本要素

我们先通过一个简单但完整的案例来了解 Three.js 的基本使用：
```
// 引入 Three.js 库
<script src="https://unpkg.com/three"></script>

function init () {
    // 获取浏览器窗口的宽高，后续会用
    var width = window.innerWidth
    var height = window.innerHeight

    // 创建一个场景
    var scene = new THREE.Scene()

    // 创建一个具有透视效果的摄像机
    var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800)

    // 设置摄像机位置，并将其朝向场景中心
    camera.position.x = 10
    camera.position.y = 10
    camera.position.z = 30
    camera.lookAt(scene.position)

    // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
    var renderer = new THREE.WebGLRenderer()

    // 设置渲染器的清除颜色（即背景色）和尺寸
    renderer.setClearColor(0xffffff)
    renderer.setSize(width, height)

    // 创建一个长宽高均为 4 个单位长度的立方体（几何体）
    var cubeGeometry = new THREE.BoxGeometry(4, 4, 4)

    // 创建材质（该材质不受光源影响）
    var cubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    })

    // 创建一个立方体网格（mesh）：将材质包裹在几何体上
    var cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

    // 设置网格的位置
    cube.position.x = 0
    cube.position.y = -2
    cube.position.z = 0

    // 将立方体网格加入到场景中
    scene.add(cube)

    // 将渲染器的输出（此处是 canvas 元素）插入到 body 中
    document.body.appendChild(renderer.domElement)

    // 渲染，即摄像机拍下此刻的场景
    renderer.render(scene, camera)
}
init()
```

在线案例：
<p data-height="212" data-theme-id="0" data-slug-hash="YxvXOe" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="threejs-blog-01-hello-world" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/YxvXOe/">threejs-blog-01-hello-world</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

看完上述案例代码后，你可能会产生以下几个疑问：

 1. Three.js 的单位是什么？
 2. 坐标系的位置和指向是？
 3. 具有透视效果的摄像机的参数含义是？
 4. Mesh 的作用是？

下面我们逐一回答：

##### 1. Three.js 的单位是什么？
 答：Three.js 基于 OpenGL，那我们从 OpenGL 文档看到这么一句话：
 "The preceding paragraph mentions inches and millimeters - do these really have anything to do with OpenGL? The answer is, in a word, no. The projection and other transformations are inherently unitless. If you want to think of the near and far clipping planes as located at 1.0 and 20.0 meters, inches, kilometers, or leagues, it's up to you. The only rule is that you have to use a consistent unit of measurement. Then the resulting image is drawn to scale." ——[《OpenGL Programming Guide》][11]
中文：前面段落提及的英寸和毫米真的和 OpenGL 有关系吗？**没有**。投影和其它变换在本质上都是无单位的。如果你想把近距离和远距离的裁剪平面分别放置在 1.0 和 20.0 米/英寸/千米/里格，这取决于你。这里唯一的要求是你必须使用统一的测量单位，然后按比例绘制最终图像。

##### 2. 坐标系的位置和指向是？
 答：Three.js 的坐标系是遵循右手坐标系，如下图：  
 ![右手坐标系][12]  
 右手坐标系

 坐标系的原点在画布中心（`canvas.width / 2`, `canvas.height / 2`）。我们可以通过 Three.js 提供的 `THREE.AxisHelper()` 辅助方法将坐标系可视化。
 
 RGB颜色分别代表 XYZ 轴：
 <p data-height="243" data-theme-id="0" data-slug-hash="KvedQN" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="threejs-blog-02-axis" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/KvedQN/">threejs-blog-02-axis</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


另外，补充一点：对于旋转 `cube.rotation` 正值是逆时针旋转，负值是顺时针旋转。  

##### 3. 具有透视效果的摄像机的参数含义是？

答： `THREE.PerspectiveCamera(fov, aspect, near, far)` 具有 4 个参数，具体解释如下：

| 参数 | 描述 |
|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| fov | fov 表示视场，即摄像机能看到的视野。比如，人类有接近 180 度的视场，而有些鸟类有接近 360 度的视场。但是由于计算机不能完全显示我们能够所看到的景象，所以一般会选择一块较小的区域。对于游戏而言，视场大小通常为 60 ~ 90 度。<br>推荐默认值为：50 |
| aspect | 指定渲染结果的横向尺寸和纵向尺寸的比值。在我们的示例中，由于使用窗口作为输出界面，所有使用的是窗口的长宽比。<br>推荐默认值：window.innerWidth / window.innerHeight |
| near | 指定从距离摄像机多近的距离开始渲染。<br>推荐默认值：0.1 |
| far | 指定摄像机从它所处的位置开始能看到多远。若过小，那么场景中的远处不会被渲染；若过大，可能会影响性能。<br>推荐默认值：1000 |

![PerspectiverCamera][13]     
透视摄像机的参数图示

摄像机的 `fov` 属性指定了横向视场。基于 `aspect` 属性，纵向视场也就相应确定了。而近面和远面则指定了可视化区域的前后边界，即两者之间的元素才可能被渲染。

Three.js 还提供了其他 3 种摄像机：[CubeCamera][14]、[OrthographicCamera][15]、[StereoCamera][16]。

其中 OrthographicCamera 是正交投影摄像机，他不具有透视效果，即物体的大小不受远近距离的影响。

切换正交投影摄像机和透视摄像机：
<p data-height="265" data-theme-id="0" data-slug-hash="rzZgmQ" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="switchCamera" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/rzZgmQ/">switchCamera</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

##### 4. Mesh 的作用是？
 答：Mesh 好比一个包装工，它将『可视化的材质』粘合在一个『数学世界里的几何体』上，形成一个『可添加到场景的对象』。   
当然，创建的材质和几何体可以多次使用（若需要）。而且，包装工不止一种，还有 `Points`（点集）、`Line`（线/虚线） 等。

同一个几何体的多种表现形式：
<p data-height="217" data-theme-id="0" data-slug-hash="zdJQze" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="multi-appearance" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/zdJQze/">multi-appearance</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


#### Three.js 提供的所有物体

从 Three.js 文档目录的 `Geometries` 可看到，Three.js 已为我们提供了很多现成的几何体，但如果对几何知识不常接触，可能就很难从它的英文名字联想到其实际的形状。下面我们将它们一次性罗列出来：

Three.js 提供的 18 个几何体：
<p data-height="400" data-theme-id="0" data-slug-hash="YxObEw" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="all-the-geometry" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/YxObEw/">all-the-geometry</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>
 
目前 Three.js 一共提供了 22 个 Geometry，除了 `EdgesGeometry`、`ExtrudeGeometry`、`TextGeometry`、`WireframeGeometry`，上面涵盖 18 个，它们分别是底层的 `planeGeometry` 和以下 17 种（顺序与上述案例一一对应，下同）：

| BoxGeometry（长方体） | CircleGeometry（圆形） | ConeGeometry（圆锥体） | CylinderGeometry（圆柱体） |
|----------------------------------------|---------------------------------|------------------------------------------------------------|---------------------------------|
| DodecahedronGeometry（十二面体） | IcosahedronGeometry（二十面体） | LatheGeometry（让任意曲线绕 y 轴旋转生成一个形状，如花瓶） | OctahedronGeometry（八面体） |
| ParametricGeometry（根据参数生成形状） | PolyhedronGeometry（多面体） | RingGeometry（环形） | ShapeGeometry（二维形状） |
| SphereGeometry（球体） | TetrahedronGeometry（四面体） | TorusGeometry（圆环体） | TorusKnotGeometry（换面纽结体） |
| TubeGeometry（管道） | \ | \ | \ |


剩余的 TextGeometry、EdgesGeometry、WireframeGeometry、ExtrudeGeometry 我们单独拿出来解释：

<p data-height="326" data-theme-id="0" data-slug-hash="GvXaxr" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="the-remaining-geomtry" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/GvXaxr/">the-remaining-geomtry</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

| / | TextGeometry | / |
|---------------|:-----------------:|----------------:|
| EdgesGeometry | WireframeGeometry | ExtrudeGeometry |

如案例所示，EdgesGeometry 和 WireframeGeometry 更多地可能作为辅助功能去查看几何体的边和线框（三角形图元）。

ExtrudeGeometry 则是按照指定参数将一个二维图形沿 z 轴拉伸出一个三维图形。

TextGeometry 则需要从外部加载特定格式的字体文件（可在 [typeface.js][17] 网站上进行转换）进行渲染，其内部依然使用 ExtrudeGeometry 对字体进行拉伸，从而形成三维字体。另外，该类字体的本质是一系列类似 SVG 的指令。所以，字体越简单（如直线越多），就越容易被正确渲染。


以上就是目前 Three.js 提供的几何体，当然，这些几何体的形状也不仅于此，通过改变参数即能生成更多种类的形状，如 `THREE.CircleGeometry` 可生成扇形。

另外，通过 `console.log` 查看任意一个 `geometry` 对象可发现，在 Three.js 中的几何体基本上是三维空间中的点集（即顶点）和这些顶点连接起来的面组成的。以立方体为例（widthSegments、heightSegments、depthSegments 均为 1 时）：

 - 一个立方体有 8 个顶点，每个顶点通过 x、y 和 z 坐标来定义。
 - 一个立方体有 6 个面，而每个面都包含两个由 3 个顶点组成的三角形。

对于 Three.js 提供的几何体，我们不需要自己定义这些几何体的顶点和面，只需提供 API 指定的参数即可（如长方体的长宽高）。当然，你仍然可以通过定义顶点和面来创建自定义的几何体。如：

```
var vertices = [
    new THREE.Vector3(1, 3, 1),
    new THREE.Vector3(1, 3, -1),
    new THREE.Vector3(1, -1, 1),
    new THREE.Vector3(1, -1, -1),
    new THREE.Vector3(-1, 3, -1),
    new THREE.Vector3(-1, 3, 1),
    new THREE.Vector3(-1, -1, -1),
    new THREE.Vector3(-1, -1, 1)
]

var faces = [
    new THREE.Face3(0, 2, 1),
    new THREE.Face3(2, 3, 1),
    new THREE.Face3(4, 6, 5),
    new THREE.Face3(6, 7, 5),
    new THREE.Face3(4, 5, 1),
    new THREE.Face3(5, 0, 1),
    new THREE.Face3(7, 6, 2),
    new THREE.Face3(6, 3, 2),
    new THREE.Face3(5, 7, 0),
    new THREE.Face3(7, 2, 0),
    new THREE.Face3(1, 3, 4),
    new THREE.Face3(3, 6, 4)
]

var geometry = new THREE.Geometry()
geometry.vertices = vertices
geometry.faces = faces
geomtry.computeFaceNormals()
```

上述代码需要注意的点有：

 1. 创建面时顶点的顺序，因为顶点顺序决定了某个面是面向摄像机还是背向摄像机。顶点的顺序是逆时针则是面向摄像机，反之则是背向摄像机。
 2. 出于性能的考虑，Three.js 认为几何体在整个生命周期都不会更改。若出现更改（如某顶点的位置），则需要告诉 geometry 对象的顶点需要更新 `geometry.verticesNeedUpdate = true`。更多**关于需要主动设置变量来开启更新**的事项，可查看官方文档的 [How to update things][18]。


#### 声音
我们从文档目录中竟然发现有 `Audio` 音频对象，为什么 Three.js 不是游戏引擎，却带个音频组件呢？原来这个音频也是 3D 的，它会受到摄像机的距离影响：

 1. 声源离摄像机的距离决定着声音的大小。
 2. 声源在摄像机左右侧的位置分别决定着左右扬声器声音的大小。

我们可以到 [官方案例][19] 亲自体验一下 `Audio` 的效果。

 
### 常见的插件
在 Three.js 的官方案例中，你几乎都能看到左右上角的两个常驻控件，它们分别是：JavaScript 性能监测器 [stats.js][20] 和可视化调参插件 [dat.GUI][21]。

#### stats.js
stats.js 为开发者提供了易用的性能监测功能，它目前支持四种模式：

 - 帧率
 - 每帧的渲染时间
 - 内存占用量
 - 用户自定义

![FPS][22] ![每帧渲染时间][23] ![内存占用量][24] ![用户自定义][25]  

#### dat.GUI
[dat.GUI][26] 为开发者提供了可视化调参的面板，对参数调整的操作提供了极大的便利。
![dat.gui][27]  

关于这两个插件的使用，请查看他们的官方文档或 Three.js 官方案例中的代码。



## 其他一些东西

### 自适应屏幕（窗口）大小
```
window.addEventListener('resize', onResize, false)

function onResize () {
    // 设置透视摄像机的长宽比
    camera.aspect = window.innerWidth / window.innerHeight
    // 摄像机的 position 和 target 是自动更新的，而 fov、aspect、near、far 的修改则需要重新计算投影矩阵（projection matrix）
    camera.updateProjectionMatrix()
    // 设置渲染器输出的 canvas 的大小
    renderer.setSize(window.innerWidth, window.innerHeight)
}
```

### 阴影
阴影是增强三维场景效果的重要因素，但 Three.js 出于性能考虑，默认关闭阴影。下面我们来看看如何开启阴影的。

1. 渲染器启用阴影
```
renderer.shadowMap.enabled = true
```
2. 指定哪个光源能产生阴影
```
// 并不是所有类型的光源能产生投影，不能产生投影的光源有：环境光（AmbientLight）、半球光（HemisphereLight）
spotLight.castShadow = true
```
3. 指定哪个物体能投射阴影，哪个物体能接受阴影（在 CSS 中，我们都会认为只有背景接受阴影，毕竟它们都是平面）
```
// 平面和立方体都能接受阴影
plane.receiveShadow = true
cube.receiveShadow = true

// 球体的阴影可以投射到平面和球体上
sphere.castShadow = true
```
4. 更改阴影质量
```
// 更改渲染器的投影类型，默认值是 THREE.PCFShadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// 更改光源的阴影质量，默认值是 512
spotLight.shadow.mapSize.width = 1024 
spotLight.shadow.mapSize.height = 1024
```

产生阴影：
<p data-height="291" data-theme-id="0" data-slug-hash="VzGJZP" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="shadow" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/VzGJZP/">shadow</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### 雾化效果
雾化效果是指：场景中的物体离摄像机越远就会变得越模糊。

目前，Three.js 提供两种雾化效果：
```
// Fog( hex, near, far )，线性雾化。
// near 表示哪里开始应用雾化效果
// far 表示雾化效果在哪里结束
scene.fog = new THREE.Fog( 0xffffff, 0.015, 100 )

// FogExp2( hex, density )，指数雾化
// density 是雾化强度
scene.fog = new THREE.FogExp2( 0xffffff, 0.01 )

// 雾化效果默认是全局影响的，若某个材质不受雾化效果影响，则可为材质的 fog 属性设置为 false（默认值 true）
var material = new THREE.Material({
    fog: false
})
```

查看不同位置的立方体：
<p data-height="265" data-theme-id="0" data-slug-hash="Bdqoeb" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="fog" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/Bdqoeb/">fog</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Low Poly

其实，对于前端开发来说，能做到用代码实现就要尽量不用外部加载的图片（纹理）来装饰物体就最好了。对于前面提及的几何体，其实只要发挥我们的创意，就能将不起眼的它们变得有魅力，如 Low Poly。

圣诞树：
<p data-height="265" data-theme-id="0" data-slug-hash="pNOgwp" data-default-tab="result" data-user="agar" data-embed-version="2" data-pen-title="Step Five" class="codepen">See the Pen <a href="https://codepen.io/agar/pen/pNOgwp/">Step Five</a> by Matt Agar (<a href="https://codepen.io/agar">@agar</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

更多关于 Low Poly 风格的案例和学习资料：

 - 圣诞树：https://www.august.com.au/blog/animating-scenes-with-webgl-three-js/
 - 飞行者（The Aviator）小游戏：https://tympanus.net/codrops/2016/04/26/the-aviator-animating-basic-3d-scene-threejs/
 - Yakudoo's Codepen：https://codepen.io/Yakudoo/

  
### 渲染器剔除模式（Face culling）

CSS3 有一个 `backface-visibility` 属性，它指定当元素背面朝向用户时，该元素是否可见。因为元素背面的背景颜色是透明的，所以当其可见时，就会显示元素正面的镜像。

而在 Three.js 中，材质默认只应用在正面（THREE.FrontSide），即当你旋转物体（或摄像机）查看物体的背面时，它会因为未被应用材质而变得透明（即效果与 CSS3 backface-visibility: hidden 一样）。因此，当你想让物体正反两面均应用材质，则需要在创建材质时声明 side 属性为 `THREE.DoubleSide`：

```
var material = new THREE.MeshBasicMaterial({
    side: THREE.DoubleSide // 其他值：THREE.FrontSide（默认值）、THREE.BackSide
})
```

当然，为几何体正反两面均应用材质时，会让渲染器做更多工作，从而影响性能。同理，对于 CSS3，若对动画性能有更高的追求，则可以尝试显示地为 `transform` 动画元素设置其背面不可见 `backface-visibility: hidden;`，这样也许能提高性能。

可你是否见过或想到过这样的一个应用场景：

![3D 看房][28]  
3D 看房

当你旋转时，面向用户的墙都会变得透明，从而实现 360 度查看房子内部结构的效果。

剔除外部立方体正面：
<p data-height="265" data-theme-id="0" data-slug-hash="WEgqNg" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="Face culling" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/WEgqNg/">Face culling</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

上述案例会实时剔除外层立方体的正面，从而保证其内部可见。

这里其实涉及到 OpenGL 的 Face culling 的知识点。出于性能的考虑，Three.js 默认开启 Face culling 特性，且将剔除模式设置为 `CullFaceBack`（默认值），这样就可剔除对于观察者不可见的反面 。

因此，当我们将剔除模式设置为 `CullFaceFront`（剔除正面） 时，就会发生以上效果。一切看起来都是这么自然。其实仔细想想，就会发现有点不对劲。

1. 假设一个面由正面和反面组成，那现在只剔除正面，那该面的反面不就显示出来了？
答：其实正面还是反面是相对于观察者的，而不是说一个面由正面和反面组成。当然你也可以认为一个面是无限扁的，由正反两面组成，但只有面向观察者的一面才可见。
2. 那现在被显示出来的面都是反面（相对于观察者），而这些反面并没有应用材质（`side: THREE.BackSide` 或 `THREE.DoubleSide`），那它不应该也是不可见的吗？
答：笔者反复试验和查阅资料后，仍然没得出答案，若你知道原因麻烦告诉我哦。

关于 OpenGL 的 Face culling 更多知识，可阅读：[《Learn OpenGL》][29]。


### 粒子化

对于粒子化效果，相信大家都不陌生。前段时间的 [《腾讯的 UP2017》][30] 就是应用 Three.js 实现粒子化效果的精彩案例。

对于 Three.js，实现粒子效果的方法有两种：`THREE.Sprite( material )` 和 `THREE.Points( geometry, material )`。而且这两者都会一直面向摄像机（无论你旋转摄像机还是设置粒子的 `rotation` 属性）。

下面基于 `THREE.Sprite` 实现一个简单的 10 x 10 粒子效果（可拖拽旋转）：

<p data-height="265" data-theme-id="0" data-slug-hash="qXMzEZ" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="sprite" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/qXMzEZ/">sprite</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

当粒子数量较小时，一般不会存在性能问题。但随着数量的增长，就会很快遇到性能瓶颈。此时，使用 `THREE.Points` 更为合适。因为 Three.js 不在需要管理大量 `THREE.Sprite` 对象，而只需管理一个 `THREE.Points` 对象。

下面我们用 `THREE.Points` 实现上一个案例的效果：
<p data-height="265" data-theme-id="0" data-slug-hash="wqELBj" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="points" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/wqELBj/">points</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

从上述两个案例可看到，粒子默认形状是正方形。若想改变它的形状，则需要用到**纹理**。样式化粒子的纹理一般有两种方式：加载外部图片和 Canvas 2D 画布。

Canvas 2D 画布：
<p data-height="265" data-theme-id="0" data-slug-hash="oePrXY" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="points-canvas" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/oePrXY/">points-canvas</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

加载外部图片：
<p data-height="265" data-theme-id="0" data-slug-hash="ayagvv" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="points-img" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/ayagvv/">points-img</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

上一个案例中，我们加载了两个不同的纹理。由于 `THREE.Points` 的局限性（一个材质只能对应一种纹理），若想添加多个纹理，则需要创建相应个数的 `THREE.Points` 实例，而 `THREE.Sprite` 在此方面显得更灵活一些。

上述粒子效果都是我们手动设置各个粒子的具体位置，若想将特定形状通过粒子效果显示，则可以直接将该几何体（geometry）传入 `THREE.Points( geometry, material )` 的第一个参数即可。

<p data-height="265" data-theme-id="0" data-slug-hash="Ojoeyv" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="points-models" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/Ojoeyv/">points-models</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


### 点击物体

鼠标作为 PC 端（移动端中的触摸）的主要交互方式，我们经常会通过它来选择页面上的元素。而对于 Three.js，它没有类似 DOM 的层级关系，并且处于三维环境中，那么我们则需要通过以下方式来判断某对象是否被选中。
```
function onDocumentMouseDown(event) {
    var vector = new THREE.Vector3(( event.clientX / window.innerWidth ) * 2 - 1, -( event.clientY / window.innerHeight ) * 2 + 1, 0.5);
    vector = vector.unproject(camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects([sphere, cylinder, cube]);

    if (intersects.length > 0) {

        console.log(intersects[0]);
        
        intersects[0].object.material.transparent = true;
        intersects[0].object.material.opacity = 0.1;
    }
}
```

当点击鼠标时，上述代码会发生以下处理：

1. 基于屏幕上的点击位置创建一个 THREE.Vector3 向量。
2. 使用 vector.unproject 方法将屏幕上的点击位置转换成 Three.js 场景中的坐标。换句话说，就是将屏幕坐标转换成三维场景中的坐标。
3. 创建 THREE.Raycaster。使用 THREE.Raycaster 可以向场景中发射光线。在下述案例中，从摄像机的位置（camera.position）向场景中鼠标的点击位置发射光线。
4. 使用 raycaster.intersectObjects 方法来判断指定的对象中哪些被该光线照射到的。


上述最后一步会返回包含了所有被光线照射到的对象信息的数组（根据距离摄像机距离，由短到长排序）。数组的子项的信息包括有：

```
distance: 49.90470
face: THREE.Face3
faceIndex: 4
object: THREE.Mesh
point: THREE.Vector3
```

点击物体后改变其透明度：
<p data-height="265" data-theme-id="0" data-slug-hash="PKdrZQ" data-default-tab="result" data-user="JChehe" data-embed-version="2" data-pen-title="mouse-select" class="codepen">See the Pen <a href="https://codepen.io/JChehe/pen/PKdrZQ/">mouse-select</a> by Jc (<a href="https://codepen.io/JChehe">@JChehe</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>


## 最后

最后，乱七八糟地整理了自己最近学 Three.js 的相关知识，其中难免出现一些自己理解不透彻，甚至是错误的观点，希望大家能积极提出来。当然，笔者也会捉紧学习，不断完善文章。希望大家多多关注 [凹凸实验室][31]。感谢~👏


## 参考资料

 - [Three.js 开发指南][32]
 - [WebGL Fundamentals][33]
 - [dragon/threejs教程][34]


  [1]: https://en.wikipedia.org/wiki/3D_computer_graphics
  [2]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/book.png
  [3]: https://item.jd.com/12113317.html
  [4]: http://web.jobbole.com/86929/
  [5]: https://www.khronos.org/webgl/
  [6]: https://threejs.org/docs/#manual/introduction/Creating-a-scene
  [7]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/threejs_components.jpg
  [8]: https://teakki.com/p/58a3ef1bf0d40775548c908f
  [9]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/three_render.jpg
  [10]: http://ushiroad.com/3j/
  [11]: http://www.glprogramming.com/red/chapter03.html
  [12]: https://misc.aotu.io/JChehe/2016-8-24-webvr/coordinate.jpg
  [13]: http://7xq7nb.com1.z0.glb.clouddn.com/perspective_camera.png
  [14]: https://threejs.org/docs/index.html#api/cameras/CubeCamera
  [15]: https://threejs.org/docs/index.html#api/cameras/OrthographicCamera
  [16]: https://threejs.org/docs/index.html#api/cameras/StereoCamera
  [17]: https://gero3.github.io/facetype.js/
  [18]: https://threejs.org/docs/index.html#manual/introduction/How-to-update-things
  [19]: https://threejs.org/examples/#misc_sound
  [20]: https://github.com/mrdoob/stats.js/
  [21]: https://workshop.chromeexperiments.com/examples/gui/
  [22]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/fps.png
  [23]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/ms.png
  [24]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/mb.png
  [25]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/custom.png
  [26]: https://workshop.chromeexperiments.com/examples/gui/
  [27]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/datgui.png
  [28]: https://misc.aotu.io/JChehe/2017-08-28-getting-started-with-threejs/cullface.png
  [29]: https://learnopengl.com/#!Advanced-OpenGL/Face-culling
  [30]: http://up.qq.com/act/a20170301pre/index.html
  [31]: https://aotu.io/
  [32]: https://item.jd.com/12113317.html
  [33]: https://webglfundamentals.org/
  [34]: https://teakki.com/p/58a19327f0d40775548c6bd7
