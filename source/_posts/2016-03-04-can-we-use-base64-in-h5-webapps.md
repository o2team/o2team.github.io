title: 图片资源Base64化在H5页面里有用武之地吗？
subtitle: 本文使用performance接口和Timeline工具，测试和分析了不同场景下引用base64化的图片资源对渲染性能的影响，旨在抛砖引玉，找出图片资源的base64化在H5应用中使用的可行性。
cover: https://img12.360buyimg.com/ling/jfs/t1/84687/37/2706/41340/5d09e939Efd413a9f/4ca7b50baedd3fbb.jpg
categories: 性能优化
tags:
  - base64
  - h5
author:
  nick: Simba
  github_name: Simbachen
date: 2016-03-04 17:45:03
---

将图片资源转至base64格式后可直接放入页面作为首屏直出，也可以放入css文件中，减少请求，以加快首屏的呈现速度。 
不过图片base64化，将带来一个臃肿的html或css文件，是否会影响页面的渲染性能，浏览器又支持如何呢？

### 如何统计？
>通过Navigation Timing记录的关键时间点来统计页面完成所用的时间，并通过Chrome开发工具来跟踪细节


```javascript
var timing = window.performance.timing
timing.domLoading  //浏览器开始解析 HTML 文档第一批收到的字节
timing.domInteractive  //  浏览器完成解析并且所有 HTML 和 DOM 构建完毕timing.domContentLoadedEventStart //DOM 解析完成后，网页内资源加载开始的时间
timing.domContentLoadedEventEnd //DOM 解析完成后，网页内资源加载完成的时间（如 JS 脚本加载执行完毕）
timing.domComplete //网页上所有资源（图片等） 下载完成,且准备就绪的时间
      
```
>以上定义来自[chrome官方文档](https://developers.google.com/web/fundamentals/performance/critical-rendering-path/measure-crp?hl=zh-cn)，在其它环境下也许会有差异，从测试结果看，下面的build时间在android+微信环境中一直是0，对此可能是因为渲染机制差别，此处不做深入测试。除osx+chrome之外环境的数据仅作参考。

```javascript
	build = timing.domComplete - timing.domContentLoadedEventStart //间隔记录网页内资源加载和呈现时间。
	complete = timing.domComplete - timing.domLoading //页面接收到数据开始到呈现完毕的总时间。
	
```

## 场景1，内嵌至css文件中
#### 1、原生引入图片链接做背景图

一张大小为**50kb**的**jpg格式**图片，应用到9x15=135个dom做背景图，模拟雪碧图的模式，多个节点引用同一张图片做背景，（示例）如图。
![img](https://img10.360buyimg.com/ling/jfs/t1/60942/35/2315/506501/5d09e94fEcf00b0ee/026ef7ade10bfc77.png)
`测试环境`：Mac OS X EI Capitan 10.xx + Chrome 48.xx  
`其它辅助测试机器`：  iPhone 6 plus iOS 9.xx； 魅族Note Android 4.xx
>实际使用过程中，其它版本和机型的Android手机还有待测试


关闭缓存状态下，build:150ms | complete: 200ms（总时间受网络状态等因素影响，数据做比较用）
![img](https://img14.360buyimg.com/ling/jfs/t1/40929/14/6963/34473/5d09e967Ead9ecea2/4a2924c60152afb3.png)

开启缓存状态下，build: 7ms |  complete: 59ms（包括以下稳定状态下多次测试的平均值，截图为最接近平均值的状态，默认数据来自Mac+Chrome[48.XX版本]）

![img](https://img10.360buyimg.com/ling/jfs/t1/64822/24/2328/33611/5d09e981E98c27128/6640b7872ee33c70.png)

| 测试环境      |    build(单位:ms) | complete(单位:ms)  |
| :-------- | :--:| :--: |
| OS X+Chrome  | 7 |  59   |
| iOS+微信     |   45|  90  |
| OS X+Safari      |    50 | 100  |
| Android+微信      |   0| 120  |
#### 2、引入base64格式图片做背景图

将上面50kb大小的jpg图片转换为base64格式，加在css文件中。

关闭缓存状态下，build:80ms | complete: 280ms

![img](https://img14.360buyimg.com/ling/jfs/t1/47665/35/2809/35245/5d09e99cE727ed7b9/a74dee014fdbb6d8.png)
开启缓存状态下，build: 160ms |  complete: 210ms

![img](https://img10.360buyimg.com/ling/jfs/t1/37113/3/12618/34429/5d09e9aeEe8d8bd6d/60029ff04aa43c5c.png)


| 测试环境      |    build(单位:ms) | complete(单位:ms)  |
| :--------   | :--:| :--: |
| OS X+chrome  | 160 |  210   |
| iOS+微信     |   35|  100  |
| OS X+Safari      |    9 | 90  |
| Android+微信      |   12| 150  |


#### 3、调整图片体积
调整上面图片的（压缩品质）体积，base64化后，对应的css文件大小也跟着改变

| 图片大小     |   10kb | 20kb |45kb | 100kb|180kb|
| :-------- | :--------:| :--: |:--: |:--: |:--: |
| 对应css文件大小  | 27kb |  42kb | 76kb | 150kb | 260kb
| Rendering时间     |   30ms| 46ms | 81ms | 156ms | 258ms|
![img](https://img13.360buyimg.com/ling/jfs/t1/50988/36/2826/32577/5d09e9c2E6e60566e/4b3823c5550e3e95.png)

#### 4、调整引用次数

50kb大小的图片，base64化后，调整引用图片做背景图的dom的个数

| 引用次数     |   10 | 20 |50 | 100|135|
| :-------- | :--:| :--: |:--: |:--: |:--: |
| Rendering时间     |   15ms| 19ms | 44ms | 74ms | 83ms|
![img](https://img14.360buyimg.com/ling/jfs/t1/67837/13/2312/28633/5d09e9d6Ed242232d/cc7a68c662172862.png)

#### 分析和小结：

在OSX+Chrome环境下，将50kb的图片base64后放入样式中，build过程拉长了约20倍，使用Timeline工具可以看到，计算样式阻塞了整个过程。


![img](https://img13.360buyimg.com/ling/jfs/t1/44335/24/6976/44212/5d09e9ebEc794676b/741d84bef8e6b762.png)



1. 比起直接引入图片地址，css文件中引入base64格式的图片对样式渲染的性能消耗明显，如果大量使用，会带来耗电和发热的问题，需谨慎使用。
2. Rendering消耗的时间同css文件大小、引用次数几乎成正比（未测试其它极限情况），在网络条件优质的4G环境，50~70ms的RTT(往返时延）情况下，通常移动网络的状况会更差，对于首屏优化，合适的使用还是很值得的。
3. 图片转成base64编码后，文档大小较原文件大了一些，而经过 gzip 后两者几乎没有区别。



## 场景2，内嵌至js文件中

#### 1、原生方式直接加载多张图片

大小10~70kb共9张图片。总大小约300kb

关闭缓存：build: 300ms |  complete: 310ms

![img](https://img30.360buyimg.com/ling/jfs/t1/83973/8/2300/68259/5d09ea08Ee9a00498/2c7ef6abbab64452.png)
开启缓存：build: 110ms |  complete: 120ms

![img](https://img20.360buyimg.com/ling/jfs/t1/80762/39/2369/68288/5d09ea1eEc24db889/eb1630b74fb7cf74.png)

| 测试环境      |    build(单位:ms) | complete(单位:ms)  |
| :-------- | :--:| :--: |
| OS X+Chrome  | 110 |  120   |
| iOS+微信     |   50|  100  |
| OS X+Safari      |    148 | 150  |
| Android+微信      |   50| 100  |

#### 2、转换成base64格式，合并请求

将上面的图片转成base64后，放在js文件中，加载进来。

关闭缓存：build: 0ms |  complete: 400ms

![img](https://img12.360buyimg.com/ling/jfs/t1/75863/30/2285/87027/5d09ea32E5ab77220/129a8c98f2e044ac.png)

开启缓存：build: 0ms |  complete: 80ms

![img](https://img20.360buyimg.com/ling/jfs/t1/48464/32/2768/84493/5d09ea44E15fbc8b8/ab8ec033c28ac6b4.png)

| 测试环境      |    build(单位:ms) | complete(单位:ms)  |
| :--------: | :--:| :--: |
| OSX+Chrome  | 110 |  120   |
| iOS+微信     |   0|  35  |
| OS X+Safari      |    7 | 70  |
| Android+微信      |   0| 250  |
#### 3、比较不同网速下同步请求和合并请求的加载效率
使用上述1、2的测试demo分别在3G、4G网速条件下测试结果如下：

- 在网络环境差的情况下，合并请求明显缩短了整个加载时间；
- 在网络环境较好的WIFI和4G下则差别不大。

| 测试环境    | 图片直接加载 complete(单位:ms)   | base64合并请求 complete(单位:ms)   |
| :--------: | :--: | :--:|
| 3G         | 6000 | 4500 |
| 4G         |   450 | 400 |
| WIFI       |   320 | 340 |
![img](https://img12.360buyimg.com/ling/jfs/t1/49305/12/2852/29446/5d09ea59E5b71c578/b19029313815f1cf.png)
#### 分析和小结：
base64后的的js资源达381kb，在一个线程里加载，消耗大量时间，从统计结果看，在渲染性能差异上并没有场景1那么明显。
但有缓存的情况下，页面渲染完成的速度甚至更快。
从Timeline里看到细节，解析这个近400kb的js文件对整个渲染过程造成了一定压力，不过总共40ms的解析时间是完全可以接受的。


![img](https://img10.360buyimg.com/ling/jfs/t1/77240/40/2229/63120/5d09ea6eE133b4fe4/3d310d7007ce1754.png)

1. 从html里直直接引用图片链接和base64图片对渲染性能的影响几乎没有区别，在网络条件差的情况下，合并请求却能大大提高加载效率；
2.  直接引用至html，无法缓存，将base64后的图片资源放在js文件中管理，方便设置缓存。
3.  有一个缺点就是图片资源base64化需要扩展构建工具来支持。

## 使用建议
1. 图片资源的base64编码进css文件会带来一定的性能消耗，需谨慎使用。

2. 将图片资源编码进js文件中，管理和预加载H5应用的图片资源，合理的合并请求可以大大提高页面体验。
