title: JDRD开发小结
subtitle: JDR DESIGN 是京东零售设计中台的门户站点。
cover: http://storage.360buyimg.com/jdrd-blog/poster.png
categories: 项目总结
tags:
  - web
  - JDRD
author:
  nick: 清汤饺子
  github_name: jiaozitang
date: 2020-02-21 15:24:00
---

> 经过一个月的时间，在我遇到了很多“这个我不会做啊？”，“这个到底怎么做“的问题后，它终于成功上线了！下面总结一下整整一个月的时间我是如何开发JDRD，遇到的各种问题以及解决方案。


[JDR DESIGN](https://jdrd.jd.com/) 是京东零售设计中台的门户站点，展示京东零售设计服务平台的产品以及应用场景，特点是动效丰富、图片细节多、要求整站文案和外链可配置。项目最大的困难就是动效开发复杂和开发排期紧凑的问题。

这是我入职以来负责的第一个项目，需要花大量时间来熟悉新的开发流程，项目排期非常紧凑，并且在排期完后又新增了窄版、骨架屏、首页图标动效、入场动画、产品页头部动效等新的需求，每天高强度的加班，回想起来虽然很难，但是非常有挑战性，非常有收获。

![首页](http://storage.360buyimg.com/jdrd-blog/1.gif)
![场景页](http://storage.360buyimg.com/jdrd-blog/2.gif)

# 项目架构
## 技术选型
作为一个 9012 年的 PC 端项目，我们自然也需要非常先进的技术选型来帮助我们提升研发生产力，所以一个优秀的前端框架和一个高效的前端工程化工具，自然是必不可缺的选择。选择团队自研的 [Nerv](https://nerv.aotu.io/) 进行开发，[Nerv](https://nerv.aotu.io/) 是一个基于 virtual dom 的类 Reac t组件框架，比 React 更小的体积更高的性能，还保持了对 IE 浏览器的兼容，满足了 JDRD 需要兼容IE10的要求。

自动化前端构建工具选择了团队自研的前端工程化工具 [Athena](https://github.com/o2team/athena2)，简化 webpack 配置工作，帮助我们在项目中实现自动化编译、代码处理、依赖分析、文件压缩、文件 MD5 戳等需求。

## 项目整体架构
在前端架构方面，根据上述的技术选型以及常见的前端体系，基于本项目的需求进行了些调整，整体架构设计如下：

![图片](http://storage.360buyimg.com/jdrd-blog/jiagou.png)

Athena 和 Nerv 上文已经介绍过，下面介绍一下另外几个：

* 通用工具库：基于以往的项目建立的公共函数库，包括 Slider、Lazyimg、Lazyload、Nerv-loadable 等。
* NEOS 管理平台：将整站的文案和外链数据放在 NEOS 平台进行管理，简化文案修改等工作。
* 兜底展示：
  * 在请求到错误链接时重定向到 error.html 页面
  * 图片加载失败时展示兜底图
* MTA 数据分析：将网站的所有点击事件添加埋点进行数据上报，根据实时数据统计分析服务，监控版本质量、渠道状况、用户画像属性及用户细分行为。

# 开发过程
整个开发流程总结如下图所示：

![图片](http://storage.360buyimg.com/jdrd-blog/liuchen.png)

既然是总结，开发过程中的流程当然没有这么完整，漏掉了一部分（已红色标注），导致开发到后面因为前面漏掉的环节，浪费了很多的时间。

* 整站设计规范：由于开发和设计是同时进行的，开始开发时只有首页定稿，没有其他页面的设计稿，以及窄版的规范，我们应该在开发前和设计师明确整站的设计规范，根据设计规范建立通用样式表，整站引入。
* 页面&楼层结构：楼层的结构设计对于后续做楼层懒加载非常重要，根据设计稿的功能结构区分楼层。
* 兼容 IE：JDRD 是需要兼容 IE 的，一些不兼容 IE 的 API 和样式属性应该尽量避免使用。
* 骨架屏：骨架屏的高度和楼层间隔和内容是一致的，应该建立公共类，定义骨架屏和内容一致的样式，在后续调整内容时，不需要再去调整一遍骨架屏的样式。

数据埋点：交互稿其实有详细介绍哪些地方需要点击跳转的事件，开发时应该在定义点击跳转时就给数据埋点传参。

除了在开发流程中的问题外，最头疼的就是动效的开发了，下文会详细介绍。

# 项目优化
## 性能优化
性能优化的初衷就是加快网站的加载速度，让用户能够更快的看到内容，上面介绍到前端工程化工具 Athena 已经做到合并、压缩了静态资源文件，那还有什么方法能够缩小请求的静态资源体积，加快首屏的加载速度呢，我们尝试了以下性能优化手段。

### 楼层懒加载
楼层懒加载就是按楼层划分组件，并进行代码切割，在页面滚动时按需加载组件。

Nerv-loadable 是一个专门用于动态 import 的 React 高阶组件，你可以把任何组件改写为支持动态 import 的形式，利用 import() 来进行动态加载。

```
const NewsBannerLoadable = Loadable({
  loader: () =>
    import(/* webpackChunkName: "news_banner" */
    './news_banner'),
  loading: loadingPlaceholder.bind(null, loadingBlock),
  delay: 0
});
```

上面的代码在首次加载时，会先展示一个 loadingBlock，然后动态加载 news_banner 的代码，组件代码加载完毕之后，便会替换掉 loadingBlock。
Lazyload 通过监听 window 对象或者父级对象的 scroll 事件，触发 load，实现懒加载，让组件进入页面可视区时才加载该组件。需要注意的是 lazyload 需要设置高度，才会撑起懒加载的区域。

```
<Lazyload {...this.lazyloadOptions} height={this.floorHeight.newsBanner}>
    <NewsBannerLoadable />
</Lazyload>
```

以首页为例，有四处组件是不需要首次加载的，而是使用动态加载：多端适配、物料、应用场景、设计思考。首次加载实际上只需要加载首屏的头部、视频、banner 即可。切分之后，首屏 js 体积缩减了 50KB。
![图片](http://storage.360buyimg.com/jdrd-blog/3.gif)

### 图片懒加载
整站图片非常多，为了保持清晰度而且全部采用二倍图引入，消耗资源比较大，为了加快加载速度，我们选择让滚动条滚动到图片的可视区后才加载该图片。

使用 Lazyload 实现，和上述组件懒加载介绍的一样，<Lazyload></Lazyload> 包裹着需要懒加载的图片，就可以实现图片懒加载。

图片懒加载之外还有个优化，就是图片加载中、加载失败、加载成功的状态的判断，根据不同状态展示图片的内容。

使用 Lazyimg 实现这个功能：

* 使用 new Image() 创建一个新的 [HTMLImageElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) 实例
* img.onload()，img.onerror() 捕获到图片加载成功或者失败的状态
  * 加载中：显示兜底图
  * 加载成功：显示加载到的图片
  * 加载失败：显示兜底图

![图片](http://storage.360buyimg.com/jdrd-blog/doudi.gif)

### 其他优化手段
除了上面两点外，还可以从 webpack 打包进行性能优化，webpack 打包后会生成一个或多个包含源代码最终版本的“打包好的文件”，它们由 [chunks](https://webpack.js.org/glossary/#c) 组成，[SplitChunks](https://webpack.js.org/plugins/split-chunks-plugin/) 插件可以将公共依赖项提取到现有的 entry chunk 或全新的代码块中，进行代码切割，减小 chunks 包的大小。

## 体验优化
### 骨架屏
以往的传统网站一般会在加载中展示一个 loading 态，也可以达到占位的效果，但是 loading 动画和真实模块耦合度低，界面效果不够优美，JDRD 则是选用骨架屏进行占位，以灰色豆腐块的形式尽量缩小真实模块结构与加载占位之间的视觉差异。

骨架屏的两个用途：

* 组件加载完之前的占位

使用 Lazyload 懒加载楼层组件，加载中使用 Loadable 提前占位，占位符设置为骨架屏。

* 数据加载完之前的占位

设置组件的 state.loaded 初始值为 false ，数据加载成功时 state.loaded = true ，render 函数里如果 loaded === false ，则显示骨架屏。

骨架屏的实现方式有两种，一是下载并引入骨架屏插件（如 [antd](https://ant.design/components/skeleton-cn/) ），根据不同模块引入对应的骨架屏组件，这种方式和 loading 动画一样，耦合度低，但是全局通用，节省代码量。二是根据视觉稿写骨架屏的样式。JDRD 选择的是第二种，骨架屏和真实模块实现高度耦合。每个页面结构不一样，对应的骨架屏也是完全不同，骨架屏暂时不能抽成公共组件全局通用。

![图片](http://storage.360buyimg.com/jdrd-blog/gujiapin.gif)

### 宽窄版
首页定稿设定的宽度为 1240px ，对小屏不够友好，我们增加了一版窄版样式兼容小屏。

宽版和窄版开发的重点是定好通用的变量，包括字号粗细、宽窄版宽度、窄版尺寸比。这些通用样式规范需要和设计师统一规范，兼容窄版的开发就会变得非常简单。

只需要在两个地方判断宽窄版，给最顶层的标签加上 wide/narraw 类，在 narrow 下添加窄版的自定义样式。

1. 在页面刚加载到时判断宽窄版，在加载到样式表之前给 html 标签添加 wide/narraw

```
!function(e) {
  window.pageConfig = {};
  pageConfig.isWide = function() {
  var n = e,
  i = document,
  o = i.documentElement,
  t = i.getElementsByTagName("body")[0],
  a = n.innerWidth || o.clientWidth || t.clientWidth;
  return a >= 1300
  } ();
  var n = [];
  pageConfig.isWide ? (n.push("wide")) : n.push("narrow");
  var i = document.getElementsByTagName("html")[0];
  i.className = n.join(" ")
} (window, void 0);
```

2. 文档视图调整大小时判断宽窄版，修改 html 标签的 className

先引入 Events.js ，然后在 componentDidMount 里生命周期函数里绑定 ' isWideChange ' 事件，在文档视图宽度达到宽窄版临界点时调用。

```
componentDidMount() {
  window._.eventCenter.on('isWideChange', evt => {
    this.setState({//更新state,更新视图
      isWide: evt.detail.isWide
    });
  });
}
```

## 动效开发
### 首页图标动效
为了突出设计理念，首页图标动效包含大量位移、旋转、缩放、形变、路径动画等细节，由始末动画+循环动画合成，传统做法是 css3 实现，这需要逐帧写动画细节，工作量非常大，我们尝试使用 [Lottie](https://airbnb.design/lottie/) 直接解析从 AE 导出的 json 格式的动画（方案由燕婷提出），发现能够完全还原AE动画。

[Lottie](https://airbnb.design/lottie/) 是 Airbnb 开源的一套跨平台的完整的动画效果解决方案，可实时渲染 After Effects 动画，从而使应用程序可以像使用静态图像一样轻松地使用动画。这样实现起来就非常简单了。分以下两步：

1. 在 AE 软件中用 [bodymovin](https://github.com/airbnb/lottie-web/blob/master/build/extension/bodymovin.zxp) 插件将动画导出为 json 文件
2. 在项目中使用 [lottie-web](https://github.com/airbnb/lottie-web) 将 json 格式的动画解析为 SVG（[使用文档](https://github.com/airbnb/lottie-web)）

lottie-web 文档中的方法非常全面，JDRD 图标动效使用加载动画、播放指定帧区间、反向播放动画方法，就实现了起始动画 20 帧+循环动画 60 帧+起始动画反向播放 20 帧的动画合成操作。

项目示例代码如下：

```
npm install lottie-web //安装lottie-web
import lottie from 'lottie-web' //引入lottie-web到项目中
//lottie-web常用方法
this.anim = lottie.loadAnimation({ //加载动画
  container: element, 
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'data.json'
});
this.anim.playSegments([[0,60]], true); //播放指定帧区间
this.anim.setDirection(-1);//动画反向播放
this.anim.play();//播放动画
this.anim.pause()//暂停动画
```

经过以上两步，[Lottie](https://airbnb.design/lottie/) 已经将一个 AE 格式的动画渲染在 web 页面上。
![图片](http://storage.360buyimg.com/jdrd-blog/ae.png)

![图片](http://storage.360buyimg.com/jdrd-blog/iconAnim1.gif)

![图片](http://storage.360buyimg.com/jdrd-blog/iconAnim2.gif)

这里有 2 个需要注意的点：

1. json 文件的引入要使用 CDN，引入本地 json 文件会解析失败。
2. 如果动画源文件中有引入图片文件，[bodymovin](https://github.com/airbnb/lottie-web/blob/master/build/extension/bodymovin.zxp) 导出的动画为 json+img。图片动画的兼容性有待确认。

以上就是用 [Lottie](https://airbnb.design/lottie/) 实现的动画，看到这里，是不是觉得 so easy，但是 [Lottie](https://airbnb.design/lottie/) 并不是万能的，不能解析所有的动画特性，开发前需要先看下[支持列表](http://airbnb.io/lottie/#/supported-features)。并和设计师确认是否都支持。

### 入场动画
JDRD 整站采用了骨架屏占位，那么入场动画最大的问题就是如何让它不和骨架屏冲突，解决方法就是楼层懒加载里面，再加一层入场动画的组件懒加载，两层懒加载的设置 offset 差，就可以做到在可视区外加载楼层组件，在可视区内播放入场动画。具体实现如下：

1. 楼层懒加载，在页面滚动时按需加载楼层组件

```
// 在距离底部200px时，加载楼层组件
getMaterialLoadable(){
  return this.getFloor(
    <Lazyload lazyloadOptions={offset: 200} height={1000}>
      <MaterialLoadable />
    </Lazyload>
  );
}
```

2. 楼层中的入场动画组件懒加载

```
// 在距离底部-200px时，加载入场动画组件，这时因为楼层组件已经加载过了，页面显示是真实组件而不是骨架屏
<Lazyload lazyloadOptions={offset: -200}>
  <div className="w">
    <IndexTitle showLine={true} title={this.state.title}></IndexTitle>
    {this.renderMaterial()}
  </div>
</Lazyload>
```

另外一个难点是序列动画的效果，序列动画就是将列表元素的动画执行时机错开，具体实现参考[css3 animation 属性众妙](https://aotu.io/notes/2016/11/28/css3-animation-properties/)。实现代码如下：

```
@for $i from 1 to 6 {
  .list__item:nth-child(#{$i}) {
    animation-delay: (-1+$i)*0.1s; /*计算每个元素的 animation-delay */
  }
}
```

![入场动画](http://storage.360buyimg.com/jdrd-blog/1.gif)

### 产品页头部动效
产品页的头部动效分两部分，氛围动效 + 波浪动效。

* 氛围动效

氛围动效的实现比较简单，也是使用 Lottie 实现，这里遇到了 Lottie 不支持的特性，就是渐变，对于不支持的特性，我们可以拿到需要自定义样式的标签的 id，自定义样式，如图所示：

![图片](http://storage.360buyimg.com/jdrd-blog/wuliao.png)

```
#__lottie_element_369 {
  stop[offset="0%"] {
    stop-color:  #FDFDFF;
  }
  stop[offset="100%"] {
    stop-color: #F7F7FB;
  }
}
```

自定义样式的时候，这里有个坑一定要注意，SVG 的 ID 是会变的，例如开发时，这个 ID 是 100，测试时这个 ID 有可能变成 101，这个是偶现的，目前还没有找到 ID 值 + 1 的原因，但是为了让自定义的样式生效，需要给 ID 为 100 和 ID 为 101 的标签都加上样式。

![图片](http://storage.360buyimg.com/jdrd-blog/6.gif)

* 波浪动效

通过引入正弦波浪动效库 [sine_wave](https://github.com/isuttell/sine-waves) 实现。[sine_wave](https://github.com/isuttell/sine-waves) 使用 canvas 元素生成多个可配置的正弦波，这样我们就可以通过配置参数得到想要的正弦波浪，具体实现如下：

```
new SineWaves({
  el: document.getElementById( `waves`),//dom
  speed: 0.75,//速度
  width: function() {//canvas宽度
    return document.body.clientWidth;
  },
  height: 68,//canvas高度
  ease: 'Linear',//动画曲线
  waves: [//需要配置的正弦波浪
    {
      "timeModifier":1,//速度
      "lineWidth":1,//线条宽度
      "amplitude":30 * window.devicePixelRatio,//波浪高度
      "wavelength":125 * window.devicePixelRatio,//波长
      "strokeStyle":"rgba(221,221,233,1)",//颜色
      "type": function(x, waves) {//自定义波浪类型
        return waves.sine(x); // Combine two together
      }
    }
  ], 
  rotate: 0,//旋转角度
  wavesWidth: '400%',//波浪宽度
});
```

根据文档介绍的参数来看，有两个参数是实现 3D 旋转波浪效果的关键：
1. type，自定义波浪的类型，可以修改 x 轴的位移，让 3 根波浪错位，实现旋转的效果。

```
type: function(x, waves) {
  return waves.sine(x+8); // Combine two together
}
```

2.  wavelength，波浪长度，3 根弧度一模一样的波浪明显是不符合要求的，只需要将红色的波浪的弧长加长，就可以实现一根波浪环绕另外两根波浪的效果。

开发过程中发现 [sine_waves](https://github.com/isuttell/sine-waves) 的一个显示问题，它以默认二倍屏的方式定义的 canvas，这样在一倍屏下波浪是有问题的，解决方法是在参数波浪高度 amplitude 和波长 wavelength 根据 window.devicePixelRatio 来定义。

```
{
  "amplitude":30 * window.devicePixelRatio,//波浪高度
   "wavelength":125 * window.devicePixelRatio,//波长
}
```

### 全局细节动效
最后介绍的就是全局细节动效的优化，为了让整站的动效流畅，平滑的过渡，做了以下工作：

* 用 SASS 变量 $common_animation 管理通用动画，让整站动画一致化
* 图标动效和边框动效采用 SVG 实现，实现动画组件化的同时，矢量元素不失真
* 需要过渡的元素，用 visibility 代替 display 控制元素的显示隐藏

![图片](http://storage.360buyimg.com/jdrd-blog/8.gif)

![图片](http://storage.360buyimg.com/jdrd-blog/7.gif)

![图片](http://storage.360buyimg.com/jdrd-blog/5.gif)
# 整体总结
本文从项目架构、开发流程、项目优化 3 个方面阐述 JDRD 官网的开发过程，中间遇到了太多问题，在问题的解决过程中记录和总结，是收获满满的喜悦，也发现了一些可以优化的模块，让下次能够做得更好，在开发过程中的多些思考和探究，最优化的设计项目。

感谢阅读！

