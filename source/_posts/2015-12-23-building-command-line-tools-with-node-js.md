title: 【译】使用Node.js创建命令行脚本工具
subtitle: 通过本文将一步步带领你利用Node.js来创建命令行脚本工具
cover: //img30.360buyimg.com/ling/jfs/t1/70696/17/2087/34217/5d073bc3E9ff38592/60e9bc7581e6d754.jpg
categories: NodeJS
tags:
  - NodeJS
  - CMD
author:
  nick: SkyCai
  github_name: cnt1992
date: 2015-12-23 13:19:07
---

> 本文译自 [Building command line tools with Node.js](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)，介绍了如何通过Node.js来创建命令行脚本工具，介绍了很多实用的`npm`包等。翻译水平有限，敬请指正~

<!-- more -->

在我的职业生涯中已经写过了上百个 `Bash` 脚本，但我的 `Bash` 依然写得很糟糕，每一次我都不得不去查一些简单逻辑结构的语法。如果我想通过 `curl` 或者 `sed` 来做一些事情，我也必须去查找 `man` 文档。

然后，有一天，我看到六个字母的语言[译者注：这里指NodeJS] — 一门在过去十年里我几乎 *每一天* 都在使用的语言，这才让我幡然醒悟。结果是你可以使用 `JavaScript` 来写脚本！

在这篇教程中，我将会在使用 `Node.js` 和 `npm` 创建一个脚本或者命令行工具方面给你一些我的想法。特别地我们将会包括以下内容：

- 使用 `npm` 封装一个新的 `shell` 命令
- 解析命令行参数
- 从输入流中读取文本和密码
- 发送 snippet
- 输出错误与代码
- 终端输出彩色化
- 渲染 `ACSII` 进度条

我热衷于已经可以工作的例子，所以为了解释这些概念我们将会创建一个新的 `shell` 命令，它的名字为 `snippet` ，可以在我们本地磁盘的文件创建一个 [Bitbucket Snippet](https://confluence.atlassian.com/bitbucket/snippets-719095082.html)。

这是我们的最终目标成果：

![snippet用法](//storage.360buyimg.com/mtd/home/snippet-usage1560755168725.gif)

## 封装 shell 命令

`npm` 不单单用来管理你的应用和网页的依赖，你还能用它来封装和分发新的 `shell` 命令。

第一步就是通过 `npm init` [译者注：可以通过 `npm init -f`直接快速生成一个`package.json`]来创建一个新的 `npm` 项目：

```bash
$ npm init
name: bitbucket-snippet
version: 0.0.1
description: A command-line tool for creating Bitbucket snippets.
entry point: index.js
license: Apache-2.0
```

这会在我们的项目中创建一个新的 `package.json` 文件，那时我们将需要创建一个 `JS` 文件包含我们的脚本。让我们根据Node.js的传统命名为 `index.js`。

```javascript
#!/usr/bin/env node
console.log('Hello, world!');
```

注意我们必须加一些 `东西` 来告诉我们的 `shell` 如何处理我们的脚本。

接下来我们需要在我们 `package.json` 里面的最顶级增加 `bin` 部分。设置的属性（在我们的例子中是 `snippet`）将会变成用户在他们的终端处理脚本使用的命令，属性值就是相对于 `package.json` 的脚本位置。

```json
...
  "author": "Tim Pettersen",
  "license": "Apache-2.0",
  "bin": {
    "snippet": "./index.js"
  }
```

现在我们已经有一个可以工作的 `shell` 命令了！让我们安装它并且测试结果。

```bash
$ npm install -g
$ snippet
Hello, world!
```

真整洁！ `npm install -g` 实际上是将我们脚本链接到 `path` 变量的位置，所以我们能够在任何地方使用它。

```bash
$ which snippet
/usr/local/bin/snippet
$ readlink /usr/local/bin/snippet
../lib/node_modules/bitbucket-snippet/index.js
```

在开发环境中我们实际上使用 `npm link` 便利地将我们的 `index.js` 软链接到 `path` 变量的位置。

```bash
$ npm link
/usr/local/bin/snippet -> /usr/local/lib/node_modules/bitbucket-snippet/index.js
/usr/local/lib/node_modules/bitbucket-snippet -> /Users/kannonboy/src/bitbucket-snippet
```

当我们开发完成的时候，我们可以通过 `npm publish` 将我们的脚本发布到公共 `npm` 仓库，然后任何人都可以下载安装到他们的机器上：

```bash
$ npm install -g bitbucket-snippet
```

但是让我们先让我们的脚本能够工作先！

## 解析命令行参数

我们的脚本现在需要一些用户的输入：他们的Bitbucket名字，他们的密码，还有作为 `snippet`上传的文件位置。典型的方法就是通过命令的参数传输这些值。

你可以通过 `process.argv` 拿到序列化的参数，但有很多 `npm` 包在解析参数还有选项方面提供了很好的抽象给你。我最喜欢的就是 [commander](https://www.npmjs.com/package/commander)，来自 `Ruby gem`同一个名字的灵感。

一个简单的命令安装它：

```bash
$ npm install --save commander
```

上面命令将会把最新版的 `commander` 加入 `package.json`。我们这时可以通过简单声明式的方式定义我们的选项：

```javascript
#!/usr/bin/env node
- console.log('Hello, world!');
+ var program = require('commander');
+
+ program
+  .arguments('<file>')
+  .option('-u, --username <username>', 'The user to authenticate as')
+  .option('-p, --password <password>', 'The user\'s password')
+  .action(function(file) {
+    console.log('user: %s pass: %s file: %s',
+        program.username, program.password, file);
+  })
+  .parse(process.argv);
```

上面代码可读性很强。事实上，这是一个保守的说法。相对于那些我们需要通过 `switch` 来控制的像 `Bash`，这是一个艺术品。至少，我写的 `Bash` 是这样子的。

让我们快速测试：

```bash
$ snippet -u kannonboy -p correcthorsebatterystaple file
user: kannonboy pass: correcthorsebatterystaple file: file
```

很棒！`commander` 还提供一些简单的帮助输出给我们，基于我们上面提供的配置。

```bash
$ snippet --help

  Usage: snippet [options] <file>

  Options:

    -h, --help                 output usage information
    -u, --username <username>  The user to authenticate as
    -p, --password <password>  The user's password
```

所以我们已经拿到了参数了。但是，让用户在空白的地方输入他们的密码作为选项有一点难用。让我们解决它。

## 从输入流中读取文本和密码

另一种通用的取回用户的内容的脚本方式是从标准输入流中读。这可以通过 `process.stdin` 实现，但是再说一次，已经有很多 `npm` 包提供了非常好的 API 给我们使用。很多都是基于 `callback` 或者 `promises`，但是我们将使用 [co-prompt](https://www.npmjs.com/package/co-prompt) （基于 [co](https://www.npmjs.com/package/co)），因此我们可以利用 ES6 的 `yield` 关键词。这让我们写异步的代码而不需要 `callbacks` ，看起来更加脚本化。

```bash
$ npm install --save co co-prompt
```

为了组合使用 `yield` 和 `co-prompt` ，我们需要通过一些 `co` 的魔法来包裹我们的代码：

```javascript
+ var co = require('co');
+ var prompt = require('co-prompt');
  var program = require('commander');
...
  .option('-u, --username <username>', 'The user to authenticate as')
  .option('-p, --password <password>', 'The user\'s password')
  .action(function(file) {
+    co(function *() {
+      var username = yield prompt('username: ');
+      var password = yield prompt.password('password: ');
       console.log('user: %s pass: %s file: %s',
-          program.username, program.password, file);
+          username, password, file);
+    });
  })
...
```

现在快速测试一下。

```bash
$ snippet my_awesome_file
username: kannonboy
password: *************************
user: kannonboy pass: correcthorsebatterystaple file: my_awesome_file
```

很棒！唯一的窍门就是ES6的 `yield`，所以这只能在用户运行在 node 4.0.0+上面。但是我们可以通过加入 `--harmony` 标志让 0.11.2 版本的也可以正常使用。

```javascript
- #!/usr/bin/env node
+ #!/usr/bin/env node --harmony
  var co = require('co');
  var prompt = require('co-prompt');
...
```

## 发送 snippet

Bitbucket拥有一套非常漂亮的 [API](https://confluence.atlassian.com/display/BITBUCKET/Snippets+endpoint)。在这个例子中我将关注传输单一的文件，但我们可以发送整个目录，改变我们的入口配置，加一些代码等，如果我们需要的话。我最喜欢的node HTTP 客户端是 [superagent](https://www.npmjs.com/package/superagent) ，所以让我们把它加入项目中。

```bash
$ npm install --save superagent
```

现在就让我们将从用户收集到的数据发送给服务器。 `superagent` 其中一个优点就是在它在处理文件上拥有非常好的API。

```javascript
+ var request = require('superagent');
  var co = require('co');
  var prompt = require('co-prompt');
...
  .action(function(file) {
    co(function *() {
      var username = yield prompt('username: ');
      var password = yield prompt.password('password: ');
-     console.log('user: %s pass: %s file: %s',
-         file, username, password);
+     request
+       .post('https://api.bitbucket.org/2.0/snippets/')
+       .auth(username, password)
+       .attach('file', file)
+       .set('Accept', 'application/json')
+       .end(function (err, res) {
+         var link = res.body.links.html.href;
+         console.log('Snippet created: %s', link);
+       });
    });
  });
...
```

现在让我们测试一下。

```bash
$ snippet my_awesome_file
username: kannonboy
password: *************************
Snippet created: https://bitbucket.org/snippets/kannonboy/yq7r8
```

我们的 snippet 已经发送了！\o/

## 输出错误与代码

到现在为止我们已经处理了一切正确的情况，但是如果我们上传失败或者用户输入错误的信息呢？`UNIX-y`的方法来处理错误就是将标准的错误信息输出并且以非0的状态码结束程序，所以我们也这样子做。

```javascript
...
  request
    .post('https://api.bitbucket.org/2.0/snippets/')
    .auth(username, password)
    .attach('file', filename, file)
    .set('Accept', 'application/json')
    .end(function (err, res) {
+     if (!err && res.ok) {
        var link = res.body.links.html.href;
        console.log('Snippet created: %s', link);
+       process.exit(0);
+     }
+
+     var errorMessage;
+     if (res && res.status === 401) {
+       errorMessage = "Authentication failed! Bad username/password?";
+     } else if (err) {
+       errorMessage = err;
+     } else {
+       errorMessage = res.text;
+     }
+     console.error(errorMessage);
+     process.exit(1);
    });
```

这样子就可以处理错误了。

## 终端输出彩色化

如果你的用户是在使用体面的 `shell` ，这里也有一些包提供给你使用让你方便彩色化的输出。我喜欢 [chalk](https://www.npmjs.com/package/chalk) ，因为它拥有干净可链式的API以及自动检测用户的 `shell` 支持的颜色。这是有益的提示如果你想将你的脚本分享给 windows 用户的话。

```bash
$ npm install --save chalk
```

`chalk` 的命令能够彩色输出同时还能方便跟常规字符串串联起来。

```javascript
+ var chalk = require('chalk');
  var request = require('superagent');
  var co = require('co');
...
   .set('Accept', 'application/json')
   .end(function (err, res) {
     if (!err && res.ok) {
       var link = res.body.links.html.href;
-      console.log('Snippet created: %s', link);
+      console.log(chalk.bold.cyan('Snippet created: ') + link);
       process.exit(0);
     }

     var errorMessage;
     if (res && res.status === 401) {
       errorMessage = "Authentication failed! Bad username/password?";
     } else if (err) {
       errorMessage = err;
     } else {
       errorMessage = res.text;
     }
-    console.error(errorMessage);
+    console.error(chalk.red(errorMessage));
     process.exit(1);
  });
```

让我们旋转一下（这里我使用了截图，以便你能看到极好的颜色）。

![彩色化输出](//img12.360buyimg.com/ling/jfs/t1/39367/30/9134/50184/5d073bfcE3b5acf4f/4922952260aa5835.png)


## 渲染 `ACSII` 进度条

`snippets`的API实际上支持任何类型的文件（最多10MB），但是当文件比较大或者网速特别慢的时候就需要在命令行界面显示上传文件进度了。命令行解决方案就是优雅的 `ASCII` 进度条。

[progress](https://www.npmjs.com/package/progress) 是现在最常用的 `npm` 包用来渲染进度条。

```bash
$ npm install --save progress
```

`progress`的API非常简单而且可扩展，唯一的问题就是 `superagent` 当前node版本没有事件能够订阅我们上传的进度。

我们可以通过创建一个 [可读的流](https://nodejs.org/api/stream.html#stream_class_stream_readable) 并且增加一个事件来触发请求。然后我们初始化进度条为0，当事件触发的时候不断增加。

```javascript
+ var fs = require('fs');
+ var ProgressBar = require('progress');
  var chalk = require('chalk');
  var request = require('superagent');
...
  var username = yield prompt('username: ');
  var password = yield prompt.password('password: ');

+ var fileSize = fs.statSync(file).size;
+ var fileStream = fs.createReadStream(file);
+ var barOpts = {
+   width: 20,
+   total: fileSize,
+   clear: true
+ };
+ var bar = new ProgressBar(' uploading [:bar] :percent :etas', barOpts);
+
+ fileStream.on('data', function (chunk) {
+   bar.tick(chunk.length);
+ });

  request
    .post('https://api.bitbucket.org/2.0/snippets/')
    .auth(username, password)
-   .attach('file', file)
+   .attach('file', fileStream)
    .set('Accept', 'application/json')
...
```

下面是一个比较快的网速下上传大约6MB的文件的截图：

![进度条](//storage.360buyimg.com/mtd/home/progress-bar1560755230444.gif)

很棒！用户现在就能够看到他们上传的进度并且知道什么时候上传完成。

## 总结

我们只不过接触了用Node开发命令行脚本的冰山一角。在每一期的 [Atwood's Law](http://blog.codinghorror.com/the-principle-of-least-power/) 都有很多 `npm` 包优雅地处理标准输入、管理并行任务、监听文件、管道流、压缩、ssh、git、还有任何你能用 `Bash` 做到的。更多地，还有非常好的API来处理子进程如果你需要其他shell脚本处理（当JavaScript处理不了的时候）。

我们上面例子的源码是在 [available on Bitbucket](https://bitbucket.org/tpettersen/bitbucket-snippet) 的license下，并且已经发布到 [npm仓库](https://npmjs.org/package/bitbucket-snippet)。我这里也提一些上面没有讲到的概念，比如 `OAuth` ，这样子你就不需要每次都输入用户名跟密码。如果你想自己简单体验一下：

```bash
$ npm install -g bitbucket-snippet
$ snippet --help
```

如果你觉得本教程有帮助，发现了bug或者有其他更酷的Node.js脚本建议，可以在Twiiter私信我。（我是 [@kannonboy](https://twitter.com/kannonboy)）
