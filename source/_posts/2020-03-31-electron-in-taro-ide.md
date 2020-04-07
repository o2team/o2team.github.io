title: Electron 在 Taro IDE 的开发实践
subtitle: 
cover: https://img13.360buyimg.com/ling/jfs/t1/103477/34/17046/746600/5e830fe5Ee04c3abc/278e70f68c086e10.png
categories: Web开发
tags:
  - Electron
  - 实践
  - 优化
author:
  nick: 小立
  github_name: Littly
date: 2020-04-07 17:00:00
---

> 这是一些使用 Electron 开发的经验与感悟

## 背景

Taro IDE 是一款我们正在精心打造的一站式移动端研发工作台。除了需要实现 Taro 从创建项目到预览、编译的全部能力，还需要打通用户测试、调试、监控等一系列流程。为了提升开发体验，仅仅一个命令行工具是远远不够的，我们需要开发一款桌面客户端，并同时提供 Windows、MacOS 等不同系统的版本。

[Electron](https://www.electronjs.org/) 最初是 Github 为 Atom 编辑器开发的桌面应用框架。Electron 将 Chromium 与 Node 合并到同个运行时环境中，赋予了 Web 代码与底层操作系统进行交互的能力，并在打包时生成 Windows、MacOS、Linux 等平台的桌面应用。比起原生的桌面应用开发框架，Electron 在性能、应用体积方面会稍逊一筹，但 Electron 支持打包多个平台的桌面应用，在业界已经有 VSCode、Atom、Slack 等综合体验拔群的成功案例，我们认为 Electron 完全满足我们的需求。

## 介绍 Electron

如果只想体验一下 Electron，最快的方式是使用 [Electron Fiddle](https://www.electronjs.org/fiddle)，或者直接使用社区中提供的 [脚手架](https://github.com/search?q=electron+boilerplate&ref=opensearch)。

最初接触 Electron，一般是被“使用前端技术栈生成多平台桌面应用”的特性吸引。但在后续的开发中，才会留意到 Electron 相比 [NW.js](https://nwjs.io/) 更为复杂的进程模型：

Electron 的架构可以用下图来表示：

![img](https://storage.jd.com/fragments/architecture.png)

Electron 项目中，运行 package.json 的 main 脚本的进程被称为主进程。主进程通过创建 web 页面来展示用户界面。这些用户界面都运行在彼此隔离的渲染进程中。

Electron 主进程支持 Node API，并且可直接与操作系统进行底层交互，弹出系统通知、文件系统读写、调用硬件设备等。

Electron 渲染进程默认只能与自身的 Web 内容进行交互。在打开 `nodeIntegration` 功能后，渲染进程也可以具备操作 Node 的能力。渲染进程也无法直接操作弹窗（Dialog）、系统通知（Notification）等，这些功能都需要通过 Electron 提供的 IPC/remote 机制在主进程中调用。

并且在后续 Electron 的升级中，这些约束也可能因为安全、性能的原因进行调整。可以说，Electron 的开发体验并不太美好，但正是这种开发体验与用户体验之间的博弈，保证了 Electron 应用在性能、安全方面的表现。

## 开发工作流

我们使用社区提供的 [electron-react-typescript](https://github.com/Robinfr/electron-react-typescript) 作为项目的初始脚手架。阅读 package.json 文件，我们可以了解到，这个项目使用 webpack 进行主进程和渲染进程的打包，[src/main/main.ts](https://github.com/Robinfr/electron-react-typescript/blob/b50263f06ecd518bfd43421a3c0bc3c3be308b64/src/main/main.ts) 文件就是主进程的入口。

Electron 的 BrowserWindow 类负责创建和控制浏览器窗口，app 对象则可以控制应用程序的各个事件与生命周期。 主进程的代码大致如下：

```
import { app, BrowserWindow } from 'electron'

let win
app.on('ready', () => {
  win = new BrowserWindow({ width: 800, height: 600 });
  win.loadURL(`http://localhost:2003`);
  // xxx
});

app.on('activate', () => {})
app.on('window-all-closed', () => {})
```

渲染进程 [src/renderer/app.tsx](https://github.com/Robinfr/electron-react-typescript/blob/b50263f06ecd518bfd43421a3c0bc3c3be308b64/src/renderer/app.tsx#L1) 就一个普通的页面，这里不再赘述。安装依赖后，使用 `yarn start-dev` ，即可启动项目的预览服务。

这个项目使用 webpack 来打包项目代码，这样处理有两个好处。一是通过 webpack 处理，我们可以减少运行时的 require 调用，对 Electron 应用加载性能有一定帮助；二是借助 webpack 的 tree shaking 能力，未使用的代码也会被轻松移除，可以有效减少安装包体积。

为了打包 electron 项目，我们需要至少两份 webpack 配置文件，一份打包主进程文件，指定 target 为 `electron-main`，另一份打包渲染进程，target 设置为 `electron-renderer`。

为了辅助 Electron 项目的调试工作，我们可以安装 [Devtron](https://www.electronjs.org/devtron)。Devtron 是 Electron 提供的开发调试插件。在开发者工具中加入 Devtron 后，项目中的 IPC 通信、查看项目依赖、事件等信息，都可以在开发者工具中直接查看。

如有需要，我们还可以安装其他的开发者工具扩展，例如 Redux、React 等，只需要在主进程中运行：

```
// main.js

const {
  default: installExtension,
  REACT_DEVELOPER_TOOLS,
  REACT_PERF,
  REDUX_DEVTOOLS
} = require('electron-devtools-installer')
const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF]

extensions.forEach(extension => {
  try {
    installExtension(extension)
  } catch (e) {
    console.error(e)
  }
})
```

至此，我们的开发环境搭建完毕，可以开始进行业务代码的开发了。

## 优化

业务代码开发完毕后，就到了优化的环节了。这里主要从 Electron 应用的性能与体积两方面来讲。

### 性能

Electron 在性能方面一直受到广大开发者的诟病。窗口打开慢，加载时间长都是老生畅谈的话题。这些问题该如何解决呢？

答案是预加载。在展示登录窗口时，我们可以提前将主窗口开启并设置隐藏，预加载主窗口的静态资源。用户登录后，再通过 IPC 消息通知主窗口展示，达到秒开的效果。这个过程可以用下图表示：

![img](https://storage.jd.com/fragments/timeline.png)

除了窗口加载，在 Electron 中，require Node 模块也是相当昂贵的操作。如果在渲染进程中直接使用大量的原生模块，会严重拖慢页面的打开时间，造成窗口可交互时间的延后，这对于桌面应用来说是灾难性的体验。Electron@5 之后的版本已经默认关闭了 BrowserWindow 的 `nodeIntegration` 功能，可以看出 Electron 团队也并不建议在渲染进程中直接使用原生模块。

在桌面应用中，等待是非常难以忍受的，性能上的些许欠缺都会让用户觉得这是个套壳的网页。如需使用原生模块，我们更建议使用异步的方式加载模块，或是使用异步 IPC 在主进程中调用。另外，为了优化用户的体验，我们还需要在小动画等方面下功夫，例如骨架屏等等。

Atom 团队通过使用 V8 snapshot 能力，在生产环境中去掉了低性能的 require 调用，将 Electron 应用的加载性能提升了 30%，同时还提升了应用的安全性能，这篇文章 [How Atom Uses Chromium Snapshots](https://flight-manual.atom.io/behind-atom/sections/how-atom-uses-chromium-snapshots/) 对他们的做法做了详细介绍。

启用骨架屏前后对比：

![img](https://storage.jd.com/fragments/skeleton.png)

性能优化的方式并不局限于上面的方式。例如开启 electron-builder 的 asar 功能，在打包时将源码生成二进制的 asar 文件，降低 require 操作的代价的同时，也能稍许减少空间占用，代价是无法对 asar 内的文件使用 `child_process.spawn` ；需要密集计算的功能，可以开多一个渲染进程来跑，或是使用 `require('child_process').spawn` 开子进程来跑，避免阻塞主进程，造成应用卡死。

### 体积

同样受到开发者诟病的，还有 Electron 应用的体积 。一个空 Electron 项目，在打包后就会占据近上百兆空间。Electron 的应用体积之所以大，除了自带的 Chromium 内核，还有大部分体积是来自用户安装的 node_modules。

使用 electron-builder 打包 Electron 应用时，如果不加处理，会将 node_modules 内的内容全数打包，导致应用体积偏大。针对这种情况，我们可以进行一系列优化：

1. 使用 `yarn autoclean` 命令进行清理。node_modules 目录中，包含着大量的 README 文件、文档等内容，这部分文件在生产环境中并非必要。如果项目中使用 `yarn` 进行依赖管理，则可以使用 `yarn autoclean` 命令。这个命令会初始化一份默认的配置文件 `.yarnclean` 。`yarn` 在安装依赖后，将会自动根据 `.yarnclean` 进行依赖清理。

   ```
    # 默认的 .yarnclean 文件大致如下：
    
    # test directories
    __tests__
    test
    tests
    powered-test
    
    # asset directories
    docs
    doc
    website
    assets
    
    # examples
    example
    examples
    
    ...
   ```

2. 使用双 package.json 架构。node_modules 目录中，除了生产环境需要用到的依赖，还存在着很多 devDependencies，这部分依赖是不应该被打包的。为了解决这个问题，electron-builder 提供了双 package.json 架构。具体来说，electron-builder 推荐用户将 Electron 应用依赖划分为两部分：开发依赖以及生产依赖。用户使用项目根目录的 package.json 来管理开发依赖，而使用项目的应用文件夹下的 package.json 管理生产依赖。electron-builder 仅会打包应用文件夹下的依赖。

   在这个改动后，安装依赖时还需要通过 `electron-builder install-app-deps` 命令安装应用依赖。这个操作推荐放在 `package.json` 内的 `post-install` 脚本中。

   electron-builder@8 后，并不会打包 `devDependencies` 内的依赖。这意味着我们可以通过这个途径来避免开发依赖被打包的问题。如果项目使用了 webpack 之类的工具进行打包，则需要注意将 webpack 已经打包过的资源从 dependencies 中排除，避免重复打包。

## 未来

### 能力 Web 化

目前，项目的大部分能力依然是基于 Electron 提供的能力实现的。这相当于与 Electron 严重耦合，不利于项目中个别能力的复用。未来，我们希望对项目的架构进行调整，对核心能力进行插件化改造，方便能力的移植与复用，甚至未来的研发上云，这有赖于项目核心能力的 Web 化。当然，Web 化也会带来额外的性能损耗，这会对我们项目的性能提出新的要求。

![img](https://storage.jd.com/fragments/webarchitecture.png)

### 崩溃处理

项目的稳定性也是未来需要努力的方向。我们有时会收到用户关于应用闪退、卡死等现象的反馈，却苦于无法复现，很多时候难以解决用户反馈的问题。未来，我们需要在项目中加入异常监控上报的机制，收集操作系统信息、内存使用量等关键信息，在 Crash 时进行上报，甚至推送告警消息。这有利于开发人员进一步了解用户的使用过程，方便问题的复现。

## 小结

在开发桌面应用时，Electron 在效率上有很大的优势。几行 JS 代码就可以启动桌面客户端，大大降低了开发门槛。但 Electron 在性能、体积等方面也存在着软肋。如果在前期开发时没有经过充分思考，很有可能会在后期优化时付出惨痛的代价。在这个项目中，我们的优化工作还远远不够，后续有更多突破会分享给大家。
zh


---

### 参考资料

[1]Electron: *https://www.electronjs.org/*
[2]Electron Fiddle: *https://www.electronjs.org/fiddle*
[3]脚手架: *https://github.com/search?q=electron+boilerplate&ref=opensearch*
[4]NW.js: *https://nwjs.io/*
[5]electron-react-typescript: *https://github.com/Robinfr/electron-react-typescript*
[6]src/main/main.ts: *https://github.com/Robinfr/electron-react-typescript/blob/b50263f06ecd518bfd43421a3c0bc3c3be308b64/src/main/main.ts*
[7]src/renderer/app.tsx: *https://github.com/Robinfr/electron-react-typescript/blob/b50263f06ecd518bfd43421a3c0bc3c3be308b64/src/renderer/app.tsx#L1*
[8]Devtron: *https://www.electronjs.org/devtron*
[9]How Atom Uses Chromium Snapshots: *https://flight-manual.atom.io/behind-atom/sections/how-atom-uses-chromium-snapshots/*