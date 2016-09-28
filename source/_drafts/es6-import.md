---
title: 通过Babel使用ES6的import
date: 2016-09-22 15:28:59
description: 在本文中，我们将会看到一个不同的import系统，这个系统是基于最新标准的JavaScript而生的。我们将会使用ES6的import，然后通过Babel转换器将我们的代码转换成在Node和浏览器环境都可以运行的兼容性代码。 
categories: JavaScript
author: Calvin
draft: true
tags: 
  - ES6
  - Babel
---
## 通过Babel使用ES6的import
在[《Modules with CommonJS》](http://www.pauleveritt.org/articles/pylyglot/modules/)一文中，我们看到了通过类似于Python的import，在模块中组织我们的代码。那篇文章展示了NodeJS的本地模块系统--CommonJS。同时，我们还阐述了在不支持模块和模块加载器的浏览器中，如何使用Webpack去解决这种兼容性问题。 

在本文中，我们将会看到一个不同的import系统，这个系统是基于最新标准的JavaScript而生的。我们将会使用ES6的import，然后通过[Babel转换器](http://babeljs.io)将我们的代码转换成在Node和浏览器环境都可以运行的兼容性代码。 

***注：***  
为什么说“ES6”而不是“ES2015”？诚然，“ES6”作为一个标签正逐渐被遗忘，因为现在相关委员会已经通过基于时间的命名方案，而不是通过版本数字的方式去管理那些规范。但事实证明,模块和加载器是一个多层次的复杂的业务，包含着后期会推出的不同方面的东西。所以，我们将会使用“ES6模块”以避免一些细节。  

### 概述
* 安装和配置Babel
* 将CommonJS中的模块和import切换到ES6
* 把Babel插入到前端工具链（Mocha，Webpack，ESLint）中 

### 起点 
我们需要通过一些前期的文章<sup>注1</sup>获得一些代码片段作为起点，生成本文的代码： 
* 部分webpack，部分ESLint，部分Mocha
* 确保ESLint在PyCharm中的连接
* npm start 和 npm test，加上Mocha test运行器

我们的index.html文件非常简单，其来源于Webpack相关的文章： 
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

Webpack的配置也是一样： 
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

经过这些步骤，Webpack将会把下面的app1.js和lib1.js打包，通过webpack-dev-server提供服务：  

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

最后，我们从之前的文章中获取一份Mocha测试文件： 

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

### 安装
让我们安装Babel--一个现代的JavaScript转换器，通过一个“loader”在Webpack打包的时候进行编译转换： 
```
$ npm install --save-dev babel-preset-es2015 babel-loader
```

这一步将会在我们的package.json文件的devDependencies中添加依赖： 
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

### ES6模块

让我们把基于CommonJS的模块和导入，转换为基于ES6的模块。首先，我们创建一个app2.js文件，其使用了 不一样的import语法： 

```javascript
import incrementer from './lib2';
var newVal = incrementer(3);
console.log('newVal', newVal);
``` 

当我们这样做的时候，PyCharm马上就会崩溃。它目前只支持“ECMAScript5.1”标准作为JavaScript的语法。我们现在给了它无效的语法，因此我们需要在“Preferences -> Languages & Frameworks -> JavaScript -> JavaScript language version”中，更改其为“ECMAScript 6”。  

这时候，ESLint也会失效--它必须要认识这些新的语法。幸运的是，ESLint和Babel一样，都是非常流行和快速更新换代的开源项目。它们很容易就能和ES2015、ES2016和ES2017协同工作。让我们更新我们的 .eslintrc 文件： 

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

让我们现在新建一个lib2.js文件，其将使用ES6的export语法导出我们的函数： 

```javascript
export default function incrementer (i) {
    return i+1;
}
```

在这种条件下，此模块中除了该函数，没有任何可以导入的东西。因为它是一个不一样的，不兼容的语法；我们可以避免繁琐的module.exports，而直接在声明中使用export default。

在导出语法中使用default，意味着我们的意思是把这个函数是这个模块唯一导出的东西。事实上，你还可以像这样导出：  
```
export default function (i) {
```

这就是匿名函数的导出方式。通过默认的export，这个函数的名字来源于导入这个函数的模块，而不是导出这个函数的模块。  

我们现在得到了通过ES6进行导入和导出的模块。为了查看它在Node中是否能正常工作，我们可以在我们的测试中使用ES6的import来检验： 

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
```
$ npm run test2.js
```

汗，报错了： 
```
SyntaxError: Unexpected token import
```

这好像是Mocha--一个Node应用，不能解析我们的JavaScript。好吧，没开玩笑……它现在使用ES6编写的。我们需要一些东西转把未来的JavaScript（ES6模块）转换成现在的JavaScript（Node）。 

### 通过Babel编译 
这种转换称为“编译(transpiling)”<sup>注2</sup>，而Babel是使用人数最多的编译工具。我们在
[Pythonic JavaScript with ES2015](http://www.pauleveritt.org/articles/pylyglot/pythonic_js/)
中谈论了更多关于编译方面的东西。 

我们需要告诉Mocha以运行我们的JavaScript--包括我们同样需要以另一种风格--通过Babel，来编写的应用代码和测试。首先，Babel有一个配置，因为诚然，所有其他有趣的东西都有一个这样的东西： 
 
```javascript
{
  "presets": ["es2015"]
}
```

这一步是为Babel本身做配置。为了告知我们的PyCharm Mocha运行配置以使用Babel，我们需要编辑运行配置，在额外的Mocha选项（Extra Mocha options）中添加这个： 

```
--compilers js:babel-core/register
```

我们的Mocha测试现在就能正常运行了。这也意味着我们的lib2.js也能跑起来了。为了能在npm run脚本下处理这些变更，我们需要修改package.json： 

```
"test": "mocha --compilers js:babel-core/register test*.js"
```

这一步适用于Node。那浏览器下呢？我们需要像Mocha那样，告知Webpack在打包的时候使用Babel编译代码吗？是的，并且这个非常简单： 
 
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

我们为所有的.js后缀的文件都添加了一个module项，并且定义了一个loader。这个loader通过babel-loader软件运行这些文件，而这个软件是一个Babel在Webpack下的插件。babel-loader使用的是在.babelrc文件下共享的设置，这可以避免Babel在Mocha和Webpack下的独立设置。 

### 总结
我们现在只是使用到了ES6中很小一部分的特性：模块和导入。为了使用这部分特性，我们需要引入一个新的工具--Babel到前端工具链中，并处理由此带来的连锁效应： 
* PyCharm -> ECMAScript 6 
* ESLint
* Mocha
* Webpack 

在你编程的时候，你的CPU诚然会一直处于繁忙的状态，因为它要一直编译和打包。有办法解决这个问题，但是现在，相信我……这很值得，因为在下一遍文章中就会明白了~  


### 参考资料 
* 注1：相关的文章请参考[Paul Everitt's blog](http://www.pauleveritt.org/articles/pylyglot/)
* 注2：[Compiling和Transpiling的区别](http://blog.csdn.net/napolunyishi/article/details/20473799)











