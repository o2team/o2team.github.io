title: SVG vs Image, SVG vs Iconfont
subtitle: SVG vs Image, SVG vs Iconfont
cover: https://img12.360buyimg.com/ling/jfs/t29044/236/578633314/57264/117a113b/5bf75130N25fbd353.jpg
categories: WEB开发
date: 2018-11-23 09:00:00
tags:
  - Inline SVG
  - SVG Sprite
  - Iconfont
author:
  nick: Barrior
  github_name: Barrior
wechat:
    share_cover: https://img14.360buyimg.com/ling/jfs/t26365/12/2075548742/9209/9c5a16a4/5bf6b8ffNaeb1f241.jpg
    share_title: SVG vs Image, SVG vs Iconfont
    share_desc: SVG vs Image, SVG vs Iconfont

---

这可能是个别人写过很多次的话题，但貌似由于兼容性的原因？图标的显示还是用着 `Iconfont` 或者 `CSS Sprite` 的形式？
希望通过自己新瓶装旧酒的方式能重新引导一下问题。

## SVG vs Image

比方说现在要做下图这样的视觉效果：

![effect.gif](https://storage.360buyimg.com/barrior-bucket/svg_vs_image/effect.gif)

分析：可能需要三张图片
1. 鼠标移入时的背景图
2. 渐变色前景图
3. 鼠标移入时白色前景图

### 独立图像

现在对比一下背景图使用图片与使用 SVG 格式的体积大小（做图的时候拿错颜色了，其他都一样，能说明道理就行，见谅见谅）

![clipboard.png](https://img20.360buyimg.com/ling/jfs/t29947/274/533666854/53747/35c145bf/5bf6b4e6N4c4dab4a.png)

可以看出，在肉眼感觉差异不大的情况下，`WebP` 格式体积最小，其次是 `SVG`，而 `PNG` 的体积过大。 

这个 `SVG` 是在 `Sketch` 设计稿中导出来的，源码包含了很多冗余无效的代码，实际上是可以优化的，如下。

**内部源码**

![clipboard.png](https://img10.360buyimg.com/ling/jfs/t27379/17/2127682970/181903/299aeb62/5bf6b4e6N7043c51e.png)

**优化后**

![clipboard.png](https://img13.360buyimg.com/ling/jfs/t28441/251/554961840/95614/fd4f6d29/5bf6b4e5Ndff1a2e9.png)

优化后大约可以减去 `1K` 个字符。当然这个需要内联使用（Inline SVG）

![clipboard.png](https://img12.360buyimg.com/ling/jfs/t27373/22/2084537215/17770/70bb8766/5bf6b4e5N7cb98a9d.png)

### CSS Sprite

使用 `CSS Sprite` 的方式可以减少 `HTTP` 请求，貌似还可以减少总体图片体积。
这里用前景图来对比一下，实际上背景图和前景图都可以合成一张 `sprite`。

![图片描述](https://img11.360buyimg.com/ling/jfs/t30319/89/561805011/128109/8a54ba0f/5bf6b4e8N9e25785a.jpg)

可以看出，`CSS Sprite` 的体积比 `Inline SVG + CSS` 的方式大很多。 

### SVG vs Image 结论

![clipboard.png](https://img13.360buyimg.com/ling/jfs/t28843/29/529651934/140056/f2109210/5bf6b4e7N99cbb4fd.png)

绿色部分表示 `SVG` 比 `Image` 略胜一筹的地方，黄色部分表示有所欠缺的地方，灰绿色表示差不多。

1、如今已接近 `2019` 年了，对于 `IE9 (2011年)` 这种古老的浏览器都支持 `SVG`，所以再过多强调更低的兼容性也没有什么意思。
2、`Inline SVG` 在浏览器应该是被渲染成 `DOM` 节点，所以关于 `DOM` 节点的性能优化都有必要注意；一个 `SVG` 图像可能就会有很多路径，即 `DOM` 节点，太多的 `DOM` 节点必然会影响浏览器的渲染性能及内存占用，而纯位图的渲染方式应该是没有这方面的顾虑。（`DOM` 数量影响参考：[Google WEB 开发者文档](https://developers.google.com/web/tools/lighthouse/audits/dom-size)）

#### 综上结论：

除开复杂图像，选择 `Inline SVG` 或者 `<img/>` 标签的方式引入 `SVG`，会比使用 `独立图像` 或 `组合图像 (CSS sprite)` 的方式更好。


## SVG vs Iconfont

### 书写对比

> 首先看下 `Iconfont` 与 `SVG` 图标的使用方式，来源 [阿里 Iconfont 平台](http://iconfont.cn/help/detail?spm=a313x.7781069.1998910419.d8d11a391&helptype=code)

![clipboard.png](https://img20.360buyimg.com/ling/jfs/t28882/254/552085571/145887/5f42b29e/5bf6b4e7Na98aacf2.png)

很明显 `SVG Sprite` 使用起来没有 `Iconfont` 方便，需要写 `3` 行代码， 而后者只需要写 `1` 行。
当然上面的不是重点，重点是下面的**换色与多色支持**

### 换色与多色支持

#### 换色

1、`Iconfont` 通过 `CSS color` 可以轻松更换图标颜色。

2、而 `SVG Sprite` 比较麻烦，`SVG Sprite` 的代码原理如下。

```
// 定义 symbol
<svg>
    <symbol id="icon-arrow-left" viewBox="0 0 1024 1024">
      <path d="M694 ... 44.576-45.952"></path>
    </symbol>
    <symbol id="icon-arrow-right" viewBox="0 0 1024 1024">
      <path d="M693 ... 0-0.48-46.4"></path>
    </symbol>
</svg>

// 使用
<svg><use xlink:href="#icon-arrow-left"/></svg>
<svg><use xlink:href="#icon-arrow-right"/></svg>
```

渲染出来的 `DOM` 结构是这样的：

![clipboard.png](https://img20.360buyimg.com/ling/jfs/t26686/285/2072809755/36017/f105645/5bf6b4e5Nf74b5bcf.png)

渲染在了 `Shadow DOM` 中（关于 `Shadow DOM` 的知识可以阅读下[这篇文章](https://aotu.io/notes/2016/06/24/Shadow-DOM/index.html)或[这篇](https://developers.google.com/web/fundamentals/web-components/shadowdom)），
这样的 `DOM` 元素样式就具有了作用域，外面的 `CSS` 对 `shadow-root` 内的元素不会生效，
如果想要更换元素的颜色，需要使用 `/deep/` 来穿透添加样式，如下。
```
svg /deep/ path {
    fill: red;
}
```

当然，实际上在只需要在父级元素上添加 `fill: red` 这样的 `CSS` 也能起到同样的效果，里面的元素会继承父级的样式。

> PS:  `/deep/` 是 `shadow DOM v0` 的写法，`v1` 已经把这样的写法抛弃了，实际上支持 `v1` 的 `shadow DOM`, 父级的样式可以直接作用在 `shadow-root` 里面的元素。

#### 多色支持

1、`Iconfont` 是不支持多色图标的。

2、而 `SVG Sprite` 可以利用 `CSS` 变量或 `shadow DOM` 的方式支持多色图标，`shadow DOM`的方式上面已经说明，下面借用[他人的文章](https://zhuanlan.zhihu.com/p/20753791)解释 `CSS` 变量实现多色，如下。

![clipboard.png](https://img10.360buyimg.com/ling/jfs/t26533/361/2032824877/206917/50b1c816/5bf6b4e8N83931f4f.png)

不过使用 `CSS` 变量或 `shadow DOM` 的方式兼容性都不好，
 1. `CSS` 变量：Edge15+
 1. `shadow DOM`：更差。[兼容性列表](https://caniuse.com/#search=shadow%20DOM)

3、`Inline SVG` 可以良好地支持多色及多色变化。

#### 渐变色支持

`Iconfont` 与 `SVG Sprite` 不支持渐变色。
`Inline SVG` 支持渐变色，并且兼容性良好。

### 渲染无抖动

使用 `Iconfont`，因为字体文件是异步加载的，所以在字体文件还没有加载完毕之前，图标位会留空，加载完毕后才会显示出来，这个过程就会出现向下图（来自 [GitHub blog](https://blog.github.com/2016-02-22-delivering-octicons-with-svg/)）这样的抖动，而 `SVG Sprite ` 或 `Inline SVG` 内联加载则不会出现这样的抖动。

![图片描述](https://storage.360buyimg.com/barrior-bucket/svg_vs_image/shake.gif)

当然，`Iconfont` 也可以内联加载，不过需要转换成 `base64` 同样式表一起加载，转换后的文件体积则会变为原来的 `1.3` 倍左右
这是由 `base64` 编码决定的（[编码知识链接](https://zh.wikipedia.org/wiki/Base64)）。

> 字体转换成 `base64` 的一个在线工具：[https://transfonter.org/](https://transfonter.org/)

### 体积较大

这个是 `SVG` 对比于 `Iconfont` 的一个不足之处，如下图。

![clipboard.png](https://img10.360buyimg.com/ling/jfs/t27577/361/2059181254/37573/8175bb84/5bf6b4e6N00808316.png)

> `Inline SVG` 与 `SVG Sprite` 体积差不多。

### 开发成本

三者的开发成本都差不多，不过 `SVG` 的两种方式都需要前期做些配置，后期开发就会顺手很多（单页应用）。

以 `vue + vue cli` 为例说明 `Inline SVG` 便捷使用。

#### 1、 配置 `Webpack loader`:

```javascript
{
  // 排除需要转换成 Inline SVG 的目录
  exclude: [resolve('src/svgicons')],
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 1,
    name: utils.assetsPath('img/[name].[hash:7].[ext]')
  }
},
{
  // 指定特定的目录用于 Inline SVG
  include: [resolve('src/svgicons')],
  test: /\.svg$/,
  use: [
    // 读取 SVG 源代码
    { loader: 'raw-loader' },
    // 精简优化 SVG 源代码
    {
      loader: 'svgo-loader',
      options: {
        plugins: [
          { removeTitle: true },
          { removeViewBox: false },
          { removeDimensions: true },
          // ...其他参数
        ]
      }
    }
  ]
}
```

#### 2、 创建 `SvgIcon.vue` 组件:

```
<template>
    <div class="svg-icon">
      <div class="svg-icon-wrapper" v-html="icon"></div>
    </div>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data () {
    return {
      icon: this.getIcon(),
    }
  },
  watch: {
    name () {
      this.icon = this.getIcon()
    },
  },
  methods: {
    getIcon () {
      return require(`@/svgicons/${this.name}.svg`)
    },
  },
}
</script>

<style lang="stylus" scoped>
.svg-icon {
  overflow hidden
  display inline-block
  width 1em
  height 1em
  &-wrapper {
    display flex
    align-items center
    >>> svg {
      width 100%
      height 100%
      fill currentColor
    }
  }
}
</style>
```

#### 3、使用：

```
<SvgIcon name="arrow-right" />
```

### SVG vs Iconfont 结论

应该是 `Inline SVG vs SVG Sprite vs Iconfont` 的结论，如下图。

![clipboard.png](https://img11.360buyimg.com/ling/jfs/t29380/261/537714095/117378/ae0af679/5bf6b4eaN5545937c.png)

#### 综上结论

选择 `Inline SVG` 或许是一个不错地选择去替代 `Iconfont` 的使用方式。

#### 扩展阅读

 1. GitHub 网站很早之前已经将图标的展示方式由 `Iconfont` 转成了 `Inline SVG`, 这一篇文章是他们的描述：
    [https://blog.github.com/2016-02-22-delivering-octicons-with-svg/](https://blog.github.com/2016-02-22-delivering-octicons-with-svg/)
 1. 很早的一篇文章关于两者的对比：[https://css-tricks.com/icon-fonts-vs-svg/](https://css-tricks.com/icon-fonts-vs-svg/)