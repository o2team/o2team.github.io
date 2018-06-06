title: 图像处理 - ImageMagick 简单介绍与案例
subtitle: ImageMagick 是一款强大的创建、编辑、合成，转换图像的命令行工具。支持格式超过 200 种，包括常见的 PNG, JPEG, GIF, HEIC, TIFF, DPX, EXR, WebP, Postscript, PDF, SVG 等。功能包括调整，翻转，镜像(mirror)，旋转，扭曲，修剪和变换图像，调整图像颜色，应用各种特殊效果，或绘制文本，线条，多边形，椭圆和贝塞尔曲线等。本文主要介绍一下 ImageMagick 的用法与细节。
cover: https://img11.360buyimg.com/ling/jfs/t21382/242/710567581/125401/630d6b14/5b161ac7N5de78bc7.jpg
categories: Web开发
date: 2018-06-06 20:30:35
tags:
  - 图像处理
  - ImageMagick
  - linux
  - node.js
author:
  nick: Barrior
  github_name: Barrior
wechat:
    share_cover: https://img11.360buyimg.com/ling/jfs/t20107/216/1156926714/50127/ef5c96dc/5b1666efN68d69000.jpg
    share_title: 图像处理 - ImageMagick 简单介绍与案例
    share_desc:  ImageMagick 是一款强大的创建、编辑、合成，转换图像的命令行工具。支持格式超过 200 种，包括常见的 PNG, JPEG, GIF, HEIC, TIFF, DPX, EXR, WebP, Postscript, PDF, SVG 等。功能包括调整，翻转，镜像(mirror)，旋转，扭曲，修剪和变换图像，调整图像颜色，应用各种特殊效果，或绘制文本，线条，多边形，椭圆和贝塞尔曲线等。本文主要介绍一下 ImageMagick 的用法与细节。

---

<!-- more -->

在客户端我们可以用 `PhotoShop` 等 `GUI` 工具处理静态图片或者动态 `GIF` 图片，不过在服务器端对于 `WEB` 应用程序要处理图片格式转换，缩放裁剪，翻转扭曲，PDF解析等操作， `GUI` 软件就很难下手了，所以此处需要召唤命令行工具来帮我们完成这些事。

**ImageMagick:** 是一款强大的创建、编辑、合成，转换图像的命令行工具。支持格式超过 `200` 种，包括常见的 `PNG, JPEG, GIF, HEIC, TIFF, DPX, EXR, WebP, Postscript, PDF, SVG` 等。功能包括调整，翻转，镜像(mirror)，旋转，扭曲，修剪和变换图像，调整图像颜色，应用各种特殊效果，或绘制文本，线条，多边形，椭圆和贝塞尔曲线等。

官网：https://www.imagemagick.org 下面放个小标识。

![小标识.png](https://img13.360buyimg.com/ling/jfs/t20092/208/1167159371/53422/6b06756f/5b161da3Nec0d6b0d.png)

### 安装 ImageMagick
> 支持 `Linux, Windows, Mac OS X, iOS, Android OS` 等平台
> https://www.imagemagick.org/script/download.php

因为我是 MAC 机器，演示一下 `brew` 的安装方式咯
```
brew install imagemagick
```

### 基本命令与格式
#### 1、基本命令
> `ImageMagick` 包括一组命令行工具来操作图片，安装好 `ImageMagick` 后，终端就可以使用如下命令了。

`magick:` 创建、编辑图像，转换图像格式，以及调整图像大小、模糊、裁切、除去杂点、抖动 ( dither )、绘图、翻转、合并、重新采样等。
`convert:` 等同于 `magick` 命令。
`identify:` 输出一个或多个图像文件的格式和特征信息，如分辨率、大小、尺寸、色彩空间等。
`mogrify:` 与 ` magick` 功能一样，不过不需要指定输出文件，自动覆盖原始图像文件。
`composite:` 将一个图片或多个图片组合成新图片。
`montage:` 组合多个独立的图像来创建合成图像。每个图像都可以用边框，透明度等特性进行装饰。

`compare:` 从数学和视觉角度比较源图像与重建图像之间的差异。
`display:` 在任何 X server 上显示一个图像或图像序列。
`animate:` 在任何 X server 上显示图像序列。
`import:` 保存 X server 上的任何可见窗口并把它作为图像文件输出。可以捕捉单个窗口，整个屏幕或屏幕的任意矩形部分。
`conjure:` 解释并执行 MSL ( Magick Scripting Language ) 写的脚本。
`stream:` 一个轻量级工具，用于将图像或部分图像的一个或多个像素组件流式传输到存储设备。在处理大图像或原始像素组件时很有用。

#### 2、命令格式

基本命令的使用，遵循 `Unix` 风格的标准格式：
```
command [options] input_image output_image
```

比如我们将一张宽高 `300x300` 的图片 `goods.png` 转换成 `200x200` 的`goods.jpg`，可以这样用
```
convert -resize 200x200 goods.png goods.jpg
```

> `-resize` 定义图片尺寸，`ImageMagick` 所有的选项参数都在这个【[命令行选项手册](https://www.imagemagick.org/script/command-line-options.php)】。

但是随着功能的复杂，命令缓慢扩大成了这样的格式：
```
command [options] image1 [options] image2 [options] output_image    
```

于是上面的命令也可以写成这样
```
convert goods.png -resize 200x200 goods.jpg
```

`笔记：`个人建议，如果转换的是一张图片，那么用第一种格式，因为像 `-density` 等一些选项必须放在 `command` 与 `input_image` 之间，所以为了省记都不写错，都写在 `command` 与 `input_image` 之间岂不很好。
但是如果是多张图片转换，就需要按第二种格式，正确输出命令选项了。

`提示：`如果上面的工具命令在计算机上不可以使用，则可以把它们当作 `magick` 命令的子命令使用，例如
```
magick identify goods.png
```
#### 3、指定文件格式

默认情况下 `ImageMagick` 会读取图像中唯一标识格式的签名来确定文件格式，如果没有，则根据文件的扩展名来确定格式，如 `image.jpg` 被认为 `jpeg` 格式文件，如果都获取不到，则需要手动指定文件的格式。命令格式为 `format:input_or_output_image`。

输入文件一般情况应该不需要手动指定文件格式，输出文件的时候，`png` 格式分 `png8`、`png24` 等格式，如果 `png8` 格式的文件能够满足需求，指定合理的格式可以缩小文件的大小，示例如下。
```
convert goods.png png8:goods_8.png
convert goods.png png24:goods_24.png
```


### 实际案例
> 文中案例基于 `ImageMagick 7.0.7`

#### 1、生成缩略图

需求：将一张宽高为 `900x600` 的图片 `goods.jpg` 生成宽高为 `150x100` 的缩略图 `thumbnail.jpg`

```
convert -resize 150x100 -quality 70 -strip goods.jpg thumbnail.jpg
```

解释：

 - `-resize 150x100`：定义输出的缩略图尺寸为 `150x100`。
 - `-quality 70`：降低缩略图的质量为 `70`，取值范围 `1` ( 最低图像质量和最高压缩率 ) 到 `100` ( 最高图像质量和最低压缩率 )，默认值根据输出格式有 `75`、`92`、`100`，选项适用于 `JPEG / MIFF / PNG`。
 - `-strip`：让缩略图移除图片内嵌的所有配置文件，注释等信息，以减小文件大小。

> `-resize` 延伸解读，如下。

上面的例子中，输入的图片和输出的图片比例是一致的，所以不会有特殊情况出现，但是遇到比例不同的时候，上面的写法并不会得到 `150x100` 的图像，而是会根据图像的宽高比例，取最大值，得出来的结果可能是 `150` 宽和更小的高，或者 `100` 高和更小的宽；所以 `IamgeMagick` 提供了几种符号来定义缩放。
```
convert -resize '150x100!' goods.jpg thumbnail.jpg
convert -resize '150x100>' goods.jpg thumbnail.jpg
convert -resize '150x100<' goods.jpg thumbnail.jpg
```
`!`：不管图片宽高如何，都缩放成 `150x100` 这样的尺寸。
`>`：只有宽高均大于 `150x100` 的图片才缩放成该尺寸 ( 按比例取最大值 )，小于的图片不做处理。
`<`：与 `>` 功能相反。

`提示：`因为有些字符是 `Linux shell` 或其他系统的特殊字符，所以需要用引号包裹起来或者用反斜线 `\` 转义，另外，不同平台可能引号都是有差异的。


#### 2、添加水印

需求 ① ：给图片居中加上透明文本水印。

```
convert  -draw 'text 0,0 "JD.COM"'  -fill 'rgba(221, 34, 17, 0.25)'  -pointsize 36  \
-font 'cochin.ttc'  -gravity center  joy.jpg  watermark.jpg
```

解释：

 - `-draw`：绘图选项，`text` 声明绘制文本， `0,0` 声明文本距离图片左上角的偏移值， `JD.COM` 声明绘制的文本，最好用引号包裹起来，避免输入特殊字符引起错误。绘制文本的格式为 `text x,y string`，当然还可以绘制其他类型，诸如圆 ( circle )、折线 ( polyline )。
 - `-fill`：对文本填充颜色，貌似 `ImageMagick` 命令中`前面的选项`是用来控制`后面的选项`的，所以应该把这样的修饰选项放到 `-draw` 前面比较好，`很重要`，后面的案例就是这样的。
 - `-pointsize`：指定文本的字体大小。
 - `-font`：指定字体。
 - `-gravity`：设置文本在图片里的排列方式 ( 类似 CSS 里的 align-items + justify-content )，`center` 表示水平垂直都居中，其他值还可以是：`NorthWest, North, NorthEast, West, East, SouthWest, South, SouthEast`，不记大小写。
 - `\`：反斜线也是类 `Unix` 系统的续行字符，当一个命令很长时，我们可以把它写成多行，以便视觉上的美观和直观。

需求 ② ：给图片加上倾斜平铺透明文本水印。

```
convert  -size 100x100  xc:none  \
-fill '#d90f02'  -pointsize 18  -font 'cochin.ttc'  \
-gravity center  -draw 'rotate -45 text 0,0 "JD.COM"'  \
-resize 60%  miff:-  |  composite  -tile  -dissolve 25  -  joy.jpg  watermark.jpg
```

解释：文本平铺水印其实是将文本画成一张 `png` 图片，然后用这张透明图片在目标图片上进行平铺。

 - `-size`：设置画布的大小。
 - `xc:`：全称 `X Constant Image`，是 `canvas:` 的别名，定义一张画布，用来绘图，常用格式为 `xc:color`，`none` 或者 `transparent` 设置画布为透明底，默认为白色。
 - `-resize`：该选项还可以指定百分比，意为缩放至原图像的百分之几。貌似 `-pointsize` 小于 `14` 后，`-draw` 里的 `rotate` 会不生效，所以用 `-resize` 来把平铺图案变得更小。
 - `miff:-`：
   - `miff:` 声明输出 ImageMagick ( IM ) 自己的图像文件格式：[MIFF](https://www.imagemagick.org/script/miff.php)，主要用途是以复杂的方式处理图像时当做中间保存格式，适用于从一个 IM 命令向另一个 IM 命令传递图像元数据和其他关联属性。
   - `-` 在管道符前面意为将 IM 命令执行的结果作为标准输出，在管道符后面则表示从标准输入中读取这个数据，如在管道符后面的 `composite` 中使用 `-` 读取刚刚生成的透明图像。
 - `|`：`Linux shell` 管道符，用于将上一个命令的标准输出传递到下一个命令作为标准输入。这里将生成的水印图案传递给 `composite` 命令。
 - `-tile`：顾名思义，让图案平铺。
 - `-dissolve`：设置平铺图案的透明度。

图释：

![图片描述](https://img20.360buyimg.com/ling/jfs/t21091/171/680652696/44636/6ceaa42c/5b161da0Nf2158787.jpg)

#### 3、绘制验证码

大概逻辑如下：

 1. 随机生成 `4` 个英文字母或数字。
 1. 创建一个宽高 `100x40` 的画布。
 1. 设置字体大小为 `16`，每个字符的宽高也就是 `16` 左右了，依次计算出每个字符的 `x, y` 坐标，再增加一丁点旋转。
 1. 随机创建一条透明曲线，加上噪点，增加图片被破解的难度（在保证肉眼能看得清楚的用户体验下）。
 1. 如果需要安全性更高的验证码，请了解验证码破解原理并做合理调整。

如果加上随机计算，可能代码会比较多，所以这里写成固定值，方便理解。

```
convert  'xc:[100x40!]'  -pointsize 20  -font 'cochin.ttc'  \
-gravity NorthWest  -strokewidth 1  \
-fill '#b72b36'  -stroke '#b72b36'  -draw 'translate 13,19  rotate 10  text -5,-8 "5"'  \
-fill '#821d70'  -stroke '#821d70'  -draw 'translate 36,13  rotate -8  text -8,-8 "C"'  \
-fill '#c7960a'  -stroke '#c7960a'  -draw 'translate 60,23  rotate 5   text -5,-8 "2"'  \
-fill '#03610a'  -stroke '#03610a'  -draw 'translate 85,25  rotate 13  text -8,-8 "E"'  \
-strokewidth 2  -stroke 'rgba(248, 100, 30, 0.5)'  -fill 'rgba(0, 0, 0, 0)'  \
-draw 'bezier  -20,30  -16,10  20,2    50,20'  \
-draw 'bezier  50,20   78,42   138,36  140,16'  \
+noise Impulse  \
verification_code.jpg
```

结果：

![图片描述](https://img10.360buyimg.com/ling/jfs/t20143/186/680399623/7216/bd166545/5b161aefN83150dd6.jpg)

鉴于字体比较细，可以用 `strokewidth` 加边框来加粗，或者使用字体的粗体版本，这里使用了第一种方式。

解释：
 - `xc:[100x40!]`：设置画布大小的一种简写方式，方括号里写入画布宽高，注意要加 `!`，否则会出乎意料哟。
 - `文本定位与旋转`
   1. 画布宽 `100px`，平均分成 `4` 分，每份 `25px`, 文字宽 `16px`, 得文字 `x` 的坐标左右摆动范围为 `+0px, +9px`，`y` 坐标同理，用于设置 `translate` 值。
   1. 实际上字体本身并没有填充满整个 `16x16` 的区域，根据字体的不同，填满的区域可能各有不同，所以根据`cochin` 字体的特性，上面稍微将字体大小调整为 `20`，实际渲染出来的字母才是 `16x16` 左右大小，数字大概是 `10x16`，所以设置数字的 `x,y` 为 `-5,-8`，结合下面两个属性解释 `x,y` 的计算方式。
   1. `translate`: 设置文本的横纵向偏移值。
   1. `rotate`：设置文本旋转，单位 `degrees`。根据 `gravity` 的设置坐标系统有一丁点变化，所以请设置为 `西北(NorthWest)` ，表示以画布 `0,0` 坐标旋转，跟 `HTML 5 Canvas` 坐标系统一致。
   1. 根据这样的坐标系统，如果要文字按自身的中心旋转，得配合 `translate` 和 `text` 的 `x,y` 一起使用，原理可参考[这篇文章\[图像旋转的实现\]](https://aotu.io/notes/2017/05/25/canvas-img-rotate-and-flip/index.html)，注意 `translate` 与 `rotate` 的顺序。 
 - `strokewidth`：设置文本的边框宽度或线条宽度。
 - `stroke`：设置文本的边框颜色或线条颜色。
 - `-fill 'rgba(0, 0, 0, 0)'`：上面设置了文本的填充颜色，会影响下面的贝塞尔曲线，所以这里指定一个透明的填充色以覆盖上面的设定，使曲线没有填充。
 - `bezier`：绘制贝塞尔曲线，一两句话我怕解释不清楚，所以请大家参考一下[维基百科的解释](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)或者[这篇中文文章的解释](http://www.html-js.com/article/1628)，最后再参考一下 [IM 官方示例的描述](https://www.imagemagick.org/Usage/draw/#bezier)。上面两条三次贝塞尔曲线的坐标分别表示 `起始点`，`起始点的控制点`，`结束点的控制点`，`结束点`。
 - `+noise`：增加噪点，可以使用 `convert -list noise` 查看当前系统支持哪些算法的噪点，大概有 `Gaussian, Impulse, Laplacian, Multiplicative, Poisson, Random, Uniform`。


#### 4、克隆及拼合图像
> 这个案例主要了解几个基本操作的 `API`。

```
convert  \
\(  -crop 300x300+10+25  joy.jpg  \)  \
\(  -resize 400x400  -crop 300x300+50+0  logo:  \)  -swap 0,1  +append  \
\(  -clone 0  -flop  -flip  \)  -append  \
-resize 200x200  combined.jpg
```

结果如下：

![图片描述](https://img13.360buyimg.com/ling/jfs/t20998/239/710863618/17515/6d03d48b/5b161aedN50ba4b89.jpg)

解释：
 - `圆括号 \( ... \)`：图像堆栈 ( `image stack` )，相当于创建了一个独立作用域处理图像，这个可以使图像之前的处理互不干扰。圆括号需用反斜杠转义，才能不被 `Shell` 当做特殊字符处理，并且`每个圆括号两边需要用空格隔开`。不必要的圆括号会使 `IM` 增加少许额外的工作，但是却让命令更清晰不容易出错。
 - `-crop`：裁剪出图像的一个或多个矩形区域，格式为 `{size}{+-}x{+-}y`，如果不指定偏移值 `x,y`，则会被解释为按指定宽高切割图像成多少份（多图像）。
 - `logo:`：`IM` 内置图像，这个就是上图中拿着魔法棒的主人公了，本身宽高 `640x480`，其他内置图像还有：`rose:`，`granite:`等，[看这里](https://www.imagemagick.org/script/formats.php#builtin-images)。
 - `-swap`：
    1. 交换图像的位置，格式 `-swap index,index`。
    1. `IM` 在图像处理操作时，实际上很可能是在处理一个图像列表，当新图像被读入或者创建时，`IM` 会将该新图像添加到当前图像列表的末尾。
    1. 如上，本来我们的图像列表里有 `2` 张图，第一张是 `joy`，但是 `-swap 0,1` 的意思是交换第一张图与第二张图的位置，所以 `joy` 变成跑到后面了。
 - `+append`：水平连接当前图像列表的图像来创建单个较长的图像。
 - `-append`：垂直连接当前图像列表的图像来创建单个较长的图像。
 - `-clone`：克隆图像，格式为 `-clone {index_range_list}`。
    - `-clone 0`：表示克隆图像列表里的第一张图像。
    - `-clone 1-2`：表示克隆图像列表里的第二张到第三张图像。
    - `-clone 0--1`：`0` 表示第一张图像，`-1` 表示最后一张图像，所以整句命令则表示克隆整个图像列表。
    - `-clone 2,0,1`：表示克隆第三张，第一张，第二张图像，顺序根据指定的索引决定，用逗号分隔。
 - `-flop`：将图像水平翻转。
 - `-flip`：将图像垂直翻转。

`笔记：`
  
1. 选项之间的顺序很重要。
1. 与 `-clone` 雷同的选项还有诸如：`-delete, -insert, -reverse, -duplicate`，用于操作图像列表，功能与单词意思相同。

#### 5、GIF 与图片互转

#### 5.1、GIF 转图片

```
convert  -coalesce  rain.gif  frame.jpg
```

`-coalesce`：根据图像 `-dispose` 元数据的设置覆盖图像序列中的每个图像，以重现动画序列中每个点的动画效果。下面用一张结果对比图来解释这句话。

原始图 ( rain.gif ) ：

![图片描述](https://sfault-image.b0.upaiyun.com/217/323/2173239304-5b13729a9441a_articlex)

结果对比：

![图片描述](https://img11.360buyimg.com/ling/jfs/t21829/207/694662510/406338/15330984/5b161affN1867e1c9.jpg)

#### 5.2、定义输出文件名

上面默认输出的文件名为：`frame-0.jpg, frame-1.jpg, frame-2.jpg ...`，
如果想使用下划线作为符号，输出为 `frame_0.jpg, frame_1.jpg, frame_2.jpg ...`，则可以如下设置。

```
convert  -coalesce  rain.gif  frame_%d.jpg
```

或者

```
 convert  -coalesce  -set filename:n '%p'  rain.gif  'frame_%[filename:n].jpg'
```

解释：

1. 第一种方式 `%d` 是 `C` 语言 `printf()` 中表示输出一个整数，参考 [-adjoin](https://www.imagemagick.org/script/command-line-options.php?#adjoin) 选项。
1. 第二种为常规方式。
    - `-set`：设置图像属性，格式为 `-set key value`
    - `filename:n '%p'`：以 `filename:` 开头的 `key` 用于设置输出文件名的相关信息，如这里使用 `filename:n`，在输出文件名时，则可以使用 `%[filename:n]` 拿到刚刚的设置，而设置的内容则是 `'%p'`。`'%p'` 表示图像在图像列表中的索引值，更多[百分比选项 ( Percent Escapes )](http://imagemagick.org/script/escape.php) 参考。

#### 5.3、解析特定帧

如果只想拿到 GIF 的第一帧，可以这样设置。

```
convert  -coalesce  'rain.gif[0]'  first_frame.jpg
```

拿到某些帧，如同 `-clone` 的写法。

```javascript
convert  -coalesce  'rain.gif[0-2]'  some_frames_%d.jpg
```

#### 5.4、获取页数

通过 `identify` 命令我们可以简要得到文件的信息，如下。
```
identify  rain.gif
```
![get_pages.png](https://img11.360buyimg.com/ling/jfs/t21955/234/742104977/71488/5b55a29f/5b1665d4Nfe4bd0aa.png)

通过换行符分割，简单封装一个 `Node.js` 函数获取页数。 

```
// parser.js
const util = require('util')
const exec = util.promisify(require('child_process').exec)

exports.numberOfPages = async (filePath) => {
  const { stdout, stderr } = await exec(`identify '${filePath}'`)
  if (stderr) {
    throw new Error(stderr)
  } else {
    return stdout.trim().split('\n').length
  }
}
```
```
// main.js
const { numberOfPages } = require('./parser')

;(async function start () {
  const pages = await numberOfPages('rain.gif')
  console.log('pages:', pages)
}())
```

#### 5.5、图片转 GIF

```
convert  -loop 0  'frame-*.jpg'  rain_animation.gif
```

将所有与 `frame-*.jpg` 模式匹配的图像转换成一张 `GIF` 图像，如 `frame-0.jpg`，`frame-1.jpg`等。
`-loop` 设置动画循环次数，`0` 表示无限循环。
设置每张图像的播放速度可以使用 [-delay](https://www.imagemagick.org/Usage/anim_basics/#gif_anim) 选项。

`笔记：` 在 `IM` 读取系列文件时，`frame-10.jpg` 会排在 `frame-2.jpg` 前面，为获得图像正确的读取顺序，可以为文件名设置前导零 ( `leading zeros` )。如：`frame-000.jpg, frame-001.jpg, frame-002.jpg ... frame-010.jpg`。

所以在生成图像时，我们可以使用 `%03d` 获得三位前导零。
```
convert  -coalesce  rain.gif  frame-%03d.jpg
```

#### 6、PDF 与图片互转

PDF 与图片互转跟 GIF 很相似，稍微有些格式自身需要注意的区别。
`IM` 本身是不具备解析 PDF 的功能的，需要依赖专门解析这种格式的外部程序，如官方指明的 `ghostscript` 解析程序。
首先安装 `gs`，还是演示 `Mac OS` 安装：`brew install ghostscript`。

以 [这个PDF](https://mozilla.github.io/pdf.js/web/viewer.html) 为例，把它转换成图片，有两种方式达到我们想要的结果:
```
① convert  -density 150  -flatten  'download.pdf[0]'  first_page.jpg
```
```
② convert  -density 150  -background white  -alpha remove  download.pdf  download.jpg
```

解释：
1. 当转换 PDF 成 JPG 格式图像时，某些情况得到的 JPG 图片会出现黑色背景（转换成 PNG 不会），所以可以使用 `-flatten` 选项让其保持白色背景，但加上这个选项，`多页 PDF 不会分成多个 JPG 图像`，第二种方式 `-background white -alpha remove` 则可以`一次命令转换多页 PDF 成多个图像`并保持白色背景。
1. 第二种方式 `IM` 内部应该是一页一页的转换，所以一个 `10` 页的 `PDF` 耗时会比较久，采用第一种方式让 `Node.js` 多进程同时转换该 `PDF` 可以提升速率。
1. `-density`：指定输出图像的分辨率 ( `DPI` )，在 `Mac OS` 上，默认的分辨率 ( `72` ) 输出的图像字迹不清，需要更高分辨率获得清晰的图像。


### 在 Node.js 中应用

> 直接通过 `child_process` 模块执行相应的命令即可，如下。

只需要结果可以使用 `exec`，
```
const util = require('util')
const exec = util.promisify(require('child_process').exec)

;(async function start () {
  const { stderr } = await exec(`convert -resize '150x100!' -strip goods.jpg thumbnail.jpg`)
  if (stderr) {
    console.log('convert failed.', stderr)
  } else {
    console.log('convert completed.')
  }
}())
```

流式输入输出可以使用 `spawn`，
```
const cp = require('child_process')
const fs = require('fs')

const args = [
  '-',  // 使用标准输入
  '-resize', '150x100!',
  '-strip',
  'jpg:-',  // 输出到标准输出
]

const streamIn = fs.createReadStream('/path/to/goods.jpg')
const proc = cp.spawn('convert', args)
streamIn.pipe(proc.stdin)
proc.stdout.pipe(HttpResponse)
```
