title: 京东2016版首页改版前端总结
subtitle: 经过1个多月的奋战，京东2016版首页终于捅上线了，本文主要对此次改版项目中前端所做的工作进行总结
cover: //misc.aotu.io/luckyadam/index_2016/cover.jpg
categories: Web开发
tags:
  - JD
  - Summary
author:
  nick: luckyadam
  github_name: luckyadam
date: 2016-12-26 20:25:57
---

<!-- more -->

> 深圳的天气总是多变，前一段时间还是凉意浓浓，似乎要步入冬天了，最近却又变得炎热起来，气温骤升，让人措手不及。正如我们负责的业务一样，一年下来有诸多变化。今年9月份我们接手了京东2016版首页改版开发，历经1个多月紧张地开发测试，终于在双11前成功全量发布，回想整个开发历程，感觉还是有很多值得思索的地方，例如北京一月，虽然日夜颠倒，加班不止，但整个人居然胖了许多，不禁让人匪夷所思。

## 整体架构

最初听说要做新版京东首页的时候，是怀有一丝惶恐的，毕竟是作为京东的门户，其重要性和受关注程度自然不言而喻，一行代码的失误可能会造成不可挽回的后果，而且过去的首页无论性能，还有体验在业界都已经是做得非常优秀了，要再想有些出彩的地方，也是十分困难，所以综上就是压力山大。当然，花开两朵，咱们单表一枝，本文主要还是相对这次改版工作中提炼的工作方法和优化方式做出一定的总结。

这次改版，在前端架构上大体还是沿用过去的架构，使用 `jQuery` + `Seajs` 这种古老的开发方式，因为首页还依赖着许多旧的系统与组件，无法在短时间内对基础架构进行升级，当然并不是说旧的就不好，要去盲目追求一些新的东西，而是这种架构还是有可以提升的地方。

而整个项目的架构是经历之前业务进行总结提炼出来的

![架构](//misc.aotu.io/luckyadam/index_2016/architecture.jpg)

**[Athena前端工程化工具](https://github.com/o2team/athena)**，是我们团队自己探索开发的一套基于`NodeJs`的命令行式前端工程化工具，解决了自动化编译、代码处理、依赖分析、文件压缩等前端开发中的常规问题，有效地提升了我们的工作效率，解放生产力，目前已经应用于我们团队的多个业务中，首页改版也使用[Athena](https://github.com/o2team/athena)来进行开发；

**Athena管理平台**，是Athena工具配套的管理后台，它会收集本地工具操作中上报的统计数据，包括项目、模块、页面、组件创建的信息，文件、资源依赖关系的信息等，通过这些数据来进行项目和资源的管理，同时提供了项目模板，方便使用本地工具创建项目时选择，具体可以参考之前的博文[我们是如何做好前端工程化和静态资源管理](https://aotu.io/notes/2016/07/19/A-little-exploration-of-front-end-engineering/)；

**Athena组件平台**，是基于Athena总结的一套业务组件的平台，可以很好地管理我们的业务组件，方便组件的复用和传播；

**[Athena基础库及组件库](https://github.com/o2team/channel-base)**，是业务中总结出的基于`jQuery` + `Seajs`的js库，简化业务开发，提供完整的框架；

**Athena模拟接口**，可以自由编辑生成指定接口的假数据，用于开发时真实接口的替代，让开发不再依赖后端接口；

**Athena兜底接口服务**，可以指定接口生成一份兜底数据接口，平台会定时去抓取指定接口数据，然后生成兜底数据到CDN，从而生成对应的兜底接口，这样让正常接口多一份兜底保障；

**Athena前端监控**，通过在页面中进行埋点上报的方式，我们可以在监控系统中，实时地看到性能相关数据。我们进行上报的不止有页面性能、速度相关的数据，同时会上报用户的环境信息，例如操作系统、浏览器、网速等，而且还会对页面中错误信息进行上报，如模块的隐藏等，通过这些数据，对我们的业务进行实时地监控与分析。

在我们的架构中，各种各样的工具与系统相辅相成，覆盖到了开发到上线的各个环节，自成一套体系。这样的架构不止是针对首页这个业务的，而是在基于对之前业务开发总结的基础上进行完善、调整的架构，适用于我们各个业务。而这次首页的改版中，我们对开发模式、性能优化、体验优化都进行了一些新的探索，让我们对于业务开发的整体解决方案又有了新的改进。

## 开发模式

### Athena

开发效率的提升是我们一直追求的，工欲善其事，必先利其器，我们通过总结以往的开发工作，提出了各种手段来优化我们的开发效率，前端工具`Athena`就是其中的一个产物，当然它又不仅仅是为了提升开发效率而已，它是我们总结出的一套针对前端开发的完整解决方案，可以让我们的整体开发流程更加简单明了。

`Athena`提供了统一的项目架构，根据业务功能不同，我们将一个项目(app)拆分成不同的业务模块(module)，而每一个模块都包含自身的页面(page)以及构成页面所需要的组件(widget)。

![项目架构](//misc.aotu.io/luckyadam/index_2016/project_architecture.jpg)

在本地使用`Athena`创建完整的项目结构，随后我们就可以只关注代码逻辑的书写，`Athena`提供了简便的操作命令可以一键式地实时编译预览我们的页面，从而让我们不必去关心文件处理、代码编译等细节，开发完后，可以通过`Athena`执行完整的编译步骤并同步到我们的服务器上方便进行浏览测试。

使用`Athena`，新版首页开发模式大致如下：

![开发模式](//misc.aotu.io/luckyadam/index_2016/workflow.jpg)

### 前后端分离

基于`Athena`工具，我们目前已经可以做到完全地本地开发调试了，但是还并不能做到完全的前后端分离，以过去首页为例，页面被拆分成**首屏**和**楼层**，首屏采用直出的方式以提升速度，楼层则使用异步加载的方式，拉取服务器上已经渲染好的`HTML`字符串，如图

![过去模式](//misc.aotu.io/luckyadam/index_2016/past.jpg)

整个页面，包括首屏和楼层，都需要前端写好静态`HTML`，然后给后端开发同学来套用，转成后端语言对应的模板，这样导致前后端耦合较深，`HTML`更新极不方便，开发成本较高。

为了解决这样前后端耦合的问题，减少沟通成本，这次首页改版我们使用了新的开发方式，为了保证首屏速度，首屏已然采用直出的方式，但对非首屏的楼层进行改进，使用**前端模板** + **数据**开发方式，将DOM字符串的渲染放到前端来做，后端只提供数据接口，以此来达到前后端分离的效果，同时在开发中使用**假数据平台**模拟接口，让前端工作不再依赖后端。

![现网模式](//misc.aotu.io/luckyadam/index_2016/now.jpg)

在最开始提出这样前后端分离方案的时候还是受到了不少的质疑，因为使用**前端模板** + **数据**开发方式，会使得每个楼层都多一个接口，并且需要依靠JS来动态渲染，会影响到楼层加载的性能，但经过我们的测试证明在现代PC浏览器下两种模式前端渲染和后端渲染并不会相差太多，并且在模板、数据双重缓存下，这样的差距更是微乎其微了，更关键的是能让我们的开发效率有所提升。

![性能数据对比](//misc.aotu.io/luckyadam/index_2016/compare.jpg)

当然，我们对于性能的追求总是孜孜不倦，为了让楼层的加载速度更快，减少请求，我们在后续将使用在服务端定时获取数据编译前端模板，然后生成静态文件推送到CDN的方式来改进，和之前的由后端开发同学套模板生成静态文件不同的是，我们将自己搭建这样的中间层服务，在服务端编译前端模板，实现前后端同构，而前端可以随时切换渲染方式，改成请求渲染好的 `HTML` 字符串来进行加载，以此来提升性能。

## 对性能优化的探索

性能永远是前端工程师追求的主题，过去首页在性能优化上已经做得非常极致了，它已经使用了各种手段来优化性能，包括首屏直出、样式直出来提升首屏速度，楼层按需加载，减少不必要的请求等等，所以在做新版首页的时候，我们感觉战战兢兢，因为改版不能让页面受到影响，而且最好还能比原来更快，所以，这次改版中我们主要通过如下手段来进行性能的优化。

### 首屏直出和精简

首屏直出是让首屏速度更快的最佳选择，此次版本依然选择了首屏直出的方式，直出的内容包括首屏`HTML`，页面楼层骨架，以及样式和一些必须的脚本，看起来和之前的方式如出一辙，但此次改版我们还是做了很大的改进，那就是让首屏更加精简。

过去是将页面页面所有的样式都直出在页面上，没有外链的CSS，各种优化手段都考虑进去了，那么新版首页就只能在精简大小上下功夫了，所以新版首页的首屏只直出了首屏必须的样式，同时只直出一小部分必须的脚本，而非首屏的楼层样式拆分到各自楼层中，和楼层的模板放在一起，按需加载。

通过对`Athena`工具的改造，我们实现样式、模板的统一抽离这一功能，并且是在项目编译阶段自动实现的，开发者勿需关心。由于Athena统一的项目结构，每一个楼层在我们的项目中对应一个`widget`的组件，组件包含自己的`HTML` 、`CSS`、 `JavaScript`文件，所以在编译时，工具会自动分析所有`widget`的依赖关系，然后把楼层的模板和样式打包到一个文件中。最后在楼层加载的时候去请求这个文件，然后解析加载。这样的抽离工作会在最后的项目编译阶段进行，而进行本地开发预览的时候并不会执行，这样保证了开发的效率。

```javascript
// https://misc.360buyimg.com/mtd/pc/index/home/rec_tpl.min.js
jsonCallBack_rec_tpl({
    dom: '{%var i,clstagPrefix = pageConfig.clstagPrefix + o.staticLogTag;var isWide = pageConfig.compatible && pageConfig.wideVersion;%}{% var len = o.list.length; len = Math.min(len, 3); %}{% if (len >= 1) { %}<div class="grid_c1 rec_inner"><ul class="rec_list">{% for(i = 0; i < len; i++){ %}{% var item = o.list[i]; %}{% var imgUrl = isWide ? item.imgUrl : item.imgUrlB; %}<li class="rec_item" fclog="{%= item.clog %}"><a href="{%= item.url %}" class="rec_lk" target="_blank" clstag="{%= clstagPrefix + \'a\' + (i < 9 ? \'0\' : \'\') + (1+i) %}"><img src="//misc.360buyimg.com/mtd/pc/common/img/blank.png" data-lazy-img="{%= imgUrl %}" alt="{%= item.title %}" title="{%= item.title %}" class="rec_img" data-webp="no" ></a></li>{% } %}</ul></div>{% } %} ',
    style: ".rec_list{overflow:hidden;height:100px}.rec_item{overflow:hidden;float:left;width:396px;height:100%}.rec_lk{display:block;height:100%}.rec_img{display:block;margin:auto}.o2_mini .rec_item{width:330px}.csstransitions .rec_img{-webkit-transition:opacity .2s;-moz-transition:opacity .2s;transition:opacity .2s}.csstransitions .rec_lk:hover .rec_img{opacity:.8}",
    time: 1479195351434,
    version: "ff78610a0ef9cdbb"
});
```

通过上述手段，我们让首屏变得更加精简，从下面的对比中就可以看出

这是过去首页首屏大小

![过去首页首屏](//misc.aotu.io/luckyadam/index_2016/past_size.jpg)

这是新版首页首屏大小

![新版首页首屏](//misc.aotu.io/luckyadam/index_2016/now_size.jpg)

可以看出优化精简之后，新版的首屏的大小减小了非常之多。

### 首屏轮播第一帧直出

一直以来轮播都是靠页面最后加载的JS来进行渲染的，因为轮播图有随机渲染图片的逻辑需要依赖JS，但在一段时间的观察之后发现，如果CDN出现抖动，或者用户的网速较慢，那么首屏轮播这一块位置就会一直空着，给人的体验非常不好

![轮播](//misc.aotu.io/luckyadam/index_2016/past_carsouel.jpg)

所以在这一版的首页中我们将轮播图第一帧的数据直出在页面上，同时也将第一帧的渲染逻辑也直出在页面上，这样一来，首屏轮播出来得就非常快，减少用户的等待时间。

![轮播](//misc.aotu.io/luckyadam/index_2016/now_carsouel.jpg)

### 楼层按需加载与滚动优化

首屏直出后，非首屏的内容肯定也不会一次性全部加载，因为像首页这样的页面楼层非常之多，一次性加载全部不仅仅慢，而且对接口来说也是一种损耗，所以我们考虑将楼层按需加载。

在我们新的方案中，已经采用了前端模板+数据的开发模式，所以在开发中我们想用直接书写前端模板的方式来进行开发，然后在本地进行预览，而在项目编译时能将我们的模板编译成独立的文件，方便渲染逻辑进行加载。所幸`Athena`工具已经支持了这样的功能，在开发中我们以编写前端模板的方式去开发整个页面，随后通过编译工具，在代码编译阶段自动将楼层的模板和样式抽离成一个与组件同名的独立JS文件，通过页面加载逻辑去按需拉取模板文件，再进行渲染。

下面例子揭示了楼层模板生成的过程

> 直接书写前端模板，编写模板时我们给模板加上标记位 o2-out-tpl
```javascript
<script type="text/template" class="o2template" o2-out-tpl>
  {%
    var i,
      clstagPrefix = pageConfig.clstagPrefix + o.staticLogTag;
    var isWide = pageConfig.compatible && pageConfig.wideVersion;
  %}
   {% var len = o.list.length; len = Math.min(len, 3); %}
   {% if (len >= 1) { %}
   <div class="grid_c1 rec_inner">
       <ul class="rec_list">
           {% for(i = 0; i < len; i++){ %}
           {% var item = o.list[i]; %}
           {% var imgUrl = isWide ? item.imgUrl : item.imgUrlB; %}
           <li class="rec_item" fclog="{%= item.clog %}">
               <a href="{%= item.url %}" class="rec_lk" target="_blank" clstag="{%= clstagPrefix + 'a' + (i < 9 ? '0' : '') + (1+i) %}">
                   <img src="//misc.360buyimg.com/mtd/pc/common/img/blank.png" data-lazy-img="{%= imgUrl %}" alt="{%= item.title %}" title="{%= item.title %}" class="rec_img" data-webp="no" >
               </a>
           </li>
           {% } %}
       </ul>
   </div>
   {% } %}
</script>
```

>在编译时扫描依赖关系，生成模板JS文件依赖组件的关系表
```
"dependency": {
  "elevator_tpl.js": [],
  "entry_tpl.js": [
    {
      "widgetName": "spetit",
      "module": "home",
      "moduleId": "f1c9d790-765a-11e6-927d-63ab47c8eeb2",
      "widgetType": "widget",
      "exists": true
    }
  ],
  "fbt_tpl.js": [
    {
      "widgetName": "find",
      "module": "home",
      "moduleId": "f1c9d790-765a-11e6-927d-63ab47c8eeb2",
      "widgetType": "widget",
      "exists": true
    },
    {
      "widgetName": "brand",
      "module": "home",
      "moduleId": "f1c9d790-765a-11e6-927d-63ab47c8eeb2",
      "widgetType": "widget",
      "exists": true
    },
    {
      "widgetName": "top",
      "module": "home",
      "moduleId": "f1c9d790-765a-11e6-927d-63ab47c8eeb2",
      "widgetType": "widget",
      "exists": true
    }
  ]
}
```

>通过关系表去合并处理CSS样式，再和前端模板一起计算出MD5，生成独立的JS文件
```javascript
jsonCallBack_rec_tpl({dom:'{%var i,clstagPrefix = pageConfig.clstagPrefix + o.staticLogTag;var isWide = pageConfig.compatible && pageConfig.wideVersion;%}{% var len = o.list.length; len = Math.min(len, 3); %}{% if (len >= 1) { %}<div class="grid_c1 rec_inner"><ul class="rec_list">{% for(i = 0; i < len; i++){ %}{% var item = o.list[i]; %}{% var imgUrl = isWide ? item.imgUrl : item.imgUrlB; %}<li class="rec_item" fclog="{%= item.clog %}"><a href="{%= item.url %}" class="rec_lk" target="_blank" clstag="{%= clstagPrefix + \'a\' + (i < 9 ? \'0\' : \'\') + (1+i) %}"><img src="//misc.360buyimg.com/mtd/pc/common/img/blank.png" data-lazy-img="{%= imgUrl %}" alt="{%= item.title %}" title="{%= item.title %}" class="rec_img" data-webp="no" ></a></li>{% } %}</ul></div>{% } %} ',style:".rec_list{overflow:hidden;height:100px}.rec_item{overflow:hidden;float:left;width:396px;height:100%}.rec_lk{display:block;height:100%}.rec_img{display:block;margin:auto}.o2_mini .rec_item{width:330px}.csstransitions .rec_img{-webkit-transition:opacity .2s;-moz-transition:opacity .2s;transition:opacity .2s}.csstransitions .rec_lk:hover .rec_img{opacity:.8}",time:1479466862559,version:"ff78610a0ef9cdbb"});
```

>同时会在逻辑脚本入口位置自动加入模板的版本号
```javascript
{
  "elevator_tpl": "e4d5dbaa3ecd12d2",
  "entry_tpl": "e3150fce4b2b332a",
  "fbt_tpl": "18f8bff18188a453",
  "floor_coupon_tpl": "1559694cb962e0d6",
  "floor_ract_tpl": "13b92d16fb6e2f7a",
  "mod_footer_tpl": "49142394d0e7f24e",
  "more_tpl": "d300081dd7f13f78",
  "portal_tpl": "68fae801a032cf93",
  "rec_tpl": "ff78610a0ef9cdbb",
  "seckill_tpl": "f11d04fd7eabc0e6"
}
```

模板文件通过系统发布到CDN后，我们就需要有一套加载逻辑来进行加载。通过监听滚动事件，我们判断让处于浏览器视窗内的楼层进行加载，由于监听了滚动事件，为了让滚动更加流畅，我们必然要对滚动中做的操作进行优化。为了避免滚动操作不断被触发，需要对滚动进行节流处理。我们的原则是尽量避免在滚动的时候进行`DOM`操作与复杂计算，所以在渲染逻辑初始化的时候，我们就已经收集好了楼层的相关信息，包括楼层高度、楼层的`offsetTop`等，这样在滚动的时候就不再需要进行任何`DOM`操作了，让滚动的效率有所提升。而当楼层的数据例如楼层高度发生变化时，则通过消息通知的机制来实时地更新楼层信息即可。

### 脚本延后加载执行

除了楼层是按需加载的，页面中用到的一些脚本文件也是尽量延后加载、执行。`Athena`工具在代码打包的时候，会对每个独立的文件进行单独处理，同时生成一份静态资源的线上对应表，在编译的最后会将引用的资源替换成配置的线上绝对地址。我们可以使用`Seajs`提供的`require.async`API来进行异步加载资源，这样让资源加载更加合理。

```javascript
// 开发中的代码
require.async(__uri('APP_JS_ROOT/header.js'))

// 编译后
require.async('//misc.360buyimg.com/mtd/pc/index/js/header.js')
```

同时，还有业务上一些统计上报等逻辑，可以放到 `window onload` 事件之后再执行，这样可以避免由于类似统计这样的请求占用到页面加载资源，从而降低页面 `onload` 时间。

### 模板、数据分离缓存

每个楼层都按需加载之后，每次去加载这个楼层是否都要重新去请求这个楼层的模板和数据呢？答案当然是否定的。

目前大部分浏览器已经提供了许多前端缓存的解决方案，而其中[兼容性](http://caniuse.com/#search=webstorage)最好，易用性最强的非`localStorage`莫属。利用`localStorage`我们可以对模板和数据进行缓存，这样当用户第二次加载的时候就可以不用再去请求网络资源，而可以直接从本地获取了。

但缓存之后如何进行更新呢？我们可以通过进行MD5校验版本来实现。

对数据来说，数据是由后端给出的，我们可以让后端同学将可以缓存的接口数据计算出一个MD5值作为版本号，然后直出在页面上，同时在接口中返回这个版本号，这样当前端去加载是首先判断版本号是否一致，以此来判断是直接读缓存还是从网络请求资源。

![接口版本号](//misc.aotu.io/luckyadam/index_2016/source_version.jpg)

而对于模板来说，则可以通过`Athena`工具，在每次编译的时候自行计算出版本号，写入模板文件和入口JS文件中，这样在模板加载的时候也可以进行比对。

单个模板文件

```javascript
// https://misc.360buyimg.com/mtd/pc/index/home/rec_tpl.min.js
jsonCallBack_rec_tpl({
    dom: '{%var i,clstagPrefix = pageConfig.clstagPrefix + o.staticLogTag;var isWide = pageConfig.compatible && pageConfig.wideVersion;%}{% var len = o.list.length; len = Math.min(len, 3); %}{% if (len >= 1) { %}<div class="grid_c1 rec_inner"><ul class="rec_list">{% for(i = 0; i < len; i++){ %}{% var item = o.list[i]; %}{% var imgUrl = isWide ? item.imgUrl : item.imgUrlB; %}<li class="rec_item" fclog="{%= item.clog %}"><a href="{%= item.url %}" class="rec_lk" target="_blank" clstag="{%= clstagPrefix + \'a\' + (i < 9 ? \'0\' : \'\') + (1+i) %}"><img src="//misc.360buyimg.com/mtd/pc/common/img/blank.png" data-lazy-img="{%= imgUrl %}" alt="{%= item.title %}" title="{%= item.title %}" class="rec_img" data-webp="no" ></a></li>{% } %}</ul></div>{% } %} ',
    style: ".rec_list{overflow:hidden;height:100px}.rec_item{overflow:hidden;float:left;width:396px;height:100%}.rec_lk{display:block;height:100%}.rec_img{display:block;margin:auto}.o2_mini .rec_item{width:330px}.csstransitions .rec_img{-webkit-transition:opacity .2s;-moz-transition:opacity .2s;transition:opacity .2s}.csstransitions .rec_lk:hover .rec_img{opacity:.8}",
    time: 1479195351434,
    version: "ff78610a0ef9cdbb"
});
```

JS入口文件

```javascript
// https://misc.360buyimg.com/mtd/pc/index/home/index_focus.min.js
window.tplVersion = {
    "1212_tpl": "ce7dcd7cd0beacb2",
    elevator_tpl: "e4d5dbaa3ecd12d2",
    entry_tpl: "2caa7cd543c322ea",
    fbt_tpl: "18f8bff18188a453",
    floor_coupon_tpl: "b98cf33be84aae98",
    floor_ract_tpl: "13b92d16fb6e2f7a",
    mod_footer_tpl: "072072ffc47778be",
    more_tpl: "25dcb060800c503a",
    portal_tpl: "68fae801a032cf93",
    rec_tpl: "ff78610a0ef9cdbb",
    seckill_tpl: "4fee56c5b073e5e1"
};
```

通过上述方式，我们实现了模板、数据的分离缓存，由于楼层类似的关系，页面中的模板大多数是重复，这样子模板缓存起来就能大大提高模板的利用率，当用户第二次访问的时候将不会再产生请求，在加速访问的同时，减少网络带宽消耗，并且如果数据发生更新，用户只需要更新数据即可，大大减少流量消耗。

### 大量使用WebP格式图片

在这次改版中，很多的图片我们都使用了WebP格式来减小图片大小。

WebP格式，是谷歌开发的一种旨在加快图片加载速度的图片格式，图片压缩体积大约只有JPEG的2/3，并能节省大量的服务器带宽资源和数据空间。但WebP的兼容性不太好，目前基本只有`Chrome浏览器`可以支持，不过这对我们的首页来说，使用WebP还是会有很大的收益，因为通过我们的统计数据可知，首页`Chrome`用户已经占到了`60%`左右。

## 体验优化探索

在努力提升页面性能的同时，还要让页面的用户体验有所提升，这需要我们能站在用户和前端的角度提出合理的优化方案。

### 高清屏适配方案

人类的社会在发展，人类的社会在进步，现如今高清分辨率屏幕的应用已经越来越多，高冷的Mac自不必说，现在许多新型号的Windows电脑也配备了高清分辨率的显示器，所以为了提升这一部分用户的浏览体验，我们需要在高清屏上启用高清素材。

但页面中素材图基本都是运营上传的，如果传两套图对运营来说未免太过麻烦，但如果只传一套高清图，直接展示的话对非高清屏没有必要，会造成流量损耗。这时候京东给力的图片服务就发挥作用了。

图片服务支持按一定规则改变URL来等比缩放图片，例如原图是一张`800X340`的图片

```
//img13.360buyimg.com/cms/jfs/t3412/357/1332248120/113691/f29c2f1e/58244d4dN08b89f9e.jpg!q90.webp
```

我们可以通过这样设置来得到一样等比缩放`400X170`的图片

```
//img13.360buyimg.com/cms/s400x170_jfs/t3412/357/1332248120/113691/f29c2f1e/58244d4dN08b89f9e.jpg!q90.webp
```

这样的话，运营同学只需要上传一张高清图片，我们通过判断是否高清屏，来动态改变URL，使用图片服务来得到一张等比缩放的非高清素材，而且CDN会根据图片URL进行缓存，也就是说只要第一次访问过缩放的图片就好，这样性能也不会有什么损耗。

### 强制webkit内核渲染

很多国产浏览器都是双内核，例如360、QQ浏览器等，而它们都提供了强制使用Webkit内核渲染的开启方式，这样可以让用户获得更好的浏览体验。

```
<meta name="renderer" content="webkit" />
```

### OpenSearch

现在很多网站都能实现在浏览器搜索框内直接调用网站内部搜索的功能，这是通过 **OpenSearch** 来做到的，而京东之前一直是没有的，这样显然是不合适，而且有一些习惯于使用地址栏搜索的用户不能满足。在这次改版中，我们加上了这一功能，使得用户可以在浏览器地址栏就能直达京东搜索。

![OpenSearch](//misc.aotu.io/luckyadam/index_2016/open_search.jpg)

### 使用Icon Font

使用Icon Font可以提升设计师的发挥空间，在页面上使用一些特殊字体以提升页面的美观程度，让页面看起来更具有设计感，更加细腻，从而提升用户的浏览体验。

![Iconf font](//misc.aotu.io/luckyadam/index_2016/icon_font.jpg)

而且Icon Font兼容性非常好，可以让不同浏览器的用户获得一致的浏览体验，并且通过字体压缩工具，压缩后的字体文件也可以非常小，不会有太多的性能损耗。

### 空闲时间自动加载楼层及图片

前文提到，我们使用了按需加载来提升页面性能，但这样带来的问题就是只有当用户滚动楼层到浏览器视窗内，楼层才会开始加载，这样用户滚动得稍微快一点就会出现很多loading动画。

![空闲加载](//misc.aotu.io/luckyadam/index_2016/floor_auto_load.jpg)

为了减少这种情况的发生，让用户觉得楼层也加载很快，在不影响页面滚动、加载性能的前提下我们在用户操作的空闲时间自动加载剩余的楼层和图片。

将楼层的加载操作放入一个队列中，我们可以在用户停止滚动操作3s后开始自动加载这个队列中的楼层，而当用户开始滚动的时候清空这个加载队列，停止滚动3秒后又重新开始加载。通过这样处理可以合理利用用户浏览的空闲时间来加载页面，让用户感觉页面加载更快。

```
var scrollTimer = null;
var isScrolling = false;
$(window).bind('scroll.loadFloor', function (e) {
  isScrolling = true;
  clearTimeout(autoLoadTimer);
  clearTimeout(scrollTimer);
  autoLoadingQueue = [];
  resourceLoader && resourceLoader.pause();
  scrollTimer = setTimeout(function () {
    isScrolling = false;
    //TODO
	
	if (pageConfig.idleTimeLoad) {
      autoLoadTimer = setTimeout(autoLoad, 3000);
    }
  }, 200);
});

function autoLoad () {
  if (!isScrolling) {
    runFloorLoadQueue();
  }
}
```

## 页面可用性保障和监控

### 灾备策略

对于像京东首页这种大流量的网站，后端接口可能偶尔会出现错误，或者直接挂掉，特别是在双11这种可能会达到流量峰值的时候，但是不能因为接口出错的原因而使得页面显示出现错误。这就需要前端来配合给出一套合理的灾备方案。

通常，我们通过接口缓存、超时、重试来进行灾备处理。目前首页大部分接口、及所有模板请求，在请求成功后都会存入本地缓存，第二次请求，假如缓存没有过期将直接使用缓存，假如缓存过期将会重新请求，而一次正常的请求，都会经过超时或异常重试的逻辑，来保证用户能尽量访问到正常的数据，在正常接口无法获取数据之后又会有兜底接口来保障数据来源，这样的层层保障，很好地保证了页面的完整性。而且，针对所有接口，前端均有数据校验逻辑，每一个后端接口都要经过前端的数据校验，来验证接口的可用性，假如接口数据异常，前端将主动调用兜底接口来替代，这样来保证页面不至于错乱。

综上所述，首页的接口和模板正常请求流程如下

![接口请求流程](//misc.aotu.io/luckyadam/index_2016/request_flow.jpg)

这样一套复杂的流程下，每一个接口、模板请求都是统一的，所以需要对此进行封装，以便调用。首页是通过封装改造`$.ajax`来实现的，使用`$.ajaxPrefilter`和`$.ajaxTransport`方法对每个异步请求进行捕获处理，将接口、模板请求的重试、超时、缓存、兜底调用等封装起来，对调用者透明，使用起来变得非常容易，而不需要关心以上灾备策略的实现。

```javascript
var ajax = require('load_async');
// 本质就是$.ajax方法
ajax({
  url: '//f.3.cn/index-floor/?argv=aggr',
  jsonpCallback: 'jsonpCallbakcAggr', // jsonp回调函数名
  params: {}, // 参数
  needStore: true, // 是否需要缓存
  storeSign: '3aad2efsdf', //用户判断缓存是否过期的标记
  timeout: 3000, //接口超时
  times: 2, // 超时重试次数
  backup: '//www.3.cn/bak/aggr', // 兜底接口
  dataCheck: function (result) { // 接口数据校验，校验接口返回数据，若为true则走正常逻辑，为false则自动调用兜底逻辑
    if (result && result.code === 0) {
      return true;
    }
    return false;
  }
});
```

### 数据统计驱动改进

在这次首页改版项目中我们接入了`Athena测速系统`用于收集首页各种性能以及用户环境相关的数据，因为有数据统计，我们才能知道用户端具体的情况信息，有了数据统计我们才能对页面进行实时监控，有了数据统计，我们才能掌握我们做性能优化的成果，所有的分析都是要基于数据来进行，否则就是在自己在YY了。

目前我们主要收集了，用户网速、操作系统、浏览器分布、分辨率分布等各种信息，同时对于页面加载情况也有一定的监控，如页面测速打点上报、数据接口出现调用兜底接口的情况上报、楼层接口失败导致楼层隐藏的情况上报等。

通过以上数据统计，我们可以灵活地对我们的页面进行优化，同时及时发现问题，避免损失。例如我们通过统计发现用户在网速低于一定值时页面楼层隐藏数增多，这样我们就可以通过设置更长的超时时间来减少这一情况的发生，还有就是假如某时刻开始发现某接口调用兜底请求数暴增，可以判定接口出现问题而及时反馈给后端同学。

## 更长远的探索

新版首页已经上线小一个月了，表现一直还算良好，我们做出的性能以及体验优化也得到了体现，在此基础上，我们思考了更多的可以做的工作，来提升首页的表现。

### 静态资源预加载

首页承载着许多页面的入口，如频道页还有活动页，在双11的时候，首页会有很多直达活动的入口，如果我们能在首页预加载某些重要的活动页面的资源的话，当用户去访问这些活动页面就能更加迅速地打开浏览了。

![静态资源预加载](//misc.aotu.io/luckyadam/index_2016/hermes.jpg)

### 架构升级

`jQuery` + `Seajs`或许让人感到老旧且沮丧，我们考虑在首页上渐渐使用一些新的技术，例如去**Seajs**化，提供更优的打包方式，让页面性能进一步提升。

### 中间层探索

目前首页虽然差不多实现了前后端分离，但是首屏这里前后端已然存在耦合，假如前端可以介入到中间层的开发，那问题就迎刃而解了，接入中间层后，我们还可以将页面部分楼层做服务端渲染，以减少前端渲染的性能损耗，可以在实现前后端分离的基础上，让页面性能更好，还是有一定意义的。