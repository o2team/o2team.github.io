title: Vue实战－邮箱签名设计项目
subtitle: 此次项目借助Vue快速开发，除了带来Vue实践心得外，还带来一些对于项目开发的思考。
date: 2016-07-25 10:24:35
cover: "https://misc.aotu.io/Tingglelaoo/o2mailsign_900x500.jpg"
categories: "项目总结"
tags:
- Vue
author:
    nick: Tingglelaoo
    github_name: Tingglelaoo

---

<!-- more -->

## 项目背景
  在工作的沟通交流中，邮件是必不可少的工具之一。而规范一致的邮箱签名设计有利于打造和传播团队品牌形象，以提高团队的知名度。同时，借助工具能够使得签名生成更为方便、快捷。

## 项目成果
>点击体验工具：[https://sign.aotu.io/](https://sign.aotu.io/)

>项目托管在Github上开源，喜欢的话可以给项目加个[『星星』](https://github.com/o2team/sign/tree/master)

![1.gif](https://misc.aotu.io/Tingglelaoo/sign.gif)

### 功能一览
  - 即时预览
  - 图片上传、裁剪及下载保存
  - 个性化配色、Logo设置

## 思路与实现
  因为计划是个小而快的项目，所以更多的考虑是走捷径——用现成的库和框架。
### 框架选择——[Vue.js](http://cn.vuejs.org/)
  选择Vue，主要还是私心，刚学习完Vue想拿来实践下。
  若是要对比Angular来说，Vue相对来说更轻巧易上手，文档中文化。考虑到项目并不需要数据库，不需要后端处理，是个完全依靠前端的项目，所以选择专注“让编写动态的UI界面变得轻松简单”的Vue其实是比较合适的。
### 实现思路
  工欲善其事，必先利其器。
  **一、明确功能核心。**
  邮件签名设计的主要功能是给予统一的签名设计模版，用户只需要输入个人信息即可生成规范的个人邮件签名。
  **二、确认技术路线。**
  从技术角度说就是，根据邮件签名设计模版先构建好对应的静态DOM结构，结合用户输入的数据动态实现从DOM结构转化为图像，然后供以下载使用。
 ** 三、库的选用**
  那么，对应技术点各个击破：
  - DOM 转化为 IMG：[dom-to-image](https://github.com/tsayen/dom-to-image)
    - 实现的原理是：利用Canvas将DOM绘制生成为图像。
    - 难能可贵的是，它这个库还考虑到了伪元素、Web Font、内联样式的使用，在绘制的时候不会把这些内容缺失。
  - 文件下载保存：[FileSaver.js](https://github.com/eligrey/FileSaver.js)
    - 无需后端处理，在客户端就可以实现文件的保存。
    - 更为重要是的，[dom-to-image](https://github.com/tsayen/dom-to-image)需要它配合，实现将Canvas转化生成图像并下载。
  - 个人头像裁切：[cropperjs](https://github.com/fengyuanchen/cropperjs)
    - 实现裁切的原理，同样是利用到Canvas。
    - 最为“难用”的库是[cropperjs](https://github.com/fengyuanchen/cropperjs)，因为它自身包含的功能特别多，所以要根据自己的需求来抽取出特定的功能来使用。

### 核心代码简解

> 方法概览

![codes.png](https://misc.aotu.io/Tingglelaoo/codes.jpg)

#### bindLoadImgEvent()
```javascript
// 监听文件读取
for(var i =0;i<len;i++) {
    uploadImages[i].addEventListener('change', function() {
        ...
        reader.readAsDataURL(file);
        ...
    });
}
// 若读取图像文件，则初始化加载cropper
reader.onload = function(e) {
    ...
    if (!thisObj.flag.cropperHasInit) {
        thisObj.loadCropper();
        return;
    }
    ...
}
```
使用HTML5的文件上传API来读取用户选取的图像文件，一旦监听到图像上传完毕，则调用`loadCropper()`方法来初始化。


#### loadCroper()
```javascript
// 根据需要配置参数，初始化cropper
var option = {
    aspectRatio: 1 / 1,
    build: function() {
        previewImage.src = image.src;
    },
    crop: function(data) {
        ...
    }
};
thisObj.cropper = new Cropper(image, option);
```
根据[官方文档说明](https://github.com/fengyuanchen/cropperjs/blob/master/README.md)，选择合适的参数来定制功能。
按照邮件签名设计的模版，头像需要裁剪成要求一比一的比例，因此只需要简单的一比一裁切功能即可。


#### finishCropImage()
```javascript
  ...
  var imgDataUrl = croppedCanvas.toDataURL();
  var where = '.o2_sign .' + thisObj.img + ' img';
  document.querySelector(where).src = imgDataUrl;
  ...
```
完成裁剪，将裁剪结果输出为base64格式。

#### downloadRes()
```javascript
  ...
  domtoimage.toBlob(sign).then(function(blob){ 
      window.saveAs(blob,imgName + '.png');
  });

```
调用[dom-to-image](https://github.com/tsayen/dom-to-image)以及[FileSaver.js](https://github.com/eligrey/FileSaver.js)库，将对应的DOM结构输出为图像并下载。

### 还需要思考的方面
  秉承着"用户体验至上"是产品的黄金原则之一的理念，因此，在项目完成基本的功能之余，在用户体验方面做些了小优化：

**一、信息格式化，优化用户输入**
  对于手机号码，用“－”分隔符更便于用户阅读和记忆，但是用户在输入信息时，会自动忽略“－”的存在，因此，考虑到的阅读和输入习惯，利用Vue的过滤器(Filter)来优化用户输入。
  除此之外，在配色设置中，采用的是HTML5的原生取色器，严格规定颜色色值输入是RRGGBB格式的十六进制代码，但是对于用户习惯来说，对于#FFFFFF类似的写法更倾向于缩写为#FFF的简洁形式，因此，在色值输入时，同样是通过过滤器(Filter)来自动将缩写格式转化为标准形式。
  
**二、生成二倍图，适配高清屏**
在如今Retina屏幕的兴起的时代，适配高清屏已经成为UI界面设计的重要优化步骤，因此，为了适配高清屏，在[dom-to-image](https://github.com/tsayen/dom-to-image)的原基础上进行了代码优化，使得输出结果为二倍图形式。

**三、个性化设置，供团队外共享**
在实际的应用中，考虑到工具的分享与传播，在维持原有基本的LOGO、版面设计外，特意设计配色个性化设置功能，让团队成员外的用户能够随心所欲选用自己喜欢的配色，设计出有个人特色的签名图。

**四、功能划分、字体，交互设计优化**
考虑到工具的主要面向对象是团队成员，使用频率较低，所以配色设置作为附加功能设计在预览区的右上角，通过点击可以将信息输入面板切换到配色设置面板。
这样的设计将不同的功能集合在不同区域，在页面上更为合理地利用有限空间外，同时使得用户更专注于主要的功能块。
在另一方面，在Windows平台和Mac平台共同支持的默认字体有限，同时要考虑到遵循设计还原，因此，通过使用第三方字体来优化字体，使其在不同平台下能够表现一致。


## 关于Vue.js的小技巧
对于Vue.js的学习，我只算是新手初试，在这里总结下遇到的一些常见问题，作为分享给大家的小技巧：

**1.使用`v-text`替代&#123;&#123;&#125;&#125;**
类似于Angular的`v-bind`替换&#123;&#123;&#125;&#125;的做法一样，在Vue中使用`v-text`替代&#123;&#123;&#125;&#125;，可以避免在渲染页面的过程中出现双向绑定数据的未处理状态。

**2.没有`v-change`这样的指令**
在Agular中用ng-change可以为元素帮到change事件响应，但是在Vue中，在默认情况下，v-model 在input 事件中同步输入框值与数据，可以添加一个特性 lazy，从而改到在 change 事件中同步。

**3.`v-bind:class` 替换 `v-show`指令**
Vue中的v-show指令是通过内联样式`display:none`来来处理显示和隐藏元素(true时，不做内联样式；false时内联display:none)。
所以，如果使用`v-show`指令在渲染页面的时候一开始，元素就会显示出来再被隐藏，这样的用户体验并不好。所以，可以考虑使用`v-bind:class` 来处理，自己写好显示隐藏的样式，通过绑定类名来切换元素显示隐藏状态。

**4.延续上一问，为什么不使用`v-if`替代，与`v-show`的区别在哪里呢？**
从表现来看`v-if`和`v-show`都是用来显示隐藏元素。但`v-if`则是通过删除添加DOM结构的手段来实现显隐的，在元素上绑定的监听事件就会随着删除而销毁，是一个局部编译/卸载的过程。因此，在这样的情景限制下，我没有选择使用`v-if`来替代`v-show`。

**5.Vue.js的学习资料推荐**
Vue.js是国人尤雨溪大大作为主要开发的，所以文档中文化做得非常棒，官网有齐全的资料，快速入门教程、API文档等等，个人认为作为上手研读官网([Vue.js](http://cn.vuejs.org/guide/))的教程即可，推荐:)。


>  感谢长篇阅读至此，“说一做二想三”，这个小项目也算是初成，告一段落了。:)
作为一个小项目，自认为并不是特别能带来很多的干货，但是也就是这种小尝试、小实践去慢慢积累经验，前端路漫漫，互勉加油吧。






  