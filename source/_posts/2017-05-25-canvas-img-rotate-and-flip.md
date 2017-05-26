title: canvas 图像旋转与翻转姿势解锁
subtitle: 多图预警，数学不好可直接跳至文末小结。
date: 2017-05-25 23:00:00
cover: //misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/cover_900x500.png
categories: Web开发
tags:
  - canvas
author:
  nick: Yetty 
  github_name: Yettyzyt
---
> 多图预警，数学不好可直接跳至文末小结。

## 需求背景
从一个游戏需求说起：
![需求背景](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/coke.png)
1. 技术选型：canvas
上图所展示的游戏场景，“可乐瓶”里有多个“气泡”，需要设置不同的动画效果，且涉及 deviceOrientation 的交互，需要有大量计算改变元素状态。从性能方面考虑，canvas 是不二的选择。
2. 技术点：canvas 绘制图像
通过对游戏场景的进一步分析，可见场景中的“气泡”元素形状都是相同的，且不规则，通过 canvas 直接绘制形状实现成本较高，因此需要在 canvas 上绘制图像。
3. 技术点：canvas 图像旋转与翻转
虽然“气泡”元素是相同的，可以使用相同的图像，但图像需要多个角度/多个方向展示，因此需要对图像进行相应的旋转与翻转（镜像），这也是本文所要介绍的重点。

后文代码以下图左侧绿框的“气泡”为示例，右侧展示了场景中用到的两个图像：
![需求背景](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/bg.png)

## 认识 canvas 坐标系
canvas 上图像的旋转和翻转，常见的做法是将 canvas 坐标系统进行变换。因此，我们需要先认识 canvas 坐标系统：
![canvas 坐标系](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/system.png)
由上图可得，canvas 2D 环境中坐标系统和 Web 的坐标系统是一致的，有以下几个特点：
1. 坐标原点 (0,0) 在左上角
2. X坐标向右方增长
3. Y坐标向下方延伸

回到上述需求中，我们获取 canvas 对象并设置相应的宽高：
```htmlbars
<canvas id='myCanvas'></canvas>
```
```javascript
// 获取 canvas 对象
var canvas = document.getElementById('myCanvas')
canvas.width = 750
canvas.height = 1054
// 获取 canvas 2D 上下文对象
var ctx = canvas.getContext('2d')
```
此时，canvas 的坐标系统如下图所示：
![coke 坐标系](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/system_coke.png)

### 在 canvas 上绘制图像
在 canvas 上绘制图像，可以使用 `drawImage()` 方法，语法如下（详细用法参见 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage)）：
```javascript
void ctx.drawImage(image, dx, dy);
void ctx.drawImage(image, dx, dy, dWidth, dHeight);
void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
```
需要注意的是，图像必须加载完毕，才能绘制到 canvas 上，否则会出现空白：
```javascript
var img = new Image()
img.src = 'xxxxxxx.png'
img.onload = function() {
	// 绘制图像
	ctx.drawImage(img, 512, 220, 160, 192);
}
```
此时，便可以 canvas 上看到一个未旋转/翻转的“气泡”图像，如下图所示：
![绘制图像](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/drawImage.png)

## canvas 坐标变换
接下来，我们再来了解 canvas 坐标的变换。上述需求仅涉及 2D 绘制上下文，因此仅介绍 2D 绘制上下文支持的各种变换：
1. 平移 translate：
    ```javascript
    ctx.translate(x, y)
    ```
    translate() 方法接受两个参数。x 是左右偏移量，y 是上下偏移量。
2. 旋转 rotate：
    ```javascript
    ctx.rotate(angle)
    ```
    rotate() 方法只接受一个参数。旋转的角度 angle，它是顺时针方向的，以弧度为单位的值。
3. 缩放 scale：
    ```javascript
    ctx.scale(x, y)
    ```
    scale() 方法接受两个参数。x 和 y 分别是横轴和纵轴的缩放因子。其缩放因子默认是 1，如果比 1 小是缩小，如果比 1 大则放大。
4. 变形 transform：
    ```javascript
    ctx.transform (a, b, c, d, e, f)
    ```
    transform() 方法是对当前坐标系进行矩阵变换。
    ```javascript
    ctx.setTransform (a, b, c, d, e, f)
    ```
    setTransform() 方法重置变形矩阵。先将当前的矩阵重置为单位矩阵（即默认的坐标系），再用相同的参数调用 transform() 方法设置矩阵。
    以上两个方法均接受六个参数，具体如下：

参数 | 含义 
---|---
a | 水平缩放绘图
b | 水平倾斜绘图
c | 垂直倾斜绘图
d | 垂直缩放绘图
e | 水平移动绘图
f | 垂直移动绘图

## 图像旋转的实现
![图像旋转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/rotate_coke.png)
上图所示“气泡”，宽为 160，高为 192，x 轴方向距离原点 512，y 轴方向距离原点 220，逆时针旋转 35 度。
要绘制该“气泡”，需要先将坐标系平移（translate），再旋转（rotate）。具体实现步骤如下：
![图像旋转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/rotate_coke_join.png)

> save() 方法与 restore() 方法：
1. save() 方法用来保存 Canvas 状态的，没有参数。每一次调用 save() 方法，当前的状态就会被推入栈中保存起来。当前状态包括：
    - 当前应用的变形（移动/旋转/缩放）
    - strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值
    - 当前的裁切路径（clipping path）
2. restore() 方法用来恢复 Canvas 状态，没有参数。每一次调用 restore() 方法，上一个保存的状态就从栈中弹出，所有设定都恢复。
3. 状态保存在栈中，可以嵌套使用 save() 与 restore()。

## 图像翻转的实现
![图像翻转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/flip_coke.png)
上图所示“气泡”，宽为 160，高为 192，x 轴方向距离原点 172，y 轴方向距离原点 365，顺时针旋转 35 度。
要绘制该“气泡”，需要先将坐标系统平移（translate），翻转（scale），平移（translate），再旋转（rotate）。具体实现步骤如下：
![图像翻转1](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/flip_coke_join_1.png)
至此，实现了“气泡”的镜像翻转，但翻转后的“气泡”还需要旋转特定的角度，在方法一的基础上继续对坐标系统进行变换：
![图像翻转2](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/flip_coke_join_2.png)
以上操作中进行了两次平移（translate）操作，可以进行合并简化：
![图像翻转3](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/flip_coke_join_3.png)

## 坐标系统的矩阵变换
前文介绍了 2D 绘制上下文变形（transform）变换，实际是直接修改变换的矩阵，它可以实现前面介绍的平移（translate）／旋转（rotate）／缩放（ scale）变换，还可以实现切变/镜像反射变换等。矩阵计算遵循数学矩阵公式规则：
![矩阵变换](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matrix.gif)
由上公式可得：
```mathematica
x' = ax + cy + e
y' = bx + dy + f
```
矩阵变换可实现以下变换效果：
1. 平移 translate：
    ```mathematica
    x' = 1x+0y+tx = x+tx
    y' = 0x+1y+ty = y+ty
    ```
    ![平移](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_translate.png)
2. 旋转 rotate：
    ```mathematica
    x' = x*cosθ-y*sinθ+0 = x*cosθ-y*sinθ
    y' = x*sinθ+y*cosθ+0 = x*sinθ+y*cosθ
    ```
    ![旋转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_rotate.png)
3. 缩放 scale：
    ```mathematica
    x' = Sx*x+0y+0 = Sx*x
    y' = 0x+Sy*y+0 = Sy*y
    ```
    ![缩放和拉伸](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_scale.png)
4. 切变
    ```mathematica
    x' = x+y*tan(θx)+0 = x+y*tan(θx)
    y' = x*tan(θy)+y+0 = x*tan(θy)+y
    ```
    ![切变](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_skew.png)
5. 镜像反射
    ```mathematica
    // 定义(ux,uy)为直线(y=kx)方向的单位向量
    ux=1/sqrt(1+k^2)
    uy=k/sqrt(1+k^2)
    x' = (2*ux^2-1)*x+2*ux*uy*y
    y' = 2*ux*uy*x+(2*uy^2-1)*y
    ```
    ![镜像反射](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_flip.png)

结合上述公式，可推导出图像旋转和翻转的矩阵变换实现：
1. 图像旋转：
![图像旋转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_rotate_coke.png)
2. 图像翻转：
![图像翻转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_flip_coke.png)
3. 图像镜像反射（翻转+旋转）：
![图像旋转&翻转](//misc.aotu.io/Yettyzyt/2017-05-25-canvas-img-rotate-and-flip/matirix_rotate_flip_coke.png)


## 像素操作实现图像翻转
除了坐标系统变换，canvas 的像素操作同样可以实现图像的翻转。首先需要了解下 `getImageData()` 方法（详细用法参见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData)）和 `putImageData()`（详细用法参见[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/putImageData)）方法：
1. getImageData()
`CanvasRenderingContext2D.getImageData()` 返回一个 ImageData 对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为 (sx, sy)、宽为 sw、高为 sh。
```javascript
ImageData ctx.getImageData(sx, sy, sw, sh);
```
2. putImageData()
`CanvasRenderingContext2D.putImageData()` 是 Canvas 2D API 将数据从已有的 ImageData 对象绘制到位图的方法。 如果提供了脏矩形，只能绘制矩形的像素。 
```javascript
void ctx.putImageData(imagedata, dx, dy);
void ctx.putImageData(imagedata, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight);
```

水平翻转实现：
```javascript
// 绘制图像
ctx.drawImage(img, x, y, width, height)
// 获取 img_data 数据
var img_data = ctx.getImageData(x, y, width, height),
    i, i2, t,
    h = img_data.height,
    w = img_data.width,
    w_2 = w / 2;
// 将 img_data 的数据水平翻转
for (var dy = 0; dy < h; dy ++) {
    for (var dx = 0; dx < w_2; dx ++) {
        i = (dy << 2) * w + (dx << 2)
        i2 = ((dy + 1) << 2) * w - ((dx + 1) << 2)
        for (var p = 0; p < 4; p ++) {
            t = img_data.data[i + p]
            img_data.data[i + p] = img_data.data[i2 + p]
            img_data.data[i2 + p] = t
        }
    }
}
// 重绘水平翻转后的图片
ctx.putImageData(img_data, x, y)
```

## 小结
至此，小编的数学姿势又恢复到了高考水平。
1. 图像旋转：
    - 基础变换法：
    ```javascript
    ctx.save()
    ctx.translate(x + width / 2,  y + height / 2)
    ctx.rotate(angle * Math.PI / 180)
    ctx.drawImage(img, -width / 2,  -height / 2, width, height)
    ctx.restore()
    ```
    - 矩阵变换法：
    ```javascript
    ctx.save()
    var rad = angle * Math.PI/180
    ctx.transform( Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), x + width / 2,  y + height / 2)
    ctx.drawImage(img, -width / 2,  -height / 2, width, height)
    ctx.restore()
    ```

2. 图像翻转：
    - 基础变换法：
    ```javascript
    // 方法一
    ctx.save()
    ctx.translate(canvasWidth, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(img, canvasWidth-width-x, y, width, height)
    ctx.restore()
    ```
    ```javascript
    // 方法二
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(img, -width-x, y, width, height)
    ctx.restore()
    ```
    - 矩阵变换法：
    ```javascript
    // 方法一
    ctx.save()
    ctx.transform(-1, 0, 0, 1, canvasWidth, 0)
    ctx.drawImage(img, canvasWidth-width-x, y, width, height)
    ctx.restore()
    ```
    ```javascript
    // 方法二
    ctx.save()
    ctx.transform(-1, 0, 0, 1, 0, 0)
    ctx.drawImage(img, -width-x, y, width, height)
    ctx.restore()
    ```
    - 像素操作法：
    ```javascript
    ctx.drawImage(img, x, y, width, height)
    var img_data = ctx.getImageData(x, y, width, height),
        i, i2, t,
        h = img_data.height,
        w = img_data.width,
        w_2 = w / 2;
    for (var dy = 0; dy < h; dy ++) {
        for (var dx = 0; dx < w_2; dx ++) {
            i = (dy << 2) * w + (dx << 2)
            i2 = ((dy + 1) << 2) * w - ((dx + 1) << 2)
            for (var p = 0; p < 4; p ++) {
                t = img_data.data[i + p]
                img_data.data[i + p] = img_data.data[i2 + p]
                img_data.data[i2 + p] = t
            }
        }
    }
    ctx.putImageData(img_data, x, y)
    ```
3. 图像镜像对称（翻转+旋转）：
    - 基础变换法：
    ```javascript
    ctx.save()
    ctx.scale(-1, 1)
    ctx.translate(-width/2-x, y+height/2) 
    ctx.rotate(-angle * Math.PI / 180)
    ctx.drawImage(img, -width / 2,  -height / 2, width, height)
    ctx.restore()
    ```
    - 矩阵变换法：
    ```javascript
    ctx.save()
    var k = Math.tan( (180-angle)/2 * Math.PI / 180 )
    var ux = 1 / Math.sqrt(1 + k * k)
    var uy = k / Math.sqrt(1 + k * k)
    ctx.transform( (2*ux*ux-1), 2*ux*uy, 2*ux*uy, (2*uy*uy-1), x + width/2, y + height/2 )
    ctx.drawImage(img, -width/2, -height/2, width, height)
    ctx.restore()
    ```

## 参考文章
- [《W3cplus - CANVAS 系列》](https://www.w3cplus.com/blog/tags/604.html)
- [《html5 canvas.transform[转]》](http://sumsung753.blog.163.com/blog/static/146364501201281311522752/)
- [《html5 canvas 学习笔记》](https://www.gitbook.com/book/oxcow/h5-canvas-study-notes)
- [《在HTML5中翻转图片》](https://blog.oldj.net/2011/02/09/flip-images-in-html5/)

> 说明：本文讨论的 canvas 环境均为  2D 环境。若有更好的实现方式，欢迎留言告知。
