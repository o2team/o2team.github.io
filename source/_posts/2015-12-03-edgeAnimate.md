title: Adobe edge animate制作HTML5动画
subtitle: "Edge Animate是Adobe出品的制作HTML5动画的可视化工具，简单的可以理解为HTML5版本的Flash Pro。"
cover: //img.aotu.io/pfan/edge/edgeanimate.jpg
categories: Web开发
tags:
  - edge animate
  - html5
  - animate
author:
  nick: 高大师
  github_name: pfan123
date: 2015-12-03 22:05:18
---

Edge Animate是Adobe出品的制作HTML5动画的可视化工具，简单的可以理解为HTML5版本的Flash Pro。Adobe Edge Animate的目的是帮助专业设计师制作网页动画乃至简单游戏。目前该工具的重点放在动画引擎上，将增加更多HTML5功能，比如Canvas、HTML5音频/视频标签等。支持Android、iOS、webOS、黑莓PlayBook、Firefox、Chrome、Safari和IE9等各个平台。

Edge Animate主要使用HTML5,CSS3和JavaScript。HTML5是其用于创建的doctype，2D的transform，translate，rotate，scale，skew等特效都是渲染为CSS3，如果是最新版本的浏览器，可以操作纯粹的CSS3，如果是主流大众浏览器，Edge Animate则会通过JavaScript库的配合来保证HTML和CSS的显示兼容性。
<!-- more -->
## Adobe edge animate CC功能
1.精确的动画。
2.直觉化的使用者界面。
3.绘图和文字工具。
4.移动路径。
5.可重复使用的符号。
6.兼容性比较不错，android机也表现良好。
单一使用做html5 css3动画，带来了巨大的福音。

## Adobe edge animate CC缺点
1.不太适合，做复杂的动画与游戏，适用场景狭窄。
2.操作比较适合设计师，不适合程序员，操作效率不高，调节不是特别可控。
3.采用html5 css3相关的动画，频繁产生重排导致效率低下。
4.动画元素层级绝对定位，后期维护增加元素，层级覆盖影响较大。
5.比较适合pc端动画制作，移动端需要进行二次转换，scale进行缩放已达到多屏适配的问题。

## Adobe edge animate下载地址
[mac 环境下下载](http://example.net/)  &nbsp;&nbsp;   [window 环境下下载](http://example.net/) 

在开始玩Edge Animate前，你可能有个顾虑，就是Edge Animate如果要做交互动画，生成的内容是否会打破已有的HTML文件代码结构？答案是不会。通过Edge Animate生成的HTML代码少之又少，几乎都可以用下面的代码表达方式来概述：
```
<div id=”Stage” class=”EDGE-xxxxxxxxxx”></div>
```
Edge Animate使用JSON来存储元素的定义和属性。相关的动画内容则会全部以代码块的形式嵌入上面的div中，修改和删除都不会影响原有的HTML项目代码，对HTML中元素的操作都通过JSON对象和引入的JavaScript来完成。但是有一点，edge动画对html元素的动画操作，会导致浏览器频繁重排，降低效率。

创建edge animation 工程
启动Edge Animate，创建一个新项目ctrl＋N/command+N。
![edge](//img.aotu.io/pfan/edge/1.jpg)
设定Stage（舞台）宽度为640px, 高度为1136px。Ctrl+S保存为demo.html。打开我们保存的项目目录，一个标准的Edge Animate项目是由一系列html,css,js和相关资源文件组成的。如下图所示：
![edge](//img.aotu.io/pfan/edge/2.jpg)
1)Edge Animate的工程文件: .an 格式文件更像一个空壳文件或者索引文件，标明了项目的必要信息。你可以使用记事本打开.an文件了解其中具体内容。
2)edge_includes目录：该目录下是Edge制作的html5所依赖的JS类库：edge.6.0.0.min.js 115kb,还是蛮大的。(之前的版本有依赖jquery，再5.0之后就去掉了，产生了自有库，写法参展jquery)。
3)其他.js文件：诸如demo1_edgeActions.js，demo1_edge.js等js文件是专门针对当前动画所生成js文件。
4).html文件：主html文件。

Edge Animate的工具界面默认情况下包含了7个Window面板，均可以通过菜单的Window选项开启和关闭，分别是Tools工具，Properties属性，Stage场景，Elements元素，Library库，Timeline时间轴，代码管理和lessons课程。接下来，简单的让大家了解一下，edge animation的属性面包，元素面板，时间轴runtime，代码管理器，这些是我们经常会用到的。

edge animation 属性面板
Adobe Edge Animate的强大之处在于它能获得舞台中元素的标签（即ID）和这个元素样式属性（CSS）的变化，并将这些变化在时间线上以关键帧的形式“标记”。这样必然导致关键帧之间属性值的变化，这个中间阶段会被转化为一个过渡阶段，或者说一段动画（如图片透明度Opacity的变化，淡入淡出、一个元件的移动Location和缩放Scale等等）。
![edge](//img.aotu.io/pfan/edge/3.jpg)

edge animation 元素面板
Adobe Edge Animate元素面板显示的是节点式的树形结构，表示元素与父元件Stage的联系。这点与ps，flash都比较类似。
放置（或堆叠）在上方的元素具有更高的Z-index值，会显示在其他元素（堆叠在下方的元素）上方。
![edge](//img.aotu.io/pfan/edge/4.jpg)

edge animation 时间轴runtime
Adobe Edge Animate的时间线融合了元素的节点式树状结构和与元素属性关联的关键帧，这些信息显示在时间线左侧，而右侧则显示时间信息表。元素属性值（关键帧）被标记在时间线确切的时间点，当属性值发生改变时，过渡阶段会产生动画。
1.动画标签（Label）和触发器（Trigger）：自定义的时间线动画标签和触发器也可以控制舞台中元素动画的状态和处理方法；使用Ctrl/Command + L可以在播放头所在时间点生成一个动画标签，使用Ctrl/Command + T可以在播放头所在时间点放置一个触发器。
2.仅显示具有动画的元素（Filter Animated Elements）
3.启用时间线吸附功能（Enable Timeline Snapping）：拖动播放头，播放头将会自动吸附到时间点、动画或关键帧等
4.启用时间线网格（Enable Timeline Grid）：时间信息表上将会显示时间网格，方便设计者在确切时间点设定关键帧等，网格的大小可用户自定义。
5.自动记录关键帧模式（Auto Keyframe Mode（K））：开启模式下，设计者对元素所做的属性值修改都会以关键帧的形式记录在时间线上。
6.自动生成动画模式（Auto Transition Mode（X））：开启模式下，在两个关键帧之间会自动生成动画，默认开启。
7.播放标记（Toggle Pin（P））：可以设置播放的起始和终止位置。
![edge](//img.aotu.io/pfan/edge/5.jpg)

edge animation 代码管理
代码管理器使用一个单独完整的窗口界面来展示所有事件控制代码和时间线触发器。（快捷键Ctrl/Command + E或者通过菜单Window-Code打开）所被编辑的控制代码或触发器会被高亮显示。
1.点击“+”图标添加全局、局部、时间线控制代码或者触发器；
2.点击“Full Code”按钮可以显示并编辑单个文件的全部代码，而不仅仅是单个功能函数内部代码；
3.可以通过下方的代码错误提示窗进行错误快速排除检测。
![edge](//img.aotu.io/pfan/edge/6.jpg)

## 实例操作
当我们了解以上这些知识点，之后，我们来做一下简单的实例，实现顶部图片我们所看到的界面，人物跑动，背景向前移动。
![edge](//img.aotu.io/pfan/edge/7.jpg)
## 第一部分 使用SpriteSheet在Edge Animate中制作人物跑动的动画
1.启动Edge Animate，创建一个新项目blackfriday，设置stage大小为640*1136；

2.导入blackfriday SpriteSheet　
点击菜单“File->Import”,或者快捷键Ctrl+I / Command+I，来导入blackfriday_sprite.png到舞台。在舞台上选中导入的图片，在左边栏Position and Size栏目下，设定其X坐标值=160px,y坐标值为330px，保证第一个smurf的位置在舞台最左侧并垂直居中。

3.使用Clip切割Spritesheet，显示单一Sprite元素
我们导入的蓝精灵Spritesheet是320*480大小的透明背景png图片，一共描绘了32个蓝精灵行走的姿态。通过序列播放这32个行走姿态，就可以制作一个完整蓝精灵行走动画。
首先，要在舞台上只显示一个Sprite元素，比如最左上角的第一个蓝精灵。在Edge Animate左侧属性面板中，倒数第二个栏目是clip子面板。顾名思义，clip功能区可以帮助我们“切割”舞台上的元素，比如图片。该功能区实际上利用了CSS的clip属性。
点击clip子面板的开关按钮，可以激活clip功能。使用鼠标，可以在clip属性设定面板上的上、下、左、右属性值上滑动，你可以在舞台上实时看到“切割”的图片情况。如下图。 在本例中，请设定clip的top，right，bottom，left属性值分别为0, 320,480,0。
![edge](//img.aotu.io/pfan/edge/8.jpg)

4. 创建32个Keyframe，实现行走动作
接下来，我们创建32个帧来完成蓝精灵行走的动作。
1) 调整帧间隔
在舞台下方的时间轴上，Edge Animate用竖线网格标记了每帧间距。在Smurf行走动画中，我们希望在1毫秒的时间左右完成一个行走动作，即32帧。因此，我们需要通过时间轴下方的Gird Size图标调整时间轴为30帧/秒。如下图：
![edge](//img.aotu.io/pfan/edge/9.png)
2) 激活“Auto-Keyframe Mode (自动创建帧)”
Edge Animate有三个非常重要的按钮分别开启Auto-Keyframe Mode（自动创建关键帧）、Auto-Transition Mode和Toggle Pin（大头针）。图标如下图：
![edge](//img.aotu.io/pfan/edge/10.png)
Edge Animate Buttons
本例中，我们将启用Auto-Keyframe Mode，而关闭Auto-Transition Mode和Pin。在启用Auto-Keyframe Mode的情况下，每当我们在新的一帧修改舞台中元素的属性，Edge Animate会自动在此创建关键帧。由于我们关闭了Auto-Transition Mode，因此Edge Animate将不会自动在关键帧之间创建过渡效果。
3) 创建第一个关键帧
在时间轴上，把播放头移到0:00秒位置，选中舞台中的蓝精灵，在左边属性面板中的Image子面板下，确认Background Image的x和y属性值为0，然后点击x和y属性边上的小菱形符号（当鼠标移到该菱形符号时，其变为黄色，并显示tips：“Add Keyframe for Background Position”），此时Edge Animate将在时间轴的0:00秒出创建第一个关键帧。如下图
![edge](//img.aotu.io/pfan/edge/11.jpg)
依此方法，在gard线上接着做31个帧。

5。创建完成后，预览：
使用快捷键Ctrl+Enter/Command+Enter，可以启动默认浏览器看起运行的效果.
现在，人物已经实现了行走动作，但是还没有完成行进，还不循环播放，运行完32个帧就停止了。

6.转换为元件在最后一帧，设置trigger触发器，达到帧循环动画
在舞台上选中该图片后，快捷键Cmd+Y/Ctrl+Y将其转换成一个元件(Symbol)，叫us，然后删除stage舞台上面的元素，从library面板里面拖动stage舞台上面 。双击元件，进入元件舞台区域，如图，insert trigger：
![edge](//img.aotu.io/pfan/edge/12.jpg)
![edge](//img.aotu.io/pfan/edge/13.png)

## 第二部分 实现背景的滚动
1.倒入背景图片，生成元件
快捷键Cmd+I/Ctrl+I导入背景图片american.png，在舞台上选中该图片后，快捷键Cmd+Y/Ctrl+Y将其转换成一个元件(Symbol)，命名为americanbg2。
2.激活Auto-Keyframe Mode，Auto-transition Mode，平移背景图片形成单循环的过渡动画。
但是当背景向左移出舞台的时候，会看到舞台空出了部分
3.实现背景图循环滚动的效果
再次向舞台导入元件，命名为americanbg4.拷贝americanbg2的运动动画，到americanbg2左移舞台出现空白的临界点帧时间，给americanbg4粘贴动画效果。因为我们不需要americanbg4整体效果，所以需要删除americanbg4运动帧超出americanbg2运动帧的结束点。
![edge](//img.aotu.io/pfan/edge/14.jpg)
4.最后一帧，设置trigger触发器，形成循环动效

## 第三部分 增加音乐，闪烁星空
这一部分，基本参照第一二部分的我们就可以完成整个动画，有一点需要注意设置playback，做初始延迟。

## 第四部分 处理移动端的适配，增加loading
由于这里出来的动画是640x1136px出来的效果，实现多终端预览时，需要做适配处理，这里我是采用scale进行缩放，已到达统一的效果。
```
(function(){var c=document.documentElement,d=function(){var b=c.getBoundingClientRect().width;s=(640<=b?640:b)/640,document.write('<style id="scaleCon">.o2-scale{-webkit-transform: scale('+s+"); transform: scale("+s+");-webkit-transform-origin:0% 0%;transform-origin:0% 0%;}</style>");window.addEventListener("resize",function(){var e=c.getBoundingClientRect().width;s=(640<=e?640:e)/640;document.getElementById("scaleCon").innerHTML=".o2-scale{-webkit-transform: scale("+s+"); transform: scale("+s+");-webkit-transform-origin:0% 0%;transform-origin:0% 0%;}"})};d()})();
```
我们只需要把class类o2-scale，添加给舞台就可以，完成适配。

[demo演示效果](http://pingfan1990.sinaapp.com/jdcase/blackfriday/)
手机扫描：
![edge](//img.aotu.io/pfan/edge/15.jpg)
ios，android亲测，效果还是比较流畅的。

#### 参考资料：
[Adobe Edge Animate CC 2014 JavaScript API 5.0](http://www.adobe.com/devnet-docs/edgeanimate/api/current/index.html#audio)
[Adobe Edge Animate 视频教程](https://helpx.adobe.com/edge-animate/how-to/edge-animate-symbols.html)
