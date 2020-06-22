title: 图形处理：给 Canvas 文本填充线性渐变
subtitle: 在 Canvas 中对文本填充水平或垂直的线性渐变可以轻易实现，而带角度的渐变就复杂很多。
cover: https://img13.360buyimg.com/ling/jfs/t1/112084/38/10525/348536/5eec60d9E0212c694/0e9b20c9fff07877.jpg
categories: Web开发
date: 2020-06-22 10:00:00
tags:
  - Canvas 线性渐变
  - Linear Gradient
  - 图形处理
  - 图形算法
author:
  nick: Barrior
  github_name: Barrior
wechat:
  share_cover: https://img12.360buyimg.com/ling/jfs/t1/120180/16/5416/61120/5eeee818E67cc9671/9b4b1950f727aa11.jpg
  share_title: 图形处理：给 Canvas 文本填充线性渐变
  share_desc: 在 Canvas 中对文本填充水平或垂直的线性渐变可以轻易实现，而带角度的渐变就复杂很多。

---

在 Canvas 中对文本填充水平或垂直的线性渐变可以轻易实现，而带角度的渐变就复杂很多；就好像下面这样，假设文本矩形宽为 `W`, 高为 `H`, 左上角坐标为 `X, Y`。

![渐变示例.jpg](https://img13.360buyimg.com/ling/jfs/t1/132955/1/2355/158579/5ee8ba4cE56f23807/0a2248b5aa3d1d94.jpg)

### 猜想与答案

给出两个选择：

![猜想.jpg](https://img13.360buyimg.com/ling/jfs/t1/124324/8/5198/217837/5eec60cbE1c4ad815/1adb73985f1ca081.jpg)

正确答案是图二，因为这样得出来的坐标生成的渐变最紧接文本矩形边界，它的运动轨迹如下动图：

![LinearGradient.gif](https://storage.360buyimg.com/ling-gif/linear-gradient_1592116188612_b32.gif)

(图来源：Do you really know CSS linear-gradients）

### 渐变起点与终点坐标的计算

所以，渐变的起点与终点坐标该怎么计算呢？答:

1. 先求得起点与终点的长度（距离）。
1. 根据长度与文本矩形的中心点坐标分别计算出起点与终点坐标。

线性渐变长度的计算 W3C 给出了一个公式（A 表示角度）：

```javascript
gradientLineLength = abs(W * sin(A)) + abs(H * cos(A))
```

不过，该公式主要应用于 CSS 的线性渐变设置，即以 12 点钟方向为 0°，顺时针旋转。

而我们需要的是以 3 点钟方向为 0°，逆时针旋转，即公式为：

```javascript
gradientLineLength = abs(W * cos(A)) + abs(H * sin(A))

// 半长：
halfGradientLineLength = (abs(W * cos(A)) + abs(H * sin(A))) / 2
```
那么这个公式是怎么来的呢？以下是笔者的求解：

![几何图.jpg](https://img13.360buyimg.com/ling/jfs/t1/110856/26/13177/47467/5eeee3dcEcbd4982c/54a3f35b8fca14e1.jpg)

由图可得以下方程组：

![math-1.jpg](https://img12.360buyimg.com/ling/jfs/t1/126048/37/5365/12587/5eeee862E350aadea/ac66bb949bf174ef.png)

因此可推导出：

![math-2.jpg](https://img14.360buyimg.com/ling/jfs/t1/126469/30/5315/11206/5eeee862E7ba3b77f/25bd8a0e1898742d.png)

化简后为：

![math-3.jpg](https://img10.360buyimg.com/ling/jfs/t1/123952/31/5363/10064/5eeee862Ed42506aa/dcb54cf43ef23baf.png)

所以 `c1 + c2` 为：

![math-4.jpg](https://img30.360buyimg.com/ling/jfs/t1/125352/4/5373/11691/5eeee863E5b7d1697/610eacd188732c0a.png)

由三角函数平方公式知：`cos(A) * cos(A) = 1 - sin(A) * sin(A)`， 代入 `c1 + c2`：

![math-5.jpg](https://img20.360buyimg.com/ling/jfs/t1/125060/26/5357/12841/5eeee863Ecc06783d/1c43c05d381bfe48.png)

第一步化简后：

![math-6.jpg](https://img10.360buyimg.com/ling/jfs/t1/120706/10/5359/13775/5eeee863E77a6c7bf/f9e3f111810518a4.png)

最后的结果就是：

![math-7.jpg](https://img12.360buyimg.com/ling/jfs/t1/147934/10/1143/8474/5eeee863Efbf5f83e/ef8344e5acf361fc.png)

因为 `sin, cos` 在函数周期内存在负值（见下面角度对应的三角函数周期图），所以线性渐变的长度需要取绝对值。

至此，我们知道了线性渐变长度，文本矩形的中心点坐标很好算，即：

```javascript
centerX = X + W / 2
centerY = Y + H / 2
```

所以，起点与终点的坐标分别为：

```javascript
startX = centerX - cos(A) * halfGradientLineLength
startY = centerY + sin(A) * halfGradientLineLength

endX = centerX + cos(A) * halfGradientLineLength
endY = centerY - sin(A) * halfGradientLineLength
```

### 看看最终效果

![最终效果.gif](https://storage.360buyimg.com/ling-gif/result_1592311189513_405.gif)

### 经验注释

进行三角函数计算时，应尽量避免先用 `tan`, 因为 `tan` 在其周期内存在无穷值，需要做特定的条件判断，而 `sin, cos` 没有此类问题，代码书写更为简洁清晰并且不会因疏忽产生错误，见下面三角函数与角度的对应关系周期图。

![角度对应的三角函数周期图.png](https://img13.360buyimg.com/ling/jfs/t1/138096/25/832/158089/5ee8bfe5E502b1790/1364f70b575e75d4.png)

### 参阅：

[Do you really know CSS linear-gradients?](https://medium.com/@patrickbrosset/do-you-really-understand-css-linear-gradients-631d9a895caf)

[MDN linear-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient)

[W3C - CSS Images Module Level 3 # linear-gradients](https://drafts.csswg.org/css-images-3/#linear-gradients)
