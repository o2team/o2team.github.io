title: Sticky Footer，完美的绝对底部
subtitle: 所谓 "Sticky Footer"，并不是什么新的前端概念和技术，它指的就是一种网页效果：如果页面内容不足够长时，页脚固定在浏览器窗口的底部；如果内容足够长时，页脚固定在页面的最底部。
cover: http://storage.360buyimg.com/mtd/home/sticky_cover1492088401697.png
date: 2017-04-13 12:00:00
categories: 移动开发
author:
    nick: NONO
    github_name: liqinuo
    
---

## 写在前面

做过网页开发的同学想必都遇到过这样尴尬的排版问题：
在主体内容不足够多或者未完全加载出来之前，就会导致出现（图一）的这种情况，原因是因为没有足够的垂直空间使得页脚推到浏览器窗口最底部。但是，我们期望的效果是页脚应该一直处于页面最底部（如图二）：

<img src="http://storage.360buyimg.com/mtd/home/sticky_011492088284638.png" width="550">

笔者最近在项目中也遇到过这样的场景，在寻找最佳解决方案的过程中，了解到了 "Sticky Footer" 这个名词。
本文将带大家重新认识这个常见的网页效果，以及一些可行的实现方案。

## 什么是 "Sticky Footer"

所谓 "Sticky Footer"，并不是什么新的前端概念和技术，它指的就是一种网页效果：
如果页面内容不足够长时，页脚固定在浏览器窗口的底部；如果内容足够长时，页脚固定在页面的最底部。
**总而言之，就是页脚一直处于最底**，效果大致如图所示：

<img src="http://storage.360buyimg.com/mtd/home/sticky_021492088284641.png" width="550">

当然，实现这种效果的方法有很多种，其中有通过脚本计算的，有通过 CSS 处理的，脚本计算的方案我们不在本文探讨。
下面我们看看有哪些通过 CSS 可以实现且适用于移动端开发的方案，并分析其中的利弊。

## 如何实现

假设我们页面的 HTML 结构是这样：

```html
<div class="wrapper">
    <div class="content"><!-- 页面主体内容区域 --></div>
    <div class="footer"><!-- 需要做到 Sticky Footer 效果的页脚 --></div>
</div>
```

### 实现方案一：absolute

通过绝对定位处理应该是常见的方案，只要使得页脚一直定位在主容器预留占位位置。

```
html, body {
    height: 100%;
}
.wrapper {
    position: relative;
    min-height: 100%;
    padding-bottom: 50px;
    box-sizing: border-box;
}
.footer {
    position: absolute;
    bottom: 0;
    height: 50px;
}
```

这个方案需指定 html、body 100% 的高度，且 content 的 `padding-bottom` 需要与 footer 的 `height` 一致。

### 实现方案二：calc

通过计算函数 calc 计算（视窗高度 - 页脚高度）赋予内容区最小高度，不需要任何额外样式处理，代码量最少、最简单。

```
.content {
    min-height: calc(100vh - 50px);
}
.footer {
    height: 50px;
}
```

如果不需考虑 `calc()` 以及 `vh` 单位的兼容情况，这是个很理想的实现方案。
同样的问题是 footer 的高度值需要与 content 其中的计算值一致。

### 实现方案三：table

通过 table 属性使得页面以表格的形态呈现。

```
html, body {
    height: 100%;
}
.wrapper {
    display: table;
    width: 100%;
    min-height: 100%;
}
.content {
    display: table-row;
    height: 100%;
}
```

需要注意的是，使用 table 方案存在一个比较常见的样式限制，通常 margin、padding、border 等属性会不符合预期。
笔者不建议使用这个方案。当然，问题也是可以解决的：别把其他样式写在 table 上。

### 实现方案四：Flexbox

Flexbox 是非常适合实现这种效果的，使用 Flexbox 实现不仅不需要任何额外的元素，而且允许页脚的高度是可变的。

虽然大多数 Flexbox 布局常用于水平方向布局，但别忘了实际上它也可用于垂直布局，所有你需要做的是将垂直部分包装在一个 Flex 容器中，并选择要扩展的部分，他们将自动占用其容器中的所有可用空间。

```
html {
    height: 100%;
}
body {
    min-height: 100%;
    display: flex;
    flex-direction: column;
}
.content {
    flex: 1;
}
```

需要注意的是想要兼容各种系统设备，需要兼顾 `flex` 的兼容写法。

## 写在最后

以上几种实现方案，笔者都在项目中尝试过，每个实现的方法其实大同小异，同时也都有自己的利弊。
其中有的方案都存在一个限制性问题，需要固定页脚高度；其中有些方案需要添加额外的元素或者需要 Hack 手段。同学们可以根据页面具体需求，选择最适合的方案。

当然，技术是不断更新的，也许还有很多不同的、更好的方案。但相信大家最终目都是一样的，为了更好的用户体验！

参考资料：
https://css-tricks.com/couple-takes-sticky-footer/
http://www.w3cplus.com/css3/css-secrets/sticky-footers.html