title: 手把手教你写个小程序定时器管理库
subtitle: 在小程序使用定时器，一不小心就内存泄漏？不考虑写个定时器管理库管理一下吗？
cover: https://img12.360buyimg.com/img/s3200x2133_jfs/t1/117421/4/10721/1109696/5ef06802E51529f41/1d74c2d5e5d533ed.jpg
categories: Web开发
date: 2020-06-22 12:00:00
tags:
  - 微信小程序
  - 定时器

author:
  nick: 阿集
  github_name: jimczj
wechat:
  share_cover: https://img12.360buyimg.com/img/s3200x2133_jfs/t1/117421/4/10721/1109696/5ef06802E51529f41/1d74c2d5e5d533ed.jpg
  share_title: 手把手教你写个小程序定时器管理库
  share_desc: 在小程序使用定时器，一不小心就内存泄漏？不考虑写个定时器管理库管理一下吗？

---

## 背景
凹凸曼是个小程序开发者，他要在小程序实现秒杀倒计时。于是他不假思索，写了以下代码：

```js
Page({
  init: function () {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      // 倒计时计算逻辑
      console.log('setInterval')
    })
  },
})
```

可是，凹凸曼发现页面隐藏在后台时，定时器还在不断运行。于是凹凸曼优化了一下，在页面展示的时候运行，隐藏的时候就暂停。

```js
Page({
  onShow: function () {
    if (this.timer) {
      this.timer = setInterval(() => {
        // 倒计时计算逻辑
        console.log('setInterval')
      })
    }
  },
  onHide: function () {
    clearInterval(this.timer)
  },
  init: function () {
    clearInterval(this.timer)
    this.timer = setInterval(() => {
      // 倒计时计算逻辑
      console.log('setInterval')
    })
  },
})
```

问题看起来已经解决了，就在凹凸曼开心地搓搓小手暗暗欢喜时，突然发现小程序页面销毁时是不一定会调用 onHide 函数的，这样定时器不就没法清理了？那可是会造成内存泄漏的。凹凸曼想了想，其实问题不难解决，在页面 onUnload 的时候也清理一遍定时器就可以了。

```js
Page({
  ...
  onUnload: function () {
    clearInterval(this.timer)
  },
})
```

这下问题都解决了，但我们可以发现，在小程序使用定时器需要很谨慎，一不小心就会造成内存泄漏。
后台的定时器积累得越多，小程序就越卡，耗电量也越大，最终导致程序卡死甚至崩溃。特别是团队开发的项目，很难确保每个成员都正确清理了定时器。因此，写一个定时器管理库来管理定时器的生命周期，将大有裨益。

## 思路整理

首先，我们先设计定时器的 API 规范，肯定是越接近原生 API 越好，这样开发者可以无痛替换。

```
function $setTimeout(fn, timeout, ...arg) {}
function $setInterval(fn, timeout, ...arg) {}
function $clearTimeout(id) {}
function $clearInterval(id) {}
```

接下来我们主要解决以下两个问题
1. 如何实现定时器暂停和恢复
2. 如何让开发者无须在生命周期函数处理定时器

## 如何实现定时器暂停和恢复

思路如下:
1. 将定时器函数参数保存，恢复定时器时重新创建
2. 由于重新创建定时器，定时器 ID 会不同，因此需要自定义全局唯一 ID 来标识定时器
3. 隐藏时记录定时器剩余倒计时时间，恢复时使用剩余时间重新创建定时器

首先我们需要定义一个 Timer 类，Timer 对象会存储定时器函数参数，代码如下

```js
class Timer {
    static count = 0
    /**
     * 构造函数
     * @param {Boolean} isInterval 是否是 setInterval
     * @param {Function} fn 回调函数
     * @param {Number} timeout 定时器执行时间间隔
     * @param  {...any} arg 定时器其他参数
     */
    constructor (isInterval = false, fn = () => {}, timeout = 0, ...arg) {
        this.id = ++Timer.count // 定时器递增 id
        this.fn = fn
        this.timeout = timeout
        this.restTime = timeout // 定时器剩余计时时间
        this.isInterval = isInterval
        this.arg = arg
    }
  }
  
  // 创建定时器
  function $setTimeout(fn, timeout, ...arg) {
    const timer = new Timer(false, fn, timeout, arg)
    return timer.id
  }
```

接下来，我们来实现定时器的暂停和恢复，实现思路如下：
1. 启动定时器，调用原生 API 创建定时器并记录下开始计时时间戳。
2. 暂停定时器，清除定时器并计算该周期计时剩余时间。
3. 恢复定时器，重新记录开始计时时间戳，并使用剩余时间创建定时器。

代码如下：
```
class Timer {
    constructor (isInterval = false, fn = () => {}, timeout = 0, ...arg) {
        this.id = ++Timer.count // 定时器递增 id
        this.fn = fn
        this.timeout = timeout
        this.restTime = timeout // 定时器剩余计时时间
        this.isInterval = isInterval
        this.arg = arg
    }

    /**
     * 启动或恢复定时器
     */
    start() {
        this.startTime = +new Date()

        if (this.isInterval) {
            /* setInterval */
            const cb = (...arg) => {
                this.fn(...arg)
                /* timerId 为空表示被 clearInterval */
                if (this.timerId) this.timerId = setTimeout(cb, this.timeout, ...this.arg)
            }
            this.timerId = setTimeout(cb, this.restTime, ...this.arg)
            return
        }
        /* setTimeout  */
        const cb = (...arg) => {
            this.fn(...arg)
        }
        this.timerId = setTimeout(cb, this.restTime, ...this.arg)
    }
    
    /* 暂停定时器 */
    suspend () {
        if (this.timeout > 0) {
            const now = +new Date()
            const nextRestTime = this.restTime - (now - this.startTime)
            const intervalRestTime = nextRestTime >=0 ? nextRestTime : this.timeout - (Math.abs(nextRestTime) % this.timeout)
            this.restTime = this.isInterval ? intervalRestTime : nextRestTime
        }
        clearTimeout(this.timerId)
    }
}
```
其中，有几个关键点需要提示一下：
1. 恢复定时器时，实际上我们是重新创建了一个定时器，如果直接用 setTimeout 返回的 ID 返回给开发者，开发者要 clearTimeout，这时候是清除不了的。因此需要在创建 Timer 对象时内部定义一个全局唯一 ID `this.id = ++Timer.count`，将该 ID 返回给 开发者。开发者 clearTimeout 时，我们再根据该 ID 去查找真实的定时器 ID (this.timerId)。
2. 计时剩余时间，timeout = 0 时不必计算；timeout > 0 时，需要区分是 setInterval 还是 setTimeout，setInterval 因为有周期循环，因此需要对时间间隔进行取余。
3. setInterval 通过在回调函数末尾调用 setTimeout 实现，清除定时器时，要在定时器增加一个标示位（this.timeId = ""）表示被清除，防止死循环。

我们通过实现 Timer 类完成了定时器的暂停和恢复功能，接下来我们需要将定时器的暂停和恢复功能跟组件或页面的生命周期结合起来，最好是抽离成公共可复用的代码，让开发者无须在生命周期函数处理定时器。翻阅小程序官方文档，发现 Behavior 是个不错的选择。 

## Behavior 

behaviors 是用于组件间代码共享的特性，类似于一些编程语言中的 "mixins" 或 "traits"。
每个 behavior 可以包含一组属性、数据、生命周期函数和方法，组件引用它时，它的属性、数据和方法会被合并到组件中，生命周期函数也会在对应时机被调用。每个组件可以引用多个 behavior，behavior 也可以引用其他 behavior 。

```
// behavior.js 定义behavior
const TimerBehavior = Behavior({
  pageLifetimes: {
    show () { console.log('show') },
    hide () { console.log('hide') }
  },
  created: function () { console.log('created')},
  detached: function() { console.log('detached') }
})

export { TimerBehavior }

// component.js 使用 behavior
import { TimerBehavior } from '../behavior.js'

Component({
  behaviors: [TimerBehavior],
  created: function () {
    console.log('[my-component] created')
  },
  attached: function () { 
    console.log('[my-component] attached')
  }
})
```

如上面的例子，组件使用 TimerBehavior 后，组件初始化过程中，会依次调用 `TimerBehavior.created() => Component.created() => TimerBehavior.show()`。
因此，我们只需要在 TimerBehavior 生命周期内调用 Timer 对应的方法，并开放定时器的创建销毁 API 给开发者即可。
思路如下：
1. 组件或页面创建时，新建 Map 对象来存储该组件或页面的定时器。
2. 创建定时器时，将 Timer 对象保存在 Map 中。
3. 定时器运行结束或清除定时器时，将 Timer 对象从 Map 移除，避免内存泄漏。
4. 页面隐藏时将 Map 中的定时器暂停，页面重新展示时恢复 Map 中的定时器。

```
const TimerBehavior = Behavior({
  created: function () {
    this.$store = new Map()
    this.$isActive = true
  },
  detached: function() {
    this.$store.forEach(timer => timer.suspend())
    this.$isActive = false
  },
  pageLifetimes: {
    show () { 
      if (this.$isActive) return

      this.$isActive = true
      this.$store.forEach(timer => timer.start(this.$store))
    },
    hide () { 
      this.$store.forEach(timer => timer.suspend())
      this.$isActive = false
    }
  },
  methods: {
    $setTimeout (fn = () => {}, timeout = 0, ...arg) {
      const timer = new Timer(false, fn, timeout, ...arg)
      
      this.$store.set(timer.id, timer)
      this.$isActive && timer.start(this.$store)
      
      return timer.id
    },
    $setInterval (fn = () => {}, timeout = 0, ...arg) {
      const timer = new Timer(true, fn, timeout, ...arg)
      
      this.$store.set(timer.id, timer)
      this.$isActive && timer.start(this.$store)
      
      return timer.id
    },
    $clearInterval (id) {
      const timer = this.$store.get(id)
      if (!timer) return

      clearTimeout(timer.timerId)
      timer.timerId = ''
      this.$store.delete(id)
    },
    $clearTimeout (id) {
      const timer = this.$store.get(id)
      if (!timer) return

      clearTimeout(timer.timerId)
      timer.timerId = ''
      this.$store.delete(id)
    },
  }
})
```
上面的代码有许多冗余的地方，我们可以再优化一下，单独定义一个 TimerStore 类来管理组件或页面定时器的添加、删除、恢复、暂停功能。

```js
class TimerStore {
    constructor() {
        this.store = new Map()
        this.isActive = true
    }

    addTimer(timer) {
        this.store.set(timer.id, timer)
        this.isActive && timer.start(this.store)

        return timer.id
    }

    show() {
        /* 没有隐藏，不需要恢复定时器 */
        if (this.isActive) return

        this.isActive = true
        this.store.forEach(timer => timer.start(this.store))
    }

    hide() {
        this.store.forEach(timer => timer.suspend())
        this.isActive = false
    }

    clear(id) {
        const timer = this.store.get(id)
        if (!timer) return

        clearTimeout(timer.timerId)
        timer.timerId = ''
        this.store.delete(id)
    }
}
```

然后再简化一遍 TimerBehavior

```
const TimerBehavior = Behavior({
  created: function () { this.$timerStore = new TimerStore() },
  detached: function() { this.$timerStore.hide() },
  pageLifetimes: {
    show () { this.$timerStore.show() },
    hide () { this.$timerStore.hide() }
  },
  methods: {
    $setTimeout (fn = () => {}, timeout = 0, ...arg) {
      const timer = new Timer(false, fn, timeout, ...arg)
      
      return this.$timerStore.addTimer(timer)
    },
    $setInterval (fn = () => {}, timeout = 0, ...arg) {
      const timer = new Timer(true, fn, timeout, ...arg)
      
      return this.$timerStore.addTimer(timer)
    },
    $clearInterval (id) {
      this.$timerStore.clear(id)
    },
    $clearTimeout (id) {
      this.$timerStore.clear(id)
    },
  }
})
```
此外，setTimeout 创建的定时器运行结束后，为了避免内存泄漏，我们需要将定时器从 Map 中移除。稍微修改下 Timer 的 start 函数，如下：

```js
class Timer {
    // 省略若干代码
    start(timerStore) {
        this.startTime = +new Date()

        if (this.isInterval) {
            /* setInterval */
            const cb = (...arg) => {
                this.fn(...arg)
                /* timerId 为空表示被 clearInterval */
                if (this.timerId) this.timerId = setTimeout(cb, this.timeout, ...this.arg)
            }
            this.timerId = setTimeout(cb, this.restTime, ...this.arg)
            return
        }
        /* setTimeout  */
        const cb = (...arg) => {
            this.fn(...arg)
            /* 运行结束，移除定时器，避免内存泄漏 */
            timerStore.delete(this.id)
        }
        this.timerId = setTimeout(cb, this.restTime, ...this.arg)
    }
}
```

## 愉快地使用

从此，把清除定时器的工作交给 TimerBehavior 管理，再也不用担心小程序越来越卡。

```
import { TimerBehavior } from '../behavior.js'

// 在页面中使用
Page({
  behaviors: [TimerBehavior],
  onReady() {
    this.$setTimeout(() => {
      console.log('setTimeout')
    })
    this.$setInterval(() => {
      console.log('setTimeout')
    })
  }
})

// 在组件中使用
Components({
  behaviors: [TimerBehavior],
  ready() {
    this.$setTimeout(() => {
      console.log('setTimeout')
    })
    this.$setInterval(() => {
      console.log('setTimeout')
    })
  }
})
```

## npm 包支持

为了让开发者更好地使用小程序定时器管理库，我们整理了代码并发布了 npm 包供开发者使用，开发者可以通过 `npm install --save timer-miniprogram` 安装小程序定时器管理库，文档及完整代码详看 https://github.com/o2team/timer-miniprogram

## eslint 配置

为了让团队更好地遵守定时器使用规范，我们还可以配置 eslint 增加代码提示，配置如下：

```
// .eslintrc.js
module.exports = {
    'rules': {
        'no-restricted-globals': ['error', {
            'name': 'setTimeout',
            'message': 'Please use TimerBehavior and this.$setTimeout instead. see the link: https://github.com/o2team/timer-miniprogram'
        }, {
            'name': 'setInterval',
            'message': 'Please use TimerBehavior and this.$setInterval instead. see the link: https://github.com/o2team/timer-miniprogram'
        }, {
            'name': 'clearInterval',
            'message': 'Please use TimerBehavior and this.$clearInterval instead. see the link: https://github.com/o2team/timer-miniprogram'
        }, {
            'name': 'clearTimout',
            'message': 'Please use TimerBehavior and this.$clearTimout  instead. see the link: https://github.com/o2team/timer-miniprogram'
        }]
    }
}
```

## 总结

千里之堤，溃于蚁穴。

管理不当的定时器，将一点点榨干小程序的内存和性能，最终让程序崩溃。

重视定时器管理，远离定时器泄露。

## 参考
[小程序开发者文档](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/behaviors.html) 