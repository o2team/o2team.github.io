title: 向强大的SVG迈进
subtitle: “强大如SVG，走遍千里，海阔天空，过来瞧一瞧看一看啦，大甩卖啦！”
cover: http://img20.360buyimg.com/aotucms/jfs/t1/115112/29/10318/58090/5ee87c4cE618547e0/3dbaa17ba41b6281.jpg
ckey: 2020-06-09-strong-svg
categories: Web开发 移动开发
tags:
  - svg
  - foreignObject
  - iconfont
  - viewport
  - viewBox
  - preserveAspectRatio
  - URL编码
  - 百分号编码
author:
  nick: 暖暖
  github_name: Newcandy
date: 2020-06-09 14:00:00
wechat:
    share_cover: http://img20.360buyimg.com/aotucms/jfs/t1/115112/29/10318/58090/5ee87c4cE618547e0/3dbaa17ba41b6281.jpg
    share_title: 向强大的SVG迈进
    share_desc: “强大如SVG，走遍千里，海阔天空，过来瞧一瞧看一看啦，大甩卖啦！”
   
---

<!-- more -->

> SVG 即 Scalable Vector Graphics 可缩放矢量图形，使用XML格式定义图形。

## 一、SVG印象

SVG 的应用十分广泛，得益于 SVG 强大的各种特性。

#### 1.1、 矢量

可利用 SVG 矢量的特点，描出深圳地铁的轮廓：
![深圳地铁](https://img30.360buyimg.com/aotucms/jfs/t1/123459/10/4455/318920/5edd97c0Edbd5b5b3/66937ca47fc1afe3.png)

#### 1.2、iconfont

SVG 可依据一定的规则，转成 iconfont 使用：
![截图来自iconfont.cn](https://img13.360buyimg.com/aotucms/jfs/t1/125246/5/4320/95836/5edd9902E20137d44/6ecd5b02e93c929c.png)

#### 1.3、 foreignObject

利用 SVG 的 `foreignObject` 标签实现截图功能，原理：`foreignObject` 内部嵌入 HTML 元素：

```
<svg xmlns="http://www.w3.org/2000/svg">
	<foreignObject width="120" height="60">
		<p style="font-size:20px;margin:0;">凹凸实验室 欢迎您</p>
	</foreignObject>
</svg>
```

截图实现流程：
1. 首先声明一个基础的 svg 模版，这个模版需要一些基础的描述信息，最重要的，它要有 `<foreignObject></foreignObject> ` 这对标签；
2. 将要渲染的 DOM 模版模版嵌入 `foreignObject` 即可；
3. 利用 `Blob` 构建 svg 对象；
4. 利用 `URL.createObjectURL(svg)` 取出 URL。

#### 1.4、SVG SMIL

由于微信编辑器不允许嵌入 `<style><script><a>` 标签，利用SVG SMIL 可进行微信公众号极具创意的图文排版设计，包括动画与交互。
但是也要注意，标签里不允许有id，否则会被过滤或替换掉。

点击 "凹凸实验室" 后，围绕 "凹凸实验室" 中心旋转 360度，点击0.5秒后 出现 https://aotu.io/ ，动画只运行一次。

下图为 GIF循环演示：

![SVG SMIL](https://img13.360buyimg.com/aotucms/jfs/t1/128190/34/5097/62748/5ee9863fE0a48bd0f/ee15c0c4e78154b3.gif)

代码如下：
```html
<svg width="360" height="300" xmlns="http://www.w3.org/2000/svg">
    <g>
        <!-- 点击后 运行transform旋转动画，restart="never"表示只运行一次 -->
        <animateTransform attributeName="transform" type="rotate" begin="click" dur="0.5s" from="0 100 80" to="360 100 80"  fill="freeze" restart="never" />
        <g>
            <text font-family="microsoft yahei" font-size="20" x="50" y="80">
                凹凸实验室
            </text>
        </g>
        <g style="opacity: 0;">
            <!-- 同一个初始位置以及大致的宽高，触发点击事件 -->
            <text font-family="microsoft yahei" font-size="20" x="50" y="80">https://aotu.io/</text>
            <!-- 点击后 运行transform移动动画，改变文本的位置 -->
            <animateTransform attributeName="transform" type="translate" begin="click" dur="0.1s" to="0 40"  fill="freeze" restart="never" />
            <!-- 点击0.5秒后 运行opacity显示动画 -->
            <animate attributeName="opacity" begin="click+0.5s" from="0" to="1" dur="0.5s" fill="freeze" restart="never" />
        </g>
    </g>
</svg>
```

以上是鄙人对SVG的大致印象，最近的需求开发再次刷新了我的认知，那就是 SVG实现非比例缩放 以及 小程序不支持SVG标签的处理，下面容我来讲述一番。

## 二、SVG 实现非比例缩放

我们熟知的 iconfont，可通过改变字体大小缩放，但是这是 比例缩放，那如何实现 SVG 的非比例缩放呢？
如下图所示，如何将 一只兔子 非比例缩放？

![兔子非比例缩放](https://img13.360buyimg.com/aotucms/jfs/t1/148917/37/231/39312/5edf0573E98170a53/81b67b2caea3b7f3.png)

**划重点：实现非比例缩放主要涉及三个知识点：viewport、viewBox和preserveAspectRatio，viewport 与viewBox 结合可实现缩放的功能，viewBox 与 preserveAspectRatio 结合可实现非比例的功能。**

#### 2.1、viewport 
`viewport` 表示SVG可见区域的大小。
`viewport` 就像是我们的显示器屏幕大小，超出区域则隐藏，原点位于左上角，x 轴水平向右，y 轴垂直向下。

![viewport](http://img10.360buyimg.com/aotucms/jfs/t1/136508/7/1800/40826/5edf266bE89986311/99a12bd15aa88d41.png)

通过类似CSS的属性 `width`、`height` 指定视图大小：

```html
<svg width="400" height="200"></svg>
```
	
#### 2.2、viewBox

viewBox值有4个数字：x, y, width, height 。
其中 x：左上角横坐标，y：左上角纵坐标，width：宽度，height：高度。
原点默认位于左上角，x 轴水平向右，y 轴垂直向下。

```html
<svg width="400" height="200" viewBox="0 0 200 100"></svg>
```

显示器屏幕的画面，可以特写，可以全景，这就是 `viewBox`。
`viewBox` 可以想象成截屏工具选中的那个框框，和 `viewport` 作用的结果就是 把框框中的截屏内容再次在 显示器 中全屏显示。

![理解 viewport 与 viewbox](https://img20.360buyimg.com/aotucms/jfs/t1/128901/30/4507/95464/5edee81aEcf9d62db/5c23892e2b8a8750.jpg)
（图片来源：[SVG 研究之路 (23) - 理解 viewport 與 viewbox](https://www.oxxostudio.tw/articles/201409/svg-23-viewpoint-viewBox.html)）

#### 2.3、preserveAspectRatio

上图的红色框框和蓝色框框，恰好和显示器的比例相同，如果是下图的绿色框框，怎样在显示器屏幕中显示呢？
![如何非比例缩放](https://img10.360buyimg.com/aotucms/jfs/t1/124173/35/4413/306463/5edeeaabE44e34aee/cce4d92deaa82205.png)

##### 2.3.1、 定义
`preserveAspectRatio` 作用的对象是 `viewBox`，使用方法如下：
```
preserveAspectRatio="[defer] <align> [<meetOrSlice>]"
// 例如 preserveAspectRatio="xMidYMid meet"
```

其中 defer 此时不是重点，暂且忽略，主要了解 `align` 和 `meetOrSlice` 的 用法：

* `align`：由两个名词组成，分别代表 viewbox 与 viewport 的 x 方向、y方向的对齐方式。

| 值	| 含义 |
|-------|-------|
| `xMin`	|  viewport 和 viewBox 左边对齐 |
| `xMid`	|  viewport 和 viewBox x轴中心对齐 |
| `xMax`	|  viewport 和 viewBox 右边对齐 |
| `YMin`	|  viewport 和 viewBox 上边缘对齐。注意Y是大写。 |
| `YMid`	|  viewport 和 viewBox y轴中心点对齐。注意Y是大写。 |
| `YMax`	|  viewport 和 viewBox 下边缘对齐。注意Y是大写。 |

* `meetOrSlice`：表示如何维持高宽的比例，有三个值 meet、slice、none。
	* `meet` - 默认值，保持纵横比缩放 viewBox 适应 viewport，可能会有余留的空白。
	* `slice` - 保持纵横比同时比例小的方向放大填满 viewport，超出的部分被剪裁掉。
	* `none` - 扭曲纵横比以充分适应 viewport。

##### 2.3.2、 例子

例子1：`preserveAspectRatio="xMidYMid meet" ` 表示 绿色框框 与 显示器的 x 方向、y方向的 中心点 对齐；
![xMidYMin slice](https://img30.360buyimg.com/aotucms/jfs/t1/144844/4/250/122629/5edeee26Ecaf3f9e2/563e5a1b6e4558e9.png)

例子2：`preserveAspectRatio="xMidYMin slice"` 表示 绿色框框 与 显示器的 x 方向 中心点 对齐，Y 方向 上边缘对齐，保持比例放大填满 显示屏 后超出部分隐藏；
![例子2](https://img11.360buyimg.com/aotucms/jfs/t1/135757/3/1754/221618/5edef0b3E2c314ea6/6903392e13c1b09e.png)

例子3：`preserveAspectRatio="xMidYMid slice"` 表示 绿色框框 与 显示器的 x 方向、y方向的 中心点 对齐，保持比例放大填满显示屏 后超出部分隐藏；

![例子3](https://img11.360buyimg.com/aotucms/jfs/t1/113914/35/9595/221796/5edef024Ec0d99219/e4c1798de6668b20.png)

例子4：`preserveAspectRatio="none"` 不管三七二十一，随意缩放绿色框框，填满 显示屏即可；这就是非比例缩放的答案了。

![例子4](https://img11.360buyimg.com/aotucms/jfs/t1/137386/13/1850/158455/5edef14dEddc2c2cc/a422f4c2615fd20c.png)


## 三、小程序不支持svg标签怎么办

微信小程序官方不支持 SVG 标签的，但是决定曲线救国，相当于自己实现了一个SVG标签：使用小程序内置的 `Canvas` 渲染器， 在 `Cax` 中实现 `SVG` 标准的子集，使用 `JSX` 或者 `HTM（Hyperscript Tagged Markup）` 描述 `SVG` 结构行为表现。
![今天，小程序正式支持 SVG](https://img13.360buyimg.com/aotucms/jfs/t1/122876/5/4427/27028/5edef2a3E384682c0/5ea522ad8317fa02.png)

但是今天我想讲讲其他的。
我们知道，小程序虽然不支持 SVG 标签，但是支持 svg 转成 base64 后作为 `background-image` 的 `url`，如 `background-image: url("data:image/svg+xml.......)` 。

但是我这边还有个需求，随时更改 SVG 每个路径的颜色，即 颜色可配置：
![随时更改 SVG 每个路径的颜色](https://img10.360buyimg.com/aotucms/jfs/t1/115005/28/9686/226306/5edef501E42d87ffe/5a462a211ecf8ea0.png)

来回转 Base64 肯定是比较麻烦的，有没有更好的方式呢？
**直接贴答案：对于SVG图形，还有更好的实现方式，就是直接使用SVG XML格式代码，无需进行base64转换。**

#### 3.1、URL 编码

直接使用 SVG XML 格式代码，首先要了解 `Data URI`的格式。
**划重点：base64非必选项，不指定的时候，后面的 `<data>` 将使用 URL编码。**
![](https://img30.360buyimg.com/aotucms/jfs/t1/137211/36/1825/52183/5edef616E99a0eb6e/643cbb12852b7e47.png)

##### 3.1.1、入门

> 百分号编码(Percent-encoding), 也称作URL编码(URL encoding)，是特定上下文的统一资源定位符 (URL)的编码机制。

原理：ASCII 字符 = % + 两位 ASCII 码（十六进制）。
例如，字符 a 对应的 ASCII 码为 0x61，那么 URL 编码后得到 %61 。

##### 3.1.2、URL 编码压缩

前言：

`Data URI` 的格式中的 `<data>` 完全使用URL 编码也是可以的，如 `encodeURIComponent('<svg version="1.1" viewBox= …</svg>')`。
但是和转义前原始SVG相比，可读性差了很多，而且占用体积也变大了。
如果深入了解URL 编码的话，`<data>`  没必要全部编码的。

正文：

> RFC3986文档规定，URL中只允许包含 未保留字符 以及 所有保留字符。

* 未保留字符：包含英文字母（a-zA-Z）、数字（0-9）、-_.~ 4个特殊字符。对于未保留字符，不需要百分号编码。
* 保留字符：具有特殊含义的字符 `:/?#[]@` (分隔Url的协议、主机、路径等组件) 和 `!$&'()*+,;=` （用于在每个组件中起到分隔作用的，如&符号用于分隔查询多个键值对）。
* 受限字符或不安全字符：直接放在Url中的时候，可能会引起解析程序的歧义，因此这部分需要百分号编码，如`%`、`空格`、`双引号"`、`尖号 <>`等等。

综上所述，只需要对 受限字符或不安全字符 进行编码即可。

* JS 处理比较简单，利用 replace 将 需要编码的字符 替换掉 即可，基本替换 以下的符号 就够用了：

```
svgToUrl (svgData) {
    encoded = encoded
      .replace(/<!--(.*)-->/g, '') // 亲测必须去掉注释
      .replace(/[\r\n]/g, ' ') // 亲测最好去掉换行
      .replace(/"/g, `'`) // 单引号是保留字符，双引号改成单引号减少编码
      .replace(/%/g, '%25')
      .replace(/&/g, '%26')
      .replace(/#/g, '%23')
      .replace(/{/g, '%7B')
      .replace(/}/g, '%7D')
      .replace(/</g, '%3C')
      .replace(/>/g, '%3E')
    return `data:image/svg+xml,${encoded}`
  }
```

* 如果使用在 CSS 中，可利用 SASS版本3.3以上 的 三个API 对 SVG字符串做替换处理。

	1. `str_insert(string, insert, index)`： 从 `$string` 第 `$index` 插入字符 `$insert`；
	2. `str_index(string, substring)`:  返回 `$substring` 在 `$string` 中第一个位置；
	3. `str_slice(string, start_at, end_at = nil)`:  返回从字符 `$string` 中第 `$start_at` 开始到 `$end_at` 结束的一个新字符串。
	
	前人已有总结，可前往 `https://github.com/leeenx/sass-svg/blob/master/sass-encodeuri.scss` 查看完整代码。

#### 3.2、SVG 压缩

![SVGO](https://img10.360buyimg.com/aotucms/jfs/t1/117322/1/9804/99241/5edefd7bE190a83a8/95d679fc4af312e9.png)

一般从 Sketch 导出 SVG ，冗余代码比较多，有条件的话建议使用 [SVGO](https://github.com/svg/svgo) 压缩SVG的原本体积，比如清除换行、重复空格；删除文档声明；删除注释；删除desc描述等等。


## 四、总结

**SVG强大的地方在于，出其不意，炫酷，与众不同。**

无论是微信公众号花式排版，foreignObject 标签实现截图，实现非比例缩放，或者 背景图直接使用 SVG XML 格式代码，还是上文没有提及的路径动画、描边动画、图形裁剪、滤镜等等，都可以玩出新的花样。

SVG 一个属性可成就一篇文章，学习 SVG 可以说是在挑战自己，欢迎加入 SVG 的学习队列。


## 五、参考内容 · 推荐阅读

[三看 SVG Web 动效](https://aotu.io/notes/2016/11/22/SVG_Web_Animation/)
[URL编码的奥秘](https://aotu.io/notes/2017/06/15/The-mystery-of-URL-encoding/)
[学习了，CSS中内联SVG图片有比Base64更好的形式](https://www.zhangxinxu.com/wordpress/2018/08/css-svg-background-image-base64-encode/)
[超级强大的SVG SMIL animation动画详解](https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)
[详细教你微信公众号正文页SVG交互开发](https://www.jianshu.com/p/8c2e4fc26e8a)
[SVG <foreignObject>简介与截图等应用](https://www.zhangxinxu.com/wordpress/2017/08/svg-foreignobject/)