title: Flutter 性能优化：tree shaking 和延迟加载
subtitle: 如果你的 Flutter web app 体积太大，问题可能出现在这里
cover: https://img13.360buyimg.com/ling/jfs/t1/137509/3/11518/306482/5f773e58E4332ee37/58140ecd0d9481e2.png
category: Flutter
tags: 
  - Flutter
  - Flutter web
  - 性能优化
author:
  nick: Bruce
  github_name: zsjie
date: 2020-10-13 20:45:00

---

> 本文是 Flutter 性能优化系列文章之一，记录了 Flutter 团队优化 Flutter Gallery（https://gallery.flutter.dev/#/） 的实践。本文主要介绍了 tree shaking 和延迟加载在性能优化中的使用。原文链接：https://medium.com/flutter/optimizing-performance-in-flutter-web-apps-with-tree-shaking-and-deferred-loading-535fbe3cd67

在优秀的用户体验中，app 的加载速度扮演着重要角色。Flutter web app 的初次加载时间可以通过最小化 JS 包体积来提高。Dart 编译器自带 tree shaking 和延迟加载特性，这两者都可以最大程度地减少 JS 包体积。这篇文章介绍了这两个特性的工作原理，以及如何应用。

## 默认开启的 tree shaking 特性

编译 Flutter web app 时，JS 包是通过 dart2js 编译器生成的。一次 release 构建将会得到最高级别的优化，其中就包括了 tree shaking。
 
Tree shaking 是一个通过只将一定会被执行到的代码包含进来，从而剔除无用代码的过程。所以说，你不用担心你的 app 引用的各种库，因为没有用到的 class 或者 function 会被排除掉。
 
来看一下 tree shaking 的实际效果：

1. 创建一个 Dart 文件 greeter.dart :

```dart
abstract class Greeter {
  String greet(String name);
}

class EnglishGreeter implements Greeter {
   String greet(String name) => 'Hello $name';
}

class SwedishGreeter implements Greeter {
   String greet(String name) => 'Hej $name';
}

void main() {
  print(EnglishGreeter().greet('World'));
}
```

2. 执行 `dart2js -04 greeter.dart` 命令，然后看一下生成的文件 `out.js`。

在生成的 JS 代码中，没有 `SwedishGreeter` 类，也找不到 `Hej $name`，因为它们在 tree shaking 过程中被编译器移除了。
 
如果只通过静态分析，编译器只能找出哪些代码是会被执行，哪些不会被执行的。举个例子，假如 greeter 的定义依赖系统地区设置：

```dart
Locale locale = Localizations.localeOf(context);
if (locale.languageCode == 'sv') {
  greeter = SwedishGreeter();
} else {
  greeter = EnglishGreeter();
}
```

编译器不知道用户的系统地区设置，因此 `EnglishGreeter` 和 `SwedishGreeter` 都会被打包进去。对于这种情况，延迟加载可以帮助减少初始化的包体积。

## 延迟加载

延迟加载，也叫懒加载，允许你在需要时再加载各种库。它可以用来加载 app 中很少用到的功能。请注意延迟加载是一个 dart2js 特性，所以这个特性对移动端 Flutter app 不可用。在以下这个最简单的例子中，将包或者文件引入为 `deferred`，然后在使用时先等待加载：

```dart
import 'greeter.dart' deferred as greeter;

void main() async {
  await greeter.loadLibrary();
  runApp(App(title: greeter.EnglishGreeter().greet('World')));
}
```
 
在 Flutter 中，一切都是 widget，所以你可能会需要用到 `FutureBuilder`。因为一个 widget 的构建方法应该是同步的，因此你不能在一个构建方法中去 await loadLibrary 方法。但是，你可以在构建方法中返回一个 `FutureBuilder`，你也可以在等待加载库时使用它来显示不同的 UI：

```dart
import 'greeter.dart' deferred as greeter;

FutureBuilder(
  future: greeter.loadLibrary(),
  builder: (context, snapshot) {
    if (snapshot.connectionState == ConnectionState.done) {
      return Text(greeter.greet('World'));
    } else {
      return Text('Loading...');
    }
  },
)
```
 
你可以尝试运行这个仓库中完整的例子，打开 Chrome 开发者工具，然后点击网络 tab 查看网络活动。刷新页面来观察库是什么时候引入和加载的。在下面的截图中，文件 `main.dart.js_1.part.js` 的加载是延迟的：

![](https://img11.360buyimg.com/ling/jfs/t1/130096/40/11483/65643/5f772ac3Ebb8310be/570963ba04acf93e.png)

## Flutter Gallery 中的本地化延迟加载

Flutter Gallery 支持超过 70 中语言，但是大多数用户只用到一种。延迟加载本地化字符串是这个特性非常棒的应用。比如，实现了延迟加载本地化字符串之后，app 的初始化 JS 包体积减少了一半。如果你的 Flutter web app 中有很多本地化字符串，可以考虑一下延迟加载这些文件。gen_l10n.dart 脚本 使用了 --use-deferred-loading 选项来实现这个需求（目前只在 1.19 SDK master channel 上可用）。
 
这篇文章是我们在提高 Flutter Gallery 性能中学习到的系列内容之一。希望对你有所帮助，能让你学到可以在你的 Flutter app 中用上的内容。系列文章如下：
 
- Flutter 性能优化系列之 tree shaking 和延迟加载（本文）
- [Flutter 性能优化系列之图片占位符、预缓存和禁用导航过渡动画](https://github.com/zsjie/o2team.github.io/blob/v2/source/_posts/2020-10-13-improving-perceived-performance-with-image-placeholders-precaching-and-disabled-navigation.md)
- [Flutter 性能优化系列之打造高性能 widget](https://github.com/zsjie/o2team.github.io/blob/v2/source/_posts/2020-10-13-build-performant-flutter-widget.md)
