title: 小程序与动画的故事
subtitle: 一个故事有主角，难免就有配角。但无论是主角还是配角，他们都有属于自己的故事，他们都有着自己前进的方向，换一个场景，配角一样可以当主角。
cover: https://img30.360buyimg.com/ling/jfs/t1/140994/18/15697/90100/5fbcaa96E24cb5ff6/66a8ecffa7dd71e7.jpg
tags:
  - 小程序
  - 动画
  - Taro
  - animation
categories: Web开发
author:
  nick: 暖暖
  github_name: Newcandy
date: 2021-04-09 10:39:04

---

## 一、故事序幕

时间一分一秒地流逝，小程序已伴随我们三载有余，今天要讲的是关于小程序与动画的故事：从前...

## 二、故事开头

一提小程序与动画，首先想到的是什么？嗯，微信小程序独创了一套动画玩法，官方支持3种动画方案，分别是 `createAnimation` 、 `this.animate` 和 `CSS3动画`。

### 1. `createAnimation`与`Animation`

> 创建一个动画实例animation。调用实例的方法来描述动画。最后通过动画实例的export方法导出动画数据传递给组件的animation属性。

```js
var animation = wx.createAnimation({
  transformOrigin: "50% 50%",
  duration: 1000,
  timingFunction: "ease",
  delay: 0
})

// step() 表示一组动画的完成，可以在一组动画中调用任意多个动画方法
// 一组动画中的所有动画会同时开始，一组动画完成后才会进行下一组动画
animation.translate(150, 0).rotate(180).step()
animation.opacity(0).scale(0).step()
this.setData({
  animationData: animation.export()
})
```

### 2. 关键帧动画`this.animate`接口

> 从小程序基础库 2.9.0 开始支持一种更友好的动画创建方式，用于代替旧的 wx.createAnimation 。它具有更好的性能和更可控的接口。在页面或自定义组件中，当需要进行关键帧动画时，可以使用 this.animate 接口。

```
this.animate(selector, keyframes, duration, callback)
```

官方给出的例子：

```js
  this.animate('#container', [
    { opacity: 1.0, rotate: 0, backgroundColor: '#FF0000' },
    { opacity: 0.5, rotate: 45, backgroundColor: '#00FF00'},
    { opacity: 0.0, rotate: 90, backgroundColor: '#FF0000' },
    ], 5000, function () {
      this.clearAnimation('#container', { opacity: true, rotate: true }, function () {
        console.log("清除了#container上的opacity和rotate属性")
      })
  }.bind(this))
```

### 3. css3动画

> 这是界面动画的常见方式，CSS 动画运行效果良好，甚至在低性能的系统上。渲染引擎会使用跳帧或者其他技术以保证动画表现尽可能的流畅。

利用样式实现小程序动画，用法和css用法相似，定义好指定的动画类名后给元素加上即可。

这是一个模仿心跳的动画：
```css
@keyframes heartBeat {
  0% {
    transform: scale(1);
  }

  14% {
    transform: scale(1.3);
  }

  28% {
    transform: scale(1);
  }

  42% {
    transform: scale(1.3);
  }

  70% {
    transform: scale(1);
  }
}

.heartBeat {
  animation-name: heartBeat;
  animation-duration: 1.3s;
  animation-timing-function: ease-in-out;
}
```

## 三、故事发展

故事的设定是这样子的：需要支持多种预设的动画效果配置，且实现进场动画、强调动画、退场动画按顺序运行。

如下，“3件5折/2件7折/1件9折”的文本 设置了 进场动画-从小到大 以及 强调动画-脉冲 的动画效果：

![demo](https://storage.360buyimg.com/o2app/atom/article/20201124/demo-setting.gif)

生成的小程序效果：

![demo](https://storage.360buyimg.com/o2app/atom/article/20201124/demo-compress5.75.gif)

Taro 是小程序的好伙伴，而且基于故事的设定，H5 还是要点饭吃的。

要想快速进入故事高潮，不得不采用一些取巧的手段了，决定采用市面上常见的 Animate.css 动画库来支持多种预设的动画效果！

### 1. 支持多种动画配置

> Animate.css是一个可在您的Web项目中使用的即用型跨浏览器动画库，预设了抖动（shake）、闪烁（flash）、弹跳（bounce）、翻转（flip）、旋转（rotateIn/rotateOut）、淡入淡出（fadeIn/fadeOut）等97种动画效果。[官网](https://animate.style/)首页即可查看所有动画效果。

要支持多种动画配置，考虑将 animate.css 这个非常棒的css库引入到小程序内使用。
从https://github.com/animate-css/animate.css/releases 下载源码，将 .css 文件 改名为 .wxss 或者.scss 文件，在页面或组件中引入样式文件即可。

```js
  import './animate.scss'
```

Animate.css 的使用非常简单，因为它是把不同的动画类型绑定到了不同的类里，所以想用哪种动画，只需要把相应的类添加到元素上就可以尽情享用了。

由于小程序对代码包的大小限制，因此可删除 animate.css 中所有 `@-webkit-` 等前缀的样式减少一半体积，甚至直接使用 `@keyframes` 的代码，即去掉类名的方式调用。


### 2. 执行完一个动画后接着执行另一个动画 ?

从上文可知，采用的是CSS3的动画方案，基本决定了故事的下一个发展阶段。

如果要实现进场动画、强调动画、退场动画按顺序运行，那么需要监听上一个动画结束，紧接着运行下一个动画。
动画过程中，微信小程序可以使用 `bindtransitionend`、`bindanimationstart`、`bindanimationiteration`、`bindanimationend` 来监听动画事件。

在 Taro 中内置组件的事件依然是以 on 开头的，即 `onTransitionEnd`、`onAnimationStart`、`onAnimationIteration`、`onAnimationEnd`。

> 注意：监听动画事件都不是冒泡事件，需要绑定在真正发生了动画的节点上才会生效。

要实现进场之前不可见，退场后不可见，设置 `animation-fill-mode: both` 即可，且不可移除样式，因为退场动画的效果效果 会失效，元素又显示出来了。

可能还得处理其他行为，比如 消失的元素 实际可能还占位，交互点击的行为最好解绑。

```jsx
<View
  onAnimationEnd={this.onAnimationEnd}
>
  {this.props.children}
</View>
```

## 四、故事高潮

故事都铺垫好了，终于来到了高潮。

眼尖的人儿也发现了，上文GIF图 “生成的小程序效果” 还实现了滚动到可视区域才开始执行动画的效果。

这是老生常谈的话题了，那怎么在小程序侧实现呢？

### 方案一：页面滚动模式

1. 小程序利用 `onPageScroll` 的 API 监听用户滑动页面事件，可获取 `scrollTop`：页面在垂直方向已滚动的距离（单位px）。
2. `Taro.createSelectorQuery` 获取元素在显示区域的竖直滚动位置。
3. 基上计算是否在可视区域来判断是否要开始动画。

### 方案二：观察者模式

1. 不支持 `onPageScroll`的情况下，则需要使用 `Taro.createIntersectionObserver` 获取目标节点与参照区域的相交比例触发相关的回调函数，即观察者模式。

### 代码奉上

(1) Taro获取当前页面的方式

首先我们要知道如何获取当前页面栈，数组中第一个元素为首页，最后一个元素为当前页面：

```
getCurrentPage () {
  const pages = Taro.getCurrentPages ? Taro.getCurrentPages() : [{}]
  const currentPage = pages[pages.length - 1]
  return currentPage
}
```

(2) 初始化页面滚动

判断使用页面滚动模式还是观察者模式：

```
initPageScroll () {
  const env = Taro.getEnv()
  const currentPage = this.getCurrentPage()

  // 获取onPageScroll方法
  const onPageScroll = currentPage.onPageScroll

  // 页面滚动模式：h5 或「小程序页面有onPageScroll勾子」使用统一的代码
  const isPageScroll =
    env === Taro.ENV_TYPE.WEB ||
    (env !== Taro.ENV_TYPE.WEB && onPageScroll !== undefined)

  // 观察者模式：小程序页面没有 onPageScroll 勾子，使用 Taro.createIntersectionObserver 监听
  const isObserver = env !== Taro.ENV_TYPE.WEB && Taro.createIntersectionObserver

  if (isPageScroll) {
    this.listenPageScroll(currentPage)
  } else if (isObserver) {
    this.observePageScroll()
  }
}
```

(3) 页面滚动模式

**首先在类外头定义一个多环境的 pageScroll 勾子，支持小程序和H5：**

```js
const createPageScroll = function(page) {
  const env = Taro.getEnv()
  let onPageScroll = () => {}

  if (env !== Taro.ENV_TYPE.WEB) {
    // 小程序
    const prevOnPageScroll = page.onPageScroll.bind(page)
    page.onPageScroll = e => {
      prevOnPageScroll(e)
      onPageScroll(e)
    }
  } else if (env === Taro.ENV_TYPE.WEB) {
    // H5
    window.addEventListener("scroll", () => {
      onPageScroll({ scrollTop: window.scrollY })
    })
  }

  return nextOnPageScroll => {
    onPageScroll = nextOnPageScroll
  }
}

```

**使用上述定义的createPageScroll方法，开始监听滚动：**
```js
listenPageScroll (currentPage) {
  const pageScroll = createPageScroll(currentPage)
  pageScroll(this.onScroll)
}
```

**获取距离页面顶部高度来判断是否要开始动画：**

知识点：
* 在 Taro 的页面和组件类中，`this` 指向的是 Taro 页面或组件的实例，而通过 `this.$scope` 获取 Taro 的页面和组件所对应的小程序原生页面和组件的实例。
* `Taro.createSelectorQuery` 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替。
* SelectorQuery对象实例可进一步查询节点信息，提供`select `、 `in` 、`exec`等方法。
* NodesRef 的 `boundingClientRect` 用于查询节点的布局位置，相对于显示区域，以像素为单位，其功能类似于 DOM 的 getBoundingClientRect。


```js
onScroll = () => {
  const query = Taro.createSelectorQuery().in(this.$scope)
  query
    .select(`.animation-${this.uniq}`)
    .boundingClientRect(res => {
      if (!res) return

      let resTop = res.top
      const distance = res.height / 2
      const isStartAnimation = resTop + distance < this.windowHeight
      if (isStartAnimation && !this.isAnimated) {
        this.startAnimation()
        // 动画只出现一次
        this.isAnimated = true
      }
    })
    .exec()
}
```


(4) 观察者模式：

知识点：
* `Taro.createIntersectionObserver` 创建并返回一个 IntersectionObserver 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createIntersectionObserver([options]) 来代替。
* IntersectionObserver 对象，用于推断某些节点是否可以被用户看见、有多大比例可以被用户看见。
* IntersectionObserver 的 `relativeToViewport` 方法 指定页面显示区域作为参照区域之一。
* IntersectionObserver 的`observe` 指定目标节点并开始监听相交状态变化情况，其中 `res.intersectionRatio` 指相交区域占目标节点的布局区域的比例。

```js
observePageScroll () {
  const navObserver = Taro.createIntersectionObserver(this.$scope, {
    initialRatio: 0.5,
    thresholds: [0.5]
  })
  navObserver.relativeToViewport()
  navObserver.observe(`.animation-${this.uniq}`, res => {
  const isStartAnimation = !this.isAnimated && res.intersectionRatio > 0.5
    if (isStartAnimation) {
      this.startAnimation()
      // 动画只出现一次
      this.isAnimated = true
    }
  })
}
```

### 五、故事结尾

小程序与动画的故事远远没有结束，纵使故事有了开头，你看到的只是故事的万种可能的其中一种。

故事就要告一段落了，小程序的故事还在持续奔跑，感谢 [微信小程序](https://developers.weixin.qq.com/miniprogram/dev/framework/) 和 [taro](https://taro-docs.jd.com/taro/docs/README) 的文档。
