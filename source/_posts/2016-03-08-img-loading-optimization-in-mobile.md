title: "让图片加载这件事儿变得更美好"
subtitle: "图片是触屏页面让人赏心悦目的重要元素之一。而对图片资源的加载渲染将影响页面呈现，处理好图片加载才能给用户更好的体验。"
date: 2016-03-08 17:38:02
cover: //img.aotu.io/Tingglelaoo/20160302/load_cover_840x340.png
categories: 性能优化
tags: 
 - Images
 - Load
 - optimize
 - Mobile
author:
	nick: Ting
	github_name: Tingglelaoo
---
如果你问我构建触屏页面的过程中有什么困难的？
我可以拍着胸口跟可以跟你讲，有三大问题！那就是图片、图片、图片。
尤其是面对活动运营侧的需求的时候，连妈妈都要问我为什么要跪着做需求。
一个萝卜一个坑，总有一个萝卜适合你的坑。今天就来让图片加载这件事儿变得更美好，让用户跪倒你的石榴裙(牛仔裤)下。
<!-- more -->
## 图片优化的一般方法
 在本文正式开始之前，笔者先提提图片优化的一般方法，了解图片优化的方法有助于理解后面图片加载实现形式的多样化。
 一般常见的图片优化方法有：
- 减少文件体积大小
- 减少图片资源请求数(合并HTTP请求)

### 减少图片文件体积大小
可以从
  - 压缩优化图片大小
  - 采用合适的图片格式

两个途径来进行对体积大小的优化。
这里推荐阅读[《Web性能优化：图片优化》](http://cabbit.me/web-image-optimization/)，博主在文中讨论如何更优地选择图片的恰当格式以及推荐了优化图片大小的工具。

### 减少图片资源请求数(合并HTTP请求)
减少图片资源请求数(合并HTTP请求)的途径除了最为普遍的
 - 合成雪碧图

还有
 - 使用DataURL

这里特别提下，采用DataURL这种方式将图片被转换成base64编码的字符串形式的，如果单纯地“嵌”入HTML中是不会被缓存的，但是加在CSS或JS文件中，通过缓存CSS或JS则达到了间接缓存以base64编码的图片。
这里推荐一个将图片转换成Base64编码的字符串的在线工具： [DataURLMaker在线工具](http://dataurl.net/#dataurlmaker)
因为本文的重点不在于讨论图片优化的内容，所以这里就简单总结下对图片进行优化的方法，对于更详细的内容，笔者则按下不表了。
对于触屏页面中常见的的图片资源加载方式，笔者归纳为三类：正常加载、预加载、懒加载。

## 正常加载
所谓正常加载，则是开发者不采用人为地方式去干扰，按照浏览器正常加载的方式去加载渲染页面。
适合采用正常加载的方式的情景是图片数量较少以及图片体积较小，对触屏页面呈现的用户体验不影响或影响较少。
但是在现有的大环境中，限制于网络宽带等客观的因素，而且触屏页面的华丽炫目的设计都需要依靠图片，单纯的CSS是无法满足要求的，对图片的应用还是有一定量。
所以，能够毫无顾忌地采用正常加载的方式的案例还是比较少的，目前笔者暂时是没有见过。

## 预加载
在触屏页面处理中最为常见的可以是说预加载，几乎每个触屏页面的案例都使用到了这种方式。
为了完整地呈现页面给用户，开发者会通过一定的技术预先加载图片资源（以及页面其它资源），等加载渲染完毕再把页面呈现给用户。
而根据这个预加载的过程是否有明显的进度提示，笔者把常见的预加载方式划分为两种形式：
- 显性预加载
- 隐性预加载

### 显性预加载
显性预加载指的则是处于预加载过程时页面有明确的加载提示，比如进度条或者是Loading图标。
譬如，我厂的触屏页面案例《点燃你心中的野兽》，在预加载过程提示加载的进度，让用户有个心理预期，减少等待的烦躁感。

>以下截图来源自京东的[《点燃你心中的野兽》](http://wqs.jd.com/promote/CH77/2015/paper/index.html)
<img src="//img.aotu.io/Tingglelaoo/20160302/yeshou.png" alt="img" style="display:inline-block;max-width:200px;max-height:200px;width:100%;"/>

<img src="//img.aotu.io/Tingglelaoo/20160302/paper.png" alt="img" style="display:block;width:100%;max-width:320px;margin:0 auto;"/>
这个案例下的预加载处理技术是，先把页面DOM结构放入JS模版中，预加载完成后再把页面从JS模版拎出来，页面渲染完后能够完整地呈现页面给用户。
其中，图片资源相关预加载处理代码段为：
```javascript
 PreLoad.prototype.image = function(a) {
        var b = document.createElement("img");
        b.src = a
        ...
    }

```

通过创建image元素，设置其src，就简单方便可以预先发起HTTP请求，实现预加载图片。
除了对png/jpg等格式图片能够利用以上方法实现预加载，对于DataURL转换图片为base64编码的字符串也能够实现预加载。
  在Adidas的《罗斯·决不凋谢》中，利用DataURL协议将图片转换成base64编码的字符串写入JS中，预加载JS文件完成后通过JS来进行内联在DOM元素中。
> 以下截图来自案例[《Adidas：罗斯·决不凋谢》](http://drose6.adidasevent.com/])![img](//img.aotu.io/Tingglelaoo/20160302/rose.png '示例图片' '{"style":"display:inline-block;max-width:200px;max-height:200px;width:100%;"}' %}

<img src="//img.aotu.io/Tingglelaoo/20160302/drose6.png" alt="img" style="display:block;width:100%;max-width:320px;margin:0 auto;"/>

这里贴出该案例中部分预加载处理代码代码，有兴趣的可以详见0.main.js、2.main.js、3.main.js处深入研究。
> 以下为Chrome Dev Tool 对案例资源查看的界面截图

<img src="//img.aotu.io/Tingglelaoo/20160302/drose6-code.png" alt="img" style="display:block;width:100%;" />

虽然，业界有一种说法是不建议在移动端开发中使用DataURL转换图片为base64编码的做法，因为对大量的base64图片解码比较损耗内存和性能，但是使用base64在一定条件下是有助于页面加载速度提升，具体的原由可以前往[《图片资源Base64化在H5页面里有用武之地吗？》](http://aotu.io/notes/2016/03/04/can-we-use-base64-in-h5-webapps/)阅读。
### 隐性预加载
除了明确的预加载提示，还有一种是通过推进触屏页面进度的趣味互动的方式，笔者称之此种类似的情况为隐性预加载。
  
> 截图来自案例[《大众点评：阿惠故事1 - 吃饭别带姥爷》](http://evt.dianping.com/market/20151207/)![img](//img.aotu.io/Tingglelaoo/20160302/ahui.png '示例图片' '{"style":"display:inline-block;max-width:200px;max-height:200px;width:100%;"}' %}

<img src="//img.aotu.io/Tingglelaoo/20160302/hui-loading.png" alt='示例图片' style="display:block;width:100%;max-width:640px;margin:0 auto;" />


在大众点评的《阿惠故事1 - 吃饭别带姥爷》的预加载中，先是显性预加载(钱币小图标Loding)快速地呈现部分画面(截图右部分)给用户，再通过互动(向上滑动数钱)来继续分段加载资源。这样的做法一改用户往日沉闷的等待，能够给予用户更好的体验。

还有一个比较特别的案例是大众点评和欧莱雅合作的《好年从头开始》，笔者也将之归纳为隐性预加载。
  
>截图来源于案例[《大众点评：好年从头开始》](http://evt.dianping.com/midas/160108-loreal/index.html)
<img src="//img.aotu.io/Tingglelaoo/20160302/oulaiya.png" alt='示例图片' style="display:inline-block;max-width:200px;max-height:200px;width:100%;" />

<img src="//img.aotu.io/Tingglelaoo/20160302/head-loading.png" alt='示例图片' style="display:block;width:100%;max-width:640px;margin:0 auto;" />


在这里，开发者先预加载了部分图片以呈现首屏画面给用户，同时图片预加载依然在进行，当用户触发的页面内的图片资源还未加载完时则会显示进度条，加载完毕则可以进入下一个画面。

笔者觉得采用这种方式的原因有二，第一，页面内容需要加载的资源过多，若等待全部加载完毕所需时间耗费过长，容易导致流失用户；第二，页面内容足够吸引，即时在交互过程中插入等待过程，用户也愿意去等待。
  
## 懒加载

懒加载，又称为延迟加载、按需加载。指的是图片在页面渲染的时候先不加载，页面渲染完成后在指定动作触发后再加载图片。
这种方式通常比较合适于篇幅较长的页面，并且图片内容的重要性低于页面信息内容，能够快速地先将重要的页面信息呈现给用户。
譬如，这种方式则应用于电商商品信息集合页面，同时也常用于文章阅读的情景下。除了在移动端的应用场景之外，在PC端懒加载也是应用最广泛的一种图片加载优化方式。
最为常见的一种懒加载技术是以可见距离作为触发点。当页面滑动到屏幕可见区域时，则进行加载图片。实现的原理是：
  - 先将图片的实际src，记录在data-set属性中。
  - 监听屏幕滚动，计算图片的Y坐标，并计算可视区域的高度height，当Y小于等于(height+scrollTop)时，图片的src的值用data-src的来替换，从而来实现图片的懒加载。

具体可以前往[拇指期刊](http://jdc.jd.com/h5/case/maga.html)点击文章阅读体验喔。

## 写在最后
  希望这篇文章能够带给读者一些启发。并不是某一种案例只使用一种加载方式。同时，也不是触屏页面的加载方式仅限于以上方法之一。
  这里仅是列举并讨论常见的加载方式，凡事讲究实践出真知，在实践的时候必然会有更加切合具体案例的好方法。
  Keep Moving，在触屏页面的开发中，兴许还有更多更优秀的图片资源加载方式等着我们去发掘。

>  文中案例搜集均来源于[数英网](http://www.digitaling.com/projects):)
