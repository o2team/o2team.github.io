title: "以电影之眼看CSS3动画（二）"
subtitle: "CSS3动画和电影到底有啥关系？讲了一篇都没讲到，不会是在骗我吧？你这个骗子。"
date: 2015-11-22 17:27:00
cover: //img.aotu.io/lyxuncle/cover.png
categories: Web开发
tags: 
 - CSS3
 - Animation
author:
	nick: EC
	github_name: lyxuncle
---
# 以电影之眼看CSS3动画（二）
----------

	注：此文非干货聚集地，来找干货的对不住了。
	注注：又多又大的图预警！！！

上回说到CSS3动画与传统动画之间千丝万缕的联系，现在就让我们来探讨一下用CSS3动画做一部动画电影都需要些什么。

一、

**首先你需要一个故事。**

即使只是一堆雪花往下掉，也是包含故事的——为什么下雪？是冬天来了？那是冬天的第一场雪吗？第一场雪有什么特点呢？好吧作为一个从没见过雪的南方人我承认我给自己挖了个坑，不过就是类似这种思路，让我们拥有了一个故事，所以，即使只有一秒钟的动画也是有故事的。Use your imagination.

小tip：在做影视题材的专题页时，我会首先根据相关影视的预告片确定入场动画的风格与基调，观看预告片不仅能够了解影片的风格，同时还能学习其字幕出现、消失以及转场的方式，获得一种节奏感，也就是上面所说的时间掌控。在看电影正片时也可留意影片开头与结尾字幕出现的形式，尤其是科幻片，电影字幕的设计与电影风格相辅相成，常常能让你脑洞大开——原来还能这么玩。

![preview_of_overheard_3](//img.aotu.io/lyxuncle/2-1_preview_of_overheard_3.gif)
 
- [[窃听风云3]预告片](http://movie.douban.com/trailer/156598/#content)中字幕出现的方式表现出信号干扰的效果，由此可以将影片相关专题作出这样的开场动画——

![animation_design_of_overheard_3_broadcast](//img.aotu.io/lyxuncle/2-2_animation_design_of_overheard_3_broadcast.gif)

- 视觉设计：吴丹枫

```css
@keyframes peoInner{
	0%, 12.5%, 16.5%, 20.5%{background:none;}
	10%, 12%{background:url(../img_bg/casts_adv_green_red.jpg) no-repeat 0 0;}
	14%, 16%{background:url(../img_bg/casts_adv_green_red.jpg) no-repeat 0 -725px;}
	18%, 20%{background:url(../img_bg/casts_adv_green_red.jpg) no-repeat 0 -725px;}
	13%, 17%, 21%, 100%{background:url(../img_bg/cast_adv_01.jpg) no-repeat top center;}
}
```
 
- 简单的几个不同色调的图片进行替换就能做出类似效果。（[demo地址](http://labs.qiang.it/labs/EC_demo/Doing_Movie_by_CSS3.html)）

二、

当我们在脑内小剧场构思好动画小故事之后（当然，你也可以将它写下来），我们就可以进行**关键帧与时间轴的设计**了。

> 任何人都可以用电脑动画软件将一个物体移动。但是如何赋予物体重量、大小、规模、移动和幽默感，这些都与你如何移动物体相关。电脑不能为动画师创造动画，动画师仍然需要了解时间掌握的原则知识以赋予电脑动画生命力。（《动画的时间掌握》）

这时需要注意的是因果关系对动画的影响，“一个动画师必须懂得自然界物体运动的力学知识”，这样“才能创造情绪和表达正确的感觉。”我们来看看为了使动画更加流畅真实，迪士尼爷爷想出了什么办法。［白雪公主与七个小矮人］作为80、90后动画电影启蒙，使用了一项革新动画制作的技术——[转描机](http://zh.wikipedia.org/wiki/%E8%BD%AC%E6%8F%8F%E6%9C%BA%E6%8A%80%E6%9C%AF)。

- （视频 [http://player.ku6.com/refer/TH-adgFO0MjSKh3i/v.swf](http://player.ku6.com/refer/TH-adgFO0MjSKh3i/v.swf) ）

![sidelights_of_snow_white](//img.aotu.io/lyxuncle/2-4_sidelights_of_snow_white.gif)

- 视频：[白雪公主与七个小矮人]（1974）幕后花絮

视频中有一个细节，迪士尼爷爷让动画师注意那位大叔在跳踢踏舞时重力对裤腿的作用（19分15秒）。是的，迪士尼爷爷强调的就是动画与物理学的关系。其实即使是网页中的动画也能用到牛顿运动定律，将网页元素看作一个有重量、有结构、有柔韧性的物体进行动画设计，会得到意想不到的效果。事实上已经有人这么做了——

![dribbble_form_animation](//img.aotu.io/lyxuncle/2-5_dribbble_form_animation.gif)
 
- dribbble's stripe checkout（图片来源：[The Art of Animation](http://markgeyer.com/pres/the-art-of-ui-animations/#/2/9)）

Adds a bit of realism to an otherwise static interface. ——[The 12 basic principles of animation - The Art of Animation](http://markgeyer.com/pres/the-art-of-ui-animations/#/2/5)

![bouncejs_example](//img.aotu.io/lyxuncle/2-6_bouncejs_example.gif)
 
- 图片来源：[Giving Animations Life](https://medium.com/tictail-makers/giving-animations-life-8b20165224c5)

Using Bounce.js and classical animation concepts to bring life to user interfaces. ——[Giving Animations Life](https://medium.com/tictail-makers/giving-animations-life-8b20165224c5)

三、

**不断的修改与调整。**

这是一个需要细致与耐心的过程，你得在不断的调整中保持大局观，避免陷入细节的纠结，同时又需要有能够将别扭的细节调整好的灵感。说白了就是同时拥有汉子的粗犷与妹子的细腻。节奏是一个很重要的要素，与银幕上的动画类似，CSS3动画创作者的意念必须即时并完全交给观众。

> 意念清晰易懂靠两个因素：1、好的表现手法和设计，要使每个主要动作能以最清楚和最有效的方式呈现在银幕上。2、好的时间掌握，要有足够的时间先使用户预感到将有什么事情发生，然后用于表现动作本身，最后要有好的收尾。这三者中，任何一项所占时间太多，便会感觉节奏太慢，用户会感到不耐烦，动画的出现便如同鸡肋。反之，如果时间太短，那么用户在注意到它之前，动作已经结束，创作者的意念未能充分表达，就浪费掉了。——《动画的时间掌握》

四、

别忘了进行**性能测试**。

这是一步有可能推翻前面两步甚至三步的一个步骤。但是即便发生了这样的事，也不要气馁，这并不意味着之前做的前功尽弃，反而是个宝贵的财富——对于性能的感受又多了一次体验，而其中的一些动画心得或许下次也能用上。

说了这么多，一切都显得辣么抽象，下面就上栗子。

![animation_of_an_eye](//img.aotu.io/lyxuncle/2-7_animation_of_an_eye.gif)

- 动画来源：[Pseudo-Elements Animations and Transitions](http://tympanus.net/Development/PseudoElementsAnimationsTransitions/index4.html)

这是个使用了最简单的css属性——padding、line-height、box-shadow——实现了令人吃了一斤效果的栗子，就像一道脑筋急转弯一样让大家对CSS3的动画的理解不止于CSS3的新属性，我们曾经用烂的CSS2.0属性同样也能开出花儿。

我们看到，CSS3动画并不只是由transform、opacity等等简单组成，它还可以包含许许多多的设计、想法、甚至感情。台上一分钟，台下十年功在动画上也适用，或许在所有事物上都适用。

目前为止用CSS3动画拍电影只是个概念，但想象一下你是这部电影的导演，所有元素都是可调度的场景与角色，用CSS3动画拍电影是不是也没有那么遥远了？

最后，我想将我一直以来没能找到合适实现方法的动画效果放上来，希望能够抛砖引玉、集思广益：

![frames_of_flame_1](//img.aotu.io/lyxuncle/2-8_frames_of_flame_1.jpg)

![frames_of_flame_2](/img/post/lyxuncle/2-9_frames_of_flame_2.jpg )

- A 冷空气从火的底部冲入，受热后上升。 B 一套火的循环①-⑧，标以×的漩涡一个接一个地向上升起。升得越高，速度越慢。

> 火焰的动作受火的上部流动着的空气的控制。最热的部分在火的中央，在这之上热空气上升，当热空气上升时，旁边的冷空气冲入取代热空气的位置。这部分冷空气变热后又上升，这个过程重复不已。空气的流通常常使火焰成为粗略的圆锥形，由冷空气的漩涡形成一连串锯齿状火焰，从火的底部向里和向上移动。（《动画的时间掌握》）


除了空气与火焰的关系外，火焰的运动由于随机性很大，循环动画需要写得看不出动作在循环也是难点之一。如何才能在保证结构、性能的同时做出最佳的火焰效果？

最最后，放上迪士尼爷爷的一段话，在我做动画甚至做任何事时它将不断地在脑海中回响：

曾经有人问迪士尼，[白雪公主]大受欢迎的秘密是什么？他回答说：

“我们只能确定一件事，每一个人都有童年，每次拍一部新片，我们不是为大人而拍，也不只是为小孩子拍，我们是为了唤醒每个人内心深处那种早就被遗忘的纯真世界。”

## 参考资料：

- [《动画的时间掌握（修订版）》](http://www.amazon.cn/%E5%8A%A8%E7%94%BB%E7%9A%84%E6%97%B6%E9%97%B4%E6%8E%8C%E6%8F%A1-%E5%93%88%E7%BD%97%E5%BE%B7%E2%80%A2%E5%A8%81%E7%89%B9%E5%85%8B/dp/B0094N5III/ref=sr_1_1?ie=UTF8&qid=1420369719&sr=8-1&keywords=%E5%8A%A8%E7%94%BB%E7%9A%84%E6%97%B6%E9%97%B4%E6%8E%8C%E6%8F%A1)[英]哈罗德•威特克；[英]约翰•哈拉斯；[美]汤姆•赛图

- [The Art of UI Animations](http://markgeyer.com/pres/the-art-of-ui-animations/#/) 

## 推荐：

- [ISUX动画工具、动画手册](ttp://isux.tencent.com/css3/tools.html)
	
	> 了解所有与CSS3动画相关的属性，使用动画工具更直观地调整变形。

- [12 Principles of Animation](http://minyos.its.rmit.edu.au/aim/a_notes/anim_principles.html)
	
	> 最近存在感极强的动画12原则，如果想要做出自然流畅的CSS3动画，这个由迪士尼动画巨头所总结出的经典原则绝对是必读之物。这里附上视频版：[http://vimeo.com/93206523](http://vimeo.com/93206523)
