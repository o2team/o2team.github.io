title: CSS3动画实践
subtitle: 总结CSS3动画实现的方法，并进一步提出润色与优化的方案。
date: 2016-01-04 15:58:00
cover: //img.aotu.io/Yettyzyt/css3-animation/840.png
categories: Web开发
tags:
  - CSS3
  - animation
author:
  nick: 燕婷 
  github_name: Yettyzyt
---
## 需求中常见的css3动画
需求中常见的css3动画一般有**补间动画（又叫“关键帧动画”）**和**逐帧动画**两种，下面分别介绍：
1. 补间动画/关键帧动画：
	常用于实现位移、颜色（透明度）、大小、旋转、倾斜等变化。一般有`Transitions`和`Keyframes animation`两种方法实现补间动画。
	**Transitions：**用于实现简单的动画，只有起始两帧过渡。多用于页面的交互操作，使交互效果更生动活泼。
> CSS的`transition`允许CSS的属性值在一定的时间区间内平滑地过渡。
> 这种效果可以在鼠标单击、获得焦点、被点击或对元素任何改变中触发，并圆滑地以动画效果改变CSS的属性值。

	**Keyframes animation：**用于实现较为复杂的动画，一般关键帧较多。
> 设置动画的关键帧规则。
> `animation`的`timing-function`设置为`ease`、`linear`或`cubic-bezier`，它会在每个关键帧之间插入补间动画，产生具有连贯性的动画。   
2. 逐帧动画：
	> animation的`timing-function`默认值为`ease`，它会在每个关键帧之间插入补间动画，所以动画效果是连贯性的。
	> 除了`ease`、`linear`、`cubic-bezier`之类的过渡函数都会为其插入补间。
	> 有些效果不需要补间，只需要关键帧之间的跳跃，这时应该使用`steps`过渡方式。
	
	更多详细用法请查看：[《深入理解CSS3 Animation 帧动画》](http://www.cnblogs.com/aaronjs/p/4642015.html)。
	逐帧动画可用于**loading动画**，但更多的用于**Sprite精灵动画（人物运动）**。精灵动画把所有帧都放在一起，通过CSS3的`animation`控制`background-position`。

	下面看一个精灵动画的例子：
	![逐帧动画示例](//img.aotu.io/Yettyzyt/css3-animation/1-1.gif)
	（案例：拍拍无聊者联盟宣传页）

	steps的参数有几个坑，需要特别留意：
	第一个参数`number`为指定的间隔数，指的是把**两个关键帧之间的动画分为n步阶段性展示**，而不是`keyframes`写的变化次数。
	我们将上述案例中hand部分作为例子：由雪碧图可知，手部的摆动一种有两种状态，故`keyframes`需要写两帧：
	```css
	@-webkit-keyframes wave{
		0%{background-position:0 0;}
	  	50%{background-position:100% 0;}
	}
	```
	设置不同的number值：
	```css
	/*将`number`设置为2*/
	.active.share3 .hand{
		-webkit-animation: wave steps(2,end) 2s forwards infinite;
	}
	```
	```css
	/*将`number`设置为1*/
	.active.share3 .hand{
		-webkit-animation: wave steps(1,end) 2s forwards infinite;
	}
	```
	![steps中的坑](//img.aotu.io/Yettyzyt/css3-animation/1-4.gif)
	（左图：`number`为2；右图：`number`为1）

	第二个参数可选，接受`start`和`end`两个值：指定在每个间隔的**起点**或是**终点**发生阶跃变化。通过[W3C](http://www.w3.org/)中的一张step的工作机制图可以理解：
	![steps中的坑](//img.aotu.io/Yettyzyt/css3-animation/1-2.png)（图片来源：[W3C](http://www.w3.org/TR/css3-transitions/)）

	TIPS：
> `step-start`等同于`steps(1,start)`：动画执行时为开始左侧端点的部分为开始；
> `step-end`等同于`steps(1,end)`：动画执行时以结尾端点为开始，默认值为end。

	最后安利一个计算帧数的工具：[CSS3动画帧数计算器](http://tid.tenpay.com/labs/css3_keyframes_calculator.html)

## CSS动画的优缺点
1. 优点：
> 简单、高效
> 声明式的
> 不依赖于主线程，采用硬件加速（GPU）
> 简单的控制keyframe animation播放和暂停
2. 缺点：
> 不能动态修改或定义动画内容
> 不同的动画无法实现同步
> 多个动画彼此无法堆叠


## 简单做动画：
总结一下在之前做动画需求时的经验，归纳为以下7个步骤。以此需求为例：
![简单做动画](//img.aotu.io/Yettyzyt/css3-animation/3-1.jpg) （案例：iphone6s推广游戏）

1. **观察**——哪些元素可以动？元素可以怎么动？
	
	根据视觉稿，分析标题、按钮、人物、背景都可以适当加动画元素。

2. **沟通**——了解设计师的想法，并提出自己的想法。

	这是设计师给出的大致动画过程，具体的过渡及动效没有明确给出，因此可以根据自己的想法与设计师进行沟通。
	![沟通](//img.aotu.io/Yettyzyt/css3-animation/3-2.JPG)

3. **分析**——分析动画元素的层次（出现顺序）；画出动画时间轴；根据时间轴写出CSS动画时间轴。
	分析该页面动画的出现可以分为四个层次：
	![分析](//img.aotu.io/Yettyzyt/css3-animation/3-3.jpg)
	根据前面的分析画出动画时间轴：
	![分析](//img.aotu.io/Yettyzyt/css3-animation/3-4.jpg)
	根据时间轴写出CSS动画时间轴：
	**方法一：**将所有动画元素放在一个时间轴上（适合于元素较少的情况）。
	```css
	a0{-webkit-animation: a0 2s forwards;}
	    @-webkit-keyframes a0{
	            0%{……}
	            30%{……}
	        }
	a1{-webkit-animation: a1 2s forwards;}
	    @-webkit-keyframes a1{
	            0%,30%{……}
	            50%{……}
	        }
	a2{-webkit-animation: a2 2s forwards;}
	    @-webkit-keyframes a2{
	            0%,50%{……}
	            75%{……}
	        }
	a3{-webkit-animation: a3 2s forwards;}
	    @-webkit-keyframes a3{
	            0%,75%{……}
	            100%{……}
	        }
	```
	**方法二：**同一阶段的动画元素放在一个时间轴上。
	```css
	a0{-webkit-animation: a0 0.6s forwards;}
	    @-webkit-keyframes a0{
	            0%{……}
	            100%{……}
	        }
	a1{-webkit-animation: a1 0.4s 0.6s forwards;}
	    @-webkit-keyframes a1{
	            0%{……}
	            100%{……}
	        }
	a2{-webkit-animation: a2 0.5s 1s forwards;}
	    @-webkit-keyframes a2{
	            0%{……}
	            100%{……}
	        }
	a3{-webkit-animation: a3 0.5s 1.5s forwards;}
	    @-webkit-keyframes a3{
	            0%{……}
	            100%{……}
	        }
	```

4. **切图**——PS CC 2015修改组/图层名为“***.png”，生成图像资源。
	使用PS CSS 2015切图具体步骤如下：
	![切图](//img.aotu.io/Yettyzyt/css3-animation/3-5.png)

5. **定位**——适当使用绝对定位；适当使用rem。
	安利一款sublime插件：[PX转REM插件](https://github.com/youing/PxRemTranslate)。

6. **实现**

	从无到有：
	- 透明度—opacity
	- 位移—translate
	- 宽度—width（少用）

	动起来：
	- 2/3D转换—transform
	- 其他属性

7. ** 润色**
	<p style="color:#bbb">后文介绍</p>

TIPS：不要在before,after里加动画！

## 不止于“动”：
1. **惯性**

	物体没有停在本应该停止的位置上而是靠惯性**继续摆动一段时间然后反方向摆回来**。
	惯性在日常的动画需求中应用相当普遍，元素的高速进入都涉及惯性。
	- 示例：标题快速从左侧划入屏幕中，标题本应停在屏幕左右居中位置，由于惯性的作用，标题到达居中位置后又向右滑行一小段，再反方向滑回。
	![惯性](//img.aotu.io/Yettyzyt/css3-animation/4-2.gif) （案例：618 APP返场页H5）

2. **透视**

	物体与观察者的距离远近在静态时通过**物体的大小**来体现。
	当物体运动时，通过**远近物体不同的运动速度**来体现，从而形成层次感。**近处的物体运动快，远处的物体运动慢**。
	![透视](//img.aotu.io/Yettyzyt/css3-animation/4-7.jpg)
	（透视原理图）
	- 示例：云朵与观察者的距离有远近之分（不可能所有的云都在一个平面上），设置云朵的飘动动画时，可根据云朵的大小（远近）设置不同的运动速度，近处的云朵飘动的速度比远处的快，从而形成透视。
	```
	.cover_clouds .c1,
	.cover_clouds .c2,
	.cover_clouds .c4,
	.cover_clouds .c6
	{
	    -webkit-animation: cloudFloat linear 6s infinite;
	}
	.cover_clouds .c3,
	.cover_clouds .c5,
	.cover_clouds .c7
	{
	    -webkit-animation: cloudFloat linear 10s infinite;
	}
	```
	![透视](//img.aotu.io/Yettyzyt/css3-animation/4-9.gif) （案例：iphone6s推广游戏）

3. **节奏**

	善用**曲线**和**缓动**可使效果更生动。
	**多个元素保持相同节奏**，保证画面的动画不过分凌乱。
	- 示例：匀速的呼吸与缓动的呼吸。
		```
		.breath{
		    -webkit-animation:
		    breath 6s linear infinite;
		}
		```
		```
		.breath{
		    -webkit-animation:
		    breath 6s cubic-bezier(.2,.73,.71,.44) infinite;
		}
		```
		![节奏](//img.aotu.io/Yettyzyt/css3-animation/4-11.gif)
		(左图：匀速呼吸效果图；右图：缓动呼吸效果图)
	跟随动画进行呼吸，可以明显感觉到缓动的呼吸更贴近我们实际的呼吸情况。呼吸函数如下：
		![节奏](//img.aotu.io/Yettyzyt/css3-animation/4-12.png)
		（图片来源：[让界面动画更自然——ISUX](http://isux.tencent.com/animation-factor.html)）

4. **跟随**

	跟随动作是将物体的各部位拆解，通常是**没有骨架**的部位较容易产生跟随的动作。例如：一个奔跑的人突然停下，他的衣服头发等可能仍会运动。其中，人是“主体”，衣服头发等是“附属物”。
	附属物的动作取决于：**主体的动作**，**附属物本身的重量和质地**，以及**空气的阻力**。
	**主体与附属物之间动作的重叠和追随**，就是鉴定动作流畅性与自然度好坏的标准。
	- 示例：首页主体人物动作触发后，进行小范围的四向运动以模拟人物身体颤动的效果。人物头饰（花及骨头）与运动主体（人）并非一体，属于附属物。附属物的运动受主体的运动影响出现同向、延时的运动。
	![跟随](//img.aotu.io/Yettyzyt/css3-animation/4-18.gif) （案例：拍拍七夕活动页—七叻个夕）

## 优化
1. 不用left/right/width/height/margin-top等
2. 少用color/background等
3. 使用translate/opacity
4. 适当开启GPU加速
5. 适当使用will-change


## 参考文章
1. [CSS3 transition 属性过渡效果 详解,Techzero ,2014-04-1](http://www.itechzero.com/css3-transition-property-transition-effect-explain.html)
2. [深入理解CSS3 Animation 帧动画,Aaron,2015-07-13](http://www.cnblogs.com/aaronjs/p/4642015.html)
3. [CSS3 timing-function: steps() 详解,那个傻瓜瓜,2014-12-30](http://www.tuicool.com/articles/neqMVr)
4. [主流动画实现方式总结,Benjamin,2015-01-25](http://www.zuojj.com/archives/1292.html)
5. [Animation Principles for the Web](https://cssanimation.rocks/principles/)
6. [12 basic principles of animation](https://en.wikipedia.org/wiki/12_basic_principles_of_animation)
