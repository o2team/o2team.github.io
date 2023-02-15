title: React 状态管理工具如何选 context/redux/mobx/zustand/jotai/recoil/valtio ?  
subtitle: 众所周知，我们在研发一个`复杂应用`的过程中，一套好的`状态管理方案`是必不可少的，既能`提升研发效率，又能降低研发维护成本`，那么状态管理方案那么多，它们有什么不同，我们又该`如何选择`适合当前应用的方案呢？   
cover: https://img12.360buyimg.com/img/s1812x1096_jfs/t1/54360/14/23827/2137537/63eca4d7F496ff02f/5d826e331ab4bd3b.png
category: 经验分享  
tags: 
  - ReactJS
  - State-Management
author:   
  nick: 阿文  
  github_name: AwesomeDevin  
date: 2023-2-15 21:00:00  
wechat:  
    share_cover: https://img12.360buyimg.com/img/s1812x1096_jfs/t1/54360/14/23827/2137537/63eca4d7F496ff02f/5d826e331ab4bd3b.pn  
    share_title:  React 状态管理工具如何选 context/redux/mobx/zustand/jotai/recoil/valtio ? 
    share_desc: 众所周知，我们在研发一个`复杂应用`的过程中，一套好的`状态管理方案`是必不可少的，既能`提升研发效率，又能降低研发维护成本`，那么状态管理方案那么多，它们有什么不同，我们又该`如何选择`适合当前应用的方案呢？ 
---

### 什么是状态管理?
**“状态”是描述应用程序当前行为的任何数据**。这可能包括诸如“从服务器获取的对象列表”、“当前选择的项目”、“当前登录用户的名称”和“此模式是否打开？”等值。  

众所周知，我们在研发一个`复杂应用`的过程中，一套好的`状态管理方案`是必不可少的，既能`提升研发效率，又能降低研发维护成本`，那么状态管理方案那么多，它们有什么不同，我们又该`如何选择`适合当前应用的方案呢？ 

本期将主要就 `react` 的常用状态管理方案进行对比分析，希望对各位看客有帮助。

### React 状态管理方案
##### 方案介绍
- **[hooks context](https://reactjs.org/docs/hooks-reference.html#usecontext)**
- **[react-redux](https://react-redux.js.org/)**
- **[mobx](https://mobx.js.org/README.html)**
- **[zustand](https://awesomedevin.github.io/zustand-vue/)**
- **[jotai](https://jotai.org/)**
- **[recoil](https://recoiljs.org/)**
- **[valtio](https://valtio.pmnd.rs/)**

##### 方案对比
框架 | 原理 | 优点 | 缺点 
--- | --- | --- | ---
hooks context | 基于 react hook，开发者可实现内/外部存储 | 1. 使用简单<br/> 2. 不需要引用第三方库，体积最小<br/> 3. 支持存储全局状态，但在复杂应用中不推荐<br/> 4. 不依赖 react 上下文，可在组件外调用（外部存储的条件下） | 1. context value发生变化时，所有用到这个context的组件都会被重新渲染，基于 content 维护的模块越多，影响范围越大。<br/> 2.依赖 Context Provider 包裹你的应用程序，修改 store 无法在应用最顶层(App.tsx 层级)触发渲染<br/> 3. 受ui框架约束(react)<br/> 4. 依赖hooks调用
react-redux | Flux思想，发布订阅模式，遵从函数式编程，外部存储 | 1. 不依赖 react 上下文，可在组件外调用<br/> 2. 支持存储全局状态<br/> 3.不受ui框架约束  | 1. 心智模型需要一些时间来理解，特别是当你不熟悉函数式编程的时候<br/> 2. 依赖 Context Provider 包裹你的应用程序，修改 store 无法在应用最顶层(App.tsx 层级)触发渲染
mobx | 观察者模式 + 数据截止，外部存储 | 1. 使用简单<br/> 2. 不依赖 react 上下文，可在组件外调用<br/> 3. 支持存储全局状态<br/> 4.不受ui框架约束  | 1.可变状态模型，某些情况下可能影响调试<br/> 2. 除了体积相对较大之外，笔者目前未感觉到较为明显的缺点，3.99M
zustand | Flux思想，观察者模式，外部存储 | 1. 轻量，使用简单<br/> 2. 不依赖 react 上下文，可在组件外调用<br/> 3. 支持存储全局状态  | 1.框架本身不支持 computed 属性，但可基于 middleware 机制通过少量代码间接实现 computed ，或基于第三方库 zustand-computed 实现<br/> 2.受ui框架约束(react / vue)
jotai | 基于 react hook，内部存储 | 1. 使用简单<br/>  2. 组件颗粒度较细的情况下，jotai性能更好<br/>  3.支持存储全局状态，但在复杂应用中不推荐 | 1. 依赖 react 上下文， 无法组件外调用，相对而言, zustand 在 react 环境外及全局可以更好地工作<br/> 2. 受ui框架约束(react)
recoil | 进阶版 jotai,基于 react hook + provider context，内部存储 | 相对于 jotai而言，会更重一些，但思想基本不变，拥有一些 jotai 未支持的特性及 api，如：<br/> 1.监听 store 变化<br/> 2. 针对 atom 的操作拥有更多的 api，编程上拥有更多的可能性，更加有趣 | 拥有 jotai 所有的缺点，且相对于 jotai 而言:<br/> 1.使用 recoil 需要 < RecoilRoot > 包裹应用程序<br/> 2. 编写 selector 会复杂一些 
valtio | 基于数据劫持，外部存储 | 1. 使用简单，类mobx（类vue）的编程体验<br/> 2.支持存储全局状态<br/> 3.不依赖 react 上下文，可在组件外调用<br/> 4. 不受ui框架约束 | 1.可变状态模型，某些情况下可能影响调试<br/>2.目前笔者没发现其它特别大的缺点，个人猜测之所以star相对zustand较少，是因为 valtio 的数据双向绑定思想与 react 存在冲突。 

### Source
- hooks context  
    [1.使用 react hooks + context 进行方便快捷的状态管理](https://github.com/AwesomeDevin/blog/issues/79)  
    [2.使用 react hooks + context 构建 redux 进行状态管理](https://github.com/AwesomeDevin/blog/issues/45)
- [react-redux](https://codesandbox.io/s/github/reduxjs/redux-essentials-counter-example/tree/master/?from-embed=&file=/src/features/counter/counterSlice.js)
- mobx
```js
import React from "react"
import ReactDOM from "react-dom"
import { makeAutoObservable } from "mobx"
import { observer } from "mobx-react"

// 状态及相关事件
class Timer {
    secondsPassed = 0

    constructor() {
        makeAutoObservable(this)
    }

    increase() {
        this.secondsPassed += 1
    }

    reset() {
        this.secondsPassed = 0
    }
}

const myTimer = new Timer()

// 构建可观擦组件
const TimerView = observer(({ timer }) => (
    <button onClick={() => timer.reset()}>Seconds passed: {timer.secondsPassed}</button>
))

ReactDOM.render(<TimerView timer={myTimer} />, document.body)

// 触发更新事件
setInterval(() => {
    myTimer.increase()
}, 1000)
```
- zustand
```js
import { create } from 'zustand'

// 状态及相关事件
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}))

// 渲染视图
function BearCounter() {
  const bears = useBearStore((state) => state.bears)
  return <h1>{bears} around here ...</h1>
}

// 触发更新事件
function Controls() {
  const increasePopulation = useBearStore((state) => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}

```
- jotai
```js
import { atom } from 'jotai'

const countAtom = atom(0)

function Counter() {
  // 状态及相关事件
  const [count, setCount] = useAtom(countAtom)
  return (
    <h1>
      {count}
      <button onClick={() => setCount(c => c + 1)}>one up</button>
    </h1>
  )
}
```
- recoil
```js
const fontSizeState = atom({  
  key: 'fontSizeState',  
  default: 14,  
});
function FontButton() {  
  const [fontSize, setFontSize] = useRecoilState(fontSizeState);  
  return (  
    <button onClick={() => setFontSize((size) => size + 1)} style={{fontSize}}>  
      Click to Enlarge  
    </button>  
  );  
}
```
- valtio
```js
import { proxy, useSnapshot } from 'valtio'

const state = proxy({ count: 0, text: 'hello' })

function Counter() {
  const snap = useSnapshot(state)
  return (
    <div>
      {snap.count}
      <button onClick={() => ++state.count}>+1</button>
    </div>
  )
```
### 相关建议
1. 如果你需要`useState+useContext`的替代品，那么`jotai`非常适合，即`原子化`的组件状态管理或`少量组件间`状态共享。
2. 如果你习惯了`redux`或喜欢`react`的自然不可变更新，那么`zustand`将非常适合。
3. 如果你习惯了`vue/ slute /mobx`，或者是JS/React的新手，`valtio`的可变模型将很适合。
4. 如果你在使用 `zustand(redux/等不可变数据模型) + immer`，建议改用`valtio(mobx)`
5. `mobx`有actions概念，而`valtio`概念更为简单（自由），如果你希望工程更为`规范`，可以使用`mobx`，如果是希望工程更为`自由便捷`，可以使用`valtio`
6. `recoil`与`jotai`的编程思想类似，但提供了更多的 api 与 特性，针对原子状态拥有更多的可操作性，同时包体积也更大，但由于`recoil`功能庞大，其使用相对于`jotai`会繁琐一些,如果你希望工程`轻巧便捷`可以选用`jotai`，如果你想试试原子状态更多的可能性，那么试试`recoil`吧。

如果该文章对你有帮助，请给我点个👍吧～  









