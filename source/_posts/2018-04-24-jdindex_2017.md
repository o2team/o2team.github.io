title: Nerv实战 - 京东首页改版小结
subtitle: 大渣好，我是京东首页，介是里没见过的船新Nerv版本，挤需三分钟，你就会甘我一样，爱上...
cover: https://misc.aotu.io/Littly/18-04-24_jdindex/17cover.png
categories: 项目总结
date: 2018-04-24 20:10:00
tags:
  - JD
  - Nerv
  - React
  - Summary
author:
  nick: Littly
  github_name: Littly
wechat:
    share_cover: https://misc.aotu.io/Littly/18-04-24_jdindex/17cover_mini.png
    share_title: Nerv实战 - 京东首页改版小结
    share_desc: 大渣好，我是京东首页，介是里没见过的船新Nerv版本，挤需三分钟，你就会甘我一样，爱上这个版本。
---

<style>
  .post strong { font-weight: bold; }
</style>

<!-- more -->

> 回想17年的京东首页改版，从上线到现在竟然已经过去了四个多月。这四个多月，除了不曾中断的日常维护需求，对首页孜孜不倦的优化工作，更多的是那些与拖延症抗争的日夜：是今天写，还是等好好休憩回味后再动手？很明显，在这几十上百个日夜里，我基本都选择了第三个选项：**不折腾了，先休息吧**。现在想起来，关于那一个月白加黑五加二加班生活的印象已经渐渐模糊。到现在依然能清晰记着的，大概是最为深刻的记忆了。

16版的京东首页，在性能、体验、灾备策略等各方面都做到了极致。站在如此高大的巨人肩上，除了满满的自信，我们心里更怕扑街。毫无疑问，我们在接到改版需求的那一刻，立马就敲定了新首页的技术选型：妥妥的`jQuery` + `SeaJS`！

但很快，我们就发现这样一点都不酷。`jQuery`是2006年的框架了，`SeaJS`停止维护也已经四年。这些项目的诞生都是为了解决当时业界的一些痛点：比如`jQuery`最开始是为了方便程序员在页面中操作DOM，绑定事件等；`SeaJS`则是为了在浏览器中实现CMD规范的模块开发和加载。但在各种VirtualDOM框架横飞的现在，程序员已经很少会直接操作DOM元素，而模块的开发和加载也有早已有了别的方案。

就在这时，[Nerv](https://github.com/NervJS/nerv)项目的作者提出了建议：“**不然用Nerv来一发？**”我记得，当时他脸上洋溢着淳朴的笑，Nerv也仅仅是部门内部的一个小项目。我们回想了首页这个业务，技术栈已经好几年未曾更新过，开发流程也不够理想。如果再不做出改变，明年的这个时候我们依然会面对一堆陈年老代码头疼不已。抱着试一试的心态，我们接受了他的提议。没想到，这个决定让首页从此摆脱了落后的技术架构，而Nerv现在也已经成长为GitHub上3k+ Star的热门项目。

> Q: 为什么不使用`React`/`Preact`/`Vue`？
>
> A: 这三者都是前端圈子中相当流行的项目。`React`有完善的体系和浓厚的社区氛围，`Preact`有着羞涩的体积，`Vue`则使用了先进的html模板和数据绑定机制。但是，上边这三者都 **无法兼容IE8**。我们在经过相关数据的论证后，发现IE8的用户还是有一定的价值，这才最终激发了我们团队内部自己造轮子的想法。当然，在造轮子的过程中，我们也不忘向上面这些优秀框架的看齐。最终，`Nerv`在完美兼容React语法的同时，具有着出众的性能表现，在Gzip后也只占用9Kb的体积。



## 整体架构

在这次的项目中，我们基于上一年久经考验的前端体系（[详细介绍](https://aotu.io/notes/2016/12/26/jd-index-2016-summary/#%E6%95%B4%E4%BD%93%E6%9E%B6%E6%9E%84)），进行了升级：

![整体架构图](https://misc.aotu.io/Littly/18-04-24_jdindex/structure.png)

* Athena前端工程化工具：团队自研的前端工程化工具。除了自动化编译、代码处理、依赖分析、文件压缩等常规需求，2.0版本还支持 **基于npm的依赖管理**，**更加先进的引入、导出机制**，还有 **最新的es语言特性**。
* Athena管理平台：新增了 **针对Nerv的项目模板**，另外还有针对H5项目的特色模板可选。
* Athena基础库与组件库：新增了基于`jQuery`+`SeaJS`的组件重构，**全新升级的Nerv组件**。
* Athena模拟接口：除了已有的mock接口数据的能力，还支持 **接口文档生成**，便于沉淀项目接口信息。
* Athena兜底接口：可以定时抓取线上接口的数据 **生成兜底数据**，还支持 **接口数据校验**，评估接口健康度。
* Athena前端监控：我们部署了一系列的监控服务，对页面上的素材以及页面的完整功能进行监控。一旦图片尺寸/体积超限，某些特定的操作出现异常，或者接口成功率降低等异常情况，就会触发告警推送，开发者可以 **实时收到告警信息**。
* Athena可视化报表：Athena可视化报表平台上对上报的数据都有 **直观的展示**。



## 开发模式

### Athena2.0

1.0版本的`Athena`，基于`vinyl-fs`的流操作，或者说是类似于gulp的压缩、编译等等操作的任务流。而到了2017年，`webpack`早已在前端圈中流行。同行们也早已经习惯在项目中直接基于最新的语言特性去开发，在`webpack.config.js`加上一个`babel-loader`就可以完美支持新语法并完成打包。Athena 1.0背着太沉重的历史包袱，已经很难快速实现对babel转译的支持。所以在首页的开发前，我们将Athena升级到了全新的2.0版本。

一如既往，Athena会为项目提供`init`（初始化），`serve`（实时预览），`build`（编译），`publish`（发布）等功能。除此之外，由于2.0版本的Athena是基于`webpack`的，所以项目中可以 **统一用npm来管理依赖**，也可以直接 **使用最新的ES语言特性**来进行开发。

使用Athena2.0开发时，建议的文件架构如下：

![文件架构](https://misc.aotu.io/Littly/18-04-24_jdindex/files.png)

### 前后端协作

我们依然是采用了 **前后端分离**的协作模式，由后端给出json格式的数据，前端拉取json数据进行渲染。对于大部分的组件来说，都会在`constructor`中做好组件的初始化工作，在`componentDidMount`的生命周期中拉取数据写入组件的`state`，再通过`render`函数进行渲染。

```javascript
/* myComponent.js */
 
import Nerv from 'nervjs'
 
class MyComponent extends Nerv.Component {
  constructor() {
    super(...arguments)
    this.state = {
      xxx: 'xxx'
    }
  }
  async requestData() {
    // return await fetch('xxx').then(res => res.json())
  }
  componentDidMount() {
    this.requestData()
      .then(data => {
        this.setState({
          xxx: 'yyy'
        })
      }).catch(() => {
        this.setState({
          xxx: 'zzz'
        })
      })
  }
  render() {
    return (
      <div>{this.state.xxx}</div>
    )
  }
}
 
export default MyComponent
```

### 代码规范约束

> 有一千个读者，就会有一千个哈姆雷特。

上面这句名言，深刻地体现在了16版首页的代码仓库中。同一个组件，如果是基于`jQuery`+`SeaJS`的模式，一千个程序猿就会有一千种写法。结果在同一个项目中，代码风格不尽相同，代码质量良莠不齐，多人协作也会无从下手。

何以解忧？唯有统一代码风格了。通过`ESLint`+`Husky`，我们对每次代码提交都做了代码风格检查，对是否使用prefer const的变量声明、代码缩进该使用Tab还是空格等等的规则都做了约束。一开始定下规范的时候，团队成员或多或少都会有些不习惯。但通过偷偷在~~代码里下毒~~Athena的生成的项目模板中添加对应的规则，潜移默化地，团队成员们也都开始接受、习惯这些约束。

![Git提交流程](https://misc.aotu.io/Littly/18-04-24_jdindex/gitflow.png)

禁用变量重声明等规则，在一定程度上保证了代码质量；而统一的代码样式风格，则使得项目的多人协作更加便利。

> Q: 保证代码质量，促进多人协作的终极好处是什么？
>
> A: 由于项目代码风格统一，通俗易懂容易上手，我们首页的开发团队终于开始 **有妹纸加入了**！~~一群雄性程序猿敲代码能敲出什么火花啊...~~



## 对性能优化的探索

### 首屏直出

直出可能是加快首屏加载最行之有效的办法了。它在减少页面加载时间、首屏请求数等方面的好处自然不必再提，结合`jQuery`，也可以很方便地在直出的DOM上进行更多的操作。

`Nerv`框架对于它内部的组件、DOM有着良好的操作性，但是 **对于体系外的DOM节点**，却是天生的 **操作无力**。举个例子，比如在页面文件中我们直出一个轮播图:

```html
<div id="example" class="mod_slider">
  <a class="mod_slider_prev" />
  <ul class="mod_slider_list">
    <li class="mod_slider_item">
      <a href="javascript:;"><img src="//www.example.com/example.png" /></a>
    </li>
    <li class="mod_slider_item">
      <a href="javascript:;"><img src="//www.example.com/example.png" /></a>
    </li>
    <li class="mod_slider_item">
      <a href="javascript:;"><img src="//www.example.com/example.png" /></a>
    </li>
    <li class="mod_slider_item">
      <a href="javascript:;"><img src="//www.example.com/example.png" /></a>
    </li>
  </ul>
  <a class="mod_slider_next" />
</div>
```

使用`Nerv`为这段HTML添加轮播逻辑，成为了非常艰难的操作。终极的解决方案，应该是使用 **SSR（Server Side Render）**的方案，搭建`Nerv-server`中间层来将组件直出。但现在革命尚未成功，首屏直出尚且依赖后端的研发同学，首页上线又迫在眉睫。被逼急的我们最终选择了比较trick的方式来过渡这个问题：在组件初始化的时候先通过DOM操作获取渲染所需的数据，再将DOM替换成`Nerv`渲染后的内容。

```javascript
import Slider from 'path/to/slider'
class Example extends Nerv.Component {
  constructor() {
    const ctn = this.props.ctn
    this.state = {
      data: this.gatherInfos()
    }
    ctn.innerHTML = ''
  }
  gatherInfos() {
    // 返回已有DOM中的链接，图片url等信息
  }
  render() {
    return (
      <Slider>
        {this.data.map(v => <li /> )}
      </Slider>
    )
  }
}
const el = document.querySelector('#example')
Nerv.render(<Example ctn={el} />, el)
```

### 代码分割

在生产环境中，随着代码体积增大，浏览器解压Gzip、执行等操作也会需要更多的开销。在SeaJS的时代，我们尚且会通过`SeaJS.use`或者`require.async`异步加载模块代码，避免一次性加载过多内容。但`webpack`的默认行为却会将整个页面的代码打包为一个单独的文件，这明显不是最佳的实践。对此，webpack给出的解决方案是[动态引入(Dynamic Imports)](https://webpack.js.org/guides/code-splitting/#dynamic-imports)。我们可以通过如下的代码来使用这个便利的特性：

```javascript
import(
  /* webpackChunkName: ${chunkName} */
  '${chunkName}'
).then((loaded) => {
  /* Do anything to the loaded module */
})
```

与此同时，`webpack`会将使用了动态引入的组件从主bundle文件中抽离出来，这就 **减小了主bundle文件的体积**。

![构建后的代码](https://misc.aotu.io/Littly/18-04-24_jdindex/code_splitting.png)

对于我们的具体需求而言，需要做动态引入的一般是`Nerv`的组件。对于组件的动态引入，业界已经有非常好的实现方案 [react-loadable](https://github.com/jamiebuilds/react-loadable)。举个栗子，通过下面的代码，我们可以在页面中使用`<LoadableMyComponent />`来实现对组件`MyComponent`的动态引入，并且具有 **加载超时、错误、加载中**等不同状态的展示：

```javascript
/* loadableMyComponent.js */
 
import Loadable from 'react-loadable';
 
const LoadableMyComponent = Loadable({
  loader: () => import('MyComponent'),
  delay: 300,
  loading: (props) => {
    if (props.error) {
      // 加载错误
      return <div>Error!</div>;
    } else if (props.timedOut) {
      // 加载超时
      return <div>TimedOut!</div>; 
    } else if (props.pastDelay) {
      // 加载占位符
      return <div>Loading...</div>;
    } else {
      return null;
    }
  },
  render: (loaded, props) => {
    return <loaded.default {...props}/>;
  }
});
 
export default LoadableMyComponent
```

再进一步，我们希望对于屏幕外的组件，仅仅是在它进入用户视野后再开始加载，这也就是我们常说的滚动懒加载。这可以结合业界已有的懒加载组件[react-lazyload](https://github.com/jasonslyvia/react-lazyload)来实现。针对上面的`<LoadableMyComponent />`，在下面的例子中，只有进入用户屏幕后，`MyComponent`才会开始加载：

```javascript
/* myApp.js */
import Nerv from 'nervjs'
import LazyLoad from 'react-lazyload';
import LoadableMyComponent from './loadableMyComponent';
 
class MyApp extends Nerv.Component {
  render () {
    return (
      <div className='app'>
        <LazyLoad height={200} placeholderClassName={'mod_lazyload'}>
          <LoadableMyComponent />
        </LazyLoad>
      </div>
    )
  }
}
 
export default MyApp
 
```

上面的例子为lazyload的组件设置了200px的占位高度。并且设定了占位元素的类名，方便设定样式。

### 代码延后加载

在给首页全面升级技术栈的时候，我们忽略了一个问题：页面上还引用着少量来自兄弟团队的SeaJS模块，我们升级了技术栈是可以，但是强迫兄弟团队也一起去掉SeaJS重构一遍代码，这就有点不合理了。我们也不能仅仅为了这部分模块，就把`SeaJS`给打包进代码里面，这也是不科学的。

上面讲到的 **动态引入**功能，帮我们很好地解决了这个问题。我们在代码中单独抽离了一个`legacy`模块，其中包含了`SeaJS`、`SeaJS-combo`等老模块并做了导出。这部分代码在首屏中并不直接引入，而是在需要执行的时候，通过上面的 **动态引入**功能，单独请求下来使用：

```javascript
import('../legacy')
  .then(({ SeaJS }) => {
    SeaJS.use('xxx', function (XXX) {
      // XXX.init();
    })
  })
```



### 打包性能优化

`webpack`默认会对整个项目引用到的文件进行编译、打包，其中还包括了`Nervjs`、`es5-polyfill`等基础的依赖库。这些文件从加入项目开始，基本都不会再有任何更改；然而在每次构建新版本时，webpack打包的这些基础库都会与上一版本有一些细微的区别，这会导致用户浏览器中对应的代码缓存失效。为此，我们考虑将这些基础库分开打包。

针对这种需求，`webpack`官方建议使用[DLL插件](https://webpack.js.org/plugins/dll-plugin/)来优化。DLL是`Dynamic Link Library`的简称，是windows系统中对于应用程序依赖的函数库的称呼。对于`webpack`，我们需要使用一个单独的`webpack`配置去生成DLL：

```javascript
/* webpack.dll.config.js */
 
plugins: [
  new webpack.DllPlugin({
    path: path.join(__dirname, 'dist', 'lib-manifest.json'),
    name: 'lib.dll.js'
  })
]
```

接下来，在我们的项目的webpack配置中引用`DllReferencdPlugin`，传入上面生成的json文件：

```javascript
/* webpack.dev.config.js */
 
plugins: [
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./dist/lib-manifest.json')
  })
]
```

这样就完成了动态链接库的生成和引用。除了最开始的一次编译，后续开发中如果基础库没有变动，DLL就再也不需要重新编译，这也就解决了上面的代码变动的问题。



## 体验优化探索

### 兼容IE8

兼容旧版本IE浏览器一直是前端开发人员心中永远的痛。过去，我们使用`jQuery`去统一不同浏览器的DOM操作和绑定事件，通过jQuery元素实例的map、each等类数组函数批量做JavaScript动画，等等。

但是在使用`Nerv`之后，从体系外直接操作DOM就显得很不优雅；更推荐的写法，是通过组件的ref属性来访问原生DOM。而map、each等函数，IE9+的浏览器也已经在`Array.prototype`下有了相应的实现。如果我们在代码中直接引入`jQuery`，这肯定是不科学的，这将使页面的脚本体积提高许多，同时还引入了很多我们根本用不上的多余功能。

面对这种情况，我们做了一个仅针对ie8的轻量级的兼容库[es5-polyfill](https://github.com/o2team/es5-polyfill)。它包括这些实现：Object的扩展函数、ES5对`Array.prototype`的扩充、标准的`addEventListener`和`removeEventListener`等。在入口文件顶部使用`require('es5-polyfill');`引入`es5-polyfill`后，只需3分钟，你就~~**会甘我一样，爱上这款框架**~~可以在代码中愉快地使用上面说到的那些IE8不支持的API了。

但是，通过上面的CMD方式引入不就意味着对于IE9+的用户都引入了这些代码吗？这并不符合我们“随用随取，避免浪费”的原则。我们更推荐的做法，是在`webpack`中为配置多个entry，再使用`HTMLWebpackPlugin`在HTML模板中为`es5-polyfill`输出一段针对IE8的条件注释。具体实现可以参考[nerv-webpack-boilerplate](https://github.com/NervJS/nerv-webpack-boilerplate)。

### SVG Sprite

在页面中使用SVG，可以有效提升小图标在高清屏中的体验。类似于图片Sprite，SVG也可以通过Sprite来减少页面的请求(参考文章：[拥抱Web设计新趋势：SVG Sprites实践应用](https://aotu.io/notes/2016/07/09/SVG-Symbol-component-practice/)）。

举个栗子，我们在Nerv中声明svgSprite组件，用以存放页面中用到的svg小图标：

```javascript
/* svgSprite.js */
 
const svgSprite = () => {
  return (
    <svg
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
      style='display: none;'>
      <defs>
        <symbol id='icon' viewBox='0 0 45 27'>
          <path d='M942,301.022h16.012v1.97H942v-1.97Zm39.978,14.766c-0.041,2.967-4.619-.024-9.957-2.944-0.884-.484-2.035-1.114-3.024-1.713V313a3,3,0,0,1-3,3H940a3,3,0,0,1-3-3V299a3,3,0,0,1,3-3h17.014V296.2a1.45,1.45,0,0,1,0,2.757V299h-0.242a0.681,0.681,0,0,1-.517,0H940v14h26V299.051h0.02v-0.3l-11.433-5.717a1.01,1.01,0,0,1-.292-0.2l-0.594-.411s-1.365-1.851,1.193-2.218l0.188-.194,13.25,6.8-0.11.192a3.126,3.126,0,0,1,.384.547,1.458,1.458,0,0,1,.416,1.011,1.438,1.438,0,0,1-.044.215c0.006,0.075.022,0.148,0.022,0.226v2.7c1.193-.825,2.718-2,4.016-2.741,5.666-3.812,8.954-5.819,8.965-2.672S982.031,312.2,981.981,315.788ZM979.156,299h-1l-9,6v3l9,5h1V299Z'
          transform='translate(-937 -290)'
          fill='#d4c6af'
          fillRule='evenodd' />
        </symbol>
        {/* 更多的<symbol /> */}
      </defs>
    </svg>
  )
}
 
export default svgSprite
 
```

接下来，我们可以在页面中 **动态引入**上面的svgSprite组件就可以了：

```javascript
/* app.js */
 
import Loadable from 'loadable'
 
const LoadableSvgSprite = Loadable({
  loader: () => import('./svgSprite'),
  delay: 300,
  render: (loaded, props) => {
    return <loaded.default {...props}/>;
  }
});
```

在页面中挂载`<LoadableSvgSprite />`后，我们即可使用形如`<svg><use xlink:href='#icon' /></svg>`的代码去引用相应的图标了。

### 数据大屏

除了用户，我们同样也关注运营人员的体验。如果可以将运营数据都以直观的图表展示，这对于运营同学、产品同学都是十分幸福的事。这次的首页改版，我们与数据方合作，为首页配套开发了数据大屏项目SEE，用于运营数据的实时滚动展示。

SEE基于`Nerv`+`Redux`开发，使用`ECharts`进行数据的可视化展示。除了线上数据，SEE还有专门针对开发人员需求的性能版大屏，实时展示开发人员关心的页面onload时间，接口成功率，js报错数等指标。我们也希望未来SEE可以在更多的业务中用起来。



## 页面可用性保障和监控

我们做了许多优化工作来提升页面在性能、体验上的优良表现。但如果页面出现了JS逻辑错误，或者展示有问题，前面的优化工作就都前功尽弃了。所以在保证项目进度的基础上，我们又做了一系列的工作来保证首页的安全与稳定。

### 统一上线

同一份代码，经过不同版本的开发工具进行编译、压缩，生成的文件可能会天差地别，这种情况在多人协作中是相当致命的。比如：开发人员A的代码使用了新版本开发工具的API，而无辜的开发人员B对此毫不知情，使用了老版本的开发工具进行编译和发布...说多了都是泪，又是一场人间悲剧。

为了消除差异，我们希望不同开发人员的开发环境保持严格统一，但这其实是难以保证的：除了开发工具版本不同，有时候windows下，macOS下甚至是Linux下的表现也是不一样的。

为了解决这个问题，我们将编译的工作挪到了服务器端。开发人员在本地进行开发、自测，联调通过后提交到代码仓库中，确认上线后，上线平台拉取项目的代码，**使用服务器端的工具链进行编译、压缩、发布**等工作。

此外，上线平台还提供上线代码diff功能，可以将待上线的文件与线上的版本进行diff，待开发人员确认完才能继续上线操作。

接入上线平台后，开发人员再也不必担心开发环境的差异影响了编译结果，也不会误操作将其他同事开发中的分支带上线。就算是出现了线上bug，开发人员也可以轻松地通过上线平台记录的git commitId进行 **精确快速的回滚**，有效保障了页面的可用性。

### 自动化测试

我们注意到，每次上线迭代，在经过编译工具的压缩、组合后，都有可能会对代码中其他部分的代码造成影响。如果在测试时只验证了当前迭代的功能点，疏漏了原先其他功能点的验证，就有可能引起一些意想不到的BUG。传统的DOM元素监控并无法满足我们的需求，因为有的bug出现的时机是在一连串特定的操作后。所以我们认为，我们造轮子的时候又到了。我们需要在Athena监控体系中增加一套针对页面中各个功能点的自动进行验证测试的系统。

这个系统基于`selenium webdriver`搭建。在后台中，开发者 **针对CSS选择器配置一系列的动作链`Actionchain`**，包括点击、hover、输入文字、拖拽等操作，再通过对指定CSS选择器的HTML属性、样式、值等因素指定一个预期结果。后台服务会定时打开页面，执行预设的操作，如果与预期结果有出入，就会触发告警。

这种单服务器运行的e2e测试，容易碰到一些偶然网络波动的影响而导致乱告警。事实上，我们刚开始跑这套服务的时候，我们经常收到告警，但事实上页面展示并没有任何问题。针对这种偶发情况，我们在验证的过程中加入了失败重试的机制。只有在连续3次测试状态都为fail的情况，才会触发告警。经过优化后，监控的准确性有了质的提升。

### 素材监控

在生产环境中，除了程序BUG，数据运营的一些不规范操作也有可能影响到用户的体验。举例来说，如果页面中的图片体积过于庞大，会导致页面的加载时间变长，用户等待的时间会更久；如果页面中图片尺寸不合规，会导致 图片展示不正常，出现拉伸/压缩等现象，页面就会给人很山寨的感觉了。

针对这些素材异常情况，我们部署了针对性的监控服务。开发者 **针对特定的CSS选择器配置图片的标准体积以及尺寸**。监控服务定时开启headless浏览器抓取页面中的图片并判断是否符合规则，不符合就触发告警。通过这样的手段，我们可以第一时间知道页面上出现的超限素材，通知运营的同学修改。

### 实时告警

作为Athena前端体系的一环，我们接入了Athena系统用于收集首页各种性能以及用户环境相关的数据。在这套系统中，我们可以获取到用户的 **屏幕分辨率占比**，**浏览器占比**，同时还有 **页面加载时间**、**接口成功率**等性能数据。

基于这些数据，我们在发现问题时可以进行有针对性的优化，比如调整特定接口的等待时间，或者是调整特定请求的重试策略。但是，并没有谁会一整天对这些数据的仪表盘盯着看；等我们发现问题，可能已经是上线后第二天，在工位上吃着早餐喝着牛奶的时候了。

解决信息滞后的问题，加强消息触达是关键。我们强化了Athena监控平台的功能：除了平台上仪表盘直观的数据展示，还支持配置告警规则。在绑定告警接收人的微信号后，平台就可以通过部门公众号实时推送告警信息，真正做到24小时监控，360度无盲点触达。



## 更长远的探索

“如何做得更好？”这是一个永不过时的问题。以前我们觉得在页面使用CMD的模块加载体系非常酷，所以后来会在项目中使用SeaJS；去年我们渴求一次架构升级，所以我们今年用上了Nerv。今年我们又会渴望什么呢？

### 前后端同构 

作为提升性能的一个捷径，代码同构、服务器端渲染是目前看来的终极解决方案。我们计划搭建中间层，同样使用`Nerv`来渲染，从而减少首屏的代码逻辑，这将对页面的加载速度有大幅度的优化。

### 引入强类型校验

除了更快，我们也希望能够更稳。作为弱类型语言，`JavaScript`有着强大的灵活性，数据类型的相互转换十分便利；但也由于各种不严谨的类型转换，代码中存在着大量不可预测的分支走向，容易出现`undefined`的报错，调用不存在的API等等。

强类型语言`TypeScript`从13年诞生到现在，已经十分成熟了。在类型推断、静态验证上，`TypeScript`明显会更胜一筹；而在减少了多余的类型转换之后，`TypeScript`的性能表现也比常规`JavaScript`更强。我们希望未来可以将`TypeScript`在项目中用起来，这对于提升页面可靠性和性能，是很有意义的。



## 总结

这篇文章从 **整体开发架构与模式**，**性能、体验优化的探索**，**页面可用性的保障**等方面对京东首页的开发过程做了 **简单**的介绍。之所以说简单，是因为短短的篇幅完全无法说完我们在开发期间的故事和感悟：许多问题的解决并不像上面讲的那样水到渠成；除此之外更是有一大堆深夜加班~~撸串~~的故事没有地方讲。

最后献上个照片，这是项目上线成功之后在公司拍的~~通宵证明~~。虽然现在会觉得这拍得真......丑，但是项目成功上线的喜悦之情，我相信屏幕前的你也一样可以感受到。

![早晨的公司](https://misc.aotu.io/Littly/18-04-24_jdindex/happy.png)