title: Flutter 性能优化：打造高性能 widget
subtitle: 一行代码改动，两倍性能提升，高性能 widget 的秘密在哪里？
cover: https://img14.360buyimg.com/ling/jfs/t1/113765/32/19204/157135/5f774c2cEaa464955/444df45bd035fa91.png
category: Flutter
tags: 
  - Flutter
  - Flutter web
  - 性能优化
author:
  nick: Bruce
  github_name: zsjie
date: 2020-10-13 20:00:00

---

> 本文是 Flutter 性能优化系列文章之一，记录了 Flutter 团队优化 Flutter Gallery（https://gallery.flutter.dev/#/） 的实践。本文主要介绍了如何打造高性能的 widget。原文链接：https://medium.com/flutter/building-performant-flutter-widgets-3b2558aa08fa

![](https://img14.360buyimg.com/ling/jfs/t1/113765/32/19204/157135/5f774c2cEaa464955/444df45bd035fa91.png)

所有无状态和有状态 widget 都会实现 `build()` 方法，这个方法决定了它们是如何渲染的。app 中的一屏就可能有成百上千个部件，这些部件可能只会构建一次，或者在有动画或者某种特定的交互情况下，也有可能构建多次。如果想构建快速的 widget，你一定要很谨慎地选择构建哪些 widget，以及在什么时候构建。

这篇文章主要讨论只构建必要的和只在必要时构建，然后会分享我们是如何使用这个办法来显著提高 Flutter Gallery 的性能。我们还会分享一些高级技巧用于诊断你的 web app 中类似的问题。

## 只在必要时构建

一个重要的优化方法是，只在绝对必要时才构建 widget。

### 谨慎地调用 `setState()`

调用 `setState` 方法会引起 `build()` 方法调用。如果调用太多次，会使性能变慢。

看一下下面的动画，显示在前面的黑色 widget 向下滑动，露出后面类似棋盘的面板，类似于 [bottom sheet](https://material.io/components/sheets-bottom) 的行为。前面黑色 widget 很简单，但是后面的 widget 很忙碌。

![](https://storage.360buyimg.com/ling-gif/0_Bm6-mK_lPlO1deUS_1601653996742_c7a.gif)

```dart
Stack(
   children: [
     Back(),
     PositionedTransition(
       rect: RelativeRectTween(
         begin: RelativeRect.fromLTRB(0, 0, 0, 0),
         end: RelativeRect.fromLTRB(0, MediaQuery.of(context).size.height, 0, 0),
       ).animate(_animationController),
       child: Front(),
     )
   ],
 ),
```

你可能会像以下这样写父 widget，但在这个场景下，这样是错误的：

```dart
// BAD CODE
@override
void initState() {
  super.initState();
  _animationController = AnimationController(
    duration: Duration(seconds: 3),
    vsync: this,
  );
  _animationController.addListener(() {
    setState(() {
      // Rebuild when animation ticks
    });
  });
}
```

这样性能并不好。为什么？因为动画在做不必要的工作。

![](https://storage.360buyimg.com/ling-gif/0_Q4WC3xmG1iRG1-lp_1601654183332_a6b.gif)

以下是有问题的代码：

```dart
// BAD CODE
_animationController.addListener(() {
  setState(() {
    // Rebuild when animation ticks.
  });
});
```

- 这种类型的动画只在你需要让整个 widget 动起来时才推荐使用，但这并不是我们在这种布局中需要的。
- 在动画监听器中调用 `setState()` 会引起整个 `Stack` 重新构建，这是完全没必要的
- `PositionedTransition` 部件已经一个 `AnimatedWidget` 了，所以它会在动画开始的时候自动重新构建
- 不需要在这里调用 `setState()` 

![](https://storage.360buyimg.com/ling-gif/0_Bm6-mK_lPlO1deUS_1601653996742_c7a.gif)

即使后面的组件是很忙碌的，前面的组件动画也可以达到 60 FPS。更多有关合理地调用  `setState` 方法的内容，请看 [Flutter 卡顿的动画：你不该这样 setState](https://medium.com/flutter-community/flutter-laggy-animations-how-not-to-setstate-f2dd9873b8fc)

## 只构建必要的部分

除了只在必要的时候进行构建，你还需要只构建 UI 中变化的部分。接下来的章节主要关注如何创建一个高性能的 list。

### 优先使用 ListView.builder()

首先，让我们简单地看看显示 list 的基础：

- 竖 list 使用 `Column`
- 如果 list 需要滚动，使用 `ListView`
- 如果 list 有很多 item，使用  `ListView.builder`，这个方法会在 item 滚动进入屏幕的时候才创建 item，而不是一次性创建所有的 item。这在 list 很复杂和 widget 嵌套很深的情况下，有明显的性能优势。

为了解释多 item 情况下 `ListView.builder` 相较于 `ListView` 的优势，我们来看几个例子。

在这个 [DartPad 例子](https://dartpad.dev/e41ed2678b9b9d7347880c20ec49f3f2)中运行以下 `ListView`。你可以看到 8 个 item 都创建好了。（点击左下角的 **Console** 按钮，然后点击**Run**按钮。右边的输出面板没有滚动条，但是你可以滚动内容，然后通过控制台看到什么被创建了以及什么时候进行构建）

```dart
ListView(
  children: [
    _ListItem(index: 0),
    _ListItem(index: 1),
    _ListItem(index: 2),
    _ListItem(index: 3),
    _ListItem(index: 4),
    _ListItem(index: 5),
    _ListItem(index: 6),
    _ListItem(index: 7),
  ],
);
```

接下来，在这个 [DartPad 例子](https://dartpad.dev/1ae687f1c0d17eb80c8e28a70fb5b8d1)中运行 `ListView.builder`。你可以看只有可见的 item 被创建了，当你滚动时，新的 item 才被创建。

```dart
ListView.builder(
  itemBuilder: (context, index) {
    return _ListItem(index: index);
  },
  itemCount: 8,
);
```

现在，运行[这个例子](https://dartpad.dev/a338a69afea04f746015861cd55782db)。在这里例子中，`ListView`的孩子都是提前一次性创建好的。在这种场景下，使用 `ListView` 的效率更高。

```dart
final listItems = [
  _ListItem(index: 0),
  _ListItem(index: 1),
  _ListItem(index: 2),
  _ListItem(index: 3),
  _ListItem(index: 4),
  _ListItem(index: 5),
  _ListItem(index: 6),
  _ListItem(index: 7),
];
@override
Widget build(BuildContext context) {
  // 这种情况下 ListView.builder 并不会有性能上的好处
  return ListView.builder(
    itemBuilder: (context, index) {
      return listItems[index];
    },
    itemCount: 8,
  );
}
```

更多有关延迟构建 list 的内容，请看 [Slivers, Demystified](https://medium.com/flutter/slivers-demystified-6ff68ab0296f)。

## 怎样通过一行代码，提升超过两倍的性能

[Flutter Gallery](https://gallery.flutter.dev/#/) 支持超过 100 个地区；这些地区，可能你也猜到了，是通过 `ListView.builder()` 来展示的。通过查看 widget 重新构建的次数，我们注意到这些 item 会在启动时进行不必要的构建。这个情况有点难发现，因为这些 item 藏在折叠了两层的菜单下：设置面板和地区列表。（后来我们发现，因为使用了 `ScaleTransitioin` ，设置面板在不可见状态下也会进行渲染，意味着它会不断地被构建）。

![](https://img10.360buyimg.com/ling/jfs/t1/154038/20/1363/231571/5f774ffcEf0fae853/7ee6ad005f31b4e6.png)

通过简单地将 `ListView.builder` 的 `itemCount` 在未展开状态下设置为 `0`，我们确保了 item 只会在展开的、可见的设置面板中才进行构建。这一行改动提高了在 web 环境下渲染时间将近两倍，其中的关键是定位过度的 widget 构建。

## 如何查看 widget 的构建次数

虽然 Flutter 的构建是很高效的，但是也会出现过度构建导致性能问题的情况。有几种方法可以帮助定位过度的 widget 构建：

### 使用 Android Studio/IntelliJ

Android Studio 和 IntelliJ 开发者可以使用自带的工具来[查看 widget 重新构建信息](https://flutter.dev/docs/development/tools/android-studio#show-performance-data)。

### 修改 Flutter 框架本身

如果使用的不是以上的编辑器，或者希望可以知道 web 环境下 widget 的重新构建次数，你可以在 Flutter 框架中加入几行简单的代码。

先看一下输出效果：

```
RaisedButton 1
RawMaterialButton 2
ExpensiveWidget 538
Header 5
```

先定位到文件：`<Flutter path>/packages/flutter/lib/src/widgets/framework.dart` ，然后加入以下代码。这些代码会在启动时统计 widget 的构建次数，并在一段时间（这里设置的是 10 秒）后输出结果。

```dart
bool _outputScheduled = false;
Map<String, int> _outputMap = <String, int>{};
void _output(Widget widget) { 
  final String typeName = widget.runtimeType.toString();
  if (_outputMap.containsKey(typeName)) {
    _outputMap[typeName] = _outputMap[typeName] + 1;
  } else {
    _outputMap[typeName] = 1;
  }
  if (_outputScheduled) {
    return;
  }
  _outputScheduled = true;
  Timer(const Duration(seconds: 10), () {
    _outputMap.forEach((String key, int value) {
      switch (widget.runtimeType.toString()) {
        // Filter out widgets whose build counts we don't care about
        case 'InkWell':
        case 'RawGestureDetector':
        case 'FocusScope':
          break;
        default:
          print('$key $value');
      }
    });
  });
}
```

然后，修改 `StatelessElement` 和 `StatelessElement` 的 `build` 方法来调用 `_output(widget)`。

```dart
class StatelessElement extends ComponentElement {
  ...
@override
  Widget build() {
    final Widget w = widget.build(this);
    _output(w);
    return w;
   }
class StatefulElement extends ComponentElement {
...
@override
  Widget build() {
    final Widget w = _state.build(this);
    _output(w);
    return w;
  }
```

你可以在这里查看修改后的 [framework.dart 文件](https://gist.github.com/guidezpl/54f9a03b0adbf207153178dba0bf214c)。

需要注意的是，几次重新构建不一定会引起问题，但是这个办法可以通过验证不可见的 widget  是否在构建来帮你 debug 性能问题。

web 专用 tips：你可以添加一个 `resetOutput` 函数（可以在浏览器的控制台中调用）来获取随时获取 widget 的构建次数。

```dart
import 'dart:js' as js;
 
void resetOutput() {
 _outputScheduled = false;
 _outputMap = <String, int>{};
}
void _output(Widget widget) {
  // Add this line
  js.context['resetOutput'] = resetOutput;
  ...

```  

查看修改后的 [framework.dart 文件](https://gist.github.com/guidezpl/32518a6d22596393fa368c28e8f0ece4)。

## 结语

高效的性能调优需要我们明白底层的工作原理。文章里的 tips 可以帮助你决定什么时候构建 widget 来使你的 app 在所有场景都保持高性能。

这篇文章是我们在提高 [Flutter Gallery](https://gallery.flutter.dev/#/) 性能中学习到的系列内容之一。希望对你有所帮助，能让你学到可以在你的 Flutter app 中用上的内容。系列文章如下：

- [Flutter 性能优化系列之 tree shaking 和延迟加载](https://github.com/zsjie/o2team.github.io/blob/v2/source/_posts/2020-10-13-optimizing-performance-in-flutter-web-apps-with-tree-shaking-and-deferred-loading.md)
- [Flutter 性能优化系列之图片占位符、预缓存和禁用导航过渡动画](https://github.com/zsjie/o2team.github.io/blob/v2/source/_posts/2020-10-13-improving-perceived-performance-with-image-placeholders-precaching-and-disabled-navigation.md)
- Flutter 性能优化系列之打造高性能 widget（本文）

你还可以查看适用所有水平开发者的 [Flutter UI 性能文档](https://flutter.dev/docs/perf/rendering/ui-performance)。
