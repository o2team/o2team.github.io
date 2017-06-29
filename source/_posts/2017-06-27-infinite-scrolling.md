title: 流式分页方案探索
subtitle: 一次前后端的探索
date: 2017-06-27 21:00:00
cover: //misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/cover_900x500.png
categories: Web开发
tags:
  - 数据库
  - mongo
author:
  nick: Yetty 
  github_name: Yettyzyt
---

## 分页类型
首先我们要简单认识下，何谓流式分页。
分页一般用于对信息列表进行分段。根据具体功能及交互方式的不同，大致可将分页分为两种类型：传统分页和流式分页。

### 传统分页
传统分页多用于 PC 页面，最常见于搜索结果页，如我们常用的搜索引擎 [Google](//google.com)：
![google搜索](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/google_search.png)

还有[百度](//baidu.com)：
![百度搜索](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/baidu_search.png)

在[京东](//jd.com)的搜索结果页中，也可见传统分页的影子：
![京东搜索](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/jd_search.png)

而在移动端页面中，限制于点击区域的大小，因此较少使用传统分页。

结合上述例子，我们可分析出，传统分页有如下几个特点：
- 通过页码进行分页
- 通过点击上/下页按钮可实现页面切换
- 通过点击页码可实现页面切换
- 可直接跳转至指定页面
- 多用于 PC 端

### 流式分页
流式分页在 PC 端和移动端都有使用。
PC 页面可用于对多个商品信息的展示，通过滚动的方式加载更多商品信息，如：[京东首页还没逛够](//jd.com)、[发现好货](//fxhh.jd.com)等。
而 H5 中，通过点击/上拉的方式来加载列表信息，也是很多见的，如[京东首页为您推荐](//m.jd.com)就是使用点击加上拉的方式：
![京东首页为您推荐](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/jd_h5.png)
[腾讯新闻](//xw.qq.com/m/news/index.htm)则是通过点击的方式来加载更多信息：
![腾讯新闻](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/qq_news.png)

结合上述例子，我们可分析出，流式分页有如下几个特点：
- 通过滚动/上拉/点击等方式加载新一页
- 无页码
- 无上/下页按钮
- 不可跳转至指定页面
- pc端和移动端均有使用

> 传统分页和流式分页都有各自明显的优缺点，非本文重点，故不展开。
有兴趣的同学可前往[《Infinite Scrolling vs. Pagination》（Nick Babich 作 / Ruixi 译）](https://github.com/xitu/gold-miner/blob/master/TODO/ux-infinite-scrolling-vs-pagination.md)查看。

## 流式分页的实现方案
流式分页在前后端都可以实现，需根据实际情况进行决策。
下面对前后端的实现及适用场景进行详细介绍。

### 前端分页的实现
在前端分页的实现中，通过接口一次性获取列表的所有内容，根据数据的总长度和每页需展示的个数计算总页数；
之后的每次加载操作（滚动/点击）中，依次执行数据截取、DOM 渲染、插入结构的过程，直至最后一页。

前端分页流程图如下：
![前端分页](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/fontend_pagination.png)

前文提到的[京东首页还没逛够](//jd.com)就是采用前端分页的方式。在前后端的配合中，后端为前端提供如下接口：
```
diviner.jd.com/diviner?p=610009&callback=jsonpCallbackMoreGood&lid=1&lim=100&ec=utf-8
```
其中相关的参数列表如下：

参数 | 含义 | 备注
---|---|---
lim / limit | 返回数据个数 | 由前端根据需要传参，或由后端设置默认值

返回数据如下：
![还没逛够接口](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/jd_more_data.png)

前端将返回的 100 个数据分成两段，依次在需要加载时进行渲染插入操作。

后端根据前端的传参或约定好的数据个数，对数据进行查找。我们使用 Mongo 操作语句（后文提到的后端操作均为 Mongo）来简单表示后端的操作：
```
Model.find().limit(lim)
```

前端分页的方法适用于数据较少/分页较少的情况。
### 后端分页的实现
在后端分页的实现中，在加载时，前端通过页码来拉数据，若返回非空数组，则进行 DOM 渲染，插入接口的操作；若返回空数组，则说明当前请求的为最后一页的数据，无需再发送请求。

后端分页流程图如下：
![后端分页](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/backend_pagination.png)

前文提到的[发现好货](//fxhh.com)就是采用后端分页的方式。在前后端的配合中，后端为前端提供如下接口：
```
https://ai.jd.com/index_new.php?app=Discovergoods&action=getDiscZdmGoodsList&callback=listCallback&page=1
```
其中相关的参数列表如下：

参数 | 含义 | 备注
---|---|---
page | 当前页数 | 由前端传参
pageSize / limit | 每页数据个数 | 由前端根据需要传参，或由后端设置默认值

返回数据如下：
非空数组：
![发现好货接口-返回非空](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/fxhh_data.png)

空数组：
![发现好货接口-返回空](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/fxhh_empty.png)

前端记录页数，在加载时根据返回的数据进行渲染插入操作。

后端根据前端对当前页数的传参以及每页数据个数的设置，对数据进行查找：

```
const offset = (page-1) * pageSize // 跳过的个数
Model.find().skip(offset).limit(pageSize)
```

后端分页的方法适用于数据较多/分页较多的情况。

## 后端分页的问题与优化
### 存在的问题
#### 1. 数据缺失
假设现在需要倒序取 20 条数据，每页展示 10 条。
取第 1 页时，客户端通过`page=1` `pageSize=10`传参，获取 20 号-11 号的数据；
此时恰好另一客户端删除 17 号数据；
取第 2 页时，客户端通过`page=2` `pageSize=10`传参，offset 由原来的 20-11 变成 20-10，导致最后获取 9 号-1 号的数据。
最终展示结果为 19 条，10 号数据缺失。
具体过程如下：
![数据缺失](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/data_miss.png)

#### 2. 数据重复
假设现在需要倒序取 20 条数据，每页展示 10 条。
取第 1 页时，客户端通过`page=1` `pageSize=10`传参，获取 20 号-11 号的数据；
此时恰好另一客户端添加 21 号数据；
取第 2 页时，客户端通过`page=2` `pageSize=10`传参，offset 由原来的 20-11 变成 21-12，导致最后获取 11 号-2 号的数据。
最终展示结果为 20 条，11 号数据重复。
具体过程如下：
![数据重复](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/data_repeat.png)

### 优化方案
#### 1. 使用缓存
后端查询数据时，不直接对数据库进行操作，而是查找缓存的数据。缓存的方法有很多，这里介绍一种“按时间分片式缓存”的方法。
前端请求数据时，除了前面提到的`page`和`pageSize`参数外，还要再传入一个`timestamp`参数：
- 请求第 1 页数据时，timestamp 传 0，服务端检查将当前系统时间赋值给 timestamp 返回
- 请求第 2，3，…n 页数据时，将第 1 步系统返回的 timestamp 传入

其中相关的参数列表如下：

参数 | 含义 | 备注
---|---|---
page | 当前页数 | 由前端传参
pageSize | 每页数据个数 | 由前端根据需要传参，或由后端设置默认值
timestamp | 时间戳 | 由前端传参

后端处理时，对传入的`timestamp`进行判断：
- 若`timestamp`为 0，生成当前时间对应的缓存，如“data_1498705088000”，并返回前端所需数据
- 若`timestamp`不为 0 且对应的缓存不存在，返回“刷新数据”的提示
- 若`timestamp`不为 0 且有对应的缓存，则返回前端所需数据

具体过程如下：
![使用缓存](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/cache.png)
（图片来源：[《浅谈APP流式分页服务端设计》](//www.jianshu.com/p/13941129c826)）

#### 2. 游标式分页
- 客户端记录当前分页的最后一条数据的 ID
- 请求下一页的时候，从这个 ID 开始获取一页大小的内容

其中相关的参数列表如下：

参数 | 含义 | 备注
---|---|---
curcor | 最后一个 ID | 由前端传参
pageSize | 每页数据个数 | 由前端根据需要传参，或由后端设置默认值

后端根据前端对最后一个 ID 的传参以及每页数据个数的设置，对数据进行查找：
```
Model.find({id: {$gt: cursor}}).limit(pageSize)
```
> 优点：
- 能够避免数据重复/遗漏
- 无需计算offset，性能更稳定

> 缺点：
- 只适用于按照时间追加的方式的简单排序

#### 3. 一次性下发 ID
- 请求第 1 页数据之前/时先缓存所有 ID 列表
- 请求第 2，3，…n 页数据时，只需传入相关的 ID 列表参数

如前文提到的[腾讯新闻](//xw.qq.com/m/news/index.htm)的例子，第一次请求时（除首屏直出数据），请求所有数据的 ID 和第 1 页的数据，接口如下：
```
http://xw.qq.com/service/api/proxy?key=Xw@2017Mmd&charset=GBK&url=http://openapi.inews.qq.com/getQQNewsIndexAndItems?chlid=news_news_top&refer=mobilewwwqqcom&otype=jsonp&t=1498706343475
```
返回数据如下：
![qq新闻接口数据](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/qq_news_data1.png)

之后的请求数据，将所需的 ID 列表传入，获取对应的详细信息，接口如下：
```
http://xw.qq.com/service/api/proxy?key=Xw@2017Mmd&charset=GBK&url=http://openapi.inews.qq.com/getQQNewsNormalContent?ids=20170604A063AG00,20170604A05SKQ00,20170604A05PBT00,NEW2017060403772906,NEW2017060403765707,NEW2017060403278705,20170604A06CMP00,20170604A03ZEU00,20170604A04P5900,NEW2017060402106202,20170603A07E0700,20170604A04WBM00,NEW2017060403031208,20170604A02X9900,20170604A03U6600,20170604A040JX00,20170604A04TE200,NEW2017060403727300,NEW2017060403727800,20170604A03I8200&refer=mobilewwwqqcom&otype=jsonp&t=1496603487427
```
返回数据如下：
![qq新闻接口数据](//misc.aotu.io/Yettyzyt/2017-06-27-infinite-scrolling/qq_news_data2.png)

> 适用于 id 列表不会很大（数百条数据）的业务场景

#### 4. 客户端排除
- 在客户端中保存已加载记录的 ID
- 每次请求完数据时，先进行数据去重
- 若去重数据较多，则考虑再请求下一页的数据

> 优点：
- 确保不会出现重复的数据
- 不改动服务器端的原有逻辑

> 缺点：
- 只适用于列表数据添加不是很频繁的情况

## 参考文档
- [《浅谈APP流式分页服务端设计》](//www.jianshu.com/p/13941129c826)
- [《浅谈单页应用中前端分页的实现方案》](//scarletsky.github.io/2016/09/11/talking-about-front-end-pagination-implementation-in-spa/)
- [《APP后端分页设计》](//www.scienjus.com/app-server-paging/)
- [《Infinite Scrolling vs. Pagination》](//github.com/xitu/gold-miner/blob/master/TODO/ux-infinite-scrolling-vs-pagination.md)
- [《瀑布流下拉加载更多导致数据重复怎么办》](//tieba.baidu.com/p/3704691525)