title: SVG 交互图文教学（基础实战篇）
subtitle: 最近很多公众号开始流行在公众号正文中嵌入了 svg 交互动画，而不是在末尾/图文中添加二维码引导用户跳去 h5 网页上。那么到底是如何实现的？其实又有什么难点和坑需要攻克和避开？我们一起来学习下 svg 图文的制作思路。
cover: https://img30.360buyimg.com/ling/jfs/t1/196742/12/21298/93662/61301f28Ed9d64b77/68f9eab8b8aa1e0b.jpg
category: 经验分享  
tags:

- typescript
- 依赖注入  
  author:  
   nick: Azu
  date: 2021-09-09 12:00:00  
  wechat:
  share_cover: https://img30.360buyimg.com/ling/jfs/t1/196742/12/21298/93662/61301f28Ed9d64b77/68f9eab8b8aa1e0b.jpg
  share_title: SVG 交互图文教学（基础实战篇）
  share_desc: 最近很多公众号开始流行在公众号正文中嵌入了 svg 交互动画，而不是在末尾/图文中添加二维码引导用户跳去 h5 网页上。那么到底是如何实现的？其实又有什么难点和坑需要攻克和避开？我们一起来学习下 svg 图文的制作思路。

---

## 前沿

![http://storage.360buyimg.com/azfff/markdown/v1/1.gif](http://storage.360buyimg.com/azfff/markdown/v1/1.gif)

最近很多公众号开始流行在公众号正文中嵌入了 svg 交互动画，而不是在末尾/图文中添加二维码引导用户跳去 h5 网页上。那么到底是如何实现的？其实又有什么难点和坑需要攻克和避开？我们一起来学习下 svg 图文的制作思路。先来个经典三问：是什么？为什么？怎么办？

### SVG 是什么？

SVG 是什么？SVG 是一种图像文件格式，它的英文全称为 Scalable Vector Graphics，意思为可缩放的矢量图形。用户可以直接用代码来描绘图像，可以用任何文字处理工具打开 SVG 图像，通过改变部分代码来使图像具有交互功能。这种动画交互方式可以脱离 javascript 脚本，**因此才能通过编译 dom 结构的方式嵌入到公众号里面去。**

### 为什么用 svg 不用 h5？

这时候肯定很多人有疑惑：明明同样是移动端的动画交互，h5 动画可以实现更为复杂酷炫的动画和交互，为什么要使用 svg 图文动画替代 h5？

1.  **灵活自由**：svg 图可以潜入到公众号的图文里，可以在推文里的任意位置插入，可以在原有的图文基础上增加文章的阅读交互体验。
2.  **推文跳失率高**：从推文到 h5 需要跳转，用户需要二次点击才能直达 h5，甚至很多用户无法第一时间留意到 h5 跳转的位置，会造成用户流失。
3.  **上线成本高**：一个 h5 的网页需要把 h5 代码挂载到一个服务器，还需要一定时间的开发周期及兼容测试等。有些中小企公司缺少服务器的情况下，还需要搞台服务器或者平台来挂载 h5 服务（还没算域名带宽等等巴拉巴拉的），比较耗费人工成本和资源成本。

### 怎么把 svg 运用到图文推送上？

如果你对 svg 技术有所了解，你就可以自定义的去实现你想要的一些动画交互方式。在公众号的图文编辑页 按下熟悉的 option+command+j / F12 打开开发者工具，在编辑素材页面，Edit as HTML，操作你想要替换的 dom，最后保存，一篇含有炫酷动效的公众号文章就诞生啦。

### svg 图文有什么缺点？

说了这么多的优点，当然 svg 图文交互在实现起来还是有部分缺点和深坑。主要涉及以下几个主要缺点：

1.  **开发难度相比 h5 要高很多**：同样的一个动画实现，h5 只需要几行 javascript 代码即可随意操作，而 svg 图文需要很多“曲线救国”的方法，在 svg 图文交互的制作上，需要结合不同思路取巧。
2.  **受限平台的规则**：部分功能样式需要针对不同平台的特性进行适配微调。

对于上述的问题，后面会有作者踩坑的血泪史详细介绍。😢😢

## 正文教学

### 前置知识

以下会用到几个常用 svg 标签如 <svg>、<g>、<animate>、<animateTransform>等
建议如果对 svg 不了解的可以先移步补补知识
[svg 参考手册](https://www.runoob.com/svg/svg-reference.html)
[超级强大的 SVG SMIL animation 动画详解](https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)

### 简单案例

#### 构建 svg

我们先构建一个 svg 的基本结构

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; width: 100%; background: #061534" viewBox="0 0 345 600">

</svg>
```

主要说下 viewBox 属性：

`viewBox="x, y, width, height"`

viewBox 的四个参数分别代表：x（最小 X 轴数值）；y（最小 y 轴数值）；width（宽度）；height（高度）

> x、y 其实设置的是 svg 内部元素的整体位移，相当于 svg 视窗的裁剪起始点，除非要对 svg 内元素进行整体位移，否则一般都是 0 0。

> width、height 表示的是 svg 内的分辨率，它的单位并不是 px、也不是 css 单位。所以它并不是 svg 的实际宽高。width、height 越大，那么分辨率就越高，里面元素就显得越小。为了计算方便，一般来说 width、height 的尺寸等同于实际设计稿的尺寸。

#### 给 svg 添加内容

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; width: 100%; background: #061534" viewBox="0 0 345 600">
  <g>
    <text
      x="100"
      y="240"
      fill="#fff"
      style="width: 100%; font-size: 30px; text-align: center"
    >
      点我就消失
    </text>
  </g>
</svg>
```

这里使用了一个`<text>`标签简单得填充了一个点击内容的区域，目前效果图如下

![http://storage.360buyimg.com/azfff/markdown/v1/WechatIMG54.png](http://storage.360buyimg.com/azfff/markdown/v1/WechatIMG54.png)

#### 元素消失

我们要实现的是通过“一次点击”，然后使得文字元素消失。这里我们可以通过 svg 的`<animate>` 标签实现 click 触发动画

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; width: 100%; background: #061534" viewBox="0 0 345 600">
  <g opacity="1" >
    <text
      x="100"
      y="240"
      fill="#fff"
      style="width: 100%; font-size: 30px; text-align: center"
    >
      点我就消失
    </text>
    <animate
      attributeName="opacity"
      begin="click"
      dur="0.6s"
      to="0"
      fill="freeze"
      restart="never"
    ></animate>
  </g>
</svg>
```

关键属性讲解：

| 属性          | 说明                                                                                                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| attributeName | 目标属性名称，可以是 height、width、opacity 等等 css 属性                                                                                                                                                                                                |
| begin         | 这里一般可以是 click，也可以是 touchmove 等，“click”代表点击后触发，如需延迟可以设置为“click+Xs”，X 为秒，如 click="click+5s"表示点击后 5s 触发动画                                                                                                      |
| dur           | 表示动画过渡市场                                                                                                                                                                                                                                         |
| to            | 表示动画过渡的目标值                                                                                                                                                                                                                                     |
| restart       | 此属性用来规定元素开始动画之后，是否可以被重新开始执行;具有三个属性值: `always`：动画可以在任何时候被重置。这是默认值。`whenNotActive`：只有在动画没有被激活的时候才能被重置，例如在动画结束之后。`never`：在整个 SVG 执行的过程中，元素动画不能被重置。 |

![http://storage.360buyimg.com/azfff/markdown/v1/2.gif](http://storage.360buyimg.com/azfff/markdown/v1/2.gif)

#### 元素位移

除了`<animate>`之外，元素位移和缩放可以通过另外一个标签`<animateTransform>`进行操作

```
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" style="display: inline-block; width: 100%; background: #061534" viewBox="0 0 345 600">
  <g opacity="1" >
    <text
      x="100"
      y="240"
      fill="#fff"
      style="width: 100%; font-size: 30px; text-align: center"
    >
      点我进行位移
    </text>
    <animateTransform
      attributeName="transform"
      type="translate"
      dur="0.6s"
      to="0 100"
      begin="click"
      dur="1s"
      fill="freeze"
      restart="never"
    ></animateTransform>
  </g>
</svg>
```

除了刚刚`<animate>`讲到的关键属性外，`<animateTransfrom>`多了一个`type`值用于控制转换类型

| 属性 | 说明                                                                                |
| ---- | ----------------------------------------------------------------------------------- |
| type | 类型的转换其值是随时间变化。可以是 'translate', 'scale', 'rotate', 'skewX', 'skewY' |

![http://storage.360buyimg.com/azfff/markdown/v1/2.gif](http://storage.360buyimg.com/azfff/markdown/v1/3.gif)

### 实战 demo

![http://storage.360buyimg.com/azfff/markdown/v1/7.gif](http://storage.360buyimg.com/azfff/markdown/v1/7.gif)

简单的过了一些 svg 的交互行为方法后，我们来一个现在常见的 svg 图文交互案例

#### 1. 准备基本框架

我们对这个 demo 进行一个简单的交互分析

1、一开始仅展示首屏封面
2、点击后收起并展示文章详情

```
<section style="overflow: hidden">
  <section name="article" style="height: 0">
    <!-- 隐藏的文章页 -->
  </section>
  <section name"cover">
    <!-- 封面页 -->
  </section>
</section>
```

首先我们对这个案例进行一些结构的拆解，把**首屏**及**详情页**进行分离，这里用了 2 个`<section>`进行区分。

文章页的 `height: 0` 配合上 父级的 `overflow: hidden`，起到一个隐藏文章的作用，**这时候图文的高度就全由封面页的高去控制了**

#### 2. 开始制作

我们先随便网上搞一个静态的小火箭 svg 复制下来，并放在一个 345\*500 的一个容器内。

```
<section style="overflow: hidden">
  <section style="height: 0">
    <!-- 隐藏的文章页 -->
  </section>
  <section name="封面">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="
        display: inline-block;
        vertical-align: top;
        width: 100%;
        background: #6a90e1;
      "
      viewBox="0 0 345 500"
      preserveAspectRatio="xMidYMin meet"
    >
      <g>
        <foreignObject x="0" y="0" width="345" height="500">
          ...小火箭的svg代码
        </foreignObject>
      </g>
    </svg>
  </section>
</section>
```

![http://storage.360buyimg.com/azfff/markdown/v1/4.png](http://storage.360buyimg.com/azfff/markdown/v1/4.png)

2. 结合刚刚学到的`<animateTransform>` 我们给小火箭添加一个简单的漂浮动画

```
...
  <section name="封面">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="
        display: inline-block;
        vertical-align: top;
        width: 100%;
        background: #6a90e1;
      "
      viewBox="0 0 345 500"
      preserveAspectRatio="xMidYMin meet"
    >
      <g>
        <g>
          <foreignObject x="0" y="0" width="345" height="500">
            ...小火箭的svg代码
          </foreignObject>
        </g>
        <!-- 添加上下漂浮的循环动画 -->
        <animateTransform
          attributeName="transform"
          type="translate"
          begin="0s"
          dur="1s"
          values="0 30;0;0 30"
          repeatCount="indefinite"
        ></animateTransform>
      </g>
    </svg>
  </section>
...
```

![http://storage.360buyimg.com/azfff/markdown/v1/5.gif](http://storage.360buyimg.com/azfff/markdown/v1/5.gif)

3. 为小火箭添加一个起飞的动作，这时候我们就需要使用到`<animateTransform>`标签下的`begin=”click“`的点击操作了。我们设定点击小火箭后，立刻在 0.6s 内往下平移 100 的距离

```
...
  <section name="封面">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="
        display: inline-block;
        vertical-align: top;
        width: 100%;
        background: #6a90e1;
      "
      viewBox="0 0 345 500"
      preserveAspectRatio="xMidYMin meet"
    >
      <g>
        <g>
          <foreignObject x="0" y="0" width="345" height="500">
            ...小火箭的svg代码
          </foreignObject>
          <!-- 点击小火箭后，将会在0.6s内往下平移100的距离 -->
          <animateTransform
            attributeName="transform"
            type="translate"
            dur="0.6s"
            to="0 100"
            begin="click"
            dur="2s"
            fill="freeze"
            restart="never"
          ></animateTransform>
        </g>
        <!-- 添加上下漂浮的循环动画 -->
        <animateTransform
          attributeName="transform"
          type="translate"
          begin="0s"
          dur="1s"
          values="0 30;0;0 30"
          repeatCount="indefinite"
        ></animateTransform>
      </g>
    </svg>
  </section>
...
```

![http://storage.360buyimg.com/azfff/markdown/v1/6.gif](http://storage.360buyimg.com/azfff/markdown/v1/6.gif)

4. 小火箭起飞，过渡到文章页

```
...
  <section name="封面">
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style="
        display: inline-block;
        vertical-align: top;
        width: 100%;
        background: #6a90e1;
      "
      viewBox="0 0 345 500"
      preserveAspectRatio="xMidYMin meet"
    >
      <g>
        <g>
          <foreignObject x="0" y="0" width="345" height="500">
            ...小火箭的svg代码
          </foreignObject>
          <!-- 点击小火箭后，将会在0.6s内往下平移100的距离 -->
          <animateTransform ... />
        </g>
        <!-- 添加上下漂浮的循环动画 -->
        <animateTransform .../>
        <!-- 点击2s后，页面先从500收起到0，再从0展开到3000 -->
        <animate
          attributeName="height"
          calcMode="spline"
          keySplines="0.42 0 0.58 1.0;0.42 0 0.58 1.0"
          values="500; 0; 3000"
          dur="5s"
          begin="click+2s"
          keyTimes="0;0.2;1"
          fill="freeze"
          restart="never"
        ></animate>
        <!-- 当封面收起后，把封面宽度设为0，防止遮挡文章页 -->
        <animate
          attributeName="width"
          begin="click+3s"
          dur="0.000001s"
          to="0"
          fill="freeze"
          restart="never"
        ></animate>
      </g>
    </svg>
  </section>
...
```

这里着重讲一下新加上去的 2 个`<animate>`

**1. 页面收起展开的功能：** 这里`<animate>`的`attributeName`设成了`height`,并再点击后，从本来的封面高度`500`在动画执行链路（0 ～ 1）的`0.2`时刻过渡到`0`，从而实现封面收起的效果，由于上面【1.准备基本框架】提到的“**图文的高度就全由封面页的高去控制**”这个原因，整个图文都会收起。在剩下的动画链路`0.2~1`的过程，在把封面的高度从 0 展开到 3000，这时候整个区域就会撑大到`3000`

```
<!-- 点击2s后，页面先从500收起到0，再从0展开到3000 -->
<animate
  attributeName="height"
  calcMode="spline"
  keySplines="0.42 0 0.58 1.0;0.42 0 0.58 1.0"
  values="500; 0; 3000"
  dur="5s"
  begin="click+2s"
  keyTimes="0;0.2;1"
  fill="freeze"
  restart="never"
></animate>
```

**2. 封面隐蔽功能：** 这里`<animate>`的`attributeName`设成了`width`,并再点击后，在 svg 收起的瞬间，我们在**极短**的时间内把封面的宽度设置成`0`把封面“**隐藏**”起来，而由于节点的高度还在，所以页面还是会继续把高度撑开。这时候，**原本被封面页遮挡的文章详情页就可以露出来了**
这里会有人提问，为什么不用`opacity`来隐藏？因为如果仅仅把透明度变成 0，原来的封面仍然在那个位置，会对遮挡到文章内容页的**点击事件**。

```
<!-- 当封面收起后，把封面宽度设为0，防止遮挡文章页 -->
<animate
  attributeName="width"
  begin="click+3s"
  dur="0.000001s"
  to="0"
  fill="freeze"
  restart="never"
></animate>
```

到这里，终于大功告成了！！！直接上效果图！！！

![http://storage.360buyimg.com/azfff/markdown/v1/7.gif](http://storage.360buyimg.com/azfff/markdown/v1/7.gif)

等等？？

不会吧？
不会真的有人以为要结束了吧？

最重要的一步，把做好的 svg 图文放公众号！！不然这么辛苦搞个 svg 还不如不用 js 写。。。？？

#### 3. 嵌入到公众号

如果代码中使用到了图片，那么图片必须上传至微信后台，获取线上地址，如果使用别的域或者上传到别的公众号的图片是无法使用的哦。
步骤：
1、进入微信公众平台，点击左边的素材管理->图片->上传:
2、上传成功后，打开图片，获取图片的线上地址：

![http://storage.360buyimg.com/azfff/markdown/v1/9.png](http://storage.360buyimg.com/azfff/markdown/v1/9.png)

下一步就是新建图文消息，先输入好标题、作者，上传好封面图。。

打开 chrome 调试工具，直接定位到编辑器的 body

![http://storage.360buyimg.com/azfff/markdown/v1/10.jpg](https://img13.360buyimg.com/imagetools/jfs/t1/59895/18/16603/316669/61397c7eE346bc194/9d309d17b9f61e5c.jpg)

把代码粘贴到`<body>`节点里

这时候！！！点击 预览！！！！

搞掂！！

![http://storage.360buyimg.com/azfff/markdown/v1/8.gif](http://storage.360buyimg.com/azfff/markdown/v1/8.gif)

#### 4. 注意事项

微信编辑器有很多内置的规则，会对编辑器的内容进行一些过滤，我们嵌入的代码需要对此进行一些兼容和处理防止被莫名其妙的“优化”了
比较重要和容易踩坑的规则有：
1、不能使用`<script>`、`<style>`标签。
2、标签里的 background 的 url()里，地址不能加引号，单引号双引号都不行，否则会被微信编辑器过滤掉
3、使用`<img>`标签需要把`filter`属性强行去掉:`filter:none !important;`，否则暗黑模式会自动给你添加暗黑滤镜
4、标签里不能有 id

后面有新的发现，会在第二期继续补充！！！

## 参考文献

[1] [微信公众号 svg 图文排版该怎么做？](https://www.zhihu.com/question/324071464)

[2] [详细教你微信公众号正文页 SVG 交互开发](https://zhuanlan.zhihu.com/p/75023148)

[3] [svg 参考手册](https://www.runoob.com/svg/svg-reference.html)

[4] [超级强大的 SVG SMIL animation 动画详解](https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)
