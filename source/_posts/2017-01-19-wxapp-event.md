title: 微信小程序跨页面通信解决思路
subtitle: 利用订阅／发布模式来实现微信小程序 Page 间通讯
cover: //misc.aotu.io/Chen-jj/wxapp_event_900x500.png
date: 2017-01-19 20:27:00
categories: Web开发
tags:
  - 小程序
  - 微信小程序
author:  
    nick: cjj
    github_name: Chen-jj
wechat:
    share_cover: http://misc.aotu.io/Chen-jj/wxapp_event_200x200.png
    share_title: 微信小程序跨页面通信解决思路
    share_desc: 利用订阅／发布模式来实现微信小程序 Page 间通讯

---


<!-- more -->

宏观上，微信小程序是由一个个 Page 组成的。有时候我们会遇到一些业务存在耦合的 Page，一个 Page 里某个状态改变后，相关 Page 的状态需要进行更新。而在小程序里，每个 Page 都是一个模块，有着独立的作用域，因此 Page 间需要有一种通信策略。

想象一个业务场景，用户首先进入订单列表页。然后点击其中一个订单，进入到订单详情页。当用户在订单详情页对订单进行操作，例如支付、确认收货等时，该订单的状态就会发生改变。此时需要对上一级的订单列表页中该订单的状态进行更新：

![example](//misc.aotu.io/Chen-jj/event-example.png)

要想更新订单列表页的视图层，就需要调用该 Page 对象的 `setData` 方法。这里为大家列举三种比较常用的方案：

## 设置标志位

最简单的方法，在订单详情页对订单的操作成功回调中，把一些标志位设置为 true，并设置好参数（标志位和参数可以存在 localStorage 或挂在全局 App 对象下）。然后每次在订单列表页的 onShow 生命周期中，根据这些标志位去判断是否进行更新、更新的参数是什么。

这种处理在业务逻辑比较简单、页面间的耦合度很小时还能凑合，一旦逻辑复杂起来，就需要写很多冗余的代码，并且维护成本会非常高。

流程图：

![planA](//misc.aotu.io/Chen-jj/event-planA.png)

## 利用页面栈获取 Page 对象 

如果订单详情页里能拿到订单列表页的 Page 对象，就能去调用它的 setData 方法。小程序提供了一个方法 `getCurrentPages`，执行它可以得到当前页面栈的实例，然后再根据页面进栈的顺序我们就能拿到订单列表页的 Page 对象。

然而这种做法的缺点还是耦合度太大，过度依赖页面进栈顺序。一旦在以后的产品迭代中页面顺序发生变化，将很难去维护。

流程图：

![planB](//misc.aotu.io/Chen-jj/event-planB.png)

上述两种方法都存在着耦合度大、维护困难的问题，而利用发布／订阅模式能很好的实现解耦，下面我们先来了解一下这种设计模式。

## 发布／订阅模式（最优方案）

发布／订阅模式由一个发布者、多个订阅者以及一个调度中心所组成。订阅者们先在调度中心订阅某一事件并注册相应的回调函数，当某一时刻发布者发布了一个事件，调度中心会取出订阅了该事件的订阅者们所注册的回调函数来执行。

![publish / subscribe](//misc.aotu.io/Chen-jj/publish.png)

在发布／订阅模式中，订阅者和发布者并不需要关心对方的状态，订阅者只管订阅事件并注册回调、发布者只管发布事件，其余一切交给调度中心来调度，从而能实现解耦。

在 app 跨页面通信这个问题上，iOS 端的 **Notification Center**、安卓端的 **EventBus**，也是通过这样一种设计模式去解决的，不过微信小程序内部并没有提供这种事件通知机制，所以我们需要手动去实现一个。

我们首先要实现一个 Event 类，它应该含有一个收集回调函数的对象，和提供三个基础方法：on（订阅）、 emit（发布）、 off（注销）。

```js
// event.js

class Event {
    
    /**
     * on 方法把订阅者所想要订阅的事件及相应的回调函数记录在 Event 对象的 _cbs 属性中
     */
    on (event, fn) {
        if (typeof fn != "function") {
            console.error('fn must be a function')
            return
        }
        
        this._cbs = this._cbs || {}
        ;(this._cbs[event] = this._cbs[event] || []).push(fn)
    }


    /**
     * emit 方法接受一个事件名称参数，在 Event 对象的 _cbs 属性中取出对应的数组，并逐个执行里面的回调函数
     */
    emit (event) {
        this._cbs = this._cbs || {}
        var callbacks = this._cbs[event], args

        if (callbacks) {
            callbacks = callbacks.slice(0)
            args = [].slice.call(arguments, 1)
            for (var i = 0, len = callbacks.length; i < len; i++) {
                callbacks[i].apply(null, args)
            }
        }
    }



    /**
     * off 方法接受事件名称和当初注册的回调函数作参数，在 Event 对象的 _cbs 属性中删除对应的回调函数。
     */
    off (event, fn) {
        this._cbs = this._cbs || {}

        // all
        if (!arguments.length) {
            this._cbs = {}
            return
        }

        var callbacks = this._cbs[event]
        if (!callbacks) return

        // remove all handlers
        if (arguments.length === 1) {
            delete this._cbs[event]
            return 
        }

        // remove specific handler
        var cb
        for (var i = 0, len = callbacks.length; i < len; i++) {
            cb = callbacks[i]
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1)
                break
            }
        }
        return
    }    
}
```

### 具体调用方法

App 是小程序的实例，在每个 Page 里都能通过执行 `getApp` 函数获取到它。我们可以把 Event 类的实例挂载在 App 中，方便每个 Page 去调用。

```js
// app.js

const Event = require('./libs/event')

App({
    event: new Event(),
    ...
})
```

订单列表页在 onLoad 生命周期中订阅 "afterPaySuccess" 事件。

```js
//order_list.js

var app = getApp()

Page({
    onLoad: function(){
        app.event.on('afterPaySuccess',this.afterPaySuccess.bind(this))
    },
    afterPaySuccess: function(orderId) {
        ...
    },
    ...
})
```

在订单详情页支付成功的回调中，发布 "afterPaySuccess" 事件,同时带上订单 id 参数。

```js
//order_detail.js

var app = getApp()

Page({
    raisePayment: function() {
        ... 
        app.event.emit('afterPaySuccess', orderId)
    },
    ...
})
```

所有 Page 的 onUnload 生命周期，必须注销掉之前订阅的事件。注销方法 off 的调用姿势有三种，不过还是建议注销当前 Page 所订阅的事件，而不是注销所有的。

```js
var app = getApp()

Page({
    onUnload: function(){
        // remove all
        app.event.off()
        // remove all callbacks
        app.event.off('afterPaySuccess')
        // remove specific callbacks
        app.event.off('afterPaySuccess', this.afterPaySuccess)
    },
    ...
})
```
到此就结束了吗？还没有，按照我们的订阅、注销写法，在注销指定回调函数的时候，其实是永远注销不了的。

### 完善off方法

为了让每个回调函数被调用时的 this 都指向对应的 Page 对象，必须在订阅时对回调函数绑定当前的上下文对象。

```js
app.event.on('afterPaySuccess',this.afterPaySuccess.bind(this))
```

相当于

```js
app.event.on('afterPaySuccess', function(){
    var args = Array.prototype.slice.call(arguments)
    // fn、that分别为闭包起来的回调函数和page对象
    return fn.apply(that, args)
})
```

正因为 bind 方法会返回这样一个匿名函数，然后这个匿名函数会被加入到回调数组中。因此我们注销指定回调函数的时候，在回调数组中是找不到它的，也就永远无法注销。

为了保持我们原来的 emit 调用方式，我想过直接把 Function.prototype.bind 改写：

```js
Function.prototype.bind = function(that) {
    var fn = this
    var cb = function(){
        var args = Array.prototype.slice.call(arguments)
        return fn.apply(that, args)
    }
    cb.fn = this
    return cb
}
```

然后再稍微修改一下 off 方法里的判断条件

```js
// remove specific callbacks
...
if (cb === fn || cb.fn === fn) {
    callbacks.splice(i, 1)
    break
}
...
```
在浏览器环境这种做法是可行的，但是在小程序侧则是失败的。因为我们定义的这些 function 在小程序里并不是 Function 的实例，那无论我怎样修改 Function 的 prototype 属性，function 并不会继承到。原因是小程序把 Function 给改写了：

```js
//console

Function.toString()
// "function (){if(arguments.length>0&&"return this"===arguments[arguments.length-1])return function(){return e}}"
```

#### 优化方案

在小程序环境中是不能偷懒了，需要把之前的代码改写一下。要把 Page 对象也传给调度中心保存起来，作为回调函数调用时的上下文对象。

代码：

```js
//event.js

class Event {

    on (event, fn, ctx) {
        if (typeof fn != "function") {
            console.error('fn must be a function')
            return
        }
        
        this._stores = this._stores || {}
        
        ;(this._stores[event] = this._stores[event] || []).push({cb: fn, ctx: ctx})
    }

    emit (event) {
        this._stores = this._stores || {}
        var store = this._stores[event], args

        if (store) {
            store = store.slice(0)
            args = [].slice.call(arguments, 1)
            for (var i = 0, len = store.length; i < len; i++) {
                store[i].cb.apply(store[i].ctx, args)
            }
        }
    }

    off (event, fn) {
        this._stores = this._stores || {}

        // all
        if (!arguments.length) {
            this._stores = {}
            return
        }

        // specific event
        var store = this._stores[event]
        if (!store) return

        // remove all handlers
        if (arguments.length === 1) {
            delete this._stores[event]
            return 
        }

        // remove specific handler
        var cb
        for (var i = 0, len = store.length; i < len; i++) {
            cb = store[i].cb
            if (cb === fn) {
                store.splice(i, 1)
                break
            }
        }
        return
    }   
}
```

调用方法也需要改一下，不需要使用 bind 方法了，只需传入 Page 对象：

```js
app.event.on('afterPaySuccess', this.afterPaySuccess, this)
```

## 写在最后

一个简单的事件类几十行代码就能写完了，但作为一个基础模块还是有很多可以优化和拓展的地方。有兴趣的同学可以研读一下 nodejs 的 event 模块:<https://github.com/nodejs/node/blob/master/lib/events.js>，里面对事件类做了很多优化和功能拓展。

另外，小程序的开发过程中相信大家都遇到了不少的坑和发现了一些可以优化的点。为了收集这些开发中的痛点，我们开了一个 issue-list：<https://github.com/o2team/wxapp-issue-list/blob/master/issue-list.md>，欢迎大家前来提 issue~

## 参考

- <https://github.com/dannnney/weapp-event>



