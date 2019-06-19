title: CSS3动画之补间动画
subtitle: CSS3动画开发指南第一弹
cover: https://img12.360buyimg.com/ling/jfs/t1/79037/35/2274/50475/5d09cc6bEe11abb45/3a3a31e6a7ed08c7.png
categories: Web开发
tags:
  - CSS3
  - Aniamtion
  - 动画
author:
  nick: Tingglelaoo
  github_name: Tingglelaoo
date: 2016-05-06 11:03:09
---
<!-- more -->

**补间动画**是动画的基础形式之一，指的是人为设定动画的关键状态，也就是关键帧，而关键帧之间的过渡过程只需要由计算机处理渲染的一种动画形式。

在触屏页面中，常见的实现补间动画以下几种形式：

第一，CSS3 Animation。

通过animation(除steps()以外的时间函数)属性在每个关键帧之间插入补间动画。

第二，CSS3 Transition。

区别于animation，transition只能设定初始和结束时刻的两个关键帧状态。

第三，利用JavaScript实现动画，例如JavaScript动画库或框架，著名的[TweenJS](<http://createjs.cc/tweenjs/>)，它是CreateJS的其中一个套件。另外，在Flash业界久负盛名的[GreenSock](<http://greensock.com/>)推出的GSAP(GreenSock Animation Platform)也新引入了对Javascript动画的支持。

第四，SVG 动画。

基于移动端对SVG技术的友好的支持性，利用SVG技术实现动画也是一种可行的方案。

对于利用Transition实现的动画而言，是有一定局限的。

引述阮一峰老师的文章[《CSS动画简介》](http://www.ruanyifeng.com/blog/2014/02/css_transition_and_animation.html)里的总结，

> 
transition的优点在于简单易用，但是它有几个很大的局限。
（1）transition需要事件触发，所以没法在网页加载时自动发生。
（2）transition是一次性的，不能重复发生，除非一再触发。
（3）transition只能定义开始状态和结束状态，不能定义中间状态，也就是说只有两个状态。
（4）一条transition规则，只能定义一个属性的变化，不能涉及多个属性。


囿于这样的局限，在触屏页面中很少见到Transition动画的身影，但是并不意味着没有，譬如翻页动画的实现可以利用Javascript脚本配合transition与transform属性来实现。
> 案例截图来源于[《京东：2015JDC燃爆事件》](<http://wqs.jd.com/promote//2015/paper/index.html>)

<img src="//storage.360buyimg.com/mtd/home/11560923364286.gif" alt="《京东：2015JDC燃爆事件》截图" style="display:block;margin: 0 auto;" />

>对应的 Chrome Dev Tool 代码调试截图

<img src="//img14.360buyimg.com/ling/jfs/t1/47331/27/2751/55432/5d09ccfcEc308512c/898cfe0032dc4ffe.png" alt="《京东：2015JDC燃爆事件》Chrome Dev Tool 代码调试截图" style="display:block;max-width:640px;margin:0 auto;" />


所以，利用CSS3实现动画的重头戏都在于**Animation**的运用。
然而想写好CSS3 Animation动画需要花费一些力气，这是看似简单实则需要把握好细节的活儿。

## 动画过程要预先规划好，这可不是是敲敲脑壳就能码出来的事儿。

可以是一张把与设计师沟通的结果加之分析输出一张动画属性分解表。

 > 动画属性分解表示例，来源于[《常见动效制作手法》](<http://isux.tencent.com/h5active.html>)

<img src="https://img20.360buyimg.com/ling/jfs/t1/83503/32/2345/13580/5d09cd1bE50fdb02f/49008ef5ec9fbcd3.png" alt="《动画属性分解表示例》" style="display:block;max-width:640px;margin: 0 auto;" />



又或者是根据沟通分析规划出来的动画时间轴。

> 动画时间轴，来源于[《CSS3动画实践》](<http://aotu.io/notes/2016/01/04/css3-animation/>)

<img src="https://img12.360buyimg.com/ling/jfs/t1/56217/5/2766/57411/5d09cd30E3d7daa3d/a5b31b0dfc91e6df.png" alt="《动画时间轴示例》" style="display:block;margin: 0 auto;" />




## 动画要自然不生硬，十二法则你值得拥有

不管是在影视动画界，还是前端动画界里遵循的都是同一套配方，追求同样的味道——「迪士尼九老」总结的[十二黄金动画法则](http://markgeyer.com/pres/the-art-of-ui-animations/#/2/5)（以下简称“十二法则”），一直沿用至今、备受推崇不是没有道理的。

在一些优秀的触屏页面案例里，可以追寻到它的踪迹。
> 案例截图来源于《腾讯：微众银行》中的摩托车[demo](<http://www.sunnyzhen.com/course/demo/motorcycle/index.html?from=message&isappinstalled=0>)

<img src="http://storage.360buyimg.com/mtd/home/51560923465982.gif" alt="《腾讯：微众银行》截图" style="display:block;max-width:320px;margin: 0 auto;" />
<img src="https://img13.360buyimg.com/ling/jfs/t1/80133/13/2282/27054/5d09cd5eE5947df0d/333fe7aab984522f.png" alt="《腾讯：微众银行》截图" style="display:block;max-width:320px;margin: 0 auto;" />

作者对轮子和摩托车的处理就体现出“挤压和拉伸”的法则，带出颠簸的现实感。

小编是非常推荐大家去认真研究这个案例的，因为作者陈在真就此说明过他的这部作品就完全是遵循迪士尼动画十二原则所码出来的。

但是很可惜，案例已经下线了。

不过，你还可以欣赏到另一位对迪士尼十二法则同样有心得的大神EC的作品[《拍拍小店全新上线》](http://jdc.jd.com/fd/pp/weixiaodian_welcome/index.html)。

> 案例截图来源于[《拍拍小店全新上线》](http://jdc.jd.com/fd/pp/weixiaodian_welcome/index.html)

<img src="http://storage.360buyimg.com/mtd/home/61560923506705.gif" alt="《拍拍小店全新上线》截图1" style="display:block;max-width:320px;margin: 0 auto;" />
<img src="https://img30.360buyimg.com/ling/jfs/t1/70054/21/2284/39132/5d09cd85Ed87087a5/df48434267c56b56.png" alt="《拍拍小店全新上线》截图1" style="display:block;max-width:320px;margin: 0 auto;" />

盒子的打开过程就带有一个往上展开预备动作(ANTICIPATION)，并且展开撒开的碎彩纸带有慢出(SLOW OUT)的效果，拍拍小店的logo弹出符合弧形(ARCS)的运动轨迹。

<img src="http://storage.360buyimg.com/mtd/home/71560923549206.gif" alt="《拍拍小店全新上线》截图1" style="display:block;max-width:320px;margin: 0 auto;" />
<img src="https://img14.360buyimg.com/ling/jfs/t1/77019/19/2322/40165/5d09cdb1E9108576a/7855ade33503e4ce.png" alt="《拍拍小店全新上线》截图1" style="display:block;max-width:320px;margin: 0 auto;" />

除此之外弧形运动轨迹最为明显的地方就是页面切换的过程。

整个案例处处都非常生动自然、利落感满满，令人赞叹。

如果你想了解怎么去实现才能够符合十二法则，可以进一步阅读这篇文章[《The Guide To CSS Animation: Principles and Examples》](https://www.smashingmagazine.com/2011/09/the-guide-to-css-animation-principles-and-examples/#more-105335)喔，不谢。

另外，在把控十二法则时为了动画更加自然，时间函数(animation-timing-function)的设计绝对是举足轻重的一环，因为动画可以说是一种关于时间函数的运动演变过程。要码好动画，这篇关注介绍缓动函数的[《让界面动画更自然》](http://isux.tencent.com/animation-factor.html)说不定能够助你一臂之力。

## 码好了动画，做好了页面，以为就此结束了吗？不要太天真，移动端对性能的要求也是一道需要迈过的坎儿。

Google在有关动画性能渲染优化的文章[《动画 | Web Fundamentals - Google Developers》](https://developers.google.com/web/fundamentals/design-and-ui/animations/?hl=zh-cn>)（对不起，这里有道墙）中提出建议:
> **避免为开销大的属性设置动画**，要让每次在设置动画时必须注意保持 60fps。

那么，哪些是开销大的属性呢？
（下面是科普环节，清楚的童鞋可以跳过）。

页面渲染的一般过程为JS > CSS > 计算样式 > 布局 > 绘制 > 渲染层合并。

<img src="https://img12.360buyimg.com/ling/jfs/t1/58550/7/2768/33641/5d09cdc6E3a8e37d5/f454d54230a7bc66.png" alt="《页面渲染的一般过程》" style="display:block;max-width:640px;margin: 0 auto;" />

其中，**Layout(重排)和Paint(重绘)是整个环节中最为耗时的两环**，所以我们尽量避免着这两个环节。从性能方面考虑，最理想的渲染流水线是没有布局和绘制环节的，只需要做渲染层的合并即可。

<img src="https://img12.360buyimg.com/ling/jfs/t1/62552/34/2232/29521/5d09cdd9E76e61008/b900bc08761dde28.png" alt="《页面渲染的一般过程》" style="display:block;max-width:640px;margin: 0 auto;" />

那怎么知道哪些CSS属性的改变是会影响这两个环节的呢？诺，下面就是各CSS属性与其影响的环节。
> 截图来源于[CSS Triggers](http://csstriggers.com/)，更为详细地翻墙去拿吧

<img src="https://img20.360buyimg.com/ling/jfs/t1/45662/5/2750/27073/5d09cdecE007b8e55/26444fb48ed50a1a.png" alt="《各种CSS属性影响的渲染环节》" style="display:block;max-width:640px;margin: 0 auto;" />

在实际的应用里，最为简单的一个注意点就是，触发动画的开始不要用diaplay:none属性值，因为它会引起Layout、Paint环节，通过切换类名就已经是一种很好的办法。

```css
// 根据类名触发动画
.active {
	 &.flow_away {
		.mobile,
		.ground,
		.platform,
		.words {
		  -webkit-animation: flowAwayUp ease .5s forwards;
		  animation: flowAwayUp ease .5s forwards;
		}
	}
}
```
还有就是，translate属性值来替换top/left/right/bottom的切换，scale属性值替换width/height，opacity属性替换display/visibility等等。

除此之外，对动画渲染的优化还有其他方式，上面贴出Google文章链接就有一系列的文章解读，小编就不卖弄按下不表了，这里顺便抛出前辈对这方面相关的总结：

> 总结来源于@登平登平的[《H5动画60fps之路》](http://weibo.com/p/1001603865643593165786)

<img src="https://img12.360buyimg.com/ling/jfs/t1/58196/39/2886/375991/5d09ce04Eb4325f00/05def995278ae756.png" alt="《H5动画60fps之路》" style="display:block;max-width:640px;margin: 0 auto;" />

最后总结下要点就是
- 事先做好规划
- 码的时候注意十二法则
- 谨记避免导致layout/paint的属性

搞定！

> 最后的最后，由于本文主推的是CSS3 Animation，其余的实现方式不在讨论范围内：P，拜拜，下次再见。
