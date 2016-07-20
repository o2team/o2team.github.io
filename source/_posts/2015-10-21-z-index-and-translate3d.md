title: 探究transform动画元素的z-index
subtitle: transform 变换的时候会让 z-index “临时失效”，其实并非 z-index 失效了，只是 z-index 被用在不同的 `stacking context` 上。
date: 2015-10-21 00:24:35
cover: //img.aotu.io/Manjiz/2015/manjiz-151116-cover.png
categories: Web开发
tags:
    - translate3d
    - zindex
author:
    nick: 小振
    github_name: Manjiz
---

## z-index 和 translate3d

在一次需求中，需要做出三张卡牌走马灯式滚动的效果，由于在前面的一张卡牌需要挡住后面的卡牌，自然而然地就用 z-index 使前面的卡牌显示在最上面，配以 transform 动画让“走马灯”滚起来，在开发过程中，在 PC 侧 Chrome 中表现良好，在本人手机浏览器中也表现良好，最后测试时却发现，在微信客户端或 QQ 客户端中打开页面出现问题，“走马灯”滚动时，卡牌先通过 transform 就位后，才把 z-index 设置较大的卡牌置于上面，感觉上非常的不流畅。

![](//img.aotu.io/Manjiz/2015/151116_card.png)

究其原因，发现这是某些浏览器的渲染规则，涉及到 `stacking context` 的概念，transform 的元素会创建新的 DOM，层级会在普通元素的上面，除了 transform ,还有哪些情况会创建新 `stacking context`呢？

MDN 上有相关介绍：
> * the root element (HTML),
> * **positioned (absolutely or relatively) with a z-index value other than "auto",**
> * **a flex item with a z-index value other than "auto",**
> * **elements with an opacity value less than 1,**
> * **elements with a transform value other than "none",**
> * elements with a mix-blend-mode value other than "normal",
> * elements with isolation set to "isolate", on mobile WebKit and Chrome 22+, position: fixed always creates a new stacking context, even when z-index is "auto",
> * specifing any attribute above in will-change even you don't write themselves directly

下图是对 transform 和 opacity 的测试结果：

![](//img.aotu.io/Manjiz/2015/151117_twotest.png)

很明显，红色 div 都在绿色 div 上面了，说明真的有创建了个更高层级的 `stacking context`。再做进一步测试，我给两组的 div 都加了 `position:relative;z-index:1;`，结果绿色的都在上面了，手机微信上也一样，这能不能说明 z-index 对层级的影响大于 transform 和 opacity 呢。

至于 transform 变换的时候会让 z-index “临时失效”，其实并非 z-index 失效了，只是 z-index 被用在不同的 `stacking context` 上，而非在默认的 context 上同等地比较层级了。所以 DOM 在 transform 的工程中，DOM 处于一个新的 `stacking context` 里，z-index 也是相对于这个 `stacking context` 的，所以表现出来的实际是 `stacking context` 的层次，动画一结束，DOM 又回到默认的 context 里，这时的 z-index 才是在同一个 context 上的比较。

那该用什么方法来控制卡牌的层级，又能让动画流畅地表现呢，当然是 translate3d 中的 z-axis，很多时候我们并不知道它是用来做什么的，平常用得最多的只是它的 x-axis 和 y-axis，不妨先看个例子：

    .box1 {width:100px;height:100px;background:red;transform:perspective(100px) translate3d(0, 0, 100px);}
	.box2 {width:100px;height:100px;background:blue;transform:perspective(100px) translate3d(0, 0, 200px);}

实际效果是，看不到它们，然后我们再设置 perspective 为 201px，这时可以很明显地看到，box2 占据了整个屏幕，而 box1 宽高约为 200px，唯有设置 translate3d(0,0,0) 时，宽高才为 100px。

现在可以来理解下 perspective 和 translate3d 的关系，perspective 可以比作镜头和 DOM 的距离，实际上设置多少都没影响，因为它通过跟 z-axis 上的数值比例来影响样式，它更像是一个刻度，而 translate3d 的 z-axis 则表示了 DOM 和屏幕的距离。假定镜头跟屏幕的距离固定了，z-axis 越大，DOM 逐渐远离屏幕，靠近镜头，这时 DOM 看起来也就越大，当 z-axis 大于或等于 perspective 时，DOM元素已经在我们镜头的后面了，所以也就看不到它了。

![](//img.aotu.io/Manjiz/2015/151116_perspective.png)

现在也就好理解为什么 perspective 和 translate3d 能够影响 DOM 的层级了，它们在屏幕和镜头之间的距离不同，所以就有了层次，移动端设备很好地表现了这个结论，但在 PC 的 Chrome 上测试则不然，我们仍需要 z-index 才会表现出我们需要的 层次关系。

**参考**

* http://segmentfault.com/q/1010000002480824
