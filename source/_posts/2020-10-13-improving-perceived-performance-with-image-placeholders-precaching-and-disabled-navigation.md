title: Flutter 性能优化：图片占位符、预缓存和禁用导航过渡动画
subtitle: 学会这三个技巧，再也不会有性能指标明明很好，但用户说页面很慢了
cover: https://img12.360buyimg.com/ling/jfs/t1/135594/37/12191/132140/5f85a14aE67590738/c7a69fa4a8356a49.jpg
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

> 本文是 Flutter 性能优化系列文章之一，记录了 Flutter 团队优化 Flutter Gallery（https://gallery.flutter.dev/#/） 的实践。本文主要介绍了如何利用图片占位符、预缓存和禁用导航过渡动画提高用户感知性能。原文链接：https://medium.com/flutter/improving-perceived-performance-with-image-placeholders-precaching-and-disabled-navigation-6b3601087a2b

感知性能是指用户感觉 app 有多快（译者注：感性性能是用户视角，而不是指标）。这篇文章介绍了三个提高感知性能的策略：图片占位符、图片预缓存和禁用导航过渡动画。

## 利用图片占位符防止布局跳动

用户等待图片加载，在图片最终显示出来时，布局可能会跳来跳去。通过在布局中使用图片占位符，你可以避免这种跳动，来确保更好的用户体验。

以下这个 GIF 图展示了没有图片占位符时布局的跳动：

![在 DartPad 中查看完整例子](https://storage.360buyimg.com/ling-gif/1_Pp2MNotBJdSHDcW3Fhz19A_1601651160336_f4d.gif)

> [在 DartPad 中查看完整例子](https://dartpad.dev/embed-flutter.html?gh_owner=perclasson&gh_repo=flutter_code&gh_path=images_jumping_around/lib&theme=dark)

如果你的 app 中已经缓存了一个图片占位符，你可以使用  `FadeInImage`  widget 来显示占位符。如果你想使用一个 widget 而不是图片作为占位符，你可以使用  `Image.frameBuilder` 属性。

`Image.frameBuilder` 属性负责构建一个图片 widget ，它有四个参数：

- `context`：构建上下文
- `child`： widget 子元素
- `frame`：一个代码该 frame 的数字，如果图片还在加载中的话，为 `null` 
- `wasSynchronousLoaded` ：布尔值，图片加载完成后为 `true`

实现占位符 widget 时，首先要通过 `wasSynchronousLoaded` 检查图片是否已经加载完成，如果加载完成，返回  `child` 。如果没有，使用 `AnimatedSwitcher`  widget 来创建一个占位符到显示图片的渐现动画：

```dart
class ImageWidgetPlaceholder extends StatelessWidget {
  const ImageWidgetPlaceholder({
    Key key,
    this.image,
    this.placeholder,
  }) : super(key: key);
  
  final ImageProvider image;
  final Widget placeholder;
  
 @override
 Widget build(BuildContext context) {
   return Image(
     image: image,
     frameBuilder: (context, child, frame, wasSynchronousLoaded) {
       if (wasSynchronousLoaded) {
         return child;
       } else {
         return AnimatedSwitcher(
           duration: const Duration(milliseconds: 500),
           child: frame != null ? child : placeholder,
         );
       }
     },
   );
 }
}
```

有了占位符，布局再也不会跳来跳去了，而且图片也有了渐现效果：

![](https://storage.360buyimg.com/ling-gif/1_ZI2zrU2e21dkkHtn49qskw_1601652007411_237.gif)

> [在 DartPad 中查看完整例子](https://dartpad.dev/embed-flutter.html?gh_owner=perclasson&gh_repo=flutter_code&gh_path=images_with_placeholders/lib&theme=dark)

## 预缓存图片

如果你的 app 在显示图片界面之前有欢迎界面，你可以调用 `precacheImage` 方法来预缓存图片。

```dart
precacheImage(NetworkImage(url), context);
```

来看一下效果：

![](https://storage.360buyimg.com/ling-gif/1_iAiugn-WYkk7620I7TgMVg_1601652141979_7cd.gif)
> [在 DartPad 中查看完整例子](https://dartpad.dev/embed-flutter.html?gh_owner=perclasson&gh_repo=flutter_code&gh_path=precached_images/lib&theme=dark)


## 在 Flutter web app 中禁用导航过渡动画

导航过渡动画一般在用户切换页面时使用，在移动 app 中，这种方式可以很好地让用户知道知道自己在哪里。但是，在 web 中，很少看到这样的交互。所以为了提高感知性能，你可以禁用页面间的过渡动画。

默认情况下， `MaterialApp` 会根据不同平台来使用不同的过渡动画（Android 向上滑动，而 iOS 是向右（左）滑动）。为了覆盖这个默认行为，你需要创建自定义的 `PageTransitionsTheme` 类。你可以使用  kIsWeb 常量来判断 app 是否在 web 中运行。如果是，通过返回 `child` 来禁用过渡动画：

```dart
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

class NoTransitionsOnWeb extends PageTransitionsTheme {
  @override
  Widget buildTransitions<T>(
    route,
    context,
    animation,
    secondaryAnimation,
    child,
  ) {
    if (kIsWeb) {
      return child;
    }
    return super.buildTransitions(
      route,
      context,
      animation,
      secondaryAnimation,
      child,
    );
  }
}
```

设置 `MaterialApp` 的 `pageTransitionsTheme` 选项：

```dart
MaterialApp(
  theme: ThemeData(
    pageTransitionsTheme: NoTransitionsOnWeb(),
  ),
)
```

没有任何过渡动画的页面切换效果如下：

![](https://storage.360buyimg.com/ling-gif/1_Db6XWyMRM9gGhSEpHY6w7A_1601652397748_bad.gif)

> [在 DartPad 中查看完整的交互例子](https://dartpad.dev/embed-flutter.html?gh_owner=perclasson&gh_repo=flutter_code&gh_path=precached_images/lib&theme=dark)

## 结语

希望你在本文中找到一些有用的技巧来提高 Flutter web app 的感知性能。在 [Flutter Gallery](https://gallery.flutter.dev/#/) 中，我们禁用了 web 端的导航过渡动画和使用了图片占位符来避免加载页面时布局的跳动，其中的实现和本文所描述的是类似，如果你想看代码，可以在 [GitHub](https://github.com/flutter/gallery) 上找到。

感谢阅读！

这篇文章是我们在提高 [Flutter Gallery](https://gallery.flutter.dev/#/) 性能中学习到的系列内容之一。希望对你有所帮助，能让你学到可以在你的 Flutter app 中用上的内容。系列文章如下：

- [Flutter 性能优化系列之 tree shaking 和延迟加载](https://medium.com/flutter/optimizing-performance-in-flutter-web-apps-with-tree-shaking-and-deferred-loading-535fbe3cd674)
- Flutter 性能优化系列之图片占位符、预缓存和禁用导航过渡动画（本文）
- [Flutter 性能优化系列之打造高性能 widget](https://medium.com/flutter/building-performant-flutter-widgets-3b2558aa08fa)

