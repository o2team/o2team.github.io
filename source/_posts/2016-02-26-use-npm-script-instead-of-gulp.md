title: 使用npm scripts替代gulp
subtitle: 利用npm run高效地实现前端自动化任务
cover: //img20.360buyimg.com/ling/jfs/t1/52619/26/2712/170236/5d084bfcE2ff6a5aa/5676a8dcc47fd7f5.png
categories: Web开发
tags:
  - npm
  - gulp
author:
  nick: SkyCai
  github_name: cnt1992
date: 2016-02-26 16:06:24
---

<!-- more -->

## 为什么要用`npm scripts`替代`gulp`

现在`前端自动化`的配套工具估计都离不开`gulp`或者是`grunt`，有一些或许会用上`webpack`辅助用上最新的`ES6`语法等；但是不知道大家在使用`gulp`众多插件的时候有没有碰到过一些问题，比如：有一些插件你仅仅需要用到其中一点点的API、插件更新速度非常慢、有一些插件碰到bug的时候调试起来非常麻烦等。所以总结一下`gulp`或者`grunt`其实都会有以下问题：

1. 依赖于插件作者
2. 调试很不方便
3. 插件文档说明不连贯

而如果直接使用`npm scripts`完全可以避免这些问题，在我们`package.json`里面的`scripts`属性直接定义需要执行的任务，比如`npm start`和`npm test`其实就是`npm run start`和`npm run test`的缩写，我们可以在`scripts`里面定义各种需要的任务，举个最简单的例子(清除dist目录)：

```javascript
# 1.用gulp插件来实现
var gulp = require('gulp');
var del  = require('del');
gulp.task('clean', function() {
    del(['./dist/**/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
});

# 2.用npm scripts来实现
# package.json配置
    ...
    "scripts": {
        clean: "rimraf ./dist"
    },
    "devDependencies": {
        "rimraf": "^2.5.2"
    }    
```

从上面示例代码可以看出明显直接用`npm scripts`实现的同一个功能相对`gulp`要简单得多，当然这个功能比较简单，如果碰到复杂的一些任务肯定就有反对的声音了。那我们将细细将上面三点来阐述。

### 依赖于插件作者

当你需要使用到最新的或者不那么流行的技术时，根本就没有插件给你使用；或者一些插件已经过时了。最新`Babel 6`已经发布，很多API明显修改了，所以很多`gulp`插件根本不适用于最新版本。

这个时候你就必须等待作者来更新插件，或者你自己去`fix`这些问题，这会导致你不能及时用上最新版本的工具。相反，当你直接使用`npm scripts`的时候，你只需要直接找到可以实现的工具即可。这意味着当新版本的`Mocha`、`Babel`、`Webpack`、`Browserify`发布的时候，你就可以马上用上这些版本。

就目前插件数量来说，没有什么可以打败`npm`包：

![img](https://img11.360buyimg.com/ling/jfs/t1/80490/39/2174/35797/5d084c18Eb9af74db/1ce88d338772cb68.png)

### 调试很不方便

由于`gulp`增加了一层抽象，所以会有潜在的`bug`：

1. 是否基础工具崩溃了？
2. 是否`Grunt`/`Gulp`插件崩溃了？
3. 是否配置文件出错了？
4. 是否用了不稳定的版本？

而直接使用`npm scripts`直接避免了第2点跟第3点，而由于不使用那么多插件，那么包相对较少，第4点也很少会碰到。

### 插件文档说明不连贯

相比有用过很多插件的人都知道，一些核心的工具文档写得总比包装起来的`Gulp`插件要清晰得多。举个简单的例子来说，如果我需要用到`gulp-eslint`插件，那么就可能会不断在`gulp-eslint`的文档跟`ESLint`网站切换，必须对比看看两者存在些什么区别。

## 为什么我们总是忽略使用`npm scripts`而更青睐于`Gulp`

`Gulp`和`Grunt`之所以这么流行，主要有下面4个点：

1. 开发者认为`npm scripts`需要能写命令行的技能
2. 开发者认为`npm scripts`能处理的能力不足够
3. 开发者觉得`Gulp`的流对于快速构建是很有必要的
4. 开发者认为`npm scripts`不能跨平台运行

### 开发者认为`npm scripts`需要能写命令行的技能

其实你完全不需要精通于`Unix`或者`Windows`的命令行脚本，比如你不知道在`Unix`下面删除一个目录的命令是：`rm -rf`，这其实没啥问题，你完全可以使用[rimraf](https://www.npmjs.com/package/rimraf)，同时它也是跨平台的。在这里推荐一个工具包资源网站：[libraries.io](https://libraries.io/)

### 开发者认为`npm scripts`能处理的能力不足够

`npm scripts`其实比你想象中的要强大，主要依赖于[预处理和后置处理钩子](https://docs.npmjs.com/misc/scripts#description)，比如下面例子：

```javascript
{
  "name": "npm-scripts-demo",
  "version": "1.0.0",
  "description": "npm scripts demo",
  "scripts": {
    "prebuild": "echo I run before the build script",
    "build": "cross-env NODE_ENV=production webpack",
    "postbuild": "echo I run after the build script"
  }
}
```

正如上面例子一样，`prebuild`定义的脚本会比`build`任务先执行，而`postbuild`定义的脚本会比`build`任务后执行，因为相对于`build`来说，增加了一个前缀`pre`和`post`，所以当我执行`npm run build`的时候会自动地顺序执行`prebuild -> build -> postbuild`。

同时你可以将一个大的任务不断拆分成小的任务，比如：

```javascript
{
  "name": "npm-scripts-demo",
  "version": "1.0.0",
  "description": "npm scripts demo",
  "scripts": {
    "clean": "rimraf ./dist && mkdir dist",
    "prebuild": "npm run clean",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

在上面例子中将`clean`任务抽离出来了，当你执行`npm run build`的时候，会先自动执行`npm run prebuild`任务，那就相当于执行了`npm run clean`任务了，注意上面的`&&`表示先后顺序执行，区别于`&`表示同时执行。

## `npm scripts`的一些缺点

不得不承认，用`npm scripts`来写自动化构建任务还是存在一些不足：不能在JSON文件里面写注释。有一些方法可以弥补这方面的不足：

1. 写功能相对小而独立并且命名好的脚本名字
2. 脚本跟文档分离（将文档写进READ.md）
3. 直接分离脚本写进Makefile等独立的文件

推荐使用第一种，脚本名字本来就应该能够直接描述功能。

## 一些参考

- [Task automation with npm run](http://substack.net/task_automation_with_npm_run) -- James Holliday
- [Advanced front-end automation with npm scripts](https://www.youtube.com/watch?v=0RYETb9YVrk) -- Kate Hudson
- [How to use npm as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/) -- Kieth Girkel
- [Introduction to npm as a Build Tool](http://app.pluralsight.com/courses/npm-build-tool-introduction) -- Marcus Hammarberg
- [Gulp is awesome, but do we really need it?](http://gon.to/2015/02/26/gulp-is-awesome-but-do-we-really-need-it/) -- Gonto
- [NPM Scripts for Build Tooling](http://code.tutsplus.com/courses/npm-scripts-for-build-tooling) -- Andrew Burgess