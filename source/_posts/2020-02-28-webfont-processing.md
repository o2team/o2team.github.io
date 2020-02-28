title: Web 中文字体处理总结
subtitle: Web 项目中，使用一个合适的字体能给用户带来良好的体验。但是字体文件太多，如果想要查看字体效果，只能一个个打开，非常影响工作效率。因此，需要实现一个功能，能够根据固定文字以及用户输入预览字体。
cover: https://raw.githubusercontent.com/linzpeng/imgs/master/cover.png
categories: Web开发
tags:
  - webfonts
  - 字体子集化
author:
  nick: 林林
  github_name: linzpeng
date: 2020-02-28 12:00:00
---

## 背景介绍

Web 项目中，使用一个合适的字体能给用户带来良好的体验。但是字体文件太多，如果想要查看字体效果，只能一个个打开，非常影响工作效率。因此，需要实现一个功能，能够根据固定文字以及用户输入预览字体。在实现这一功能的过程中主要解决两个问题：

* **中文字体体积太大导致加载时间过长**
* **字体加载完成前不展示预览内容**

现在将问题的解决以及我的思考总结成文。

![](https://raw.githubusercontent.com/linzpeng/imgs/master/a.png)

## 使用 web 自定义字体

在聊这两个问题之前，我们先简述怎样使用一个 Web 自定义字体。要想使用一个自定义字体，可以依赖 [CSS Fonts Module Level 3](https://drafts.csswg.org/css-fonts-3/) 定义的 `@font-face` 规则。一种基本能够兼容所有浏览器的使用方法如下： 

``` css
@font-face {
    font-family: "webfontFamily"; /* 名字任意取 */
    src: url('webfont.eot');
         url('web.eot?#iefix') format("embedded-opentype"),
         url("webfont.woff2") format("woff2"),
         url("webfont.woff") format("woff"),
         url("webfont.ttf") format("truetype");
    font-style:normal;
    font-weight:normal;
}
.webfont {
    font-family: webfontFamily;   /* @font-face里定义的名字 */
}
```

由于 `woff2`、`woff`、`ttf` 格式在大多数浏览器支持已经较好，因此上面的代码也可以写成：

``` css
@font-face {
    font-family: "webfontFamily"; /* 名字任意取 */
    src: url("webfont.woff2") format("woff2"),
         url("webfont.woff") format("woff"),
         url("webfont.ttf") format("truetype");
    font-style:normal;
    font-weight:normal;
}
```

有了`@font-face` 规则，我们只需要将字体源文件上传至 cdn，让 `@font-face` 规则的 `url` 值为该字体的地址，最后将这个规则应用在 Web 文字上，就可以实现字体的预览效果。

但这么做我们可以明显发现一个问题，字体体积太大导致的加载时间过长。我们打开浏览器的 Network 面板查看：

![](https://raw.githubusercontent.com/linzpeng/imgs/master/b.png)

可以看到字体的体积为5.5 MB，加载时间为5.13 s。而夸克平台很多的中文字体大小在20～40 MB 之间，可以预想到加载时间会进一步增长。如果用户还处于弱网环境下，这个等待时间是不能接受的。

## 一、中文字体体积太大导致加载时间过长

### 1. 分析原因

那么中文字体相较于英文字体体积为什么这么大，这主要是两个方面的原因：

1. 中文字体包含的字形数量很多，而英文字体仅包含26个字母以及一些其他符号。
2. 中文字形的线条远比英文字形的线条复杂，用于控制中文字形线条的位置点比英文字形更多，因此数据量更大。

我们可以借助于 `opentype.js`，统计一个中文字体和一个英文字体在字形数量以及字形所占字节数的差异: 

|  字体名称   |   字形数   |  字形所占字节数
|  --------   |   ------   | ------ |
| FZQingFSJW_Cu.ttf   |  8731  | 4762272 |
| JDZhengHT-Bold.ttf  |  122   | 18328 |

夸克平台字体预览需要满足两种方式，一种是固定字符预览, 另一种是根据用户输入的字符进行预览。但无论哪种预览方式，也仅仅会使用到该字体的少量字符，因此全量加载字体是没有必要的，所以我们需要对字体文件做精简。

### 2. 如何减小字体文件体积

#### unicode-range

unicode-range 属性一般配合 `@font-face` 规则使用，它用于控制特定字符使用特定字体。但是它并不能减小字体文件的大小，感兴趣的读者可以试试。

* [CSS unicode-range特定字符使用font-face自定义字体](https://www.zhangxinxu.com/wordpress/2016/11/css-unicode-range-character-font-face/)

#### fontmin

`fontmin` 是一个纯 `JavaScript` 实现的字体子集化方案。前文谈到，中文字体体积相较于英文字体更大的原因是其字形数量更多，那么精简一个字体文件的思路就是将无用的字形移除：

``` javascript 
// 伪代码
const text = '字体预览'
const unicodes = text.split('').map(str => str.charCodeAt(0))
const font = loadFont(fontPath)
font.glyf = font.glyf.map(g => {
 // 根据unicodes获取对应的字形
})
```

> 实际上的精简并没有这么简单，因为一个字体文件由许多`表(table)`构成，这些表之间是存在关联的，例如 `maxp` 表记录了字形数量，`loca` 表中存储了字形位置的偏移量。同时字体文件以 `offset table(偏移表)` 开头，`offset table`记录了字体所有表的信息，因此如果我们更改了 `glyf` 表，就要同时去更新其他表。

在讨论 `fontmin` 如何进行字体截取之前，我们先来了解一下字体文件的结构：

![](https://raw.githubusercontent.com/linzpeng/imgs/master/c.png)

上面的结构限于字体文件只包含一种字体，且字形轮廓是基于 `TrueType` 格式（决定 `sfntVersion` 的取值）的情况，因此偏移表会从字体文件的`0字节`开始。如果字体文件包含多个字体，则每种字体的偏移表会在 TTCHeader 中指定，这种文件不在文章的讨论范围内。

*偏移表(offset table)：*

|   Type     |   Name          |     Description      |
|   -------  |   ------        |     -----------      |
|   uint32   |   sfntVersion   |     0x00010000       | 
|   uint16   |   numTables     |   Number of tables   |
|   uint16   |   searchRange   | (Maximum power of 2 <= numTables) x 16.  |
|   uint16   |   entrySelector |  Log2(maximum power of 2 <= numTables).  |
|   uint16   |   rangeShift    |  NumTables x 16-searchRange.  |

*表记录(table record)：*

|   Type     |   Name          |     Description      |
|   -------  |   --------      |     -----------      |
|   uint32   |   tableTag      |  Table identifier    | 
|   uint32   |   checkSum      |  CheckSum for this table  |
|   uint32   |   offset        |  Offset from beginning of TrueType font file |
|   uint32   |   length        | Length of this table |

对于一个字体文件，无论其字形轮廓是 TrueType 格式还是基于 PostScript 语言的 CFF 格式，其必须包含的表有 `cmap`、`head`、`hhea`、`htmx`、`maxp`、`name`、`OS/2`、`post`。如果其字形轮廓是 TrueType 格式，还有`cvt`、`fpgm`、`glyf`、`loca`、`prep`、`gasp` 六张表会被用到。这六张表除了 `glyf` 和 `loca` 必选外，其它四个为可选表。

#### fontmin 截取字形原理

`fontmin` 内部使用了 `fonteditor-core`，核心的字体处理交给这个依赖完成，`fonteditor-core` 的主要流程如下：

![](https://raw.githubusercontent.com/linzpeng/imgs/master/d.png)

##### 1. 初始化 Reader

将字体文件转为 `ArrayBuffer` 用于后续读取数据。

##### 2. 提取 Table Directory

前文我们说到紧跟在 `offset table(偏移表)` 之后的结构就是 `table record(表记录)`，而多个 `table record` 叫做 `Table Directory`。`fonteditor-core` 会先读取原字体的 `Table Directory`，由上文表记录的结构我们知道，每一个 `table record` 有四个字段，每个字段占4个字节，因此可以很方便的利用 `DataView` 进行读取，最终得到一个字体文件的所有表信息如下：

 ![](https://raw.githubusercontent.com/linzpeng/imgs/master/e.png)

##### 3. 读取表数据

在这一步会根据 `Table Directory` 记录的偏移和长度信息读取表数据。对于精简字体来说，`glyf` 表的内容是最重要的，但是 `glyf` 的 `table record` 仅仅告诉了我们 `glyf` 表的长度以及 `glyf` 表相对于整个字体文件的偏移量，那么我们如何得知 `glyf` 表中字形的数量、位置以及大小信息呢？这需要借助字体中的 `maxp` 表和 `loca(glyphs location)` 表，`maxp` 表的 `numGlyphs` 字段值指定了字形数量，而 `loca` 表记录了字体中所有字形相对于 `glyf` 表的偏移量，它的结构如下：

| Glyph Index | Offset | Glyph Length |
|  ---------- | ------ | ------------ |
|      0      |    0   |     100      |
|      1      |   100  |     150      |
|      2      |   250  |      0       |
|     ...     |   ...  |     ...      |
|     n-1     |   1170 |     120      |
|    extra    |   1290 |      0       |

根据规范，索引`0`指向缺失字符`(missing character)`，也就是字体中找不到某个字符时出现的字符，这个字符通常用空白框或者空格表示，当这个缺失字符不存在轮廓时，根据 `loca` 表的定义可以得到 `loca[n] = loca[n+1]`。我们可以发现上文表格中多出了 `extra` 一项，这是为了计算最后一个字形 `loca[n-1]` 的长度。

 > 上述表格中 Offset 字段值的单位是字节，但是具体的字节数取决于字体 `head` 表的 `indexToLocFormat` 字段取值，当此值为`0`时，Offset 100 等于 200 个字节，当此值为`1`时，Offset 100 等于 100 个字节，这两种不同的情况对应于字体中的 `Short version` 和 `Long version`。

但是仅仅知道所有字形的偏移量还不够，我们没办法认出哪个字形才是我们需要的。假设我需要`字体预览`这四个字形，而字体文件有一万个字形，同时我们通过 `loca` 表得知了所有字形的偏移量，但这一万里面哪四个数据块代表了`字体预览`四个字符呢？因此我们还需要借助 `cmap` 表来确定具体的字形位置，`cmap` 表里记录了字符代码`(unicode)`到字形索引的映射，我们拿到对应的字形索引后，就可以根据索引获得该字形在 `glyf` 表中的偏移量。

![](https://raw.githubusercontent.com/linzpeng/imgs/master/f.png)

 而一个字形的数据结构以 `Glyph Headers` 开头：

|  Type |   Name           |       Description      |
|  ---- | -----------------| ---------------------- |
| int16 | numberOfContours | the number of contours |
| int16 |       xMin       | Minimum x for coordinate data |
| int16 |       yMin       | Maximum y for coordinate data |
| int16 |       xMax       | Minimum x for coordinate data |
| int16 |       yMax       | Maximum x for coordinate data |

`numberOfContours` 字段指定了这个字形的轮廓数量，紧跟在 `Glyph Headers` 后面的数据结构为 `Glyph Table`。

在字体的定义中，轮廓是由一个个位置点构成的，并且每个位置点具有编号，这些编号从`0`开始按升序排列。因此我们读取指定的字形就是读取 `Glyph Headers` 中的各项值以及轮廓的位置点坐标。

在 `Glyph Table` 中，存放了每个轮廓的最后一个位置点编号构成的数组，从这个数组中就可以求得这个字形一共存在几个位置点。例如这个数组的值为`[3, 6, 9, 15]`，可以得知第四个轮廓上最后一个位置点的编号是15，那么这个字形一共有16个位置点，所以我们只需要以`16`为循环次数进行遍历访问 ArrayBuffer 就可以得到每个位置点的坐标信息，从而提取出了我们想要的字形，这也就是 `fontmin` 在截取字形时的原理。

另外，在提取坐标信息时，除了第一个位置点，其他位置点的坐标值并不是绝对值，例如第一个点的坐标为`[100, 100]`，第二个读取到的值为`[200, 200]`，那么该点位置坐标并不是`[200, 200]`，而是基于第一个点的坐标进行增量，因此第二点的实际坐标为`[300, 300]`

> 因为一个字体涉及的表实在太多，并且每个表的数据结构也不一样。这里无法一一列举 `fonteditor-core` 是如何处理每个表的。

##### 4. 关联glyf信息

在使用了 TrueType 轮廓的字体中，每个字形都提供了 `xMin`、`xMax`、`yMin` 和 `yMax` 的值，这四个值也就是下图的`Bounding Box`。除了这四个值，还需要 `advanceWidth` 和 `leftSideBearing` 两个字段，这两个字段并不在 `glyf` 表中，因此在截取字形信息的时候无法获取。在这个步骤，`fonteditor-core` 会读取字体的 `hmtx` 表获取这两个字段。

![](https://raw.githubusercontent.com/linzpeng/imgs/master/g.png)

##### 5. 写入字体
在这一步会重新计算字体文件的大小，并且更新`偏移表(Offset table)`和`表记录(Table record)`有关的值, 然后依次将`偏移表`、`表记录`、`表数据`写入文件中。有一点需要注意的是，在写入`表记录`时，必须按照表名排序进行写入。例如有四张表分别是 `prep`、`hmtx`、`glyf`、`head`、则写入的顺序应为 `glyf -> head -> hmtx -> prep`，而`表数据`没有这个要求。

#### fontmin 不足之处

`fonteditor-core` 在截取字体的过程中只会对前文提到的十四张表进行处理，其余表丢弃。每个字体通常还会包含 `vhea` 和 `vmtx` 两张表，它们用于控制字体在垂直布局时的间距等信息，如果用 `fontmin` 进行字体截取后，会丢失这部分信息，可以在文本垂直显示时看出差异（*右边为截取后*）：

![](https://raw.githubusercontent.com/linzpeng/imgs/master/h.png)

#### fontmin 使用方法

在了解了 `fontmin` 的原理后，我们就可以愉快的使用它啦。服务器接受到客户端发来的请求后，通过 `fontmin` 截取字体，`fontmin` 会返回截取后的字体文件对应的 Buffer，别忘了 `@font-face` 规则中字体路径是支持 `base64` 格式的，因此我们只需要将 Buffer 转为 `base64` 格式嵌入在 `@font-face` 中返回给客户端，然后客户端将该 `@font-face` 以 CSS 形式插入 `<head></head>` 标签中即可。

对于固定的预览内容，我们也可以先生成字体文件保存在 CDN 上，但是这个方式的缺点在于如果 CDN 不稳定就会造成字体加载失败。如果用上面的方法，每一个截取后的字体以 `base64` 字符串形式存在，则可以在服务端做一个缓存，就没有这个问题。利用 `fontmin` 生成字体子集代码如下：

``` javascript
const Fontmin = require('fontmin')
const Promise = require('bluebird')

async function extractFontData (fontPath) {
  const fontmin = new Fontmin()
    .src('./font/senty.ttf')
    .use(Fontmin.glyph({
      text: '字体预览'
    }))
    .use(Fontmin.ttf2woff2())
    .dest('./dist')

  await Promise.promisify(fontmin.run, { context: fontmin })()
}
extractFontData()
```

对于固定预览内容我们可以预先生成好分割后的字体，对于用户输入的动态预览内容，我们当然也可以按照这个流程：

获取输入 -> 截取字形 -> 上传 CDN -> 生成 @font-face -> 插入页面

按照这个流程来客户端需要请求两次才能获取字体资源（别忘了在 `@font-face` 插入页面后才会去真正请求字体），并且`截取字形`和`上传 CDN` 这两步时间消耗也比较长，有没有更好的办法呢？我们知道字形的轮廓是由一系列位置点确定的，因此我们可以获取 `glyf` 表中的位置点坐标，通过 `SVG` 图像将特定字形直接绘制出来。

> `SVG` 是一种强大的图像格式，可以使用 `CSS` 和 `JavaScript` 与它们进行交互，在这里主要应用了 `path` 元素

获取位置信息以及生成 `path` 标签我们可以借助 `opentype.js` 完成，客户端得到输入字形的 `path` 元素后，只需要遍历生成 `SVG ` 标签即可。

### 3. 减小字体文件体积的优势

下面附上字体截取后文件大小和加载速度对比表格。可以看出，相较于全量加载，对字体进行截取后加载速度快了`145` 倍。

> `fontmin` 是支持生成 `woff2` 文件的，但是官方文档并没有更新，最开始我使用的 `woff` 文件，但是 `woff2` 格式文件体积更小并且浏览器支持不错

|        字体名称          |    大小   |  时间   |
|  --------------------    |   ------  |  ----   |
| HanyiSentyWoodcut.ttf    |   48.2MB  |  17.41s | 
| HanyiSentyWoodcut.woff   |   21.7KB  |  0.19s  |
| HanyiSentyWoodcut.woff2  |   12.2KB  |  0.12s  |

## 二、字体加载完成前不展示预览内容

这是在实现预览功能过程中的第二个问题。

在浏览器的字体显示行为中存在`阻塞期`和`交换期`两个概念，以 `Chrome` 为例，在字体加载完成前，会有一段时间显示空白，这段时间被称为`阻塞期`。如果在`阻塞期`内仍然没有加载完成，就会先显示后备字体，进入`交换期`，等待字体加载完成后替换。这就会导致页面字体出现闪烁，与我想要的效果不符。而 `font-display` 属性控制浏览器的这个行为，是否可以更换 `font-display` 属性的取值来达到我们的目的呢？

### font-display

|               |  Block Period   |   Swap Period   |
|  -------      |  ------------   |   -----------   |
|  block      | Short           |     Infinite    |
|  swap      | None            |     Infinite    |
|  fallback  | Extremely Short |     Short       |
|  optional  | Extremely Short |     None        |

字体的显示策略和 `font-display` 的取值有关，浏览器默认的 `font-display` 值为 `auto`，它的行为和取值 `block` 较为接近。

> 第一种策略是 `FOIT(Flash of Invisible Text)`，`FOIT` 是浏览器在加载字体的时候的默认表现形式，其规则如前文所说。

> 第二种策略是 `FOUT(Flash of Unstyled Text)`，`FOUT` 会指示浏览器使用后备字体直至自定义字体加载完成，对应的取值为 `swap`。

两种不同策略的应用：[Google Fonts FOIT](http://fonts.google.com)&emsp;[汉仪字库 FOUT](http://www.hanyi.com.cn/font-list)

在夸克项目中，我希望的效果是字体加载完成前不展示预览内容，`FOIT` 策略最为接近。但是 `FOIT` 文本内容不可见的最长时间大约是`3s`， 如果用户网络状况不太好，那么`3s`过后还是会先显示后备字体，导致页面字体闪烁，因此 `font-display` 属性不满足要求。

查阅资料得知，[CSS Font Loading API](https://drafts.csswg.org/css-font-loading/) 在 `JavaScript` 层面上也提供了解决方案：

### FontFace、FontFaceSet

先看看它们的兼容性：

![](https://raw.githubusercontent.com/linzpeng/imgs/master/i.png)

![](https://raw.githubusercontent.com/linzpeng/imgs/master/j.png)

> 又是 IE，IE 没有用户不用管

我们可以通过 `FontFace` 构造函数构造出一个 `FontFace` 对象：

`const fontFace = new FontFace(family, source, descriptors)`

- *family*
  - 字体名称，指定一个名称作为 `CSS` 属性 `font-family` 的值，

- *source*
  - 字体来源，可以是一个 `url` 或者 `ArrayBuffer`

- *descriptors* `optional`
  - style：`font-style`
  - weight：`font-weight`
  - stretch：`font-stretch`
  - display: `font-display` *（这个值可以设置，但不会生效）*
  - unicodeRange：`@font-face` 规则的 `unicode-ranges`
  - variant：`font-variant`
  - featureSettings：`font-feature-settings`

构造出一个 `fontFace` 后并不会加载字体，必须执行 `fontFace` 的 `load` 方法。`load` 方法返回一个 `promise`，`promise` 的 `resolve` 值就是加载成功后的字体。但是仅仅加载成功还不会使这个字体生效，还需要将返回的 `fontFace` 添加到 `fontFaceSet`。

使用方法如下：

``` javascript
/**
  * @param {string} path 字体文件路径
  */
async function loadFont(path) {
  const fontFaceSet = document.fonts
  const fontFace = await new FontFace('fontFamily', `url('${path}') format('woff2')`).load()
  fontFaceSet.add(fontFace)
}
```

因此，在客户端我们可以先设置文字内容的 CSS 为 `opacity: 0`，
等待 `await loadFont(path)` 执行完毕后，再将 CSS 设置为 `opacity: 1`, 这样就可以控制在自定义字体加载未完成前不显示内容。

## 最后总结

本文介绍了在开发字体预览功能时遇到的问题和解决方案，限于 `OpenType` 规范条目很多，在介绍 `fontmin` 原理部分，仅描述了对 `glyf` 表的处理，对此感兴趣的读者可进一步学习。

本次工作的回顾和总结过程中，也在思考更好的实现，如果你有建议欢迎和我交流。同时文章的内容是我个人的理解，存在错误难以避免，如果发现错误欢迎指正。


感谢阅读！

## 参考

* [前端字体截取](https://juejin.im/post/5c1783216fb9a049b07d4330)
* [Scalable Vector Graphics](https://developer.mozilla.org/en-US/docs/Web/SVG)
* [FontFace](https://developer.mozilla.org/zh-CN/docs/Web/API/FontFace)
* [FontFaceSet](https://developer.mozilla.org/zh-CN/docs/Web/API/FontFaceSet)
* [fontmin](https://github.com/ecomfe/fontmin)
* [fonteditor-core](https://github.com/kekee000/fonteditor-core)
* [TrueType-Reference-Manual](https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6maxp.html)
* [OpenType-Font-File](https://docs.microsoft.com/en-us/typography/opentype/spec/otff)