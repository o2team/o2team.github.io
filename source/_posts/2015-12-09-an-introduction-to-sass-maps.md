title: 【译】介绍Sass Maps：用法跟例子
subtitle: 本文介绍如何利用Sass Maps简化我们的代码，翻译水平有限，敬请指正。
cover: //img.aotu.io/cnt1992/sass-maps-cover.jpg
categories: Web开发
tags:
  - sass
  - sass maps
author:
  nick: skycai
  github_name: cnt1992
date: 2015-12-09 09:54:16
---

> 本文翻译自[An Introduction to Sass Maps:Usage and Examples](http://webdesign.tutsplus.com/tutorials/an-introduction-to-sass-maps-usage-and-examples--cms-22184)

<!-- more -->

对于前端可伸缩页面的编写来说Sass Maps可以说是一个福音，从逻辑模块中抽取出配置是一种非常好的方法。现在就让我跟你解释为什么我认为在Sass 3.3中Sass Maps是最好的特性。

## Sass 3.3

Sass 3.3[*注1*]即将更新给所有人使用，但是对于很多开发者来说还有很多实用性的特性他们依然不熟悉。新版本的Sass 3.3带给我们新的数据类型称为`map`。`Maps`是`key/value`键值对的集合，能够帮助我们通过简单的代码创建一块配置区域。

## 如何使用 Sass Maps

首先我们会覆盖Sass Maps的基本用法，后面会看几个实例。

### 创建一个Map

下面是一个快速创建Sass Maps的语句，创建一个变量（这里用了`$map`）然后输入一些`keys`跟`values`，通过`,`来分割，这些键值对通过括号包围起来：

```css
$map: (
  key: value,
  nextkey: nextvalue
);
```

### 如何获取Map的值

当你定义了很多对`key/value`键值对之后，有时候你需要取出一些值。你可以通过`map-get()`方法来找出某个`key`的`value`。该方法需要传入两个参数：`map`的名称还有`key`。

```javascript
.element:before {
  content: map-get($map, key);
}
```

上面编译输出后的结果如下：

```css
.element:before {
  content: value
}
```

### 如何检查某一个key是否存在

在用`Sass`进行编码的时候强烈建议使用[可靠的错误处理](https://webdesign.tutsplus.com/tutorials/an-introduction-to-error-handling-in-sass--cms-19996)。在这里`Sass`给了我们一个方法`map-has-key()`。这个方法能够检测出某个`key`是否存在，如果不存在能够输出其他信息给开发者。

可以移步 `Hugo Giraudel` 写的这篇如何处理错误的文章 [An Introduction to Error Handing in Sass](http://webdesign.tutsplus.com/tutorials/an-introduction-to-error-handling-in-sass--cms-19996)。

```javascript
$map: (
  key: value,
  nextkey: nextvalue
);

.element {
  @if map-has-key($map, key){
    content: 'Map has this key.';
  } @else {
    content: 'Map has not this key.'
  }
}
```

编译之后结果如下：

```css
.element {
  content: 'Map has this key.';
}
```

### 如何合并Maps

这个一个福利：`Sass`允许我们合并两个甚至更多个`maps`成一个，这是一个非常实用的功能，通过下面这个例子我们将知道如何使用`map-merge()`方法：

```javascript
$colors: (
  light: #ccc,
  dark: #000
);

$brand-colors: (
  main: red,
  alternative: blue
);

// 合并maps
$merged: map-merge($colors, $brand-colors);

.element {
  content: map-get($merged, alternative);
}
```

编译之后结果如下：

```css
.element {
  content: blue;
}
```

## 利用Sass Maps进行实战

上面我们介绍了如何实用`Sass Maps`，现在我们将通过一些实战训练看看在哪些地方适合使用该特性。

1.如何循环Map生成类

你可以遍历`map`通过里面的`values`去定义你需要的变量然后加到`map`里面的`name`去，这样子你可以创建出很多种`values`。

在下面的例子中我将输出`classes`来展示`icons`。我将`icon`的`name`作为`key`，让`value`去替代实际的`content`(通过伪元素加进去)。

> 注意：在项目实战中我们通过会先声明一些基础的样式，这不在本教程的范围内。

```javascript
/* 定义一个sass map名称为$icons */
$icons: (
  checkmark: a,
  plus: b,
  minus: c
);

/* 遍历map的所有key，创建各自的类 */
@each $name, $value in $icons {
  .icon--#{$name} {
    content: $value;
  }
}
```

编译之后结果如下：

```css
/* 遍历map的所有key，创建各自的类 */
.icon--checkmark {
  content: "a";
}

.icon--plus {
  content: "b";
}

.icon--minus {
  content: "c";
}
```

这是一种非常高效的方法来输出icons的所有类，还有大量情况也会使用这种方法。

2.如何拿出Maps的多个值

让我们继续，给一个`key`赋予多个`value`也是可以的。多个`value`之间通过`,`来分割。下面的例子能够非常好的输出不同模块的样式。

这里我将定义一系列`buttons`，每一个`key`的第一个`value`是`background-color`，第二个`value`是`font-color`。

然后我将通遍历`keys`赋值给`$colors`对象。通过`nth($colors,1)`（第一个参数是对象的名称，第二个参数是值得位置）拿到第一个`key`。如果你需要拿第二个`value`，那将第二个参数改为`2`。

```javascript
// _m-buttons.scss
$buttons: (
  error: (#d82d2d, #666),
  success: (#52bf4a, #fff),
  warning: (#c23435, #fff)
);

.m-button {
  display: inling-block;
  padding: .5em;
  background: #ccc;
  color: #666;

  @each $name, $colors in $buttons {
    $bgcolor: nth($colors, 1);
    $fontcolor: nth($colors, 2);

    &--#{$name} {
      background-color: $bgcolor;
      color: $fontcolor;
    }
  }
}
```

编译之后结果如下：

```css
.m-button {
  display: inline-block;
  padding: .5em;
  background: #ccc;
  color: #666;
}

.m-button--error {
  background-color: #d82d2d;
  color: #666;
}

.m-button--success {
  background-color: #52bf4a;
  color: #fff;
}

.m-button--warning {
  background-color: #c23435;
  color: #fff;
}
```

3.处理层(z-index)

在某种程度上来说，我还没有见过不跟[z-index](https://webdesign.tutsplus.com/articles/what-you-may-not-know-about-the-z-index-property--webdesign-16892)打交道的前端开发。当你在项目中多个地方需要使用到`z-index`的时候问题通常随之而来，`Sass maps`能够帮我们解决这些问题。

首先我们定义了一个map名称为`$layer`，所有的`key`都应该合理命名以便我们能够知道哪个value是对应哪个element的-比如：`offcanvas`,`lightbox`,`dropdown`等。

```javascript
// _config.scss
$layer: (
  offcanvas: 1,
  lightbox: 500,
  dropdown: 10,
  tooltip: 15
);

// _m-lightboxes.scss
@function layer($name) {
  @if map-has-key($layer, $name) {
    @return map-get($layer, $name);
  }

  @warn "The key #{$name} is not in the map '$layer'";
  @return null;
};

.m-lightbox {
  z-index: layer(lightbox);
}
```

上面我定义了一个方法用来获取特定`key`的`value`，但为什么我要这样做？理由很简单：这样子比每次都写`map-get()`方法要方便快捷。另外一个方面就是你可以创建`错误处理`给开发者一些错误信息当没有输出期望的信息的时候。

编译结果如下：

```css
.m-lightbox {
  z-index: 500;
}
```

4.在项目中为字体创建基本样式

每一个项目都拥有自己的配置文件，用来给全局使用。例如在我的项目中我会定义一些字体属性：字体颜色，可选的字体颜色，字体集或者字体大小。我通常都会为每个属性创建一个变量，但是`map`能够做得更好。

下面是一个简单的例子，先从*旧*的解决方法开始：

```javascript
$base-font-color: #666;
$base-font-family: Arial, Heletica, Sans-Serif;
$base-font-size: 16px;
$base-line-height: 1.4;
```

接下来看通过`Sass Map`写的`新`的解决方法：

```javascript
// _config.scss
$font: (
  color: #666;
  family: (Arial, Helvetica),
  size: 16px,
  line-height: 1.4
);

// _presets.scss
body {
  color: map-get($font, color);
  font-family: map-get($font, family);
  font-size: map-get($font, size);
  line-height: map-get($font, line-height);
}
```

5.Breakpoints < 3

我很喜欢这个使用案例。在你的整个项目中拥有一块专门用来处理断点是非常好的。所以，像这一节中关于处理`z-index`，你就已经用到了断点。当你改变值得时候，整个项目的行为也随之改变，这多么令人惊讶。

那就先让我们通过一个`map`名称为`$breakpoints`开始吧。

我们的目标就是在一个元素中使用断点通过易懂的名字替代那些`pixel`值，所以需要一个`mixin`方法来实现占位`name`，我把mixin命名为`respond-to`以及传入`$brakpoint`参数。通过`$value`我就能得到期望的断点然后后面在`媒体查询`中使用。

```javascript
// Map with much breakpoints
$breakpoints: (
  small: 320px,
  medium: 600px,
  large: 768px
);

// Respond-To Mixin
@mixin respond-to($breakpoint) {
  @if map-has-key($breakpoints, $breakpoint) {
    $value: map-get($breakpoints, $breakpoint);

    @media screen and (min-width: $value) {
      @content;
    }
  }

  @warning "Unknown `#{$breakpoint}` in $breakpoints";
}
```

示例：

```javascript
// Sass
.m-tabs {
  background-color: #f2f2f2;

  @include reponse-to(medium) {
    background-color: #666;
  }
}

// Output
.m-tabs {
  background-color: #f2f2f2;
}
@media screen and (min-width: 600px) {
  background-color: #666;
}
```

这种使用案例是我最喜欢之一！

6.颜色的高级使用

现在事情变得有一点点困难了，让我们看看通过不同色调定义的颜色计划。

我们的`Sass map`在这个例子中定义了一个`$colorscheme`同时里面定义了很多对象拥有`keys`跟`values`。项目中拥有不同的灰色调，但我们不想为每一个都声明一个变量。所以我们增加了一个对象`gray`，然后通过键值对分割。

下面开始这个Map:

```javascript
// Scheme of colors
$colorscheme: (
  gray: (
    base: #ccc,
    light: #f2f2f2,
    dark: #666
  ),
  brown: (
    base: #ab906b,
    light: #ecdac3,
    dark: #5e421c
  )
);
```

现在让我们加入`setcolor`方法来获取颜色的不同选择。第一个参数是Sass map的对象(`$scheme`)-在这个例子中可能是`gray`或者`brown`，第二个参数就是你想要的颜色(`$tone`)，默认值是`base`。

```javascript
@function setcolor($scheme, $tone: base) {
  @return map-get(map-get($colorscheme, $scheme), $tone);
}
```

最后，这里给出了一个例子能够让你从这个map中获取不同颜色，比你想象中的还要简单（也许）！

```javascript
// Sass
.element {
  color: setcolor(brown);
}
.element--light {
  color: setcolor(brown, light);
}

// Output
.element {
  color: #ab906b;
}
.element--light {
  color: #ecdac3;
}
```

你会完成上面的挑战的，现在你能够创建一组色调而不需要通过为每一种颜色创建一个变量。

这个方法我是受到了[Tom Davies](http://erskinedesign.com/blog/friendlier-colour-names-sass-maps/)的启发，同时我也建议你看看他这篇文章。


## 通过Classes定制主题

这是为高级Sass用户准备的。在项目中会经常需要通过一些基础代码创建多套主题，所以这里给出一个建议：在文档的最开始就定义一个 *主题类* 来满足特定的工作。我们需要一个对象以便能够处理不同名字的主题，同时给出不同的样式模块。

### 定义themes

最开始，在你的项目中通过Sass map全局定义themes，`value`就是主题名字，同时这个类必须附在`body`元素。在这个例子中我创建了一个map`$themes`，里面有两个主题：`theme-light`和`theme-dark`。

```javascript
// _config.scss
$themes: (
  theme1: theme-light;
  theme2: theme-dark;
);
```

### 获取值（捷径）

现在我们需要一个方法来快速获取模块的值，这是一个简单的方法包括三个变量如下：

- `$map`: 定义map的名字确定values是从哪里来的
- `$object`: 在这里例子中就是theme的key
- `$style`: 需要的样式属性值

```javascript
// _functions.scss
@function setStyle($map, $object, $style) {
  @if map-has-key($map, $object) {
    @return map-get(map-get($map, $object), $style);
  }
  @warn "The key `#{$object}` is not available in the map.";
  @return null;
}
```

### 生成模块

现在我们创建新的`Sass Map`名称为`$config`，每一个主题都是一个对象同时名字必须是`$themes`中的`key`：不然将会报错。

```javascript
// _m-buttons.scss
// 1.Config
$config: (
  theme1: (
    background: #f2f2f2,
    color: #000
  ),
  theme2: (
    background: #666,
    color: #fff
  )
);
```

### 遍历主题

最后一部分会使用一点点技巧。开始的地方我们定义了一个模块`.m-button`然后我们期望在每个主题下面外观是不一样的。所以我们使用`@each`方法遍历Map`$themes`拿到`$key`跟`$value`。遍历之后就能够为不同主题创建map。

在这一节的开始我提到了`keys`在每个map里面必须是一样的(`$themes`跟`$config`)。因此我们必须检查map`$config`的key是否都来自map`$themes`，这里使用到了`map-has-key()`方法。如果包含了key那就继续往下执行，否则抛出错误给开发者。

```javascript
// _m-buttons.scss
// 2.Base
.m-button {
  @each $key, $value in $themes {
    @if map-has-key($config, $key) {
      .#{$value} & {
        background: setStyle($config, $key, background);
        color: setStyle($config, $key, color);
      }
    } @else {
      @warn "The key `#{$key} isn't defined in the map $config`"
    }
  }
}
```

通过上面的代码，让我们看看输出的结果。这是非常好的，保证了配置区域跟模块解耦。

```css
.theme-light .m-button {
  background: #f2f2f2;
  color: #000;
}
.theme-dark .m-button {
  background: #666;
  color: #fff;
}
```

最后你可以自己试试上面的代码看能不能运行出结果。也许对于你来说这个方案并不是最好的，你会寻求另外的方案，但是我依然希望这能够帮助你维持代码。

## 最后思考

在我看来 `Sass Maps`是Sass 3.3最值得介绍的特性。理由是我认为它给出了非常好的方式来创建健壮的结构，这只需要少量的配置。Sass maps使得我们可以在不影响整个项目的基础逻辑代码基础上改变值。开始使用它吧，你的伙伴将会感激你！

如果你已经开始使用`Sass maps`了，让我知道你如何在你的项目中使用它！


- 注1: 截至译文的Sass最新版本是3.4.19
