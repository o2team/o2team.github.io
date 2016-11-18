title: 深入了解font-weight
subtitle: font-weight的各个属性值有什么区别？浏览器如何渲染字重？
date: 2016-11-08 16:34:58
cover: //misc.aotu.io/Tingglelaoo/CSS3_fontWeight_900x500.jpg
categories: "Web开发"
tags:
- font-weight
- css3
author:
    nick: Tingglelaoo
    github_name: Tingglelaoo
wechat:
    share_cover: https://misc.aotu.io/Tingglelaoo/CSS3_fontWeight_200x200.jpg
    share_title: 深入了解font-weight

---

## 问题提出

font-weight的属性值有100、200、300、400、500、600、700、800、900和normal、bold、lighter、bolder，它们的区别是？
另外，在实际开发中，我们应该使用数值表达还是文字表达呢？

## 认识font-weight

根据[W3C Fonts节章的规范标准](https://www.w3.org/html/ig/zh/wiki/CSS3%E5%AD%97%E4%BD%93%E6%A8%A1%E5%9D%97#.E5.AD.97.E4.BD.93.E7.B2.97.E7.BB.86.EF.BC.9A.E2.80.98font-weight.E2.80.99.E5.B1.9E.E6.80.A7)，可知：

![w3c_fontWeight.jpg](//misc.aotu.io/Tingglelaoo/w3c_fontWeight.jpg)

font-weight可取值：100～900和normal、bold、bolder、lighter。

### 100～900、normal、bold

如果字体使用九阶有序数值100～900来划分其字重(字体的粗细度)，那么样式指定的font-weight属性值与字体的字重则一一对应。并且normal等价于400，bold等价于700。
但实际上，我们一般遇到的字体很多时候都是使用一些通用的词描述划分其字重，如下所示。

常见的字重数值**大致对应**的字重描述词语：
- 100 - Thin
- 200 - Extra Light (Ultra Light)
- 300 - Light
- 400 - Regular (Normal、Book、Roman)
- 500 - Medium
- 600 - Semi Bold (Demi Bold)
- 700 - Bold
- 800 - Extra Bold (Ultra Bold)
- 900 - Black (Heavy)

> 为什么说大致对应呢？在有些字库下是有差异的，比如在[Adobe Typekit字库](https://helpx.adobe.com/typekit/using/css-selectors.html)中对字重描述的划分列表中，它列出Heavy指的是800而不是900。另外，在我们日常使用的Photoshop和Sketch里面，Ultra Light是100，而Thin是200。

并且，字体所拥有的字重的数量实际上很少存在满足有9个字重刚好跟100～900的CSS字重一一对应的情况，通常字体拥有的字重数量为4至6个。
不必担心，起码400和700对应的字重至少是每种字体必备的，譬如常见的 Arial、Helvetica、Georgia等等，只有400(normal)和700(bold)。

### bolder、lighter

bolder、lighter表示其字重值是基于从其父元素继承而来的字重计算所得的，与normal、bold所代表的字重并无关系。

其值通常是根据下表计算而得的：

| 继承值（Inherited value）        |  bolder所代表的字重           | lighter所代表的字重	  |
|: ------------- :|:-------------:| :--------:|
|100|	400|	100|
|200|	400|	100|
|300|	400|	100|
|400|	700|	100|
|500|	700|	100|
|600|	900|	400|
|700|	900|	400|
|800|	900|	700|
|900|	900|	700|

## 字体匹配算法

在上面我们已经提到，在很多情况下，字体并不是以九阶数值来划分的，并且其含有的字重数量是不一的，通常情况下为4-6个。

此时，就会**出现样式指定的字重数值在字体中找不到直接对应的字重**，那浏览器是如何解决的呢？

Bingo！
那就是**要靠[字体匹配算法](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm)来解决**。其中关于font-weight部分是这么提及到的：

![fontMatching.jpg](//misc.aotu.io/Tingglelaoo/fontMatching.jpg)

讲人话就是：
如果指定的font-weight数值，即所需的字重，能够在字体中找到对应的字重，那么就匹配为该对应的字重。否则，使用下面的规则来查找所需的字重并渲染：
- 如果所需的字重小于400，则首先降序检查小于所需字重的各个字重，如仍然没有，则升序检查大于所需字重的各字重，直到找到匹配的字重。
- 如果所需的字重大于500，则首先升序检查大于所需字重的各字重，之后降序检查小于所需字重的各字重，直到找到匹配的字重。
- 如果所需的字重是400，那么会优先匹配500对应的字重，如仍没有，那么执行第一条所需字重小于400的规则。
- 如果所需的字重是500，则优先匹配400对应的字重，如仍没有，那么执行第二条所需字重大于500的规则。

### 理解与运用

下面我们通过官方例子和实际测试来好好理解这个匹配算法规则。

#### 官方例子

W3C规范标准中给出这么一个例子：

![font_matching_examples.jpg](//misc.aotu.io/Tingglelaoo/font_matching_examples.jpg)

_注解：灰色标记的是字体中缺少的字重，而黑色则是字体拥有的字重。_

基于匹配算法规则，看图理解所得：
Figure 15.图指的是

|字体库内直接匹配的字重|填空值(即通过算法间接匹配所得字重)|
|: ------------- :|:-------------:|
|400|300、200、100、500|
|700|600|
|900|800|

拿`font-weight: 300;`来说，字体中没有可以直接匹配的字重，那么300小于400，则根据第一条规则，先降序查找匹配，但是都没有可匹配的200、100，那么升序查找为400，结果可匹配。

Figure 16.图指的是

|字体库内直接映射的字重|填空值|
|: ------------- :|:-------------:|
|300|200、100、400、500|
|600|700、800、900|

这里需要注意的是，填空值500表现的是300的字重，而不是600的字重。
为什么呢？根据结果表现，我们可以反推出，字重在浏览器去渲染时早已经按照算法去一一匹配好。也就是，400匹配的字重在500匹配之前已经匹配好了（说起来有点拗口，大家可以根据Figure.16的例子体会下）。

其余的，我就不多解释了，大家可以根据结果检查自己是否理解到位。

#### 实际测试——Droid Sans

![googlefonts.jpg](//misc.aotu.io/Tingglelaoo/googlefonts.jpg)

根据[Google Fonts API - Droid Sans](https://fonts.google.com/?query=droid)提供的Droid Sans字体，我们可以知道该字体拥有两种字重。

根据字体匹配算法规则，我们可以预测其字重匹配应该如下表所示：

|字体库内直接映射的字重|填空值|
|: ------------- :|:-------------:|
|400|300、200、100、500|
|700|600、800、900|

也就是100、200、300、500会表现为跟400同一种字重，600、800、900会表现为跟700同一种字重。

利用Google Fonts提供的Droid Sans，我们进行了实例测试－([DroidSans.html](http://jdc.jd.com/demo/ting/DroidSans.html))来验证。
结果如下图，证明我们的预测结果正确，该字体匹配算法规则运行有效。

![droid_sans_res.jpg](//misc.aotu.io/Tingglelaoo/droid_sans_res.jpg)

## 总结

根据以上的研究，可以总结出三点：
1. 通常情况下，一个特定的字体仅会包含少数的可用字重。**若所指定的字重不存在直接匹配，则会通过字体匹配算法规则匹配使用邻近的可用字重。**这也就是为什么我们有时候使用特定字重时没有“生效”，看起来跟其它字重差不多的原因所在。

2. 在实际中，最为常用的字重是normal和bold。**我个人认为400、700是等效于normal、bold的，无论哪一种表示方法都没有关系，主要是个人习惯问题。**

3. 但是，**推荐使用数值替代lighter、bolder**，因为这涉及到继承计算的问题，用数值的话则会更为清晰明了。




> 参考资料：
[W3C－字体](https://www.w3.org/TR/CSS21/fonts.html#font-boldness)
[W3C－字体匹配算法](https://www.w3.org/TR/css-fonts-3/#font-matching-algorithm)

