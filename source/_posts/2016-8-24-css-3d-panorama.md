title: CSS 3D Panorama - 淘宝造物节技术剖析  
subtitle: 3D全景并不是什么新鲜事物了，但以前我们在Web 上看到的3D全景一般是通过Flash实现的。若我们能将CSS3   transform的相关知识运用得当，也是能实现类似的效果。  
cover: //misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/cover.jpg  
date: 2016-08-24 18:58:35  
categories: Web开发  
tags:  
  - CSS
  - 3d
  - panorama
author:  
    nick: J.c  
    github_name: JChehe  

---

### 前言
3D 全景并不是什么新鲜事物了，但以前我们在 Web 上看到的 3D 全景一般是通过 Flash 实现的。若我们能将 `CSS3 Transform` 的相关知识运用得当，也是能实现类似的效果。换句话说，3D 全景其实就是 CSS3 3D 的应用场景之一。

### 准备
在实现 CSS3 3D 全景之前，我们先理清部分 CSS3 Transform 相关的属性：

 - [transform-origin][2]：元素变形的原点（默认值为 50% 50% 0，该数值和后续提及的百分比默认均基于元素自身的宽高算出具体数值）；
 - [perspective][3]: 指定了观察者与 `z=0` 平面的距离，使具有三维变换的元素产生透视效果。（默认值：none，值只能是绝对长度，即负数是非法值）；
 - [transform-style][4]：为子元素提供 2D 还是 3D 的场景。另外，该属性是非继承的；
 - [transform][5]：修改 CSS 可视化模型的坐标空间，包括 [平移（translate）][6]、[旋转（rotate）][7]、[缩放（scale）][8] 和 [扭曲（skew）][9]。

下面我们对上述的一些点进行更深入的分析：

 - 对于 `perspective`，该属性指定了“眼睛”与元素的 `perspective-origin`（默认值是 `50% 50% 0`）点的距离。那么问题来了：“当我们以 `px` 作为衡量单位时，它的实际距离该如何量化呢？”   
答：当屏幕分辨率是 1080P（1920*1080px）且该元素或其祖先元素的 `perspective` 数值的值为 `1920px` 时，应用了 CSS3 3D Transform 的子元素的立体效果就相当于我们在距离一个屏幕宽度（1920px）的屏幕前观看该元素时的真实效果。尽管如此，目前笔者也不知道如何准确地为元素设置一个合适的 `perspective` 值，只能猜测大概值后进行调整，以达到满意的呈现效果。  
![此处输入图片的描述][10]  
根据 [相似三角形][11] 的性质可计算出被前移的元素最终在屏幕上显示的实际大小  

    另外，关于 `perspective` 还有另外一个重要的点是：因为 `perspective-origin` 属性的默认值是 `50% 50% 0`，所以对哪个元素应用 `perspective` 属性，就决定了“眼睛”的位置（即我们的“眼睛”是在哪个角度看物体）。一般来说，当我们需要正视物体时，就会将该属性设置在与该元素中心重合的**某一祖先元素**上。

    再另外，如果说：“如何让一个元素（的背面）不可见？”，你可能会回答 `backface-visibility:hidden;`。其实，对于在“眼睛”背后的元素（以元素的 `transform-origin` 为参考点），即元素的 `Z` 轴坐标值大于 `perspective` 的值时，浏览器是不会将其渲染出来的。

 - 对于 `transform-style`，该属性指定了其**子元素**是处于 3D 场景还是 2D 场景。对于 2D 场景，元素的前后位置是按照平时的渲染方式（即若在普通文档流中，同层级元素是按照代码中元素的先后编写顺序，后面的元素会遮住在其前面的元素）；对于 3D 场景，元素的前后位置则按照真实世界的规则排序（即靠近“眼睛”的元素，会遮住离“眼睛”远的元素）。

    另外，由于 `transform-style` 属性是非继承的，对于中间节点需要显式设定。

 - 对于 `transform` 属性：下图整理了 rotate3d、translate3d 的变换方向：  
![transform][12]   
需要注意的是：transform 中的变换属性的顺序是有关系的，如 translateX(10px) rotate(30deg) 与 rotate(30deg) translateX(10px) 是不等价的。

    另外，需要注意的是 scale 中如果有负值，则该方向会产生 180 度的翻转；

    再另外，部分 transform 效果会导致元素（字体）模糊，如 translate 的数值存在小数、通过 translateZ 或 scale 放大元素等等。**每个浏览器都有其不同的表现**。


### 实现
上面理清了一些 CSS Transform 相关的知识点，下面就讲讲如何实现 CSS 3D 全景 ：

想象一下，当我们站在十字路口中间，身体旋转 360°，这个过程中所看到的画面就是一幅以你为中心的全景图了。其实，当焦距不变时，我们就等同于站在一个圆柱体的中心。  

但是，虚拟世界与现实世界的最大不同是：没有东西是连续的，即所有东西都是离散的。例如，你无法在屏幕上显示一个完美的圆。你只能以一个正多边形表示圆：边越多，圆就越“完美”。 

同理，在三维空间中，每个 3D 模型都是一个多面体（即 3D 模型由不可弯曲的平面组成）。当我们讨论一个本身就是多面体（如立方体）的模型时并不足以为奇，但我们想展示其它模型时，如球体，就需要记住这个原理了。
![三维环境的球体][13]

[淘宝造物节的活动页][14] 就是 CSS 3D 全景的一个很赞的页面，它将全景图分割成 20 等份，相邻的元素构成的夹角 18°（360/20，相邻两侧面相对于棱柱中心所构成的夹角）。需要注意的是：我们要确保**每个元素的正面是指向棱柱中心的**。所以要计算好每等份的旋转角度值后，再将元素向外（即 Z 轴方向）平移 `r` px。对于立方体的 `r` 就是 `边长/2`，而对于其它更复杂的正多面体呢？  

举例：对于正九棱柱，每个元素的宽为 `210px`，对应的角度为 `40°`，即如下图：  
图片来自：https://desandro.github.io/3dtransforms/docs/carousel.html  
![正九棱柱的俯视图][15]   
正九棱柱的俯视图  

![计算过程][16]   
计算过程  

由此可得到一个公用函数，只需传入含有**元素的宽度**和**元素数量**的对象，即可得到 `r` 值：
```
function calTranslateZ(opts) {
  return Math.round(opts.width / (2 * Math.tan(Math.PI / opts.number)))
}

calTranlateZ({
    width: 210,
    number: 9
});  // 288
```

![俯视时所看到的元素外移动画][17]  
俯视时所看到的元素外移动画  

另外，为了让下文易于理解，我们约定 HTML 的结构：
```
#view(perspective:1000px)
    #stage(transform-style:preserve-3d)
        #cube(transform-style:preserve-3d)
            .div（width:600px;height:600px;） /*组成立方体的元素*/
```

正棱柱构建完成后，就需要将我们的“眼睛”放置在正棱柱内。由于在“眼睛”后的元素是不会被浏览器渲染的（与 `.div元素` 是否设置 `backface-visibility:hidden;` 无关），而且我们保证 `.div元素` 的**正面**都是指向正棱柱中心，这样就形成 360° 被环绕的效果了。

那“眼睛”具体被放置在哪个位置呢？  
答：通过设置 `#stage` 元素的 `translateZ` 值，让不能被看到的 `.div元素` 在 `Z` 轴上的最终坐标值（即其自身 `Z` 坐标和祖先元素 `Z` 坐标相加）大于 `#view` 元素的 `perspective` 值即可。如：立方体的正面的 `translateZ` 是 `-300px`（为了保证立方体的正面是指向立方体中心，正面元素需要以自身水平方向上的中线为轴，旋转 `180度`，即 `rotateY(-180deg) translateZ(-300px)`，即正面元素向“眼球”方向平移了 300px），而 `#view` 的 `perspective` 值为 `1000px`，那么 `#stage` 的 `translateZ` 值应该大于 `700px` 且小于 `1300px` 即可，具体数值则取决于你想要的呈现效果。

根据上述知识，笔者粗略地模仿了“造物节”的效果：http://jdc.jd.com/lab/zaowu/index_new.html

另外，只需 6 幅图就可以实现一张常见的无死角全景图。  
笔者自己又试验了下：http://jdc.jd.com/lab/zaowu/index2.html   

可由下图看出，将水平的 4 张图片合成后就是一张全景图：  
![此处输入图片的描述][18]

因此，理解上述知识后，通过 CSS3 Transform 相关属性就可以实现可交互的全景效果了。当然，交互的效果可以是拖拽，也可以是重力感应等。

正如在上文提到的：“没有东西是连续的，即所有东西都是离散的...”。通过两个案例的对比可以发现：图片数量越多，对图片的要求也越低。你觉得呢？
![淘宝造物节整体效果图][19]
造物节全景图

### 全景图素材的制作
将全景图制作分为设计类与实景类：

#### 设计类
要制作类似 [《淘宝造物节》][20] 的全景页面，设计稿需要有以下这些要求。

注：下面提及的具体数据均基于《造物节》，可根据自身要求进行调整（若发现欠缺，欢迎作出补充）。

整体背景设计图如下（2580*1170px，被分成 20 等份）：  
![淘宝造物节整体效果图][21]

基本要求：

 1. 水平方向上需要首尾相连；
 2. 因为效果图最终需要切成 **N 等份**，所以尽可能让 **设计图的宽度能被 N 整除**；
 3. 图片尺寸不仅要考虑正视图的大小，还要考虑元素在上下旋转时依然能覆盖视野（可选）。

当然，上图只是作为背景，我们还可以添加一些小物体素材（与背景图的运动速度不同时，可形成视差效果，增强立体感），如：   
![物体小元素1][22]   
![物体小元素2][23]  
小物体元素（虚线用于参考，造物节中共有 21 个小物体）

如上图所示，每个图片也被等分成 M 等份，而且 M 的宽度应该与 N（背景元素）的宽度相等（具体原因，请看文章评论）。

对于顶部和底图图片，则无特殊要求。

#### 实景类
如果想制作实景的全景效果，可以看看 Google 街景：  

[Google 街景][24] 推荐的设备如下：
![Google 街景推荐的设备][25]

如上图，最实惠的方式就是最后一个选项——[Google 街景 APP][26]，该应用提供了全景相机功能，但正如图片介绍所说，这是需要练习的，因此对操作要求比较高。

补充：
上周六（2016.8.20）参加了 TGDC 的分享会，嘉宾分享了他们处理全景的方式：

 1. 利用 RICOH THETA S 等专业设备拍出全景图
 2. 导出静态图像
 3. 利用设备专门提供的 APP 或 krpamo tools、pano2vr、Glsky box 等工具将静态图像转为 6 张图
 4. 利用 Web 技术制作可交互的全景图

其中 Web 技术有以下 3 种可选方式（当然，还有其它）：

 - CSS3（本文所提及的方式）
 - Three.js
 - krpano（为全景而生，低级浏览器则回退到 Flash），[查看教程][27]

当时，嘉宾现场快速制作的 [会议现场全景][28]。

可见，优秀硬件设备的出现，大大减少了后期处理的时间，而 Web 则提供了一个很好的展现平台。

---

### 最后
随着终端设备的软硬件不断完善和提高，Web 在 3D 领域也不甘落后，如果你玩腻了 2D 的 H5 或者想为用户提供更加新颖优秀的体验，全景也许是一种选择。

最后，如有不清晰或不明白的地方，可以留言，我会尽可能解决的。谢谢谢~



  [1]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/cover.jpg
  [2]: https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform-origin
  [3]: https://developer.mozilla.org/en-US/docs/Web/CSS/perspective
  [4]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style
  [5]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform
  [6]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/translate3d
  [7]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/rotate
  [8]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/scale
  [9]: https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/skew
  [10]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/perspective.jpg
  [11]: https://zh.wikipedia.org/wiki/%E7%9B%B8%E4%BC%BC%E4%B8%89%E8%A7%92%E5%BD%A2
  [12]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/transform.jpg
  [13]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/ball.png
  [14]: http://zwj360.im20.com.cn
  [15]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/diagram.png
  [16]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/calc.png
  [17]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/expand4.gif
  [18]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/panorama3d.jpg
  [19]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/zaowujie.jpg
  [20]: http://zwj360.im20.com.cn
  [21]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/zaowujie.jpg
  [22]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/item3.jpg
  [23]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/item1.jpg
  [24]: https://www.google.com/streetview/publish/
  [25]: https://misc.aotu.io/JChehe/2016-8-24-css-3d-panorama/panorama_machine.jpg
  [26]: https://www.google.com/streetview/apps/
  [27]: http://krpano.com/docu/tutorials/quickstart/?from=groupmessage&isappinstalled=0#top
  [28]: http://wt.qq.com/act/tgdc_lottery/lottery.html
  [29]: https://aotu.io/
