title: H5直播起航
subtitle: 直播这么火，想直播写代码的冲动吗，那还等什么，一起开始做H5直播吧～～
cover: //misc.aotu.io/pfan123/sopcast/banner.png
categories: Web开发
tags:
	- H5
	- H5 视频直播 video 
	- HLS、RTMP协议
author:
  nick: 高大师
  github_name: pfan123
date: 2016-10-09 15:24:41
wechat:
    share_cover: http://misc.aotu.io/pfan123/sopcast/sopcast_200x200.png
    share_title: H5直播起航
    share_desc: 直播这么火，想直播写代码的冲动吗，那还等什么，一起开始做H5直播吧～
---

<!-- more -->

## 前言

前不久抽空对目前比较火的视频直播，做了下研究与探索，了解其整体实现流程，以及探讨移动端HTML5直播可行性方案。

发现目前 WEB 上主流的视频直播方案有 HLS 和 RTMP，移动 WEB 端目前以 HLS 为主（HLS存在延迟性问题，也可以借助 [video.js](https://github.com/videojs/video.js)  采用RTMP），PC端则以 RTMP 为主实时性较好，接下来将围绕这两种视频流协议来展开H5直播主题分享。

## 一、视频流协议HLS与RTMP

### 1. HTTP Live Streaming

HTTP Live Streaming（简称 HLS）是一个基于 HTTP 的视频流协议，由 Apple 公司实现，Mac OS 上的 QuickTime、Safari 以及 iOS 上的 Safari 都能很好的支持 HLS，高版本 Android 也增加了对 HLS 的支持。一些常见的客户端如：MPlayerX、VLC 也都支持 HLS 协议。

HLS 协议基于 HTTP，而一个提供 HLS 的服务器需要做两件事：

- 编码：以 H.263 格式对图像进行编码，以 MP3 或者 HE-AAC 对声音进行编码，最终打包到 MPEG-2 TS（Transport Stream）容器之中；
- 分割：把编码好的 TS 文件等长切分成后缀为 ts 的小文件，并生成一个 .m3u8 的纯文本索引文件；

浏览器使用的是 m3u8 文件。m3u8 跟音频列表格式 m3u 很像，可以简单的认为 m3u8 就是包含多个 ts 文件的播放列表。播放器按顺序逐个播放，全部放完再请求一下 m3u8 文件，获得包含最新 ts 文件的播放列表继续播，周而复始。整个直播过程就是依靠一个不断更新的 m3u8 和一堆小的 ts 文件组成，m3u8 必须动态更新，ts 可以走 CDN。一个典型的 m3u8 文件格式如下：

> #EXTM3U
> #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=200000
> gear1/prog_index.m3u8
> #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=311111
> gear2/prog_index.m3u8
> #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=484444
> gear3/prog_index.m3u8
> #EXT-X-STREAM-INF:PROGRAM-ID=1, BANDWIDTH=737777
> gear4/prog_index.m3u8

可以看到 HLS 协议本质还是一个个的 HTTP 请求 / 响应，所以适应性很好，不会受到防火墙影响。但它也有一个致命的弱点：延迟现象非常明显。如果每个 ts 按照 5 秒来切分，一个 m3u8 放 6 个 ts 索引，那么至少就会带来 30 秒的延迟。如果减少每个 ts 的长度，减少 m3u8 中的索引数，延时确实会减少，但会带来更频繁的缓冲，对服务端的请求压力也会成倍增加。所以只能根据实际情况找到一个折中的点。

对于支持 HLS 的浏览器来说，直接这样写就能播放了：

```
<video src="http://devimages.apple.com/iphone/samples/bipbop/bipbopall.m3u8"
height="300" width="400"  preload="auto" autoplay="autoplay" loop="loop" webkit-playsinline="true"></video>
```
`注意`：HLS 在 PC 端仅支持safari浏览器，类似chrome浏览器使用`HTML5 video`标签无法播放 m3u8 格式，可直接采用网上一些比较成熟的方案，如：[sewise-player](https://github.com/jackzhang1204/sewise-player)、[MediaElement](https://github.com/johndyer/mediaelement)、[videojs-contrib-hls](https://github.com/videojs/videojs-contrib-hls)、[jwplayer](https://github.com/jwplayer/jwplayer)。

### 2. Real Time Messaging Protocol
Real Time Messaging Protocol（简称 RTMP）是 Macromedia 开发的一套视频直播协议，现在属于 Adobe。这套方案需要搭建专门的 RTMP 流媒体服务如 Adobe Media Server，并且在浏览器中只能使用 Flash 实现播放器。它的实时性非常好，延迟很小，但无法支持移动端 WEB 播放是它的硬伤。

虽然无法在iOS的H5页面播放，但是对于iOS原生应用是可以自己写解码去解析的, RTMP 延迟低、实时性较好。

浏览器端，`HTML5 video`标签无法播放 RTMP 协议的视频，可以通过 [video.js](https://github.com/videojs/video.js) 来实现。

```
<link href="http://vjs.zencdn.net/5.8.8/video-js.css" rel="stylesheet">

<video id="example_video_1" class="video-js vjs-default-skin" controls preload="auto" width="640" height="264" loop="loop" webkit-playsinline>
	<source src="rtmp://10.14.221.17:1935/rtmplive/home" type='rtmp/flv'>
</video>

<script src="http://vjs.zencdn.net/5.8.8/video.js"></script>
<script>
videojs.options.flash.swf = 'video.swf';
videojs('example_video_1').ready(function() {
  this.play();
});
</script>
```

### 3. 视频流协议HLS与RTMP对比

|  |    协议   | 原理 | 延时 | 优点 | 使用场景 | 
| :----: | :----: | :----: | :----: | :----: | :----: |
|HLS | 短链接Http | 集合一段时间数据生成ts切片文件更新m3u8文件 | 10s - 30s | 跨平台 | 移动端为主 |
|RTMP |   长链接Tcp | 每个时刻的数据收到后立即发送 | 2s | 延时低、实时性好 | PC+直播+实时性要求高＋互动性强 |


## 二、直播形式

![直播形式](//misc.aotu.io/pfan123/sopcast/1.png)

目前直播展示形式，通常以YY直播、映客直播这种页面居多，可以看到其结构可以分成三层：① 背景视频层 ② 关注、评论模块 ③ 点赞动画

而现行H5类似直播页面，实现技术难点不大，其可以通过实现方式分为：① 底部视频背景使用video视频标签实现播放 ② 关注、评论模块利用 WebScoket 来实时发送和接收新的消息通过DOM 和 CSS3 实现  ③ 点赞利用 CSS3 动画

了解完直播形式之后，接下来整体了解直播流程。

## 三、直播整体流程

直播整体流程大致可分为：

- 视频采集端：可以是电脑上的音视频输入设备、或手机端的摄像头、或麦克风，目前以移动端手机视频为主。

- 直播流视频服务端：一台Nginx服务器，采集视频录制端传输的视频流(H264/ACC编码)，由服务器端进行解析编码，推送RTMP/HLS格式视频流至视频播放端。

- 视频播放端：可以是电脑上的播放器（QuickTime Player、VLC），手机端的native播放器，还有就是 H5 的video标签等，目前还是以手机端的native播放器为主。

![直播整体流程](//misc.aotu.io/pfan123/sopcast/2.png)


## 四、H5 录制视频

对于H5视频录制，可以使用强大的 webRTC （Web Real-Time Communication）是一个支持网页浏览器进行实时语音对话或视频对话的技术，缺点是只在 PC 的 Chrome 上支持较好，移动端支持不太理想。

### 1. 使用 webRTC 录制视频基本流程

① 调用 `window.navigator.webkitGetUserMedia()` 获取用户的PC摄像头视频数据。
② 将获取到视频流数据转换成 `window.webkitRTCPeerConnection` (一种视频流数据格式)。
③ 利用 `WebScoket` 将视频流数据传输到服务端。

`注意`：虽然Google一直在推WebRTC，目前已有不少成型的产品出现，但是大部分移动端的浏览器还不支持 webRTC（最新iOS 10.0也不支持），所以真正的视频录制还是要靠客户端（iOS,Android）来实现,效果会好一些。
![WebRTC支持度](//misc.aotu.io/pfan123/sopcast/3.png)

### 2. iOS原生应用调用摄像头录制视频流程

① 音视频的采集，利用AVCaptureSession和AVCaptureDevice可以采集到原始的音视频数据流。
② 对视频进行H264编码，对音频进行AAC编码，在iOS中分别有已经封装好的编码库（[x264编码](https://github.com/kewlbear/x264-ios)、[faac编码](https://github.com/fflydev/faac-ios-build)、[ffmpeg编码](https://github.com/kewlbear/FFmpeg-iOS-build-script)）来实现对音视频的编码。
③ 对编码后的音、视频数据进行组装封包。
④ 建立RTMP连接并上推到服务端。

![视频流程](//misc.aotu.io/pfan123/sopcast/4.png)

## 五、搭建Nginx+Rtmp直播流服务

### 1. 安装nginx、nginx-rtmp-module

① 先clone nginx项目到本地：

```
brew tap homebrew/nginx
```

② 执行安装`nginx-rtmp-module`

```
brew install nginx-full --with-rtmp-module
```

### 2. nginx.conf配置文件，配置RTMP、HLS

查找到nginx.conf配置文件（路径/usr/local/etc/nginx/nginx.conf），配置RTMP、HLS。

① 在http节点之前添加 rtmp 的配置内容：

```
rtmp {
  server {
     #监听的端口
      listen 1935;
      # RTMP 直播流配置
      application rtmplive {
          live on;
	      #为 rtmp 引擎设置最大连接数。默认为 off
	      max_connections 1024;
       }
	  # HLS 直播流配置
      application hls{
          live on;
          hls on;
          hls_path /usr/local/var/www/hls;
          hls_fragment 1s;
      }
   }
}
```

② 在http中添加 hls 的配置

```
	location /hls {  
        # Serve HLS fragments  
        types {  
            application/vnd.apple.mpegurl m3u8;  
            video/mp2t ts;  
        }  
        root /usr/local/var/www;  
        #add_header Cache-Controll no-cache;
        expires -1;
    }
```

### 3. 重启nginx服务

重启nginx服务，浏览器中输入 [http://localhost:8080](http://localhost:8080)，是否出现欢迎界面确定nginx重启成功。
```
	nginx -s reload
```

## 六、直播流转换格式、编码推流

当服务器端接收到采集视频录制端传输过来的视频流时，需要对其进行解析编码，推送RTMP/HLS格式视频流至视频播放端。通常使用的常见编码库方案，如[x264编码](https://github.com/kewlbear/x264-ios)、[faac编码](https://github.com/fflydev/faac-ios-build)、[ffmpeg编码](https://github.com/kewlbear/FFmpeg-iOS-build-script)等。

鉴于 FFmpeg 工具集合了多种音频、视频格式编码，我们可以优先选用FFmpeg进行转换格式、编码推流。

1.安装 FFmpeg 工具
```
brew install ffmpeg
```

2.推流MP4文件

视频文件地址：/Users/gao/Desktop/video/test.mp4
推流拉流地址：rtmp://localhost:1935/rtmplive/home，rtmp://localhost:1935/rtmplive/home

```
//RTMP 协议流
ffmpeg -re -i /Users/gao/Desktop/video/test.mp4 -vcodec libx264 -acodec aac -f flv rtmp://10.14.221.17:1935/rtmplive/home

//HLS 协议流
ffmpeg -re -i /Users/gao/Desktop/video/test.mp4 -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv  -q 10 rtmp://10.14.221.17:1935/hls/test
```
`注意`： 当我们进行推流之后，可以安装[VLC](http://www.pc6.com/mac/112121.html)、ffplay（支持rtmp协议的视频播放器）本地拉流进行演示

3.FFmpeg推流命令

① 视频文件进行直播

```
ffmpeg -re -i /Users/gao/Desktop/video/test.mp4 -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv  -q 10 rtmp://192.168.1.101:1935/hls/test
ffmpeg -re -i /Users/gao/Desktop/video/test.mp4 -vcodec libx264 -vprofile baseline -acodec aac -ar 44100 -strict -2 -ac 1 -f flv  -q 10 rtmp://10.14.221.17:1935/hls/test
```

② 推流摄像头＋桌面+麦克风录制进行直播

```
ffmpeg -f avfoundation -framerate 30 -i "1:0" \-f avfoundation -framerate 30 -video_size 640x480 -i "0" \-c:v libx264 -preset ultrafast \-filter_complex 'overlay=main_w-overlay_w-10:main_h-overlay_h-10' -acodec libmp3lame -ar 44100 -ac 1  -f flv rtmp://192.168.1.101:1935/hls/test
```
更多命令，请参考：
[FFmpeg处理RTMP流媒体的命令大全](http://blog.csdn.net/leixiaohua1020/article/details/12029543)
[ FFmpeg常用推流命令](http://www.jianshu.com/p/d541b317f71c)

## 七、H5 直播视频播放

移动端iOS和 Android 都天然支持HLS协议，做好视频采集端、视频流推流服务之后，便可以直接在H5页面配置 video 标签播放直播视频。

```
<video controls preload="auto"  autoplay="autoplay" loop="loop" webkit-playsinline>    
    <source src="http://10.14.221.8/hls/test.m3u8" type="application/vnd.apple.mpegurl" />  
    <p class="warning">Your browser does not support HTML5 video.</p>  
</video>   
```
`ps`：① video标签添加`webkit-playsinline`属性（iOS支持）是保证视频在网页中内嵌播放。
② 针对微信浏览器，video标签层级最高的问题，需要申请添加白名单，请参照 http://bbs.mb.qq.com/thread-1242581-1-1.html?ptlang=2052。

## 八、总结

本文从视频采集上传，服务器处理视频推流，以及H5页面播放直播视频一整套流程,具体阐述了直播实现原理，实现过程中会遇到很多性能优化问题。

① H5 HLS 限制必须是H264+AAC编码。

② H5 HLS 播放卡顿问题，server 端可以做好分片策略，将 ts 文件放在 CDN 上，前端可尽量做到 DNS 缓存等。

③ H5 直播为了达到更好的实时互动，也可以采用RTMP协议，通过`video.js`实现播放。





参考资料：
- [如何搭建一个完整的视频直播系统？](https://www.zhihu.com/question/42162310)
- [WebRTC相关的canvas与video](http://www.haomou.net/2014/08/04/2014_Html5_canvas_video/)
- [使用 WebSockets 进行 HTML5 视频直播](https://segmentfault.com/a/1190000000392586)
- [关于直播，所有的技术细节都在这里了（一）](http://blog.ucloud.cn/archives/694)
- [关于直播，所有的技术细节都在这里了（二）](http://blog.ucloud.cn/archives/699)
- [关于直播，所有的技术细节都在这里了（三）](http://blog.ucloud.cn/archives/760)
- [JS解码项目jsmpeg](https://github.com/phoboslab/jsmpeg)