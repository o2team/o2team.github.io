title: 使用Github的webhooks进行网站自动化部署
subtitle: 本文介绍Github的高级功能webhooks，并通过实例帮助我们如何使用它进行网站的自动化部署
cover: //img.aotu.io/cnt1992/webhooks-cover.jpg
date: 2016-01-06 17:05:05
categories: Web开发
tags:
  - Github
  - webhooks
author:
  nick: SkyCai
  github_name: cnt1992
---

相信很多码农都玩过了`Git`，如果对`Git`只是一知半解，可以移步`LV`写的 [GIT常用操作总结](http://aotu.io/notes/2015/11/17/Git-Commands/)，下面介绍到的一些关于 `Git` 的概念就不再赘述。

为啥想写这篇文章？主要是因为部门服务器因为安全性原因不允许`SCP`上传文件进行应用部署，然后有一些应用是放在Github上的，然后部署应用的步骤就变成：

1.git clone github项目 本地目录
2.配置一下应用的pm2.json并reload
3.Nginx配置一下反向代理并restart

当然如果只是一次性部署上去就不再修改的话并没啥问题，但是要是项目持续性修改迭代的话，就比较麻烦了，我们就在不断的重复着上面的步骤。作为一个码农，怎么允许不断的重复同样的工作，于是`Github webhooks`闪亮登场。

<!-- more -->

## 关于Github webhooks

让我们看看 [官方](https://developer.github.com/webhooks/) 关于Github webhooks的解释：

> Webhooks allow you to build or set up integrations which subscribe to certain events on GitHub.com.

提炼出来几个点：

- 必须是Github上面的项目
- 订阅了确定的事件（包括push/pull等命令）
- 自动触发

刚好符合了这几个条件，那接下来就看看如何进行`网站自动化部署`，主要会从下面几点来讲解：

1.自动化`shell`脚本
2.服务端实现
3.配置`github webhooks`

## 自动化脚本

我之前翻译过一篇文章 [使用Node.JS创建命令行脚本工具](http://aotu.io/notes/2015/12/23/building-command-line-tools-with-node-js/)，但是我们现在的自动化脚本直接用 `shell` 来实现，假设名称为`auto_build.sh`：

```sh
#! /bin/bash

SITE_PATH='/export/Data/aotu.jd.com/index/cnt1992.github.io'
USER='admin'
USERGROUP='admin'

cd $SITE_PATH
git reset --hard origin/master
git clean -f
git pull
git checkout master
chown -R $USER:$USERGROUP $SITE_PATH
```

**Note:** 在执行上面`shell`脚本之前我们必须第一次手动`git clone`项目进去，例如：

```
git clone github远程项目 /export/Data/aotu.jd.com/index/cnt1992.github.io
```

> shell脚本其实就跟直接在终端运行命令一样，类似于windows下面的BAT批处理命令，更多详细可以查阅资料。

## 服务端实现

`Github webhooks`需要跟我们的服务器进行通信，确保是可以推送到我们的服务器，所以会发送一个带有`X-Hub-Signature`的`POST`请求，为了方便我们直接用第三方的库[github-webhook-handler](https://github.com/rvagg/github-webhook-handler)来接收参数并且做监听事件的处理等工作。

现在我们可以在`shell`脚本的同级目录下面执行下面命令初始化一个`package.json`:

```bash
npm init -f
```

然后执行下面命令安装上面提到的第三方库：

```bash
npm i -S github-webhook-handler
```

接下来创建我们的服务主入口文件`index.js`：

```bash
touch index.js
```

紧接着参考`github-webhook-handler`的`demo`编辑我们的`index.js`：

```javascript
var http = require('http');
var spawn = require('child_process').spawn;
var createHandler = require('github-webhook-handler');

// 下面填写的myscrect跟github webhooks配置一样，下一步会说；path是我们访问的路径
var handler = createHandler({ path: '/auto_build', secret: '' });

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location');
  })
}).listen(6666);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

// 监听到push事件的时候执行我们的自动化脚本
handler.on('push', function (event) {
  console.log('Received a push event for %s to %s',
    event.payload.repository.name,
    event.payload.ref);

  runCommand('sh', ['./auto_build.sh'], function( txt ){
    console.log(txt);
  });
});

function rumCommand( cmd, args, callback ){
    var child = spawn( cmd, args );
    var response = '';
    child.stdout.on('data', function( buffer ){ resp += buffer.toString(); });
    child.stdout.on('end', function(){ callback( resp ) });
}

// 由于我们不需要监听issues，所以下面代码注释掉
//  handler.on('issues', function (event) {
//    console.log('Received an issue event for %s action=%s: #%d %s',
//      event.payload.repository.name,
//      event.payload.action,
//      event.payload.issue.number,
//      event.payload.issue.title)
});
```

然后利用node管理工具跑起来服务，这里使用了`pm2`：

```bash
pm2 start index.js
```

到这一步服务已经跑起来了，但是对外网并不能直接访问到，所以还需要配置一下`Nginx`做一下反向代理：

```javascript
···
server {
    listen 80;
    server_name aotu.jd.com;

    ···
    location /auto_build {
        proxy_pass http://127.0.0.1:6666;
    }
    ···
}
```

OK，到这里整个服务已经搭建完成，下一步就只需要配置`Github webhooks`。

## 配置`github webhooks`

我们可以在我们的`Github`上面最右边有一个`Settings`的Tab，找到`Webhooks & services`，如下图：

![Github Webhooks](//img.aotu.io/cnt1992/webhooks.png)

然后点击新建，输入`Payload URL`跟`Secret`，确定即可。

## 验证

绑定成功之后，我们可以试试提交一下代码，然后来到`Github`看看是否自动触发了接口，如下图：

![Github Webhooks接口触发](//img.aotu.io/cnt1992/webhooks-show.png)

然后随便选择一个点击一下，可以看到`200`的响应：

![Github Webhooks接口触发](//img.aotu.io/cnt1992/webhook-success.png)

## 小结

上面就是利用`Github webhooks`进行网站自动化部署的全部内容了，不难发现其实这项技术还是有局限性的，那就是依赖于`github`，一般我们选择的都是免费github账号，所有项目都对外，一些敏感项目是不适合放置上去的。

这个时候就考虑这个组里同事推荐的 [backup](http://backup.github.io/backup/v4/)，自己还没试用，有兴趣可以了解了解。
