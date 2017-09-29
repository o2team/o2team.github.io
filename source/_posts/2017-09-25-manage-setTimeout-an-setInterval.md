title: setTimeout & setInterval 暂停方案
subtitle: 定制一套 setTimeout & setInterval ，使其具体有暂停和恢复暂停的功能
cover: https://misc.aotu.io/leeenx/timer/cover.jpg
categories: Web开发
tags:
  - h5
  - timer
  - setTimeout
  - setInterval
  - createjs
  - pause
  - 暂停
author:
  nick: leeenx
  github_name: leeenx
date: 2017-09-25 16:04:51
wechat:
    share_cover: https://misc.aotu.io/leeenx/timer/share.gif
    share_title: 管理页面的 setTimeout & setInterval
    share_desc: 定制一套 setTimeout & setInterval ，使其具体有暂停和恢复暂停的功能
---

<!-- more -->


在管理 setTimeout & setInterval 这两个 APIs 时，笔者通常会在顶级（全局）作用域创建一个叫 `timer` 的对象，在它下面有两个数组成员 ------ {sto, siv}，用它们来分别存储需要管理的 setTimeoutID / setIntervalID。如下：

```javascript
var timer = {
	sto: [], 
	siv: []
};
```
在使用 setTimeout / setInterval 的时候，这样调用：
```javascript
// 标记 setTimeoutID
timer.sto.push(
	setTimeout(function() {console.log("3s")}, 3000); 
); 
// 标记 setIntervalID
timer.siv.push(
	setInterval(function() {console.log("1s")}, 1000)
); 
```
在页面需要 clearTimeout \ clearInterval 的时候，这样调用：

```javascript
// 批量清除 setTimeout
timer.sto.forEach(function(sto) {clearTimeout(sto)}); 
// 批量清除 setInterval
timer.siv.forEach(function(siv) {clearInterval(siv)}); 
```

## 暂停 & 恢复

近段时间，笔者发现很多业务都需要「暂停」和「恢复」`setTimeout` & `setInterval` 的功能，而仅靠原生的四个 APIs（setTimeout / setIntervale / clearTimeout / clearInterval）是不够用的。于是，笔者对 `timer` 进行了扩展，使它具备了「暂停」和「恢复」的功能，如下：

```javascript
// 暂停所有的 setTimeout & setInterval
timer.pause(); 
// 恢复所有的 setTimeout & setInterval
timer.resume(); 
```
扩展后的 `timer`对象下面挂载6个基础的 APIs。
- setTimeout
- setInterval
- clearTimeout
- clearInterval
- pause
- resume

使用 `timer.set*`  & `timer.clear*` 来代替原生的 `set*` & `clear*`。笔者把扩展后的 timer 托管在 GitHub 仓库上，有兴趣的同学可以移步：[https://github.com/leeenx/timer](https://github.com/leeenx/timer)

## CreateJS 的启发

在使用 CreateJS 开发一些项目的过程中，笔者发现通过设置 `createjs.Ticker.paused = true / false`，可以暂停/恢复 createjs.Tween 上的动画。于是笔者借用 createjs.Tween 模拟了 setTimeout & setInterval 的功能，如下：
```
// setTimeout
createjs.setTimeout = function(fn, delay) {
	createjs.Tween.get().wait(delay).call(fn);
}
//setInterval
createjs.setInterval = function(fn, delay) {
	createjs.Tween.get().wait(delay).call(fn).loop = 1; 
}
```

具体的代码笔者托管在：[createjs.timer](https://github.com/leeenx/createjs.timer)。
其实就是在 `createjs` 对象下挂载四个 APIs:  
- setTimeout
- setInterval
- clearTimeout
- clearInterval

使用方法与原生的 setTimeout & setInterval 一样，如下：
```javascript
let siv = createjs.setInterval(() => console.log("1s"), 1000);
createjs.setTimeout(() => createjs.clearInterval(siv), 5000);
```

## 时间轴驱动的 timer

`createjs.timer` 在 CreateJS 项目的开发给笔者带来了极大的便利，但是它必须依赖 `createjs.Tween` 模块。于是笔者就在思考能否创建一个跟第三方框架无关并且又可以在第三方框架上使用的 `timer`。

**createjs.Ticker.paused 为什么能暂停 createjs.Tween 上的动画的？**
createjs.Tween 中每一个动画都有一条自己的时间轴，这条时间轴是通过 createjs.Ticker 来驱动的；当 createjs.Ticker 被暂停后，createjs.Tween 中的每个动画的时间轴也会失去动力而暂停下来。

createjs.Ticker 的作用是提供一个刷新 `canvas` 画面帧频，通常是使用 `requestAnimationFrame` or `setInterval` 来实现的。如果 `timer` 内部存在一条时间轴，这条时间轴由第三方驱动，那么 timer 就可以与第三方框架状态同步了。

笔者是这样设计 `timer` 的结构：

- queue ------ 存放 `setTimeout` or `setInterval` 的队列；
- updateQueue ------ 驱动 `queue` 的内部 API；
- update ------ 外部接口，用于对接第三方 Ticker。

实现的伪代码如下：

```javascript
/*
	@queue 成员的结构如下：
	{
		fn: fn, // 回调函数 
        type: "timeout or interval", // 类型 
        elapsed: 0, // 时间轴进度
        delay: delay // 目标时长
	}
*/
let queue = new Map(); 
function updateQueue(delta) {
	queue.forEach((item, id) => { 
        item.elapsed += delta; 
        if(item.elapsed >= item.delay) {
            item.fn(); 
            // 从 queue 中删除 setTimeout 成员，interval 成员继续循环
            item.type === "timeout" ? delete(id) : (item.elapsed = 0); 
        } 
    }); 
}
// 对外接口
this.update = function(delta) {
	updateQueue(delta); 
}
```

_`timer` 的具体实现可以参考：[https://github.com/leeenx/es6-utils#timer](https://github.com/leeenx/es6-utils#timer)_

timer 与 CreateJS 一起使用：
```javascript
// es6 代码
import timer from './modules/timer'; 
// 统一 ticker
createjs.Ticker.addEventListener("tick", function(e) {
  e.paused || timer.update(e.delta); 
}); 
```

timer 与 PIXI 一起使用：
```javascript
// es6 代码
import timer from './modules/timer'; 
// 统一 ticker
app.ticker.add("tick", function() {
  timer.update(app.ticker.elapsedMS); 
}); 
```

附上 PIXI 的线上 [DEMO](http://jdc.jd.com/fd/promote/leeenx/201709/pixijs/demo.html)，二维码如下：

![二维码](//misc.aotu.io/leeenx/timer/20170925_qr.jpg)

## 总结

感谢阅读完本文章的读者。本文仅代表个人观点，希望能帮助到有相关问题的朋友，如果本文有不妥之处请不吝赐教。