---
title: 探索 Design Token
subtitle: 智能代码解决了视觉还原工作整体的效能问题，但具体怎么让设计系统完美衔接研发工作流，降低设计研发协作成本，提升最终产出代码的可维护度，正是 DesignToken 可以发挥作用的地方。
cover: https://img30.360buyimg.com/ling/jfs/t1/133291/2/20517/1039000/61c822ccE26c11ccb/176c34be606c6620.png
category: 设计系统
tags:
  - 设计系统
  - DesignToken
author:
  nick: koppt
  github_name: koppthe
date: 2021-12-27 10:00:00
---

## 前言

近几年中台化业务兴起，各个业务团队为了能快速响应业务需求，提升研发效能，引入「设计系统」来解决模块化和规模化的问题。

回顾一下什么是设计系统，设计系统是由设计语言和模式库构成，在设计原则的指导下，通过统一的协作语言和科学的管理方法组织起来，并创建体验一致的用户界面的系统。

- 设计语言：设计系统的基础，与品牌识别和情感有关，包含颜色、字体、图标等基础设计原子；
- 模式库：一系列由设计原子组成的可复用的组件、模板等；

![](https://img30.360buyimg.com/ling/jfs/t1/212800/36/9224/49515/61c825c3E8767abc5/84414a401b00086b.jpg)

作为「设计系统」执行方的设计师与前端工程师，日常工作分别是在两个差异化较大的工作流中进行的。常规流程是设计师在设计工具（Sketch、Figma）中完成页面设计后，前端再参照绘制好的原型稿和标注稿，在代码环境中还原视觉稿 UI/UX。但在这个过程中时常会遇到以下问题：

1. 前端如何高效的获取上游设计的更新？
2. 视觉稿中可复用的设计系统原子，如何准确地传达给下游？
3. 视觉还原工作还能提效吗？


#### 前端如何高效的获取上游设计的更新？
设想这么一个场景，在产研交付的过程中，设计师在视觉稿中做的每次修改，都希望能快速响应到最终的产品中，尽可能做到敏捷。而实际工作中，设计上游变更后会告知前端（存在少数变更不告知的情况），前端再打开包含标注信息的设计工具和代码编辑工具完成需求修改。在这个场景中，设计师会通过口头或文字罗列视觉变更点，存在一定的沟通成本和信息丢失问题。在最终产品交付上线前，还会经过一轮「设计走查」环节（敏捷开发中经常忽略的一环），可能又会产生新的设计上游变更，如此反复。

#### 视觉稿中可复用的设计系统原子，如何传达给下游？
一个成熟的项目，往往会有自己的设计系统，设计原子作为系统中可复用程度较高的模块，已深度整合到设计工作流中。但由于设计和前端领域的概念不互通，导致可复用的信息不能有效传达。虽然设计师会整理包含字号层级，品牌色板，卡片阴影等信息的设计规范文件，但这些信息往往不能在视觉交付稿中很好的展现。要理解视觉稿中的设计原子，前端需要了解设计工具中的概念，如 Sketch 的图层样式、Symbols，Figma 的 Variants 等等。设计师是最了解页面样式复用逻辑的，但真正实现页面样式的却是前端工程师，这不可避免产生视觉还原误差。

#### 视觉还原工作还能提效吗？
设计师在绘制好页面视觉稿后，前端需要将视觉稿还原成可交互的页面，按古早的分工，这里需要三种角色参与，分别是视觉设计师、页面重构工程师（负责 HTML + CSS 等 UI/UX 逻辑）和前端工程师（负责数据渲染等逻辑）。本质上，视觉还原就是将设计工具中的视觉稿描述转换为 Web 能理解的数据描述，即 HTML + CSS。而这一块的信息转换工作正是团队近一年来尝试攻克的点，团队立项的「**Deco 智能代码项目**」通过设计工具插件从视觉稿原始信息中提取结构化的数据描述（D2C Schema），然后结合规则系统、计算机视觉、智能布局、深度学习等技术对 D2C Schema 进行处理，转换为布局合理且语义化的 D2C Schema JSON 数据，最后再借助 DSL 解析器转换为多端代码。

智能代码解决了视觉还原工作整体的效能问题，但具体怎么让设计系统完美衔接研发工作流，降低设计研发协作成本，提升最终产出代码的可维护度，正是 DesignToken 可以发挥作用的地方。

## 什么是 Design Token？

`Design Token` 是一种以平台无关的方式来表达设计决策的方法，以便在不同领域、工具和技术之间共享。在设计系统中的， `Design Token` 代表了构成视觉风格的，可复用的设计属性，例如颜色、间距、字体大小等等。 `Token` 被赋予一个特定的名称（`color.brand`），该名称对应于某个设计决策定义的值（`#3271FE`）。

但有别于设计变量（Design Variables）， `Design Token` 是一个具有平台无关性的抽象层，该抽象层的命名约定为设计属性创建了一种通用语言，可支持跨应用，跨平台，跨框架使用。

使用 `Design Token` 的工作流程图如下所示：

![](https://img14.360buyimg.com/ling/jfs/t1/204557/9/20014/198267/61c82643E1c534f3d/759ea38129c41604.jpg)


### Design Token 相关术语

按照 W3C Design Token 兴趣组最新拟定的草案，里面提到以下术语：

#### 1. 令牌（Token）
与 `Token` 关联的信息，至少是一个键值对，如：

![](https://img10.360buyimg.com/ling/jfs/t1/139284/13/24866/92343/61c82b7cE1fc20b8a/2e9e37a4f9ab54cb.jpg)

```css
color-text-primary: #000000;
font-size-heading-level-1: 44px;
```

#### 2. 设计工具（Design Tool）
Figma, Sketch, AdobeXD 等。

#### 3. 翻译工具（Translation Tool）
翻译工具是将 Design Token 从一种格式转换为另一种格式的工具，如：JSON to CSS
- [Theo](https://github.com/salesforce-ux/theo), Salesforce
- [Style Dictionary](https://amzn.github.io/style-dictionary/#/), by Amazon
- [Diez](https://diez.org/), by Haiku
- [Specify](https://specifyapp.com/)

#### 4. 分类（Type）
应用于 Token 的预定义分类，如设计系统中的样式属性分类：
- Color
- Size
- Typeface
- Border Style

示例如下：
```json
{
  "color": {
    "acid green": {
      "value": "#00ff66"
    },
    "hot pink": {
      "value": "#dd22cc"
    }
  },
  "typeface": {
    "primary": {
      "value": "Comic Sans MS"
    },
    "secondary": {
      "value": "Times New Roman"
    }
  }
}
```

#### 5. 集合（Groups）
指代特定类别的 Tokens 集合，例如 Brand, Component 等等

```json
{
  "brand": {
    "color": {
      "acid green": {
        "value": "#00ff66"
      },
      "hot pink": {
        "value": "#dd22cc"
      }
    },
    "typeface": {
      "primary": {
        "value": "Comic Sans MS"
      },
      "secondary": {
        "value": "Times New Roman"
      }
    }
  }
}
```

通过 `Style Dictionary` 翻译工具，可将上述标记文件转换为以下 Sass 变量：

```scss
$brand-color-acid-green: #00ff66;
$brand-color-hot-pink: #dd22cc;
$brand-typeface-primary: 'Comic Sans MS';
$brand-typeface-secondary: 'Times New Roman';
```

#### 6. 别名 / 引用（Alias / References）
Token 可以是别的 Tokens 的别名，而不是明确的值，这样带来的好处是：
- 有利于表达设计决策；
- 消除重复的 Token Values；

![](https://img14.360buyimg.com/ling/jfs/t1/210748/21/14031/106946/61c82843Eb006f1ca/cf101c4670b97109.jpg)

#### 7. 复合（Composite）
前面提到，Token 对应的值至少是一个键值对，也可以由多个键值对组成的复合类型。一个典型的例子是 Sketch 设计工具中的文本样式和图层样式：
- 文本样式：由表达文本样式的字体名称、文字粗细、颜色组合；
- 图层样式：由边框样式、颜色、容器背景色和阴影组合；

![](https://img13.360buyimg.com/ling/jfs/t1/216851/3/9233/200088/61c8287eE803b01b1/0199290440299e55.jpg)

## Design Token 的优势
`Design Token` 作为设计规范在工程化中的承接方式，为设计系统的迭代、维护和落地提供了很大的帮助。另外 Design Token 在设计师和工程师之间起到了协议规范的作用，而 Token 正是这套协议中的编码语言。

- **单一事实来源**：设计和研发双方如果严格按协议内容使用进行设计和编码，是能够让设计系统拥有单一的事实来源，即最终的产品视觉呈现以上游设计师输出的 Token 为准。同时也提供了一种用于记录和跟踪设计决策变更的存储库，也就是说上游设计师的视觉变更是可追溯的。
- **产品一致性**：当使用 Tokens 进行设计和实现时，样式变更可以更快地在整个产品套件中得到一致化的更新。
- **上下文驱动**：由于 Tokens 是可复用，可自由组合的，因此它们可以根据上下文和主题进行局部范围内的更新。例如页面背景色可根据系统主题进行颜色取值，如下图：

![](https://img30.360buyimg.com/ling/jfs/t1/218245/29/9165/558676/61c82955E9ca49cf6/3471de5e26508ae9.jpg)

## Design Token 实践
在「Deco 智能代码」项目中，研发可以给项目关联特定的设计系统（DSM），如「京东 APP 设计系统」，其中包含文本样式，图层样式，调色板等设计原子。Deco 在做布局样式还原时，会优先使用设计系统中已有的 Design Tokens 并进行替换，并会标记设计系统中暂未录入的设计变量，例如不在设计规范中的色值，字体大小等。

Design Token 的引入除了可以给布局还原的代码做样式精简外，还能为视觉走查提供便利。因为 D2C（DesignToCode）的技术方案中，产出的代码视觉还原度可以达到将近 100%，设计师可以更多地关注自身视觉稿的设计系统覆盖度，借助上述流程中被标记的「设计变量」列表，可以十分方便的确认设计误差，例如设计规范中规定的背景色为 `$brand-color-bg: F7F7F7`，但代码还原后的背景色未被替换为 `$brand-color-bg`，而是 `#F6F6F6`。

## 总结
Design Token 作为一种比较新型的设计决策表达方案，目前主流的设计工具如 Figma、Sketch、AdobeXD 已支持给设计属性做变量标记或引用共享值，再借助第三方的翻译工具如 Theo，将 Tokens 转换为开发人员直接使用的特定平台的代码。

虽说 Design Token 应用的并不广泛，但随着公司业务的扩张，必定会需要一套完善的设计系统，以一致的设计语言和视觉风格，帮助用户形成连续、统一的体验认知。到时候，Design Token 作为设计系统落地的承接方式，定会得到更广泛的使用。Figma 将前端工程化的思想（如：Variants）带入设计领域，我们未尝不能继续探索 Design Token 的可能性呢。

## 参考资料

- [DTCG Glossary](https://www.designtokens.org/glossary/)
- [Material Design Tokens](https://m3.material.io/foundations/design-tokens/overview)
- [Building better products with a design token pipeline](https://uxdesign.cc/building-better-products-with-the-design-token-pipeline-faa86aa068e8)
- [A guide to design tokens](https://www.invisionapp.com/inside-design/design-tokens/)
- [现代 Web 开发困局](https://mp.weixin.qq.com/s/PjpA4CBoC3Q0-gT5f5qlPg)