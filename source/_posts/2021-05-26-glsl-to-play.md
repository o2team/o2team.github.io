---
title: GLSL着色器，来玩
date: 2021-03-23 19:11:14
tags: ['GLSL']
---

对实现动画的前端同学们来说，`canvas`可以说是最自由，最能全面控制的一个动画实现载体。不但能通过`javascript`控制点、线、面的绘制，使用图片资源填充；还能改变输入参数作出交互动画，完全控制动画过程中的动作轨迹、速度、弹性等要素。

但使用`canvas`开发过较复杂一点的动画的同学，可能会发现，完全使用`javascript`绘制、控制的动画，某些效果不太好实现（这篇文章只讨论2D），像模糊，光照，水滴等效果。虽然用逐像素处理的方法也可以实现，但`javascript`对这类型大量数据的计算并不擅长，实现出来每一帧绘制的时间十分感人，用他实现动画并不现实。

但`canvas`除了最常用的`javascript` API绘制方式（`getContext('2d')`），还有WebGL的方式（`getContext(webgl)`），对前面说到的大量数据计算的场景，可以说是最适合发挥的地方。WebGL对很多同学来说就是实现3D场景的，其实对2D绘图来说，也有很大的发挥场景。

## 为什么WebGL会比较厉害

我们来看看`javascript` API绘制和webGL绘制原理上的不同之处：

如果使用`javascript`对画布的逐个像素进行处理，那这部分处理工作就需要在`javascript`的运行环境里进行，我们知道`javascript`的执行是单线程的，所以只能逐个逐个像素进行计算和绘制。就像一个细长的漏斗，一滴一滴水的往下漏。

![https://img11.360buyimg.com/imagetools/jfs/t1/159690/37/16529/250457/60632138E30fd5df7/882e91ba77e3a9b6.jpg](https://img11.360buyimg.com/imagetools/jfs/t1/159690/37/16529/250457/60632138E30fd5df7/882e91ba77e3a9b6.jpg)

而WebGL的处理方式，是用GPU驱动的，对每一个像素的处理，都是在GPU上执行，而GPU有许多渲染管道，这些处理可以在这些管道中并行执行，这就是WebGL擅长这种大量数据计算场景的原因。

![https://img12.360buyimg.com/imagetools/jfs/t1/163279/8/15220/308469/60632138E3bea6a6b/8b3372eeb42cc6bb.jpg](https://img12.360buyimg.com/imagetools/jfs/t1/163279/8/15220/308469/60632138E3bea6a6b/8b3372eeb42cc6bb.jpg)

## WebGL那么厉害，都用它绘图就好喇

WebGL虽然有上面说的优点，但也有个致命的缺点：不好学，想要简单画根线也要费一番力气。

GPU并行管道之间是不知道另一个管道输出的是什么，只知道自己管道的输入和需要执行的程序；而且不保留状态，管道自己并不知道在这次任务之前执行过什么程序，有什么输入输出值，类似现在纯函数的概念。这些观念上的不同就提升了使用WebGL绘图的门槛。

另外这些跑在GPU里的程序不是`javascript`，是一种类C语言，这也需要前端同学们另外再学习。

## Hello, world

那门槛再高也总有需要跨过去的一天的，下面一步一步控制WebGL去`画`一点图案，大家也可以体会一下，适合在什么时候使用这一门技术。

### 基础环境——大荧幕

为尽快进入GLSL着色器的阶段，这里基础WebGL环境搭建用了`Three.js`，大家可以研究下这个基础环境的搭建，不用第三方库其实也用不了多少代码量。

以下是基础环境的搭建:

```js
function init(canvas) {
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.autoClearColor = false;
 
  const camera = new THREE.OrthographicCamera(
    -1, // left
     1, // right
     1, // top
    -1, // bottom
    -1, // near,
     1, // far
  );
  const scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(2, 2);

  const fragmentShader = '............'
  const uniforms = {
    u_resolution:  { value: new THREE.Vector2(canvas.width, canvas.height) },
    u_time: { value: 0 }
  };
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));
 
  function render() {
    material.uniforms.u_time.value++;
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render()
}
```

解释一下上面这段代码做了什么：创建了一个3D场景（说好的2D呢？），把一个矩形平面糊在摄像机前面，占满摄像机视觉范围，就像看IMAX坐最前排，你能看到的就只有面前的屏幕的感觉，屏幕上的画面就是你的整个世界。我们的绘图就在这个屏幕上。

再说明一下，着色器分为顶点着色器`VERTEX_SHADER`和片段着色器`FRAGMENT_SHADER`。

顶点着色器对3D场景里物体的每个顶点计算值，如颜色、法线向量等，在这里我们只讨论2D画面，顶点着色器的部分就由`Three.js`代劳了，实现的作用就是固定了场景中镜头和屏幕的位置。

而片段着色器的作用就是计算平面上每一个片段（在这里是屏幕上每一个像素）输出的颜色值，也是这篇文章研究的对象。

片段着色器入参有`varying`和`uniform`两种，`varying`简单说一下是由顶点着色器传入的，每个片段输入的值由相关的顶点线性插值得到，所以每个片段上的值不一样，本文先不讨论这部分（不然写不完了）。`uniform`是统一值，由着色器外部传入，每个片段得到的值是一样的，在这里就是我们从`javascript`输入变量的入口。上面的代码我们就为片段着色器传入了`u_resolution`，包含画布的宽高值。

### 第一个着色器

`fragmentShader`为着色器的程序代码，一般的构成为:

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

在前3行检查了是否定义了`GL_ES`，这通常在移动端或浏览器下会定义，第2行指定了浮点数`float`的精度为中等，也可以指定为低精度`lowp`或高精度`highp`，精度越低执行速度越快，但质量会降低。值得一提的是，同样的设置在不同的执行环境下可能会表现不一样，例如某些移动端的浏览器环境，需要指定为高精度才能获得和PC端浏览器里中等精度一样的表现。

第5行指定了着色器可以接收哪些入参，这里就只有一个入参：类型为vec2的`u_resolution`。

最后3行描述了着色器的主程序，其中可以对入参和其他信息作处理，最后输出颜色到`gl_FragColor`，代表这个片段显示的颜色，其中4个数值代表`RGBA`（红、绿、蓝、透明度），数值范围为`0.0 ~ 1.0`。

为什么要写`0.0`而不是`0`呢，因为`GLSL`里不像`javascript`数字只有一个类型，而是分成整形(`int`)和浮点数(`float`)，而浮点数必须包含小数点，当小数点前是0的时候，写成`.0`也可以。

那大家看完这段解说，应该能猜到上面的着色器会输出什么吧，对，就是全屏的红色。

这就是最基础的片段着色器。


### 使用uniform

大家应该注意到上面的例子没有用到传入的uniform值，下面来说一下这些值怎么用。

看之前搭建基础环境的`javascript`代码可以看到，`u_resolution`存储了画布的宽高，这个值在着色器有什么用呢？

这要说到片元着色器的另一个内建的值`gl_FragCoord`，这个值存储的是片段（像素）的座标`x`，`y`值，使用这两个值就可以知道当前着色器计算的是画布上哪个位置的颜色。举个例子：

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(st, 0.0, 1.0);
}
```

可以看到这样的图像：

![https://img12.360buyimg.com/imagetools/jfs/t1/156235/37/18839/33609/6062ffeaE37643d53/3cb9bd3ca9299815.png](https://img12.360buyimg.com/imagetools/jfs/t1/156235/37/18839/33609/6062ffeaE37643d53/3cb9bd3ca9299815.png)

上面的着色器代码，使用归一化后的`x`、`y`座标输出到`gl_FragColor`的红、绿色部分。

从图中可以看出，`gl_FragCoord`的`(0, 0)`点在左下角，x轴和y轴方向分别为向右和向上。

另一个uniform值`u_time`就是一个随着时间不断增加的值，利用这个值可以使图像随时间变化，实现动画的效果。

上面的着色器再改写一下：

```glsl
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main() {
  vec2 st = gl_FragCoord.xy / u_resolution;
  gl_FragColor = vec4(st, sin(u_time / 100.0), 1.0);
}
```

可以看到下图的效果：

[http://storage.360buyimg.com/element-video/QQ20210330-195823.mp4](http://storage.360buyimg.com/element-video/QQ20210330-195823.mp4)

着色器中使用三角函数`sin`，在颜色输出的蓝色通道做一个从0到1的周期变化。

## 还能做什么？

掌握基本的原理后，就是开始从大师的作品中学习了。[shadertoy](https://www.shadertoy.com/)是一个类似codepen的着色器playgroud，上面的着色器都是利用上面的基本工具，还有一些造型函数，造出各种眼花缭乱的特效、动画。

上面就是GLSL着色器基本的开发工具，现在就可以开始开发你自己的着色器，剩下就是使用数学方面的技能了。