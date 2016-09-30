---
title: HTTP 缓存
subtitle: Web 开发离不开 HTTP 请求，大量的 HTTP 请求会导致大量的带宽和性能的损耗。那么，如何通过HTTP 缓存优化呢？
date: 2016-09-22 16:38:12
cover: //misc.aotu.io/chuyik/http_caching_900_500.png
author: 
	nick: skillful-driver
	github_name: Calvin92
categories: Web开发
tags: HTTP Cache 缓存 优化
---

有时，HTTP 中的缓存可能会非常让人头疼。
按照文档正确地使用 HTTP 并不是那么困难，但事实上，不同的浏览器和 HTTP 版本常常困扰着我们。

<!--more-->

通过 [Stack Overflow](http://stackoverflow.com/search?q=http+cache) 的搜索结果，你可以很轻易地发现很多人有相同的困扰。我们自己或是不必或是没有时间去钻研所有的边缘的情况。 

所以这里有一些博主总结的实用并速记的规则，并且在未来博主也会持续地跟进和更新。 

## 静态资源 
永远不会修改的内容：JS 和 CSS 文件，图片，和任何类型的二进制文件都属于这个类目。

永远，我确实说的是永远。为静态资源指定版本号是很通用的做法。它们无论什么时候改动了，它们的 URL 就改变了。

这里是一些针对静态资源的简单的规则： 
* 在文件或者路径中嵌入指纹。避免为指纹使用查询字符串。另外，确保生成的URL长度超过8个不同的字符。 
* 使用这些 HTTP 头： 
```
Cache-Control: public, max-age=31536000
Expires: (一年后的今天)
ETag: (基于内容生成)
Last-Modified: (过去某个时间)
Vary: Accept-Encoding

```

针对静态资源的设置就是那么简单。 

## 动态资源 
针对应用程序私密性和新鲜度方面需求的不同，我们应该使用不同的缓存控制设置。 

对于非私密性和经常性变动的资源（想像一下股票信息），我们应该使用下面这些： 
```
Cache-Control: public, max-age=0
Expires: (当前时间)
ETag: (基于内容生成)
Last-Modified: (过去某个时间)
Vary: Accept-Encoding
```

这些设置的效果是：这些资源可以被公开地（通过浏览器和代理服务器）缓存起来。每一次在浏览器使用这些资源之前，浏览器或者代理服务器会检查这些资源是否有更新的版本，如果有，就把它们下载下来。 

这样的设置需要注意，浏览器在重新检查资源时效性方面有一定的灵活性。典型的是，当用户点击了「返回／前进」按钮时，浏览器不会重新检查这些资源文件，而是直接使用缓存的版本。你如果需要更严格的控制，需要告知浏览器即使当用户点击了「返回／前进」按钮，也需要重新检查这些资源文件，那么可以使用： 
```
Cache-Control: public, no-cache, no-store
```

不是所有的动态资源都会马上变成过时的资源。如果它们可以保持至少5分钟的时效，可以使用： 
```
Cache-Control: public, max-age=300
```

经过这样的设置，浏览器只会在5分钟之后才重新检查。在这之前，缓存的内容会被直接使用。如果在5分钟后，这些过时的内容需要严格控制，你可以添加 `must-revalidate` 字段： 
```
Cache-Control: public, max-age=300, must-revalidate
```

对于私密或者针对用户的内容，需要把 `public` 替换为 `private` 以避免内容被代理缓存。 
```
Cache-Control: private, …
```

## Cache-Control 和 Expires
当同时使用 `Cache-Control` 和 `Expires` 时，`Cache-Control` 获得优先权。 

同时使用 `Cache-Control` 和 `Expires` 意味着得到更广泛的支持（被不同的浏览器和版本）。当然，它们两个应该被配置成相同的时效值，以避免引起困惑。 

> 参考 [Expires: vs. Cache-Control: max-age](http://squid-web-proxy-cache.1019090.n4.nabble.com/Expires-vs-Cache-Control-max-age-td1033350.html)

## ETag 和 Last-Modified
这两个头在浏览器对资源做重新检查验证的时候会使用到。大致来说，浏览器只是盲目地存储这两个来自于服务器的头的值，然后在需要检查验证的时候，浏览器根据请求条件，把这两个指发送给服务器（分别通过 `If-None-Match` 和 `If-Modified-Since`）。 

注意只有在资源过期的情况下，检查验证才会发生。 

在有条件的请求下，`If-None-Match` 和 `If-Modified-Since` 头的出现取决于服务器。然而，由于是服务器生成的 `ETag` 和（或） `Last-Modified`，所以实际上，这没有什么大问题。大多数的浏览器在可能的情况下都会把着两者都发送给服务器。 

> 参考 [What takes precedence: the ETag or Last-Modified HTTP header?](http://stackoverflow.com/questions/824152/what-takes-precedence-the-etag-or-last-modified-http-header)

一个通常的建议是：避免使用 `ETag`。这不是一个总是有用的建议。`ETag` 在判断内容是否真的改动方面确实提供了更为精确的控制。针对生成的 `ETag`，默认的Apache方法需要把文件的索引节（inode），大小（size）和最后修改时间作为输入求值得到。这会导致在负载均衡的环境中，生成的 `ETag` 值变得毫无用处，因为每个服务器都会针对相同的文件生成一个不同的 `Etag` 值。这个可能就是唯一的问题导致很多人完全禁用 `ETag`，其实只要精确地针对一个匹配的文件生成一个独一无二的 `ETag` 值，就没有必要禁用 `ETag` 了。 

> 参考 [Should your site be using etags or not?](https://www.techpunch.co.uk/development/should-your-site-be-using-etags-or-not)

## 手动按下 Ctrl-R
当按下 `Ctrl-R` 时，浏览器会携带下面的请求，以检查是否需要更新缓存内容： 
```
Cache-Control: max-age=0
If-None-Match: …
If-Modifed-Since: …
```

注意这并不只是和原服务器建立连接，其同样适用于代理服务器。本质上，它只是重新检查验证内容。如果服务器回应了一个304，浏览器将会使用缓存的内容。 

## Vary: Accept-Encoding 
这个头对于一些人来说可能比较陌生。 

当一个资源启用了 gzip 压缩，并且被代理服务器缓存，客户端如果不支持 gzip 压缩，那么在这样的情况下将会得到不正确的数据（也就是，压缩过的数据）。这将会使代理服务器缓存两个版本的资源：一个是压缩过的，一个是没压缩过的。正确版本的资源将在请求头发送之后进行传输。 

还有一个现实的原因：IE 浏览器不缓存任何带有 `Vary` 头但值不为 `Accept-Encoding` 和 `User-Agent` 的资源。所以通过这种方式添加这个头，才能确保这些资源在 IE 下被缓存。 

> 本文译自 Bryan Tsai 的 《[Http Caching](https://bryantsai.com/http-caching/)》。

## 参考资料 
* [Increasing Application Performance with HTTP Cache Headers](https://devcenter.heroku.com/articles/increasing-application-performance-with-http-cache-headers) 
* [Things Caches Do](http://tomayko.com/writings/things-caches-do)
* [Google Developers: HTTP Caching](https://developers.google.com/speed/articles/caching)
* [Google Developers: Optimize Caching](https://developers.google.com/speed/docs/best-practices/caching?csw=1)
* [Caching Tutorial for Web Authors and Webmasters](http://www.mnot.net/cache_docs/)
* [Cache Control Directives Demystified](http://palizine.plynt.com/issues/2008Jul/cache-control-attributes/)
* [What are the hard and fast rules for Cache Control?](http://webmasters.stackexchange.com/questions/1459/what-are-the-hard-and-fast-rules-for-cache-control?lq=1)
* [What’s the difference between Cache-Control: max-age=0 and no-cache?](http://stackoverflow.com/questions/1046966/whats-the-difference-between-cache-control-max-age-0-and-no-cache)
* [HTTP Cache Control max-age, must-revalidate](http://stackoverflow.com/questions/2932890/http-cache-control-max-age-must-revalidate)
* [Difference between no-cache and must-revalidate](http://stackoverflow.com/questions/18148884/difference-between-no-cache-and-must-revalidate?rq=1)
* [Caching Improvements in Internet Explorer 9](http://blogs.msdn.com/b/ie/archive/2010/07/14/caching-improvements-in-internet-explorer-9.aspx)