---
title: 【译】关于 Node.js 里 ES6 Modules 的一次更新说明
subtitle: “今天 Node.js 支持 ES6 Modules 了吗？” “并没有！”
date: 2017-04-22 10:09:24
cover: https://o2team.github.io/misc/Secbone/es6_modules/es6_modules_in_nodejs_840x340.jpg
categories: NodeJS
draft: false
tags:
    - NodeJS
    - ES6
    - ES6 Modules
    - CommonJS
author:
    nick: Secbone
    github_name: Secbone
wechat:
    share_cover: https://o2team.github.io/misc/Secbone/es6_modules/es6_modules_in_nodejs_200x200.jpg
    share_title: 【译】关于 Node.js 里 ES6 Modules 的一次更新说明
    share_desc: “今天 Node.js 支持 ES6 Modules 了吗？” “并没有！”
---


> James M Snell    *IBM Technical Lead for Node.js*
> 原文链接: [An Update on ES6 Modules in Node.js](https://medium.com/the-node-js-collection/an-update-on-es6-modules-in-node-js-42c958b890c)

几个月前，我写了一篇[文章](https://hackernoon.com/node-js-tc-39-and-modules-a1118aecf95e)来描述 Node.js 现存的 CommonJS 模块和新的 ES6 模块系统的许多不同，也说明了在 Node.js 内核中实现这个新模型的内在的一些挑战。现在，我想分享一下关于这件事情的进展情况。

## 明白你什么时候该知道你需要知道的东西
在这之前，如果你还没准备好，你可以花一点时间来看一下我之前的描述这两个模块架构上存在许多根本区别的[文章](https://hackernoon.com/node-js-tc-39-and-modules-a1118aecf95e)。总结来说就是：CommonJS 与 ES6 Modules 之间的关键不同在于代码什么时候知道一个模块的结构和使用它。

举个栗子，假如我现在有一个简单的 ComminJS 模块（模块名叫`'foobar'`）：

```
function foo() {
  return 'bar';
}
function bar() {
  return 'foo';
}
module.exports.foo = foo;
module.exports.bar = bar;
```

现在我们在一个叫 `app.js` 的 JS 文件中引用它

```
const {foo, bar} = require('foobar');
console.log(foo(), bar());
```

当我执行 `$node app.js` 的时候，Node.js 已二进制的形式加载 `app.js` 文件，解析它，并且开始执行里面的代码。在执行过程中，里面的 `require()` 方法被调用，然后它会*同步的*去加载 `foobar.js` 的内容进内存，*同步的*解析编译里面的 JavaScript 代码，*同步的*执行里面的代码，然后返回 `module.exports` 的值当做 `app.js` 里的 `require('foobar')` 的返回值。当 `app.js` 里的 `require()` 方法返回的时候，`foobar` 模块的结构就已经知道了，并且可以被使用。所有的这些事情都发生在 Node.js 进程事件循环的同一个周期里。

要理解 CommonJS 与 ES6 Modules 之间的不同至关重要的是，一个 CommonJS 的模块在没有被执行完之前，它的结构（API）是不可知的 — 即使在它被执行完以后，它的结构也可以随时被其他代码修改。

现在我们用 ES6 的写法来写同样的模块：

```
export function foo() {
  return 'bar';
}
export function bar() {
  return 'foo';
}
```

并且在代码中引用它：

```
import {foo, bar} from 'foobar';
console.log(foo());
console.log(bar());
```

从 ECMAScript 统一的标准来看，ES6 Modules 的步骤与 CommonJS 里已经实现的有很大的不同。第一步从硬盘上加载文件内容大致上是相同的，但是可能是*异步的*。当内容加载完成后，会解析它。在解析的同时，模块里被 export 声明定义的结构会在组件内容被执行之前就探知出来。一旦结构被探知出来，组件的代码就会被执行。这里重要的是记住所有的 import 和 export 语句都会在代码执行之前被解析出来。另一点是在 ES6 中是允许这个解析的步骤*异步*执行的。这就意味着，在 Node.js 的机制中，加载脚本内容、解析模块的 import 和 export 、执行模块代码将发生在多个事件循环里。

## 时机很重要
在评估 ES6 Modules 的可实现性之前，我们关注的重点是怎么样无缝衔接的实现它。比如我们希望它可以可以实现同时对两种模块的支持，这样可以很大程度上对用户是透明的。

可惜，事情并不是这么简单…

尤其是 ES6 Modules 的加载、解析和执行都是异步的，这就导致不能通过 `require()` 来引用一个 ES6 模块。原因是 `require()` 是一个完全同步的函数。如果我们去修改 `require()` 的语义让它可以进行异步加载的话，那对于现有的生态系统将会产生巨大的破坏。所以我们有考虑在 ES6 的 `import()` 函数提议（[详情](https://github.com/tc39/proposal-dynamic-import)）通过之后建模实现一个 `require.import()` 函数。这个函数会返回一个 `Promise` 在 ES6 模块加载完成后标记完成。这不是最好的方案，但是它可以让你在现有的 Node.js 里以 CommonJS 的格式来使用。

有一点好消息是在 ES6 模块里可以很方便地使用 `import` 来引用一个 CommonJS 模块。因为在 ES6 模块里异步加载不是必须的。ECMAScript 规范进行一些小修改就可以更好地支持这种方式。但是所有这些工作过后，还有一个重要的事情…

## 命名引用
命名引用是 ES6 Modules 里的一个基本的特性。举个例子：

```
import {foo, bar} from 'foobar';
```

变量 `foo` 和 `bar` 在解析阶段就从 `foobar` 中被引用进来 —— 在所有代码被执行*之前*。因为 ES6 Modules 的结构是之前就可以被探知到的。

另一方面，在 CommonJS 里模块结构在代码没有执行之前是不能被探知的。也就是说，如果不对 ECMAScript 规范做重大更改的话，在 CommonJS 模块里是不能使用命名引用的。开发者会引用到 ES6 Modules 里面的名为 “default” 的导出。比如，上面的例子在 CommonJS 里是这样的：

```
import foobar from 'foobar';
console.log(foobar.foo(), foobar.bar());
```

区别很小但是很重要。所以当你想使用 `import` 来引用一个 CommonJS 模块的时候，下面这种写法是根本行不通的：

```
import {foo, bar} from 'foobar';
```

这里的 `foo` 和 `bar` 不会直接被解析成 CommonJS 模块里导出的 `foo()` 和 `bar()` 方法。

## 但是在 Babel 里可以！
使用过像 Babel 这种的 ES6 Modules 语法转换工具的人应该很熟悉命名引用。Babel 的工作原理是把 ES6 的写法转换成可以在 Node.js 里运行的 CommonJS 的形式。虽然语法看起来很像 ES6，但是实际上并不是。这一点很重要，Babel 里的 ES6 命名引用与完全按照规范实现的 ES6 命名引用有本质的不同。

## Michael Jackson Script
实际上CommonJS 和 ES6 Modules 之间还有另外一个重要的不同就是，ECMAScript 编译器必须提前知道它加载的代码是 CommonJS 的还是 ES6 Modules 的。原因是之前说的 ES6 Modules 必须在代码执行前就解析出模块中的 `import` 和 `export` 声明。

这就意味着 Node.js 需要某些机制来预先识别它在加载那种类型的文件。在探索了很多方案以后，我们回归到了以前最糟糕的方案，就是引入一个新的 `*.mjs` 文件后缀来表示一个 ES6 Modules 的 JavaScript 文件。（之前我们亲切的叫它 “Michael Jackson Script”）

## 时间线
在目前的时间点上，在 Node.js 可以开始处理支持实现 ES6 Modules 之前，还有很多关于规范现实的问题和虚拟机方面的问题。相关工作还在进行，但是需要一些时间 —— 我们目前估计至少需要一年左右。
