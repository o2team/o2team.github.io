---
title: 简单易懂的设计模式（下）
date: 2021-06-17 19:11:14
tags: ['前端', '设计模式']
---

![](https://img30.360buyimg.com/ling/jfs/t1/187775/5/8271/435193/60c8117eE7d79ef41/1d21db2c4dca9a90.png)


设计模式（下）将介绍观察者模式、装饰器模式、职责链模式 3 个常用设计模式，使用观察者模式实现双向数据绑定、装饰器模式实现数据上报、职责链模式实现 618 预售订单等需求，利用设计模式帮助我们解决实际问题。

# 一、观察者模式

## 1. 什么是观察者模式
当对象之间存在一对多的依赖关系时，其中一个对象的状态发生改变，所有依赖它的对象都会收到通知，这就是观察者模式。

## 2. 实际场景

### 1. `DOM` 事件
开发过程中，最常见的观察者模式场景就是 `DOM` 事件函数，先看看代码：
```
document.body.addEventListener('click', () => {
    alert(2)
}, false)
```

当 `body` 节点被点击时，触发 `alert(2)`，从观察者模式来解释，就是我们订阅了 `bdoy` 节点的点击事件，当点击事件触发，我们就会收到通知。

### 2. 网站登录

网站登录功能，想必大多数做过平台需求的同学都实现过，当网站中的不同模块，如 Header 模块、Nav 模块、正文模块，都依赖登录后获取的用户数据时，该怎么去实现呢？

#### 2.1 普通做法

先看代码：

```javascript
login.succ((data => {
    header.setAvatar(data.avatar) // 设置头像
    nav.setAvatar(data.avatar) // 设置导航区的头像
    list.refresh() // 刷新列表
})
```

这样的代码是不是特别熟悉？把依赖的方法，放在回调函数中。上述就是在登录成功的回调函数中，添加了各模块的方法。这么做导致各个模块和登录模块高度耦合，当新增了一个地址栏模块时，不得不再次修改登录模块的回调函数，违反了开放-封闭原则。

#### 2.2 观察者模式

用观察者模式，优化上述需求。

登录模块是一个订阅对象，Header 模块、Nav 模块、正文模块添加对登录模块的订阅，当登录模块发生改变时，通知各个订阅了登录模块的模块。代码如下：
```javascript
// 登录模块js
// 登录成功后，发布“loginSucc”登录成功消息，并传递data数据
login.succ(data=> {
    login.trigger('loginSucc', data)
})

// header模块js
// 订阅“loginSucc”登录成功消息
login.listen('loginSucc', () => {
    header.setAvatar(data.avatar)
})

// nav模块js
// 订阅“loginSucc”登录成功消息
login.listen('loginSucc', () => {
    nav.setAvatar(data.avatar)
})

```

上述代码用观察者模式重构了网站登录功能，后续不管新增多少业务模块，依赖登录功能，都只需要在模块内新增对登录成功的订阅，无需再改动登录模块。

### 3. 双向数据绑定

双向数据绑定也可以通过观察者模式实现。

双向指的是视图 `view` 和模型 `model`，当视图发生改变时，模型也发生变化，同样，当模型发生改变，视图也跟着同步变化。

分为以下几个步骤实现：

#### 3.1 新建发布-订阅对象

新建一个发布-订阅对象，用于发布消息，订阅消息。

- `subscrib`：订阅函数，当其他对象添加订阅消息时，将回调函数 `push` 进 `callbacks` 对象数组中；
- `publish`：发布函数，当发布消息时，触发 `callbacks` 中该消息对应的 `callback`.

```javascript
const Pubsub = {
    subscrib: function (ev, callback) {
        this._callbacks || (this._callbacks = {});
        (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
    },

    publish: function () {
        const args = [...arguments]
        const ev = args.shift()

        if (!this._callbacks) return
        if (!this._callbacks[ev]) return

        this._callbacks[ev].forEach(callback => {
            callback(...args)
        })
    }
}
```
#### 3.2 `ui` 更新
#### 3.2.1 发布 `ui` 更新消息

注册 `document` 的 `keyup` / `change` 事件，当激活事件的 `dom` 元素拥有 `data-bind `属性时，说明 `ui` 正在更新，发布 `ui` 更新消息通知订阅者。


```javascript
function eventHander (e) {
    const { target } = e
    const { value: propValue } = target

    const propNameWhole = target.getAttribute('data-bind')
    if (propNameWhole) {
        // 发布ui更新消息
        Pubsub.publish('ui-update-event', { propNameWhole, propValue })
    }
}

console.log(document.addEventListener)
document.addEventListener('change', eventHander, false)
document.addEventListener('keyup', eventHander, false)
```
##### 3.2.2 订阅 `model` 更新消息

所有包含 `data-bind` 属性的 `dom` 元素，订阅 `model` 更新消息，当 `model` 更新时，`ui` 将会收到通知。
```javascript
// 订阅model更新消息，更新后所有符合条件的dom节点都会收到通知，进行更新
Pubsub.subscrib('model-update-event', function ({propNameWhole, propValue}) {
    const elements = document.querySelectorAll(`[data-bind="${propNameWhole}"]`)

    elements.forEach(element => {
        const elementTagName = element.tagName.toLowerCase()
        const formTypeTagNames = ['input', 'select', 'textarea']
        if (formTypeTagNames.includes(elementTagName)) {
            element.value = propValue
        } else {
            element.innerHTML = propValue
        }
    })
})
```

#### 3.3 `model` 更新

##### 3.3.1 订阅 `ui` 更新消息

订阅 `ui` 更新消息，当 `ui` 更新时，触发 `modal` 更新。

```javascript
class Bind {
    constructor () {
        this.modelName = ''
    }

    initModel ({ modelName }) {
        this.modelName = modelName

        // 订阅ui更新消息
        Pubsub.subscrib('ui-update-event', ({propNameWhole, propValue}) => {
            const [ , _propName] = propNameWhole.split('.')
            this.updateModalData(_propName, propValue)
        })
    }
    
    // xxx省略xxx

    updateModalData (propName, propValue) {
        const propNameWhole = `${this.modelName}.${propName}`
        // 发布model更新消息
        Pubsub.publish('model-update-event', { propNameWhole, propValue });
    }

}
```

##### 3.3.2 发布model更新消息

`model` 更新时，发布 `model` 更新消息，此时，订阅了 `model` 更新消息的 `ui`，将得到通知。

```javascript
class Bind {
    constructor () {
        this.modelName = ''
    }
    
    // xxx省略xxx

    loadModalData (modelData) {
        for (let propName in modelData) {
            this.updateModalData(propName, modelData[propName])
        }
    }

    updateModalData (propName, propValue) {
        const propNameWhole = `${this.modelName}.${propName}`
        // 发布model更新消息
        Pubsub.publish('model-update-event', { propNameWhole, propValue });
    }

}
```

## 3. 总结

从上文的实际场景例子可见，观察者模式建立了一套触发机制，帮助我们完成更松耦合的代码编写。但是也不能过度使用，否则会导致程序难以追踪和理解。

# 二、装饰器模式

## 1. 什么是装饰器模式
简单来说，装饰器模式就是给对象动态增加功能。

有一个鸭子对象，它会发声 `makeVoice`， 会睡觉 `sleep`，但是因为它还太小，不会走路，代码如下：

```javascript
const duck =  {
    makeVoice: () => {
        console.log('我会嘎嘎嘎啦')
    },
    sleep: () => {
        console.log('谁又不会睡觉呢')
    },
    init: function () {
        this.makeVoice()
        this.sleep()
    }
}

duck.init()
```

当它 3 个月大的时候，突然学会走路 `walk` 了，这个时候，怎么在代码中，为鸭子 `duck` 添加走路 `walk` 功能呢？大多数情况下，我们会选择直接修改鸭子 `duck` 方法，代码如下：

```javascript
const duck =  {
    makeVoice: () => {
        console.log('我会嘎嘎嘎啦')
    },
    sleep: () => {
        console.log('谁又不会睡觉呢')
    },
    walk: () => {
        console.log('哈哈哈，我会走路啦')
    },
    init: function () {
        this.makeVoice()
        this.sleep()
        this.walk()
    }
}

duck.init()
```

快乐的时光总是短暂的，鸭子越长越大，功能也越来越多。有一天，你请假出去玩，拜托朋友帮你照顾这只鸭子，不巧，鸭子要下蛋了，朋友需要帮鸭子添加一个下蛋的功能，这就有点麻烦了因为这是他第一次照顾这只鸭子，他担心如果直接在鸭子内部添加方法会影响到什么。

于是他想到了一个好方法，不直接修改鸭子内部，而是通过一个外部函数，引用这个鸭子，并为外部函数添加下蛋的功能。

代码如下：

```javascript
const before = function (fn, beforeFn) {
    return function () {
        beforeFn.apply(this, arguments)
        return fn.apply(this, arguments)
    }
}

const after = function (fn, afterFn) {
    return function () {
        const __ = fn.apply(this, arguments)
        afterFn.apply(this, arguments)
        return __
    }
}

const duck =  {
    makeVoice: function () {
        console.log('我会嘎嘎嘎啦')
    },
    sleep: function () {
        console.log('谁又不会睡觉呢')
    },
    walk: function () {
        console.log('哈哈哈，我会走路啦')
    },
    init: function () {
        this.makeVoice()
        this.sleep()
        this.walk()
    }
}

after(duck.init, function egg () {
    console.log('生蛋快乐～')
}).apply(duck)
```

这就是装饰器模式，动态的为鸭子添加功能，而不直接修改鸭子本身。

## 2. 实际场景

### 1. 数据上报

自定义事件的数据上报一般都依赖于点击事件，那么这个点击事件既要承担原本的功能，又要承担数据上报的功能。

#### 1.1 普通做法

先上代码：

```
const loginBtnClick = () => {
    console.log('去登录'）
    console.log('去上报')
} 
```

好像没毛病，这样的代码中项目中随处可见，逃避(面向过程编程)虽可耻但有用。

#### 1.2 装饰器模式做法

可以通过装饰器模式来重构上述代码，将职责划分更细，代码松耦合，可复用性更高。

```javascript

const after = function (fn, afterFn) {
    return function () {
        const __ = fn.apply(this, arguments)
        afterFn.apply(this, arguments)
        return __
    }
}

const showLogin = function () {
    console.log('去登录')
}

const log = function () {
    console.log('去上报')
}

const loginBtnClick = after(showLogin, log)

loginBtnClick()

```

### 2. 动态增加参数 

一个常规的 `ajax` 请求参数包括 `type` / `url` / `param`，当突发一个特殊情况，需要在 `ajax` 的参数中，新增一个 `token` 参数。

#### 2.1 普通做法
先上代码：

```javascript
const ajax = function (type, url, param) {
    // 新增token参数
    param.token = 'xxx'
    // ...ajax请求...省略
}
```

好了，又一次违反开放-封闭原则，直接修改了 `ajax` 函数内部.

#### 2.2 装饰器做法

通过装饰器模式，在 `ajax` 调用之前，为 `ajax` 增加 `token` 参数，代码如下：

```
const before = function (fn, beforeFn) {
    return function () {
        beforeFn.apply(this, arguments)
        return fn.apply(this, arguments)
    }
}

let ajax = function (type, url, param) {
    console.log(arguments)
    // ...ajax请求...省略
}

ajax = before(ajax, function (type, url, param) {
    console.log(param)
    param.token = 'xxx'
})

ajax('type', 'url', {name: 'tj'})
```

这样做可以减少 `ajax` 函数的职责，提高了 `ajax` 函数的可复用性，
 
## 3. 总结

本文通过给鸭子函数动态增加功能、数据上报、动态增加参数 3 个例子，讲述了装饰器模式的应用场景及带给我们的好处。

装饰器模式，让对象更加稳定，且易于复用。而不稳定的功能，则可以在个性化定制时进行动态添加。

# 三、职责链模式

## 1. 什么是职责链模式

职责链模式就是当一个对象 `a`，有多种可能的请求对象 `b`、`c`、`d`、`e` 时，我们为 `b`、`c`、`d`、`e` 分别定义一个职责，组成一条职责链，这样 `a` 只需要找到 `b` 发起请求，然后沿着职责链继续请求，直到找到一个对象来处理 `a`。

女孩子们都喜欢结伴吃饭，我现在要找一个人一起吃饭，代码如下：

> 嗯.....女程序员确实是这样，吃个饭也要写代码发请求的。

```javascript
const [ astrid, brooke, calliope ] = [{
    name: 'astrid',
    requirement: '我要吃湘菜'
},{
    name: 'brooke',
    requirement: '我要找10个人一起吃饭'
},{
    name: 'calliope',
    requirement: '我要和男朋友一起吃饭'
}]

// 是否满足Astrid的要求
function isSatisfyAstrid (user) { 
    // ... 省略... 
}

// 是否满足Brooke的要求
function isSatisfyBrooke (user) { 
    // ... 省略... 
}

// 是否满足Calliope的要求
function isSatisfyCalliope (user) { 
    // ... 省略... 
}

function eatDinner () {
    if (isSatisfyAstrid()) {
        console.log(`我可以和 astrid 一起吃晚饭啦`)
    } else if (isSatisfyBrooke()) {
        console.log(`我可以和 brooke 一起吃晚饭啦`)
    } else if (isSatisfyCalliope()) {
        console.log(`我可以和 calliope 一起吃晚饭啦`)
    } else {
        console.log(`哎呀，我要一个人吃晚饭啦`)
    }
}
```

由于 `astrid`、`brooke`、`calliope` 吃晚饭的要求不同，我需要一个个去发起晚餐请求，直到找到答应和我一起吃晚饭的人。

在这里，我假设 `astrid` 的要求是要吃湘菜，`brooke` 的要求是要找 10 个人凑一桌一起吃，`calliope` 的要求是只想和男朋友一起吃饭。

上述代码用 `if-else` 的做法非常死板，假如我又多了个朋友 `davi`，我必须再次修改 `eatDinner` 方法，违反了开放-封闭原则，不易于维护。

下面使用职责链来优化上述代码，代码如下：

```javascript
// 给每个人定义一个职责
const chainOrderA = new Chain(isSatisfyAstrid)
const chainOrderB = new Chain(isSatisfyBrooke)
const chainOrderC = new Chain(isSatisfyCalliope)

// 设置一下职责链的顺序
chainOrderA.setNextSuccessor(chainOrderB)
chainOrderB.setNextSuccessor(chainOrderC)

// 发起请求，这时我只需要向职责链上的第一个人请求
function eatDinner () {
    chainOrder.passRequest() // 发起请求
}
```

将职责作为转入 `Chain` 函数，并通过 `setNextSuccessor` 定义该职责的下一个职责函数，组成一条 `chainOrderA` -> `chainOrderB` -> `chainOrderC` 职责链，这时，我只需要向 `astrid` 发起请求，如果请求失败，将会沿着职责链继续请求，直到找到和我一起吃晚饭的人。

下面将讲述在实际场景中怎么使用职责链模式，怎么实现 `Chain` 方法，请继续往下看。

## 2. 实际场景
### 1. 618 预售商品订单
下周就是 618，电商网站免不得会推出商品预售活动，假设在 618 之前，预付 500 定金，可获得 100 元优惠券，预付 200 元定金，可获得 50 优惠券，未付定金则无优惠券。618 当天的购买事件如下：

#### 1.1 普通做法

先上代码。

> 本文代码仅举例说明，和业务无关。

```
const order = function (orderType) {
    if (orderType === 500) {
        console.log('已预付500定金，享有100优惠券')
    } else if (orderType === 200) {
        console.log('已预付200定金，享有50元优惠券')
    } else {
        console.log('未付定金，无优惠')
    }
}

order(500) // '已预付500定金，享有100优惠券'
```

熟悉的代码，一长段的 `if-else` 判断，不利于维护。

#### 1.2 职责链模式

定义一个职责类 `Chain`。
- 接收一个职责函数 `fn` 作为参数；
- `setNextSuccessor` 指定该职责的下一个职责函数；
- `passRequest` 发起对职责函数 `fn` 的请求；
    - 如果返回结果是`nextSuccesstor`，说明请求失败，继续请求职责链上的下一个职责函数；
    - 如果不是返回 `nextSuccesstor`，说明找到了接收请求的对象，返回请求结果，不再继续执行职责链上的下一个职责函数。

代码如下：

```javascript
const Chain = function(fn) {
  this.fn = fn;
  this.successor = null;
};

Chain.prototype.setNextSuccessor = function(successor) {
  return this.successor = successor;
}

Chain.prototype.passRequest = function() {
  const ret = this.fn.apply(this, arguments)
  if (ret === 'nextSuccessor') {
    return this.successor && this.successor.passRequest.apply(this.successor, arguments);
  }
  return ret;
};
```

然后定义职责类实例，通过 `setNextSuccessor` 组成职责链，代码如下：

```
const order500 = function (orderType) {
  if (orderType === 500) {
      console.log('已预付500定金，享有100优惠券')
  } else {
    return 'nextSuccessor'
  }
} 

const order200 = function (orderType) {
  if (orderType === 200) {
    console.log('已预付200定金，享有50元优惠券')
  } else {
    return 'nextSuccessor'
  }
} 

const chainOrder500 = new Chain(order500)

const chainOrder200 = new Chain(order200)

chainOrder500.setNextSuccessor(chainOrder200)

chainOrder500.passRequest(200)
```

上述代码将 `chainOrder500` 和 `chainOrder200` 组成一条职责链，不管用户是哪种类型，都只需要向 `chainOrder500` 发起请求，如果 `chainOrder500` 无法处理请求，就会继续沿着职责链发起请求，直到找到能处理请求的职责方法。

通过职责链模式，解耦了请求发送者和多个接收者之间的复杂关系，不再需要知道具体哪个接收者来接收发送的请求，只需要向职责链的第一个阶段发起请求。

## 3. 总结

职责链模式，帮助我们管理代码，降低发起请求和接收请求对象之间的耦合。

职责链模式中的节点数量和顺序是可以自由变动的，可以在运行时决定链中包含哪些节点。


可通过 [github源码](https://github.com/jiaozitang/web-learn-note/tree/main/src/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F) 进行实操练习。

希望能对你有所帮助，感谢阅读❤️

---

**· 往期精彩 ·**

[【简单易懂的设计模式（上）】](https://github.com/o2team/o2team.github.io/blob/v2/source/_posts/2021-06-17-design-pattern1.md)

[【简单易懂的设计模式（下）】](https://github.com/o2team/o2team.github.io/blob/v2/source/_posts/2021-06-17-design-pattern2.md)

