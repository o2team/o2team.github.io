title: 使用Taro3将项目作为独立分包运行在京东购物小程序中
subtitle: 介绍如何把一个Taro3项目作为独立分包运行在京东购物小程序，并顺利地进行开发、调试和上线等操作。
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
  share_title: 使用Taro3将项目作为独立分包运行在京东购物小程序中
  share_desc: 介绍如何把一个Taro3项目作为独立分包运行在京东购物小程序，并顺利地进行开发、调试和上线等操作。
---
## 目录
- 整体流程
- 应用过程
  - 准备合适的开发环境
  - 将Taro项目作为独立分包进行编译打包
  - 引入@tarojs/plugin-indie插件，保证Taro前置逻辑优先执行
  - 引入@tarojs/plugin-mv插件，自动化挪动打包后的文件
  - 引入公共方法、公共基类和公共组件
    - 引入公共方法
    - 引入公共组件
    - 引入页面公共基类
- 存在问题
- 后续

![Taro宣传图](https://img12.360buyimg.com/img/s1380x720_jfs/t1/173067/26/20486/62768/60f66f11E72bda565/93557275b8579a05.png)

## 整体流程
总的来说，若要使用Taro3将项目作为独立分包运行在京东购物小程序，我们需要完成以下四个步骤：
1. **准备开发环境**，下载正确的Taro版本
2. 安装**Taro混合编译插件**，解决独立分包的运行时逻辑问题
3. 调用Taro提供的**混合编译命令**，对Taro项目进行打包
4. **挪动打包后Taro文件**到主购小程序目录下

那么接下来，我们将对每个步骤进行详细的说明，告诉大家怎么做，以及为什么要这样做。

## 应用过程

### 准备合适的开发环境
首先我们需要全局安装Taro3，并保证**全局和项目下的Taro的版本高于`3.1.4`**，这里我们以新建的`Taro 3.2.6`项目为例：
```shell
yarn global add @tarojs/cli@3.2.6

taro init
```

之后我们在项目中用`React`语法写入简单的hello word代码，并在代码中留出一个`Button`组件来为将来调用京购小程序的公共跳转方法做准备。
![代码图片](https://img12.360buyimg.com/img/s2278x1364_jfs/t1/194768/4/13953/234722/60f57b91E6418524a/3a3cc33528cc6273.png)

俗话说得好，有竟者事竟成，在开始编码前，我们来简单地定几个小目标：
- **成功地将Taro项目Hello world在京购小程序的分包路由下跑通**
- **引入京购小程序的公共组件nav-bar并能正常使用**
- **引入公共方法navigator.goto并能正常使用**
- **引入公共基类JDPage并能正常使用**

### 将Taro项目作为独立分包进行编译打包
在将Taro项目打包进主购小程序时，我们很快就遇到了第一个难题：Taro项目下默认的命令打包出来的文件是一整个小程序，**如何打包成一个单独的分包？**

幸运的是，在`3.1.4`版本后的Taro，提供了混合开发的功能，意思为可以让原生项目和Taro打包出来的文件混合使用，只需要**在打包时加入`--blended`命令**即可。

```
cross-env NODE_ENV=production taro build --type weapp --blended
```

`blended`中文翻译是混合的意思，在加入了这个命令后，Taro会在构建出来的`app.js`文件中导出`taroApp`，我们可以通过引入这个变量来在原生项目下的`app.js`调用Taro项目app的onShow、onHide等生命周期。

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

如果单纯地使用`blended`命令，即使我们不需要调用onShow、onHide这些生命周期，我们也需要**在原生项目下的`app.js`里引入Taro项目的入口文件**，因为在执行我们的小程序页面时，我们需要提前初始化一些运行时的逻辑，因此要保证Taro项目下的`app.js`文件里的逻辑能优先执行。

理想很丰满，现实很骨感，由于我们需要将Taro项目作为单独的分包打包到主购项目中，因此这种直接在原生项目的app.js中引入的方式**只适用于主包内的页面，而不适用于分包。**

### 引入@tarojs/plugin-indie插件，保证Taro前置逻辑优先执行
要解决混合开发在分包模式下不适用的问题，我们需要引入另外一个Taro插件`@tarojs/plugin-indie`。

首先我们先在Taro项目中对该插件进行安装
```shell
yarn add --dev @tarojs/plugin-indie
```

之后我们在Taro的配置项文件中对该插件进行引入
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

查看该插件的源码，我们可以发现该插件处理的逻辑非常简单，就是在编译代码时，对每个页面下的js chunk文件内容进行调整，在这些js文件的开头加上`require("../../app")`,并增加对应module的sourceMap映射。在进行了这样的处理后，便能保证**每次进入Taro项目下的小程序页面时，都能优先执行Taro打包出来的运行时文件了。**

### 引入@tarojs/plugin-mv插件，自动化挪动打包后的文件
到目前为止，我们已经可以成功打包出能独立分包的Taro小程序文件了，接下来，我们需要将打包出来的dist目录下的文件挪到主购项目中。

手动挪动？no，一个优秀的程序员应该想尽办法在开发过程中“偷懒”。
因此我们会自定义一个Taro插件，在Taro打包完成的时候，**自动地将打包后的文件移动到主购项目中。**
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

    // testMini是你在京购项目下的路由文件夹
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

重新执行`cross-env NODE_ENV=production taro build --type weapp --blended`打包命令，即可将Taro项目打包并拷贝到京购项目对应的路由文件夹中。

至此，我们便可在开发者工具打开主购小程序项目，在app.json上添加对应的页面路由，并条件编译该路由，即可顺利地在开发者工具上看到`Hello World`字样。

![效果图](https://img12.360buyimg.com/img/s1198x1729_jfs/t1/182715/6/14645/133727/60f57bb8Ec0823a67/7f1ba614d32f9fe7.jpg)

### 引入公共方法、公共基类和公共组件
在日常的主购项目开发中，我们经常需要用到主购原生项目下封装的一些公共模块和方法，那么，通过混合编译打包过来的Taro项目是否也有方法，让Taro打包的小程序页面也能顺利引用这些方法和模块呢？

答案是有的。

#### 引入公共方法
先简单说一下思路，更改webpack的配置项，**通过externals配置处理公共方法和公共模块的引入**，保留这些引入的语句，并将引入方式设置成commonjs相对路径的方式，详细代码如下所示：

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

通过这样的处理之后，我们就可以顺利地在代码中通过`@common/*`、`@api/*`和`@libs/*`来引入原生项目下的`common/*`、`api/*`和`libs/*`了。

![跳转代码](https://img12.360buyimg.com/img/s2488x1462_jfs/t1/183851/4/14766/292966/60f672a3E4b2123f4/e1f688f3e072c732.png)

能看到引入的公共方法在打包后的小程序页面中也能顺利跑通了

![跳转动画](https://img12.360buyimg.com/img/jfs/t1/188344/1/13981/1366700/60f57c40E9fe6bdd0/1f9fe874deee988d.gif)

#### 引入公共组件
公共组件的引入更加简单，Taro默认有提供引入公共组件的功能，但是如果是在混合开发模式下打包后，会发现公共组件的引用路径无法对应上，打包后页面配置的json文件引用的是以Taro打包出来的dist文件夹为小程序根目录，所以引入的路径也是以这个根目录为基础进行引用的，因此我们**需要利用webpack的alias配置项来对路径进行一定的调整：**
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

![引入导航栏代码](https://img12.360buyimg.com/img/s3032x1732_jfs/t1/178579/28/14743/367897/60f66bc9Eb46e324b/2e2661a3aff239bd.png)

这样打包出来的`index.json`文件中`usingComponents`里的路径就能完美匹配原生小程序下的公共组件文件了，我们也由此能看到公共导航栏组件`nav-bar`在项目中的正常使用和运行了：

![导航栏使用效果图](https://img12.360buyimg.com/img/s1346x1757_jfs/t1/178340/27/15037/155999/60f66c99Ea1d2ecca/51717b0abe75f8a7.jpg)

#### 引入页面公共基类
在京东购物小程序，每一个原生页面在初始化的时候，基本都会引入一个JDPage基类，并用这个基类来修饰原本的Page实例，会**给Page实例上原本的生命周期里添加一些埋点上报和参数传递等方法。**

而我们在使用Taro进行混合编译开发时，再去单独地实现一遍这些方法显然是一种很愚蠢的做法，所以我们需要想办法在Taro项目里进行类似的操作，去引入JDPage这个基类。

首先第一步，我们需要在编译后的JS文件里，找到Page实例的定义位置，这里我们会**使用正则匹配**，去匹配这个Page实例在代码中定义的位置：
```javascript
const pageRegx = /(Page)(\(Object.*createPageConfig.*?\{\}\)\))/
```

找到Page实例中，将Page实例转换成我们需要的JDPage基类，这些步骤我们都可以将他们写在我们之前自制Taro插件`plugin-mv`中去完成：

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

经过插件处理之后，打包出来的页面JS里的Page都会被替换成JDPage，也就拥有了基类的一些基础能力了。

至此，我们的Taro项目就基本已经打通了京购小程序的混合开发流程了。**在能使用Taro无痛地开发京购小程序原生页面之余，还为之后的双端甚至多端运行打下了结实的基础。**

## 存在问题
在使用Taro进行京购小程序原生页面的混合开发时，会发现Taro在一些公共样式和公共方法的处理上面，存在着以下一些兼容问题：
1. Taro会将多个页面的公共样式进行提取，放置于`common.wxss`文件中，但打包后的`app.wxss`文件却没有对这些公共样式进行引入，因此会导致页面的公共样式丢失。解决办法也很简单，只要在插件对`app.wxss`文件进行调整，添加对`common.wxss`的引入即可：
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
2. 使用Taro打包后的`app.js`文件里会存在部分对京购小程序公共方法的引用，该部分内容使用的是和页面JS同一个相对路径进行引用的，因此会存在引用路径错误的问题，解决办法也很简单，对`app.js`里的引用路径进行调整即可：
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
本篇文章主要是讲述了Taro项目在京购小程序端的应用方式和开发方式，暂无涉及H5部分的内容。之后计划输出一份Taro项目在H5端的开发指南，并讲述Taro在多端开发中的性能优化方式。