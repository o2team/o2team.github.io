title: Javascript 中的装饰器
subtitle: 麻麻说写代码一定要优雅
cover: //misc.aotu.io/Secbone/decorator/decorator_840x340.jpg
date: 2016-10-14 20:49:11
categories: Web开发
draft: true
tags:
  - decorator
  - 装饰器
author:
  nick: Secbone
  github_name: Secbone
wechat:
    share_cover: http://misc.aotu.io/Secbone/decorator_200x200.jpg
    share_title: Javascript 中的装饰器
    share_desc: 麻麻说写代码一定要优雅
---

<!-- more -->
# Javascript 中的装饰器

话说从 decorators 被提出已经有一年多的时间了，同时期的很多其他新的特性已经随着 ES6 的推进而被大家广泛使用，而这货现在却还停留在 stage 2 的阶段，也很少被人提及和应用。那么，decorators 到底是一个什么样的 东西呢？我们今天就来一起看一下吧！



## Python 中的装饰器

decorators 即 装饰器，这一特性的提出来源于 python 之类的语言，如果你熟悉 python 的话，对它一定不会陌生。那么我们先来看一下 python 里的装饰器是什么样子的吧：

> A Python decorator is a function that takes another function, extending the behavior of the latter function without explicitly modifying it.

装饰器是在 python 2.4 里增加的功能，它的主要作用是给一个已有的方法或类扩展一些新的行为，而不是去直接修改它本身。

听起来有点儿懵😳，“show me the code !”

```python
def decorator(f):
    print "my decorator"
    return f

@decorator
def myfunc():
    print "my function"

myfunc()

# my decorator
# my function
```

这里的 `@decorator` 就是我们说的装饰器。在上面的代码中，我们利用装饰器给我们的目标方法执行前打印出了一行文本，并且并没有对原方法做任何的修改。代码基本等同于

```python
def decorator(f):
    def wrapper():
        print "my decorator"
        return f()
    return wrapper

def myfunc():
    print "my function"

myfunc = decorator(myfuc)
```



通过代码我们也不难看出，装饰器 decorator 接收一个参数，也就是我们被装饰的目标方法，处理完扩展的内容以后再返回一个方法，供以后调用，同时也失去了对原方法对象的访问。当我们对某个应用了装饰以后，其实就改变了被装饰方法的入口引用，使其重新指向了装饰器返回的方法的入口点，从而来实现我们对原函数的扩展、修改等操作。

## 引入到 Javascript 中

那么我们了解到了装饰器在 python 中的表现以后，会不会觉得其实装饰器其实蛮简单的，就是一个 wrapper 嘛，对于 Javascript 这种语言来说，这种形态不是很常见吗，干嘛还要引入这么一个东西呢？

是的，在 ES6 之前，装饰器对于 JS 来说确实显得不太重要，你只是需要加几层 wrapper 包裹就好了（虽然也会显得不那么优雅）。但是在 ES6 提出之后，你会发现，好像事情变得有些不同了。在 ES6 中增加了对类对象的相关定义和操作（比如 `class` 和 `extends` ），这就使得我们在多个不同类之间共享或者扩展一些方法或者行为的时候，变得并不是那么优雅。这个时候，我们就需要一种更优雅的方法来帮助我们完成这些事情。

## Javascript 中的装饰器

首先我们先来看一下关于 ES6 中的类吧

```javascript
class Cat {
    say() {
        console.log("meow ~");
    }
}
```

上面这段代码是 ES6 中定义一个类的写法，其实也只是一个语法糖，如果是用 ES5 的写法，它应该是这样的:

```javascript
function Cat() {}
Cat.prototype.say = function() {
    console.log("meow ~");
}
```

实际上我们的  `say`  方法是挂到了  `Cat.prototype` 上的，但实际上这里还是少了些东西，这里就要引入另一个东西，就是 `Object.defineProperty` ，那么上边的代码就进一步变成了

```javascript
function Cat() {}
Object.defineProperty(Cat.prototype, "say", {
    value: function() { console.log("meow ~"); },
    enumerable: false,
    configurable: true,
    writable: true
});
```

好了，有了上面这段代码以后，我们再来看看装饰器在 JS 中到底是怎么样工作的吧！

先来看一下作用于类的装饰器

```javascript
function isAnimal(target) {
    target.isAnimal = true;
  	return target;
}

@isAnimal
class Cat {
    ...
}

console.log(Cat.isAnimal);    // true
```

还记得我们之前看到的 python 中的装饰器的表现么？是不是很熟悉？这段代码实际上基本等同于

```javascript
Cat = isAnimal(function Cat() { ... });
```

那么我们再来看一下作用于类的单个属性方法的装饰器

```javascript
function readonly(target, name, descriptor) {
    discriptor.writable = false;
    return discriptor;
}

class Cat {
    @readonly
    say() {
        console.log("meow ~");
    }
}

var kitty = new Cat();

kitty.say = function() {
    console.log("woof !");
}

kitty.say()    // meow ~
```

我们通过上面的代码把 `say` 方法设置成了只读，所以在我们后面再次对它赋值的时候就不会生效，调用的还是之前的方法。

那么这里我想大家也已经看出来了，我们在定义我们的装饰器的时候，参数是有三个，`target`、`name`、`descriptor` ，结合我们上面提到过的关于类的定义那一块儿的代码，还记得那个`Object.defineProperty` 么？没错，就是它！

所以，我们可以把上面的这段代码变形成为这样：

```javascript
let descriptor = {
    value: function() {
        console.log("meow ~");
    },
    enumerable: false,
    configurable: true,
    writable: true
};

descriptor = readonly(Cat.prototype, "say", descriptor) || descriptor;

Object.defineProperty(Cat.prototype, "say", descriptor);
```

嗯嗯，是不是这样看就清楚很多了呢？这里也是 JS 里装饰器作用于类和作用于类的属性的不同的地方。

我们可以看出，当装饰器作用于类本身的时候，我们操作的对象也是这个类本身，而当装饰器作用于类的某个具体的属性的时候，我们操作的对象既不是类本身，也不是类的属性，而是它的描述符（descriptor），而描述符里记录着我们对这个属性的全部信息，所以，我们可以对它自由的进行扩展和封装，最后达到的目的呢，就和之前说过的装饰器的作用是一样的。

## 小结

OK，让我们再来看一下 JS 里对于装饰器的描述吧：

> Decorators make it possible to annotate and modify classes and properties at design time.

> A decorator is:
>
> - an expression
> - that evaluates to a function
> - that takes the target, name, and decorator descriptor as arguments
> - and optionally returns a decorator descriptor to install on the target object

装饰器允许你在类和方法定义的时候去注释或者修改它。装饰器是一个作用于函数的表达式，它接收三个参数 `target`、 `name` 和 `descriptor` ， 然后可选性的返回被装饰之后的 `descriptor` 对象。

现在是不是对装饰器的作用及原理都清楚了呢？

最后一点就是，现在装饰器因为还在草案阶段，所以还没有被大部分环境支持，如果要用的话，需要使用 Babel 进行转码，需要用到 `babel-plugin-transform-decorators-legacy` 这个插件:

```bash
babel --plugins transform-decorators-legacy es6.js > es5.js
```

如果你感兴趣的话，也可以看一下转码以后的代码，我这里就不做详细介绍了，很有帮助哦~

如果本文描述的有错误的地方，欢迎留言~ ヾ(o◕∀◕)ﾉ



## 参考文献:

- https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841#.cmajiy3p1
- https://github.com/wycats/javascript-decorators
- http://www.artima.com/weblogs/viewpost.jsp?thread=240808
- http://taobaofed.org/blog/2015/11/16/es7-decorator/?utm_source=tuicool&utm_medium=referral
- https://github.com/jayphelps/core-decorators.js
