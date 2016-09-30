---
title: 通过 Babel 使用 ES6 的 import
subtitle: ES6 的推出已经有些时日了，它给我们带来了什么有意思的东西呢？本文将使用 Babel，带领你无所顾虑地使用 ES6 的模块系统。
date: 2016-09-22 15:28:59
cover: //misc.aotu.io/chuyik/es6_imports_with_babel_900_500.png
categories: Web开发
author: 
    nick: skillful-driver
    github_name: Calvin92
tags: 
  - ES6
  - Babel
---

在[《Modules with CommonJS》](http://www.pauleveritt.org/articles/pylyglot/modules/)一文中，我们通过类似于 Python 的 import 方式，把我们的代码组织成模块。那篇文章展示了 NodeJS 的原生模块系统 -- CommonJS。同时，文章还阐述了在那些不支持模块和模块加载器的浏览器中，如何使用 Webpack 去解决这种兼容性问题。 

<!--more-->

在本文中，我们将会看到一个不同的 import 系统，这个系统基于最新的 JavaScript 标准。我们将使用 ES6 的 import，然后通过[Babel转换器](http://babeljs.io)将我们的代码转换成在 Node 和浏览器环境都可以运行的兼容性代码。 
  
> 为什么说 `ES6` 而不是 `ES2015` ？诚然，`ES6` 作为一个标签正逐渐被遗忘，因为现在相关委员会已经通过基于时间的命名方案，而不是通过版本数字的方式去管理那些规范。但事实证明，模块和加载器是一个多层次的复杂的业务，包含着后期会推出的不同方面的东西。所以，我们将会使用 `ES6模块` 以避免一些细节。  

## 概述
* 安装和配置 Babel
* 将 CommonJS 中的模块和 import 切换为 ES6
* 把 Babel 插入到前端工具链（Mocha，Webpack，ESLint）中 

## 起点 
我们需要在一些前期的文章<sup>[注1][1]</sup>获得一些代码片段作为起点，生成本文的代码： 
* 部分 webpack ，部分 ESLint，部分 Mocha
* 确保 ESLint 在 PyCharm 中的连接
* npm start 和 npm test，还有 Mocha test 运行器

我们的 index.html 文件非常简单，这来自于 Webpack 相关的文章： 
```html
<!DOCTYPE html>
<html>
<head>
    <title>ES6 Imports</title>
</head>
<body>
<h1>Incrementer</h1>
<script src="bundle.js"></script>
</body>
</html>
```

Webpack 的配置也是一样： 
```javascript
module.exports = {
    entry: './app.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    devtool: 'source-map'
};
```

经过这些步骤，Webpack 将会把下面的 `app1.js` 和 `lib1.js` 打包，通过 `webpack-dev-server` 提供服务：  

```javascript
var incrementer = require('./lib1');
var newVal = incrementer(3);
console.log('newVal', newVal);
```

```javascript
function incrementer (i) {
    return i+1;
}

module.exports = incrementer;
```

最后，我们从之前的文章中获取一份 Mocha 测试文件： 

```javascript
var describe = require('mocha').describe,
    it = require('mocha').it,
    expect = require('chai').expect,
    incrementer = require('./lib1');

describe('Hello World', function () {
    it('should increment a value', function () {
        var result = incrementer(8);
        expect(result).eql(9);
    });
});
```

## 安装
让我们安装 Babel -- 一个现代的 JavaScript 转换器，通过一个 `loader` 在 Webpack 打包的时候进行编译转换：
```bash
$ npm install --save-dev babel-preset-es2015 babel-loader
```

这一步将会在我们的 `package.json` 文件的 `devDependencies` 中添加依赖： 
```javascript
{
  "name": "pylyglot",
  "version": "1.0.0",
  "description": "Series of articles for Polyglot Python with PyCharm",
  "main": "index.js",
  "scripts": {
    "start": "webpack-dev-server",
    "test": "mocha --compilers js:babel-core/register test*.js"
  },
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/pauleveritt/pauleveritt.github.io.git"
  },
  "author": "Paul Everitt",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/pauleveritt/pauleveritt.github.io/issues"
  },
  "homepage": "https://github.com/pauleveritt/pauleveritt.github.io#readme",
  "devDependencies": {
    "babel-loader": "^6.2.1",
    "babel-preset-es2015": "^6.3.13",
    "chai": "^3.4.1",
    "eslint": "^1.10.3",
    "mocha": "^2.3.4",
    "webpack": "^1.12.12",
    "webpack-dev-server": "^1.14.1"
  }
}
```

## ES6 模块

让我们把基于 CommonJS 的模块和导入，转换为基于 ES6 的模块。首先，我们创建一个 `app2.js` 文件，其使用了不一样的 import 语法： 

```javascript
import incrementer from './lib2';
var newVal = incrementer(3);
console.log('newVal', newVal);
```

当我们这样做的时候，PyCharm 马上就会崩溃。它目前只支持 `ECMAScript5.1` 标准作为 JavaScript 的语法。我们现在给了它无效的语法，因此我们需要在 `Preferences -> Languages & Frameworks -> JavaScript -> JavaScript language version` 中，更改其为 `ECMAScript 6`。  

这时候，ESLint 也会失效 -- 它必须要认识这些新的语法。幸运的是，ESLint 和 Babel 一样，都是非常流行和快速更新换代的开源项目。它们很容易就能和 ES2015、ES2016 和 ES2017 协同工作。让我们更新我们的 `.eslintrc` 文件： 

```javascript
{
  "rules": {
    "strict": 0,
    "quotes": [
      1,
      "single"
    ]
  },
  "ecmaFeatures": {
    "modules": true
  },
  "env": {
    "browser": true,
    "jquery": true,
    "es6": true
  }
}
```

让我们现在新建一个 `lib2.js` 文件，其将使用 ES6 的 export 语法导出我们的函数： 

```javascript
export default function incrementer (i) {
    return i+1;
}
```

在这种条件下，此模块除了该函数，没有任何可以导入的东西。因为它是一个不一样的，不兼容的语法；我们可以避免繁琐的 `module.exports`，而直接在声明中使用 `export default`。

在导出语法中使用 `default`，意味着我们的意思是把这个函数是这个模块唯一导出的东西。事实上，你还可以像这样导出：

```javascript
export default function (i) {}
```

这就是一个匿名函数的导出方式。通过默认的 export，这个函数的名字来源于导入这个函数的模块，而不是导出这个函数的模块。 

我们现在得到了通过 ES6 进行导入和导出的模块。为了查看它在 Node 中是否能正常工作，我们可以在我们的测试中使用 ES6 的 import 来检验： 

```javascript
import { describe, before, it } from 'mocha';
import {expect} from 'chai';
import incrementer from './lib2';

describe('Hello World', function () {
    it('should increment a value', function () {
        var result = incrementer(8);
        expect(result).eql(9);
    });
});
```

让我们跑一个： 
```bash
$ npm run test2.js
```

汗，报错了： 
```
SyntaxError: Unexpected token import
```

这好像是 Mocha -- 一个 Node 应用，不能解析我们的 JavaScript。好吧，没开玩笑……它现在使用ES6编写的。我们需要一些东西转把「未来」的 JavaScript（ES6 模块）转换成现在的 JavaScript（Node）。 

## 通过 Babel 编译
这种转换称为「编译(transpiling)」<sup>[注2][2]</sup>，而 Babel 是使用人数最多的编译工具。我们在 [Pythonic JavaScript with ES2015](http://www.pauleveritt.org/articles/pylyglot/pythonic_js/) 中谈论了更多关于编译方面的东西。 

我们需要告诉 Mocha 以运行我们的 JavaScript -- 包括应用代码和测试代码。这些代码包含了需要 Babel 新代码风格。首先，Babel 有一个配置文件，显然现在人手一份这个东西： 
 
```javascript
{
  "presets": ["es2015"]
}
```

这是用来配置 Babel本身的。为了告知我们的 PyCharm Mocha 运行配置以使用 Babel，我们需要编辑运行配置，在额外的 Mocha 选项（Extra Mocha options）中添加这个： 

```bash
--compilers js:babel-core/register
```

我们的 Mocha 测试现在就能正常运行了。这也意味着我们的 `lib2.js` 也能跑起来了。为了能在 `npm run` 脚本下处理这些变更，我们需要修改 `package.json`： 

```
"test": "mocha --compilers js:babel-core/register test*.js"
```

这一步适用于 Node。那浏览器下呢？我们需要像 Mocha 那样，告知 Webpack 在打包的时候使用 Babel 编译代码吗？是的，并且这个非常简单： 
 
```javascript
module.exports = {
    entry: './app2.js',
    output: {
        path: __dirname,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]
    },
    devtool: 'source-map'
};
```

我们为所有的 `.js` 后缀的文件都添加了一个 `module` 项，并且定义了一个 `loader`。这个 `loader` 通过 `babel-loader` 软件运行这些文件，而这个软件是一个 Babel 在 Webpack 下的插件。`babel-loader` 使用的是在 `.babelrc` 文件下共享的设置，这可以避免 Babel 在 Mocha 和 Webpack 下的独立设置。 

## 总结
我们现在只是使用到了 ES6 中很小一部分的特性：模块和导入。为了使用这部分特性，我们需要引入一个新的工具-- Babel 到前端工具链中，并处理由此带来的连锁效应： 
* PyCharm -> ECMAScript 6 
* ESLint
* Mocha
* Webpack 

在你编程的时候，你的 CPU 诚然会一直处于繁忙的状态，因为它要一直编译和打包。有解决这个问题的办法，但是目前来说，相信我……这很值得，因为在下一遍文章中就会明白了~  

> 本文译自 Paul Everitt 的 《[ES6 Imports with Babel](http://www.pauleveritt.org/articles/pylyglot/es6_imports/)》。

## 参考资料 
* [Paul Everitt's blog][1]
* [Compiling 和 Transpiling 的区别][2]

[1]: http://www.pauleveritt.org/articles/pylyglot/
[2]: http://blog.csdn.net/napolunyishi/article/details/20473799









