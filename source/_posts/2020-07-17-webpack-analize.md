title: Webpack原理浅析
subtitle: 从Webpack设计者的角度解析内部原理
cover: git-flow.jpg
categories: Web开发
tags:
  - Git
  - Fork
  - Webpack
author:
  nick: 凹凸实验室 风魔小次郎
  github_name: o2team
date: 2020-07-17 14:34:02
---

## 背景

`webpack` 迭代到4.x版本后，其源码已经十分庞大，对各种开发场景进行了高度抽象，阅读成本也愈发昂贵。但是为了了解其内部的工作原理。让我们尝试从一个最简单的webpack配置入手，从工具设计者的角度开发一款低配版的webpack。

## 开发者视角

假设某一天，我们需要开发一个react单页面,这个页面有一行文字和一个按钮，每次点击按钮的时候文字都会发生变化。于是我们在 `[项目根目录]/src` 下新建了三个简单的react文件(为了模拟 `webpack` 根据模块追踪打包的流程，我们建立了一个简单的引用关系:

```jsx
// index.js
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
ReactDom.render(<App />, document.querySelector('#container'))
```
```jsx
// App.js
import React from 'react'
import Switch from './Switch.js'
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      toggle: false
    }
  }
  handleToggle() {
    this.setState(prev => ({
      toggle: !prev.toggle
    }))
  }
  render() {
    const { toggle } = this.state
    return (
      <div>
        <h1>Hello, { toggle ? 'NervJS' : 'O2 Team'}</h1>
        <Switch handleToggle={this.handleToggle.bind(this)} />
      </div>
    )
  }
}
```
```jsx
// Switch.js
import React from 'react'

export default function Switch({ handleToggle }) {
  return (
    <button onClick={handleToggle}>Toggle</button>
  )
}
```

接着我们需要配置一个文件来告诉 `webpack` 它应该如何工作，我们在根目录下新建一个文件 `webpack.config.js` 并且向其中写入一些基础的配置

```jsx
// webpack.config.js
const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  // 入口文件地址
  entry: './src/index.js',
  // 输出文件地址
  output: {
		path: resolve('dist'),
    fileName: 'bundle.js'
  },
  // loader
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        // 编译匹配include路径的文件
        include: [
          resolve('src')
        ],
        use: {
          loader: BabelLoader // 通过Babel编译react代码
        }
      }
    ]
  },
  plugins: [
    new TestPlugin() // 一个测试plugin
  ]
}
```

其中 `module` 的作用是在test字段和文件名匹配成功时就用对应的loader对代码进行编译，webpack本身只认识 `.js` 、 `.json` 这两种类型的文件，有了loader就可以对css以及其他格式的文件进行识别和处理。而对于React文件而言，我们需要将JSX语法转换成纯JS语法，即 `React.createElement` 方法，代码才可能被浏览器所识别。而平常我们用来处理react代码的是 `babel-loader` ，但是它只有在正版webpack封装的语境下才能正常运行，但是好在 `@bable/core` 是公用的，所以我们自己封装了一个简易的BabelLoader

```jsx
const babel = require('@babel/core')

module.exports = function BabelLoader (source) {
  const res = babel.transform(source, {
    sourceType: 'module' // 允许使用ES6 import和export语法
  })
  return res.code
}
```

当然，编译规则可以作为配置项传入，但是为了模拟真实的开发场景，我们需要配置一下 `babel.config.js`文件

```jsx
module.exports = function (api) {
  api.cache(true)
  return {
    "presets": [
      ['@babel/preset-env', {
        targets: {
          "ie": "8"
        },
      }],
      '@babel/preset-react', // 编译JSX
    ],
    "plugins": [
      ["@babel/plugin-transform-template-literals", {
        "loose": true
      }]
    ],
    "compact": true
  }
}
```

之前的React代码编译出来会是这个亚子

```jsx
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = Switch;

var _nervjs = _interopRequireDefault(__webpack_require__("./node_modules/nervjs/index.js"));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}

function Switch(_ref) {
  var handleToggle = _ref.handleToggle;
  return _nervjs["default"].createElement("button", {
    onClick: handleToggle
  }, "Toggle");
}
```

Tips: 这个 `_interopRequireDefault` 的目的是为了兼容一些不符合 `babel` 规则的模块添加 `default` 属性并指向模块本身。防止在 `export default` 时出错。

而至于plugin则是一些插件，这些插件可以将函数注册在webpack的生命周期钩子上，在生成最终文件之前可以对编译的结果做一些特殊的处理，例如模块分包、插入html文件等功能。

这里我们只需要写一个简单的方法，在编译开始之前，也就是 `beforeRun` 这个钩子触发的时候，输出一个log意思一下即可

```jsx
/**
 * @description: 一个测试plugin
 * just4fun为函数名，第二个参数为函数体
 * 可以从compiler中获取当前的编译信息
 */

class TestPlugin {
  apply(compiler) {
    compiler.hooks.beforeRun.tapAsync("just4fun", function(compiler) {
      console.log('[Success] 开始编译')
    })
  }
}

module.exports = TestPlugin
```

ok，写到这里，作为一个开发者需要配置的所有配置项都已经配置完毕，接下来需要的就是通过 `webpack` 将代码打包成我们希望看到的样子

## 工具视角

接下来，我们需要了解Webpack打包的流程

![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_6.png)

首先，无论如何我们要将打包方法进行输出，并且在这个打包方法中接受两个参数，一个是配置项对象，另一个则是错误回调。

```jsx
const Compiler = require('./compiler')

function webpack(config, callback) {
  // 此处应有参数校验
  const compiler = new Compiler(config)
  // 此处应有参数初始化
  // compiler.initOptions()
  // 开始编译
  compiler.run()
}

module.exports = webpack
```

从代码中可以看出，我们需要实现一个 `Compiler` 类，这个类需要收集开发者传入的所有配置信息，然后指挥整体的编译流程。我们可以把 `Compiler` 理解为公司老板，它收集了所有信息统领全局。在查阅了所有信息报告后它会生成另一个类 `Compilation` 的实例，它相当于老板秘书，需要去调动各个部门按照要求开始工作，而loader和plugin则相当于各个部门，只有在他们专长的工作出现时（js, css, scss, jpg, png...)才会去处理

### 1. 构建配置信息

我们先在 `Compiler` 类的构造方法里面收集用户传入的信息（正版webpack中，compiler实例所需要的信息远不止我们传入的这些，所以在挂载数据之前需要对实例的数据进行初始化，此处省略了这个步骤）

```javascript
class Compiler {
  constructor(config, _callback) {
    const {
      entry,
      output,
      module,
      plugins
    } = config
    this.entryPath = entry
    this.distPath = output.path
    this.distName = output.fileName
    this.loaders = module.rules
    this.plugins = plugins
    this.root = process.cwd() // 根目录
    this.compilation = {} // 编译工具类
    // 入口文件在module中的id
    this.entryId = getRootPath(this.root, entry, this.root)
  }
}
```

### 2. 管理生命周期

同时，我们在构造函数中将所有的plugin挂载到实例的hooks属性中去。webpack的生命周期管理基于一个叫做 `tapable` 的库，通过这个库，我们可以创建一个发布订阅模型的钩子，然后通过将函数挂载到实例上（这些钩子事件的回调我们可以同步触发、异步触发甚至进行链式回调），在合适的时机触发钩子上的所有事件。例如我们在hooks上声明各个生命周期的钩子:

```javascript
const { AsyncSeriesHook } = require('tapable') // 此处我们创建了一些异步钩子
constructor(config, _callback) {
  ...
  this.hooks = {
    // 生命周期事件
    beforeRun: new AsyncSeriesHook(['compiler']), // compiler代表我们将向回调事件中传入一个compiler参数
    afterRun: new AsyncSeriesHook(['compiler']),
    beforeCompile: new AsyncSeriesHook(['compiler']),
    afterCompile: new AsyncSeriesHook(['compiler']),
    emit: new AsyncSeriesHook(['compiler']),
    failed: new AsyncSeriesHook(['compiler']),
  }
  this.mountPlugin()
}
// 注册所有的plugin
mountPlugin() {
  for(let i=0;i<this.plugins.length;i++) {
    const item = this.plugins[i]
    if ('apply' in item && typeof item.apply === 'function') {
      // 注册各生命周期钩子的发布订阅监听事件
      item.apply(this)
    }
  }
}
// 当运行run方法的逻辑之前
run() {
  // 在特定的生命周期发布消息，触发对应的订阅事件
  this.hooks.beforeRun.callAsync(this) // this作为参数传入，对应之前的compiler
  ...
}
```

如果我们声明了一个hook但是没有挂载任何方法，在call触发的时候是会报错的。但是正版webpack的每一个生命周期钩子除了挂载我们自己的plugin,还挂载了一些官方默认需要挂载的 `plugin`，所以不会有这个问题。更多关于tapable的用法也可以移步 [Tapable](https://github.com/webpack/tapable) 

### 3. 编译

接下来我们需要声明一个 `Compilation` 类，这个类主要是执行编译工作

```jsx
class Compilation {
  constructor(props) {
    const {
      entry,
      root,
      loaders,
      hooks
    } = props
    this.entry = entry
    this.root = root
    this.loaders = loaders
    this.hooks = hooks
  }
}
```

为了简化步骤，我希望在constructor中直接开始对文件进行编译。这里需要声明一个 `moduleWalker` 方法(这个名字是笔者取的，不是webpack官方取的)，顾名思义，这个方法将会从入口模块开始进行编译，并且顺藤摸瓜将构建过程中所有的模块递归进行编译。

编译步骤主要分为两步

1. 第一步是使用所有满足条件的loader对其进行编译并且返回编译之后的代码
2. 第二步相当于是webpack自己的编译步骤，其中最核心的目的是构建各个独立模块之间的调用关系。我们需要做的是将所有的 `require` 方法替换成webpack自己定义的 `__webpack_require__` 函数。因为所有被编译后的模块将被webpack存储在一个闭包的对象 `moduleMap` 中，当模块被引用时，都将从这个全局的 `moduleMap` 中获取代码。

在完成第二步编译的同时，会对当前模块内的引用进行收集，并且作为 `moduleWalker` 方法的回调返回到 `Compilation` 中， `moduleWalker` 方法会对这些依赖模块进行递归的编译。当然里面可能存在重复引用，我们会根据引用文件的路径生成一个独一无二的key值，在key值重复时进行跳过。

### i.  `moduleWalker` 遍历函数

```jsx
// 存放处理完毕的模块代码Map
moduleMap = {}

// 根据依赖将所有被引用过的文件都进行编译
async moduleWalker(sourcePath) {
  if (sourcePath in this.moduleMap) return
  // 在读取文件时，我们需要完整的以.js结尾的文件路径
  sourcePath = completeFilePath(sourcePath)
  const [ sourceCode, md5Hash ] = await this.loaderParse(sourcePath)
  const modulePath = getRootPath(this.root, sourcePath, this.root)
  // 获取模块编译后的代码和模块内的依赖数组
  const [ moduleCode, relyInModule ] = this.parse(sourceCode, path.dirname(modulePath))
  // 将模块代码放入ModuleMap
  this.moduleMap[modulePath] = moduleCode
  this.assets[modulePath] = md5Hash
  // 再依次对模块中的依赖项进行解析
  for(let i=0;i<relyInModule.length;i++) {
    await this.moduleWalker(relyInModule[i], path.dirname(relyInModule[i]))
  }
}
```

如果将dfs的路径给log出来，我们就可以看到这样的流程

![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_3.png)

而对于第一次编译函数 `loaderParse` ，就是判断正则字段是否匹配，然后调用loader对代码进行处理，如果loader是个数组的话则按照倒序依次处理。（正序倒序倒是没有什么意义，只不过是因为webpack源码是用compose的方式来依次调用的）

### ii.  `loaderParse` loader编译函数

```jsx
async loaderParse(entryPath) {
  // 用utf8格式读取文件内容
  let [ content, md5Hash ] = await readFileWithHash(entryPath)
  // 获取用户注入的loader
  const { loaders } = this
  // 依次遍历所有loader
  for(let i=0;i<loaders.length;i++) {
    const loader = loaders[i]
    const { test : reg, use } = loader
    if (entryPath.match(reg)) {
      // 判断是否满足正则或字符串要求
      // 如果该规则需要应用多个loader,从最后一个开始向前执行
      if (Array.isArray(use)) {
        while(use.length) {
          const cur = use.pop()
          const loaderHandler = 
            typeof cur.loader === 'string' 
            // loader也可能来源于package包例如babel-loader
            // 但是这里并不可以用babel-loader,因为babel-loader需要在webpack提前生成的上下文中才能正常运行
              ? require(cur.loader)
              : (
                typeof cur.loader === 'function'
                ? cur.loader : _ => _
              )
          content = loaderHandler(content)
        }
      } else if (typeof use.loader === 'string') {
        const loaderHandler = require(use.loader)
        content = loaderHandler(content)
      } else if (typeof use.loader === 'function') {
        const loaderHandler = use.loader
        content = loaderHandler(content)
      }
    }
  }
  return [ content, md5Hash ]
}
```

获得了loader处理过的代码之后，理论上任何一个模块都已经可以在浏览器或者单元测试直接使用了。但是我们的代码是一个整体，还需要一种合理的方式来组织代码之间互相引用的关系。

而我们的做法是将每个模块相对于根目录的相对路径作为key，模块的代码字符串作为value生成一个对象。只有入口文件的模块会被立即执行，而入口文件所依赖的模块都会被替换后的 `__webpack_require__` 函数从这个代码对象中取出，通过 `eval` 来获取模块真正暴露的内容。当然这只是我们当前求快的写法，众所周知对于JS这种解释型语言，eval的性能是非常糟糕的。（事实上大部分打包工具都是用对象存储一个个闭包的方式来调用，例如最近火热的 `esBuild` 打包出来的代码大概也是这个样子）

总而言之，在第二部编译 `parse` 函数中我们需要做的事情其实很简单，就是将所有模块中的 `require` 方法的函数名称替换成 `__webpack_require__` 即可。(至于`__webpack_require__`函数我们可以在最终生成代码时再进行定义)。我们在这一步使用的是babel全家桶。babel作为当前最好的JS编译器，分析代码的步骤主要分为两步，分别是词法分析和语法分析。简单来说，就是对代码片段进行逐词分析，并且生成各个类型对应的 `babel-node` 。(在词法分析中，所有的元素，即使是字符串也必须是babel封装过的类型)。然后进行语法分析，根据上一个单词生成的语境，判断当前单词所起的作用。

我们在这里可以先借助 `@babel/parser` 对代码进行词法分析，将代码拆解为一棵由 `babelNode` 组成的AST抽象语法树。然后通过 `@babel/traverse` 对node进行遍历，通过这个库。我们能够在在遇到特定node类型的时候执行特定的方法，这里我们要做的就是将调用类型 `CallExpression` (函数调用表达式)且name为 `require` 的单词名称替换成name为 `__webpack_require__` 的节点，最后通过 `@babel/generator` 生成新的代码

注意，在这一步中我们还可以“顺便”搜集模块的依赖项数组一同返回（用于dfs递归）

```jsx
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const types = require('@babel/types')
const generator = require('@babel/generator').default
...
// 解析源码，替换其中的require方法来构建ModuleMap
parse(source, dirpath) {
  const inst = this
  // 将代码解析成ast
  const ast = parser.parse(source)
  const relyInModule = [] // 获取文件依赖的所有模块
  traverse(ast, {
    // 检索所有的词法分析节点，当遇到函数调用表达式的时候执行，对ast树进行改写
    CallExpression(p) {
      // 有些require是被_interopRequireDefault包裹的
      // 所以需要先找到_interopRequireDefault节点
      if (p.node.callee && p.node.callee.name === '_interopRequireDefault') {
        const innerNode = p.node.arguments[0]
        if (innerNode.callee.name === 'require') {
          inst.convertNode(innerNode, dirpath, relyInModule)
        }
      } else if (p.node.callee.name === 'require') {
        inst.convertNode(p.node, dirpath, relyInModule)
      }
    }
  })
  // 将改写后的ast树重新组装成一份新的代码, 并且和依赖项一同返回
  const moduleCode = generator(ast).code
  return [ moduleCode, relyInModule ]
}
/**
 * 将某个节点的name和arguments转换成我们想要的新节点
 */
convertNode = (node, dirpath, relyInModule) => {
  node.callee.name = '__webpack_require__'
  // 参数字符串名称，例如'react', './MyName.js'
  let moduleName = node.arguments[0].value
  // 生成依赖模块相对【项目根目录】的路径
  let moduleKey = completeFilePath(getRootPath(dirpath, moduleName, this.root))
  // 收集module数组
  relyInModule.push(moduleKey)
  // 替换__webpack_require__的参数字符串，因为这个字符串也是对应模块的moduleKey，需要保持统一
  // 因为ast树中的每一个元素都是babel节点，所以需要使用'@babel/types'来进行生成
  node.arguments = [ types.stringLiteral(moduleKey) ]
}
```

### 4. `emit` 生成bundle文件

执行到这一步， `compilation` 的使命其实就已经完成了。如果我们平时有去观察dist生成的文件的话，会发现打包出来的样子是一个立即执行函数，主函数体是一个闭包，闭包中缓存了已经加载的模块 `installedModules` ，以及定义了一个 `__webpack_require__` 函数，最终返回的是函数入口所对应的模块。而函数的参数则是各个模块的key-value所组成的对象。

我们在这里通过 `ejs` 模板去进行拼接，将之前收集到的 `moduleMap` 对象进行遍历，注入到ejs模板字符串中去。

模板代码

```jsx
// template.ejs
(function(modules) { // webpackBootstrap
  // The module cache
  var installedModules = {};
  // The require function
  function __webpack_require__(moduleId) {
      // Check if module is in cache
      if(installedModules[moduleId]) {
          return installedModules[moduleId].exports;
      }
      // Create a new module (and put it into the cache)
      var module = installedModules[moduleId] = {
          i: moduleId,
          l: false,
          exports: {}
      };
      // Execute the module function
      modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      // Flag the module as loaded
      module.l = true;
      // Return the exports of the module
      return module.exports;
  }
  // Load entry module and return exports
  return __webpack_require__(__webpack_require__.s = "<%-entryId%>");
})({
 <%for(let key in modules) {%>
     "<%-key%>":
         (function(module, exports, __webpack_require__) {
             eval(
                 `<%-modules[key]%>`
             );
         }),
     <%}%>
});
```

生成bundle.js

```jsx
/**
 * 发射文件，生成最终的bundle.js
 */
emitFile() { // 发射打包后的输出结果文件
  // 首先对比缓存判断文件是否变化
  const assets = this.compilation.assets
  const pastAssets = this.getStorageCache()
  if (loadsh.isEqual(assets, pastAssets)) {
    // 如果文件hash值没有变化，说明无需重写文件
    // 只需要依次判断每个对应的文件是否存在即可
    // 这一步省略！
  } else {
    // 缓存未能命中
    // 获取输出文件路径
    const outputFile = path.join(this.distPath, this.distName);
    // 获取输出文件模板
    // const templateStr = this.generateSourceCode(path.join(__dirname, '..', "bundleTemplate.ejs"));
    const templateStr = fs.readFileSync(path.join(__dirname, '..', "template.ejs"), 'utf-8');
    // 渲染输出文件模板
    const code = ejs.render(templateStr, {entryId: this.entryId, modules: this.compilation.moduleMap});
    
    this.assets = {};
    this.assets[outputFile] = code;
    // 将渲染后的代码写入输出文件中
    fs.writeFile(outputFile, this.assets[outputFile], function(e) {
      if (e) {
        console.log('[Error] ' + e)
      } else {
        console.log('[Success] 编译成功')
      }
    });
    // 将缓存信息写入缓存文件
    fs.writeFileSync(resolve(this.distPath, 'manifest.json'), JSON.stringify(assets, null, 2))
  }
}
```

在这一步中我们根据文件内容生成的Md5Hash去对比之前的缓存来加快打包速度，细心的同学会发现webpack每次打包都会生成一个缓存文件 `manifest.json`，形如

```json
{
  "main.js": "./js/main7b6b4.js",
  "main.css": "./css/maincc69a7ca7d74e1933b9d.css",
  "main.js.map": "./js/main7b6b4.js.map",
  "vendors~main.js": "./js/vendors~main3089a.js",
  "vendors~main.css": "./css/vendors~maincc69a7ca7d74e1933b9d.css",
  "vendors~main.js.map": "./js/vendors~main3089a.js.map",
  "js/28505f.js": "./js/28505f.js",
  "js/28505f.js.map": "./js/28505f.js.map",
  "js/34c834.js": "./js/34c834.js",
  "js/34c834.js.map": "./js/34c834.js.map",
  "js/4d218c.js": "./js/4d218c.js",
  "js/4d218c.js.map": "./js/4d218c.js.map",
  "index.html": "./index.html",
  "static/initGlobalSize.js": "./static/initGlobalSize.js"
}
```

这也是文件上传中很常见的一个步骤，这里就不做详细的展开了

---

## 检验

做完这一步，我们已经基本大功告成了（误：如果不考虑令人智息的debug过程的话），接下来我们在 `package.json` 里面配置好打包脚本

```jsx
"scripts": {
  "build": "node build.js"
}
```

运行 `yarn build` 

![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_1.png)

然后我们将bundle.js放进 `index.html` 中，打开浏览器。(*@ο@*) 哇～激动人心的时刻到了。

然而...

![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_2.png)

看着打包出来的这一坨奇怪的东西报错，心里还是有点想笑的。检查了一下发现是因为反引号遇到注释中的反引号于是拼接字符串提前结束了。fine，那么我在babel traverse时加了几句代码，删除掉了代码中所有的注释。但是随之而来的又是其他的一些没完没了的问题...

好吧，可能我们缺少了一些实际react生产打包中必须的步骤，但是这毕竟也不在今天讨论的话题当中。这时，鬼魅的框架涌上心头。我脑中想起了凹凸实验室自研的高性能，兼容性优秀，紧跟react版本的类react框架 `NervJS` ，或许NervJS平易近人(误)的代码能够支持这款令人抱歉的打包工具

于是我们在 `babel.config.js` 中配置alias来替换react依赖项。(React项目转NervJS就是这么简单)

```jsx
module.exports = function (api) {
  api.cache(true)
  return {
		...
    "plugins": [
			...
      [
        "module-resolver", {
          "root": ["."],
          "alias": {
            "react": "nervjs",
            "react-dom": "nervjs",
            // Not necessary unless you consume a module using `createClass`
            "create-react-class": "nerv-create-class"
          }
        }
      ]
    ],
    "compact": true
  }
}
```

运行 `yarn build` 

![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_4.png)
![](https://o2team.github.io/misc/XHFk1nderg2rten/wp_5.png)

(*@ο@*) 哇～代码终于成功运行了起来，虽然存在着许多的问题，但是至少这个 `webpack` 在设计如此简单的情况下已经有能力支持大部分JS框架了。感兴趣的同学也可以自己尝试写一写，或者直接从[这里](https://github.com/XHFkindergarten/jerkpack)clone下来看

毫无疑问，webpack是一个非常优秀的代码模块打包工具（虽然它的官网非常低调的没有任何slogen）。一款非常优秀的工具，必然是在保持了自己本身的特性的同时，同时能够赋予其他开发者在其基础上拓展设想之外作品的能力。如果有能力深入学习这些工具，对于我们在代码工程领域的认知也会有很大的提升。

end