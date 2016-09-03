title: 写给新人的call、apply、bind
subtitle: 实在不知道起什么标题，然后想想，这是基础，就起了这个XX标题～😄～～
cover: //misc.aotu.io/Newcandy/2016-09-02-Different-Binding/Different-Binding_900x500.jpg
categories: Web开发
tags:
  - Git
  - Fork
author:
  nick: 暖暖
  github_name: Newcandy
date: 2016-09-02 14:56:23
---

## 1、call()

语法：

```
fun.call(thisArg[, arg1[, arg2[, ...]]])
```

thisArg：fun函数运行时指定的this值，可能的值为：

* 不传，或者传null，undefined， this指向**window对象**
* 传递另一个函数的函数名fun2，this指向**函数fun2的引用**
* 值为原始值(数字，字符串，布尔值),this会指向该原始值的自动包装对象，如 String、Number、Boolean
* 传递一个对象，函数中的this指向这个对象

例如：

```
function a(){
    console.log(this);
}
function b(){}

a.call(b);  // function b(){}
```

经常会看到这种使用情况：

```
function list() {
  // 将arguments转成数组
  return Array.prototype.slice.call(arguments);  
}
list(1,2,3);  // [1, 2, 3]
```

为什么能实现这样的功能将arguments转成数组？首先call了之后，this指向了所传进去的arguments。我们可以假设slice方法的内部实现是这样子的：创建一个新数组，然后for循环遍历this，将this[i]一个个地赋值给新数组，最后返回该新数组。因此也就可以理解能实现这样的功能了。


## 2、apply()

语法：

```
// Chrome 14 以及 Internet Explorer 9 仍然不接受类数组对象。
// thisArg的可能值和call一样
fun.apply(thisArg[, argsArray])
```

例如：

```
var numbers = [5, 6, 2, 3, 7];
var max = Math.max.apply(null, numbers);
console.log(max)  // 7
```

平时Math.max只能这样子用：`Math.max(5,6,2,3,7)`;
利用apply的第二个参数是数组的特性，从而能够简便地从数组中找到最大值。


## 3、bind

### 基本用法

语法：

```
fun.bind(thisArg[, arg1[, arg2[, ...]]]);
```

bind()方法会创建一个**新函数**，称为绑定函数。

bind是ES5新增的一个方法，**不会执行对应的函数**（call或apply会自动执行对应的函数），而是**返回对绑定函数的引用**。

当调用这个绑定函数时，thisArg参数作为 this，**第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数**来调用原函数。

简单地说，bind会产生一个新的函数，这个函数可以有预设的参数。


```
function list() {
  // 将arguments转成数组
  return Array.prototype.slice.call(arguments);  
}

var leadingThirtysevenList = list.bind(undefined, 37); // 绑定函数
var list = leadingThirtysevenList(1, 2, 3); // 调用绑定函数

console.log(list); // [37, 1, 2, 3]
```


### bind调用简单

把类数组换成真正的数组，bind能够更简单地使用：

* apply用法

```
var slice = Array.prototype.slice;
// ...
slice.apply(arguments);  // 类似对象的方法那样调用
```

* bind用法

```
var unboundSlice = Array.prototype.slice;
var slice = Function.prototype.apply.bind(unboundSlice);
// ...
slice(arguments);  // 直接调用，简单
```

## 4、它们的区别

相同之处：改变函数体内 this 的指向。
不同之处：
* call、apply的区别：接受参数的方式不一样。
* bind：不立即执行。而apply、call 立即执行。


## 5、参考

http://www.cnblogs.com/coco1s/p/4833199.html
https://segmentfault.com/a/1190000004568767
https://segmentfault.com/a/1190000002929289
http://www.cnblogs.com/coco1s/p/4833199.html