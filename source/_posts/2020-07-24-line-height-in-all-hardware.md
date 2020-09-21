title: 几种移动端多平台元素垂直居中解决方案总结
subtitle:
cover: https://img14.360buyimg.com/imagetools/jfs/t1/113801/13/17119/131569/5f5723faEc0bbd6bf/30ff6b6e71e9454f.jpg
category: 经验分享
tags: 
    - CSS 
    - 兼容性
    - 移动端
    - line-height
author:
    nick: 刘欢
date: 2020-07-24 18:00:00
---
## 前言

在PC时代，垂直居中就是一个会引起很多讨论的问题，例如经典问题：如何在任何容器里，让任意行数的元素都能垂直居中，相信很多同学对于这个问题还记忆尤深。如今移动端已经成为了我们的主要平台，随之而来的问题也更加复杂。

而作为大促前端，我们的问题更加复杂，我们需要兼容大量不同平台的手机，例如：安卓4.4系统、IOS8、IOS9等等远古手机。可能有同学很好奇为何还需要花费时间去兼容这些手机，原因很简单：数据支撑，京东大促的用户量级非常巨大，虽然这些手机用户占比很少，但是当用户基数达到一定数量时，即使占比很小，数量也是很可观的，对应而来的就是各种客诉，所以我们必须兼容这些手机。

本文将从以下场景讨论问题的解决方案。

### 主要诉求：

- 文字小于12px在安卓和ios表现不同；
- 文字在一定宽度下自适应，超过一定宽度需要截断；
- 文字配图标或者其他元素；
- 不使用JS，纯CSS；
- dom节点只有2层，比如
```
<div><span>任何元素<span><span class="tag">内容</span></div>；
```

- 必须兼容IOS9及以下和安卓4.4.4，所以首先被排除的方法就是flex布局；
<font color=red>**PS. 本文不讨论PC下的展示效果**</font>

**主要问题：**

假如设计稿高度为28px，我们如果把行高写成28px，那么在IOS和安卓下，必然是会出bug的，相信实践过的朋友都知道，同样的行高，IOS下没什么问题，但是在安卓下，文字是偏上的，如图所示：


![安卓下效果](https://img12.360buyimg.com/imagetools/jfs/t1/131832/30/5195/4631/5f1a929dE2bbe6b18/4becd8474555299c.jpg)

经典问题了，怎么解决呢，根据网上的经验，都是建议使用flex布局的align-items来布局，但是这种布局不支持4.4.4的安卓手机，所以不行，同理grid也是不行。

#### 方法一：table布局

我尝试使用了table来进行布局，如果不考虑截断的问题，是可行的，缺点是必须2层结构，否则无法实现文字截断的效果，效果如下：
![table布局](https://img11.360buyimg.com/imagetools/jfs/t1/143483/16/3698/1989/5f1a965fE93925e30/69d9a9dd19898356.png)

代码如下：
```html
<div class="word"><span>文字文字文字文字文字文字</span></div>
```
```css
.word {
    font-size: 10px;
    background: red;
    color: white;
    display: inline-table;
    padding: 0 10px;
    table-layout: fixed;
    width: 100px;
}
.word span {
    display: table-cell;
    height: 22px;
    vertical-align: middle;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
```
<font color=red>**PS:table布局同样适用于2行纯文字，但是无法截断。**</font>

#### 方法二：line-height: normal

我们还可以使用line-height: normal的方法来实现，效果如下：
![line-height:normal方法](https://img10.360buyimg.com/imagetools/jfs/t1/126259/29/7869/1939/5f1a9c91E40c83107/0ae8f8567dbe0a9b.png)
代码如下：
```css
.word {
    font-size: 10px;
    background: red;
    color: white;
    display: inline-block;
    padding: 3px 10px;
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.word span {
    line-height: normal;
}
```
缺点：必须多套一层结构
<font color=red>**PS:line-height: normal的元素不能设置高度，只能使用padding或者margin来模拟高度**</font>

#### 方法三：？？？

我们都知道，安卓下的文字是偏上的，所以我就把line-height**加高了几个像素**，奇迹发生了，安卓下居中了，IOS基本没变，绝了！
经过试验，line-height值需要比height值大2px即可，IOS对这个值的敏感度非常小，只要不大于这个值，就几乎不变。

安卓：
![安卓](https://img14.360buyimg.com/imagetools/jfs/t1/146808/30/3723/1972/5f1a9f36E36f80854/d7b8bc8e9f9d613a.png)
IOS：
![IOS](https://img12.360buyimg.com/imagetools/s250x250_jfs/t1/115380/3/13060/4649/5f1aa64bE7cd0b4db/8eabb597357da84a.png)
```
<div class="word">文字文字文字文字文字文字</div>
.word {
  font-size: 10px;
  background: red;
  color: white;
  display: inline-block;
  padding: 0 10px;
  line-height: 24px;
  height: 22px;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```
这个方法的应用场景在哪呢，**文字+icon+需要截断+自定义宽度**，经过研究，我发现，这种情况下，如果不使用js或者hack，是不可能使用纯CSS的办法完美解决的，所以使用该方法，可以保证在所有安卓和IOS的差距保持在一个设计师可以接受的范围内。

效果如下：
安卓：
![安卓](https://img10.360buyimg.com/imagetools/jfs/t1/123511/21/7979/4688/5f1aa254E3edfc64d/1a55b1d3a8c345a8.png)
IOS：
![ios](https://img13.360buyimg.com/imagetools/jfs/t1/113930/16/13208/7851/5f1aa254E46932fcc/7de86268cfd3b61c.png)
代码如下：
```scss
.word {
    display: inline-block;
    border-radius: 4px;
    color: #fff;
    background: #E8220E;
    text-align: left;
    overflow: hidden;
    font-size: 20px;
    max-width: 180px;
    white-space: nowrap;
    vertical-align: top;
    padding: 0 6px 0 6px;
    height: 28px;
    line-height: 32px;

    &__pre {
        display: inline-block;
        vertical-align: top;
        padding-right: 4px;
        line-height: 30px;
    }
    &__text {
        display: inline-block;
        vertical-align: top;
        width: calc(100% - 20px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        table-layout: fixed;
    }
}
```
该方法使用了calc来计算整体宽度，来实现文字截断。这种方法能够兼容一行下的大部分情况，支持**图标+文字**、**文字+文字**。
缺点：IOS下可能还是会稍偏一点点，但是根据我们设计师的反馈，该误差可以接受，且该方法支持**一行多个同时出现**。

## 总结

- 根据实践，大部分情况下，方法3是覆盖面比较广的方法，line-height的值 > height的值即可；
- 如果只有一行文字，建议使用line-height: normal；
- 多行文字建议使用table布局，控制字数，因为无法截断；











