title: Service Workers：采用WebP动态响应图片
subtitle: "你可能听过**WebP**图片格式。相比于PNG图片，其文件大小能够节省26％；相比于JPEG图片，能够节省大约25％。"
date: 2015-11-05 18:44:25
categories: 性能优化
tags:
  - WebP
cover: //img.aotu.io/wengeek/responsive-image.png
author:
  nick: WEN
  github_name: wengeek
---

> 译文地址：http://deanhume.com/Home/BlogPost/service-workers--dynamic-responsive-images-using-webp-images/10132/

图片在如今的站点上不可或缺。试想一下，在我们网页上没有图片会怎样？高质量的图片能够使你的站点更加出色，但同时伴随着一定的性能损耗。由于图片文件较大，下载时间相对较长并且会减缓页面的加载。如果是一个带宽较低的用户，用户体验将会特别差。

在移动设备上面，这种现象会更加明显。在移动设备上加载大型图片消耗时间取决你的网络以及连接速度。如果你是一个不耐心的用户，你将会变得沮丧。幸运的是，我们有能力处理 [响应式图片](https://responsiveimages.org/) 。通过使用 [picture](https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element) 标签，我们可以根据用户的设备为用户提供不同大小、设备像素比（DPR）以及格式的图片。例如，下面的代码就可以做到这一点。

``` html
<picture>
    <source
        media="(min-width: 1024px)"
        srcset="./images/brooklyn.jpg, ./images/brooklyn-2x.jpg 2x, ./images/brooklyn-3x.jpg 3x"
        type="image/jpeg">
    <source
        media="(min-width: 320px)"
        srcset="./images/brooklyn-small.jpg, ./images/brooklyn-small-2x.jpg 2x, ./images/brooklyn-small-3x.jpg 3x"
        type="image/jpeg">
</picture>
```

在上面的代码中，我们指定不同的图像大小及其相应的设备像素比给给定的屏幕宽度。使用 **picture** 标签，浏览器可以基于设备决定最佳的内容。以上的代码可以完美运行，我们可以进一步扩展，以适应更多的场景。

你可能听过**WebP**图片格式。相比于PNG图片，其文件大小能够节省26％；相比于JPEG图片，能够节省大约25％-34%。目前，Chrome、Opera以及Android能够支持WebP格式，但Safari和IE尚未支持。既然我们能够用picture标签来处理响应式图片，我们也能够使用WebP格式的图片并且允许浏览器在不支持WebP时进行回退。

![webp](http://a43d55f6a02c4be185ce-9cfa4cf7c673a59966ad8296f4c88804.r44.cf3.rackcdn.com/WebP/logo-webp.png)

让我们在上面代码的基础上，添加WebP图片的支持。同时，我们要确保能够根据不同的DPR使用最佳视觉效果的图片。

``` html
<picture>
    <!-- JPEG Images -->
    <source
        media="(min-width: 1024px)"
        srcset="./images/brooklyn.jpg, ./images/brooklyn-2x.jpg 2x, ./images/brooklyn-3x.jpg 3x"
        type="image/jpeg">
    <source
        media="(min-width: 320px)"
        srcset="./images/brooklyn-small.jpg, ./images/brooklyn-small-2x.jpg 2x, ./images/brooklyn-small-3x.jpg 3x"
        type="image/jpeg">
    <!-- WebP Images -->
    <source
        media="(min-width: 1024px)"
        srcset="./images/brooklyn.webp, ./images/brooklyn-2x.webp 2x, ./images/brooklyn-3x.webp 3x"
        type="image/webp">
    <source
        media="(min-width: 320px)"
        srcset="./images/brooklyn-small.webp, ./images/brooklyn-small-2x.webp 2x, ./images/brooklyn-small-3x.webp 3x"
        type="image/webp">
        <!-- The fallback image -->
    <img
        src="./images/brooklyn.jpg" alt="Brooklyn Bridge - New York">
</picture>
```

在上面的代码中，我们已经创建了能够同时使用JPEG和WebP图片的picture标签。浏览器将根据设备决定最佳的选项。由于WebP并不支持IE和Safari，使用WebP图片意味着你需要在服务器上同时保存WebP和JPEG格式的图片副本。上面的代码足够满足我们当前的需求，但试想一下如果每张采用这种方式来编写，代码将会变得非常臃肿。当你的站点开始增长时，为每张图片编写上面的代码将会变得非常乏味。这时候，便可以采用Service Workers来解决这个问题。

![webp](http://a43d55f6a02c4be185ce-9cfa4cf7c673a59966ad8296f4c88804.r44.cf3.rackcdn.com/Service-Workers-WebP/accept-headers-webp.png)

我们采用开发者工具观察HTTP请求头部，可以看出可以根据Accept头部来判断我们的浏览器是否支持WebP图片。为了利用这一点，并开始提供WebP图片，我们需要注册一个Service Worker。Service Worker的一大特性就是，它们能够拦截网络请求，这样子，我们就能够完全控制响应内容。使用这个特性，我们能够监听HTTP头部，并决定如何做。如果你想了解更多关于Service Workers的内容，可以看看这个[Github](https://github.com/slightlyoff/ServiceWorker)库获取更多的信息。

我们在html页面添加如下代码用于注册Service Worker。以下的代码引用service-worker.js文件。

``` html
<script>
// Register the service worker
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
}).catch(function(err) {
    // registration failed :(
    	console.log('ServiceWorker registration failed: ', err);
    });
}
</script>
```

在上面的代码中，我们做了一个简单的检查，判断浏览器是否支持Service Worker，如果支持，注册并安装Service Worker。这段代码代码最好的地方就是做了兼容处理，如果浏览器不支持Service Workers，它们会自动回退并且用户不会注意到其中差别。

接下来，我们需要创建Service Worker文件‘service-worker.js‘，用于拦截正在传递到服务器的请求。

``` javascript
"use strict";

// Listen to fetch events
self.addEventListener('fetch', function(event) {

  // Check if the image is a jpeg
  if (/\.jpg$|.png$/.test(event.request.url)) {

  // Inspect the accept header for WebP support
  var supportsWebp = false;
  if (event.request.headers.has('accept')){
	supportsWebp = event.request.headers
        	                    .get('accept')
                                    .includes('webp');
      	}

  	// If we support WebP
  	if (supportsWebp)
  	{
		// Clone the request
		var req = event.request.clone();

	        // Build the return URL
	    	var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";

		event.respondWith(
		  fetch(returnUrl, {
		     mode: 'no-cors'
		   })
		);
      }
  }
});
```

上面的示例代码做了一系列的事情，让我们来一步步分解。

在前面几行，我添加一个事件监听器来监听任何一个fetch事件。当每个请求发生时，先判断当前的请求是否是获取JPEG或者PNG格式的图片。如果当前的请求是获取图片，我就能根据HTTP请求头部来决定最佳的响应。在这种情况下，我通过检查Accept头部并且查找是否存在“image/webp“ Mime类型。一旦查询完头部的值，我就能确定浏览器是否支持WebP图片，如果浏览器支持WebP图片，就返回相应的WebP图片。

现在，我们的HTML看起来比较整洁，能够支持WebP图片而并不臃肿。

``` html
<picture>
    <source
        media="(min-width: 1024px)"
        srcset="./images/brooklyn.jpg, ./images/brooklyn-2x.jpg 2x, ./images/brooklyn-3x.jpg 3x"
        type="image/jpeg">
    <source
        media="(min-width: 320px)"
        srcset="./images/brooklyn-small.jpg, ./images/brooklyn-small-2x.jpg 2x, ./images/brooklyn-small-3x.jpg 3x"
        type="image/jpeg">
</picture>
```

Service Workers给了我们无限的可能。在这个例子中，我们可以扩展到包括其他图片格式，甚至是缓存。你还能轻松地添加支持IE的[JPEGXR](http://caniuse.com/#feat=jpegxr)。这样子，我们能够更快地给我们的用户展示我们的页面。

如果你想看看示例代码运行的效果，请移步到[deanhume.github.io/Service-Workers-WebP](https://deanhume.github.io/Service-Workers-WebP)。打开支持这些特性的浏览器，如Chrome，打开开发者工具，就可以看到页面的运行。

### 参考资料
* [https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element](https://html.spec.whatwg.org/multipage/embedded-content.html#the-picture-element)
* [http://scottjehl.github.io/picturefill/](http://scottjehl.github.io/picturefill/)
* [https://developers.google.com/speed/webp/](https://developers.google.com/speed/webp/)
* [https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
