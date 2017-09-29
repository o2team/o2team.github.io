title: wxapp-market 小程序营销组件
subtitle: wxapp-market 是凹凸实验室推出的一款基于微信小程序的营销组件
cover: //misc.aotu.io/pfan123/wxapp-market/wxapp-market_900x500.png
categories: Web开发
tags:
  - wxapp
  - market
  - 小程序
  - 大转盘
  - 刮刮乐
author:
  nick: 高大师
  github_name: pfan123
date: 2017-09-28 20:03:25
---

<!-- more -->

## 介绍

[wxapp-market](https://github.com/o2team/wxapp-market) 是凹凸实验室推出的一款基于微信小程序的营销组件，用于快速开发营销玩法类小程序项目页面，包含大转盘、刮刮乐、老虎机、水果机、九宫格翻纸牌、摇一摇、手势解锁等多种营销组件。

项目地址：https://github.com/o2team/wxapp-market

## 特性

- 基于小程序 WXML 提供模板（template）模块化开发

- 简单好用、易扩展

- 支持多种营销玩法

## 预览

可通过微信web开发者工具，进行预览体验

![wxapp-market小程序营销组件](http://img.pfan123.com/wx_market_0.gif)


## 快速上手

### 拉取仓库

```
git clone git@github.com:o2team/wxapp-market.git
```

### 查看组件文件

- 大转盘 (Big wheel) : `/components/wheel/`
- 刮刮乐 (Scratch tickets) : `/components/scratch/`
- 老虎机 (Slot machine) : `/components/slotMachine/`
- 水果机 (Fruit machine) : `/components/fruitMachine/`
- 九宫格翻纸牌 (Grid card) : `/components/card/`
- 摇一摇 (Shake) : `/components/shake/`
- 手势解锁 (Gesture lock) : `/components/lock/`

### 引入组件

引入对应所需组件，实例组件对象、配置参数即可。如大转盘组件：

- WXSS中引用样式：`@import "../../components/wheel/wheel.wxss"`

- WXML中引用结构：`<import src="../../components/wheel/wheel.wxml"/>`

- JS中引用：`import Wheel from "../../components/wheel/wheel.js"`

```js
  
  new Wheel(this,{
    areaNumber: 8,   //抽奖间隔
    speed: 16,       //转动速度
    awardNumer: 2,   //中奖区域从1开始
    mode: 1,         //1是指针旋转，2为转盘旋转
    callback: (idx, award) => {
      //结束回调   
    }
  })
```

更多使用说明，请阅读文档 [wxapp-market](https://github.com/o2team/wxapp-market)

## 结语

[wxapp-market](https://github.com/o2team/wxapp-market) 是希望帮助开发者能够更快、更低门槛地开发出含营销功能的微信小程序，同时希望与众多开发者一起打造维护好用、易扩展的小程序营销组件库。

欢迎各位端友使用 [wxapp-market](https://github.com/o2team/wxapp-market)，如果你在使用过程中遇到问题，或者有好的建议，欢迎给我们提 [Issue](https://github.com/o2team/wxapp-market/issues) 或者 [Pull Request](https://github.com/o2team/wxapp-market/pulls)。

