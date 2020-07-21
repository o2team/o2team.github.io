---
title: 移动端吸顶导航组件的实现
author: 李杰
date: 2020-07-16 18:00:00
tags: [组件, vue]
category: 经验总结
toc: true
comments: true
mathjax: true      
---

## 前言

吸顶导航是营销会场类最常用的组件之一， 现在的会场页面是越来越长，如果从第一屏手动滑到最后一屏，还是一个挺累的操作，所以吸顶导航还是很有必要存在的，组件很常见，但是开源的不多，而且大多是PC版，几乎都不能满足业务的需求，所以决定自己写一个。

先看下组件效果 [demo](http://vue-sticky-nav.surge.sh/)

![](https://img12.360buyimg.com/imagetools/jfs/t1/126840/16/7166/349001/5f1002a3E143d2c4d/1d3c1cea309990e1.gif)

## 功能拆解

梳理下组件需要实现的功能

* 到达首层吸顶和最后一层取消吸顶
* 当前楼层高亮显示
* 选中导航居中显示
* 默认显示或滑到首层才显示
* 滑动过程中控制隐藏显示
* 展开显示更多


## 功能实现

下面我会介绍下其中几个功能的实现方法，全部源码有兴趣的话可以点击[这里](https://github.com/eijil/vue-sticky-nav)

### 导航选中居中

#### 1. 如何居中

首先我们可以先考虑怎么居左，我们知道每一项距离左边的宽度是`m`，那居左就是`-m`,居中就是再减中线的位置，中线的位置如果是`M`，那就是`M-m`。

#### 2. 处理边界的情况

通过`M-m`，我们再来处理到达边界的问题，主要两种情况

1.当M-m>0的时候，则已经到达最左边

2.当M-m >于可滚动的距离（滚动条长度-可视长度），就是到达最右边

实现代码：

```javascript
/*以下代码为了方便理解，略有删减*/

/*
 *  导航切换
 */
watch(){
  translateX(value){
    //滚动条位置修改
    this.scrollView.scrollLeft = Math.abs(value)
  }
},
methods:{
  center(index){
    //当前选中项
    const activeItem = this.$refs.navitem[index]
    //选中项距离左边的距离和宽度
    const {offsetLeft,offsetWidth} = activeItem
    //导航条可见的宽度
    const touchWidth  = this.stickyNav.offsetWidth
    //可滚动宽度 = 整个滚动宽度 - 导航条可见的宽度
    const scrollWidth = this.scrollView.scrollWidth - touchWidth
    //导航条中点 
    const half = (touchWidth - offsetWidth) / 2
    //需要滚动的长度
    let scrollLeft = half - offsetLeft
    //到达最左边
    scrollLeft > 0 && (scrollLeft = 0);
    //到达最右边
    scrollLeft < -scrollWidth && (scrollLeft = -scrollWidth)
    this.translateX = scrollLeft
  }
}
```

### 导航缓动
实现了导航居中后我们再给他加一个缓动的效果，上面已经通过监听滚动的值去修改滚动条scrollLeft改变位置，由于watch可以监听值的变化，我们可以取到初始值和结束值，所以我们只需给数字变化添加一个缓动的过程，这里使用了一个插件[tweenjs](https://www.npmjs.com/package/@tweenjs/tween.js)来实现这个功能。
``` javascript
import tween from '@tweenjs/tween.js"
watch:{
  translateX(star, end) {
    this.tween(star,end)
  }
}
methods:{
    tween(start,end){
        new TWEEN.Tween({
          number: start
        })
        .to({
          number: end
        },
        100)
        .onUpdate(tween => {
          //改变滚动位置
          this.scrollView.scrollLeft = -tween.number;

        })
        .start();
        function animate(){
          if (TWEEN.update()) {
            requestAnimationFrame(animate)
          }
        }
        animate()
    }
}
 
```
### 滚动过程中的隐藏和显示

实现这个功能我们需要知道用户当前的操作是上划还是下划，同样借助于vue中的watch功能，我们监听当前屏幕滚动的距离`scrollTop`,可以得到一个当前值和过去值，将两个值对比，当前值大于过去值的时候，则表示用户手指是向上滑（屏幕往下滚动）的，反之向下，代码如下：
``` javascript
/*以下代码为了方便理解，略有删减*/

data(){
   //控制导航是否显示隐藏的变量
   scrollHide:false,
   //需要设置一个定时器，当用户一段时间没操作的时候，显示导航条
   scrollTimer:false
   
},
watch:{
 
  scrollTop(newValue, oldValue){
    const delay = 2000
     //向下滚动
    if(newValue > oldvalue){
       //改变属性，控制隐藏显示
      this.scrollHide = true
      //清除定时器
      clearTimeout(this.scrollTimer)
      this.scrollTimer = null
    //向上
    }else{
      this.scrollHide = fasle
    }
    if(!this.scrollTimer){
      this.scrollTimer = setTimeout(()=>{
          this.scrollHide = fasle
      })
    }
  }
}

```
向下滚动隐藏的功能是实现了，但还有一个问题，就是当点击导航栏的时候页面也是向下滚的，这时候还会触发上面的函数，这个时候体验效果有点奇怪，所以还需要优化下，当用户的操作是点击屏幕的时候不去执行隐藏导航的功能
#### 改进版
``` javascript
/*以下代码为了方便理解，略有删减*/

data(){
   //控制导航是否显示隐藏的变量
   scrollHide:false,
   //需要设置一个定时器，当用户一段时间没操作的时候，显示导航条
   scrollTimer:false,
   //是否点击事件
   isClickScroll: false
},
methods:{
  //点击时触发
  change(index) {
    this.isClickScroll = true;
  }
},
watch:{
  scrollTop(newValue, oldValue){
    if(this.isClickScroll){
      setTimeout(() => {
        this.isClickScroll = false
      }, 10);
    }
    if (this.isClickScroll) return;
    const delay = 2000
    //向下滚动
    if(newValue > oldvalue){
      //改变属性，控制隐藏显示
      this.scrollHide = true;
      //清除定时器
      clearTimeout(this.scrollTimer);
      this.scrollTimer = null;
     //向上
    }else{
      this.scrollHide = fasle;
    }
    if(!this.scrollTimer){
       this.scrollTimer = setTimeout(()=>{
           this.scrollHide = fasle;
           this.isClickScroll = false;
       })
    }
  }
}

```



## 遇到的一些问题

#### 京东APP沉浸式兼容问题

沉浸式效果：

![](https://img14.360buyimg.com/imagetools/jfs/t1/139199/37/3038/118655/5f111a44E79a3e8fe/7358d8da77a40604.jpg)

沉浸式就是去掉了首屏标题栏的一种沉浸式体验，，如果开启了沉浸式，那么首屏标题栏是一个透明的状态，整个页面的高度就会上移，然后当你往下滑动的时候标题栏会出现，这时候导航栏如果吸顶，那么就会被标题栏给挡住看不到了，解决方法就是需要增加导航栏距离顶部的高度，而且是动态修改的，因为在APP中获取标题栏的高度是一个异步的操作，原先组件中并没考虑需要动态修改高度的情况，所以需要点小修改，先看下一开始是怎么初始化组件的：

``` javascript
<StickyNav :options="options"/>

options:{
  disabled:false,
  stickyTop:0, //距离顶部
  zIndex:1000,
  ...
}
```
我们是通过stickyTop属性来控制导航栏距离顶部的距离，但是如果异步去修改这个对象的值是没有任何变化的，因为vue中是无法检测到对象的修改，

1.通过watch的deep属性，设置为true可以监听options对象的修改,再重新复制到新对象
```javascript
watch{
  options:{
      handler(value){
        assign(this.stickyOptions,value)
      },
      deep:true
    }
}
```
2.或者把stickyTop单独作为一个prop属性传给组件，这样可以实时变化


#### 低端机兼容性问题

兼容性问题通常出现在一些很低端的手机上，比如android4.0,ios8、不过如果做到以下3点基本也没什么问题

#### 1.ES6兼容


通常我们webpack上已经配置了babel转换，但其实只是对语法的编译，比如你可以使用箭头函数等
如果你使用了Promise、Object.assign、includes等全局方法其实都不能被转换的，最简单的方法可以全局引入polyfill

```javascript
npm install babel-polyfill --save
import 'babel-polyfill'
```

或者你的项目中只是用了一两个方法，引入整个polyfill太浪费，也可以使用一些第三方库，如  lodash/includes


#### 2.CSS自动 -webkit- 前缀

还有就是样式不生效的问题，一般我们现在都是在webpack工程中配置`autoprefixer`去自动加前缀，不过要注意修改下package.json下的browserslist
```
"browserslist": [
    "Android >= 4.4",
    "iOS 8"
  ]
```

#### 3.尽量不要使用flex布局

flex布局有某些很老的机型还是支持不是很好，用`inline-block`来代替


## 结束

本文到这里就结束啦，组件[vue-stivky-nav](https://www.npmjs.com/package/vue-sticky-nav)已经开源到npm上，欢迎使用和提问题,如果您对本文有什么问题也可以在底下留言讨论。

