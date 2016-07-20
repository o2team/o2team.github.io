title: js游戏开发初级入门
subtitle: 凹凸实验室水灵通透软妹子－暖暖，手把手教你用js开发五子棋游戏！
cover: //img.aotu.io/wangcainuan/2016-01-14-introduction-to-JS-game-development/gobang_cover.jpg
categories: Web开发
tags:
  - js
  - 游戏
  - 五子棋
author:
  nick: 暖暖
  github_name: Newcandy
date: 2016-01-14 09:20:39
---
万事开头难，js一直没有进步？跟着这篇文章来编写五子棋游戏吧！
<!-- more -->

## 1 游戏开发方法

### 1.1 小规模游戏
小规模游戏一般由一人或两人完成，不需要详细的产品说明等资料，直接进入代码的编写，然后在浏览器中解释并运行。有时候出现错误，重新编辑再回到浏览器解释运行，就是一个简单的编辑-解释-运行的重复工作模式。

### 1.2 大规模游戏
大规模游戏一般由两人以上完成，一共分为三个阶段：设计阶段、说明阶段、实现阶段。首先是设计阶段：设计什么游戏，游戏的主体用户是谁，游戏的目的等。然后是说明阶段：清楚游戏需要的类和类中需要的方法，分别做一个规划，保证编写代码时思路清晰，以及代码的整洁性。最后是实现阶段，其实就是进入编辑-解释-运行的工作模式。也就是说，大规模游戏比小规模游戏多了两大阶段即设计阶段和说明阶段而已。

## 2 了解游戏规则

* 对局双方各执一色棋子。
* 空棋盘开局
* 黑先、白后，交替下子，每次只能下一子。
* 棋子下在棋盘的空白点上，棋子下定后，不得向其它点移动，不得从棋盘上拿掉或拿起另落别处。
* 黑方的第一枚棋子可下在棋盘任意交叉点上。


## 3 五子棋游戏的主要方法

### 3.1 画棋盘

#### 3.1.1 画棋盘思路
```javascript
// 确定棋盘大小 15*15 即n = 15

function drawGobang(n) {
// 动态生成dom元素
// 通过添加类控制棋盘样式，尤其注意边缘的棋子的样式控制
}
```

#### 3.1.2 画棋盘代码
```javascript
// 画棋盘格子
function drawGobang(n) {   

	for(var i=0;i<n;i++){
		
		for(var j=0;j<n;j++){
		
			var block = document.createElement("div");

			block.className = "gobang_block";
			// 赋予每个格子一个id,方便以后识别并下棋，或可添加html5自定义属性data-*
			block.id = "block_"+ i + "_" + j;
			gobang.appendChild(block);
		
			// 边缘的格子属于特殊情况，需要单独绘制
			if(i==0){
				block.className += " top";
			}
			if(i==n-1){
				block.className += " bottom";
			}
			if(j==0){
					block.className += " left";
			}
			if(j==n-1){
				block.className += " right";
			}	
		}
			
	}
	
}
```

#### 3.1.2 画棋盘图示
注意边缘的棋子的样式控制，另外鼠标经过时添加红色虚线提醒。

![画棋盘](//img.aotu.io/wangcainuan/2016-01-14-introduction-to-JS-game-development/board.png)

### 3.2 画棋子
处理函数需要什么操作，只是把棋子画到相对应的棋盘即可吗？

#### 3.2.1 事件委托

画棋子之前需要了解一下事件委托：利用事件冒泡，只制定一个事件处理程序，就可以管理某一类型的所有事件。
它的好处在于占用内存少，假设有一个父元素ul，有100个li子元素，如果给100个li子元素都绑定事件，相当耗内存，事件委托的原理就是只需要给父元素绑定事件即可。
不过它的使用是有条件的，它要求事件会冒泡，会冒泡的事如click、mousedown、mouseup、keydown、keyup和keypress事件。

冒泡的过程大概如下：div  -> body -> html(ie5.5-跳过） -> document -> window(ie9,fx,chrome,safari)。

因此我不需要给棋盘的每个格子绑定事件，只需要绑定棋盘（格子的父元素）即可。代码如下：
```javascript
var gobang = document.getElementById("gobang_main");  // 获取棋盘
EventUtil.addHandler(gobang,"click",drawPiece);  // 点击棋盘，进行下棋
```

#### 3.2.2 事件委托的问题

由于在父元素中绑定事件，我们知道，事件目标是被单击的单个五子棋格子。因此，需要检测 id属性或其他属性 来决定采取适当的操作。

如果不检测是否是我们想要的事件目标，可能导致错误。
代码如下,如果targetID不是我们的事件目标，可能i,j的数据则不正确，从而导致访问对应的五子棋格子gobangArr[i][j]出错：
```javascript
// 格子的id格式为"block_"+ i + "_" + j;
// targetId为当前目标的id,前面加运算符+是为了转换类型
// i和j代表第i行第j列
i = +targetId.split("_")[1];
j = +targetId.split("_")[2];
```

#### 3.2.3 已下过的棋盘位置

*  画当前棋子，通过添加类 active 和 代表颜色的white或black
*  target.className.indexOf("active")<0，意思是当前位置的类若含有active类，则不执行画棋子。
*  误区：通过 棋盘数据gobangArr[i][j]是否为空来判断是否下过棋子。不可通过棋盘数据gobangArr[i][j] 是否为空来判断，因为数组可能存在冗余数据。除非初始化时重置了数组为空。

#### 3.2.4 其他

*  一旦下一个棋子就需要判断是否赢了：chessWin(i,j,color);
*  需要切换棋子颜色：color = color=="black"? "white":"black";
*  其中一方赢了的话，不可再下棋，必须重新来一局，即移除画棋子的方法。

### 3.3 判断输赢
#### 3.3.1 判断输赢算法
首先设置count = 1。count的值代表在同一个方向连续在一起的棋子总数，达到5个则该方赢。
如水平方向按照如下顺序执行判断，其他方向雷同：
1.  按顺序遍历当前位置(i,j)棋子的前四个位置是否含相同颜色的棋子，若相同则count++，同时检测是否count == 5 。
2. 一旦不相同退出循环，
3. 继续按顺序遍历(i,j)棋子的后四个位置是否含相同颜色的棋子，若相同，count++以及检测是否count == 5 。
如下图所示，红色虚线为即将要下的棋子，计算count为1，向左判断使得count最后为3，遇到红色交叉的地方没有黑色棋子，则退出循环；从红色虚线的右边继续判断，最后count为5，因此判断黑棋赢：

![判断输赢算法](//img.aotu.io/wangcainuan/2016-01-14-introduction-to-JS-game-development/check.jpg)

代码如下，一共检测四个方向：
```javascript
function chessWin(i,j,color) {  
// 垂直方向 
// 重置count = 1
// 水平方向
// 重置count = 1
// 45°方向
// 重置count = 1
// 135°方向 
// 重置count = 1
}
```

### 3.4 重置游戏
主要是清除棋子以及棋子数组，另外设置默认数据：默认黑棋先下，重置提示语，重新给棋盘绑定方法。一方赢了的话，默认移除画棋子方法的，所以需要重新给棋盘绑定方法。如果理解了文章上面讲述的方法的话，重置游戏是比较简单的，因此不再赘述。

## 4 五子棋测试
*  检测特殊值。如检测棋盘边缘是否可以正常画棋子。
*  测试范围。判断五子棋的四个方向即垂直方向、水平方向、45度方向、135度方向，是否可以判断输赢正确。


## 5 JS事件
最后根据五子棋的主要方法，总结一下js事件。
### 5.1 事件处理程序：响应某个事件的函数
#### 5.1.1  html事件处理程序
即直接在HTML代码中添加事件处理程序。不推荐使用，原因如下：
html事件处理程序缺点：时差问题、代码紧密耦合、扩展事件处理程序的作用域链在不同浏览器中导致不同结果。

#### 5.1.2  DOM0级事件处理程序
类似onclick等事件处理程序属性，通常全部小写。
```javascript
var btn = document.getElementById("myBtn");
btn.onclick = function(){ };    // 绑定
btn.onclick = null;  // 解绑
```
     
#### 5.1.3  DOM2级事件处理程序
DOM2：可添加多个事件处理程序，按顺序触发。
使用方法：
 绑定函数addEventListener() 与 解绑函数removeEventListener()：参数为事件名（如click)、作为事件处理程序的函数、布尔值。布尔值为true时代表捕获，false代表冒泡阶段调用事件处理程序，一般为false。
 注意：若第二个参数为匿名函数，即使用removeEventListener()传入相同的匿名函数也无法解绑。
 
```javascript
btn.addEventListener("click",myGod,false);
function myGod() {
	alert("oh,my god!");
}
btn.removeEventListener("click",myGod,false);
```

#### 5.1.4  IE事件处理程序
可添加多个事件处理程序，按相反的顺序触发。只有IE和opera支持。
在DOM0级中，this为所属元素的作用域内运行；但是在使用attachEvent()方法时，事件处理程序在全局作用域中运行，即this===window！！！
使用方法：  
绑定函数attachEvent()  和 解绑函数detachEvent() : 参数为 事件处理程序名称(如 onclick )与函数。如：
```javascript
btn.attachEvent("onclick",function(){} );  
```

#### 5.1.5  跨浏览器
```javascript
var EventUtil = {
    addHandler: function(element, type, handler){
        if (element.addEventListener){  // DOM2级
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent){  // IE
            element.attachEvent("on" + type, handler);
        } else {   // DOM0级
            element["on" + type] = handler;
        }
    }
}
```

### 5.2 事件对象event

* DOM0级或DOM2级都会传入event对象。
* ie访问event有几种方式，取决于指定事件处理程序的方法。
     DOM0：window.event
     attachEvent()：window.event或event
* 跨浏览器方案如下：
``` javascript
var EventUtil = {
    getEvent: function(event){
        return event ? event : window.event;
    }
}
```

### 5.3 事件目标

* 对象this始终等于currentTarget,而target则只包含事件的实际目标。
例子：
``` javascript
 document.body.onclick = function(event){
     alert(event.currentTarget === document.body);   //true
     alert(this === document.body);                  //true
     alert(event.target === document.getElementById("myBtn")); //true
 };  
```
* 跨浏览器解决方案如下：
``` javascript
 var EventUtil = {
    getTarget: function(event){
        return event.target || event.srcElement;
    }
}
```

## 6 五子棋源码以及参考

在线地址： http://labs.qiang.it/qqpai/test/wcn/gobang/gobang.html
github地址：https://github.com/Newcandy/gobang
参考书籍：《Javascript高级程序设计》
