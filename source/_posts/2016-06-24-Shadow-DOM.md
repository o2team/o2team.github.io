title: 神奇的Shadow DOM
subtitle: Shadow DOM可以做什么，好奇就看过来！
cover: https://img10.360buyimg.com/ling/jfs/t1/37603/21/11988/56698/5d08dab5E0c87b8dc/3ac0c556f2f8d5ab.jpg
tags:
  - Dom
  - ShadowDom
categories: Web开发
author:
  nick: 暖暖
  github_name: Newcandy
date: 2016-06-24 10:39:04
---

你有好奇过这个问题吗，为什么只用video标签包裹着source标签，就可以完成一系列视频功能：播放/暂停按钮、进度条、视频时间显示、音量控制等等？既然 DOM 源码这么干净，你有想过实现这些组件的代码是从哪儿来的吗？

<!-- more -->

## 1. 简介

Shadow DOM它允许在文档（document）渲染时插入一棵DOM元素子树，但是这棵子树不在主DOM树中。

因此开发者可利用Shadow DOM 封装自己的 HTML 标签、CSS 样式和 JavaScript 代码。

看一个简单的video：

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shadow DOM</title>
</head>
<body>

<video controls autoplay name="media" width="500">
    <source id="mp4" src="http://7ryl2t.com2.z0.glb.qiniucdn.com/572ffc37a2e5a.mp4" type="video/mp4">
</video>

</body>
</html>
```

页面完成了，在浏览器chrome中打开，然后打开 Chrome 的开发者工具，点击右上角的“Settings”按钮，勾选“Show user agent shadow DOM”。

![Show user agent shadow DOM](https://img13.360buyimg.com/ling/jfs/t1/83573/16/2249/119576/5d08dad1E2cea4770/0f7e592b0a711ab0.png)

浏览器截图：

![Video Shadow DOM](https://img12.360buyimg.com/ling/jfs/t1/81507/35/2246/707337/5d08dae9Ebd24720a/9fcb85b72ad33789.png)


#shadow-root称为影子根，可以看到它在video里面，换句话说，#shadow-root寄生在video上，所以video此时称为影子宿主。可以看到上图有两个#shadow-root，这是因为#shadow-root可以嵌套，形成节点树，即称为影子树（shadow trees）。影子树对其中的内容进行了封装，有选择性的进行渲染。这就意味着我们可以插入文本、重新安排内容、添加样式等等。如下所示：

![影子树](https://img20.360buyimg.com/ling/jfs/t1/48853/20/2735/152521/5d08db01E203c4f37/f3c6ebb3e6865c68.jpg)

## 2. 怎样创建Shadow DOM

使用createShadowRoot()来创建Shadow DOM，并赋值给一个变量，然后添加元素给变量即可。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Shadow DOM</title>
    <style type="text/css">
        .shadowroot_son {
            color: #f00;
        }
    </style>
</head>
<body>
    <div class="shadowhost">Hello, world!</div>
    <script>

        // 影子宿主（shadow host）
        var shadowHost = document.querySelector('.shadowhost');

        // 创建影子根（shadow root）
        var shadowRoot = shadowHost.createShadowRoot();

        // 影子根作为影子树的第一个节点，其他的节点比如p节点都是它的子节点。
        shadowRoot.innerHTML = '<p class="shadowroot_son">夏天夏天悄悄过去留下小秘密！</p>';

    </script>
</body>
</html>
```

浏览器截图：

![创建Shadow DOM](https://img12.360buyimg.com/ling/jfs/t1/82773/9/2263/13338/5d08db25Ea680fb80/676c6cb44d0c8a8a.png)

有没有注意到.shadowroot_son的样式color: #f00;不生效？！那是因为影子宿主和影子根之间存在影子边界（shadow boundary），影子边界保证主 DOM写的 CSS 选择器和 JavaScript 代码都不会影响到Shadow DOM，当然也保护主文档不受 shadow DOM 样式的侵袭。

## 3. 想要渲染影子宿主里的内容，那该怎么玩？

需要完成此项任务，需要两个利器：`<content>`和`<template>`。

### 3.1 `<content>`

通过 `<content>` 标签把来自主文档并添加到 shadow DOM 的内容被称为分布节点。

 `<content> `的select属性告诉`<content> `标签有选择性的插入内容。select 属性使用 CSS 选择器来选取想要展示的内容，选择器包括类选择器、元素选择器等。

### 3.2 `<template>`

目前的模板HTML做法通常是在`<script>` 中嵌入模板HTML，让内部的HTML标签按照字符串处理的，从而使得内容不显示：

```
<script type="text/template">
// ...
</script>
```

`<template>`元素的出现旨在让HTML模板变得更加标准与规范。

`<template>`在使用前不会被渲染，不会执行加载等操作，也能够实现隐藏标签内容，而且位置任意性，可以在`<head>`中，也可以在`<body>`或者`<frameset>`中。

### 3.3 实例

通过以上对 `<content> `和`<template>`的简单了解，我们来通过一个实例加深理解：

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>content&template</title>
</head>

<body>

    <div class="shadowhost">
        <em class="shadowhost_content1">唱歌</em>
        <em class="shadowhost_content2">跳舞</em>
    </div>

    <!-- S 模板标签 template -->
    <template class="template">
        <h1>你<content select=".shadowhost_content1"></content>我<content select=".shadowhost_content2"></content>!</h1>
    </template>
    <!-- E 模板标签 template -->

    <script>
    var shadowHost = document.querySelector('.shadowhost');

    var shadowRoot = shadowHost.createShadowRoot();
    var template = document.querySelector('.template');

    // template.content会返回一个文档片段，可以理解为另外一个document。
    // 利用document.importNode获取节点，true表示深度克隆。
    shadowRoot.appendChild(document.importNode(template.content, true));
    </script>

</body>

</html>
```

浏览器截图：

![content&template](https://img30.360buyimg.com/ling/jfs/t1/70292/39/2261/17909/5d08db60E797bbbd0/7a81448a523f2a42.png)

我们来看一下下面三个属性的用途：

```
console.log(template.innerHTML);   // 获取完整的HTML片段
console.log(template.content);  // 返回一个文档片段#document-fragment
console.log(template.childNodes);  // 返回[]，说明childNodes无效
```

**贪心插入点**：如果把select=".shadowhost_content1"改成select=""或者select="*"，那么会有不一样的结果。因为贪心选择器放在了模板的第一个，他会将所有内容都抓取，不给其他select 选择器留一点内容。浏览器截图如下：

![贪心插入点](https://img14.360buyimg.com/ling/jfs/t1/63377/18/2324/18363/5d08db79E21bdc8d0/b744e7544e389f3f.png)

## 4. 关于样式

### 4.1 宿主样式:host

在shadow DOM中利用:host定义宿主的样式，当然用户可以在主文档中覆盖这个样式。

:host 是伪类选择器（Pseudo Selector）,:host或者 :host(*)是默认给所有的宿主添加样式，或者单独给一个宿主添加样式，即通过:host(x)，x可以是宿主的标签或者类选择器等。

另外:host还可以配合:hover、:active等状态来设置样式，如：

```
:host(:hover) {
    border: 2px solid #0ff;
}
```

### 4.2 ::shadow

原则上来说，影子边界保证主 DOM写的 CSS 选择器和 JavaScript 代码都不会影响到Shadow DOM。
但你可能会想打破影子边界的所谓保证，主文档能够给Shadow DOM添加一些样式，这时可以使用::shadow。

### 4.3 /deep/

::shadow 选择器的一个缺陷是他只能穿透一层影子边界，如果你在一个影子树中嵌套了多个影子树，那么使用 /deep/ 。

### 4.4 ::content

还记得什么叫分布节点吗？通过 `<content>` 标签把来自主文档并添加到 shadow DOM 的内容被称为分布节点。

分布节点的样式渲染需要用到 ::content。即使分布节点为em标签，直接写 em {} 不生效，应该写成::content > em {}。

### 4.5 实例

```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>::content&::shadow&/deep/</title>
    <style type="text/css">
    /* ::shadow */
    /*.shadowhost::shadow h1 {
        padding: 20px;
        border: 1px solid #f00;
    }*/

    /* /deep/  */
    .shadowhost /deep/ h1 {
        padding: 20px;
        border: 1px solid #000;
    }
    </style>
</head>

<body>
    <div class="shadowhost">
        <em class="shadowhost_content1">唱歌</em>
        <em class="shadowhost_content2">跳舞</em>
    </div>

    <!-- S 模板标签 template -->
    <template class="template">
        <style>
        /* 定义宿主样式:host */
        :host {
            color: #E85E5E;
        }
        /* 定义宿主hover状态下的样式 */
        :host(:hover) {
            color: #000;
        }

        /* 分布节点的样式渲染需要用到 ::content,直接写 em {} 不生效 */
        ::content > em {
            padding: 10px;
            color: #fff;
            background: #FFCC00;
            border-radius: 10px;
        }
        </style>
        <h1>你<content select=".shadowhost_content1"></content>我<content select=".shadowhost_content2"></content>!</h1>
    </template>
    <!-- E 模板标签 template -->

    <script>
    var shadowHost = document.querySelector('.shadowhost');

    var shadowRoot = shadowHost.createShadowRoot();
    var template = document.querySelector('.template');

    shadowRoot.appendChild(document.importNode(template.content, true));
    </script>

</body>

</html>
```

浏览器截图如下：

![::content&::shadow&/deep/](https://img11.360buyimg.com/ling/jfs/t1/52877/38/2758/28775/5d08db93E1ac41623/1e8e2656180bcf5b.png)

## 5. JavaScript

### 5.1 重定向

Shadow DOM 里的 JS 与传统的 JS 一个真正不同的点在于事件调度（event dispatching）。要记住的一点是：原来绑定在 shadow DOM 节点中的事件被重定向了，所以他们看起来像绑定在影子宿主上一样。

当你点击“shadow text”的输入框时控制台却输出了宿主元素（就是 #host）的 id 。这是因为影子节点上的事件必须重定向，否则这将破坏封装性。

分布节点来自原有 DOM 结构，没必要重定向。

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>select</title>
</head>
<body>
  <input id="normal-text" type="text" value="I'm normal text">

  <div id="host">
    <!-- “dustributed text”为分布节点，来自原有 DOM 结构，没必要重定向。 -->
    <input id="distributed-text" type="text" value="I'm distributed text">
  </div>

  <template>
    <div>
      <input id="shadow-text" type="text" value="I'm shadow text">
    </div>
    <div>
      <content></content>
    </div>
  </template>

  <script>
    var host = document.querySelector('#host');
    var root = host.createShadowRoot();
    var template = document.querySelector('template');
    root.appendChild(document.importNode(template.content, true));

    document.addEventListener('click', function(e) {
      console.log(e.target.id + ' click!');
    });
  </script>
</body>

</html>
```

分别单击每个输入框，控制台打印截图如下：

![事件重定向](https://img12.360buyimg.com/ling/jfs/t1/33335/31/13969/34284/5d08dbafE97b99873/4e55c53adf058c62.jpg)



### 5.2 被阻塞的事件（Blocked Events）

事件abort、 error、 select 、change 、load 、reset 、resize 、scroll 、selectstart不会进行重定向而是直接被干掉，因此事件不能冒泡到文档中，事件监听重定向至文档，因此无法监听到这一事件。

把上面的监听事件click改成select，即改成：

```
document.addEventListener('select', function(e) {
    console.log(e.target.id + ' select!');
});
```

分别双击每个输入框，你会发现，shadow text的输入框没有打印，就是没有发生select事件。

![被阻塞的事件](https://img30.360buyimg.com/ling/jfs/t1/37268/2/12572/19568/5d08dbc5E0f858bb5/4e2ec2ff15cae6fd.jpg)


### 6. 兼容性

![template兼容性](https://img10.360buyimg.com/ling/jfs/t1/47768/6/2700/160781/5d08dbd9Ece1aa109/8997132a7bee5678.png)

![Shadow DOM兼容性](https://img20.360buyimg.com/ling/jfs/t1/60341/35/2293/236123/5d08dbeeE48da7e88/4c976885f5002ba1.png)

看上去只能在chrome中愉快地玩耍。

[webcomponents.js](http://webcomponents.org/)使得Shadow DOM在非 native 支持的浏览器上实现。


## 7. 参考链接

[A Guide to Web Components](https://css-tricks.com/modular-future-web-components/)
[Shadow DOM系列文章](http://www.ituring.com.cn/article/177453)
[HTML5 `<template>`标签元素简介](http://www.zhangxinxu.com/wordpress/2014/07/hello-html5-template-tag/)

