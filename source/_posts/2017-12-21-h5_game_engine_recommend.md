title: H5游戏引擎入门推荐  
subtitle: 对比现今市场上比较流行的游戏框架,分析每个框架的特点以及其适用场景  
cover: http://misc.aotu.io/cssie/banner.jpg
date: 2017-12-21 18:05
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
    share_title: H5游戏引擎入门推荐
    share_desc: 对比现今市场上比较流行的游戏框架,分析每个框架的特点以及其适用场景 


---

<!-- more -->

## 前言
很多刚刚接触到游戏开发，准备大展拳脚的小鲜肉们，往往在技术选型这第一关就栽了跟头。毕竟网络上的游戏引擎良莠不齐，官网上相关资料也比较少，而选择一个最适合的游戏框架是一个项目最基础很核心的一部分。  
试想一下，在游戏开发进行到中后期的时候，你才发现你所使用的游戏引擎与项目需求相悖，这时候不管是重新做一些修修补补的工作或者重新更换游戏引擎，这都是相当耗费人力物力的一件事。所以，前期选择适合项目需求的游戏引擎至关重要。（以下主要针对 JS 游戏引擎）

## 游戏适用场景（什么游戏） 
当我们拿到游戏需求的时候，首当其冲地，我们需要去从以下几个方面考量项目。    

 - 2D ？ 3D ? VR  
 - 小游戏 ？ 复古游戏 ？ 大型游戏开发  
 - pc端，移动端 ，浏览器兼容  

**建议刚入门的小伙伴们，可以从2D 小游戏开始玩起，学习门槛比较低，可以慢慢积累成就感。**  

### 2D ☞ 3D ☞ VR
这个要看具体项目需求，也需要考虑到项目后续迭代开发问题。随着技术的发展，未来将会有越来越多的VR游戏出现。
  
#### 2D小游戏
2D渲染一般有三种，Dom 渲染，Canvas 渲染，WebGL 渲染，Dom 由于性能原因，做游戏开发一般不会考虑这种方式，因此本文主要针对 Canvas 和 WebGL 展开介绍。  

>[浏览器中的Canvas绘制路径是这样的：Canvas（js语句）-> js引擎 -> 浏览器接口逻辑-> 图形库](https://www.zhihu.com/question/31894515)

>WebGL 是一套用于渲染 2D 和 3D 图形的标准图形库，其标准是由 Khronos、AMD、爱立信、谷歌、Mozilla、Nvidia 以及 Opera 等共同制定。  

一般来说，对于 2D 小游戏来说，Canvas 渲染已经足够。然而 Canvas 渲染由于底层封装层次多，不足以支撑起大型游戏的性能要求，因此大型游戏最好选择 WebGL 渲染或者浏览器内嵌 Runtime 都是不错的选择。  

相对而言，WebGL 的学习成本比较高。WebGL提供了底层的渲染 API，需要补充大量的 OpenGL ES 相关知识。  
#### 3D 游戏 ☞ VR 游戏
目前市场上 3D 游戏和 VR 游戏出现于 APP 和桌面应用比较多，H5 游戏现在还很少看到，主要是受到了性能的限制，虽然目前浏览器对于 WebGL 的支持比较好了，但是跑起来也是很耗内存的，会出现卡顿比较严重的现象。我们相信，随着浏览器内核升级，在未来，web 3D 级和 VR 级的游戏将会是 web 游戏的主流。  

## 游戏引擎推荐  
<br/>
笔者拿现在市场比较流行的几个框架，从游戏引擎定位，渲染能力，github上的 star 数，更新时间，文档详细度，周边工具等方面做了一些对比，希望能从客观数据给我们的技术选型给一点建议。  

**2D，3D，VR 都支持的游戏引擎**  

<div style="overflow:auto">  
	<table style="width:1500px">
	<thead>
	<tr>
		<th align="center">name</th>
		<th align="center">定位</th>
		<th align="center">2D渲染（Canvas）</th>
		<th align="center">2D渲染(WebGL)</th>
		<th align="center">3D渲染（WebGL）</th>
		<th align="center">VR</th>
		<th align="center">github star 数</th>
		<th align="center">文档详细程度</th>
		<th align="center">周边产品</th>
		<th align="center">备注</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td align="center">Egret</td>
		<td align="center">游戏引擎</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">2k,最新更新2017.12</td>
		<td align="center">有中文文档，例子充足，社区活跃</td>
		<td align="center">游戏开发过程中的每个环节基本都有工具支撑。</td>
		<td align="center">不仅仅提供了一个基于HTML5技术的游戏引擎，更是提供了原生打包工具和众多周边产品</td>
	</tr>
	<tr>
		<td align="center">LayaAir</td>
		<td align="center">游戏引擎</td>
		<td align="center">YES</td>
		<td align="center">YES（优先）</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">0.7k，最新更新2017.12</td>
		<td align="center">有中文文档，例子充足，社区活跃</td>
		<td align="center">提供开发工具和可视化编辑器</td>
		<td align="center">支持2d、3d、VR，能开发超大游戏，forgame的醉西游，腾讯的QQ农场，乐动卓越的浪漫h5这些大作就是用它开发的</td>
	</tr>
	</tbody>
	</table>	
</div>

##### Egret

![](http://misc.aotu.io/cssie/egret.png)

白鹭引擎，企业级游戏引擎，团队维护。Egret 在工作流的支持上做的是比较好的，从 Wing 的代码编写，到 ResDepot 和 TextureMerger 的资源整合，再到 Inspector 调试，最后原生打包。**游戏开发过程中的每个环节基本都有工具支撑**。官网上的示例，教程也是比较多。值得一提的是，今年5月白鹭引擎支持了 WebAssembly ，这对于性能的提升又是一大里程碑。  
##### LayaAir
LayaAir 在 Github 上star 数比较少，但是官网上的例子是比较充足的，在工具流上的支持也是比较全面的。  

**下图是主要支持2D游戏的游戏引擎**  

<div style="overflow:auto">  
	<table style="width:1600px">
	<thead>
	<tr>
		<th align="center">name</th>
		<th align="center">定位</th>
		<th align="center">2D渲染（Canvas）</th>
		<th align="center">2D渲染(WebGL)</th>
		<th align="center">3D渲染（WebGL）</th>
		<th align="center">VR</th>
		<th align="center">github star 数</th>
		<th align="center">文档详细程度</th>
		<th align="center">周边产品</th>
		<th align="center">备注</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td align="center">Pixi.js</td>
		<td align="center">只做渲染器，要把渲染功能做到最强</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">16.8k，最新更新2017.12</td>
		<td align="center"></td>
		<td align="center"></td>
		<td align="center">非游戏引擎，依赖于canvas的WebGL渲染器</td>
	</tr>
	<tr>
		<td align="center">Phaser</td>
		<td align="center">游戏框架，以Pixi为内核</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">16.9k，最新更2017.07</td>
		<td align="center">英文文档，例子充足，英文社区</td>
		<td align="center">官方推荐的插件需付费</td>
		<td align="center"></td>
	</tr>
	<tr>
		<td align="center">CreateJs</td>
		<td align="center">js游戏库</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">6.5k，最新更新2017.12</td>
		<td align="center">英文文档，例子充足，有博客</td>
		<td align="center">无/td>
		<td align="center">官方推荐TweenJS，SoundJS，PreloadJS配合使用</td>
	</tr>
	<tr>
		<td align="center">Hilo</td>
		<td align="center">游戏解决方案</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">YES(Hilo3D)</td>
		<td align="center">NO</td>
		<td align="center">4.2k，最新更新2017.12</td>
		<td align="center">有中文文档，例子充足</td>
		<td align="center">提供资源下载和管理工具</td>
		<td align="center">阿里巴巴集团推出，适合开发营销小游戏，以Chipmunk为2D物理引擎，与主流物理引擎兼容</td>
	</tr>
	<tr>
		<td align="center">CraftyJS</td>
		<td align="center">游戏框架</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">2.5k,最新更新2017.10</td>
		<td align="center">英文文档，例子不多，英文社区</td>
		<td align="center">无</td>
		<td align="center">API较少，功能较少</td>
	</tr>
	<tr>
		<td align="center">MelonJs</td>
		<td align="center">轻量级的h5游戏框架</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">2k，最新更新2017.12</td>
		<td align="center">英文文档</td>
		<td align="center">无</td>
		<td align="center">轻量级，通过插件机制拓展其功能。对于Tiled Map支持非常好，注重兼容性</td>
	</tr>
	<tr>
		<td align="center">Enchant.js</td>
		<td align="center">非引擎，框架</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">1.5k，最新更新俩年前</td>
		<td align="center">英文文档，英文社区，例子不多</td>
		<td align="center">无</td>
		<td align="center">Chrome，Safari，Firefox，IE9，iOS，Android 2.1+，不仅仅用于游戏，还可以用于app，小游戏居多，自身提供的功能有限</td>
	</tr>
	<tr>
		<td align="center">lufylegend.js</td>
		<td align="center">h5库</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">0.4k，最新更新2016.03</td>
		<td align="center">有中文文档，复古游戏，有近期活跃社区（创始人维护）</td>
		<td align="center">无</td>
		<td align="center">仿ActionScript3.0的语法，支持Google Chrome，Firefox，Opera，IE9，IOS，Android等多种热门环境，可以配合Box2dWeb制作物理游戏，内置了LTweenLite缓动类等</td>
	</tr>
	</tbody>
	</table>	
</div>


##### Pixi.js 
上图按照 github star 数从高到低做了一个排序，除了 Pixi.js。为什么呢？  
你可以看到，Pixi 定位并不是游戏引擎，它致力于渲染器的研究，希望能**把渲染器做到极致**。那么你也可以猜到，Pixi的渲染性能是极好的，它常常被其他游戏引擎内嵌为渲染引擎，例如 Phaser 。在这里，我想说的是，如果你的项目对于渲染和性能有比较高的要求，可以考虑自己封装 Pixi 的API，这样在保证渲染性能的同时整个项目的体积也是比较轻量的。  
##### Phaser && CreateJs
Phaser 和 CreateJs 在 Github 上的 star 数都很高，渲染方面，Phaser 直接封装了 Pixi，架构方面，Phaser 进行非常多的高度封装，对于游戏引擎来说，Phaser 提供的功能很足够了，而且 API 调用也比较方便。然后由于封装了其他库，也使得 Phaser 本身不够轻巧，比较适合**开发中大型游戏**。  

![](http://misc.aotu.io/cssie/createjs.jpg)

我们团队主要开发一些小型H5游戏，在选型上来说，我们需要兼顾到体积小，兼容性较好，同时能满足游戏需求功能的引擎，Createjs 是比较符合我们的开发需求的。Createjs 本身的体积比较小，提供的 API 也比较丰富，同时也是**比较容易入门**的，因此 Createjs 成为了我们的首选。  
##### Hilo
Hilo是阿里巴巴集团的一个开源项目，很适合用来开发营销小游戏，Hilo 把自己定义为**游戏解决方案**，提供了基本渗透开发游戏整个流程的若干管理工具，其后推出的 Hilo 3D 也是其亮点之一。另外一方面，Hilo 的中文文档，也为很多英语障碍开发者带来了福音。总的来说，对于**刚入门**的小鲜肉来说，Hilo 是一个不错的选择。  
##### CraftyJS && MelonJS && Enchant.js
这几个都是这俩年新兴起来的游戏框架，都是英文文档，都没有官方推出的周边产品。不过这三个框架都有自己的特点。  
CraftyJS 在设计上提供了一些**系统级别支持**。  
MelonJS 比较**注重兼容性** ，本身的功能不多，主要通过插件机制拓展其功能。  
Enchat.js 不仅仅可以用于游戏，还可以**用于app**。  
##### lufylegend.js
lufylegend.js 的更新虽然停滞在了16年，不过其创始人还依然在社区维护这个项目，同时，创始人还通过写了很多可玩性比较强的 demo 作为宣传，不仅如此，其创始人还出了一本书（HTML 5 Canvas 游戏开发实战）有兴趣的可以找去看看。lufylegend.js 适合一些**复古的小游戏**，入门比较快，如果遇到什么开发问题，也可以很方便地在社区上找到解决的方案。  

**主要支持3D游戏的游戏引擎**  

<div style="overflow:auto">  
	<table style="width:1500px">
	<thead>
	<tr>
		<th align="center">name</th>
		<th align="center">定位</th>
		<th align="center">2D渲染（Canvas）</th>
		<th align="center">2D渲染(WebGL)</th>
		<th align="center">3D渲染（WebGL）</th>
		<th align="center">VR</th>
		<th align="center">github star 数</th>
		<th align="center">文档详细程度</th>
		<th align="center">周边产品</th>
		<th align="center">备注</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td align="center">PlayCanvas</td>
		<td align="center">主要是3D渲染</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">3k,最新更新2017.12</td>
		<td align="center">英文文档，例子充足，英文社区，中文官网</td>
		<td align="center">提供了在线编辑器，发布托管等</td>
		<td align="center">教程较为详细，入门快</td>
	</tr>
	<tr>
		<td align="center">Three.js</td>
		<td align="center">主要是3D渲染，JS库</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">YES（倾向）</td>
		<td align="center">NO</td>
		<td align="center">37.6k，最新更新2017.12</td>
		<td align="center">英文文档，例子充足，英文社区</td>
		<td align="center">无</td>
		<td align="center">默认Ammo.js为默认物理引擎，基于JavaScript语言的3D库，耗性能，加载慢，效果一般</td>
	</tr>
	</tbody>
	</table>	
</div>

##### PlayCanvas
从渲染支持程度来看，PlayCanvas 不仅支持 3D，同时保持到 VR 的支持，同时，提供了在线编辑器和发布托管等服务，官网的教程是比较详细和复杂的，入门比较简单，如果你想**小试牛刀一下3D游戏**，PlayCanvas 是你比较好的选择。  
##### Three.js

![](http://misc.aotu.io/cssie/threejs.jpg)

相信对于很多有关注 3D 游戏的开发者来说，Three.js 早已经烂熟于心了。实际上，Three.js 官方定位并不是游戏引擎，而是一个 JS 3D 库。Three.js 是比较**老牌的开源项目**了，渲染环境上，Three.js 支持 WebGL 和 CSS3D 两种渲染模式。从当前使用量和标准普及程度来做分析看，开发者更加倾向于WebGL渲染方式。  

**支持多语言开发的游戏引擎**

<div style="overflow:auto">  
	<table style="width:1500px">
	<thead>
	<tr>
		<th align="center">name</th>
		<th align="center">定位</th>
		<th align="center">2D渲染（Canvas）</th>
		<th align="center">2D渲染(WebGL)</th>
		<th align="center">3D渲染（WebGL）</th>
		<th align="center">VR</th>
		<th align="center">github star 数</th>
		<th align="center">文档详细程度</th>
		<th align="center">周边产品</th>
		<th align="center">备注</th>
	</tr>
	</thead>
	<tbody>
	<tr>
		<td align="center">Cocos2d-js</td>
		<td align="center">支持多语言，js相关文档较少</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">NO</td>
		<td align="center">NO</td>
		<td align="center">11.2k，最新更新2017.12</td>
		<td align="center">有中文文档，js例子不多，c++例子较多，社区活跃</td>
		<td align="center">Cocos Creator编辑器，打包工具等</td>
		<td align="center">提供的功能相当完整</td>
	</tr>
	<tr>
		<td align="center">Turbulenz（typescript）</td>
		<td align="center">游戏引擎</td>
		<td align="center">YES</td>
		<td align="center">YES</td>
		<td align="center">YES（倾向）</td>
		<td align="center">NO</td>
		<td align="center">2.8k，最新更新2015.12</td>
		<td align="center">国外社区，文档</td>
		<td align="center">没有提供可视化操作软件支持，大部分工具与格式转换相关</td>
		<td align="center">对很多功能做了拓展，同时推出Low Level API 和 High Level API</td>
	</tr>
	</tbody>
	</table>	
</div>


##### Cocos2d-js
Cocos2d-js 是业界比较老牌的游戏引擎了，适合做一些**中大型游戏开发**，同时支持 C++ ，Lua 和 JavaScript 三种开发语言，官方用例来看更倾向于 C++ 开发。对于后台同学想试手小游戏的，相信 Cocos2d-js 会让你有似曾相识的感觉。  

##### Turbulenz
Turbulenz 主推的是用 **TypeScript** 进行开发，现在越来越多前端框架开始支持 TypeScript，甚至有人说 TypeScript 是未来的 JS，不过现阶段浏览器对于 TypeScript 的支持还是不够，如果你想**接触新技术**，想折腾一下 TypeScript 的话，那么 Turbulenz 会是一个不错的选择。 
 
## 结语

现在市场上的 H5游戏引擎很多，很难去直接定义哪个框架的好坏，只能说针对不同项目，每个引擎有自己的特性，在某方面跟项目的契合程度比较高，笔者根据现在市场上比较火的几大框架做了一点比较，希望能给刚入门的你做技术选型的时候有一点帮助，找到适合自己的框架，更快，更准，更高效率地完成产品需求。  

感谢各位耐心读完，希望能有所收获，有考虑不足的地方欢迎留言指出。

如果对「H5游戏开发」感兴趣，欢迎关注我们的[专栏](https://zhuanlan.zhihu.com/snsgame)。

## 参考资料

[目前有哪些比较成熟的 HTML5 游戏引擎？](https://www.zhihu.com/question/20079322)  

[HTML5游戏引擎深度测评](http://www.jianshu.com/p/0469cd7b1711)  

[现在 TypeScript 的生态如何？](http://www.jianshu.com/p/0469cd7b1711)
