title: webGL基础-着色器
subtitle:
cover: 
categories: Web开发
tags:
  - 3D
  - WebGL
  - Shader
author:
  nick: 杰
  github_name: eijil
  date: 2022-04-20 17:58:08
  
---

 在元宇宙概念的背景下，上级领导也要求做点技术储备，在学习了一些常用的Web3D框架（babylonjs,threejs)后, 好奇于它们的底层原理，所以去了解下webGL的知识，本文主要介绍WebGl中着色器的原理。


## webGL

webGL其实是一个很底层的图像引擎，主要提供的能力就是接收输入的图形的顶点坐标，程序在GPU中帮你画出图形(光珊化)和上色后输出到浏览器，在GPU运行的程序则是一种OpenGL着色语言(GLGS)，一个webGL程序大概是如下步骤、其中最关键的还是着色器部分。

![](https://img10.360buyimg.com/imagetools/jfs/t1/181430/1/23122/47131/625fc3ccE1817f782/68bb2226f2f70419.png)

下面的一些代码基本都会省略api调用部分

## 着色器

简单点的说着色器就干两件事：

1. 根据顶点坐标绘制图像
2. 给图形的每个像素点上色

在`webGL`中分别对应两种着色器，**顶点着色器(vertext shader)** 和 **片元着色器(fragment shader)** ，两种是成对出现的组成一段着色程序在GPU上运行。




## 缓冲区

缓冲是发送到GPU的一些二进制数据序列，通常情况下缓冲数据包括位置，法向量，纹理坐标，顶点颜色值等。 也可以存储任何数据。


如果我们要画一个三角形，那我们在缓冲区写入三个顶点的数据,数据类型是一个`Float32Aarray` 就是一个一维数组:

``` js

//三个2维顶点
var positions = new Float32Array([
     -0.5, -0.5,    //v0
     -0.5,  0.5,    //v1
      0.5, -0.5     //v2
])

//创建buffer等方法省略。。。。

```
在gl中的坐标是一种叫裁切空间的坐标，取值是`(-1,1)`最后渲染后会换算成屏幕空间坐标，假如我们的画布是400x300, 那`(-0.5,0.5)`的坐标就是`(100,225)`。
``` js
（-1,1）                        （1,1）  
 ----------------------------------
 |                                |
 |                                |
 |                                |
 |                                |
 |                                |
 |             (0,0)              |
 |                                |
 |                                |
 |                                |
 |                                |
 ----------------------------------
(-1,-1)                         (1,-1)

```

这是配置顶点数据的，下面我们继续看下画一个三角形顶点着色器和片元着色器的代码：

## 画一个三角形

``` js

//顶点着色器
const vsSource = `
    //属性值，从缓冲中获取数据
    attribute vec4 position;
    void main(void) {
        //gl_Position内置的系统变量，记录顶点坐标
        gl_Position = position;
    }`;

//片元着色器
const fsSource = `
    void main(void) {
      //gl_FragColor内置的系统变量，记录像素颜色
      gl_FragColor = vec4(0.0,  1.0,  0.0,  1.0); //绿色
    }`

//画图
const type = gl.TRIANGLES
const offset = 0 //从第一个顶点开始
const vCount = 3 //总顶点数，执行多少次
gl.drawArrays(type, offset, vCount)

```

**`attributes`** 属性用来指明怎么从缓冲中获取所需数据并将它提供给顶点着色器,前面我们已经在缓冲区创建了一个顶点数组，两个可以理解为等值，通过webGL api绑定后，在顶点着色器中就可以获取到，再赋值给`gl_Position`

**片元着色器** 是在顶点着色器运行完后给图形的每个片元（也可以理解为每个像素）上色，上面代码中我们是设置了固定的颜色，gl中颜色值是`vec4(r,g,b,a)`,每个通道的取值范围是0-1，rgb分别代表红绿蓝，如果红色则是`vec4(1, 0, 0 ,1)`。

最后调用`gl.drawArrays(type, offset, vCount)` 来执行程序，顶点着色器的运行次数是一个确切的数字，例如这个三角形的例子，我们是设置了三个顶点，所以`vCount`这个值就是`3`，每次从属性值中获取`2`个，这个`2`个也是通过api指定的，为了方便理解，代码没有写出来，假设我们是一个三维的图形(x,y,z)，那么就是指定每次获取3个。

如果画个矩形，那就是：
``` js
var positions = new Float32Array([
     -0.5, -0.5,    //v0
     -0.5,  0.5,    //v1
      0.5, -0.5     //v2

     -0.5,  0.5,    //v3
      0.5, -0.5,    //v4
      0.5,  0.5     //v5
])
const type = gl.TRIANGLES
const offset = 0 //从第一个顶点开始
const vCount = 6 //总顶点数，执行多少次
gl.drawArrays(type, offset, vCount)

```

## 给片元着色器传值

前面片元着色器颜色是固定，但在实际程序中，我们可能会给每个三角形设置不同颜色，或者贴图的时候需要传纹理坐标，那么如何传值呢？同样我们需要创建一个buffer,使用关键字`varying`将数据通过顶点着色器再传到片元着色器，如下代码：

``` js
//顶点颜色
const colors = Float32Array([
    0.1, 0.0 , 0.0, 0.1,  //red
    0.1, 1.0 , 0.1, 0.1,  //green
    0.1, 0.0 , 0.1, 0.1,  //blue
])

//顶点着色器
const vsSource = `
    //属性值，从缓冲中获取数据
    attribute vec4 position;
    //缓冲区取color数据
    attribute vec4 colors;
    //定义varying数据
    varying vec4 v_color;
    void main(void) {
        gl_Position = position;
        v_color = colors;
    }`;

//片元着色器
const fsSource = `
    varying vec4 v_color;
    void main(void) {
      gl_FragColor = v_color;
    }`

```
从代码上看我们还是用`attribute`从缓冲区取数据，然后通过`varying`关键字定义了`v_color`，在顶点着色器中赋值，最后片元着色器也是通过`varying` 取到颜色值。我们给三角形三个顶点设置了不同颜色，每个片元的值是由顶点的线性插值得到，所以看到的是下面的渐变的颜色。
![](https://img11.360buyimg.com/imagetools/jfs/t1/200339/34/23479/73833/625fc3ccEcdcb7a01/f91e861b1017ed64.png)


## 执行顺序

根据下图，我们再来梳理下着色器的执行流程，首先在缓冲区中获得数据，顶点着色器根据坐标输出图形（三角形），这一步可以叫做图元装配，确定形状后，我们就知道图形中存在多少片元（像素），每个像素都会调用一次片元着色器进行上色。
![](https://img11.360buyimg.com/imagetools/jfs/t1/123504/28/27636/997473/625fc3cbE8b406d80/1e2186d5500075e6.png)

## 顶点索引

我们知道再复杂的模型的是由三角形的组成的，前面我们画一个平面是使用了两个三角6个顶点来画的，但其实两个三角中其中其实是有两个顶点是重复的，所以我们可以使用`gl.drawElemnt`来代替`gl.drawArrays`，前者支持通过索引来指定顶点，这样可以减少我们顶点传输量，一个平面可能就只减少了两个点，但如果图形复杂就减少很多内存了。

``` js

//平面顶点
const position = [
  -1.0, -1.0,  1.0    //顶点0
   1.0, -1.0,  1.0,   //顶点1
   1.0,  1.0,  1.0,   //顶点2
  -1.0,  1.0,  1.0,   //顶点3
]
//索引指定使用哪个顶点
const index = [
    0,  1,  2, 0,  2,  3 //下标
 ]
//api部分
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index);
gl.drawElements(gl.TRIANGLES, 36);

```

## 总结

本篇到这里就结束了，其实只是讲了一点点基础概念，实际要开发3d项目还需要非常多的储备知识、比如还要了解光照原理，摄像机（透视矩阵）原理等等，其实对数学知识的要求还是很高的、当然webGL也就了解下就好，实际开发可以使用three.js,babylonjs等框架。

## 参考

[webGL 理论基础](https://webGLfundamentals.org/webGL/lessons/zh_cn/)

[mdn Getting started with webGL](https://developer.mozilla.org/zh-CN/docs/Web/API/webGL_API/Tutorial/Getting_started_with_webGL)

[An Introduction to webGL](https://dev.opera.com/articles/introduction-to-webGL-part-1/)

[Raw webGL 101 — Part 1: Getting Started](https://dev.opera.com/articles/raw-webGL-part-1-getting-started/)

[webGL model view projection](https://developer.mozilla.org/zh-CN/docs/Web/API/webGL_API/webGL_model_view_projection#perspective_matrix)

《webGL 编程指南》