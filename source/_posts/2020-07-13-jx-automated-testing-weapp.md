title: 京喜前端自动化测试之路(小程序篇)
subtitle: 
cover: https://img13.360buyimg.com/ling/jfs/t1/130678/30/4400/473491/5f0c3ddbEc4e492b3/fdcf7cca53b96a67.png
categories: 小程序
tags:
  - 小程序
  - 自动化
  - 测试
author:
  nick: 阿翔
  github_name: zhangxiang910
date: 2020-07-13 17:58:08
---

如果你已经阅读过 “[京喜前端自动化测试之路（一）](https://mp.weixin.qq.com/s/VhvXTNuM7TSfFtzBVmhTyg)”，可跳过前言部分阅读。

## 前言
 
**京喜**（原京东拼购）项目，作为京东战略级业务，拥有千万级别的流量入口。为了保障线上业务的稳定运行，每月例行开展前端容灾演习，主要包含小程序及 H5 版本，要求各页面各模块在异常情况下进行适当的降级处理，不能出现空窗、样式错乱、不合理的错误提示等体验问题。

容灾演习是一项长期持续的工作，且涉及页面功能及场景多，人工的切换场景模拟异常导致演习效率较低，因此想通过开发自动化测试工具来提升演习效率，让容灾演习工作随时可以轻松开展。由于京喜 H5 和小程序场景差异比较大，自动化测试分 H5 和小程序两部分进行。前期已经分享过 H5 的自动化测试方案 —— `京喜前端自动化测试之路（一）`，本文则主要讲述小程序版的自动化测试方案。

综上所述，我们希望京喜小程序自动化测试工具可以提供以下功能：

1. 访问目标页面，对页面进行截图；
2. 模拟用户点击、滑动页面操作；
3. 网络拦截、模拟异常情况（接口响应码 500、接口返回数据异常）；
4. 操作缓存数据（模拟有无缓存的场景等）。

## 小程序自动化 SDK

聊到小程序的自动化工具，微信官方为开发者提供了一套小程序自动化 SDK —— [miniprogram-automator](https://www.npmjs.com/package/miniprogram-automator) ， 我们不需要关注技术选型，可直接使用。

>小程序自动化 SDK 为开发者提供了一套通过外部脚本操控小程序的方案，从而实现小程序自动化测试的目的。

>如果你之前使用过 [Selenium WebDriver](https://www.selenium.dev/projects/) 或者 [Puppeteer](https://pptr.dev/)，那你可以很容易快速上手。小程序自动化 SDK 与它们的工作原理是类似的，主要区别在于控制对象由浏览器换成了小程序。

**特性**

通过该 SDK，你可以做到以下事情：

- 控制小程序跳转到指定页面
- 获取小程序页面数据
- 获取小程序页面元素状态
- 触发小程序元素绑定事件
- 往 AppService 注入代码片段
- 调用 wx 对象上任意接口
- ...

**示例**
```
const automator = require('miniprogram-automator')

automator
    .launch({
        cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', // 工具 cli 位置（绝对路径）
        projectPath: 'path/to/project', // 项目文件地址（绝对路径）
    })
    .then(async miniProgram => {
        const page = await miniProgram.reLaunch('/pages/index/index')
        await page.waitFor(500)
        const element = await page.$('.banner')
        console.log(await element.attribute('class'))
        await element.tap()
        await miniProgram.close()
    })
```

综上所述，我们选择使用官方维护的 SDK —— `miniprogram-automator` 开发小程序的自动化测试工具，通过 SDK 提供的一系列 API ，实现访问目标页面、模拟异常场景、生成截图的过程自动化。最后再通过人工比对截图，判断页面降级处理是否符合预预期、用户体验是否友好。


## 实现方案

**原来的容灾演习过程：**

小程序的通信方式改成 HTTPS ，通过 [Whistle](https://wproxy.org/whistle/) 对接口返回进行修改来模拟异常情况，验证各页面各模块的降级处理符合预期。

**现阶段的容灾演习自动化方案：** 

我们将容灾演习过程分为`自动化流程`和`人工操作`两部分。

**自动化流程：**

1. 启动微信开发者工具（开发版）;
2. 访问目标页面，模拟用户点击、滑动等行为；
2. 模拟异常场景：拦截网络请求，修改接口返回数据（接口返回 500、异常数据等）；
3. 生成截图。

**人工操作：** 

自动化脚本执行完毕后，人工比对各个场景的截图，判断是否符合预期。

**方案流程图：**
![xxx](https://img12.360buyimg.com/ling/jfs/t1/135923/16/3702/120848/5efed886Efde1a07c/038c077946116c17.png)

## 开发实录

### 快速创建测试用例

为了提高测试脚本的可维护性、扩展性，我们将测试用例的信息都配置到 JSON 文件中，这样编写测试脚本的时候，我们只需关注测试流程的实现。

测试用例 JSON 数据配置包括`公用数据（global）`和`私有数据`：

`公用数据（global）`：各测试用例都需要用到的数据，如：模拟访问的目标页面地址、名字、描述、设备类型等。

`私有数据`： 各测试用例特定的数据，如测试模块信息、api 地址、测试场景、预期结果、截图名字等数据。

```
{
  "global": {
    "url": "/pages/index/index",
    "pageName": "index",
    "pageDesc": "首页",
    "device": "iPhone X"
  },
  "homePageApi": {
    "id": 1,
    "module": "home_page_api",
    "moduleDesc": "首页主接口",
    "api": "https://xxx",
    "operation": "模拟响应码 500",
    "expectRules": [
      "1. 有缓存数据，显示容灾兜底数据",
      "2. 请求容灾接口，显示容灾兜底数据",
      "3. 容灾接口异常，显示信异常息、刷新按钮",
      "4. 恢复网络，点击刷新按钮，显示正常数据"
    ],
    "screenshot": [
      {
        "name": "normal",
        "desc": "正常场景"
      },
      {
        "name": "500_cache",
        "desc": "有缓存-主接口返回500"
      },
      {
        "name": "500_no_cache",
        "desc": "无缓存-主接口返回500-容灾兜底数据"
      },
      {
        "name": "500_no_cache_500_disaster",
        "desc": "无缓存-主接口返回500-容灾兜底接口返回500"
      },
      {
        "name": "500_no_cache_recover",
        "desc": "无缓存-返回500-恢复网络"
      }
    ]
  },
  …
}
```

### 编写测试脚本

我们以京喜首页主接口的测试用例为例子，通过模拟主接口返回 500 响应码的异常场景，验证主接口的异常处理机制是否完善、用户体验是否友好。

**预期效果：**
- 主接口异常，有缓存数据，显示缓存数据
- 主接口异常，无缓存数据，则请求容灾接口，显示容灾兜底数据
- 主接口、容灾接口异常，无缓存数据，显示信异常息、刷新按钮
- 恢复网络，点击刷新按钮，显示正常数据
 
**测试流程：**

![ddd](https://img11.360buyimg.com/ling/jfs/t1/124446/26/6137/151407/5eff01eaEc266d202/88b5778d8ecfbaa1.png)

**场景实现：**

根据测试流程以及配置的测试用例信息，编写测试脚本，模拟测试用例场景:

1. 访问页面

```
const miniProgram = await automator.launch({
      cliPath: '/Applications/wechatwebdevtools.app/Contents/MacOS/cli', // 开发者工具命令行工具（绝对路径）
      projectPath: 'jx_project', // 项目地址（绝对路径）

})
await miniProgram.reLaunch('/pages/index/index')
```

2. 生成截图

```
await miniProgram.screenshot({
    path: 'jx_weapp_index_home_page_500.png'
})

```

3. 模拟异常数据

```
const getMockData = (url, mockType, mockValue) => {
    const result = {
      data: 'test',
      cookies: [],
      header: {},
      statusCode: 200,
    }

    switch (mockType) {
      case 'data':
        result.data = getMockResponse(url, mockValue) // 修改返回数据
        break
      case 'cookies':
        result.cookies = mockValue // 修改返回数据
        break
      case 'header':
        result.header = mockValue // 修改返回响应头
        break
      case 'statusCode':
        result.statusCode = mockValue // 修改返回响应头
        break
    }

    return {
      rule: url,
      result
    }
  }

 // 修改本地存储数据
 const mockValue = {
     data: {
         modules: [{
            tpl:'3000',
            content: []
         }]
     }
 }
 const mockData =  [
    getMockData(api1, 'statusCode', 500), // 模拟接口返回 500
    getMockData(api2, 'data', mockValue) // 模拟接口返回异常数据
    ...
 ]
 
```

4. 拦截接口请求，修改返回数据

```
const interceptAPI = async (miniProgram, url, mockData) => {
    try {
      await miniProgram.mockWxMethod(
        'request',
        function(obj, data) { // 处理返回函数
          for (let i = 0, len = data.length; i < len; i++) {
            const item = data[i]
            // 命中规则的返回 mockData
            if (obj.url.indexOf(item.rule) > -1) {
              return item.result
            }
          }
          // 没命中规则的真实访问后台
          return new Promise(resolve => {
            obj.success = res => resolve(res)
            obj.fail = res => resolve(res)
            / origin 指向原始方法
            this.origin(obj)
          })
        },
        mockData, // 传入 mock 数据
      )

    } catch (e) {
      console.error(`拦截【${url}】API报错`)
      console.error(e)
    }
  }

await interceptAPI(interceptAPI, url, mockData)
```

 + `miniProgram.mockWxMethod`：覆盖 wx 对象上指定方法的调用结果。利用该 API，可以覆盖 wx.request API，拦截网络请求，修改返回数据。
 + 目前是本地存储一份接口返回的 JSON 数据，通过修改本地的 JSON 数据生成 mockData。若需要修改接口实时返回的数据，可在 `obj.success` 中获取实时数据并修改。

5. 清除缓存

```
try {
    await miniProgram.callWxMethod('clearStorage')
} catch (e) {
    await console.log(`清除缓存报错: `)
    await console.log(e)
}
```

6. 点击刷新按钮

```
const page = await miniProgram.currentPage()
const $refreshBtn = await page.$('.page-error__refresh-btn') // 同 WXSS，仅支持部分 CSS 选择器
await $refreshBtn.tap()
```

7. 取消拦截，恢复网络

```
const cancelInterceptAPI = async (miniProgram) => {
    try {
      await miniProgram.restoreWxMethod('request') // 重置 wx.request ，消除 mockWxMethod 调用的影响。
    } catch (e) {
      console.error(`取消拦截【${url}】API报错`)
      console.error(e)
    }
}

await cancelInterceptAPI(miniProgram)

```

### 启动自动化测试

由于第一阶段的测试工具尚未平台化，先通过在终端输入命令行，运行脚本的方式，启动自动化测试。

在项目的 package.json 文件中，使用 scripts 字段定义脚本命令：

```
 "scripts": {
    "start": "node pages/index/index.js"
  },
```

**运行环境：**
- 安装 Node.js 并且版本大于 8.0
- 基础库版本为 2.7.3 及以上
- 开发者工具版本为 1.02.1907232 及以上

**运行：**

在终端切入到项目根目录路径，输入以下命令行，就可以启动测试工具，运行测试脚本。

```
$ npm run start
```

### 测试结果

**人工比对截图结果：**

 ![测试结果图](https://img13.360buyimg.com/ling/jfs/t1/114970/12/11387/1335848/5efde296Ed4389d71/f66d856e2efe80d9.png)

**运行脚本示例：** 

 ![运行脚本示例](https://storage.360buyimg.com/ling-gif/weappgif_1593682251201_464.gif)

### 使用 SDK，你必须知道 Shadow DOM

当我们想控制小程序页面时，需获取页面实例 page，利用 page 提供的方法控制页面内的元素。

比如，当我们想点击页面中搜索框时，我们一般会这么做：
```
 const page = await miniProgram.currentPage()
 const $searchBar = await page.$('search-bar')
 await $searchBar.tap()
```
但这样真的可行吗？答案是：

试试就知道了。

运行这段测试脚本后生成的截图：

![没有触发点击](https://img20.360buyimg.com/ling/jfs/t1/128516/17/6381/352303/5f028bbdEf98e7d41/ad833350c1bc58b7.png)


我们得到的结果是：根本没有触发点击事件。

**Shadow DOM：**

它是 HTML 的一个规范，它允许在文档( document )渲染时插入一颗DOM元素子树，但是这个子树不在主 DOM 树中。

它允许浏览器开发者封装自己的 HTML 标签、css 样式和特定的 javascript 代码、同时开发人员也可以创建类似  `<input>、<video>、<audio>` 等、这样的自定义的一级标签。创建这些标签内容相关的 API，可以被叫做 Web Component。

Shadow DOM 的关键所在，它可以将一个隐藏的、独立的 DOM 附加到一个元素上。

+ `Shadow host:` 一个常规 DOM 节点，Shadow DOM 会被附加到这个节点上。它是 Shadow DOM 的一个宿主元素。比如：`<input />、<audio>、<video>`  标签，就是 Shadow DOM 的宿主元素。
+ `Shadow tree:` Shadow DOM 内部的 DOM 树。
+ `Shadow root:` Shadow DOM 的根节点。通过 `createShadowRoot` 返回的文档片段被称为 shadow-root , 它和它的后代元素，都会对用户隐藏。

回到我们刚刚的问题：

由于小程序使用了 Shadow DOM，因此我们不能直接通过 page 实例获取到搜索框真实 DOM。我们看到的页面中渲染的搜索框，实际上是一个 Shadow DOM。因此，我们必须先获取到搜索框 Shadow DOM 的宿主元素，并通过宿主元素获取到搜索框真实的 DOM，最后触发真实 DOM 的点击事件。

```
  const page = await miniProgram.currentPage()
  const $searchBarShadow = await page.$('search-bar')
  const $searchBar = await $searchBarShadow.$('.search-bar')
  const { height } = await $searchBar.size()
```
运行这段测试脚本后生成的截图：

![搜索页](https://img20.360buyimg.com/ling/jfs/t1/138383/16/2263/34736/5f028bbdEd021abf3/fb3f20f854890148.png)

从截图可以看到，触发了搜索框的点击事件。

## 更多测试场景实现

**1. 下拉刷新**
```
const pullDownRefresh = async (miniProgram) => {
    try {
      await miniProgram.callWxMethod('startPullDownRefresh')
    } catch (e) {
      console.error('下拉刷新操作失败')
      console.error(e)
    }
}
```

**2. 滚动到指定 DOM**

```
const page = await miniProgram.currentPage() // 获取页面实例
const $recommendTabShadow = await page.$('recommend-tab') // 获取Shadow DOM
const $recommendTab = await $recommendTabShadow.$('.recommend') // 获取真实 DOM
const { top } = await $recommendTab.offset() // 获取DOM 定位
await miniProgram.pageScrollTo(top) // 滚动到指定DOM
```

**3. 事件**

- 日志打印；
- 监听页面崩溃事件

```
// 日志打印时触发
miniProgram.on('console', msg => {
    console.log(msg.type, msg.args)
  })
})

// 页面 JS 出错时触发
page.on('error', (e) => {
    console.log(e)
})
```

## 结语

第一阶段的小程序自动化测试之路告一段落。和 H5 自动化测试一样，容灾演习已实现了半自动化，可通过在终端运行测试脚本，模拟异常场景自动生成截图，再配合人工比对截图操作，判断演习结果是否符合预期。目前已投入到每个月的容灾演习中使用。

由于 H5 和小程序的差异比较大，第一阶段的自动化测试分两端进行，测试脚本语法也是截然不同，需要同时维护两套测试工具。为了降低维护成本，提升测试脚本的开发效率，我们正在研发第二阶段的自动化测试工具，一套代码支持两端测试，目前已经进入内测阶段。更多彩蛋，敬请期待第二阶段自动化测试工具——多端自动化测试 SDK 。
