title: H5游戏开发：游戏引擎入门推荐  
subtitle: 对比现今市场上比较流行的游戏框架，分析每个框架的特点以及其适用场景  
cover: http://misc.aotu.io/cssie/banner.jpg
date: 2017-12-27 11:20:35
categories: H5游戏开发
tags:
  - H5
  - JS游戏引擎
  - 引擎推荐
author:
  nick: cssie
  github_name: cssie
wechat:
  share_cover: http://misc.aotu.io/cssie/share.jpg
  share_title: H5游戏开发：游戏引擎入门推荐
  share_desc: 对比现今市场上比较流行的游戏框架，分析每个框架的特点以及其适用场景 
---

<!-- more -->
## 前言
很多刚刚接触到游戏开发，准备大展拳脚的小鲜肉们，往往在技术选型这第一关就栽了跟头。毕竟网络上的游戏引擎良莠不齐，官网上相关资料也比较少，而选择一个适合的游戏引擎是一个项目最基础，也是很核心的一部分。  
试想一下，在游戏开发进行到中后期的时候，才发现项目引入的游戏引擎与需求相悖，这时候不管是重新做一些修修补补的工作或者更换游戏引擎，这都是相当耗费人力物力的一件事。为了避免这种情况的出现，在前期选择适合项目需求的游戏引擎显得尤为重要。  
接下来我们来聊一聊如何去选择适合项目的 JS 游戏引擎。  

## 游戏场景分类
在刚接到游戏需求时，我们可以从以下几个方面进行考量，分析出游戏需求场景所属，从而作为我们选择游戏引擎的依据。    

 - 游戏效果呈现方式（ 2D ？ 3D ？ VR ？）  
   这与游戏引擎能够支持的渲染方式直接挂钩。现在的 H5 游戏渲染方式一般有 2D 渲染、3D 渲染、VR 渲染三种。  
   而 2D 渲染一般也有三种：Dom 渲染、Canvas 渲染、WebGL 渲染。Dom 由于性能原因，一般只适合做一些动画效果较少，交互较少的小游戏，本文主要针对 Canvas 和 WebGL 展开介绍。  
   一般来说，对于 2D 小游戏来说，Canvas 渲染已经足够。然而 Canvas 渲染由于底层封装层次多，不足以支撑起大型游戏的性能要求，因此大型游戏最好选择 WebGL 渲染或者浏览器内嵌 Runtime 。	
 - 游戏复杂度  
   这与游戏引擎能够支持的功能，提供的API，性能等方面关系比较大。

## 游戏引擎推荐
笔者从业界较流行的一些框架，进行以下几个方面对比，希望能从客观数据上给大家的技术选型带来建议和参考。

- 引擎支持的渲染方式
- github上的 star 数
- 更新时间
- 文档详细度
- 周边产品

**2D，3D，VR 都支持的游戏引擎**  
<div style="overflow:auto"><table style="width:1200px"><thead><tr><th align="center">name</th><th align="center">2D渲染（Canvas）</th><th align="center">2D渲染(WebGL)</th><th align="center">3D渲染（WebGL）</th><th align="center">VR</th><th align="center">github star 数</th><th align="center">文档详细程度</th><th align="center">周边产品</th><th align="center">备注</th></tr></thead><tbody><tr>
<td align="center">Egret</td><td align="center">YES</td><td align="center">YES</td><td align="center">YES</td><td align="center">YES</td><td align="center">2k（最新更新2017.12）</td><td align="left"><div style="width:90px">▪ 有中文文档<br/>▪ 例子充足<br/>▪ 社区活跃</div></td><td align="left">游戏开发过程中的每个环节基本都有工具支撑。</td><td align="left">不仅仅提供了一个基于HTML5技术的游戏引擎，更是提供了原生打包工具和众多周边产品</td></tr><tr><td align="center">LayaAir</td><td align="center">YES</td><td align="center">YES（优先）</td><td align="center">YES</td><td align="center">YES</td><td align="center">0.7k（最新更新2017.12）</td><td align="left"><div style="width:90px">▪ 有中文文档<br/>▪ 例子充足<br/>▪ 社区活跃</div></td><td align="left">提供开发工具和可视化编辑器</td><td align="left">支持2D、3D、VR，能开发超大游戏，forgame的醉西游，腾讯的QQ农场，乐动卓越的浪漫h5这些大作就是用它开发</td></tr></tbody></table></div>

##### [Egret](https://www.egret.com/index)

![](http://misc.aotu.io/cssie/egret.png)

<small style="display:block;text-align:center;color: #999;">Egret 周边产品</small>

白鹭引擎是企业级游戏引擎，有团队维护。Egret 在工作流的支持上做的是比较好的，从 Wing 的代码编写，到 ResDepot 和 TextureMerger 的资源整合，再到 Inspector 调试，最后到原生打包（支持 APP 打包），游戏开发过程中的每个环节基本都有工具支撑。官网上的示例，教程也是比较多。值得一提的是，今年5月白鹭引擎支持了 WebAssembly ，这对于性能的提升又是一大里程碑。

##### [LayaAir](https://www.layabox.com/)
在渲染模式上，LayaAir 支持 Canvas 和 WebGL 两种方式；在工具流的支持程度上，主要是提供了 LayaAir IDE。LayaAir IDE 包括代码模式与设计模式，支持代码开发与美术设计分离，内置了 SWF 转换、图集打包、JS 压缩与加密、APP 打包、Flash 发布等实用功能。

**下图是主要支持2D游戏的游戏引擎**  
<div style="overflow:auto"><table style="width:1400px"><thead><tr><th align="center">name</th><th align="center">2D渲染（Canvas）</th><th align="center">2D渲染(WebGL)</th><th align="center">3D渲染（WebGL）</th><th align="center">VR</th><th align="center">github star 数</th><th align="center">文档详细程度</th><th align="center">周边产品</th><th align="center">备注</th></tr></thead><tbody><tr><td align="center">Pixi.js</td><td align="center">YES</td><td align="center">YES</td><td align="center">NO</td><td align="center">NO</td><td align="center">16.8k(最新更新2017.12)</td><td align="left"><div style="width:170px">▪ 英文文档<br/>▪ 例子充足<br/>▪ 英文社区</div></td><td align="center">无</td><td align="left">依赖于canvas的WebGL渲染器</td></tr><tr><td align="center">Phaser</td><td align="center">YES</td><td align="center">YES</td><td align="center">NO</td><td align="center">NO</td><td align="center">16.9k（最新更2017.07）</td><td align="left"><div style="width:170px">▪ 英文文档<br/>▪ 例子充足<br/>▪ 英文社区</div></td><td align="left">提供在线编辑器Phaser Sandbox</td><td align="left"></td></tr><tr><td align="center">CreateJs</td><td align="center">YES</td><td align="center">YES</td><td align="center">NO</td><td align="center">NO</td><td align="center">6.5k（最新更新2017.12）</td><td align="left"><div style="width:170px">▪ 英文文档<br/>▪ 例子充足<br/>▪ 有博客</div></td><td align="center">无</td><td align="left">官方推荐TweenJS，SoundJS，PreloadJS配合使用</td></tr><tr><td align="center">Hilo</td><td align="center">YES</td><td align="center">YES</td><td align="center">YES(Hilo3D)</td><td align="center">NO</td><td align="center">4.2k（最新更新2017.12）</td><td align="left"><div style="width:170px">▪ 有中文文档<br/>▪ 例子充足<br/></div></td><td align="left">提供资源下载和管理工具</td><td align="left">阿里巴巴集团推出，适合开发营销小游戏，以Chipmunk为2D物理引擎，与主流物理引擎兼容</td></tr><tr><td align="center">Cocos2d-x</td><td align="center">YES</td><td align="center">YES</td><td align="center">NO</td><td align="center">NO</td><td align="center">11.2k（最新更新2017.12）</td><td align="left"><div style="width:170px">▪ 有中文文档<br/>▪ js例子不多，c++例子较多<br/>▪ 社区活跃</div></td><td align="left">Cocos Creator编辑器，打包工具等</td><td align="left">提供的功能相当完整</td></tr><tr><td align="center">lufylegend.js</td><td align="center">YES</td><td align="center">NO</td><td align="center">NO</td><td align="center">NO</td><td align="center">0.4k（最新更新2016.03）</td><td align="left"><div style="width:170px">▪ 有中文文档<br/>▪ 社区活跃<br/></div></td><td align="center">无</td><td align="left">仿ActionScript3.0的语法，支持Google Chrome，Firefox，Opera，IE9，IOS，Android等多种热门环境，可以配合Box2dWeb制作物理游戏，内置了LTweenLite缓动类等</td></tr></tbody></table></div>

##### [Pixi.js](http://www.pixijs.com/)  
一般来说，WebGL 的渲染速度都会比 Canvas 快，这是由俩者的绘制路径决定的。Pixi 最大的特点在于，Pixi 具有完整的 WebGL 支持，却并不要求开发者掌握 WebGL 的相关知识，并在需要时无缝地回退到 Canvas 。相较于很多同类产品，它的渲染能力是比较强大的。然而，Pixi 也有不足的地方，Pixi 对于动画的支持是比较缺乏的，在实际开发中，常常需要引进额外的动画库，如 GSAP。

##### [Phaser](http://phaser.io/)
Phaser 在渲染方面直接封装了 Pixi；架构方面，Phaser 内嵌了3个物理引擎（Arcade Physics、Ninja、p2.js），提供粒子系统、动画、预下载和设备适配方案；兼容性方面，Phaser 的焦点是放在移动端浏览器上的；API 方面，Phaser 能实现丰富的游戏功能，适合复杂度高的游戏开发。

##### [CreateJS](https://www.createjs.com/)

![](http://misc.aotu.io/cssie/createjs.jpg)

<small style="display:block;text-align:center;color: #999;">CreateJs 周边产品</small>

CreateJS 官方提供了 TweenJS 支持动画开发，同时通过 SoundJS 和 PreLoadJS 提供了音频和预下载的支持，对于 H5 游戏基础功能的支持是足够的。在兼容性方面，CreateJS 支持 PC 端和移动端几乎所有的浏览器。此外，CreateJS 还支持用 flash CC 开发导出由 CreateJS 渲染的 H5 游戏。

##### [Hilo](http://hiloteam.github.io/)
Hilo 是阿里团队推出的一个开源项目，支持模块化开发，同时提供了多种模块范式的包装版本和跨终端解决方案，适合用来开发营销小游戏。其体积也是比较轻量的，只有70kb左右。Hilo 支持 DOM 渲染，Canvas 渲染和 WebGL 渲染，同时集成了 Hilo Audio， Hilo Preload。其后推出的 Hilo 3D 也是其亮点之一。

##### [Cocos2d-x](http://www.cocos.com/)
Cocos2d-x 是业界比较老牌的游戏引擎了，同时支持 C++ ，Lua 和 JavaScript 三种开发语言，官方用例来看更倾向于 C++ 开发，适合做一些中大型游戏开发。Cocos2d-x 提供 Cocos Creator 游戏开发工具，组件化，脚本化，数据驱动，跨平台发布。

##### [lufylegend.js](http://www.lufylegend.com/)
lufylegend.js 的最新更新是在16年，不过其社区还是十分活跃的，如果遇到什么开发问题，可以很方便地在社区上找到解决的方案。lufylegend.js 可以支持基础的游戏功能，但是其可拓展性不是很强。

**主要支持3D游戏的游戏引擎**  
<div style="overflow:auto"><table style="width:1500px"><thead><tr><th align="center">name</th><th align="center">2D渲染（Canvas）</th><th align="center">2D渲染(WebGL)</th><th align="center">3D渲染（WebGL）</th><th align="center">VR</th><th align="center">github star 数</th><th align="center">文档详细程度</th><th align="center">周边产品</th><th align="center">备注</th></tr></thead><tbody><tr><td align="center">Three.js</td><td align="center">NO</td><td align="center">NO</td><td align="center">YES（倾向）</td><td align="center">NO</td><td align="center">37.6k（最新更新2017.12）</td><td align="left"><div style="width:90px">▪ 英文文档<br/>▪ 例子充足<br/>▪ 英文社区</div></td><td align="center">无</td><td align="left">默认Ammo.js为默认物理引擎，基于JavaScript语言的3D库，耗性能，加载慢，效果一般</td></tr><tr><td align="center">PlayCanvas</td><td align="center">NO</td><td align="center">NO</td><td align="center">YES</td><td align="center">YES</td><td align="center">3k（最新更新2017.12）</td><td align="left"><div style="width:90px">▪ 英文文档<br/>▪ 例子充足<br/>▪ 英文社区</div></td><td align="left">提供了在线编辑器，发布托管等</td><td align="left">教程较为详细，入门快</td></tr></tbody></table></div>

##### [Three.js](https://threejs.org/)

![](http://misc.aotu.io/cssie/threejs.jpg)

<small style="display:block;text-align:center;color: #999;">Three.js 示例案例</small>

相信对于很多有关注 3D 游戏的开发者来说，Three.js 早已经耳熟能详了。实际上，Three.js 官方定位并不是游戏引擎，而是一个 JS 3D 库。Three.js 更倾向于展示型的视觉呈现，比较少直接拿 Three.js 来开发 H5 游戏。渲染环境上，Three.js 支持 WebGL 和 CSS3D 两种渲染模式。

##### [PlayCanvas](https://playcanvas.com/)
从渲染支持程度来看，PlayCanvas 不仅支持 3D WebGL渲染，同时保持到 VR 的支持，拥有比较好的拓展性。在工具流的支持上，提供了在线编辑器和发布托管等服务。从官方教程上看，教程也是比较详细的。 

## 结语

现在市场上的 H5游戏引擎很多，很难去直接定义哪个引擎的好坏，只能说每个引擎都有自己的特性，在某方面跟项目的契合程度比较高，笔者根据现在市场上比较热门的几大引擎做了几点比较，希望能给刚入门的你做技术选型的时候有一点帮助，找到适合项目的引擎，更快、更准、更高效率地完成项目需求。  

感谢各位耐心读完，希望能有所收获，有考虑不足的地方欢迎留言指出。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。

## 参考资料

[目前有哪些比较成熟的 HTML5 游戏引擎？](https://www.zhihu.com/question/20079322)  

[HTML5游戏引擎深度测评](http://www.jianshu.com/p/0469cd7b1711)  

[现在 TypeScript 的生态如何？](http://www.jianshu.com/p/0469cd7b1711)