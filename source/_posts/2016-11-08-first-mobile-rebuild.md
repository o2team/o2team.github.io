title: 我的第一次移动端构建 — 总结与思考
subtitle: 
cover: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/poster.jpg
categories: 项目总结
tags:
  - html
  - css
  - mobile rebuild
author:
  nick: 饮水机隔壁的小刘
  github_name: JChehe
coeditor:
    name: 饮水机隔壁的小刘
    url: https://github.com/JChehe
wechat:
    share_cover: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/wx_share.jpg
    share_title: 我的第一次移动端构建 — 总结与思考
    share_desc: 我的第一次...
date: 2016-11-02 21:22:23
---

<!-- more -->

---

最近被组长分配到移动端开发组，支持某活动的页面构建。这算是我第一次真正接触移动端构建，下面就谈谈个人感受和总结。

## 整体流程
开会大体讲解、讨论与排期 -> 交互设计 -> 视觉设计 -> 页面构建 -> 前端开发 -> 测试

每个步骤环环相扣，每个职位都需要和其前后的人沟通协调。

测试遇到问题则会反馈到相应环节负责人。

当然，涉及的职位也不仅于此，还有法务同事审核内容是否符合当前法规等等。

看到别的项目的一张感谢图，可知一次活动涉及到很多个团队。  
![此处输入图片的描述][1]

## 构建工具
### Athena
前端开发离不开构建工具，除了敲代码，其余都交给构建工具（如组件开发、CSS 兼容处理、图片 Base64、图片雪碧图和压缩处理等）。  
在 [Athena](https://athena.aotu.io/) 中，文件层级结构如下：项目 project -> 模块 module（具体每个活动） -> 页面 page -> 部件 widget。  

举例： 某项目 -> X、Y 活动 -> 预热页和高潮页 -> 头部、弹框等 widget。一般文件目录如下：
```
Xproject
    - gb (公共部分，如初始化样式和一些常用 widget)
    - X活动
        - page
            - 预热页
            - 高潮页
        - widget
            - header
            - footer
            - diglog
    - Y 活动
    - ...
```

刚开始接触时，存在这样的一个疑惑：什么是 widget，一个不可复用的页面头部可以作为 widget 吗？  
答：我最初的想法是：“错误地把 widget 当成 component，component 一直被强调的 特性之一是**可复用性**。对于不可复用的部分就不应该抽出为一个widget了？”**其实对于一个相对独立的功能，我们就可把它抽出来。**这无疑会增强程序的可维护性。 

对于一个项目，一般一个模块由一个人负责。但考虑到每个模块间可能存在（或未来存在）可复用的 widget，需要规范命名以形成命名空间，防止冲突（具体会在下面的规范-命名中阐述）。

> Component 与 Widget 的区别   
Component 是更加广义抽象的概念，而Widget是更加具体现实的概念。所以Component的范围要比Widget大得多，通常 Component 是由多个 Widget 组成。
举个例子，可能不是很恰当，希望帮助你的理解，比如家是由床，柜子等多个 Component 组成，柜子是由多个抽屉 Widget 组成的。
而 Component 和 Widget 的目的都是为了模块化开发。

其实，在这里并没有对 widget 和 component 做这么细的区分。

## 规范
### widget
正如上面讨论的，一个页面由多个 widget 组成。因此，一个页面看起来如下：
```
<body ontouchstart>
  <div class="wrapper">
    <!-- S 主会场头部 -->
    <%= widget.load("app_market_main_header") %>
    <!-- E 主会场头部 -->
    <!-- S 达人问答区 -->
    <%= widget.load("app_market_answer") %>
    <!-- E 达人问答区 -->
    <!-- S 优惠券 -->
    <%= widget.load("app_market_coupons") %>
    <!-- E 优惠券 -->
    <!-- S 达人集中营 -->
    <%= widget.load("app_market_camp") %>
    <!-- E 达人集中营 -->
    <!-- S 达人穿搭公式 -->
    <%= widget.load("app_market_collocation") %>
    <!-- E 达人穿搭公式 -->
    <!-- S 卡券相关弹框 -->
    <%= widget.load("app_market_dialog") %>
    <!-- E 卡券相关弹框 -->
  </div>
```
widget 一般存在可复用性。但如何控制细粒度呢？分得越细代码就越简洁，但工作量和维护难度可能会上升，因此需要权衡你当时的情况。

### 命名
由于一个项目中，一个模块由某一个人负责，但模块之间的 widget 存在或未来存在可复用的可能（而且开发可能会为你的页面添加已有的组件，如页面会嵌在某 APP 内，该 APP 已有现成的一些提示框）。因此，需要命名空间将其它们进行区分以防止冲突。由于 CSS 不存在命名空间，因此只能通过类似 BEM 的方式（具体根据团队的规范），如：`app_market_header`、`app_market_list_item`。`app_market` 是模块（即某个活动）的标识，在该项目下，它是唯一的。

另外，还有一点：类名是否要按照 html 层级关系层层添加呢？如：
```
div.app_market_header
    div.app_market_header_icon
    div.app_market_header_**
```
对于 `app_market_header_icon`，尽管在 header 中，但 icon 并不只属于 header，而属于整个模块（活动），那么我们就可以改为 `app_market_icon`。

leader review 我的代码后，语气深长地讲下以下内容：
反面教材：  
```
<div class="app_market_answer">
  <div class="app_market_secheader"></div>
  <div class="app_market_answer_list">
    <div class="app_market_answer_item">
      <div class="app_market_answer_item_top"></div>
      <div class="app_market_answer_item_middle"></div>
      <a href="javascript:;" class="app_market_answer_item_bottom">去围观</a>
    </div>
</div>
```
存在的问题是：嵌套层级越深，类名就越长。

较好的解决方案：  
```
<div class="app_market_answer">
  <div class="app_market_secheader"></div>
  <div class="app_market_answer_list">
    <div class="app_market_answer_item">
      <div class="app_market_answer_itop"></div>***
      <div class="app_market_answer_imid"></div>***
      <a href="javascript:;" class="app_market_answer_ibtm">去围观</a>***
    </div>
</div>
```
这是基于『姓名』原理进行优化的，举例：`app_market_answer_item` 是姓名（库日天），那么它的子元素只需继承它的『姓』（库姆斯） `app_market_answer_itop`，而不是它的姓名（库日天姆斯） `app_market_answer_item_top`。每当类名达到三到四个单词长时，就要考虑简化名字。

进一步优化，app_market 可以看成是『复姓』，有时为了书写便利，可以以两个单词的首字母结合形成一个新的『新姓』- 『am』。当然，追求便利的副作用是牺牲了代码的可读性。如果你负责的项目或页面没有太大的二次维护或者交叉维护的可能性，推荐做此简化。

BTW：此简化后的『姓』可以在代码中稍加注释说明，如下代码所示：
```
<!-- am = app_market -->
<div class="am_answer">
  <div class="am_secheader"></div>
  <div class="am_answer_list">
    <div class="am_answer_item">
      <div class="am_answer_itop"></div>
      <div class="am_answer_imid"></div>
      <a href="javascript:;" class="am_answer_ibtm">去围观</a>
    </div>
</div>
```

## 技术涉及
### REM
移动端采用 rem 布局方式。通过动态修改 html 的 font-size 实现自适应。

#### 实现方式
REM 布局有两种实现方式：CSS 媒介查询和 JavaScript 动态修改。由于 JavaScript 更为灵活，因此现在更多地采用此方式。

##### JavaScript
凹凸的实现方式是：在 `head` 标签末加入以下代码
```
<script type="text/javascript">
    !function(){
      var maxWidth=750;
      document.write('<style id="o2HtmlFontSize"></style>');
      var o2_resize=function(){
          var cw,ch;
          if(document&&document.documentElement){
              cw=document.documentElement.clientWidth,ch=document.documentElement.clientHeight;
          }
          if(!cw||!ch){
              if(window.localStorage["o2-cw"]&&window.localStorage["o2-ch"]){
                  cw=parseInt(window.localStorage["o2-cw"]),ch=parseInt(window.localStorage["o2-ch"]);
              }else{
                  chk_cw();//定时检查
                  return ;//出错了
              }
          }

          var zoom=maxWidth&&maxWidth<cw?maxWidth/375:cw/375,zoomY=ch/603;//由ip6 weChat
          window.localStorage["o2-cw"]=cw,window.localStorage["o2-ch"]=ch;
          //zoom=Math.min(zoom,zoomY);//保证ip6 wechat的显示比率
          window.zoom=window.o2Zoom=zoom;
          document.getElementById("o2HtmlFontSize").innerHTML='html{font-size:'+(zoom*20)+'px;}.o2-zoom,.zoom{zoom:'+(zoom/2)+';}.o2-scale{-webkit-transform: scale('+zoom/2+'); transform: scale('+zoom/2+');} .sq_sns_pic_item,.sq_sns_picmod_erea_img{-webkit-transform-origin: 0 0;transform-origin: 0 0;-webkit-transform: scale('+zoom/2+');transform: scale('+zoom/2+');}';
      },
      siv,
      chk_cw=function(){
          if(siv)return ;//已经存在
          siv=setInterval(function(){
              //定时检查
              document&&document.documentElement&&document.documentElement.clientWidth&&document.documentElement.clientHeight&&(o2_resize(),clearInterval(siv),siv=undefined);
          },100);
      };
      o2_resize();//立即初始化
      window.addEventListener("resize",o2_resize);
  }();
  </script>
```

从以上代码可得出以下信息：  

1. 以 iPhone 6 为基准，iPhone 6 的缩放比 `zoom` 为 `1`
2. 由于只针对移动端，因此最大宽度为768（恰好等于 iPad 的竖屏宽度）
3. 通过 document.documentElement.clientWidth 获取视口宽度
4. resize 事件主要考虑横竖屏切换和你在PC上调试时🙃
5. zoom 系数是 20。系数决定了在宽度 375 的 iPhone6 下，1 rem 的值是多少 px（20px）。当然如果想过渡到 vw，可以将 zoom 系数设置为 3.75，那么 100rem 就是 375px 了

#### 为什么要用
有人说 rem 布局是 `vw` 和 `vh` 的替换方案，当 `vw` 和 `vh` 成熟时，两者可能会各司其职吧。

> [vw 的兼容性][2]：在安卓 4.3 及以下是不支持的。

##### 哪些地方要用
由于 rem 布局是相对于视口宽度，因此任何需要根据屏幕大小进行变化的元素（width、height、position 等）都可以用 rem 单位。

但 rem 也有它的缺点——不精细（在下一节阐述），其实这涉及到了浏览器渲染引擎的处理。因此，对于需要精细处理的地方（如通过 CSS 实现的 icon），可以用 px 等绝对单位，然后再通过 transform: scale() 方法等比缩放。

##### 字体
那 `font-size` 是否也要用 rem 单位呢？ 这也是我曾经纠结的地方。如果不等比缩放，对不起设计师，而且对于小屏幕，一些元素内的字体会换行或溢出。当然这可以通过 CSS3 媒介查询解决这种状况。

字体不采用 rem 的好处是：在大屏手机下，能显示更多字体。

看到 [网易新闻][3] 和 [聚划算][4] 的字体大小都采用 rem 单位，我就不纠结了。当然，也有其它网站是采用绝对单位的，两者没有绝对的对与错，取决于你的实际情况。

#### 缺点
##### 小数点（不精细，有间隙）
由于 rem 布局是基于某一设备实现的（目前一般采用 iPhone6），对于 375 倍数宽的设备无疑会拥有最佳的显示效果。而对于非 375 倍数宽的设备，zoom 就可能是拥有除不尽的小数，根元素的字体大小也相应会有小数。而浏览器对小数的处理方式不一致，导致该居中的地方没完全居中，但你又不能为此设置特定样式（如 margin-top: *px;），因为浏览器多如牛毛，这个浏览器微调居中了，而原本居中的浏览器变得不居中了。

对于图标 icon，rem 的不精细导致通过多个元素（伪元素）组合而成的 icon 会形成错位/偏差。因此，在这种情况下，需要权衡是否需要使用 CSS 实现了。

### SASS
SASS 无疑增强了原本声明式的 CSS，为 CSS 注入了可编程等能力。在这次项目，算是我第一次使用 SASS，由于构建工具和基础库的完善，只需通过查看/模仿已有项目的 SASS 用法，就能快速上手。后续还是要系统地学习，以更合理地使用 SASS。

使用 SASS 的最大问题是：层级嵌套过深，这也是对 SASS 理解不深入的原因。可以关注一下转译后的 CSS。

### 兼容性
这次项目的 APP 采用手机自带浏览器内核，而这些浏览器内核依赖于系统版本等因素。另外，国产机也会对这些内核进行定制和修改。特别是华为、OPPO。

下面列出我所遇到的兼容性问题（不列具体机型，因为这些兼容性处理终会过时，不必死记硬背，遇到了能解决就好（要求基础扎实））：

 - flexbox：在构建工具处理下（实现了新旧语法）可以大胆用，但个别设备不支持 flex-wrap: wrap。因此对于想使用 flex-wrap 实现自动分行的情况，建议使用其他实现。如果个数固定（如 N  行，每行 M 个），则可使用 N 个 flexbox（这样就可以使用 flexbox 的特性了）。flexbox 的其他属性也有支持不好的情况，可以通过显式声明 display、overflow、width、height 等方法解决。
 - background-size：需要单独写，否则在 [安卓 4.3 及以下，IOS 6.1及以下不兼容][5]。
 - 渐变：线性渐变大胆使用，径向渐变有兼容性问题。但是不建议对整体背景使用，会有性能问题（可简单地通过 1px 高的图片替代，注意，不要 background-size: 100% auto; 应该采用 background-size: 100% 1px; 因为有些浏览器会忽略小数点【`auto = img.Height * (screen.Width/img.Width)`】，导致图片未显示）。
 - classlist.remove(String[, String])，传递多个参数时，会有不兼容的情况。建议每次写一个。add (String[, String])同理。
 - 根节点 html font-size 渲染错误：在华为、魅族的某设备上（手Q），会出现一个非常奇葩的渲染 Bug，同一个网页，“扫一扫”打开 html 的 font-size 正常，直接点击链接会出现**渲染出来的 html font-size 会比设置得值大**（如：设置25.8，渲染出来是 29），因此导致整体变大，且布局错乱。  
我的方法是：为 html font-size 重新设置大小：渲染字体大小 - (渲染与正常差值)

 ```
    function getStyle(ele, style) {
        return document.defaultView.getComputedStyle(ele, null)[style]
    }
    ;(function fixFontSize() {
        var target = window.o2Zoom * 20
        var cur = parseInt(getStyle(document.documentElement, "fontSize"))
        while(cur - target >= 1) {
            document.documentElement.style["fontSize"] = target - (cur - target) + "px"
            cur = parseInt(getStyle(document.documentElement, "fontSize"))
        }          
    })();
 ```

有网友提供这个方法 `<meta name="wap-font-scale" content="no">`，经测试不可行。此方法是针对 UC 浏览器的。

上面主要列出了对使用有影响的兼容性问题，有些由于浏览器渲染引擎导致的问题（不影响使用），若无法通过 transform、z-index 等解决，也许只能通过 JavaScript 解决或进行取舍了。

### 其他一些知识点

 - 图片占位元素：对于宽高比例不变的坑位，通过将图片放置在占位元素中，可避免图片加载时引起的页面抖动。
 - 1px：在 retina 屏幕下，1 CSS像素是用 4 个物理像素表示，为了在该屏幕下显示更精细，通过为 ::after 应用以下代码（以上边框为例）：
    
        div {
            position: relative;
            &::after {
                content: '';
                position: absolute;
                z-index: 1;
                pointer-events: none;
                background: $borderColor;
                height: 1px;left: 0;right: 0;top: 0;
                @media only screen and (-webkit-min-device-pixel-ratio:2) {
                    &{
                        -webkit-transform: scaleY(0.5);
                        -webkit-transform-origin: 50% 0%;
                    }
                }
            }
        }

 - 根据元素个数应用特定样式：
    
        /* one item */
        li:first-child:nth-last-child(1) {
        	width: 100%;
        }
        /* two items */
        li:first-child:nth-last-child(2),
        li:first-child:nth-last-child(2) ~ li {
        	width: 50%;
        }
        /* three items */
        li:first-child:nth-last-child(3),
        li:first-child:nth-last-child(3) ~ li {
        	width: 33.3333%;
        }
        /* four items */
        li:first-child:nth-last-child(4),
        li:first-child:nth-last-child(4) ~ li {
        	width: 25%;
        }
     应用样例有：根据元素个数自适应标签样式。  
     ![根据元素个数自适应标签样式][6]   
     而对于反方向标签，可先首先对整体 transform: scale(-1)，然后再对字体 transform: scale(-1) 恢复从左向右的方向。效果如下：  
 ![标签反向][7]  
 - 卡券：『带孔且背景是渐变的卡券』在复杂背景中的实现。由于背景是复杂的（非纯色），因此孔不能简单地通过覆盖（与背景同色）产生。这里可以应用径向渐变 `background-image: radial-gradient(rem(189/2) 100%, circle, transparent 0, transparent 3px, #fa2c66 3px);`，其中 3px 是孔的半径。另外，卡券的上下部分是线性渐变的，因此可以在上下部分分别通过伪类元素添加 `background-image: linear-gradient(to top, #fa2e67 0, #fb5584 100%);`，当然，要从离外上/下边界 3px 的地方开始。虽然这不能完美地从最边界开始，但效果还是可以的。但由于径向渐变的兼容性问题，我最终还是用图片替换了这种实现。🙄   
 ![带孔且背景是渐变的卡券][8]  
 - 多行文本的多行padding：让背景只出现在有文字的地方，可直接设置 `display: inline;`，但还会存在一个问题是：padding 只会出现在多行文本的首和尾，对于需要为每行文本的首尾都需要相同的 padding，可以参考这篇文章：[《multi-line-padded-text》](https://css-tricks.com/multi-line-padded-text/) 。该文章提供了多种实现方式，根据具体情况选择一种即可。另外，对于每行的间距，可通过设置 line-height 和 padding-top/bottom 实现，其中 line-height 要大于（字体高度+padding-top/bottom）。  
 ![此处输入图片的描述][9]  
 ![此处输入图片的描述][10]  
 - 最小字体限制：PC上最小字体是 12px、移动端最小是 8px，当然可通过 transform:scale() 突破限制。

### 不止页面构建
1. 基础：合理运用 CSS 的威力更好地完成对设计稿的重现目的。  
2. 沟通：由于分工较细，只负责构建的同学，需要与产品和设计沟通，以达到交给开发后更少修改的目的。如哪些地方可跳转、哪些地方最多显示几行文字、超出如何处理（直接隐藏/省略号等）、坑位中的图片摆放（顶部对齐/居中等）等等。  
3. 代码上的沟通：HTML 注释要写好、HTML 与 CSS 代码要规范（命名等）清晰。  

### 思考
由于工具的成熟，我不需要考虑构建工具的搭建。  
由于发布方式的成熟，构建和开发能更好地分离，构建负责输出 HTML、CSS，开发负责 copy html 代码和引入 CSS 页面片。CSS 页面片由构建更新发布，开发无需关心。这达到了互不干扰、多线程并行的效果。  
成熟的基础设施让我们免除了非代码相关的烦恼，但这也让我担心：假如有一天我脱离了这些基础设施，我该如何保持高效。


#### 延伸：页面片是什么？
CSS 页面片
```
<!-- #include virtual="/static/res/sinclude/cssi/h5/1111/app_market/branch.shtml" -->
<link combofile="/fd/h5/1111/app_market/branch.shtml" rel="stylesheet" href="//wq.360buyimg.com/c/=/fd/h5/1111/gb/css/gb.min_1151b5b0.css,/fd/h5/1111/app_market/css/branch.min_925332fc.css" />
```

JS 页面片
```
<!-- #include virtual="/static/res/sinclude/cssi/h5/1111/app_market/branch_js.shtml" -->
<script combofile="/fd/h5/1111/app_market/branch.shtml" src="//wq.360buyimg.com/fd/h5/1111/app_market/js/branch.min_8971778a.js"></script>
```

> Combo Handler是Yahoo!开发的一个Apache模块，它实现了开发人员简单方便地通过URL来合并JavaScript和CSS文件，从而大大减少文件请求数。 http://www.cnblogs.com/zhengyun_ustc/archive/2012/07/18/combo.html



-----
这就是我的第一次...🙈 学习很多，完！

以上仅是我个人完成某构建项目的思考和总结，不小心暴露了团队下限。🌚


  [1]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/team.jpg
  [2]: http://caniuse.com/#search=vw
  [3]: http://3g.163.com/
  [4]: https://jhs.m.taobao.com/m/index.htm#!all
  [5]: http://caniuse.com/#search=background-size
  [6]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/tag1.png
  [7]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/tag2.png
  [8]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/coupon.png
  [9]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/multi-line1.png
  [10]: //misc.aotu.io/JChehe/2016-11-08-first-mobile-rebuild/multi-line2.png
