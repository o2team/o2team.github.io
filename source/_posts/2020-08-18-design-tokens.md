title: Design Tokens —— 设计与开发碰撞的火花
subtitle: Design Tokens，从设计系统中衍生出来的新概念，改变了设计和开发的交流方式，重新定义了从设计到开发到工作流。
date: 2020-08-18 19:44:02
cover: https://img13.360buyimg.com/ling/jfs/t1/145396/17/5761/255884/5f3bc385Ec8541aad/2554449668f7b88f.jpg
categories: Web开发
tags:
  - 设计
  - 前端开发
author:
  nick: 凹凸曼-TT
  github_name: TTImmortal
wechat:
  share_cover: https://img13.360buyimg.com/ling/jfs/t1/145396/17/5761/255884/5f3bc385Ec8541aad/2554449668f7b88f.jpg
  share_title: Design Tokens —— 设计与开发碰撞的火花
  share_desc: Design Tokens，从设计系统中衍生出来的新概念，改变了设计和开发的交流方式，重新定义了从设计到开发到工作流。
---
## 前言

在前端的开发的过程中，和前端合作最紧密的职位应该就是设计师了。在业务流程中，设计师将自己的交互稿、视觉稿以 1px 以内误差的期望交给开发者。但在这个过程中有几个不方便的地方：

1. 设计稿可拆解为布局、图案、文字、颜色等。其中布局、文字以及颜色这三者的样式编码需要花费前端开发者大量的时间。虽说近几年随着蓝湖等设计协同工作平台的诞生，可以在平台上获取到部分 css 代码，但是依然不能满足 web、iOS、Android 等多平台的情况；

2. 设计稿的更新无法及时在开发者的代码中体现，一是因为开发首先需要拿到新的设计稿，再根据标注甚至肉眼判断区别后更新代码；另一方面，设计稿中看似简单的改动可能导致较大范围的代码改动，例如字体大小等。

为了解决上述的问题，完善设计和开发之间的协作流程，Design Tokens 应运而生。

## 什么是 Design Tokens

在了解 Design Tokens 之前，需要先了解一下 Design System （即设计系统）的概念。这个概念在设计和开发的沟通流程中已经流行许久，在团队设计体系工程化的过程中不可或缺。

> A Design System is the single source of truth which groups all the elements that will allow the teams to design, realize and develop a product.

设计系统能够保证项目中设计稿与开发代码的一致——设计师将设计稿件中的内容组件化，在这个系统中上传每个组件的样式、文字属性、颜色色值等。而开发者可以通过这个系统获取自己需要的组件内容。但是这样仅仅是实现了一个协作平台，那么如何解决前文提到的两个问题呢？

Design Tokens 就是解决问题的核心。

> Design tokens are the visual design atoms of the design system.

Design Tokens 统一了样式属性和前端语言，把每种属性都当成是一个前端变量。

举个例子，将一种颜色色值传到系统中，然后转换成 token ，前端就可以直接取这个变量使用。即使是色值被修改，当变量名不变时，对整体代码是毫无影响的，开发者要做的仅仅是重新导入一份 token。

![颜色 token](https://img20.360buyimg.com/ling/jfs/t1/119882/33/3849/20141/5ed5fc01E9dacec72/96c76841ea7f39b8.png)

其中 token 的语言类型可以是 css、scss、yml 等。

## 如何开发 Design Tokens

在已知 Design Tokens 本质是一种变量的情况下，我们需要做的就是将颜色色值和文字属性变成对应的变量。

其中文字属性有比较特别的地方，它除了要把 font-family、font-size 等转换成变量之外，还需要将这些变量集合在一个 mixin 里面，方便整体使用。

所以我们需要完成的事情有如下四步，**获取属性**、**生成变量**、**生成 mixin** 、**输出结果**。其中获取属性不用多说，直接从数据库中拿到色值和文字的数据，然后分别写入 json 文件保存即可。

### 1.生成变量

我们转换的变量类型有 css、scss、less、stylus、json、yaml、Android、iOS 八种，其中 css、scss、less、stylus、Android 这五种通过 Theo 库来实现，其余为代码手动实现。

![design tokens](https://img13.360buyimg.com/ling/jfs/t1/119598/36/8785/131292/5ee71e21E8ac0c50d/bc45fdbfecf10b30.png)

#### Theo

先来介绍一下 [Theo](https://github.com/salesforce-ux/theo "Theo"),一个能够对样式进行 transform 和 format，随后输出对应变量的库。它的实现原理大致为，先将 json 文件中的值进行处理——色值处理为 rgb 或者 rgba，其余样式属性的数值进行单位统一。随后将处理过的值依据一定规则写入一个新的对象中。这个对象就是 Design Tokens。

直接上代码：

```js
static async formatWebOrtAndroid (type: string) {
  const res = await theo
    .convert({
      transform: {
        // 这里是类型，可以是 web或者是 android
        type: 'web',
        file: path.resolve(__dirname, 'data.json'),
      },
      format: {
        // 这里是需要输出的变量语言类型，css、scss、less、stylus、Android 等
        type,
      }
    })
    .then(data => {
      // 这里可以根据自己的需求进行数据处理
      return data
    })
    .catch(error => console.log(`Something went wrong: ${error}`))

  return res
}
```

#### 自定义方法

其余的 json、yaml、iOS 这三种需要我们手动实现。json 和 yaml 的实现非常简单，只需要稍微处理一下数据为我们需要的格式，然后写入 json 或者 yaml 文件即可。

iOS 略微复杂，它支持 Objective-c 和 Swift 两种类型的语言，所以要分别处理这两种语言。

- Objective-c 需要分为 .h 和 .m 两个文件，对色值进行如下处理：

  ```js
  // 先将变量名称写入
  let colorsH += `- (UIColor *)${colorName};\n`

  // 处理对应的变量名称下的色值
  let colorsM += `- (UIColor *)${colorName} {
  return [UIColor colorWithRed:(${red})/255 green:(${green})/255 blue:(${blue})/255 alpha:(${alpha})];}\n\n`

  // 处理首尾
  colorsH = `@interface UIColor (Colors)\n\n${colorsH}\n@end`
  colorsM = `#import "designTokenColor.h"\n\n@implementation UIColor (Colors)\n\n${colorsM}\n@end\n`
  ```

- Swift 的处理方法类似，直接上代码：

  ```js
  // 先将变量名称写入，并处理色值
  let colorsSwift += `class func ${colorName}() -> UIColor{\n
  return UIColor( red: (${red})/255, green: (${green})/255, blue: (${blue})/255, alpha: (${alpha}) );}\n\n`

  colorsSwift = `import UIKit;\n\nextension UIColor{\n\n${colorsSwift}\n}\n`
  ```

其实上述的自定义方法也可以直接定义在 Theo 中，因为 Theo 支持注册自定义 transform 事件以及自定义 format 事件，并且可以对获取到的数据进行二次处理。

### 2.生成 mixin

mixin 是 scss 中的名称，其实就是变量的集合，能够使得一系列属性能够被整体应用。由于 Theo 没有提供对应方法，所以我们这边采用手动生成的方式。目前只针对我们需要使用的文字属性进行了构建。

我们在第一步时已经生成了所有属性的变量，所以在构建 mixin 时只需将对应变量组合在一起即可，工作量并不大。但是由于需要构建的语言类型较多，针对不同语言要输出不同格式，所以依然写了部分相似代码。

以下为不同语言下的内容生成代码：

- css

  ```css
  --aotu: {
    font-family: var(--aotu-font-family);
    font-size: var(--aotu-font-size);
    font-style: var(--aotu-font-style);
    font-weight: var(--aotu-font-weight);
    letter-spacing: var(--aotu-letter-spacing);
    line-height: var(--aotu-line-height);
    opacity: var(--aotu-opacity);
    text-align: var(--aotu-text-align);
    color: var(--aotu-text-color);
    text-decoration: var(--aotu-text-decoration);
    text-transform: var(--aotu-text-transform);
  };
  ```

- scss

  ```scss
  @mixin aotu () {
    font-family: $aotu-font-family;
    font-size: $aotu-font-size;
    font-style: $aotu-font-style;
    font-weight: $aotu-font-weight;
    letter-spacing: $aotu-letter-spacing;
    line-height: $aotu-line-height;
    opacity: $aotu-opacity;
    text-align: $aotu-text-align;
    color: $aotu-text-color;
    text-decoration: $aotu-text-decoration;
    text-transform: $aotu-text-transform;
  }
  ```

- less

  ```less
  .aotu () {
    font-family: @aotu-font-family;
    font-size: @aotu-font-size;
    font-style: @aotu-font-style;
    font-weight: @aotu-font-weight;
    letter-spacing: @aotu-letter-spacing;
    line-height: @aotu-line-height;
    opacity: @aotu-opacity;
    text-align: @aotu-text-align;
    color: @aotu-text-color;
    text-decoration: @aotu-text-decoration;
    text-transform: @aotu-text-transform;
  }
  ```

- Android

  ```xml
  // 这里采用的是一个对象，这个对象中包含了各种数值
  <style name=${aotu.name}>
    <item name="android:fontFamily">${aotu.fontFamily}</item>
    <item name="android:textSize">${aotu.fontSize}</item>
    <item name="android:letterSpacing">${aotu.letterSpacing}</item>
    <item name="android:lineHeight">${aotu.lineHeight}</item>
    <item name="android:textStyle">${aotu.fontStyle}</item>
    <item name="android:textFontWeight">${aotu.fontWeight}</item>
    <item name="android:gravity">${aotu.textAlign}</item>
    <item name="android:textAllCaps">${aotu.textTransform === 'uppercase'}</item>
    <item name="android:alpha">${aotu.opacity}</item>
    <item name="android:textColor">${aotu.color}</item>
  </style>
  ```

至此，Design Tokens 的生成已经完成。

### 3.输出结果

我们将输出的各种语言结果保存在不同文件中，上传到服务器，将内容和获取链接返回给用户。用户可以直接通过链接下载文件进行使用，也可手动复制内容到自己的项目中进行使用。当设计师改变设计稿时，他们需要重新上传组件内容，Design Tokens 的内容也会随之改变。而对于开发者来说，只需要重新导入一个新的链接，就可以直接完成大量代码的更新，大大提升了设计师以及开发者的效率，减少了开发者的重复工作，降低了双方沟通成本和版本迭代成本。

## Design Tokens 应用

Design Tokens 已经被应用在凹凸的工作流中。

一个项目开启的时候，需要先在内部夸克平台创建一个项目，项目成员包括设计师与前端开发。随后设计师使用夸克平台提供的 Sketch 插件将项目中需要的色值和本文样式都保存到项目中。以下为插件中展示效果：

![文字属性](https://img13.360buyimg.com/ling/jfs/t1/146844/10/740/118537/5ee7295bEffd3aa81/3875089d5f81477d.png)

设计师完成上述步骤后，开发者进入夸克平台，在对应项目中可查看色值和文字样式。其中可以看到每个属性对应的变量名，并且可以对变量名作出修改。

![色值](https://img13.360buyimg.com/ling/jfs/t1/126952/20/3726/101383/5ed5c63aE1a2ecd49/0021bbd3c0a099a4.png)

所有的 Design Tokens 会集中展示在单独页面中，其中包括了下载链接，开发者直接通过链接下载内容，然后应用到自己的项目代码中即可。

![design tokens](https://img14.360buyimg.com/ling/jfs/t1/128442/7/4890/134587/5ee726e5E543ee381/394d362e5b232eb5.png)

## 总结

Design System 可能会是将来设计师与开发者合作的一种模式，目前相应的应用还不是非常广泛。并且一些小项目中，大家更倾向于口头交流、文件交流等，而不是花时间先去构建一个设计系统。但是随着公司或者部门项目扩张，积累变多，一个完善的设计系统以及高效的沟通平台将会是必须的。Design System 以及 Design Tokens 给我们带来了新的方式和新的可能，我们将会继续探索它。
