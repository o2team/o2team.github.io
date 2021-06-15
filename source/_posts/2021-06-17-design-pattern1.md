---
title: 简单易懂的设计模式（上）
date: 2021-06-17 19:11:14
tags: ['前端', '设计模式']
---

![](https://img30.360buyimg.com/ling/jfs/t1/187775/5/8271/435193/60c8117eE7d79ef41/1d21db2c4dca9a90.png)

设计模式（上）将介绍单例模式、策略模式、代理模式 3 个常用设计模式，使用单例模式实现登录弹窗、策略模式实现表单校验、代理模式实现图片预加载等需求，将设计模式落地到实际需求，带你彻底弄懂设计模式。

# 单例模式

## 一、什么是单例模式
单例模式的定义是，保证一个类仅有一个实例，并提供一个访问它的全局访问点。

有一些对象，比如线程池/全局缓存/浏览器中的 `window` 对象等等，我们就只需要一个实例。

下面将根据实际场景进行介绍。

## 二、实际场景

### 1. 登录浮窗

当我们单击登录按钮时，页面中会出现一个登录的浮窗，而这个登录浮窗是唯一的，无论单击多少次登录按钮，这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。

#### 1.1 传统做法

传统做法在页面加载完成时，就创建好登录浮窗，当用户点击登录按钮时，显示登录浮窗，实现代码如下：
```html
<button id="loginBtn">登录</button>
```

```javascript
var loginLayer = (() => {
	let div = document.createElement('div')
	div.innerHTML = '我是登录弹窗'
	div.style.display = 'none'

	document.body.appendChild(div)

	return div
})()

document.getElementById('loginBtn').onclick = () => {
	loginLayer.style.display = 'block'
}

```

上述代码有以下缺点：

1. 在无需登录的情况下，也会新增登录浮窗的 `DOM` 节点，浪费性能。

现在优化一下，将代码改为，在用户点击登录按钮后，才新增登录浮窗的 `DOM` 节点。

代码如下：

```javascript
var createLoginLayer = () => {
	let div = document.createElement('div')
	div.innerHTML = '我是登录弹窗'
	div.style.display = 'none'

	document.body.appendChild(div)

	return div
}

document.getElementById('loginBtn').onclick = () => {
	const loginLayer = createLoginLayer()
	loginLayer.style.display = 'block'
}

```

上述代码也存在缺陷，具体如下：

1. 每次点击登录按钮，都会创建一个登录浮窗，频繁的创建 `DOM` 节点更加浪费性能。

实际上，我们只需要创建一次登录浮窗。

#### 1.2 单例模式

通过单例模式，重构上述代码。

```javascript
const createLoginLayer = () => {
	const div = document.createElement('div')
	div.innerHTML = '我是登录弹窗'
	div.style.display = 'none'
	console.log(123)

	document.body.appendChild(div)
	return div
}

const createSingle = (function () {
	var instance = {}
	return function (fn) {
		if (!instance[fn.name]) {
			instance[fn.name] = fn.apply(this, arguments)
		}
		return instance[fn.name]
	}
})()

const createIframe = function () {
	const iframe = document.createElement('iframe')
	document.body.appendChild(iframe)
	iframe.style.display = 'none'
	return iframe
}

const createSingleLoginLayer = createSingle(createLoginLayer)
const createSingleIframe = createSingle(createIframe)

document.getElementById('loginBtn').onclick = () => {
	const loginLayer = createSingleLoginLayer
	const iframe = createSingleIframe
	loginLayer.style.display = 'block'
	iframe.style.display = 'block'
}

```

经过重构，代码做了以下优化：

1. 将创建实例对象 `createLoginLayer` / `createIframe` 的职责和管理单例对象 `createSingle` 的职责分离，符合单一职责原则；
2. 通过闭包存储实例，并进行判断，不管点击登录按钮多少次，**只创建一个登录浮窗实例**；
3. 易于扩展，当下次需要创建页面中唯一的 `iframe` / `script` 等其他标签时，可以直接复用该逻辑。


## 三、总结

单例模式是一种简单但非常实用的模式，特别是惰性单例技术，在合适的时候才创建对象，并且只创建唯一的一个。更奇妙的是，创建对象和管理单例的职责被分布在两个不同的方法中，这两个方法组合起来才具有单例模式的威力。


# 策略模式

## 一、什么是策略模式

当我们计划国庆出去游玩时，在交通方式上，我们可以选择贵而快的**飞机**、价格中等但稍慢的**动车**、便宜但超级慢的**火车**，根据不同的人，选择对应的交通方式，且可以随意更换交通方式，这就是**策略模式**。

策略模式的定义是，定义一系列算法，把它们一个个封装起来，并且使它们可以相互替换。
## 二、实际场景
### 1. 计算年终奖
#### 1.1 传统做法

有一个计算员工年终奖的需求，假设，绩效为 `S` 的员工年终奖是 `4` 倍工资，绩效为 `A` 的员工年终奖是 `3` 倍工资，绩效为 `B` 的员工年终奖是 `2` 倍工资，下面我们来计算员工的年终奖。

```javascript
var calculateBonus = function(performanceLevel, salary) {
	if (performanceLevel === 'S') {
		return salary * 4;
	}
	if (performanceLevel === 'A') {
		return salary * 3;
	}
	if (performanceLevel === 'B') {
		return salary * 2;
	}
};

calculateBonus('B', 20000); // 输出：40000 
calculateBonus( 'S', 6000 ); // 输出：24000

```

上述代码有以下缺点：
1. 使用 `if-else` 语句描述逻辑，代码庞大；
2. 缺乏弹性，如果需要修改绩效 `S` 的奖金系数，必须修改 `calculateBonus` 函数，违反了开放-封闭原则；
3. 无法再次复用，当其他地方需要用到这套逻辑，只能再复制一份。

#### 1.2 策略模式做法

使用策略模式改良后


```javascript
const strategies = {
	S: salary => {
		return salary * 4
	},
	A: salary => {
		return salary * 3
	},
	B: salary => {
		return salary * 2
	}
}

const calculateBonus = (level, salary) => {
	return strtegies[level](salary)
}

console.log(calculateBonus('s', 20000))
console.log(calculateBonus('a', 10000))
```

可以看到上述代码做了以下改动：
1. 策略类 `strategies` 封装了具体的算法和计算过程（每种绩效的计算规则）；
2. 环境类 `calculateBonus` 接受请求，把请求委托给策略类 `strategies`（员工的绩效和工资；
3. 将算法的使用和算法的实现分离，代码清晰，职责分明；
4. 消除大量的 `if-else` 语句。

#### 1.3 小结
策略模式使代码可读性更高，易于拓展更多的策略算法。当绩效系数改变，或者绩效等级增加，我们只需要为 `strategies` 调整或新增算法，符合开放-封闭原则。

### 2. 表单校验
当网页上的表单需要校验输入框/复选框等等规则时，如何去实现呢？

现在有一个注册用户的表单需求，在提交表单之前，需要验证以下规则：
1. 用户名不能为空
2. 密码长度不能少于 6 位
3. 手机号码必须符合格式

#### 2.1 传统做法

使用 `if-else` 语句判断表单输入是否符合对应规则，如不符合，提示错误原因。
```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	<form id='registerForm' action="xxx" method="post">
		用户名：<input type="text" name="userName">
		密码：<input type="text" name="password">
		手机号：<input type="text" name="phone">
		<button>提交</button>
	</form>
	<script type="text/javascript">
        let registerForm = document.getElementById('registerForm')

        registerForm.onsubmit = () => {
                if (registerForm.userName.value) {
                        alert('用户名不能为空')
                        return false
                }

                if (registerForm.password.value.length < 6) {
                        alert('密码长度不能少于6')
                        return false
                }

                if (!/(^1[3|5|8][0-9]$)/.test(registerForm.phone.value)) {
                        alert('手机号码格式不正确')
                        return false
                }
        }
        </script>
</body>
</html>
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79ee768a229842e6a377534d4ea0fef2~tplv-k3u1fbpfcp-watermark.image)

上述代码有以下缺点：
- `onsubmit` 函数庞大，包含大量 `if-else` 语句；
- `onsubmit` 缺乏弹性，当有规则需要调整，或者需要新增规则时，需要改动 `onsubmit` 函数内部，违反开放-封闭原则；
- 算法复用性差，只能通过复制，复用到其他表单。

#### 2.2 策略模式做法
使用策略模式重构上述代码。

```html
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	
	<form action="http://xxx.com/register" id="registerForm" method="post">
		 请输入用户名：
		<input type="text" name="userName" />
		 请输入密码：
		<input type="text" name="password" />
		 请输入手机号码：
		<input type="text" name="phoneNumber" />
		<button>
			提交
		</button>
	</form>
	<script type="text/javascript" src="index.js">
		
	</script>            
</body>  
</html>
```

```javascript
// 表单dom
const registerForm = document.getElementById('registerForm')

// 表单规则
const rules = {
    userName: [
        {
            strategy: 'isNonEmpty',
            errorMsg: '用户名不能为空'
        },
        {
            strategy: 'minLength:10',
            errorMsg: '用户名长度不能小于10位'
        }	
    ],
    password: [
        {
            strategy: 'minLength:6',
            errorMsg: '密码长度不能小于6位'
        }
    ],
    phoneNumber: [
        {
            strategy: 'isMobile',
            errorMsg: '手机号码格式不正确'
        }
    ]
}

// 策略类
var strategies = {
    isNonEmpty: function(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
     minLength: function(value, errorMsg, length) {
        console.log(length)
        if (value.length < length) {
            return errorMsg;
        }
    },
     isMobile: function(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};

// 验证类
const Validator = function () {
    this.cache = []
}

// 添加验证方法
Validator.prototype.add = function ({ dom, rules}) {
    rules.forEach(rule => {
        const { strategy, errorMsg } = rule
        console.log(rule)
        const [ strategyName, strategyCondition ] = strategy.split(':')
        console.log(strategyName)
        const { value } = dom
        this.cache.push(strategies[strategyName].bind(dom, value, errorMsg, strategyCondition))
    })
}

// 开始验证
Validator.prototype.start = function () {
    let errorMsg
    this.cache.some(cacheItem => {
            const _errorMsg = cacheItem()
            if (_errorMsg) {
                    errorMsg = _errorMsg
                    return true
            } else {
                    return false
            }
    })

    return errorMsg
}

// 验证函数
const validatorFn = () => {
    const validator = new Validator()
    console.log(validator.add)

    Object.keys(rules).forEach(key => {
        console.log(2222222, rules[key])
        validator.add({
            dom: registerForm[key],
            rules: rules[key]
        })
    })

    const errorMsg = validator.start()
    return errorMsg
}


// 表单提交
registerForm.onsubmit = () => {
    const errorMsg = validatorFn()
    if (errorMsg) {
        alert(errorMsg)
        return false
    }
    return false
}
```

上述代码通过 `strategies` 定义规则算法，通过 `Validator` 定义验证算法，将规则和算法分离，我们仅仅通过配置的方式就可以完成表单的校验，这些校验规则也可以复用在程序的任何地方，还能作为插件的形式，方便的被移植到其他项目中。

## 三、总结

策略模式是一种常用且有效的设计模式，通过上述例子，可以总结出策略模式的一些优点：
- 策略模式利用组合/委托和多态等技术和思想，可以有效的避免多重条件选择语句；
- 策略模式提供了对开放-封闭原则的完美支持，将算法封装中独立的策略类中，使得它们易于切换/理解/扩展；
- 在策略模式中利用组合和委托来让 `Context` 拥有执行算法的能力，这也是继承的一种更轻便的代替方案。


# 代理模式

## 一、什么是代理模式
代理模式是为一个对象提供一个代用品或占位符，以便控制对它的访问。

代理模式的关键是，当客户不方便直接访问一个对象或者不满足需要的时候，提供一个替身对象来控制对这个对象的访问，客户实际上访问的是替身对象。

## 二、模拟场景

### 1. 小明送花给小白

#### 1.1 传统做法

传统做法是小明直接把花送给小白，小白接收到花，代码如下：

```javascript
const Flower = function () {
	return '玫瑰🌹'
}

const xiaoming = {
	sendFlower: target => {
		const flower = new Flower()
		target.receiveFlower(flower)
	}
}

const xiaobai = {
	receiveFlower: flower => {
		console.log('收到花', flower)
	}
}

xiaoming.sendFlower(xiaobai)
```

#### 1.2 代理模式

但是，小明并不认识小白，他想要通过小代，帮他打探小白的情况，在小白心情好的时候送花，这样成功率更高。代码如下：

```javascript
const Flower = function () {
	return '玫瑰🌹'
}

const xiaoming = {
	sendFlower: target => {
		const flower = new Flower()
		target.receiveFlower(flower)
	}
}

const xiaodai = {
	receiveFlower: flower => {
		xiaobai.listenGoodMood().then(() => {
			xiaobai.receiveFlower(flower)
		})
	}
}

const xiaobai = {
	receiveFlower: flower => {
		console.log('收到花', flower)
	},
	listenGoodMood: fn => {
		return new Promise((reslove, reject) => {
			// 10秒后，心情变好
			reslove()
		})
	}
}

xiaoming.sendFlower(xiaodai)
```

以上，小明通过小代，监听到小白心情的心情变化，选择在小白心情好时送花给小白。不仅如此，小代还可以做以下事情：

1. 帮助小白过滤掉一些送花的请求，这就叫做保护代理；
2. 帮助小明，在小白心情好时，再执行买花操作，这就叫做虚拟代理。虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。

## 三、实际场景

### 1. 图片预加载
图片预加载时一种常见的技术，如果直接给 img 标签节点设置 src 属性，由于图片过大或网络不佳，图片的位置往往有一段时间时空白。

#### 1.1 传统做法
```javascript
const myImage = (() => {
	const imgNode = document.createElement('img')
	document.body.appendChild(imgNode)

	return {
		setSrc: src => {
			imgNode.src = src
		}
	}
})()

myImage.setSrc('https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa98e67c4708449eb6894c7133d93774~tplv-k3u1fbpfcp-watermark.image')

```

通过开发者工具把网速设置为 5kb/s 时，会发现在很长一段时间内，图片位置是空白的。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7193891407714367afb2f7092d277544~tplv-k3u1fbpfcp-watermark.image)
#### 1.2 虚拟代理

下面用虚拟代理优化该功能，把加载图片的操作交给代理函数完成，在图片加载时，先用一张loading 图占位，当图片加载成功后，再把它填充进 img 节点。

代码如下：

```javascript
const myImage = (() => {
	const imgNode = document.createElement('img')
	document.body.appendChild(imgNode)

	return {
		setSrc: src => {
			imgNode.src = src
		}
	}
})()

const loadingSrc = '../../../../img/loading.gif'
const imgSrc = 'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fa98e67c4708449eb6894c7133d93774~tplv-k3u1fbpfcp-watermark.image'

const proxyImage = (function () {
	const img = new Image()
	img.onload = () => {
		myImage.setSrc(img.src)
	}

	return {
		setSrc: src => {
			myImage.setSrc(loadingSrc)
			img.src = src
		}
	}
})()

proxyImage.setSrc(imgSrc)
```

上述代码有以下优点：

1. 通过 `proxyImage` 控制了对 `MyImage` 的访问，在 `MyImage` 未加载成功之前，使用 `loading` 图占位；

2. 践行单一职责原则，给 `img` 节点设置 `src` 的函数 `MyImage`，预加载图片的函数 `proxyImage`，都只有一个职责；

3. 践行开放-封闭原则，给 `img` 节点设置 `src` 和预加载图片的功能，被隔离在两个对象里，它们可以各自变化不影响对方。

### 2. 合并HTTP请求

假设我们要实现一个同步文件的功能，通过复选框，当复选框选中的时候，将该复选框对应的 id 传给服务器，告诉服务器需要同步 id 对应的文件。

思考一下，会发现，如果每选中一个复选框，就请求一次接口，假设 1s 内选中了 10 个复选框，那么就要发送 10 次请求。

#### 2.1 虚拟代理
可以通过虚拟代理来优化上述做法，新增一个代理，帮助复选框发起同步文件的请求，收集在这 1s 内的请求，1s 后再一起把这些文件 id 发送到服务器。

代码如下：

```html
<!DOCTYPE html>
<html>
<meta charset="utf-8" />
<head>
	<title></title>
</head>
<body>
  a <input type="checkbox" value="a" />
  b <input type="checkbox" value="b" />
  c <input type="checkbox" value="c" />
  d <input type="checkbox" value="d" />
	<script type="text/javascript" src="index.js">
	</script>
</body> 
</html>
```

```javascript
const synchronousFile = cache => {
  console.log('开始同步文件，id为：'+ cache.join('/'))
}

const proxySynchronousFile = (() => {
  const cache = []

  let timer

  return id => {
    console.log(id)
    cache.push(id)

    if (timer) {
      return
    }

    timer = setTimeout(() => {
      synchronousFile(cache)
      clearTimeout(timer)
      timer = null
      cache.length = 0
    }, 2000)
  }
})()

const checkbox = document.getElementsByTagName('input')

Array.from(checkbox).forEach(i => {
  console.log(i)
  i.onclick = () => {
    if (i.checked) {
      proxySynchronousFile(i.value)
    }
  }
})


```

### 3. ajax异步请求数据

在列表需要分页时，同一页的数据理论上只需要去后台拉取一次，可以把这些拉取过的数据缓存下来，下次请求时直接使用缓存数据。

#### 3.1 缓存代理

使用缓存代理实现上述功能，代码如下：

```javascript
(async function () {
  function getArticle (currentPage, pageSize) {
    console.log('getArticle', currentPage, pageSize)
    // 模拟一个ajax请求
    return new Promise((resolve, reject) => {
      resolve({
        ok: true,
        data: {
          list: [],
          total: 10,
          params: {
            currentPage, 
            pageSize
          }
        }
      })
    })
  }
  
  const proxyGetArticle = (() => {
    const caches = []
  
    return async (currentPage, pageSize) => {
  
      const cache = Array.prototype.join.call([currentPage, pageSize],',')
  
      if (cache in caches) {
        return caches[cache]
      }
      const { data, ok } = await getArticle(currentPage, pageSize)
  
      if (ok) {
        caches[cache] = data
      }
  
      return caches[cache]
    }
  })()

  // 搜索第一页
  await proxyGetArticle(1, 10)
  
  // 搜索第二页
  await proxyGetArticle(2, 10)

  // 再次搜索第一页
  await proxyGetArticle(1, 10)
  
})()


```
通过缓存代理，在第二次请求第一页的数据时，直接在缓存数据中拉取，无须再次从服务器请求数据。


## 四、总结

上面根据实际场景介绍了虚拟代理和缓存代理的做法。

当我们不方便直接访问某个对象时，找一个代理方法帮我们去访问该对象，这就是代理模式。

可通过 [github源码](https://github.com/jiaozitang/web-learn-note/tree/main/src/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F) 进行实操练习。

希望本文能对你有所帮助，感谢阅读❤️～

---

**· 往期精彩 ·**

[【简单易懂的设计模式（上）】](https://github.com/o2team/o2team.github.io/blob/v2/source/_posts/2021-06-17-design-pattern1.md)

[【简单易懂的设计模式（下）】](https://github.com/o2team/o2team.github.io/blob/v2/source/_posts/2021-06-17-design-pattern2.md)
)


