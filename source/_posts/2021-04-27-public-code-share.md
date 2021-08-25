title: React代码共享最佳实践方式
subtitle: 探索与对比 React 代码共享的通用方式
cover: https://img20.360buyimg.com/ling/s345x208_jfs/t1/158193/9/16357/150319/6065311eE3b6ffea8/9e6074c743aa7a17.png
categories: React
tags:
 - React 
 - render props 
 - HOC 
 - React Hook 
 - mixins
author:
  nick: huanglvming
  github_name: huanglvming
date: 2021-04-27 11:08:00

---

任何一个项目发展到一定复杂性的时候，必然会面临逻辑复用的问题。在`React`中实现逻辑复用通常有以下几种方式：`Mixin`、`高阶组件(HOC)`、`修饰器(decorator)`、`Render Props`、`Hook`。本文主要就以上几种方式的优缺点作分析，帮助开发者针对业务场景作出更适合的方式。

## Mixin

这或许是刚从`Vue`转向`React`的开发者第一个能够想到的方法。`Mixin`一直被广泛用于各种面向对象的语言中，**其作用是为单继承语言创造一种类似多重继承的效果**。虽然现在`React`已将其放弃中，但`Mixin`的确曾是`React`实现代码共享的一种设计模式。

广义的 mixin 方法，就是用赋值的方式将 mixin 对象中的方法都挂载到原对象上，来实现对象的混入，类似 ES6 中的 Object.assign()的作用。原理如下：

```js
const mixin = function (obj, mixins) {
  const newObj = obj
  newObj.prototype = Object.create(obj.prototype)

  for (let prop in mixins) {
    // 遍历mixins的属性
    if (mixins.hasOwnPrototype(prop)) {
      // 判断是否为mixin的自身属性
      newObj.prototype[prop] = mixins[prop]; // 赋值
    }
  }
  return newObj
};
```

### 在 React 中使用 Mixin

假设在我们的项目中，多个组件都需要设置默认的`name`属性，使用`mixin`可以使我们不必在不同的组件里写多个同样的`getDefaultProps`方法，我们可以定义一个`mixin`：

```js
const DefaultNameMixin = {
  getDefaultProps: function () {
    return {
      name: "Joy"
    }
  }
}
```

为了使用`mixin`，需要在组件中加入`mixins`属性，然后把我们写好的`mixin`包裹成一个数组，将它作为`mixins`的属性值：

```js
const ComponentOne = React.createClass({
  mixins: [DefaultNameMixin]
  render: function () {
    return <h2>Hello {this.props.name}</h2>
  }
})
```

**写好的`mixin`可以在其他组件里重复使用。**

由于`mixins`属性值是一个数组，意味着我们**可以同一个组件里调用多个`mixin`**。在上述例子中稍作更改得到：

```js
const DefaultFriendMixin = {
  getDefaultProps: function () {
    return {
      friend: "Yummy"
    }
  }
}

const ComponentOne = React.createClass({
  mixins: [DefaultNameMixin, DefaultFriendMixin]
  render: function () {
    return (
      <div>
        <h2>Hello {this.props.name}</h2>
        <h2>This is my friend {this.props.friend}</h2>
      </div>
    )
  }
})
```

**我们甚至可以在一个`mixin`里包含其他的`mixin`**。

比如写一个新的` mixin``DefaultProps `包含以上的`DefaultNameMixin`和`DefaultFriendMixin `：

```js
const DefaultPropsMixin = {
  mixins: [DefaultNameMixin, DefaultFriendMixin]
}

const ComponentOne = React.createClass({
  mixins: [DefaultPropsMixin]
  render: function () {
    return (
      <div>
        <h2>Hello {this.props.name}</h2>
        <h2>This is my friend {this.props.friend}</h2>
      </div>
    )
  }
})
```

至此，我们可以总结出`mixin`至少拥有以下优势:

- **可以在多个组件里使用相同的`mixin`**；
- **可以在同一个组件里使用多个`mixin`**；
- **可以在同一个`mixin`里嵌套多个`mixin`**；

但是在不同场景下，优势也可能变成劣势：

- **破坏原有组件的封装，可能需要去维护新的`state`和`props`等状态**；
- **不同`mixin`里的命名不可知，非常容易发生冲突**；
- **可能产生递归调用问题，增加了项目复杂性和维护难度**；

除此之外，`mixin`在状态冲突、方法冲突、多个生命周期方法的调用顺序等问题拥有自己的处理逻辑。感兴趣的同学可以参考一下以下文章：

- [React Mixin 的使用](https://segmentfault.com/a/1190000003016446)
- [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)

## 高阶组件

由于`mixin`存在上述缺陷，故`React`剥离了`mixin`，改用`高阶组件`来取代它。

**`高阶组件`本质上是一个函数，它接受一个组件作为参数，返回一个新的组件**。

`React`官方在实现一些公共组件时，也用到了`高阶组件`，比如`react-router`中的`withRouter`，以及`Redux`中的`connect`。在这以`withRouter`为例。

默认情况下，必须是经过`Route`路由匹配渲染的组件才存在`this.props`、才拥有`路由参数`、才能使用`函数式导航`的写法执行`this.props.history.push('/next')`跳转到对应路由的页面。`高阶组件`中的`withRouter`作用是将一个没有被`Route`路由包裹的组件，包裹到`Route`里面，从而将`react-router`的三个对象`history`、`location`、`match`放入到该组件的`props`属性里，因此能实现`函数式导航跳转`。

`withRouter`的实现原理：

```js
const withRouter = (Component) => {
  const displayName = `withRouter(${Component.displayName || Component.name})`
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props
    return (
      <RouterContext.Consumer>
        {context => {
          invariant(
            context,
            `You should not use <${displayName} /> outside a <Router>`
          );
          return (
            <Component
              {...remainingProps}
              {...context}
              ref={wrappedComponentRef}
            />
          )
        }}
      </RouterContext.Consumer>
    )
}
```

使用代码：

```js
import React, { Component } from "react"
import { withRouter } from "react-router"
class TopHeader extends Component {
  render() {
    return (
      <div>
        导航栏
        {/* 点击跳转login */}
        <button onClick={this.exit}>退出</button>
      </div>
    )
  }

  exit = () => {
    // 经过withRouter高阶函数包裹，就可以使用this.props进行跳转操作
    this.props.history.push("/login")
  }
}
// 使用withRouter包裹组件，返回history,location等
export default withRouter(TopHeader)
```

由于`高阶组件`的本质是`获取组件并且返回新组件的方法`，所以理论上它也可以像`mixin`一样实现多重嵌套。

例如：

写一个赋能唱歌的高阶函数

```js
import React, { Component } from 'react'

const widthSinging = WrappedComponent => {
	return class HOC extends Component {
		constructor () {
			super(...arguments)
			this.singing = this.singing.bind(this)
		}

		singing = () => {
			console.log('i am singing!')
		}

		render() {
			return <WrappedComponent />
		}
	}
}
```

写一个赋能跳舞的高阶函数

```js
import React, { Component } from 'react'

const widthDancing = WrappedComponent => {
	return class HOC extends Component {
		constructor () {
			super(...arguments)
			this.dancing = this.dancing.bind(this)
		}

		dancing = () => {
			console.log('i am dancing!')
		}

		render() {
			return <WrappedComponent />
		}
	}
}
```

使用以上高阶组件

```js
import React, { Component } from "react"
import { widthSing, widthDancing } from "hocs"

class Joy extends Component {
  render() {
    return <div>Joy</div>
  }
}

// 给Joy赋能唱歌和跳舞的特长
export default widthSinging(withDancing(Joy))
```

由上可见，只需使用高阶函数进行简单的包裹，就可以把原本单纯的 Joy 变成一个既能唱歌又能跳舞的夜店小王子了！

### 使用 HOC 的约定

在使用`HOC`的时候，有一些墨守成规的约定：

- 将不相关的 Props 传递给包装组件（传递与其具体内容无关的 props）；
- 分步组合（避免不同形式的 HOC 串联调用）；
- 包含显示的 displayName 方便调试（每个 HOC 都应该符合规则的显示名称）；
- 不要在`render`函数中使用高阶组件（每次 render，高阶都返回新组件，影响 diff 性能）；
- 静态方法必须被拷贝（经过高阶返回的新组件，并不会包含原始组件的静态方法）；
- 避免使用 ref（ref 不会被传递）;

### HOC 的优缺点

至此我们可以总结一下`高阶组件(HOC)`的优点：

- `HOC`是一个纯函数，便于使用和维护；
- 同样由于`HOC`是一个纯函数，支持传入多个参数，增强其适用范围；
- `HOC`返回的是一个组件，可组合嵌套，灵活性强；

当然`HOC`也会存在一些问题：

- 当多个`HOC`嵌套使用时，无法直接判断子组件的`props`是从哪个`HOC`负责传递的；
- 当父子组件有同名`props`，会导致父组件覆盖子组件同名`props`的问题，且`react`不会报错，开发者感知性低；
- 每一个`HOC`都返回一个新组件，从而产生了很多无用组件，同时加深了组件层级，不便于排查问题；

`修饰器`和`高阶组件`属于同一模式，在此不展开讨论。

## Render Props

**`Render Props`是一种非常灵活复用性非常高的模式，它可以把特定行为或功能封装成一个组件，提供给其他组件使用让其他组件拥有这样的能力**。

> The term “render prop” refers to a technique for sharing code between React components using a prop whose value is a function.

这是`React`官方对于`Render Props`的定义，翻译成大白话即：“`Render Props`是实现`React Components`之间代码共享的一种技术，组件的`props`里边包含有一个`function`类型的属性，组件可以调用该`props`属性来实现组件内部渲染逻辑”。

官方示例：

```js
<DataProvider render={(data) => <h1>Hello {data.target}</h1>} />
```

如上，`DataProvider`组件拥有一个叫做`render`（也可以叫做其他名字）的`props`属性，该属性是一个函数，并且这个函数返回了一个`React Element`，在组件内部通过调用该函数来完成渲染，那么这个组件就用到了`render props`技术。

读者或许会疑惑，“我们为什么需要调用`props`属性来实现组件内部渲染，而不直接在组件内完成渲染”？借用`React`官方的答复，`render props`并非每个`React`开发者需要去掌握的技能，甚至你或许永远都不会用到这个方法，但它的存在的确为开发者在思考组件代码共享的问题时，提供了多一种选择。

### `Render Props`使用场景

我们在项目开发中可能需要频繁的用到弹窗，弹窗 UI 可以千变万化，但是功能却是类似的，即`打开`和`关闭`。以`antd`为例：

```js
import { Modal, Button } from "antd"
class App extends React.Component {
  state = { visible: false }

  // 控制弹窗显示隐藏
  toggleModal = (visible) => {
    this.setState({ visible })
  };

  handleOk = (e) => {
    // 做点什么
    this.setState({ visible: false })
  }

  render() {
    const { visible } = this.state
    return (
      <div>
        <Button onClick={this.toggleModal.bind(this, true)}>Open</Button>
        <Modal
          title="Basic Modal"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.toggleModal.bind(this, false)}
        >
          <p>Some contents...</p>
        </Modal>
      </div>
    )
  }
}
```

以上是最简单的`Model`使用实例，即便是简单的使用，我们仍需要关注它的显示状态，实现它的切换方法。但是开发者其实只想关注与业务逻辑相关的`onOk`，理想的使用方式应该是这样的：

```js
<MyModal>
  <Button>Open</Button>
  <Modal title="Basic Modal" onOk={this.handleOk}>
    <p>Some contents...</p>
  </Modal>
</MyModal>
```

可以通过`render props`实现以上使用方式：

```js
import { Modal, Button } from "antd"
class MyModal extends React.Component {
  state = { on: false }

  toggle = () => {
    this.setState({
      on: !this.state.on
    })
  }

  renderButton = (props) => <Button {...props} onClick={this.toggle} />

  renderModal = ({ onOK, ...rest }) => (
    <Modal
      {...rest}
      visible={this.state.on}
      onOk={() => {
        onOK && onOK()
        this.toggle()
      }}
      onCancel={this.toggle}
    />
  )

  render() {
    return this.props.children({
      Button: this.renderButton,
      Modal: this.renderModal
    })
  }
}
```

这样我们就完成了一个具备状态和基础功能的`Modal`，我们在其他页面使用该`Modal`时，只需要关注特定的业务逻辑即可。

以上可以看出，`render props`是一个真正的`React`组件，而不是像`HOC`一样只是一个**可以返回组件的函数**，这也意味着使用`render props`不会像`HOC`一样产生组件层级嵌套的问题，也不用担心`props`命名冲突产生的覆盖问题。

### `render props`使用限制

在`render props`中应该避免使用`箭头函数`，因为这会造成性能影响。

比如：

```js
// 不好的示例
class MouseTracker extends React.Component {
  render() {
    return (
      <Mouse render={mouse => (
        <Cat mouse={mouse} />
      )}/>
    )
  }
}
```

这样写是不好的，因为`render`方法是有可能多次渲染的，使用`箭头函数`，会导致每次渲染的时候，传入`render`的值都会不一样，而实际上并没有差别，这样会导致性能问题。

所以更好的写法应该是将传入`render`里的函数定义为实例方法，这样即便我们多次渲染，但是绑定的始终是同一个函数。

```js
// 好的示例
class MouseTracker extends React.Component {
  renderCat(mouse) {
  	return <Cat mouse={mouse} />
  }

  render() {
    return (
		  <Mouse render={this.renderTheCat} />
    )
  }
}

```

### `render props`的优缺点

- 优点
  - props 命名可修改，不存在相互覆盖；
  - 清楚 props 来源；
  - 不会出现组件多层嵌套；
- 缺点

  - 写法繁琐；
  - 无法在`return`语句外访问数据；
  - 容易产生函数回调嵌套；

    如下代码：

    ```js
    const MyComponent = () => {
      return (
        <Mouse>
          {({ x, y }) => (
            <Page>
              {({ x: pageX, y: pageY }) => (
                <Connection>
                  {({ api }) => {
                    // yikes
                  }}
                </Connection>
              )}
            </Page>
          )}
        </Mouse>
      )
    }
    ```

## Hook

`React`的核心是组件，因此，`React`一直致力于优化和完善声明组件的方式。从最早的`类组件`，再到`函数组件`，各有优缺点。`类组件`可以给我们提供一个完整的生命周期和状态（state）,但是在写法上却十分笨重，而`函数组件`虽然写法非常简洁轻便，但其限制是**必须是纯函数，不能包含状态，也不支持生命周期**，因此`类组件`并不能取代`函数组件`。

而`React`团队觉得**组件的最佳写法应该是函数，而不是类**，由此产生了`React Hooks`。

**React Hooks 的设计目的，就是加强版函数组件，完全不使用"类"，就能写出一个全功能的组件**。

为什么说`类组件`“笨重”，借用`React`官方的例子说明：

```js
import React, { Component } from "react"

export default class Button extends Component {
  constructor() {
    super()
    this.state = { buttonText: "Click me, please" }
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick() {
    this.setState(() => {
      return { buttonText: "Thanks, been clicked!" }
    })
  }
  render() {
    const { buttonText } = this.state
    return <button onClick={this.handleClick}>{buttonText}</button>
  }
}
```

以上是一个简单的按钮组件，包含最基础的状态和点击方法，点击按钮后状态发生改变。

本是很简单的功能组件，但是却需要大量的代码去实现。由于`函数组件`不包含状态，所以我们并不能用`函数组件`来声明一个具备如上功能的组件。但是我们可以用`Hook`来实现：

```js
import React, { useState } from "react"

export default function Button() {
  const [buttonText, setButtonText] = useState("Click me,   please")

  function handleClick() {
    return setButtonText("Thanks, been clicked!")
  }

  return <button onClick={handleClick}>{buttonText}</button>
}
```

相较而言，`Hook`显得更轻量，在贴近`函数组件`的同时，保留了自己的状态。

在上述例子中引入了第一个钩子`useState()`，除此之外，`React`官方还提供了`useEffect()`、`useContext()`、`useReducer()`等钩子。具体钩子及其用法详情请见[官方](https://zh-hans.reactjs.org/docs/hooks-reference.html)。

`Hook`的灵活之处还在于，除了官方提供的基础钩子之外，我们还可以利用这些基础钩子来封装和自定义钩子，从而实现更容易的代码复用。

### Hook 优缺点

- 优点
  - 更容易复用代码；
  - 清爽的代码风格；
  - 代码量更少；
- 缺点
  - 状态不同步（函数独立运行，每个函数都有一份独立的作用域）
  - 需要更合理的使用`useEffect`
  - 颗粒度小，对于复杂逻辑需要抽象出很多`hook`

## 总结

除了`Mixin`因为自身的明显缺陷而稍显落后之外，对于`高阶组件`、`render props`、`react hook`而言，并没有哪种方式可称为`最佳方案`，它们都是优势与劣势并存的。哪怕是最为最热门的`react hook`，虽然每一个`hook`看起来都是那么的简短和清爽，但是在实际业务中，通常都是一个业务功能对应多个`hook`，这就意味着当业务改变时，需要去维护多个`hook`的变更，相对于维护一个`class`而言，心智负担或许要增加许多。只有切合自身业务的方式，才是`最佳方案`。

---

参考文档：

- [React Mixin 的使用](https://segmentfault.com/a/1190000003016446)
- [Mixins Considered Harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html)
- [Higher-Order Components](https://reactjs.org/docs/higher-order-components.html)
- [Render Props](https://reactjs.org/docs/render-props.html)
- [React 拾遗：Render Props 及其使用场景](https://www.imooc.com/article/39388)
- [Hook 简介](https://zh-hans.reactjs.org/docs/hooks-state.html)
