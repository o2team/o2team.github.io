title: 三分钟打造七夕专属的插件化脚手架
subtitle: 七夕节，凹凸曼手把手教你如何表白，打造专属插件化脚手架程序。
cover: https://img12.360buyimg.com/img/s900x383_jfs/t1/121700/23/10727/226496/5f44bb04E6a747c37/a48c3d6fc18c59cc.jpg
categories: Web开发
tags:
  - 脚手架
  - 插件化
author:
  nick: 小屁
  github_name: xuanzebin
date: 2020-08-25 15:21:00
wechat:
  share_cover: https://img12.360buyimg.com/img/s900x544_jfs/t1/134510/33/8270/235238/5f44baedE8aabe062/c913439f07861ca3.jpg
  share_title: 三分钟打造七夕专属的插件化脚手架
  share_desc: 七夕节，凹凸曼手把手教你如何表白，打造专属插件化脚手架程序。
---
## 背景
七夕节将至，你是否还因没有找到合适的表白机会而苦恼，还是说在纠结于为伴侣挑选合适的情人节礼物。那么今天你来对地方了。相信在读完这篇文章后，你就可以自己动手打造出一个专属于他/她/它的七夕专属插件化脚手架，通过本篇文章，不仅可以轻松拉近你与你爱人的距离，还能顺便学会插件化脚手架的相关知识。

## 温馨提醒
本篇文章需要一定的命令行知识，若在阅读本篇文章时有任何的疑惑，可以通过自行搜索相关内容或者阅读以下的文章来解惑：
https://aotu.io/notes/2016/08/09/command-line-development/index.html

废话不多说，直接进入正题

## 项目目录结构
```
.
├── lerna.json
├── package.json
├── packages
│   ├── cli          // 七夕专属插件化cli
│   │   ├── api               
│   │   │   ├── commandAPI.js  
│   │   │   ├── operateHooks.js 
│   │   │   └── share-utils.js
│   │   ├── bin      
│   │   │   └── valentine
│   │   ├── commands
│   │   │   └── happy.js
│   │   └── package.json
│   └── confession   // confession插件
│       ├── command.config.js
│       └── package.json
├── scripts
│   └── np.js       // 用于批量部署发布脚手架和插件的定制脚本
└── yarn.lock
```

## 编写插件化脚手架项目代码
### 新建七夕项目
1. 新建一个名为`valentine`的空目录并进入该目录，通过执行`yarn init -y`初始化目录（没安装yarn的需要安装一下yarn），同时保证`node版本>=10`。
2. 由于这个项目不仅有我们的核心脚手架，还存在着一些“用于表明心意”的插件，因此我们将使用`monorepo`的仓库结构，并安装`lerna`来进行仓库的管理，这里使用`lerna`是因为`lerna`能对多个`packages`进行统一的版本的管理。在目录下执行`yarn add --dev lerna`。
3. 在目录下新建`lerna.json`文件，对lerna进行以下配置：
```json
{
      "packages": [
         "packages/*"
      ],
      "version": "0.0.1",
      "npmClient": "yarn",
      "useWorkspaces": true
}
```
4. 在项目根目录的`package.json`下添加以下配置：
```json
{
      "private": true,
      "workspaces": [
         "packages/*"
      ]
}
```
5. 在项目的根目录下新建一个名为`packages`的文件夹，里面用来存放我们的核心脚手架以及插件的package。

all right，万事俱备~

### 初始化脚手架package目录
1. 进入`packages`文件夹，新建一个名为`cli`的文件夹，我们主要在这个文件夹内，对我们的脚手架核心逻辑进行编写。
2. 进入到`cli`文件夹内，新建`package.json`文件，添加如下内容：
```json
{
      "name": "@o2team/valentine-cli",
      "version": "0.0.1",
      "main": "index.js",
      "license": "MIT",
      "bin": {
        "valentine": "./bin/valentine"
      },
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "author": "",
      "description": "",
      "dependencies": {
        "chalk": "^4.1.0",
        "commander": "^5.1.0",
        "tapable": "^1.1.3"
      }
}
```
3. 在`cli`文件夹内新建`bin`文件夹，并进入`bin`文件夹内新建`valentine`文件，通过`chmod +x ./valentine`为其添加可执行权限，并在文件内写入简单的代码：
```javascript
#!/usr/bin/env node
console.log('-------- 情人节快乐 --------')
```
4. 在项目根目录下打开终端，运行`./packages/cli/bin/valentine`，顺利的话，你将在终端看到“情人节快乐”。  

 ![simpleclilog](https://img12.360buyimg.com/img/s253x73_jfs/t1/137636/36/6508/8952/5f447dcbEddd0df4e/3afdd103b38cfe94.png)

### 完善脚手架核心逻辑
当然，只能打印出一个如此简单的祝福，是完全不能达不到我们开始的预期的，甚至不能称得上是一个脚手架。

不过不要着急，接下来，容我先稍微介绍一下插件化脚手架的要点，并在接下来的文章中对这些要点进行实现。

#### 插件化的核心要点
一般来说，要实现插件化，我们需要关心以下三点：
1. **插件的安装和卸载**
2. **插件的获取和管理**
3. **插件间的通信**

而由于我们目前需要插件化的是脚手架，因此我们可以通过**项目依赖的方式**来实现插件的安装和卸载，而脚手架本身只需要在它执行命令的项目的依赖内寻找需要加载的插件即可。

![插件获取流程图](https://img12.360buyimg.com/img/s1012x570_jfs/t1/111555/27/16003/45387/5f44b041E1d463087/87be52df4b432cfe.png)

最后`valentine`内的大致逻辑应变为：
```javascript
#!/usr/bin/env node
const {
  getAllCommands,
} = require('../api/commandAPI.js')

console.log('-------- 情人节快乐 --------')

// 获取所有的命令（预设+插件）
getAllCommands().forEach(cwd => {
  // 插件注册命令行
})
```

#### 编写获取插件逻辑
接下来，我们去实现`getAllCommands`的逻辑：
1. 首先我们在`cli`文件夹内新建一个名为`api`的文件夹，用于在里面存放一些获取和加载插件的逻辑，并在`api`文件夹内新建`commandAPI.js`文件。
2. 在`commandAPI.js`文件内实现`getAllCommands`的逻辑：
```javascript
const fs = require('fs')
const path = require('path')
// 获取所有命令行命令，包括预设的以及插件的
module.exports.getAllCommands = () => {
  const cwdFns = []
  const localCwdPath = path.join(__dirname, '..', 'commands')
  const localCwdNames = [...fs.readdirSync(localCwdPath)]

  localCwdNames.forEach(name => {
    const cwdPath = path.join(localCwdPath, name)
    cwdFns.push(require(cwdPath))
  })

  const { getAllPluginIdOfPackageJson } = require('./share-utils')

  getAllPluginIdOfPackageJson().forEach(name => {
    const command = path.join(process.cwd(), 'node_modules', name, 'command.config.js')
    try {
      const cwd = require(command)
      cwdFns.push(cwd)
    } catch (error) {
      console.log(`${command} 不存在`)
    }
  })

  return cwdFns
}
```

在阅读上述代码的时候，你也许会有几点疑问：
- `localCwd`是什么？为什么需要获取它？
  `localCwd`是脚手架除了插件外原本所包含的一些命令功能，为了保证引入的一致性，因此它与插件的结构本质上是相同的，所以会在获取插件命令的时候一并获取。
- `share-utils`文件所导出的函数做了什么？是如何实现的？
  `share-utils`所导出的`getAllPluginIdOfPackageJson`函数主要是利用正则来匹配当前项目下符合插件命名的依赖，并把这些依赖整合导出，供脚手架使用。
```javascript
const fs = require('fs')
const path = require('path')
const pkPluginRE = /^(@o2team\/)valentine-plugin-/

 exports.pkPluginRE = pkPluginRE

 exports.getAllPluginIdOfPackageJson = () => {
   const pkgJsonPath = path.join(process.cwd(), 'package.json')
   const deps = {}
   const plugins = []
 
   if (fs.existsSync(pkgJsonPath)) {
     const pkg = require(pkgJsonPath)
 
     Object.assign(deps, pkg.devDependencies || {}, pkg.dependencies || {})
     Object.keys(deps).forEach(dep => {
       pkPluginRE.test(dep) && plugins.push(dep)
     })
   }
 
   return plugins
 }
```
- 这个`getAllCommands`函数的整体逻辑是怎么样的？
  `getAllCommands`的其实一共做了三件事情：

 一，获取脚手架内置的命令功能；
 
 二，匹配当前项目下符合插件命名的依赖，对这些依赖进行整合并导出；
  
 三，遍历这些插件依赖，与内置的命令功能一起，将它们的注册函数`cwd`导入到一个数组内，并将该数组导出。


#### 编写注册插件和解析命令逻辑
至此，我们的脚手架已经可以拿到与当前项目有关的所有插件的注册函数了，接下来我们只需要给这些注册函数传入我们的注册命令以及相关帮助函数，并在注册完成后对终端输入的命令进行解析，那么这个七夕专属的插件化脚手架就基本完成了。

同样的，我们需要改写一下`cli/bin/`目录下的`valentine`文件，改写内容如下：
```javascript
#!/usr/bin/env node
const {
  injectCommand,
  getAllCommands,
  commandComplete
} = require('../api/commandAPI.js')

console.log('-------- 情人节快乐 --------')

// 获取所有的命令（预设+插件）
getAllCommands().forEach(cwd => {
  // 插件注册命令行
  cwd({ injectCommand })
})

// 命令行注册完成
commandComplete()
```

在`commandAPI.js`文件内添加`injectCommand`函数和`commandComplete`函数，这两个函数的逻辑并不复杂，相信读者阅读一次就能轻松理解:
```javascript
const fs = require('fs')
const path = require('path')
const program = require('commander')

const packageConfig = require('../package.json')

let status = 'pending'
let cliConfig = { name: '小屁', hobby: '减肥' }
const commandNames = ['-V', '--version', '-h', '--help']

program
  .usage('<command> [options]')
  .version(packageConfig.version)

module.exports.operateHooks = operateHooks

// 为每个命令的注入函数提供所需的参数，如program等对象
module.exports.injectCommand = (cmd) => {
  if (status === 'done') return console.error('注册命令行时机已经是 done，请提前注册～')
  if (typeof cmd !== 'function') return console.error(cmd, '必须是一个函数')
  cmd({ program, cliConfig })
}

// 注册完所有命令后，检测当前命令是否存在，并更改脚手架状态
module.exports.commandComplete = function() {
  commandValidate()
  parseArgv()
  status = 'done'
}

function parseArgv() {
  program.parse(process.argv)
  program.commands.forEach(c => c.on('--help', () => console.log()))
}

function commandValidate() {
  program.commands.map(command => commandNames.push(command._name))

  const commandName = process.argv[2]

  if (commandName && !commandNames.includes(commandName)) {
    console.log(chalk.red(`  没有找到 ${process.argv[2]} 命令 \n`))
    program.help()
  }

  if (!process.argv[2]) {
    program.help()
  }
}

// 获取所有命令行命令，包括预设的以及插件的
module.exports.getAllCommands = () => {
  const cwdFns = []
  const localCwdPath = path.join(__dirname, '..', 'commands')
  const localCwdNames = [...fs.readdirSync(localCwdPath)]

  localCwdNames.forEach(name => {
    const cwdPath = path.join(localCwdPath, name)
    cwdFns.push(require(cwdPath))
  })

  const { getAllPluginIdOfPackageJson } = require('./share-utils')

  getAllPluginIdOfPackageJson().forEach(name => {
    const command = path.join(process.cwd(), 'node_modules', name, 'command.config.js')
    try {
      const cwd = require(command)
      cwdFns.push(cwd)
    } catch (error) {
      console.log(`${command} 不存在`)
    }
  })

  return cwdFns
}
```

### 编写内置插件
至此，我们的插件化脚手架已经可以投入使用了，让我们来试着写一个内置的插件，在`cli`目录下，新建一个`commands`文件夹，在里面新建一个`happy.js`，写入如下代码：
```javascript
module.exports = ({ injectCommand, operateHooks }) => {
  const { hooksMap, createHook } = operateHooks
  createHook('happyStartHook')
  injectCommand(function({ program, cliConfig }) {
    program
      .command('happy')
      .description('情人节祝福')
      .action(async () => {
        const { name, hobby } = cliConfig
        await hooksMap.happyStartHook.promise()

        console.log(`喜欢${hobby}的${name}, 祝你情人节快乐~`)
      })
  })
}
```

然后我们在`cli`目录下启动终端，并运行`./bin/valentine happy`，你将看到如下的输出：

![happylog](https://img12.360buyimg.com/img/s335x79_jfs/t1/131045/2/7950/13152/5f4480bcEeae27ddc/399fc76e25ffc601.png)

### 编写非内置插件
接着，我们将新建一个非内置的插件，并随后讲解插件间是如何做到通信的。
首先，我们需要新建一个package，即进入到`packages`目录，新建一个`confession`文件夹，进入`confession`文件夹，新建`package.json`文件，和cli类似的写入以下内容：
```json
{
    "name": "@o2team/valentine-plugin-confession",
    "version": "0.0.1",
    "main": "index.js",
    "license": "MIT",
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "description": ""
}
```
在这里需要注意，`package.json`里的`name`字段可以是自定义的，但一定要和之前脚手架的`share-utils`内定义的正则相匹配，以便被脚手架获取插件时识别。
之后，新建一个名为`command.config.js`的文件，同样的，写入注册函数的内容：
```javascript
module.exports = ({ injectCommand }) => {
  injectCommand(function({ program }) {
    program
      .command('love')
      .description('情人节表白')
      .action(() => {
        logLove()
      })
  })
}

function logLove () {
  console.log(`
   ____   __    ____ _    ________   __  ______  __  __
   /  _/  / /   / __ \\ |  / / ____/   \\ \\/ / __ \\/ / / /
   / /   / /   / / / / | / / __/       \\  / / / / / / / 
 _/ /   / /___/ /_/ /| |/ / /___       / / /_/ / /_/ /  
/___/  /_____/\\____/ |___/_____/      /_/\\____/\\____/   
                                                       
  `)
}
```
一个“情人节表白”插件就这样完成了，接着我们将这两个package都上传至`npm`，并安装到一个新的项目中，在项目下执行`./node_modules/.bin/valentine love`，便能看到`confession`插件命令被执行了：

![confessionlove](https://img12.360buyimg.com/img/s512x195_jfs/t1/146449/32/6520/22878/5f448199Edbcf767a/12b36766f26c25e2.jpg)

### 完成插件间的通讯
接下来，我们希望每次`valentine happy`命令被执行时，能先执行插件`valentine love`命令，这个时候，我们就需要往我们的插件化脚手架中加入组件的通信机制了。
在这里，我们会使用`tapable`来实现插件间的通信，`tapable`是一个类似于`Node.js`中的`EventEmitter`的库，但更专注于自定义事件的触发和处理。具体的用法希望读者可以自行搜索，这里就不多介绍。

关于tapable的使用，有兴趣的同学可以戳这里了解一下：

[戳这里](https://juejin.im/post/6844903895584473096#heading-4)

我们在`api`目录下新建一个名为`operateHooks`的js文件，在文件内写入以下内容：
```javascript
const { AsyncSeriesHook } = require('tapable')

module.exports = class OperateHooks {
  constructor () {
    this.hooksMap = {}
    this.hooksTapList = []

    this.tapHook = this.tapHook.bind(this)
    this.bindHooks = this.bindHooks.bind(this)
    this.createHook = this.createHook.bind(this)
  }

  createHook (nameSpace) {
    this.hooksMap[nameSpace] = new AsyncSeriesHook()
  }

  tapHook (hookName, eventName, cb) {
    this.hooksTapList.push({ hookName, eventName, cb })
  }

  bindHooks () {
    this.hooksTapList.forEach(hook => {
      const { hookName, eventName, cb } = hook
      this.hooksMap[hookName].tapPromise(eventName, async () => {
        await cb()
      })
    })
  }
}
```
之后，在`commandAPI`中，对`OperateHooks`类进行实例化，并在`commandComplete`执行`operateHooks`实例的`bindHooks`方法，最后导出该实例。
```javascript
const operateHooks = new OperateHooks()

module.exports.operateHooks = operateHooks

module.exports.commandComplete = function() {
  commandValidate()
  operateHooks.bindHooks()
  parseArgv()
  status = 'done'
}
```

在`valentine`文件中引入该实例，在进行插件命令注册时将该实例作为参数传入。
```javascript
#!/usr/bin/env node
const {
  injectCommand,
  getAllCommands,
  commandComplete,
  operateHooks
} = require('../api/commandAPI.js')

console.log('-------- 情人节快乐 --------')

// 获取所有的命令（预设+插件）
getAllCommands().forEach(cwd => {
  // 插件注册命令行
  cwd({ injectCommand, operateHooks })
})

// 命令行注册完成
commandComplete()
```

最后分别在`happy.js`和`confession/command.config.js`对`operateHooks`实例进行对应钩子的创建和绑定即可：
```javascript
// happy.js
module.exports = ({ injectCommand, operateHooks }) => {
  const { hooksMap, createHook } = operateHooks
  createHook('happyStartHook')
  injectCommand(function({ program, cliConfig }) {
    program
      .command('happy')
      .description('情人节祝福')
      .action(async () => {
        const { name, hobby } = cliConfig
        await hooksMap.happyStartHook.promise()

        console.log(`喜欢${hobby}的${name}, 祝你情人节快乐~`)
      })
  })
}
```
```javascript
// confession/command.config.js
module.exports = ({ injectCommand, operateHooks }) => {
  operateHooks.tapHook('happyStartHook', 'love', async () => {
    logLove()
  })
  injectCommand(function({ program }) {
    program
      .command('love')
      .description('情人节表白')
      .action(() => {
        logLove()
      })
  })
}

function logLove () {
  console.log(`
   ____   __    ____ _    ________   __  ______  __  __
   /  _/  / /   / __ \\ |  / / ____/   \\ \\/ / __ \\/ / / /
   / /   / /   / / / / | / / __/       \\  / / / / / / / 
 _/ /   / /___/ /_/ /| |/ / /___       / / /_/ / /_/ /  
/___/  /_____/\\____/ |___/_____/      /_/\\____/\\____/   
                                                       
  `)
}
```

### 待优化项
目前这个插件化脚手架还存在着一些问题和可优化点：
1. 插件的获取是通过正则匹配来进行的，这样的做法在依赖较多的仓库中效率会非常低下。
2. 目前插件的获取形式在遇到`monorepo`形态的项目时，会引发项目跟目录和命令执行目录不一致的问题。
3. 目前插件只支持项目插件，缺少了全局插件的支持。

这些优化项的可实现方法很多，由于考虑到篇幅问题，希望读者可以自己去思考，然后自行解决和优化。

## 最后
但是，不管怎么说，一个七夕专属的插件化脚手架可以说已经完成了，最终效果：
![finallog](https://img12.360buyimg.com/img/s560x274_jfs/t1/130557/8/7953/26367/5f4481f0E45034cb1/1d12a432b5cb91a3.png)


### **快点拿着它和你最爱的那个他/她/它表白吧~**

![wechat](https://img12.360buyimg.com/img/s750x1334_jfs/t1/114440/7/15978/216312/5f4484ceEd6d4c249/1569ce3b4949b0cb.png)

[项目仓库戳这里](https://github.com/xuanzebin/valentine)
