title: Vue 探索与实践
subtitle: 陪伴计划开发总结
cover: //misc.aotu.io/Manjiz/170717/cover_900x500.png
categories: 项目总结
tags:
  - vue
  - vuex
  - webpack
  - babel
  - eslint
  - 前后端
author:
  nick: 右小镇
  github_name: Manjiz
wechat:
  share_cover: //misc.aotu.io/Manjiz/170717/cover_200x200.png
  share_title: Vue 探索与实践
  share_desc: 陪伴计划开发总结
date: 2017-07-17 15:04:31
---

本文主要讲了实际业务在结合 vue 开发的过程中的探索与实践。

<!-- more -->

## 业务介绍

基于目标用户的孩子画像，打通、聚合京东现有体系关联资源，建立共生关系的开放式生态平台，涵盖满足家庭陪伴孩子成长过程中的多维度需求。覆盖场景场景导购、精准推荐、专属权益等，为京东有孩家庭购物提供优质优购体验。在项目开发中我们遇到的问题主要有以下三个：

- **接口众多**：近90个数据接口，数据字段不规范、不统一、难理解，接口开发经常延期且频繁变更；
- **交互复杂**：各种交互及状态，且一态多用，给用户展示的是多状态共同作用的结果，用户操作异步更新页面；
- **快速上线**：同时规划多版本，多版本并行开发。

## 技术选型

技术选型要对症下药，为了统一管理接口和数据，所采用的框架要有统一的数据中心，能做到视图与逻辑的分离，用数据来驱动视图，项目可以工程化来应对快速上线，以及利于后期维护。从学习成本来说，Vue 更容易上手，更轻量，结合 Vuex 管理状态，视图逻辑和数据的耦合度低，项目结构清晰明了，Vue 的可扩展性也非常好。Vue 核心技术主要有以下几点：

- **声明式渲染**：通过简洁的模板语法来声明式地将数据渲染进 DOM，DOM 状态是数据状态的一个映射。
- **组件系统**：跟大多数前端框架一样，都是把 UI 结构拆解成小的、可复用的组件树，然后像零件一样组装它们，Vue 还有比较独特的地方，那就是单文件组件，把归属于同一组件的模板、脚本、样式放在一个文件中，你不必再同时维护一个组件的多个文件，这样是不是很酷。
- **客户端路由**：结合 vue-router，Vue 就可以实现一个 SPA 应用了，主要通过 hash 值来控制路由，路由又可以传递状态参数给组件。
- **状态管理**：Vue 的基本状态触发过程是，用户行为使得 state 发生变化，state 的变化又触发视图的更新。而结合 Vuex 则可以管理全局的数据。

## 项目详解

### 项目结构

![项目结构](//misc.aotu.io/Manjiz/170717/project_structure.jpg)

### 项目开发

下面将分为以下几方面来阐述：开发辅助、路由、组件化、mixins、常量管理、数据中心、环境兼容、滚动行为。

#### 开发依赖

项目采用 Webpack，并结合了 ESLint 和 Babel 等来进行开发和编译打包，Webpack 的基本配置不详讲，在基本配置的基础上，再分了开发环境的生产环境的配置：

``` js
// Dev 的配置
module.exports = merge(base, {
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../index.html'
    })
  ]
})

// Prod 的配置
module.exports = merge.smart(base, {
  module: {
    loaders: [
      {
        test: /\.s[a|c]ss$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: "style-loader",
          loader: 'css!sass'
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js'
    }),
    new webpack.LoaderOptionsPlugin(loadersConf),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
})
```

开发环境中，用 `express` 和 `webpack-dev-middleware` 来搭建一个 dev server：

``` js
const express = require('express')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpack = require('webpack')
const conf = require('./webpack.dev.conf')
const app = express()
const port  = process.env.PORT || 8080

conf.entry.app = ['webpack-hot-middleware/client', conf.entry.app]
const compiler = webpack(conf)

app.use(webpackDevMiddleware(compiler, {
  publicPath: conf.output.publicPath,
  stats: {
    colors: true,
    chunks: false
  }
}))
app.use(require('webpack-hot-middleware')(compiler))

app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
```

#### 路由

一个路由子项如下：

``` js
{
  name: 'index', path: '/index',
  meta: {title: '陪伴空间', pv: 50, profiles: true, visitor: true, verify () { return true }},
  components: {default: Index2, navbar: Navbar}
}
```

其中，配置里的 meta 包含了该页面（视图）的配置信息：

- title：页面的标题
- pv：用作记录页面的 PV
- profiles：用于判断是否需要有孩子才能进入这个页面
- visitor: 是否支持游客访问
- verify：如果支持游客访问，可选的额外的放行校验

> 问题：在 ios 里，单页面应用切换视图时页面标题不能更新
> 解决：切换路由时用 iframe 加载一个空页面即可触发 title 更新，如下所示

``` js
const iframeLoad = (src) => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src = src
  document.body.appendChild(iframe)
  iframe.addEventListener('load', function() {
    setTimeout(function() {
      iframe.remove()
    }, 0)
  })
}
```

路由中还要处理比较多的事情，在 `router.beforeEach` 中处理传进页面的参数，请求登陆状态和档案数据等基本接口，上报 PV，在 `router.afterEach` 中处理比较次要的事情。

#### 组件化

接下来讲的是项目中的单文件组件。下面是一段特别编辑过的单文件组件代码：

``` html
<template>
<div v-show="isShow" class="test">
  <!-- slot 的运用 -->
  <slot></slot>
  <slot name="slot2"></slot>
  <template v-if="testProp"></template>
  <template v-else></template>
  <!-- 对于嵌套较深的组件，可以用 function-type-prop 来代替 emit 触发链 -->
  <div @click="changeNickname && changeNickname('小镇')"></div>
  <div @click="close" class="test_btn">{{btnText}}</div>
</div>
</template>

<script>
import Utils from '@/utils'

export default {
  props: {
    testProp: {
      type: [Number, String],
      required: true
    },
    changeNickname: Function
  },
  data () {
    return {
      isShow: false,
      btnText: '',
      closeFn: null
    }
  },
  methods: {
    close () {
      this.isShow = false
      this.closeFn && this.closeFn()
    },
    // 除了 poops 传参，函数传参也是一种方式
    open (btnText = '', closeFn) {
      this.isShow = true
      this.btnText = btnText
      this.closeFn = closeFn
    }
  }
}
</script>

<style lang="sass">
@import "common";

.test {
  background-image: url(~@img/test/bg.png);
}
</style>
```

slot 对于可复用组件来说意义重大，因为我们在实际的应用中，组件往往大同小异，看起来可以做成组件的模块总会或多或少差异的地方，通过参数来控制这些差异也是可行的，但非常不利于组件的扩展，所以这些地方就交给 slot 来应对，slot 的意思是插槽，意指我们能在父组件中需要的时候，给组件填充自定义内容。

父组件通过 props 给子组件传值，或者，父组件还可以通过子组件实例的方法来给子组件传参（如代码中的 open 方法）。

子组件可以通过 emit 触发事件来向上通信，或者，通过直接调用作为 prop 传进来的父组件方法也可以实现向上通信（如代码中的 changeNickname）。

#### mixins

通常来说，不建议使用全局的 mixin，但总会有特殊需要，比如在本项目中，由于埋点和其他需要，几乎每个组件都要用到几个公用的全局数据，所以放到全局的 mixin 是最好不过的了 `Vue.mixin(mixins)`。使用全局的 mixin 要注意的是，不要把逻辑放到 mixin 里，因为每个组件都会执行一遍 mixin 的内容，组件一多就非常可怕了。

#### 常量管理

为了以后能更好地维护代码，需要对常量作归集管理，这里的常量主要是链接和数据的字段等。

``` js
// 链接常量的统一管理
export const REBUY_LIST = `${NIGHT}/re_purchase_detail`
export const REBUY_SWITCH = `${NIGHT}/re_purchase_switch_good`
export const REBUY_REMIND = `${NIGHT}/re_purchase_remind`
// ...
```

``` js
// 数据字段的统一管理
export const ID = 'id'
export const SKU = 'sku'
export const LINK = 'link'
export const NAME = 'name'
export const IMAGE = 'image'
export const JD_PRICE = 'jdPrice'
export const PRICE = 'price'
// ...
```

统一的常量管理也有利于规范统一，比如数据字段，接口给到的数据可能有字段不统一，或者不表意，或者脏数据多等问题，这就需要在获取到后端数据后对其进行“修剪”，规范的统一的字段名也有利于组件化。

#### 数据中心

![vuex](//misc.aotu.io/Manjiz/170717/vuex.png)

项目用了 vuex 来统一管理数据，在 view 组件中通过 vuex 提供的 mapActions 和 mapGetters 来求取数据，如下代码所示。

``` js
computed: {
  ...mapGetters({
    cate1st: 'cate1st',
    cate2nd: 'cate2nd'
  })
},
methods: {
  ...mapActions([
    'getCate1st',
    'getCate2nd'
  ])
}
```

而在“数据中心”中，getters 从 state 中取值，调用 action 请求后端接口，主动触发 mutation，在 mutation 里进行数据的“修剪”，得到我们真正想要的数据。大致过程如下图所示：

![数据中心](//misc.aotu.io/Manjiz/170717/data_center.gif)

#### 环境兼容

项目需要兼容多环境，包括购物车相关、商详页链接、优惠券链接、搜索链接等因环境不同而不同的方法，为此得针对不同环境分别定义它们，再根据 ua 进行选择：

``` js
// ...
let configs = {
  [uaTypes.APP]: App,
  [uaTypes.WECHAT]: Wechat,
  [uaTypes.QQ]: QQ,
  [uaTypes.MOBILE]: Mobile
}
export default configs[UA.type]
```

#### 滚动行为

对于 SPA 应用来说滚动行为是个挺头疼的问题，毕竟其本质只是一个页面，又是异步渲染的，所以难以保证各个视图的滚动行为能像多页面应用一样。为此进行了以下几步的探索。

- 结合 vuex 来存储滚动

在 view 的 beforeDestory 时，主动记录该视图的滚动值，在下次 mounted 时延时滚动到该位置。

> 这个方案需要为每个需要记录滚动的视图添加 state、mutation 和 action，并在视图添加额外的代码，实际操作繁琐，且跳外部链接后再返回时所记录的值也已经被销毁。

- 使用浏览器存储

为了解决跳外部链接后返回也能定位滚动位置，使用 localStorage 来记录滚动值，而且使用了 mixin，这样有需要操纵滚动行为的视图插入这个 mixin 就可以了，不需要在视图里加额外代码。

但是问题来了，我们并不能区分当次访问是第一次打开还是刚从外链返回，就导致了第一次访问也会被定位，就想到了 cookie，让 cookie 保持 30min。显然，这不是好的解决方案，再考虑到的是 sessionStorage，在当前会话中它能一直保持数据，跳外链返回后数据也还能保持着（此前以为跳外链后 sessionStorage 的数据也会被清除），新标签打开视为新会话，互不共用数据，这几点特性正好符合我们的要求。

另外要考虑的一个问题是，页面是异步渲染的，我们并不知道它的接口什么时候都请求完了，于是除了有默认的延时滚动外，还添加了主动触发滚动的特性，让开发者考虑什么时候页面才算加载完（通常是 watch 某个或多个异步请求的状态），然后主动去调用滚动方法。

最后要指出的是，滚动行为的解决方案也并不是完美的，比如，这个方案并不适用于有模块懒加载的页面。

最终 mixin 代码如下：

``` js
/**
 * 如需手动触发滚动：
 * manualTriggerLivescroll: true
 * this._livescroll()
 */

import Tools from '@/utils/tools'

const ss = window.sessionStorage

export default {
  data () {
    return {
      routeName: this.$route.name,
      liveScrollFlag: false,
      liveScrollFn: null,
      liveScrollTimer: null
    }
  },
  computed: {
    liveScrollTop () {
      return ss ? 
        ss.getItem(`view-${this.routeName}`) : 
        Tools.getCookie(`view-${this.routeName}`)
    }
  },
  methods: {
    _livescroll () {
      if (this.liveScrollFlag || !this.liveScrollTop) {
        return
      }
      this.liveScrollFlag = true
      // $nextTick 发挥不太稳定
      this.liveScrollTimer = window.setTimeout(() => {
        document.body.scrollTop = document.documentElement.scrollTop = this.liveScrollTop
      }, 500)
    }
  },
  mounted () {
    document.body.scrollTop = document.documentElement.scrollTop = 0

    !this.manualTriggerLivescroll && this._livescroll()

    this.liveScrollFn = () => {
      ss ? 
        ss.setItem(`view-${this.routeName}`, this.getScrollTop()) : 
        Tools.setCookie(`view-${this.routeName}`, this.getScrollTop(), 0.2083)
    }
    window.addEventListener('touchend', this.liveScrollFn, false)
  },
  beforeDestroy () {
    window.removeEventListener('touchend', this.liveScrollFn, false)
    this.liveScrollTimer && window.clearTimeout(this.liveScrollTimer)
  }
}

```

#### 其他

以下都是些琐碎的小问题，也有在项目开发过程踩过的坑。

- 接口延迟

为了尽量减少请求到的数据为空出的情况，基于 vue 的请求方法上包了一层，对于超时的接口重新发起一次请求。

- 支持 rest spread

给 babel 加 `"plugins": ["transform-object-rest-spread"]` 以支持 rest spread 的写法，或者直接用 `babel-preset-env`，同时 eslint 的配置加上 `"parserOptions": { "ecmaFeatures": { "experimentalObjectRestSpread": true } }`

- 如何切换 Webpack 的 publicPath 在开发环境和生产环境的配置

一开始是手动去更改，后来根据当前环境自动去选择

``` js
const publicPath = {
  development: '/',
  labs: 'http://xx.xxx.xx/mtd/h5/accompany/3.0.0-alpha/',
  production: '//xx.xxx.xx/mtd/h5/accompany/3.2.2/'
}[env]
```

- 别名在 mixin 资源路径的应用

由于页面的路径跟 includePath 的路径不一样，比如有个 `@mixin iconAddcart { background: url(../addcart.png); }`，在组件样式里 include 它时会提示找不到图片，这时如果改成带别名的路径 `~@img/addcart.png` 就能很好解决这个问题。

- CSS Masking 的运用

可以参考 leeenx 的 [CSS3 Mask 安利报告](//aotu.io/notes/2016/10/19/css3-mask/)，在本项目中较大范围地使用了 mask，主要的好处就是：**缩减背景图的大小，自定义遮罩，适应同形状多背景色的情况**。

> 需要注意的是，如果还要用 drop-shadow 的话，就得在外面再套一层来加 drop-shadow。

以上就是本文的全部内容。
