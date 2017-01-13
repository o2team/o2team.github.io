title: 移动端使用 Video 标签播放视频
subtitle: 介绍一些移动端使用 Video 标签满屏播放视频的实践经验
cover: //misc.aotu.io/booxood/mobile-video/cover_900x500.jpg
categories: Web开发
tags:
  - HTML5
  - Video
author:
    nick: Avin
    github_name: booxood
wechat:
    share_cover: http://misc.aotu.io/booxood/mobile-video/cover_200x200.jpg
    share_title: 移动端使用 Video 标签播放视频
    share_desc: 介绍一些移动端使用 Video 标签满屏播放视频的实践经验
date: 2017-1-11 18:36:37

---

<!-- more -->

随着 4G 的普遍以及 WiFi 的广泛使用，手机上的网速已经足够稳定和高速，以视频为主的 HTML5 也越来越普遍了，相比帧动画，视频的表现更加丰富，前段时间开发了一个以视频为主的移动端 HTML5，在这里介绍一些实践经验。

## 统一播放效果

我们希望视频播放时可以全屏播放，没有进度条、播放按钮等与系统相关的元素，可以在视频上方增加自定义的元素（比如一个跳过按钮），类型下面的效果：

![预期效果][1]

在不同的操作系统（主要就是 iOS 和 Android），为了达到比较统一的播放效果，分别对其进行兼容。

**iOS**

在 iOS 上，APP 都是使用的系统自带的浏览器进行页面渲染，video 播放视频的效果是统一的，只需要考虑不同的 iOS 版本是否有不一致的地方。在 iOS 上，播放视频默认会弹出一个播放器全屏播放视频，如下效果

![iOS上全屏播放的效果][2]

播放器上下有的系统默认的控制栏，可以控制视频的播放进度、音量以及暂停或继续播放，播放视频时，视频会 “浮” 在页面上，页面上的所有元素都只能是在视频下面，这种效果显然不是我们想要的。
但好在 iOS 10 Safari 中，`video` 新增了 `playsinline` 属性，可以使视频内联播放。

在 [webkit 的 blog](https://webkit.org/blog/6784/new-video-policies-for-ios/) 上提到
> A note about the playsinline attribute: this attribute has recently been added to the HTML specification, and WebKit has adopted this new attribute by unprefixing its legacy webkit-playsinline attribute. This legacy attribute has been supported since iPhoneOS 4.0, and accordance with our updated unprefixing policy, we’re pleased to have been able to unprefix webkit-playsinline.

iOS 10 之前的版本支持 webkit-playsinline，但是加了这个属性后，在 iOS 9 的上出现**只能听到声音不能看到画面的问题**，最后使用的标签代码

```html5
<video id="video" class="video" preload="auto" playsinline src="http://wqs.jd.com/promote/superfestival/superfestival.mp4" width="1" height="1" type="video/mp4"></video>
```

然后再加上这个库 [iphone-inline-video](https://github.com/bfred-it/iphone-inline-video)一起使用。

**Android**

在 Android 上，因为各个软件使用的浏览器渲染引擎不一样，所以视频播放的效果差异也很大，这里主要以微信为主。微信使用的是自带的渲染引擎 TBS，默认的播放效果

![Android上默认的效果][3]

在播放器的下方也是会有控制栏，视频也会 “浮” 在页面上。而 Android 是不支持 `playsinline` 属性使视频内联播放的。但是，如果你看过一些腾讯的视频类 HTML5，会发现它们在微信里是可以内联播放的，而这个功能是需要申请加入白名单的。

不过新版的 TBS 内核（>=036849）支持一个叫 `同层播放器` 的视频播放器，这个不需要申请白名单，只需给 `video` 设置两个属性 `x5-video-player-type="h5"` 和 `x5-video-player-fullscreen="true"`，播放效果

![Android上同层播放器效果][4]

当点击左上角的箭头的时，会退出播放

![Android上同层播放器退出][5]

退出播放时，我们需要做相应的处理。TBS 有提供相应的事件，不过不同的版本有一点差异

|                 |  TBS < 036849   | 036849 <= TBS < 036900 | 036900 <= TBS |
| ------| :------:| :------: | :------: |
| 是否支持同层播放器 | 否 | 是  | 是 |
| 退出全屏播放时触发 | | x5videoenterfullscreen  | x5videoexitfullscreen |
| 进入全屏播放时触发 | | x5videoexitfullscreen | x5videoenterfullscreen |

通过监听这两个事件就可以知道当前的播放状态

```js
document.getElementById('video').addEventListener("x5videoexitfullscreen", function(){
  alert("exit fullscreen")
})

document.getElementById('video').addEventListener("x5videoenterfullscreen", function(){
  alert("enter fullscreen")
})
```

> 在对话框中发送 `//gettbs` 可以查看相关信息，`tbsCoreVersion` 就是当前安装的 TBS 内核版本。

## video 的事件

`video` 支持的事件很多，但在有些事件在不同的系统上跟预想的表现不一致，在尝试比较之后，使用 `timeupdate` 和 `ended` 这两个事件基本可以满足需求

```js
video.addEventListener('timeupdate', function (e) {
  console.log(video.currentTime) // 当前播放的进度
})

video.addEventListener('ended', function (e) {
  // 播放结束时触发
})
```

## 视频居中

视频的宽高比是固定的，而手机的屏幕宽高比则不是，所以，为了让观看到的视频的体验尽可能一致，以宽度为先，进行适配

```js
function handleResize() {
  var sWidth = 9
  var sHeight = 16
  var width = window.innerWidth
  var height = window.innerHeight
  var marginTop = height - (width * sHeight) / sWidth

  marginTop = Math.round(marginTop)
  if (marginTop < -2) {
    video.$wrapper.css('marginTop', marginTop / 2 + 'px')
  } else {
    video.$wrapper.css('marginTop', '0')
  }
}
```

## 代码示例

[代码仓库](https://github.com/o2team/elf/tree/master/templates/video)

> 代码基于 [`ELF`](https://github.com/o2team/elf) 构建，运行示例需要 [安装 ELF](https://github.com/o2team/elf#安装)，欢迎试用反馈。

## 参考

- https://www.w3.org/wiki/HTML/Elements/video
- http://caniuse.com/#search=video
- https://developer.mozilla.org/zh-CN/docs/Web/Guide/Events/Media_events
- http://zhaoda.net/2014/10/30/html5-video-optimization
- https://webkit.org/blog/6784/new-video-policies-for-ios/
- https://github.com/bfred-it/iphone-inline-video

  [1]: //misc.aotu.io/booxood/mobile-video/iphone-ok.jpg
  [2]: //misc.aotu.io/booxood/mobile-video/iphone-fullscreen.jpg
  [3]: //misc.aotu.io/booxood/mobile-video/android-default.jpg
  [4]: //misc.aotu.io/booxood/mobile-video/android-fullscreen.jpg
  [5]: //misc.aotu.io/booxood/mobile-video/android-exist.jpg
