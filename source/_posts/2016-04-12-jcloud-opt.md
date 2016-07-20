title: 前端优化实践总结
subtitle: 结合项目总结优化过程中如何寻找优化点以及收益比较大的常见方法，希望可以对遇到相似问题的同学有帮助，前端大神可轻轻淡笑而过。
cover: //img.aotu.io/mihanX/jcloud-opt/banner3.png
categories: 项目总结
tags:
  - 项目总结
  - 页面优化
author:
  nick: Mihan
  github_name: mihanX
date: 2016-04-12 15:50:35
---

<!-- more -->

记得前百度工程师张云龙说过，页面前端优化问题绝对不仅仅是为页面提速的问题，更是工程的问题，有兴趣的同学可以阅读《[前端工程与性能优化](https://github.com/fouber/blog/issues/3)》。里面有提到根据雅虎14条优化原则，《高性能网站建设指南》以及《高性能网站建设进阶指南》中提到的优化点梳理出来的优化方向：

![img](//img.aotu.io/mihanX/jcloud-opt/img_31.png)

张云龙先生提及到的优化方向从提出到现在虽已相隔两年时间，前端技术也在飞速发展，但其提到的工程化思想仍是前端优化的一个大方向，亦有很大的指导意义。

当然这是另外更大的话题了，这篇文章并不是将本次的优化点按照萌妹子暖暖写的《[前端优化不完全指南](http://aotu.io/notes/2016/03/16/optimization/#comments)》一一列出（当然并没有那么多，前端优化永远写不完，写不完：- O），而是**重点结合项目总结**这一次优化中**如何寻找优化点**以及**收益比较大的常见方法**，希望可以对遇到相似问题的同学有帮助，前端大神可轻轻淡笑而过。

## 高清图适配优化

我们所说的高清图一般是指至少具有 Retina 屏级别精度的图片，就是平时所说的『2x』图。对于高清图的适配，一般会根据图片特点以及项目实际情况去制定适配方案。

### 纯色图

纯色图一般应用到装饰性的小 icon，如侧导航的标题 icon：

![img](//img.aotu.io/mihanX/jcloud-opt/img_1.jpg) 

此类图标由单色组成，可以根据一定的绘制规则制成 iconfont 图标，iconfont 的图标具有矢量性，其大小和颜色可以都可以通过样式来控制。

新版首页出现了 33 个单色图标，这些图标复用性很强，同一个图标在不同页面都有出现，而且同一个图标还有不一样的尺寸，如果用传统方法做成图片的话图片数量会很多，即使全部合并成 sprite 图，图片的 K 数也会很大，而且后期如果有修改的话还得重新合并 sprite 图，因此这次首页改版所有的纯色图标的高清适配全部使用 iconfont 图标：

![img](//img.aotu.io/mihanX/jcloud-opt/img_4.jpg) 

#### ICONFONT图标管理

改版所用到的 ICONFONT 图标生成以及管理选择了『[阿里巴巴矢量图标库](http://iconfont.cn/)』线上服务，在上面通过上传图标的 SVG 文件生成对应的字体文件，还可以根据图标分项目管理：

![img](//img.aotu.io/mihanX/jcloud-opt/img_7.jpg)

图标生成后，该服务还会自动打包好所需文件，并制成 DEMO 网页，供本地预览查找图标对应的字体编码以及使用方法：

![img](//img.aotu.io/mihanX/jcloud-opt/img_8.png)

相信前端的同学很早就使用过 ICONFONT 服务，笔者衷心感谢提供 ICONFONT 服务的 [THX](http://thx.github.io/) 组织，除了 ICONFONT 服务，THX 还提供了不少业界良心的前端精品工具服务，感谢他们为业界作出的贡献。

### 非纯色图

非纯色图通常用『2X』图适配，适配方案可以有很多选择：媒体查询、srcset属性、image-set属性、脚本控制。

媒体查询、srcset属性 和 image-set属性成功匹配的基本是高端浏览器，兼容性略差，脚本控制兼容性更佳，项目具体用哪一种要看『国情』了：

![img](//img.aotu.io/mihanX/jcloud-opt/img_32.png) 

上图是我国PC端操作系统市场份额的大概分布情况，可以看出 95% 以上的用户都是使用 Windows 系统的，使用 Windows 系统的用户设备屏幕大部分都是普清屏，而使用高清屏的用户基本都是使用 Mac OS 系统，Mac OS 系统的浏览器又以『高富帅』Chrome 和 Safari 为主，因此只考虑适配 Mac OS 设备，最终选择比媒体查询更为方便的『srcset属性』和『image-set属性』方案：内容图使用 srcset 属性适配，背景图使用 image-set 属性适配高清图：

```html
<img src="images/bg_eco_v2_@1x.png" srcset="images/bg_eco_v2_@1x.png 1x, images/bg_eco_v2_@2x.png 2x" alt="">
```

```css
.chain_item_icon{
    background-image: -webkit-image-set(url("images/bg_chains_@1x.png") 1x, url("images/bg_chains_@2x.png") 2x);
    background-image: image-set(url("images/bg_chains_@1x.png") 1x, url("images/bg_chains_@2x.png") 2x);
}
```

### 设计类字体

新版京东云出现了很多设计类字体，也就是我们平时所说的非系统字体，如新版京东云首页版块标题用的字体 ----『方正兰亭超细黑体』

![img](//img.aotu.io/mihanX/jcloud-opt/img_9.png)

对于设计类字体，前端和视觉会达成共识不会大面积使用，因为该类字体的实现只能用图片或通过样式 `@font-face` 属性去实现：

* **图片方案：**虽然可以高精度还原，兼容性强，但是每改动一处地方都需要换图，不方便维护，内容扩展性差，而且如果要适配高清设备，又得多一套图。

* **`@font-face` 属性方案：**字体具有矢量性，高清设备可以轻松适配，内容扩展性强，但是不同的浏览器存在渲染的差异，兼容性略弱，`@font-face` 字体文件大小一般又是 M 级别，会不同程度影响页面加载体验。

如果非系统字体应用的地方只有几个标题，而且不常改动的话，用图片方案较优，但是新版京东云在其它频道的首页也会应用到，内容较多，而且要适配高清图，所以图片方案并不适用，`@font-face` 属性方案更合适。

针对 『`@font-face` 属性方案』**文件体积大**和**浏览器渲染差异**的两个不足之处，采取了一个折中的方案，也就是**浏览器的渲染差异在视觉可以接受的范围下，只抽取要用到的字体生成体积相对较小的字体文件。**

Junmer 出品的 [Fontmin](http://ecomfe.github.io/fontmin/tw#feature) 工具可以大大满足这个需求，只需要将用到了字体源以及需要生成的文字内容加入到工具中，就可以生成相应的字体文件：

![img](//img.aotu.io/mihanX/jcloud-opt/img_10.png)

原来 2MB 的字体

![img](//img.aotu.io/mihanX/jcloud-opt/img_12.png)

生成的字体文件只有 11KB，字体文件体积减少达到了 99%

![img](//img.aotu.io/mihanX/jcloud-opt/img_11.png)

## 图片资源优化

### 存在的问题

#### 额外请求数过多

旧版首页加载的时候，一共有40个请求，其中图片的请求就有 31 个，占总请求数的 77%

![img](//img.aotu.io/mihanX/jcloud-opt/img_14.png)

有些可以合并的图片并没有做处理：

![img](//img.aotu.io/mihanX/jcloud-opt/img_16.png) 

其中至少有 11 张图片是可以合并成一张图片的，也就是至少多了 27% 的额外请求数

#### 资源浪费

首屏的图片资源加载了 31个，但其可见的图片只有 2 张，加载了 100% 的图片资源，首屏图片资源利用率只有 6%

![img](//img.aotu.io/mihanX/jcloud-opt/img_15.png)

只要用户没有完全浏览完网页就跳到其它页面的话，都会造成资源浪费。

#### 图片加载体验差

首屏耗时较长的大图加载过程并没有做 Loading占位图 提示，有机会出现轮播图区域空白时间过长：

![img](//img.aotu.io/mihanX/jcloud-opt/img_17.png)

上图显示页面加载 1.8s 后，Banner 背景图还是没有出来，虽然网速飞快的用户有可能不出现这种情况，但是不排除网络慢的用户会碰上。

除此之外，图片加载失败的时候也没有做容错处理，就有机会出现图片加载失败的系统默认图标样式，会影响页面的美观性：

![img](//img.aotu.io/mihanX/jcloud-opt/img_18.png) 

### 优化方案

虽然新版首页的图片资源的排版和内容有所不同，但至少可以针对旧版额外请求数多、资源浪费、加载体验差这三个方向去改进。

#### 减少额外请求数

减少图片额外请求数，收益比较明显的一般有三个方法：图片合并、iconfont 图标、Base64，三个方法都有各自的优缺点：

* 图片合并
  
  优点：兼容性强可缓存可提前加载多态图可提升图片加载显示体验
  
  缺点：维护性差、合并图片类型以及大小控制限制高、有可能造成资源浪费
  
  适合：修改更新少的常驻型低色位的装饰小图
  
* Iconfont

  优点：可缓存矢量性可控性强
  
  缺点：存在浏览器渲染差异性、只能纯色、文件体积略大
  
  适合：纯色图标

* Base64

  优点：无额外请求
  
  缺点：不可缓存、兼容性差、代码冗余、可读性差、维护不便、CPU内存耗损大
  
  适合：体积小复用率低的背景装饰图标
  
新版首页一共有 70 个图片资源，其中有 49 个是纯色图标，16 个是低色位非纯色图，5 个是高色位图。

49 个纯色图标全部使用了 Iconfont 方法处理，13 个低色位非纯色图使用了合并方法，一共有 62 个图片做了减少额外请求处理，最终图片资源请求数一共只有 14 个，其中纯色图的请求数占 2 个，低色位非纯色图请求数占 6 个，**图片总请求数减少了 80% ，图片合并和 Iconfont 的额外请求处理率分别达到了 56% 和 96%**

![img](//img.aotu.io/mihanX/jcloud-opt/img_19.png)

可以看到 Iconfont 的额外请求处理率相当出色，因为适合应用他的对象特点比较简单，而图片合并会受到合并图片的格式、资源分布、模块分布等情况影响，其额外请求处理率会相对低于 Iconfont。

我们可以得到一个优化图片额外请求的小结论：**纯色图标优先考虑 Iconfont，低色位非纯色图片根据项目实际需要来做合并优化，Base64非特殊图片不使用**

#### 资源按需加载

新版首页需要加载的图片资源一共有 14个，其中首屏的图片资源有 8 个，可见图片有 5 个，如果不作处理，那么首屏图片资源的利用率只有 35%

![img](//img.aotu.io/mihanX/jcloud-opt/img_20.png)

如果进行资源按需加载，在非首屏的图片资源实行懒加载，将轮播图不可见的两张图片做触发加载处理，这样首屏的加载图片资源只有 8 个，首屏图片资源利用率则可达到 60%，提高了 70% 的图片资源利用率，**资源按需加载不失为一种避免资源浪费的最挂实践方法**

![img](//img.aotu.io/mihanX/jcloud-opt/img_21.png)


#### 占位提示图提高加载体验

图片加载的时间长短由很多因素决定，如服务器响应时间、用户所用网络带宽、图片大小等，但无论是哪一种情况，总有一个等待的过程，在这过程总会有一个空白时间，特别是占屏面积比较大的首屏轮播大图和采取懒加载的图片，即使图片空白时间很短，用户也会有不同程度的感知，会给用户带来一种唐突或漫长等待的感觉，如果加载过程给图片加上体积比较小的占位提示图，则会让用户有一个图片加载预知，当图片加载完成后再呈现给用户看，这样用户在图片加载过程中看到的都是完整的图片

![img](//img.aotu.io/mihanX/jcloud-opt/img_24.png)

当图片加载失败的时候，展示占位图，避免系统默认的图片加载失败图标出现

![img](//img.aotu.io/mihanX/jcloud-opt/img_23.png) 

## 渐进增强优化

渐进增强是指从最基本的功能出发，在保证系统在任何环境中的可用性基础上，逐步增加功能，提高用户体验，

### 动画性能渐进增强

出现在页面比较重要位置的模块，如轮播图、导航等，如果需要做动画效果的话，在高低端浏览器上都应该能统一实现出来，新旧版首页首屏都以轮播图为主，轮播图切换都使用了渐隐渐现的动画效果。

旧版的动画实现在高低端浏览器都使用了 JQ 第三方动画库

```html
...
<script type="text/javascript" src="js/jcloud_new/jquery.SuperSlide.2.1.1.js"></script>
..

<script>
//banner
$(".banner-slider").slide({mainCell:".bd ul",effect:"fold",autoPlay:true,interTime:4000,delayTime:1000});
$(".box-slider").slide({mainCell: ".bd ul", effect: "left", autoPlay: true, interTime: 5000, scroll: 6, vis: 6});
...
</script>
```

其实渐隐渐现的效果 CSS3 动画也能实现。新版首页的轮播图动画设置了 CSS3 动画后，再利用脚本控制样变化以触发 CSS3 动画，这样支持动画属性的浏览器就能以 CSS3 动画实现效果，而不支持的浏览器则通过脚本的属性判断，用 JQ 动画实现：

```scss
.fc_item{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    filter: alpha(opacity=0);
    opacity: 0;
    background: #fff;
    @include trst(opacity 0.8s linear);
}
```

```javascript
 // 轮播图切换
function imgChange(opt){  
    ...   
    // 如果支持 transform 属性，使用CSS3动画
    if(supports('transform')){
      $imgList.eq(opt).addClass('active').css('opacity','1').siblings().removeClass('active').css('opacity','0');
    }else{
    // 如果不支持 transform 属性，使用JQ动画
      $imgList.eq(opt).stop().animate({
        'opacity': '1'
      },800).addClass('active').siblings().stop().animate({
        'opacity': '0'
      },800).removeClass('active');
    }
    ...
}
...
```
JQ 动画虽然兼容性好，但其动画性能远远不及 CSS3 动画，**因此我们可以用以下的方法对动画性能实现渐进增强：高端浏览器可以通过触发 CSS3 动画实现效果，低端浏览器则使用 JQ 动画实现。**

### 视觉渐进增强

**视觉渐进增强通常可以通过 CSS3 属性和增加 CSS3 动画来实现**，现主流的网站基本都会对视觉做渐进增强处理。本次首页改版主要在多态元素、切换元素上做了处理

支持 CSS3 动画的 SexyGuy

![img](//img.aotu.io/mihanX/jcloud-opt/img_25.gif)

不支持 CSS3 动画的 PoorGuy

![img](//img.aotu.io/mihanX/jcloud-opt/img_33.gif)  


## Tab 键锚点聚焦优化

浏览页面的时候，通过 Tab 键可以聚焦页面上的链接锚点，这时候浏览器会在锚点增加一个系统默认边框样式告诉用户锚点已选中，按 `Enter` 就可以打开选中的锚点，如 Chrome 浏览器上 google 首页的语音搜索按钮：

![img](//img.aotu.io/mihanX/jcloud-opt/img_26.png) 

即使用户在浏览页面的时候鼠标突然失灵了也可以通过键盘操作继续完成浏览网页，这样的设计显然是为了增强页面的可用性。

但很多时候，在一些重要位置的内容，如全站的导航，产品经理或视觉设计师会要求将这个系统的样式去掉，于是很多同学可能会选择设置`outline:none`去掉边框样式，有些甚至会在全局 a 标签上设置，如旧版的京东云首页：

![img](//img.aotu.io/mihanX/jcloud-opt/img_27.png)

`outline:none`设置之后，页面上的所有链接虽然能通过`Tab`键聚焦，但链接并没有被选中的样式，没有办法直观辨出选中的链接

![img](//img.aotu.io/mihanX/jcloud-opt/img_28.gif)

虽然并非所有用户都会用到 Tab 键，但还是会有少数用户会用到，如键盘党，而这种降低可用性的体验存在表明页面并没有健全，因此并不建议去掉`outline`样式。

如果真的有去掉 `outline`样式的需求怎么办？其实，页面链接一般都会被设计为多态的，利用链接的多态样式，为链接加上`:focus`伪类选中样式，Tab 选中链接后就会展示 `:focus`伪类样式了，如新版首页的导航：

![img](//img.aotu.io/mihanX/jcloud-opt/img_29.png)

可以为链接加上`:focus`伪类样式

```scss
.mod_hd_nav_sub_col{
	...
	a{
		color: #fff;
		text-decoration: none;
		outline: none;
		&:hover,&:focus{
			color: #ffe400;
			text-decoration: none;
		}
	}
	...
}
```

当选中链接还绑定有事件的时候，也应该为之绑定相应事件

```javascript
...
$navBox.on({
	'mouseenter': function () {
		...
	},
	
	'focus': function(){
		$(this).trigger('mouseenter'); // Tab 操作支持
	},

	'mouseleave': function () {
		...
	},
	
	'blur': function(){
		$(this).trigger('mouseleave'); // Tab 操作支持
	}
}, '.mod_hd_nav_item');
...
```

处理完，虽然 `outline`样式去掉了，但依然可以用 Tab 键完成链接的选中

![img](//img.aotu.io/mihanX/jcloud-opt/img_30.gif)

## 静态资源更新发布

旧版首页所有的静态资源的更新发布方式都是采用覆盖式更新：

```html
...
<script type="text/javascript" src="js/jcloud_new/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/jcloud_new/jquery.SuperSlide.2.1.1.js"></script>
<script type="text/javascript" src="js/jcloud_new/login_w.js"></script>
<script type="text/javascript" src="http://jcms.jd.com/resource/js/cms.js"></script>
...
```

覆盖式更新发布有机会遇到缓存问题以及在发布的时候导致页面错乱问题，详情可以看一下张云龙前辈在知乎对问题『[大公司里怎样开发和部署前端代码？](https://www.zhihu.com/question/20790576/answer/32602154)』的回答，解决覆盖式更新产生的问题，现主流方法就是使用 MD5 文件名进行非覆盖式发布，京东云新版首页所有的静态资源的更新发布都采用了这种方式。

```html
...
<script src="//labs.qiang.it/pc/jcloud/gb/js/lib.min_2f4dab0c.js"></script>
<script src="//labs.qiang.it/pc/jcloud/gb/js/gb.min_b599b860.js"></script>
<script src="//labs.qiang.it/pc/jcloud/home/js/index.min_9d957a15.js"></script>
...
```

OK，优化永远说不完的，以上所说的只是前端优化的冰山一角，业界绝不缺高大上的优秀优化方案，但从业务实际规模出发的话，这些小优化在本次改版中已得到很明显的收益，期待以后有更具规模的项目可以挥霍高大上的优化方案，最后把新旧版的页面都放到预览服务器上了

* [旧版首页](http://labs.qiang.it/pc/jcloud_com/index.html)
* [新版首页](http://labs.qiang.it/pc/jcloud/home/index.html)