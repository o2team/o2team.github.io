title: 这里有你对 Web 游戏的疑问吗？
subtitle: 本文记录了笔者对 Web 游戏的一些疑问，也许你也恰巧曾经遇到过。
cover: //misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/cover.png
date: 2017-07-23 12:00
categories: Web开发
tags:
  - web games
  - flash
  - canvas
  - webgl
author:
    nick: J.c
    github_name: JChehe
wechat:
    share_cover: https://misc.aotu.io/JChehe/2017-06-29-motion-detection/wx_cover.jpg
    share_title: 这里有你对 Web 游戏的疑问吗？
    share_desc: 也许有吧？


---

<!-- more -->

本文记录了笔者对 Web 游戏的一些疑问，也许你也恰巧曾经遇到过。

## 回顾 Flash
习大大说道：“不忘历史才能开辟未来，善于继承才能善于创新”。对于新生一代（如 00 后和我🙄 ），由于 Web 新标准的快速推进，有些旧事物也许未接触就已经被新事物取代了。如曾经如日中天的 Flash，现在被 HTML5 逐渐蚕食。

由于我未曾学习过 Flash 编程，所以通过查阅资料发现了一个网站——Waste Creative 公司的[《Flash vs HTML5》][1]，它对 Flash 与 HTML5 作出了比较**（具体数据也许已过时，但整体趋势不变）**。

|    | Flash | HTML5 Canvas |
|--------------------|-----------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|
| 运行平台 | 桌面端 | 桌面端、移动端 |
| 桌面端浏览器支持率 | 99% | 82% |
| 3D 硬件加速支持率 | Flash Player 11（stage3D）81% | WebGL 53% |
| 文件&资源目录 | 可编译的 SWFs 意味着 Flash 可作为单个文件共享和重新托管（re-hosted）。这对于 Flash 游戏非常重要。 | HTML5 的本质意味着它的基础资源会作为独立的文件加载。因此，HTML5 的托管需要更谨慎。 |
| 可视化创作 | Flash IDE 对于设计师和新开发者来说是非常友好的，它拥有一个庞大的用户群体和社区。 | 相较于前者，HTML5 创作工具（Animate CC）目前还处于起步阶段，没有明确的“工业标准”。 |
| 移动端浏览器 | 目前的浏览器不再有 Flash 插件，Adobe 已经停止对先前移动端 player 的支持与迭代。 | Canvas 几乎已得到所有浏览器的支持，而 WebGL 的支持程度也逐渐提高。 |

在移动端早就不支持 Flash 的情况下，现在越来越多桌面端现代浏览器默认不启动 Flash 了。在可预见的未来，HTML5 （Canvas 2D 与 WebGL）的支持度会越来越高。

尽管 HTML5 的支持度越来越高，但是对于很多未接触 Flash 开发而直接着手于 HTML5 开发的新人来说，前辈们的经验无疑是非常宝贵的。在 2014 年有将近 `30` 万的 Flash 开发者，其中 90% 是和游戏相关的，他们对 Web 游戏的开发和理解都胜于任何使用其他 Web 前端技术进行开发游戏的群体。

基于这点，很多 HTML5 游戏引擎在 API 设计等方面都会考虑 Flash 这个开发群体。另外 Adobe Animate CC（前身是 Flash Professinal）在支持 Flash SWF 文件的基础上，加入了对 HTML5 的支持。因此，熟悉 Flash 的设计师/开发者就能通过 Animate CC 进行可视化创作，然后导出基于 Canvas 的游戏/动画。




## 渲染模式：Canvas 2D 与 WebGL
我们常常听到有人说：“3D 场景用 WebGL”。

这句话对于未深入学习相关知识的人来说，会潜移默化地在脑中留下这样的刻板印象：“WebGL 就是 3D，3D 就是 WebGL”。

其实不然，因为我们也能在三维空间里绘制二维物体嘛。因此，我们能看到很多 2D 游戏引擎（如 [PixiJS][2]，[Egret][3]）会提供两种渲染模式：`Canvas 2D` 和 `WebGL`。但由于两者 API 不相同，游戏引擎会对两者进行一定抽象封装，为开发者提供一致的 API。

 > 注：PixiJS 的定位是渲染器。而为了方便描述，在本文中我们暂且称它为游戏引擎。

另外，我们可以看到在支持上述两种渲染模式的游戏引擎中，都会优先启用 `WebGL`，若不兼容则回退至 `Canvas 2D`。游戏引擎之所以采取这种策略，目的之一是获取更高的性能。

那为什么 WebGL 的性能比 Canvas 2D 高？

在回答上述问题前，我们先了解 Canvas 2D 与 WebGL 的基本信息。

我们都知道 `<canvas> ` 元素提供一个了空白区域，让特定的 JavaScript API 进行绘制。其中，绘制 API 取决于用户所指定的绘制上下文，如 Canvas 2D 或 WebGL。

### Canvas 2D

对于 Chrome，其 Canvas 2D 的底层实现是 [Skia][4] 图形库。其实不止于 Chrome，该库还服务于 Chrome OS、 Android、Mozilla Firefox 和 Firefox OS 等众多产品。

通过在 Chrome 地址栏输入 `about:gpu` 可看到，Canvas 2D 是支持硬件加速的。若未启用，则在地址栏输入 `about:flags`，然后启用 **Accelerated 2D canvas** 选项并重启浏览器即可。

```
Graphics Feature Status

Canvas: Hardware accelerated ***
Flash: Hardware accelerated
Flash Stage3D: Hardware accelerated
Flash Stage3D Baseline profile: Hardware accelerated
Compositing: Hardware accelerated
Multiple Raster Threads: Enabled
Native GpuMemoryBuffers: Hardware accelerated
Rasterization: Hardware accelerated
Video Decode: Hardware accelerated
Video Encode: Hardware accelerated
WebGL: Hardware accelerated
WebGL2: Hardware accelerated
```

### WebGL

什么是 [WebGL][5]（Web Graphics Library）？简而言之，它允许 JavaScript 对图形硬件进行低阶编程。这无疑让 Web 页面能更好地利用显卡的优势，如 3D、着色器和卓越性能。

另外，目前 WebGL 有两个版本，其中 WebGL 1.0 是基于 [OpenGL ES][6] 2.0，WebGL 2.0 是基于 OpenGL ES 3.0。


### GPU 是如何渲染 2D 图像的？

在了解了 Canvas 2D 和 WebGL 的基本信息后，我们再看看 GPU 是如何渲染 2D 图像的。

首先，我们先介绍渲染处理，以便你了解测试中发生了什么。尽管有点简化，但它能让你有一个基本的认识。要在低阶渲染器（如 WebGL 和 DirectX）中绘制 2D 图像，首先需要一个能包围该图像的四边形。因此，我们需要提供该四边形每个角的坐标（x, y）。这里的每个角都被称为顶点（vertex），如下图的红点所示：

![vertex][7]  
包围着图像的四边形

为了高效地绘制大量的 2D 图像，我们需要有一个能装载每个图像所有顶点的列表。该列表存储在顶点缓冲区，显卡会进行读取绘制。下图中有 5 个海盗公主，有的旋转，有的缩放，共有 20 个顶点。

![多个 vertexs][8]  
多个图像时的顶点


显卡是非常先进的技术，它已被庞大的 3D 游戏行业推动多年。现在它的运算速度非常快，渲染 2D 图像的速度更是快得难以形容。因为它的渲染速度甚至比你告诉它渲染哪张图更快。换句话说，计算每个顶点的位置并将其发送到显卡的这个过程可能需要 2 微秒，但显卡完成其工作只需 1 微秒，然后空闲地等待下一个指令。

由此可看出，2D 游戏的性能主要受限于顶点缓冲区的填充速度。所以这里的问题是：计算顶点的位置和将其填充到缓冲区的速度能有多快？

下面我们将分别对 Canvas 2D 和 WebGL 进行测试。

### 性能测试
为了测试两个渲染器的性能，我们编写了一个标准测试。首先，我们有一个蓝色正方形图像，然后在其基础上绘制足够多的图像，直至让帧率降至 30FPS。这样做是为了最大限度地减少每帧中不必要的计算量，确保我们能得出顶点的填充速度。另外，图像是具有透明度的，因此我们能看到它们不断地堆叠起来，如下图：

![测试示例图][9]  
测试示例图


我们可在各个浏览器上进行测试，以查看它们的实际渲染速度：

 - [Canvas 2D 性能测试链接>>][10]
 - [WebGL 性能测试链接>>][11]（前提是要支持/开启 WebGL，否则会回退至 Canvas 2D）

在 Early 2013 MacBook Pro（系统为 macOS 10.12.5，硬件配置为 i7 2.4GHz 处理器、8G 1600 MHz DDR3 内存、GT 650M 显卡）上测试可得出以下数据：

注：对于 Windows，可能还需要修改独显对测试浏览器的支持（默认可能是集显）。

Chrome 59.0.3071.115（正式版本）（64 位）测试数据如下：

![Chrome Canvas 2D][12]  
Chrome Canvas 2D——分数为 2415

![Chrome WebGL][13]  
Chrome WebGL——分数为 13711


Safari 10.1.1（12603.2.4）测试数据如下：

![Safari Canvas 2D][14]
Safari Canvas 2D——分数 7481

![Safari WebGL][15]
Safari WebGL——分数 52061

Firfox 54.0.1（64位） 测试数据如下：

![Firfox Canvas 2D][16]
Firfox Canvas 2D——分数 5992

![Firfox WebGL][17]
Firfox WebGL——分数 66291

由上述数据可得：3 款浏览器的 WebGL 性能都优于 Canvas 2D，Chrome 是 `5.6` 倍、Safari 是 `6.95` 倍、Firfox 是 `11` 倍。而且由分数可看出：Safari 和 Firfox 无论是 Canvas 2D 还是 WebGL 都远强于 Chrome。

为何 WebGL 普遍比 Canvas 2D 性能要高呢？

对于 Canvas 2D，其 API 相对于 WebGL 更高阶。即它实际并没有直接发送顶点信息到顶点缓冲区，而只是描述了在某个位置上绘制一个 2D 图像，然后再让浏览器计算出具体的顶点信息。

对于 WebGL，它直接给出所有对象的顶点信息。这意味着无需再进行任何计算来确定顶点的信息。这样就可以消除浏览器对顶点处理的开销，从而直接复制到顶点缓冲区。另外，从上面我们的实际测试结果可知，WebGL 的性能提升效果是非常明显的。当然，上述只是简单的测试，实际应用中还是需要考虑实际情况。

综上所述，影响两者性能的因素有很多，如操作系统、硬件、浏览器的底层实现与优化和项目代码质量等。在实际测试中，现代浏览器的 WebGL 性能在整体上优于 Canvas 2D。

也许有人认为：性能够用就好，再高也就是过剩。其实不然，因为除了保证画面流畅外，性能高还有以下好处：

1. 运行流畅且稳定（不会因其他因素干扰而掉帧）。
2. 游戏开发商能拥有更多空间去增加更多功能和提高画面质量。
3. 运行效率更高，能耗更低（电池使用量、发热量）。


## 游戏为什么要 60FPS，而电影 24FPS 就行

一般来说，要达到流畅的体验，电影需要 24FPS，而游戏却要 60FPS。

概括来说，造成两者差异的主要原因有：

 1. 两者图像生成原理不同
 2. 电影的 FPS 是稳定的，而游戏则是不稳定

更详细的解答请看以下两个链接（此刻，我不生产内容，只是内容的搬运工）：

 - [为什么游戏帧数一般要到 60 帧每秒才流畅，而过去的大部分电影帧数只有 24 帧每秒却没有不流畅感？][18]
 - [為什麼電影 24 格就行，但遊戲卻要 60 格？](https://technews.tw/2015/10/21/talk-about-fps/)


## 最后

其实原来文章的大纲不止于以上几点（还有 TypeScript、WebAssembly、脏矩形、骨骼动画等），但由于笔者深知自己能力和经验上的不足，所以把模棱两可或不确定的点都取消了。但笔者会在后续的学习中不断完善，甚至增加新的知识点。所以这是一篇不定时更新的博文，请持续关注 [凹凸实验室][19]。

看了以上几个心中疑问后，是否觉得离『游戏入门』的门近了一点呢？

最后，希望大家能在评论区提出更多关于 Web 游戏的疑问，说不定可以收录至本文哦👏。

参考资料：

 - [HTML5 游戏引擎深度评测][20]
 - [如何看待 HTML5 开源游戏引擎 Egret，HTML5 游戏开发的前景如何？][21]
 - [HTML5 2D gaming performance analysis][22]


  [1]: http://flashvhtml.com/
  [2]: http://www.pixijs.com/
  [3]: http://developer.egret.com/cn/2d/renderMode/webgl
  [4]: https://skia.org/
  [5]: https://www.khronos.org/webgl/
  [6]: https://www.khronos.org/opengles/
  [7]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/pirate-princess-quad.png
  [8]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/many-pirate-princesses.png
  [9]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/perftest-screenshot.png
  [10]: https://www.scirra.com/labs/perftest-2d
  [11]: https://www.scirra.com/labs/perftest-webgl
  [12]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/chrome-canvas.jpg
  [13]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/chrome-webgl.jpg
  [14]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/safari-canvas.jpg
  [15]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/safari-webgl.jpg
  [16]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/firfox-canvas.jpg
  [17]: https://misc.aotu.io/JChehe/2017-07-23-some-doubts-about-web-games/firfox-webgl.jpg
  [18]: https://www.zhihu.com/question/21081976
  [19]: https://aotu.io/
  [20]: https://zhuanlan.zhihu.com/p/20768495
  [21]: https://www.zhihu.com/question/27078280/answer/35808030
  [22]: https://www.scirra.com/blog/58/html5-2d-gaming-performance-analysis
