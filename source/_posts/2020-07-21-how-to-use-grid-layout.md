---
title: 如何使用Grid Layout
date: 2020-07-14 10:24:35
categories: CSS应用
tags: [grid, layout]
author: 何思源
---

#如何使用Grid Layout
##前言
CSS Grid Layout是一种栅格布局，随着各大浏览器的兼容，在可应用范围越来越广。很多人就会问能不能代替Flexbox弹性布局？虽然他们有点相似，但值得一提的是他并不能代替Flexbox弹性布局，它可以在复杂的应用场景下与Flexbox弹性布局相辅相成。该属性的理念有点类似以往在网页设计中的栅格布局，如果以前接触过网页的栅格系统会帮助理解CSS Grid Layout。

##兼容性
截止到20年7月14日，caniuse的兼容图。如图所示： 
![avatar](https://img11.360buyimg.com/ling/jfs/t1/123375/21/7070/220446/5f0d5b5aE710ed109/0004d4c17daeefa8.png)

##应用场景
先来看看应用场景，个人十分推荐它用于大型页面框架构建或者电商中的sku列表摆放。具体可以来看看这两个demo图都附录了源码地址。


[Demo 链接](https://codepen.io/bennyho/pen/XWXPrEG)

![avatar](https://img14.360buyimg.com/ling/jfs/t1/134234/14/4511/417385/5f0d5e32Eb60260d8/ad9eaa329aa09be6.png)

[Demo 链接](https://codepen.io/bennyho/pen/PoZdYVK)

![avatar](https://img12.360buyimg.com/ling/jfs/t1/122159/9/7091/434368/5f0d611bE53cd131a/9bb67298fd5be8b1.png)

##重要属性介绍
①.display: grid/inline-grid;
需要在包裹子元素的父容器上做出声明，该属性声明为CSS Grid Layout有两种，一种是块状元素display: grid，一种是行内块状元素display: inline-grid。该属性声明后其他属性才会有效。如图所示：

![avatar](https://img30.360buyimg.com/ling/jfs/t1/138417/19/2923/52943/5f0d6441E6b2071bf/5e351d8c8da68c44.png)

[Demo 链接](https://codepen.io/bennyho/pen/BajOyLX)



②.grid-template-areas: none/itemnames;
指定一个序列进行子元素排列



③.grid-template-rows和grid-template-columns
rows是代指行，columns是代指列，用来声明高或宽

1. 绝对值

 如%，px，vw等单位

2. repeat()

 grid-template-rows: repeat(几个, 数值);

 grid-template-rows: repeat(几个, 多个数值);

3. fr

如果声明的宽度为1fr，2fr，后者是前者2倍，自动划分

4. auto-fill

 结合repeat使用

 父级宽度高度限定情况下，每个item固定宽高尽可能填充



④.grid-gap
指定栅格之间的间距



⑤.grid-auto-flow: row/column
默认是row，用于指定填满的行或列的优先级。



以上②-⑤属性可以查看这个[Demo 链接](https://codepen.io/bennyho/pen/yLexyjM)



##扩展阅读
1. [CSS Grid Layout Module Level 1](https://www.w3.org/TR/css-grid-1/)
2. [CSS Grid Layout Module Level 2](https://www.w3.org/TR/css-grid-2/)