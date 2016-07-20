title: PostCSS快速入门使用
subtitle: "PostCSS 是一套利用JS插件实现的用来改变CSS的工具.这些插件能够支持变量和混合语法，转换未来CSS语法，内联图片，还有更多"
date: 2015-10-13 09:34:25
cover: //img.aotu.io/cnt1992/postcss.jpg
tags: Web开发
author:
  nick: Sky
  github_name: cnt1992
---

## 初识PostCSS

如果你第一次听说`PostCSS`这个东西，那么请看下面摘自官方`Github`的介绍：

> PostCSS is a tool for transforming CSS with JS Plugins. These plugins can support variables and mixins, transpile future CSS syntax, inline images, and more

翻译成中文的意思如下：

> PostCSS 是一套利用JS插件实现的用来改变CSS的工具.这些插件能够支持变量和混合语法，转换未来CSS语法，内联图片，还有更多

我们用过`Less`、`SASS`等工具来对CSS做`预处理`操作，按照它们约定的语法来书写并且最终转换成可用的样式，这付出的代价是**必须先熟悉这个工具的书写语法**。 

随着近几年 [Grunt](http://gruntjs.cn/)、[Gulp](http://gulpjs.com/)、[Webpack](http://webpack.github.io/docs/) 等自动化工具的兴起，`组合式应用`变得非常的热门，那`PostCSS`存在的意义是什么呢？答案是：**CSS生态系统**

`PostCSS`拥有非常多的插件，诸如自动为CSS添加浏览器前缀的插件`autoprefixer`、当前移动端最常用的`px`转`rem`插件`px2rem`，还有支持尚未成为CSS标准但特定可用的插件`cssnext`，还有很多很多。就连著名的`Bootstrap`在下一个版本`Bootstrap 5`也将使用`PostCSS`作为样式的基础。

一句话来概括PostCSS：**CSS编译器能够做到的事情，它也可以做到，而且能够做得更好**

## 快速使用PostCSS

上面大致介绍了`PostCSS`，也许我们并没有在头脑里形成对它的认知，那下面我们就通过一个简单地实例来看看如何使用`PostCSS`。

`PostCSS`得益于插件，支持Grunt,Gulp,webpack,Broccoli,Brunch还有ENB，这里我们将以`Gulp`作为实例来讲。


### 环境准备

创建并进入我们的实例目录

``` bash
mkdir postcss-demo && cd postcss-demo
```

然后快速生成`package.json`文件

``` bash
# --yes 参数能够帮助我们快速生成默认的package.json
npm init --yes
```

将上面创建的`package.json`文件的`main`参数改为`gulpfile.js`，然后安装我们所需的依赖

```bash
# gulp跟gulp-postcss是必须的，后面两个插件为了演示用途
npm i gulp gulp-postcss autoprefixer autoprefixer-core cssnext --save-dev -d
```

创建`gulpfile.js`

```bash
# 这里用命令行进行创建，你也可以手动新建
touch gulpfile.js
```

### 修改gulpfile.js

将下面代码贴进`gulpfile.js`

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnext = require('cssnext');

//定义css任务
gulp.task('css', function(){
  //定义postcss任务流数组
  var processors = [
    autoprefixer({
      browsers:['last 3 version'],
      cascade: false,
      remove: false
    }),
    cssnext()
  ];
  return gulp.src('./src/css/*.css')
             .pipe(postcss(processors))
             .pipe(gulp.dest('./dist'));
});
```

### 创建示例样式

在项目根目录下创建src目录，再在src目录下面创建css目录，然后创建style.css文件

``` bash
# 这里用命令创建，你也可以手动创建
mkdir -p src/css && touch style.css
```

编辑样式如下：

```css
h1{
  display:flex;
}

:root {
--fontSize: 1rem;
--mainColor: #12345678;
--highlightColor: hwb(190, 35%, 20%);
}

body {
color: var(--mainColor);

font-size: var(--fontSize);
line-height: calc(var(--fontSize) * 1.5);
padding: calc((var(--fontSize) / 2) + 1px);
}

```


### 运行实例

一切准备就绪之后可以在项目根目录下执行刚才我们定义的任务

```bash
gulp css
```

如果不出什么意外的话就会在根目录下面生成一个`dist`文件夹，里面有一个样式文件，内容如下：

```css
body{
  display:-webkit-flex;
  display:-ms-flexbox;
  display:-webkit-box;
  display:flex;
}

body {
color:#123456;
color:rgba(18, 52, 86, 0.47059);

font-size:16px;
font-size:1rem;
line-height:24px;
line-height:1.5rem;
padding:calc(0.5rem + 1px);
}
```

我们可以看到我们写的样式自动添加了浏览器前缀，并且一些未来CSS语法也被转换了。

## 了解PostCSS

通过上面的实例我们应该知道`PostCSS`的使用方法，此时让我们先回想一下`CSS预处理器`的使用历程：

1. 学习该CSS预处理器的语法特性，诸如：变量定义、嵌套、继承
2. 在特定后缀名(.less/.scss等)的文件按照上面的语法进行编写
3. 通过Gulp/Grunt/Webpack等自动化工具或者手动编译成CSS样式

而`PostCSS`的使用历程：

1. 直接按照CSS标准语法来书写CSS样式文件
2. 通过Gulp/Grunt/Webpack等自动化工具加载PostCSS插件转换输出

通过对比我们类比一个结论：*CSS预处理器好比给你一个工具箱，工具箱里面有什么东西该怎么拿已经跟你约定好，你必须按照这个规则来拿；而PostCSS好比给你一个盒子，你可以从旁边选择自己需要的工具放进盒子打包拿走，如果还不够用你可以自己造一个工具*

## 深入PostCSS

`PostCSS`自身只包括了`CSS分析器`，`CSS节点树API`，`source map生成器`，`CSS节点拼接器`，而基于`PostCSS`的插件都是使用了`CSS节点树API`来实现的。

我们都知道CSS的组成如下：

```css
element {
  prop1 : rule1 rule2 ...;
  prop2 : rule1 rule2 ...;
  prop2 : rule1 rule2 ...;
  ...
}
```

也就是一条一条的样式规则组成，每一条样式规则包含一个或多个属性跟值。所以`PostCSS`的执行过程大致如下：

1. Parser
    利用`CSS分析器`读取CSS字符内容，得到一个完整的`节点树`

2. Plugin
    对上面拿到的`节点树`利用`CSS节点树API`进行一系列的转换操作

3. Plugin
    利用`CSS节点拼接器`将上面转换之后的节点树重新组成CSS字符

4. Stringifier
    在上面转换期间可利用`source map生成器`表明转换前后字符的对应关系


### PostCSS性能

在PostCSS官方推特上看到，由JavaScript编写的PostCSS比C++编写的libsass还要快3倍，下面来自官方推特的截图:

![PostCss](//img.aotu.io/cnt1992/postcss.png)


如果你对上面的性能截图有疑问，可以亲自来[这里](https://github.com/postcss/benchmark)测试看看。


### 开始编写自己的PostCSS插件

`PostCSS`在自己的[Github](https://github.com/postcss/postcss#plugins)上放了一些常用的插件，更多的插件可以在[postcss.parts](http://postcss.parts/)进行搜索。

但有时候已有的插件不满足我们的需求，这个时候需要编写自己的PostCSS插件，下面我们将一步步创建一个简单的插件，这个插件功能非常简单，如下：

```css
/* 
  文件位置：src/css/style.css
 */
h1 {
  font-family: "\5FAE\8F6F\96C5\9ED1",fontstack('Arial');
}
```

当输入上面的样式时，会生成下面的样式：

```css
/*
  文件位置：dist/style.css
 */
h1 {
  font-family: "\5FAE\8F6F\96C5\9ED1",tahoma,arial;
}
```

### 环境准备

我们将以`Gulp`作为基础来实现我们的插件，首先创建项目文件夹

```bash
mkdir postcss-plugin && cd postcss-plugin
```

然后快速创建`package.json`文件：

```bash
npm init --yes
```

紧接着先安装必备的包

```bash
npm i gulp postcss gulp-postcss --save-dev -d
```

再创建`gulpfile.js`并且输入下面内容:

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');

gulp.task('css', function(){
  var processors = [
  ];
  return gulp.src('./src/css/*.css')
             .pipe(postcss(processors))
             .pipe(gulp.dest('./dist'));
});
```

### 创建插件文件夹

我们在执行`npm install`安装的包都放置在`node_modules`文件夹下面，这里我们创建PostCSS的插件文件夹，注意：**PostCSS的插件命名格式为：postcss-插件名字**

```bash
# 这里采用命令新建文件夹，你也可以手动创建
mkdir node_modules/postcss-fontstack
```

### 创建插件入口文件

现在我们可以在`postcss-fontstack`文件夹创建入口文件`index.js`，`PostCSS`创建插件的方式如下：

```javascript
var postcss = require('postcss');
module.exports = postcss.plugin('插件名字', function 插件名字(选项){
  //这里写插件代码
})
```

那我们可以在`index.js`里面贴入下面代码：

```javascript
var postcss = require('postcss');

modules.exports = postcss.plugin('fontstack', function fontstack( options ){
  return function( css ){
    options = options || {};

    var fontstack_config = {
      'Arial': 'tahoma,arial',
      'Times New Roman': 'TimesNewRoman, "Times New Roman", Times, Baskerville, Georgia, serif'
    };

    function toTitleCase( str ){
      return str.replace(/\w\S*/g,function( txt ){
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    }

    // css.walkRules方法用来遍历每一条css规则
    css.walkRules( function( rule ){
        // walkDecls方法用来解析属性跟值
        rule.walkDecls( function( decl, i ){
            var value = decl.value;
            if( value.indexOf( 'fontstack(' ) !== -1 ){
                var fontstack_requested = value.match(/\(([^)]+)\)/)[1].replace(/["']/g,"");
                fontstack_requested = toTitleCase( fontstack_requested );

                var fontstack = fontstack_config[ fontstack_requested ];

                var firstFont = value.substr( 0, value.indexOf('fontstack(') );

                var newValue = firstFont + fontstack;

                decl.value = newValue;
            }
        });

    });
  }
});
```

在`gulpfile.js`引入上面的插件，代码如下：

```javascript
var gulp = require('gulp');
var postcss = require('gulp-postcss');

gulp.task('css', function(){
  var processors = [
  ];
  return gulp.src('./src/css/*.css')
             .pipe(postcss(processors))
             .pipe(gulp.dest('./dist'));
});
```

### 运行实例

在项目根目录下运行实例，最终实现我们的效果

```bash
gulp css
```

## 再谈PostCSS

基于`PostCSS`能够做到很多`CSS预处理器`做不到的事情，未来发展前景还是挺不错的，而且最新的`Atom`编辑器也可以下载插件来支持`PostCSS`这种语法。

但这就意味着`CSS预处理器`过时了么？不会。`PostCSS`的出现并不是为了替换掉之前的技术，只是提供多一种思路让我们去考虑，就比如Sass编译后再加`autoprefixer`自动补齐浏览器前缀这种做法当前还是比较流行的。

再回到文章最开始说的，`PostCSS`其实是在打造一个改变CSS开发方式的生态系统。也许暂时我们还是保持传统的开发方式，但未来对于`PostCSS`我还是保持关注，它是值得期待的。

