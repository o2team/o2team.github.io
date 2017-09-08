title: whistle 使用实践
subtitle: 专治各种 http 请求疑难杂症
cover: https://misc.aotu.io/cos2004/whistle/cover.jpg
categories: Web开发
tags:
  - whistle
  - http请求
  - vase插件
  - mock数据
  - fiddler
  - charles
author:
  nick: cos2004
  github_name: cos2004
date: 2017-08-29 12:00:00
wechat:
    share_cover: https://misc.aotu.io/cos2004/whistle/share.jpg
    share_title: whistle 使用实践
    share_desc: 专治各种 http 请求疑难杂症

---

<!-- more -->


whistle 是一款用 Node 实现的跨平台的 Web 调试代理工具，支持查看修改 http(s)、Websocket 连接的请求和响应内容。简而言之就是 Node 版的 Fiddler、Charles，不过这个工具能远比后两者更加适合 Web 开发者、使用更简单、功能也更加实用，而笔者使用了 1 个月后发现完全可以代替 Fiddler、Charles。

## 安装&运行

whistle 运行时会监听一个端口，把 Chrome（或其他程序）转发到该端口的数据处理后再返回，而在 Chrome 里则通过一个代理层把请求转发到相应端口。

1. Chrome 插件：[whistle for Chrome](https://github.com/avwo/whistle-for-chrome)

2. Node 端的 CI 工具

```sh
# 安装
sudo npm i -g whistle

# 运行
w2 start
```
> 详见：[安装方法](https://avwo.github.io/whistle/install.html)

最后，打开 http://local.whistlejs.com/#network 即可进入控制台界面


## 常用功能一览

- 绑定host
```bash
# 说明：相当于浏览器层的host文件，如果找不到再去查找本机的host文件
192.168.0.1 mydomain.com
```

- 替换请求
```bash
# 说明：请求百度的时候会返回京东的页面内容
https://m.baidu.com https://wq.jd.com/
```

- 修改返回码
```bash
# 说明：使 http 返回 404
https://m.baidu.com statusCode://404
```

- 往 html 插入脚本
```bash
# 说明：会在网页最后以 script 标签的形式插入，花括号的值是内置编辑器保存的文件，在主菜单 “Value” 下可找到
https://wq.jd.com js://{test.js}
https://wq.jd.com js:///Users/myname/test/test.js
```

- 往 html 插入样式
```bash
# 说明：在网页里以 style 标签的形式插入
https://wq.jd.com  css://{test.css}
```

- 文本类请求 append 内容、替换返回内容
```bash
# 说明：会把内容 append 到请求后面
http://mydomain.com/style.css resAppend://{myAppend.css}
# 说明：完全替换请求内容
http://mydomain.com/style.css resBody://{myResBody.css}
```

- weinre 调试页面
```bash
# 说明：为 https://wq.jd.com 页面快速添加一个 weinre 调试脚本，点击 http://local.whistlejs.com/weinre/client/#debug_mypage 或界面主菜单 “Weinre” 可打开 inspect 界面调试该页面
https://wq.jd.com weinre://debug_mypage
```

更多的使用方法可以参考[ whistle 协议列表](https://avwo.github.io/whistle/rules/)

### 小结

从上面可以看出 whistle 的大致工作流程：

1. 配置需要修改的 url 地址
2. 编写 URI 协议，如 statusCode://
3. 编写协议对应的参数，如 statusCode://404

可以看出 whistle 的操作都是通过文本配置去实现，比较符合程序员的思维。

whistle 可操作的资源的 request 、respond 的 header、 body， 其中 header 里面的 query 、ua 、 cookie、status Code 等数据对前端来说非常熟悉， 也都有相应的协议去操作这些数据。

另外， whistle 很多操作协议都是针对前端开发友好的，比如 html、 js 、css 等类型的请求的修改协议对于前端程序猿来说都非常亲切。

## 使用建议

### 1. 代替本地的 host 文件

由于 whistle 兼容操作系统的 host 语法格式，所以在浏览器层面的 host 配置可轻松代替本地的 host 文件。这样做的主要好处是无缓存，切换时生效更快。

有一个技巧就是在 “Rules” 界面下，可配多套 host 配置，比如 dev、gamma 等满足开发需求。

<img src="https://misc.aotu.io/cos2004/whistle/hostfile.png" width="500">

### 2. 多终端代理

- 手机的 wifi 设置里，打开代理，连接本机 ip 和 8899 端口即可查看手机的网页请求
- 电脑其余程序的代理设置，也可通过本机 ip 和 8899 端口的形式使用 whistle 查看请求，比如微信 web 开发者工具

> 注意以上操作均需要在同一个局域网内

### 3. 转换 http 协议

转发协议+域名转发，轻松本地模拟 https ，访问线上的 https 域名实际上指向的是本地的 http 调试地址。
```bash
https://wq.jd.com http://localhost:9000
```

> 注意，涉及到 https 的请求都需要您的电脑和手机等都安装 whistle 提供的证书，详情可看文档。

### 4. mock 数据

whistle 提供了一个强大的 mock 数据的插件，强大之处是可以结合 js 语句 + mock 语法去生成数据。举一个简单的例子说明用法：

先安装插件：
```bash
npm i -g whistle.vase
```

在 “Plugins” 菜单打开 vase 的界面，新建一个名字为 “mock_json_demo” 的配置，并选择模板为 mock 。输入如下内容：
```json
{
  "list|5": [{
    "name": "@string",
    "avatar": "http://lorempixel.com/100/100/",
    "id|+1": 10000
  }]
}
```
> 不熟悉 mock 语法的朋友可以到[这里](https://github.com/nuysoft/Mock/wiki/Syntax-Specification)了解一下

<img src="https://misc.aotu.io/cos2004/whistle/vase_ui.png" width="500" />

在 “Rules” 下配置一条 vase 的规则：
```bash
http://mock.local/data.json vase://mock_json_demo
```

打开测试地址 http://mock.local/data.json ，即可看到模拟的数据。

<img src="https://misc.aotu.io/cos2004/whistle/mock_json_demo.png" width="500">

有读者可能会问，如果想更自由度更高一点，用 js 去生成数据是否可行？

当然可行，vase 提供了一种 “script” 模板可实现这种需求，里面可以写一些简单的 javascript API，还提供了 req（request）等内置数据对象，可以获取如请求的 headers、method、body、query、url 等数据。

既然这些数据都有了，是不是可以搞事情了？我有一个大胆的想法，请看下面的例子：

在 vase 界面新建一个名为 “json_engine_script” 数据模板，并选择 “script” 模板引擎。
```javascript
var json = merge({
  page: req.query.pi, // 取url查询参数的分页字段，加到要返回的数据里，达到模拟分页数据的效果
  total: 60
}, render('mock_json_demo', null, 'mock')); // render 可以渲染上文提到名为“mock_json_demo”的数据模板，返回一个json

if (req.query.callback) { // 如果查询参数带了callback，则返回jsonp
    out(header('content-type', 'application/javascript; charset=utf8'));
    var json_text = join([req.query.callback+'(', json, ')']); // join是内置方法，可合并一组数据
    out(json_text); // 向body输出数据
} else { // 没有callback则返回json
    out(header('content-type', 'application/json; charset=utf8'));
    out(json);
}
```

在 “Rules” 输入以下配置：
```bash
http://mock.local/data.json vase://json_engine_script
# 注释掉上一条配置
# http://mock.local/data.json vase://mock_json_demo
```

打开 http://mock.local/data.json?callback=cb&pi=1 ，可尝试改变、删除 callback、pi 参数，会发现返回的数据会随之改变。

<img src="https://misc.aotu.io/cos2004/whistle/json_engine_script.png" width="500">

至此就完成了一个简单的、有一定扩展性的 restful 数据接口模拟。

### 5. mock & more

在现有的开发工作流里，在需求开发完毕进入测试后，相信有不少团队都是需要测试人员单独模拟数据去测试页面功能。所以在开发阶段的 mock 数据、whistle rules 是不是可以直接共享给测试去使用了呢？因为纯文本配置的数据共享起来毕竟比较方便。

如果项目迭代比较快，觉得共享多份 mock 配置数据不方便，是否可以单独搞个 mock server（市面上已有类似服务比如 easy mock，我们团队也有一个好用的文档管理 & mock server），whistle 只进行请求转发，而开发与测试人员只需要共享 whistle rules 即可？

## 结语

总体来说 whistle 的玩法还是蛮多的，入门也比较简单，不过也是依然缺少一些功能，比如调试 websocket、图片 等的能力，也缺少一些账户系统 & 共享配置的能力，希望作者以后能够考虑完善一下这些功能吧，使这个工具更加好玩。

-------

## 参考资料：
[whistle 文档 https://avwo.github.io/whistle/](https://avwo.github.io/whistle/)

[vase 文档 https://github.com/whistle-plugins/whistle.vase](https://github.com/whistle-plugins/whistle.vase)

[mock 文档 https://github.com/nuysoft/Mock/wiki](https://github.com/nuysoft/Mock/wiki)


