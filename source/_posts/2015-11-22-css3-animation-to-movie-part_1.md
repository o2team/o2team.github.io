title: "以电影之眼看CSS3动画（一）"
subtitle: "要写CSS3动画，必先学技术。要写好CSS3动画，还是得深入探索传统动画的精华。"
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
# 以电影之眼看CSS3动画（一）
----------

	注：此文非干货聚集地，来找干货的对不住了。	
	注注：又多又大的图预警！！！


[CSS3动画](http://isux.tencent.com/css3/index.html)的变形基础（transform）包含4种变形方式（translate、rotate、scale、skew），同时还可设置2D、3D、变形原点（transform-origin）、透视（perspective）、透视原点（perspective-origin）等等特性；动画时间频率包含9种基本模式（ease、linear、ease-in、ease-out、ease-in-out、step-start、step-end、steps），甚至还可以使用cubic-bezier写出任何你想要的模式；再加上动画持续时间（animation-duration）等设定，各种排列组合，CSS3动画简直拥有了整个世界！

![trandition_animation](//img.aotu.io/lyxuncle/1-1_trandition_animation.png)
 
- 图片来源《动画的时间掌握》

根据[维基](http://zh.wikipedia.org/wiki/%E5%8A%A8%E7%94%BB)的释义，动画是指由许多帧静止的画面，以一定的速度（如每秒16张）连续播放时，肉眼因视觉残象产生错觉，而误以为画面活动的作品（gif图片正是运用这种原理）。因此最初的动画是通过几张快速翻动的连续画面制作而成，而后经历了电影摄影技术的出现、电脑科技的进步，逐渐转向数字化。

![bouncing_ball](//img.aotu.io/lyxuncle/1-2_bouncing_ball.gif)
![boucing_ball_frames](//img.aotu.io/lyxuncle/1-3_boucing_ball_frames.png)
 
- 将gif拖入PS之后打开时间轴窗口即可看到每一帧的画面

无论是2D还是3D动画，关键帧，正如其名，是动画制作中最关键的部分，同时也是最难把握的部分。曾经有位设计师告诉我，在大学的第一节flash课的课后作业，老师要求大家上交一份小球动画，包含气球、石头球与皮球，并告诉大家，以相同的外观表现出不同的质感是在考验你对关键帧的悟性，而这一个作业就能体现你是否适合学习动画。

![quality_of_ball](/img/post/lyxuncle/1-4_quality_of_ball.png )

> A 需要很大的力才能使一个炮弹移动。一旦它移动了，同样需要很大的力才能阻挡它前进。B 一只汽球只需要很小的力去移动它，但空气阻力使它很快停止动作。这两个例子都画了动作分格线，可以看出在银幕上表现物体的轻重，取决于对它们动作的时间掌握。（图片来源：《动画的时间掌握》）

在[《動畫製作流程介紹》](http://cghappening.blogspot.com/2011/02/blog-post_23.html)提供的视频中可以看到关键帧在动画制作中所起的地基般的作用。

![story_board_of_Monster_Inc](//img.aotu.io/lyxuncle/1-5_story_board_of_Monster_Inc.gif)
 
- 画面上方的手绘图即为[怪物公司]的关键帧

与关键帧紧密关联的即为时间轴（或摄制表），时间轴是补齐中间帧不可或缺的一项，在传统动画制作中，导演就是通过制定时间轴来掌控整部动画的节奏。

![continuity](//img.aotu.io/lyxuncle/1-6_continuity.jpg)

- 摄制表（图片来源：《动画的时间掌握》）

在CSS3中，@keyframes正是动画的关键帧容器。@keyframes中包含的包括transform在内的元素形态设定构成了关键帧的画面。@keyframes中的百分比即为时间轴的体现。中间帧则由浏览器自动完成（就像flash中的补全动画）。

``` css
.people{animation:people linear 1.5s;}
@keyframes people{
	0%, 95%{opacity:0;}
	100%{opacity:1;}
}
```
![css3_animation](//img.aotu.io/lyxuncle/1-7_css3_animation_2.png)

- 一个简单的动画关键帧示例

现在我们知道了CSS3动画的结构与传统动画之间的关系，重点来了， CSS3动画可以做出一部动画电影吗？欲知详情，且听下回分解。

## 参考资料：

- [《动画的时间掌握（修订版）》](http://www.amazon.cn/%E5%8A%A8%E7%94%BB%E7%9A%84%E6%97%B6%E9%97%B4%E6%8E%8C%E6%8F%A1-%E5%93%88%E7%BD%97%E5%BE%B7%E2%80%A2%E5%A8%81%E7%89%B9%E5%85%8B/dp/B0094N5III/ref=sr_1_1?ie=UTF8&qid=1420369719&sr=8-1&keywords=%E5%8A%A8%E7%94%BB%E7%9A%84%E6%97%B6%E9%97%B4%E6%8E%8C%E6%8F%A1)[英]哈罗德•威特克；[英]约翰•哈拉斯；[美]汤姆•赛图
