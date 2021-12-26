title: 从中断机制看 React Fiber 技术
subtitle: 带你了解计算机的中断机制（操作系统心脏）是如何提在 React Fiber 中应用及提高了页面渲染性能和用户体验。
cover: https://img11.360buyimg.com/ling/jfs/t1/156416/37/17938/20347/605c38f1E973ec4d6/fe3315b68d397ca6.jpg
category: JavaScript
tags:
  - JavaScript
  - React
author:
  nick: nobo
  github_name: bplok20010
  date: 2021-03-25 14:31:27

---

## 前言

React 16 开始，采用了 Fiber 机制替代了原有的同步渲染 VDOM 的方案，提高了页面渲染性能和用户体验。Fiber 究竟是什么，网上也很多优秀的技术揭秘文章，本篇主要想从计算机的中断机制来聊聊 React Fiber 技术大概工作原理。

## 单任务

在早期的单任务系统上，用户一次只能提交一个任务，当前运行的任务拥有全部硬件和软件资源，如果任务不主动释放 CPU 控制权，那么将一直占用所有资源，可能影响其他任务，造成资源浪费。该模式非常像当前浏览器运行模式，由于 UI 线程和 JS 线程的运行是互斥的，一旦 JS 长时间执行，浏览器无法及时响应用户交互，很容造成界面的卡顿，React 早期的同步渲染机制，当一次性更新的节点太多时，影响用户体验。

![图片](https://img13.360buyimg.com/ling/jfs/t1/151704/12/19753/15833/603d96e1E3d8a4d56/f8c5d7b12f0e6c93.png)

## 中断

中断最初是用于提高处理器效率的一种手段，在没有中断的情况下，当 CPU 在执行一段代码时，如果程序不主动退出（如：一段无限循环代码），那么 CPU 将被一直占用，影响其他任务运行。

```plain
while(true) {
  ...
};
```

而中断机制会强制中断当前 CPU 所执行的代码，转而去执行先前注册好的中断服务程序。比较常见的如：时钟中断，它每隔一定时间将中断当前正在执行的任务，并立刻执行预先设置的中断服务程序，从而实现不同任务之间的交替执行，这也是在多任务系统的重要的基础机制。中断机制主要通过硬件触发，CPU 属于被动接受。有了中断后，各任务执行时间就可以得到非常好的控制。
![图片](https://img14.360buyimg.com/ling/jfs/t1/152390/35/20669/20680/603d9709Ec699bd9a/b881f09e4192e97b.png)

回到浏览器，目前浏览器大多是 60Hz（60 帧/秒），既每一帧耗时大概在 16ms 左右，它会经过下面这几个过程：

![图片](https://img11.360buyimg.com/ling/jfs/t1/160367/3/9030/85652/603d972dE0c5ffabd/48205a0933f366ae.png)

1. 输入事件处理
2. requestAnimationFrame
3. DOM 渲染
4. RIC (RequestIdleCallback)

我们除了在步骤 1-3 的中进行加塞外，无法进行任何干预，而步骤 4 的 RIC，算是一种防止多余计算资源被浪费的机制，例如，当一帧中步骤 1-3 只耗费 6ms，那么剩余 10ms 的计算资源则会被浪费，而 RIC 就是浏览器提供的一种资源利用的接口。RIC 非常像前面提到的“中断服务”，而浏览器的每一帧类似“中断机制”，利用它则可以在实现我们前面提到的大任务卡顿问题，例如：之前我们在 JS 中写如下代码时，无疑会阻塞浏览器渲染。

```javascript
function task(){
  while(true){
   ...
  };
}
task();
```

但利用 RIC 机制后，我们完全可以让大任务周期性的执行，从而不阻止浏览器正常渲染。
![图片](https://img11.360buyimg.com/ling/jfs/t1/163132/36/9386/19960/603d9765E4a328a80/ba92c90d981898c3.png)

将上面示例代码根据 RequestIdleCallback 进行调整，如下：

```javascript
function task(){
  while(true){
   ...
  };
}
requestIdleCallback(task);
```

遗憾的是，由于我们的代码运行在用户态，无法感知到底层的真实中断，我们现在利用的 RIC 也只是一种中断的近似模拟，以上代码并不会在 16ms 到期后被强制中断，我们只能主动进行释放，将控制权交还浏览器，RIC 提供了 timeRemaining 方法，让任务知道主动释放时机，我们调整以上代码，如下：

```javascript
function task(deadline){
  while(true){
   ...
   if(!deadline.timeRemaining()) {
     requestIdleCallback(task);
     // 主动退出循环，将控制权交还浏览器
     break;
   }
  };
}
requestIdleCallback(task);
```

以上示例，可以让一个大循环在“中断”机制下，不阻塞浏览器的渲染和响应。

**注意：** RIC 调用频率大概是 20 次/秒，远远低于页面流畅度的要求！这样每次你能得到差不多 50ms 的计算时间，如果完全用这 50ms 来做计算，同样会带来交互上的卡顿，所以 React Fiber 是基于自定义一套机制来模拟实现，如：setTimeout、setImmediate、MessageChannel。

以下是 React Fiber 中的主动释放片段代码：

```javascript
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 如果超时，则主动退出循环，将控制权交还浏览器
      break;
    }
    ...
  }
  ...
}
```

## 调度任务

有了中断机制，中断服务后，不同任务就能实现间断执行的可能，如何实现多任务的合理调度，就需要一个调度任务来进行处理，这通常代表着操作系统。例如，当一个任务 A 在执行到一半时，被中断机制强制中断，此时操作系统需要对当前任务 A 进行现场保护，如：寄存器数据，然后切换到下一个任务 B，当任务 A 再次被调度时，操作系统需要还原之前任务 A 的现场信息，如：寄存器数据，从而保证任务 A 能继续执行下一半任务。**调度过程中如何保证被中断任务的信息不被破坏是一个非常重要的功能。**

浏览器提供的 RIC 机制，类似“中断服务”注册机制，注册后我们只要合适的时机进行释放，就能实现“中断”效果，刚也提到对于不同任务之间切换，在中断后，需要考虑现场保护和现场还原。早期 React 是同步渲染机制，实际上是一个递归过程，递归可能会带来长的调用栈，这其实会给现场保护和还原变得复杂，React Fiber 的做法将递归过程拆分成一系列小任务(Fiber)，转换成线性的链表结构，此时现场保护只需要保存下一个任务结构信息即可，所以拆分的任务上需要扩展额外信息，该结构记录着任务执行时所需要的必备信息：

```javascript
{
    stateNode,
    child,
    return,
    sibling,
    expirationTime
    ...
}
```

我们看以下示例代码：

```javascript
ReactDOM.render(
  <div id="A">
    A
    <div id="B">
      B<div id="C">C</div>
    </div>
    <div id="D">D</div>
  </div>,
  node
);
```

当 React 进行渲染时，会生成如下任务链，此时如果在执行任务 B 后时发现时间不足，主动释放后，只需要记录下一次任务 C 的信息，等再次调度时取得上次记录的信息即可。使用该机制后，对于渲染任务的优先级、撤销、挂起、恢复都能得到非常好的控制。
![图片](https://img30.360buyimg.com/ling/jfs/t1/160189/4/9328/13643/603d9787Ed122186e/3b808271b55a716f.png)

## 总结

中断机制其实是一种非常重要的解决资源共享的手段，对于操作系统而言，它已经是一个必不可少功能。随着浏览器的功能越来越强，越来越多功能也搬到了浏览器，如何保证用户在使用过程中的流畅，也是经常需要思考的问题，在业务开发过程中，我们可以根据实际场景利用好“中断机制”，提高用户体验。
