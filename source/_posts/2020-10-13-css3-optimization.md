title: 从浏览器渲染层面解析css3动效优化原理
subtitle: 从浏览器渲染层面解析css3是如何对动效性能进行优化的，帮助开发者工具巩固浏览器渲染相关知识。
cover: https://img12.360buyimg.com/img/s900x383_jfs/t1/132458/17/12205/356958/5f859983E3dac5307/019592f89d192933.jpg
category: 经验分享
tags: 
  - CSS3
author:
  nick: 阿文
  github_name: AwesomeDevin
date: 2020-10-13 21:00:00
wechat:
    share_cover: https://img12.360buyimg.com/img/s900x383_jfs/t1/132458/17/12205/356958/5f859983E3dac5307/019592f89d192933.jpg
    share_title: 从浏览器渲染层面解析css3动效优化原理
    share_desc: 从浏览器渲染层面解析css3是如何对动效性能进行优化的，帮助开发者工具巩固浏览器渲染相关知识。
---

## 引言
在h5开发中，我们经常会需要实现一些动效来让页面视觉效果更好，谈及动效便不可避免地会想到动效性能优化这个话题:
* 减少页面DOM操作，可以元素使用CSS实现的动效不多出一行js代码
* 使用绝对定位脱离让DOM脱离文档流，减少页面的重排(relayout)
* 使用CSS3 3D属性开启硬件加速

那么，CSS3与动效优化有什么关系呢，本文将从浏览器渲染层面讲述CSS3的动效优化原理

## 浏览器页面展示过程
首页，我们需要了解一下浏览器的页面展示过程:  
![浏览器页面展示过程](https://img12.360buyimg.com/img/s720x110_jfs/t1/126458/27/14602/9909/5f81275fEceea1028/17107a8fce3bcf57.jpg)
* Javascript：主要负责业务交互逻辑。  
* Style: 根据 CSS 选择器，对每个 DOM 元素匹配对应的 CSS 样式。  
* Layout: 具体计算 DOM 元素显示在屏幕上的大小及位置。  
* Paint: 实现一个 DOM 元素的可视效果(颜色、边框、阴影等)，一般来说由多个渲染层完成。  
* Composite: 当每个层绘制完成后，浏览器会将所有层按照合理顺序合并为一个图层，显示到屏幕。
本文我们将重点关注 `Composite` 过程。

## 浏览器渲染原理
在讨论 `Composite` 之前，我们还需要了解一下浏览器渲染原理
![浏览器渲染原理](https://img12.360buyimg.com/img/s720x283_jfs/t1/155138/17/1825/117759/5f812be7E56f8874e/5ad80a192e1ed9b9.png)

从该图中，我们可以发现：
* `DOM 元素`与 `Layout Object` 存在一一对应的关系
* 一般来说，拥有相同坐标空间的 `Layout Object` 属于同一个 `Paint Layer (渲染层)`，通过 `position、opacity、filter`等 CSS 属性可以创建新的 Paint Layer
* 某些特殊的 `Paint Layer` 会被认为是 `Composite Layer (合成层/复合层)`，Composite Layer 拥有单独的 `Graphics Layer (图形层)`，而那些非 Composite Layer 的 Paint Layer，会与拥有 Graphics Layer 的父层共用一个

### Graphics Layer
我们日常生活中所看到屏幕可视效果可以理解为：由多个位图通过 `GPU` 合成渲染到屏幕上，而位图的最小单位是像素。如下图：
![](https://img12.360buyimg.com/img/s1002x390_jfs/t1/118252/13/19765/125984/5f8167a5E8e629c4a/d0d2b60c73990590.png)

那么位图是怎么获得的呢，`Graphics Layer` 便起到了关键作用,每个 `Graphics Layer` 都有一个 `Graphics Context`, 位图是存储在共享内存中，`Graphics Context` 会负责将位图作为`纹理`上传到`GPU`中，再由GPU进行合成渲染。如下图：
![](https://img12.360buyimg.com/img/s1610x344_jfs/t1/133935/25/12103/103755/5f83b64eE4d932bcb/a170dd5c445fef06.png)

### CSS在浏览器渲染层面承担了怎样的角色  
大多数人对于CSS3的第一印象，就是可以通过3D(如transform)属性来开启硬件加速，许多同学在重构某一个项目时，考虑到动画性能问题，都会倾向:
1. 将2Dtransform改为3Dtransform
2.将 left ( top、bottom、right )的移动改为 3Dtransform  
但开启硬件加速的`底层原理`其实就在于`将 Paint Layer 提升到了 Composite Layer `
![](https://img12.360buyimg.com/img/s970x240_jfs/t1/144136/10/10487/54234/5f83b64eE1ee67886/cb2c9bd9dc879efa.png)
以下的几种方式都用相同的作用：
* 3D属性开启硬件加速(3d-transform)
* will-change: (opacity、transform、top、left、bottom、right)
* 使用fixed或sticky定位
* 对opacity、transform、filter应用了 animation(actived) or transition(actived)，注意这里的 animation 及 transition 需要是处于`激活状态`才行

我们来写两段 `demo` 代码，带大家具体分析一下实际情况
> demo1. 3D属性开启硬件加速(3d-transform)  

```html
.composited{
  width: 200px;
  height: 200px;
  background: red;
  transform: translateZ(0)
}
</style>

<div class="composited">
  composited - 3dtransform
</div>
```

![](https://img12.360buyimg.com/img/s1476x784_jfs/t1/149519/19/10497/92180/5f83bd0eE7b4ddfda/4f70a42a12f2b322.png)
可以看到是因为使用的CSS 3D transform，创建了一个复合层

> demo2. 对opacity、transform、filter应用 animation(actived) or transition(actived)

```html
<style>
@keyframes move{
  0%{
    top: 0;
  }
  50%{
    top: 600px;
  }
  100%{
    top: 0;
  }
}
@keyframes opacity{
  0%{
    opacity: 0;
  }
  50%{
    opacity: 1;
  }
  100%{
    opacity: 0;
  }
}

#composited{
  width: 200px;
  height: 200px;
  background: red;
  position: absolute;
  left: 0;
  top: 0;
  
}
.both{
  animation: move 2s infinite, opacity 2s infinite;
}
.move{
  animation: move 2s infinite;
}
</style>

<div  id="composited" class="both">
  composited - animation
</div>
<script>
setTimeout(function(){
  const dom = document.getElementById('composited')
  dom.className = 'move'
},5000)
</script>
```

这里我们定义了两个`keyframes(move、opacity)`，还有两个`class(both、move)`，起初 `#composited` 的 `className = 'both'`，5秒延时器后，`className = 'move'`，我们来看看浏览器的实际变化。  

起初：`#composited 创建了一个复合层，并且运动时 fps 没有波动，性能很稳定`
![起初](https://img12.360buyimg.com/img/s2344x848_jfs/t1/123421/29/14686/155043/5f83c09fEead7bb49/68743e963dedafd6.png)

5秒后：`复合层消失，运动时 fps 会发生抖动，性能开始变得不再稳定`
![5秒后](https://img12.360buyimg.com/img/s2314x852_jfs/t1/137044/15/12165/147381/5f83c10dEecf94be4/3cb1fb1c6672150c.png)

### 如何查看复合层及fps
在浏览器的 `Dev Tools` 中选择 `More tools`，并勾选 `Rendering` 中的 `FPS meter`
![](https://img12.360buyimg.com/img/s1480x1274_jfs/t1/133392/13/12142/83118/5f845259E96050efb/3d7b42125d0710dd.png)

### 动画性能最优化
之前，我们提到了页面呈现出来所经历的渲染流水线，其实从性能方面考虑，`最理想的渲染流水线是没有布局和绘制环节的`，为了实现上述效果，就需要只使用那些仅触发 `Composite` 的属性。
![](https://img12.360buyimg.com/img/s720x110_jfs/t1/115204/22/19900/7952/5f83b760E80bcca10/d5e9ae70adcf91d7.jpg)  
目前，只有两个属性是满足这个条件的：`transforms` 和 `opacity`（仅部分浏览器支持）。  
相关信息可查看：[css Triggers](https://csstriggers.com/?spm=taofed.bloginfo.blog.36.20e75ac8xZGHBo)


### 总结
提升为合成层简单说来有以下几点好处：
* 合成层的位图，会交由 GPU 合成，比 CPU 处理要快
* 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层
* 对于 transform 和 opacity 效果，部分浏览器不会触发 Layout 和 Paint， 相关信息可查看：[css Triggers](https://csstriggers.com/?spm=taofed.bloginfo.blog.36.20e75ac8xZGHBo)

缺点：
* 创建一个新的合成层并不是免费的，它得消耗额外的内存和管理资源。
* 纹理上传后会交由 GPU 处理，因此我们还需要考虑 CPU 和 GPU 之间的带宽问题、以及有多大内存供 GPU 处理这些纹理的问题

大多数人都很喜欢使用3D属性 translateZ(0) 来进行所谓的硬件加速，以提升性能。但我们还需要切实的去分析页面的实际性能表现，不断的改进测试，这样才是正确的性能优化途径。

### 参考资料
[无线性能优化：Composite - 淘系前端团队](https://fed.taobao.org/blog/taofed/do71ct/performance-composite/?spm=taofed.blogs.header.7.63e65ac801qdAI)

