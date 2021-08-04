title: 使用 Taro 3 将项目作为独立分包运行在京东购物小程序中
subtitle: 介绍如何把一个 Taro 3 项目作为独立分包运行在京东购物小程序，并顺利地进行开发、调试和上线等操作。
cover: https://img12.360buyimg.com/img/s900x383_jfs/t1/198722/1/1593/173438/610a3741E9707add5/8bd57c1599217905.jpg
categories: Web开发
tags:
  - Taro
  - 混合开发
  - 京东购物小程序
author:
  nick: 小屁
  github_name: xuanzebin
date: 2021-08-04 14:21:00
wechat:
  share_cover: https://img12.360buyimg.com/img/s900x543_jfs/t1/178574/28/17638/256141/610a3741Ecf5abc01/b586bc488042b570.jpg
  share_title: 使用 Taro 3 将项目作为独立分包运行在京东购物小程序中
  share_desc: 介绍如何把一个 Taro 3 项目作为独立分包运行在京东购物小程序，并顺利地进行开发、调试和上线等操作。
---
## 目录
- 背景
- 整体流程
- 应用过程
  - 准备合适的开发环境
  - 将 Taro 项目作为独立分包进行编译打包
  - 引入 @tarojs/plugin-indie 插件，保证 Taro 前置逻辑优先执行
  - 引入 @tarojs/plugin-mv 插件，自动化挪动打包后的文件
  - 引入公共方法、公共基类和公共组件
    - 引入公共方法
    - 引入公共组件
    - 引入页面公共基类
- 存在问题
- 后续

![Taro宣传图](https://img12.360buyimg.com/img/s1380x720_jfs/t1/173067/26/20486/62768/60f66f11E72bda565/93557275b8579a05.png)

## 背景
京东购物小程序作为京东小程序业务流量的主要入口，承载着许多的活动和页面，而很多的活动在小程序开展的同时，也会在京东 APP 端进行同步的 H5 端页面的投放。这时候，一个相同的活动，**需要同时开发原生小程序页面和H5页面的难题**又摆在了前端程序员的面前。
幸运的是，我们有 Taro，一个开放式跨端跨框架解决方案。可以帮助我们很好地解决这种跨端开发的问题。但不幸的是，**Taro 并没有提供一套完整的将项目作为独立分包运行在小程序中的解决方案**。因此，本篇文章将介绍如何**通过一套合适的混合开发实践方案，解决 Taro 项目作为独立分包后出现的一些问题**。

## 整体流程
总的来说，若要使用 Taro 3 将项目作为独立分包运行在京东购物小程序，我们需要完成以下四个步骤：
1. **准备开发环境**，下载正确的 Taro 版本
2. 安装 **Taro 混合编译插件**，解决独立分包的运行时逻辑问题
3. 调用 Taro 提供的**混合编译命令**，对 Taro 项目进行打包
4. **挪动打包后 Taro 文件**到主购小程序目录下

那么接下来，我们将对每个步骤进行详细的说明，告诉大家怎么做，以及为什么要这样做。

## 应用过程

### 准备合适的开发环境
首先我们需要全局安装 Taro 3，并保证**全局和项目下的 Taro 的版本高于`3.1.4`**，这里我们以新建的`Taro 3.2.6`项目为例：
```shell
yarn global add @tarojs/cli@3.2.6

taro init
```

之后我们在项目中用`React`语法写入简单的 `hello word` 代码，并在代码中留出一个`Button`组件来为将来调用京东购物小程序的公共跳转方法做准备。

```javascript
// src/pages/index/index.jsx

import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'

import './index.scss'

export default class Index extends Component {
  handleButtonClick () {
    // 调用京东购物小程序的公共跳转方法
    console.log('trigger click')
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button onClick={this.handleButtonClick.bind(this)} >点击跳转到主购首页</Button>
      </View>
    )
  }
}
```

俗话说得好，有竟者事竟成，在开始编码前，我们来简单地定几个小目标：
- **成功地将 Taro 项目 Hello world 在京东购物小程序的分包路由下跑通**
- **引入京东购物小程序的公共组件 nav-bar 并能正常使用**
- **引入公共方法 navigator.goto 并能正常使用**
- **引入公共基类 JDPage 并能正常使用**

### 将 Taro 项目作为独立分包进行编译打包
在将 Taro 项目打包进主购小程序时，我们很快就遇到了第一个难题：Taro 项目下默认的命令打包出来的文件是一整个小程序，**如何打包成一个单独的分包？**

幸运的是，在`3.1.4`版本后的 Taro，提供了混合开发的功能，意思为可以让原生项目和 Taro 打包出来的文件混合使用，只需要**在打包时加入 `--blended` 命令**即可。

```
cross-env NODE_ENV=production taro build --type weapp --blended
```

`blended` 中文翻译是混合的意思，在加入了这个命令后，Taro 会在构建出来的 `app.js` 文件中导出 `taroApp`，我们可以通过引入这个变量来在原生项目下的 `app.js` 调用 Taro 项目 app 的 onShow、onHide 等生命周期。

```javascript
// 必须引用 Taro 项目的入口文件
const taroApp = require('./taro/app.js').taroApp

App({
  onShow () {
    // 可选，调用 Taro 项目 app 的 onShow 生命周期
    taroApp.onShow()
  },

  onHide () {
    // 可选，调用 Taro 项目 app 的 onHide 生命周期
    taroApp.onHide()
  }
})
```

如果单纯地使用 `blended` 命令，即使我们不需要调用 onShow、onHide 这些生命周期，我们也需要**在原生项目下的 `app.js` 里引入Taro项目的入口文件**，因为在执行我们的小程序页面时，我们需要提前初始化一些运行时的逻辑，因此要保证 Taro 项目下的 `app.js` 文件里的逻辑能优先执行。

理想很丰满，现实很骨感，由于我们需要将 Taro 项目作为单独的分包打包到主购项目中，因此这种直接在原生项目的 app.js 中引入的方式**只适用于主包内的页面，而不适用于分包。**

### 引入 @tarojs/plugin-indie 插件，保证 Taro 前置逻辑优先执行
要解决混合开发在分包模式下不适用的问题，我们需要引入另外一个 Taro 插件 `@tarojs/plugin-indie`。

首先我们先在 Taro 项目中对该插件进行安装
```shell
yarn add --dev @tarojs/plugin-indie
```

之后我们在 Taro 的配置项文件中对该插件进行引入
```javascript
// config/index.js
const config = {
  // ...
  plugins: [
    '@tarojs/plugin-indie'
  ] 
  // ...
}
```

查看该插件的源码，我们可以发现该插件处理的逻辑非常简单，就是在编译代码时，对每个页面下的 `js chunk` 文件内容进行调整，在这些 js 文件的开头加上 `require("../../app")`,并增加对应 `module` 的 `sourceMap` 映射。在进行了这样的处理后，便能保证**每次进入 Taro 项目下的小程序页面时，都能优先执行 Taro 打包出来的运行时文件了。**

### 引入 @tarojs/plugin-mv 插件，自动化挪动打包后的文件
到目前为止，我们已经可以成功打包出能独立分包的 Taro 小程序文件了，接下来，我们需要将打包出来的 `dist` 目录下的文件挪到主购项目中。

手动挪动？no，一个优秀的程序员应该想尽办法在开发过程中“偷懒”。
因此我们会自定义一个 Taro 插件，在 Taro 打包完成的时候，**自动地将打包后的文件移动到主购项目中。**
```javascript
// plugin-mv/index.js
const fs = require('fs-extra')
const path = require('path')

export default (ctx, options) => {
  ctx.onBuildFinish(() => {
    const blended = ctx.runOpts.blended || ctx.runOpts.options.blended
    
    if (!blended) return

    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')
    const miniappPath = path.join(rootPath, 'wxapp')
    const outputPath = path.resolve(__dirname, '../dist')

    // testMini是你在京东购物小程序项目下的路由文件夹
    const destPath = path.join(miniappPath, `./pages/testMini`)

    if (fs.existsSync(destPath)) {
      fs.removeSync(destPath)
    }
    fs.copySync(outputPath, destPath)

    console.log('拷贝结束！')
  })
}
```

在配置文件中加入这个自定义插件：
```javascript
// config/index.js
const path = require('path')

const config = {
  // ...
  plugins: [
    '@tarojs/plugin-indie',
    path.join(process.cwd(), '/plugin-mv/index.js')
  ] 
  // ...
}
```

重新执行`cross-env NODE_ENV=production taro build --type weapp --blended`打包命令，即可将 Taro 项目打包并拷贝到京东购物小程序项目对应的路由文件夹中。

至此，我们便可在开发者工具打开主购小程序项目，在 `app.json` 上添加对应的页面路由，并条件编译该路由，即可顺利地在开发者工具上看到 `Hello World` 字样。

![效果图](https://img12.360buyimg.com/img/s1198x1729_jfs/t1/182715/6/14645/133727/60f57bb8Ec0823a67/7f1ba614d32f9fe7.jpg)

### 引入公共方法、公共基类和公共组件
在日常的主购项目开发中，我们经常需要用到主购原生项目下封装的一些公共模块和方法，那么，通过混合编译打包过来的 Taro 项目是否也能通过某种办法顺利引用这些方法和模块呢？

答案是可以的。

#### 引入公共方法
先简单说一下思路，更改 webpack 的配置项，**通过 externals 配置处理公共方法和公共模块的引入**，保留这些引入的语句，并将引入方式设置成 commonjs 相对路径的方式，详细代码如下所示：

```javascript
const config = {
  // ...
  mini: {
    // ...
    webpackChain (chain) {
      chain.merge({
        externals: [
          (context, request, callback) => {
            const externalDirs = ['@common', '@api', '@libs']
            const externalDir = externalDirs.find(dir => request.startsWith(dir))

            if (process.env.NODE_ENV === 'production' && externalDir) {
              const res = request.replace(externalDir, `../../../../${externalDir.substr(1)}`)

              return callback(null, `commonjs ${res}`)
            }

            callback()
          },
        ],
      })
    }
    // ...
  }
  // ...
}
```

通过这样的处理之后，我们就可以顺利地在代码中通过 `@common/*`、`@api/*` 和 `@libs/*` 来引入原生项目下的 `common/*`、`api/*` 和 `libs/*` 了。

```javascript
// src/pages/index/index.jsx

import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'

import * as navigator from '@common/navigator.js'

import './index.scss'

export default class Index extends Component {
  handleButtonClick () {
    // 调用京东购物小程序的公共跳转方法
    console.log('trigger click')
    // 利用公共方法跳转京东购物小程序首页
    navigator.goto('/pages/index/index')
  }

  render () {
    return (
      <View className='index'>
        <Text>Hello world!</Text>
        <Button onClick={this.handleButtonClick.bind(this)} >点击跳转到主购首页</Button>
      </View>
    )
  }
}
```

能看到引入的公共方法在打包后的小程序页面中也能顺利跑通了

![跳转动画](https://img12.360buyimg.com/img/jfs/t1/188344/1/13981/1366700/60f57c40E9fe6bdd0/1f9fe874deee988d.gif)

#### 引入公共组件
公共组件的引入更加简单，Taro 默认有提供引入公共组件的功能，但是如果是在混合开发模式下打包后，会发现公共组件的引用路径无法对应上，打包后页面配置的 json 文件引用的是以 Taro 打包出来的 dist 文件夹为小程序根目录，所以引入的路径也是以这个根目录为基础进行引用的，因此我们**需要利用 Taro 的 alias 配置项来对路径进行一定的调整：**
```javascript
// pages/index/index.config.js
export default {
  navigationBarTitleText: '首页',
  navigationStyle: 'custom',
  usingComponents: {
    'nav-bar': '@components/nav-bar/nav-bar',
  }
}
```
```javascript
// config/index.js
const path = require('path')

const config = {
  // ...
  alias: {
    '@components': path.resolve(__dirname, '../../../components'),
  }
  // ...
}
```

接着我们在代码中直接对公共组件进行使用，并且无需引入：

```javascript
// src/pages/index/index.jsx

import { Component } from 'react'
import { View, Text, Button } from '@tarojs/components'

import * as navigator from '@common/navigator.js'

import './index.scss'

export default class Index extends Component {
  handleButtonClick () {
    // 调用京东购物小程序的公共跳转方法
    console.log('trigger click')
    // 利用公共方法跳转京东购物小程序首页
    navigator.goto('/pages/index/index')
  }

  render () {
    return (
      <View className='index'>
        {/* 公共组件直接引入，无需引用 */}
        <nav-bar
          navBarData={{
            title: '测试公共组件导航栏',
            capsuleType: 'miniReturn',
            backgroundValue: 'rgba(0, 255, 0, 1)'
          }}
        />
        <Text>Hello world!</Text>
        <Button onClick={this.handleButtonClick.bind(this)} >点击跳转到主购首页</Button>
      </View>
    )
  }
}
```

这样打包出来的 `index.json` 文件中 `usingComponents` 里的路径就能完美匹配原生小程序下的公共组件文件了，我们也由此能看到公共导航栏组件 `nav-bar` 在项目中的正常使用和运行了：

![导航栏使用效果图](https://img12.360buyimg.com/img/s1346x1757_jfs/t1/178340/27/15037/155999/60f66c99Ea1d2ecca/51717b0abe75f8a7.jpg)

#### 引入页面公共基类
在京东购物小程序，每一个原生页面在初始化的时候，基本都会引入一个 JDPage 基类，并用这个基类来修饰原本的 Page 实例，**会给 Page 实例上原本的生命周期里添加一些埋点上报和参数传递等方法。**

而我们在使用 Taro 进行混合编译开发时，再去单独地实现一遍这些方法显然是一种很愚蠢的做法，所以我们需要想办法在 Taro 项目里进行类似的操作，去引入 JDPage 这个基类。

首先第一步，我们需要在编译后的 JS 文件里，找到 Page 实例的定义位置，这里我们会**使用正则匹配**，去匹配这个 Page 实例在代码中定义的位置：
```javascript
const pageRegx = /(Page)(\(Object.*createPageConfig.*?\{\}\)\))/
```

找到 Page 实例中，将 Page 实例转换成我们需要的 JDPage 基类，这些步骤我们都可以将他们写在我们之前自制 Taro 插件 `plugin-mv` 中去完成：

```javascript
const isWeapp = process.env.TARO_ENV === 'weapp'
const jsReg = /pages\/(.*)\/index\.js$/
const pageRegx = /(Page)(\(Object.*createPageConfig.*?\{\}\)\))/

export default (ctx, options) => {
  ctx.modifyBuildAssets(({ assets }) => {
    Object.keys(assets).forEach(filename => {
      const isPageJs = jsReg.test(filename)

      if (!isWeapp || !isPageJs) return

      const replaceFn = (match, p1, p2) => {
        return `new (require('../../../../../bases/page.js').JDPage)${p2}`
      }

      if (
        !assets[filename]._value &&
        assets[filename].children
      ) {
        assets[filename].children.forEach(child => {
          const isContentValid = pageRegx.test(child._value)

          if (!isContentValid) return

          child._value = child._value.replace(pageRegx, replaceFn)
        })
      } else {
        assets[filename]._value = assets[filename]._value.replace(pageRegx, replaceFn)
      }
    })
  })
}
```

经过插件处理之后，打包出来的页面 JS 里的 Page 都会被替换成 JDPage，也就拥有了基类的一些基础能力了。

至此，我们的 Taro 项目就基本已经打通了京东购物小程序的混合开发流程了。**在能使用 Taro 无痛地开发京东购物小程序原生页面之余，还为之后的双端甚至多端运行打下了结实的基础。**

## 存在问题
在使用 Taro 进行京东购物小程序原生页面的混合开发时，会发现 Taro 在一些公共样式和公共方法的处理上面，存在着以下一些兼容问题：
1. Taro 会将多个页面的公共样式进行提取，放置于 `common.wxss` 文件中，但打包后的 `app.wxss` 文件却没有对这些公共样式进行引入，因此会导致页面的公共样式丢失。解决办法也很简单，只要在插件对 `app.wxss` 文件进行调整，添加对 `common.wxss` 的引入即可：
```javascript
const wxssReg = /pages\/(.*)\/index\.wxss$/
function insertContentIntoFile (assets, filename, content) {
  const { children, _value } = assets[filename]
  if (children) {
    children.unshift(content)
  } else {
    assets[filename]._value = `${content}${_value}`
  }
}
export default (ctx, options) => {
  ctx.modifyBuildAssets(({ assets }) => {
    Object.keys(assets).forEach(filename => {
      const isPageWxss = wxssReg.test(filename)

      // ...

      if (isPageWxss) {
        insertContentIntoFile(assets, filename, "@import '../../common.wxss';\n")
      }
    }
  })
}
```
2. 使用 Taro 打包后的 `app.js` 文件里会存在部分对京东购物小程序公共方法的引用，该部分内容使用的是和页面 JS 同一个相对路径进行引用的，因此会存在引用路径错误的问题，解决办法也很简单，对 `app.js` 里的引用路径进行调整即可：
```javascript
const appReg = /app\.js$/
const replaceList = ['common', 'api', 'libs']
export default (ctx, options) => {
  ctx.modifyBuildAssets(({ assets }) => {
    Object.keys(assets).forEach(filename => {
      const isAppJS = appReg.test(filename)
      const handleAppJsReplace = (item) => {
        replaceList.forEach(name => {
          item = item.replace(new RegExp(`../../../../../${name}`, 'g'), `'../../../${name}`)
        })
      }
      if (isAppJS) {
        if (
          !assets[filename]._value &&
          assets[filename].children
        ) {
          assets[filename].children.forEach(child => {
            replaceList.forEach(name => {
              const value = child._value ? child._value : child

              handleAppJsReplace(value)
            })
          })
        } else {
          handleAppJsReplace(assets[filename]._value)
        }
      }
    }
  })
}
```

## 后续
本篇文章主要是讲述了 Taro 项目在京东购物小程序端的应用方式和开发方式，暂无涉及 H5 部分的内容。之后计划输出一份 Taro 项目在 H5 端的开发指南，并讲述 Taro 在多端开发中的性能优化方式。