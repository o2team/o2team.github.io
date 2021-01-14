title: EaseJs 中 regX / regY 的用法
subtitle: 动效开发过程中总会遇到中心点设置问题，本文介绍了EaseJS中regX/regY设置中心点的用法。
cover: https://img12.360buyimg.com/ling/s690x416_jfs/t1/139168/30/9706/615083/5f732aeaE7106cd2b/2a901f7606beb638.png
category: 经验分享
tags:
  - EaseJs
author:
  nick: 凹凸曼-大力士
date: 2020-11-05 15:40:20

---

## 前情提要

动效开发中最常用的基本变形动作就是缩放、旋转等，该变形会涉及到中心点的设置。由于我们采用了createJs中的easeJs库进行图形绘制，这个时候我们就会用到regX/regY。下面先看一个小demo:

我们先在页面中画一个100x100的矩形，并放置在canvas中间，代码如下：
```
import React, { useRef, useEffect } from "react";
import { Power0, TweenMax as Tween } from "gsap";
import { Stage, Shape, Graphics, Ticker } from "@createjs/easeljs";
import "./App.css";
function MotionDemo() {
  const canvasRef = useRef(null);
  Tween.ticker.fps(24);
  useEffect(() => {
    canvasRef.current.width = 400;
    canvasRef.current.height = 400;
    let stage;
    window.stage = stage = new Stage(canvasRef.current);
    const graphics = 
    new Graphics().beginFill("#0ff").drawRect(0, 0,   100, 100);
    const shape = new Shape(graphics);
    window.stage.addChild(shape);
    //将矩形放置在canvas中
    shape.x = 150;
    shape.y = 150;
    shape.alpha = 0.3;
    Ticker.on("tick", e => {
      stage.update();
    });
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", left: "10%", top: "20%" }}>
        <canvas className="canvas" ref={canvasRef} width={200} height={200} />
      </div>
    </div>
  );
}
export default MotionDemo
```
效果如下：
![图片demo](https://img10.360buyimg.com/ling/jfs/t1/134731/29/11163/7591/5f732caaE2240cad6/a9379b43ed80975d.png)

^_^ 继续说回regX/regY什么是regX/regY

官方文档解释：

**regX**：
The left offset for this display object's registration point.即该显示对象注册点的左偏移量。

**regY**: 
The y offset for this display object's registration point.即该显示对象注册点的上偏移量。

需要明确的是：

regX/regY为正时，对象往左上偏移；regX/regY为负，则向右下偏移。
现在我们让中间的矩形动起来,向useEffect 底部添加如下代码:
```
Tween.to(shape, 2, {
    rotation: 360,
    repeat: -1,
    ease: Power0.easeNone,
 })
```
效果如下：
![图片2](https://storage.360buyimg.com/ling-gif/2_1601380875508_0be.gif)

很显然我们能发现，该对象的注册点即左顶点。

**设置regX/regY绕图形中心旋转**

**官方说明：**

For example, to make a 100x100px Bitmap rotate around its center, you would set regX and regY to 50.让一个100x100的矩形，围绕起中心点旋转，则需要将regX/regY设为50.

现在我们设置regX/regY，显示对象宽度/高度的一半（100 / 2 = 50）, 为了对比，我们新增一个同位置的矩形,（在useEffect底部添加)
```
const createShape = () => {
   const graphics = new Graphics() .beginFill("#0f0")
                            .drawRect(0, 0, 100, 100);
   const shape = new Shape(graphics);
   shape.x = 150;
   shape.y = 150;
   shape.regX = 50;
   shape.regY = 50;
   window.stage.addChild(shape);
   Tween.to(shape, 2, {
       rotation: 360,
       repeat: -1,
       ease: Power0.easeNone
   });
 };
createShape();
```
效果如下：
![3](https://storage.360buyimg.com/ling-gif/3_1601380876698_444.gif)

淡蓝色的为该矩形原本的位置，设置regX/regY后，可知图形确实是绕中心旋转。只是该矩形位置发生了偏移，我们需要调整显示对象的位置，将其位置还原为初始状态并围绕中心旋转。
```
//将createShape中shape的位置往右下调整shape宽度的一半
   shape.x += 50
   shape.y += 50
```
效果如下：
![5](https://storage.360buyimg.com/ling-gif/4_1601380894740_e6a.gif)

设置任意旋转中心
现在我们清楚了，regX/regY会改变显示对象的注册点位置，并使该对象位置发生偏移。那我们可以很简单的利用这一特性和显示对象的x,y属性联合使用达到我们的目的。
举个例子：现在我们想让矩形绕其右上顶点旋
利用regX/regY ，使其绕右顶点旋转 
利用x, y将偏移后的对象还原至初始位置
代码如下：
```
// 第一步实现，将旋转中心移至右顶点
shape.regX = 100
shape.regY = 0

// 第二步实现，设置x,y将显示对象移回初始位置
shape.x += 100
shape.y = 0
```
效果如下：
![右](https://storage.360buyimg.com/ling-gif/5_1601380895160_f56.gif)

依靠上面拆分的办法，我们就可以将旋转中心设置为该显示对象上的任意一点啦。
**（大家会不会因此迷糊 如果旋转中心不在显示对象上该如何处理，下面也做一下说明）**。

举个例子：现在我们希望矩形绕【画布的左顶点】旋转。

* 利用regX/regY将显示对象注册点调整为画布左顶点。
* 利用x,y将显示对象还原至初始位置

所以 其实和旋转中心在显示对象上是一致的。
```
// 第一步
shape.regX = -150
shape.regY = -150

// 第二步
shape.x -= 150 
shape.y -= 150
```
效果如下：（速率调快了，方便看效果）
![6](https://storage.360buyimg.com/ling-gif/6_1601380894845_224.gif)

**总结：**

regX/regY会改变其旋转中心，并伴随显示对象位置偏移（相对于原显示对象而言）


**当显示对象存在缩放和旋转时，情况会不会不同呢？**

* 有缩放的情况

给显示对象设置缩放值
```
shape.scale = 0.5;
```
设置中心点：
```
// 第一步实现，设置显示对象注册点偏移至中心点处
shape.regX = (width / 2) * scale
shape.regY = (height / 2) * scale
      
// 第二步实现，设置x/y将显示对象偏移到原来的位置，
shape.x += (width / 2) * scale
shape.y += (height / 2) * scale
```
![对比图1](https://img14.360buyimg.com/ling/jfs/t1/147516/29/9518/24252/5f73233eEb17da453/162b6ac28b54b121.png)
很显然，位置计算并不正确。因为缩放不会影响注册点所在坐标系。
调整regX/regY取值
```
shape.regX = width / 2
shape.regY = height / 2
```
则得到绕中心点旋转结果，效果如下：
![7](https://storage.360buyimg.com/ling-gif/9_1601380895717_9b0.gif)

* 有旋转的情况 

给显示对象本身设置旋转角度
```
shape.rotation = 30;
  
//处理中心点设置
shape.regX = width / 2
shape.regY = height / 2
shape.x += width / 2
shape.y += height / 2
```
![对比图2](https://img30.360buyimg.com/ling/jfs/t1/143477/36/9626/33135/5f732309E4d057c51/f6f9584525f204e6.png)

即：显示对象的旋转，不会影响旋转中心的设置


**总结：**

regX/regY、x/y配合使用可以设置任意中心点。另外通过旋转和缩放两种情况中心点的设置和效果可知：缩放在中心点设置之前就已生效所以缩放是以其左顶点进行缩放，而旋转是在设置完中心点之后生效，所以其是绕其中心点进行旋转的。额外需要注意的是，当设完中心点，对象经过旋转动效后，如需要将中心点重置为左顶点时。此时注册点的偏移量重置为0。但x, y的位置需要通过旋转公式求出旋转后左顶点的坐标，而不是单纯的还原位置。