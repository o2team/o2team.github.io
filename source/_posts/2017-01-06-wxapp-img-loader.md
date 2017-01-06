title: 在微信小程序里实现图片预加载组件
subtitle: 图片预加载这种基础功能怎么能没有？微信不提供我们来自己搞~
cover: //storage.360buyimg.com/mtd/home/img-preload1483692736111.jpg
date: 2017-01-06 18:00:00
categories: Web开发
tags:
  - 小程序
  - 微信小程序
author:  
    nick: HM
    github_name: hihuimin

---

## 网页中的图片预加载

我们知道在 Web 页面中实现图片的预加载其实很简单，通常的做法是在 JS 中使用 `Image` 对象即可，代码大致如下

```js
var image = new Image()
image.onload = function() {
  console.log('图片加载完成')
}
image.src = 'http://misc.360buyimg.com/lib/img/e/logo-201305.png'
```

然而在微信小程序（以下简称小程序）里要实现图片的预加载要更麻烦一些，因为小程序里并没有提供类似 `Image` 这样的 JS 对象。。

## 小程序必知必会

在进入正题前，需要了解以下小程序相关的知识（当然最好还是完整的学习一下[官方文档](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/MINA.html)）：

1. 小程序框架的核心是一个响应的数据绑定系统，整个系统分为视图层和逻辑层两块，视图层即页面模板（后缀为 .wxml 的文件），逻辑层即页面 JS 文件
2. 小程序的页面模板由一系列的基础组件组合而成，如 `view`、`text`、`button` 等
3. 页面内容的更新基于数据的单向绑定来进行，通过 JS 调用 Page 对象的 `setData` 方法来更新模板中绑定的数据
4. 视图层到逻辑层的通信是通过事件完成的，在组件中声明事件的回调，JS 端可监听到界面交互的发生、组件状态的变化等
5. 在 WXML 文件中，可通过 `template` 进行模板的复用，若 `template` 是在不同文件里定义的，需要先通过 `import` 语句进行引入

这里有个官方的简单例子可以用来帮助理解

```html
<!-- 模板文件 foo.wxml -->
<view> Hello {{name}}! </view>
<button bindtap="changeName"> Click me! </button>
```

```js
//脚本文件 foo.js
Page({
  data: {
    name: 'WeChat'
  },
  changeName: function(e) {
    this.setData({
      name: 'MINA'
    })
  }
})
```

运行这个页面会看到一行 Hello WeChat! 的文字及一个按钮，点击按钮后文字会变成 Hello MINA!

## 在小程序中加载图片

小程序提供一个 `image` 组件（类似于 HTML 中的 img 标签），可以设置 src 及加载成功或失败的回调，使用起来很简单

```html
<!-- 模板文件 bar.wxml -->
<image src="http://misc.360buyimg.com/lib/img/e/logo-201305.png" bindload="imageOnLoad" binderror="imageOnLoadError" />
```

```js
//脚本文件 bar.js
Page({
    imageOnLoad(ev) {
        console.log(`图片加载成功，width: ${ev.detail.width}; height: ${ev.detail.height}`)
    },
    imageOnLoadError() {
        console.log('图片加载失败')
    }
})
```

运行以上代码，顺利的话页面上会显示出一张图片，同时控制台会打印出带图片宽高的日志信息

## 将功能抽离成公用组件

接下来我们考虑实现这么一个功能，在页面上载入一张尺寸和 K 数都很大的图片，由于图片很大，下载需要一定的时间，而在这段时间内，用户看到的是空白或是不完整的图片，体验显然不好。

一种常用的优化手段是先加载一张缩略图，该缩略图通过样式设置为和原图一样的宽高，这样用户首先能很快速地看到一张模糊的图片，此时再去对原图做预加载，加载完成之后对缩略图进行替换，因为此时图片已经下载过了，所以界面上能无缝地切换为原图显示，效果如下：

![单张图片预加载](http://storage.360buyimg.com/mtd/home/single-img-load1483686270312.gif)

完成这个优化操作的关键就在于需要一个公共的图片预加载组件的支持，接下来我们分步骤来看看如何实现

1. 新建 demo 页面及组件相关的文件 img-loader.js 和 img-loader.wxml，组件需要和页面一样有个模板文件，是因为小程序里无法动态地插入模板结构。然后在 demo.wxml 里通过 `import` 语句引用组件模板，在 demo.js 里通过 require 语句将组件脚本进行引入
2. 在页面中通过 `template` 调用组件模板并传入数据，这里我们传递一个名为 `imgLoadList` 的图片数组过去
3. 在页面脚本中的 `onLoad` 方法中对组件进行初始化，并将 `this` 对象传入，因为组件内必须通过 Page 对象的 `setData` 来更新模板里的内容
4. 在组件的 img-loader.js 中定义一个 `load` 方法用来创建一个图片的加载，将传入的 `src` 添加到加载队列中，并使用 `setData` 方法更新队列数据
5. 接下来在组件 img-loader.wxml 中通过接收到的图片队列数据，用 `wx:for` 指令去生成 `image` 组件来对图片进行加载，同时将成功及失败的回调绑定到 img-loader.js 中的方法中，最终再回调回 Page 对象中

![微信组件](http://storage.360buyimg.com/mtd/home/wxapp-component1483686942830.png)

可以看出，由于小程序里无法动态地插入模板结构，所以相对于普通网页端的组件调用，这里多出了在 WXML 文件中引入及使用模板这个步骤，而其他部分对于调用方（即Demo 页面）来说则是相似的，下面是完整的 Demo 页面的代码

```html
<!-- demo.wxml -->

<view class="img_wrap">
    <image wx:if="{{ imgUrl }}" src="{{ imgUrl }}" />
</view>

<button bindtap="loadImage">Click To Load Image</button>

<view class="msg">{{ msg }}</view>

<!-- 引入图片预加载组件 -->
<import src="../../img-loader/img-loader.wxml"/>
<template is="img-loader" data="{{ imgLoadList }}"></template>
```

```js
// ------ demo.js ------

//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')

//缩略图 80x50 3KB
const imgUrlThumbnail = 'http://storage.360buyimg.com/mtd/home/lion1483683731203.jpg'
//原图 3200x2000 1.6MB
const imgUrlOriginal = 'http://storage.360buyimg.com/mtd/home/lion1483624894660.jpg'

Page({
    data: {
        msg: '',
        imgUrl: ''
    },
    onLoad() {
        //初始化图片预加载组件
        this.imgLoader = new ImgLoader(this)
    },
    loadImage() {
        //加载缩略图
        this.setData({
            msg: '大图正拼命加载..',
            imgUrl: imgUrlThumbnail
        })

        //同时对原图进行预加载，加载成功后再替换
        this.imgLoader.load(imgUrlOriginal, (err, data) => {
            console.log('图片加载完成', err, data.src)
            this.setData({ msg: '大图加载完成~' })

            if (!err)
                this.setData({ imgUrl: data.src })
        })
    }
})
```

如果把图片加载完成的回调统一指定成 Page 对象中的方法，则可以很方便地处理多张图片的加载，这里也写了个例子，效果如下：

![多张图片预加载](http://storage.360buyimg.com/mtd/home/multi-img-load1483686388552.gif)

总的来说调用起来还算方便吧，img-loader 的组件代码略多这里就不贴出来啦，有兴趣的同学可以前往 [Github 项目页面](https://github.com/o2team/wxapp-img-loader) 查看，目前此组件已应用在京东购物小程序版中。Have Fun~
