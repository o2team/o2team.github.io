---
title: webgl 的 hello world
subtitle: 元宇宙概念带火了一波vr，ar技术浪潮，3d是元宇宙这座宫殿里一块重要的砖头，本文简单介绍了webgl画一个基础图形的流程，希望你了解之后，在使用3d渲染库的时间可以少点迷糊·
cover: 
category: webgl
tags:
  - webgl
author:
  nick: div侠
date: 2022-03-22 10:00:00
---
# webgl 的hello world

## 四种常用的页面绘图工具

关于h5页面的图形绘制，我们大多谈及的是这四种工具：html+css，svg、canvas2d、webgl。

![image-20220321180951763](https://img14.360buyimg.com/imagetools/jfs/t1/86234/17/24971/109773/6238508eE1129336e/48691d3a29639d9e.png)

html+css 是最常见的绘图工具了，使用 css 绘图跟平时写页面布局一样，在制作图表的时候，我们可以用 css 把图表的样式定义好，其他的，就是根据数据的不同 ，给元素添加上不同的属性。这样的开发对于图表元素简单、数据结点少的场景非常友好。不仅可以减少开发的工具量，而且不用引入多余的代码库。但是，随时需要绘制的图形越来越多， css 代码做变得越来越复杂，加上 css 本来没有逻辑语义，代码会变得不易阅读和维护。



svg 是可缩放矢量图形，他跟 html ， css 的结合很紧密，可以把 svg 当做 img 的 src ，也可以用 css 操控 svg 的属性， svg 和 html 都是文本标记语言， svg 较 html 增加了对非线性图形的支持，包括圆弧，贝塞尔曲线等。同时， svg 支持<g>, <defs> 等复用类的语法，这让他就算绘制很多图形，代码也保留一定可读性。不过 svg 也有一些缺点。因为一个图形都是一个元素结点。在数据多的时候，页面刷新引起的布局、渲染计算的开销就会非常大。而且，完整的 svg 把结构，样式，复用逻辑都放在一起，跟 html + css + js 这种三者分开的模式比总少了一些整洁。



 canvas2D 是 canvas 的 2d 绘图上下文，他提供了一系列方法，用于对 canvas 区域的图像进行修改和绘制，相比于前两者的开箱即用， canvas2d 很多图形和颜色都需要自己实现和封装使得这个工具上手的难度大了不少，但是，如果把这些基础的事情做好，你将拥有一个功能完全覆盖前面两个工具，而且便于扩展的绘图工具。



 webGL 也是 canvas 的绘图上下文，是 opengl es 的 web 实现。最大的特点，就是更低层，可以直接使用 gpu 的并行能力。在处理图形数量非常多，像素级处理和 3d 物体的场景下，拥有很高的性能优势。



### 四种工具的选择思路

![image-20220321181126634](https://img14.360buyimg.com/imagetools/jfs/t1/183354/6/22155/183128/6238508fE8ac55cb5/7ac62a4ae9563a2f.png)

当我们拿到一个绘图需求的时候，应该先看看这个需求用到的图形是不是比较少，而且简单。如果是的话，可以直接选择 css 进行快速开发。如果图形虽然简单但比较多，或者图形有一些曲线需求，这个时候 svg 还可以快速应付。如果图形之间的结构复杂，数量比较多的时候选择 canvas2d 。而当图形的数量级大到一定的量，或者需要对每一个像素进行处理，或者需要大量的 3d 展示的时候，我们得使用 webgl 了

![image-20220321181247016](https://img10.360buyimg.com/imagetools/jfs/t1/168269/7/29168/91903/6238508fE93c32d6e/d5a3c1af5901fa2a.png)



## webgl的hello world

 webgl 的 hello world 不像其他工具一样可以一两行代码就搞定，而是足足有四十多行代码。虽然这串代码在各个 3d 渲染库里都有对应封装的方法，基本不用我们自己徒手去写，但是学习这串代码可以让我们对 webgl 绘图过程有一个最基础的了解。

 webgl 绘图一共有五个步骤：

1. 创建 webgl 绘图上下文
2. 创建着色器编程，关联到 gl 上下文中 (跟第3步并行)
3. 创建数据，放入缓冲区并把缓冲区关联到 gl 止下文中（跟第2步并行）
4. gpu加载缓存中的数据
5. 绘制图形

### 创建Webgl上下文

```js
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
```

### 创建着色器程序

```js
const program = gl.createProgram();

gl.attachShader(program, /*某个着色器(下文的vertexShader)*/);
gl.linkProgram(program);
gl.useProgram(program);
```

着色器是一段给 gpu 运行的程序，我们用 glCreateProgram 创建一个空的程序对象，然后使用 glAttachShader 给这个程序对象填充编译后的着色器代码。着色器是什么，怎么编译后面再说，这里可以把他当成某一个函数编译后的代码。把几个这种编译后的函数放入程序对象后， gpu 执行这个程序对象，就会把像素信息当做入参，依次执行程序对象中的函数。

填充完着色器代码后，调用 glLinkProgram 把程序关联到 gl 上下文中，并用 glUseProgram 来启用这个程序。

接下来，来看一下着色器代码怎么搞出来。

```js
const vertex = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 1.0, 1.0);
      }
    `;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);
```

首先我们定义了一个变量 vertex 并给他赋值一串其他语言格式的代码字符串，这个串代码是 glsl 代码，是一个跟 c 语言很相似的代码。代码接收一个传入的二维向量 position ，然后把他执行环境中的全局变量 gl_Position 设置成一个四维向量，这个四维向量前两个维度的分量是传入的二维向量。

接下来用 glCreateShader 创建一个着色器， VERTEX_SHADER 常量说明这个着色器是一个顶点着色器，跟顶点着色器对应的是片元着色器，顶点着色器处理做为确定点的位置。片元着色器则对顶点构成的图形中的所有位置进行逐个处理，比如两点画一个直线，两点是顶点着色器确定的，直线是片元着色器在确定了两个点的位置之后画的。

在我们创建了一个空的顶点着色器对象 vertexShader 之后，就可以用 glShaderSource 把前面的字符串代码放入顶点着色器对象中，然后用 glCompileShader 把这段代码编译成可执行文件。这个过程跟c语言的编译过程是相似的。

```js
gl.attachShader(program, /*某个着色器(下文的vertexShader)*/);
gl.attachShader(program, vertexShader);
```



完成这一步之后，就要回到上面写注释那里，把着色器对象关联到程序对象里。当然，你还得去写一个片元着色器，用同样的步骤把一个片元着色器也关联到程序对象里。

![image-20220321181429987](https://img13.360buyimg.com/imagetools/jfs/t1/130054/38/26070/608103/62385090Efda6e3bb/d3b4922a386b6e65.png)

### 将数据存入缓冲区

```js
const points = new Float32Array([-1, -1, 0, 1, 1, -1]);
const bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
```

经过上文的操作之后，我们已经有了一个装载着着色器代码的程序对象，这个对象放到 gl 绘图上下文中被启用了。接下来，我们要定义的就是给这个程序用的数据。

在顶点着色器那一块，代码里面接受一个传入的二维向量，就是我们现在要定义的。首先定义一个类型化数组，初始化的时候放入6个数，这个6个数后面会被绘图程序分成三组放到三次顶点着色器调用中。另外，使用类型化数组是为了优化性能，让大量数据的情况下，数据占用的空间更小。

有了数据之后，调用 glCreateBuffer 创建一个缓冲区对象，用 glBindBuffer 把这个对象跟 gl 绘图上下文关联起来，最后调用 glBufferData 把 points 的数据放入缓冲区中。

### gpu加载缓存中的数据

```js
const vPosition = gl.getAttribLocation(program, "position");
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);
```

在这一步中，我们先调用 glGetAttribLocation 拿到程序对象中 position 这个变量的位置，调用 glVertexAttribPointer 把这个变量的长度设置为 2 ，类型设置成 glFLOAT ，并用 glEnableVertexAttribArray 启用这个变量

### 绘制图形

```js
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
```

到了最后一步，只要用 glClear 把颜色缓冲区清空，然后用 glDrawArrays 进行绘图就行了。其中 gl.TRIANGLES 确定了片元着色器的绘图范围，当这个值是 gl.POINTS ，着色器会把点两两连接，而 gl.TRIANGLES 让第三个点成一组绘制三角形

![image-20220321181511519](https://img10.360buyimg.com/imagetools/jfs/t1/216139/31/15424/19802/62385090E8cea7ba3/a2c5a8ce4597e269.png)

这样， webgl 的一个hello world就完成了，上面的三角形就是这40行代码输出的图像。

## 总结

这段程序在 three.js 和其他的 3d 框架和工具库里都有一定的封装，通过那些库进行 webgl 的绘图相对来说会方便很多，但如果不知道这些库最根本的操作，就很容易在遇到问题的时候绕进去。所以希望本文能增加大家对 web 3d 底层方面的理解，给大家在学习这些3d工具库的时候提供一些帮助。

## 参考

[ GPU与渲染管线：如何用WebGL绘制最简单的几何图形？](https://time.geekbang.org/column/article/63c01cb24d76d96cfd6a9ce64db6a623/share?code=CsdMNTf%2FboqZugxI1qspWwJxCaw2PUoiTwhMmOZ4Klw%3D&source=app_share)
