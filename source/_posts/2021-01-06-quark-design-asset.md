title: 凹凸技术揭秘 · 夸克设计资产 · 打造全矩阵优质物料
subtitle: 夸克平台是数字化设计资产管理平台，集物料收集、拓展、外接与输出能力于一身，内容涵盖组件、模版、图标、字体、动效、图片、素材、VI等。
cover: https://img11.360buyimg.com/imagetools/jfs/t1/151757/39/13862/442858/5ff5bb11E2010d0f3/587487a88aaab646.png
categories: 凹凸
tags:
  - 凹凸
author:
  nick: 凹凸曼
  github_name: muunnw
date: 2021-01-06 21:01:06
---

# 1、**诞生背景**

近几年围绕业务中台化的场景，涌现了很多中台，有面向开发者的，有面向产品的，有面向运营团队的，但是却缺少一个可以提供给设计师协作的中台，设计师与开发、交互的协作仍处于源文件交换的原始刀耕火种时代。

上下游之间的合作成本高，没有统一的规范性。往往一个视觉稿会经历反反复复的改版，文件的传输只能使用网盘管理，没有一个统一存储和管理的平台。项目团队的设计规范落地效果不佳，公共的设计素材共享不便，同时各个团队的设计资产无法共享流通，资源无法进行整合，甚至存在重复设计等问题。

我们通过分析当前的痛点，参照现有的协作流程以及未来的发展趋势，是否可以有一套供各个角色都能使用的设计物料平台呢？按照这个思路，我们开发出了一套京东自己的设计资产管理平台，命名它为「夸克」。夸克在物理学上是构成物质的基本粒子，夸克相互结合组成万物，我们是用夸克来比喻那些构成组件、模块、页面、网站的所有物料，是我们星辰大海中的重要基石。

# 2、**平台介绍**

夸克平台是数字化设计资产管理平台，集物料收集、拓展、外接与输出能力于一身，内容涵盖组件、模版、图标、字体、动效、图片、素材、VI等。

![平台介绍](https://img12.360buyimg.com/imagetools/jfs/t1/154772/39/13727/209633/5ff5aff7E21616d77/8478623a1c39112e.png)

夸克平台目前提供 Sketch 插件、WEB 端和 CLI 端三种形式进行物料收集与共享，覆盖产品、设计、研发、运营和商家等用户人群。

夸克平台为每个项目设立物料管理空间，各个团队持续丰富夸克平台各类型设计资产，统一在线管理和协作，最大化提升业务整体设计效率，从而达到增效降本的目标。

# 3、**平台能力**

## 3.1 DSM能力

近几年设计系统作为重要的设计资产及解决方案，其被重视的程度与日俱增。由于原始的设计方法已经无法满足爆发式增长的设计需求，设计师开始寻求工程化的解决方案。于是引入原子设计理论（Atomic Design）解决问题，即使用一种有条理创建模式库的方法，结合软件开发的组件化思想，从最原始的原子出发，逐层构筑更高级别的组织，很好地解决了模块化和规模化的问题，这就是设计系统的前身。

![DSM能力](https://img14.360buyimg.com/imagetools/jfs/t1/162683/28/1304/169854/5ff5aff6Ebba73976/b3bf701e492f7ab4.png)


### 3.1.1 什么是设计系统

设计系统是由设计语言和模式库构成，在设计原则的指导下，通过统一的协作语言和科学的管理方法组织起来，并创建体验一致的用户界面的系统。

**设计语言：** 设计系统的基础，与品牌识别和情感相关，包含颜色、字体、图标等基础设计原子；

**模式库：** 一系列由设计原子组成的可复用的组件，模板等。

![设计系统](https://img12.360buyimg.com/imagetools/jfs/t1/162352/4/1314/47803/5ff5aff6Ed6eafb95/a55f8e0d956b1f2a.png)

### 3.1.2 DSM 资产库

在设计系统中，设计语言和模式库就好比「原子设计理论」中的原子、分子、组织、模板、页面，他们是保证团队协作一致性的基础，而设计规范更像是一份说明文档，指导设计师在设计过程中遵循一定的规则。

夸克作为数字化的设计资产平台，需要解决设计系统数字化的问题。

那设计系统中，有哪些可被数字化存储的物料资产呢？结合目前流行的 Sketch 设计软件来看，我们可以给设计语言和模板库做个映射，看看 Sketch 原生支持哪些设计系统中的原子物料。

Sketch 之所以能打败 PhotoShop 成为最流行的 UI 设计工具之一，是因为软件大量运用了「复用」的工程化思想解决设计问题，如 Symbols, TextStyle, LayerStyle, SharedStyles 等

* Symbol：类似于工程中的代码组件，并提供组件嵌套、实例化等开发流程中常见的操作；
* Color：在 Sketch 中不单单是颜色的色值，还包含渐变色及图片填充；
* TextStyle：针对文本图层的共享样式，类似于 CSS 中的公共 SCSS Font Mixins；
* LayerStyle：针对容器图层的共享样式，包含 Background、BoxShadow、BorderRadius 信息。

### 3.1.3 如何沉淀 DSM 数字化资产

我们借助 Sketch 图层解析的能力，开发了「夸克 Sketch 插件」，将视觉稿中的抽象信息序列化为可存储的数据，并以项目库的形式承载 Sketch 视觉稿中沉淀的数字化资产。

基于 Sketch 目前支持的共享设计元件，我们将 DSM 物料分为六大类：

* 组件：图层或图层组，即 Layer、LayerGroup、Symbols；
* 模板：跟组件类似，但颗粒度更大，普遍以页面的形式沉淀，即 Artborad；
* 图标：图标类型的矢量图形，即 Path；
* 颜色：色值、渐变色、图片填充；
* 字符样式：SharedStyles 中的 TextStyles；
* 图层样式：SharedStyles 中的 LayerStyles。

![DSM 数字化资产](https://img14.360buyimg.com/imagetools/jfs/t1/160691/4/1358/42910/5ff5aff6E66f69488/8257468af2b63a0d.png)


DSM 数字资产本质上是 Sketch 视觉稿中的共享设计元件，得益于 Symbols 和 SharedStyles 自带的同步能力，团队成员在调用组件物料时，能及时同步最新的组件规范。当视觉规范发生变更，如主题色，字体样式调整，使用到这些共享样式的视觉组件也会同步被更新，这非常利于设计流程中的协作。

从设计系统到 DSM，再到最终研发的视觉代码还原，通过 DSM 的建立，设计的产出有了统一标准，开发迭代的效率也得到显著提升，设计师也能更专注于深耕体验和细节，实现设计向产品的赋能。

## 3.2 组件库

所有页面或应用，从底层分解开来，都是由各种大大小小的组件所构成。随着公司业务的扩展，面对各式各样的前端业务需求，我们需要一套标准化、规范化的组件，以提高我们的开发效率且给业务赋能，夸克组件库就应运而生了。

对于开发者而言，夸克组件库分为「基础组件库」、「业务组件库」、「自由组件库」三类。

### 3.2.1 基础组件库

基础组件库（也指 Taro UI），是一套居于 Taro 框架开发的多端 UI，包括：通用类、布局类、导航类、数据输入类、数据展示类、反馈类、手势类等多种样式类型。我们针对设计师跟开发者都有对应的使用方式。

设计师可以通过下载源文件或插件的方式来使用：

![基础组件库](https://img13.360buyimg.com/imagetools/jfs/t1/154639/36/13605/175209/5ff5aff6Ed6348aab/4fc700365e836caf.png)

开发者可以通过在 Taro 文件中引入组件的方式来使用组件，例如：

```plain
import { AtButton } from 'taro-ui'
```
每个组件都有详细的参数可以供开发者配置与参考，而且基础组件具有以下特性：

* 多端适配：一套组件可以在微信小程序、京东小程序、百度小程序、H5 等多端适配运行；
* 组件丰富：提供丰富的基础组件，覆盖大部分使用场景，满足各种功能需求；
* 按需引用：可按需使用独立的组件，不必引入所有文件，可最小化的注入到项目中。

### 3.2.2 业务组件库

业务组件库是由夸克平台官方出品的一套标准化、规范化的电商导购类组件库。通过梳理出日常商城业务中的常用业务组件，最终形成一套可快速复用、便捷维护、功能覆盖全面的组件库。业务组件的 UI 更是由 JDC 设计师设计，提供多种配色方案、多种排版模式、多项自定义调整样式，足以满足大部分日常页面需求。

业务组件本质上是一个使用 Taro 框架开发的代码包，居于 Taro 的多端支持能力，可以完美适配微信小程序、京东小程序、百度小程序、H5 等环境。在项目中，开发者可以通过 tarball 的组件方式安装使用，也可以直接下载代码包使用。

![业务组件库](https://img11.360buyimg.com/imagetools/jfs/t1/163416/1/1292/185582/5ff5aff6Ea72c29dd/dcc919c15bd03c89.png)

### 3.2.3 自由组件库

自由组件库是由开发者自由开发，不依赖夸克组件开发框架、不需要遵守夸克组件开发文档规范，最终以独立代码包或 NPM 在线安装的方式，共享到夸克平台，提供给其他开发者或开发团队下载使用的组件类型。

在夸克平台，开发者可以上传并管理自己开发的自由组件，也可以使用搜索去下载其他人共享的组件。

![自由组件库](https://img12.360buyimg.com/imagetools/jfs/t1/169118/29/1301/224597/5ff5aff5E25ed9ae8/2f77b9e560826913.png)

## 3.3 字体库

字体库是物料中不可或缺的一部分，个性化的字体不仅能提升用户的良好体验，还可以提升项目的设计品牌化和个性化等。

### 3.3.1 版权字体下载

夸克字体库将字体分为八类，包含黑体、宋体、仿宋、楷体、圆体、书法体、手写体和装饰体。然后将京东的授权字体和开源免费字体进行分类归纳，一共收录了2000+的字体包源文件和1000+的字体家族。

使用者可以通过关键字检索或者类别筛选（繁简/字形）查找京东版权字体家族，点击右侧「下载」按钮便可直接下载使用。

![版权字体下载](https://img10.360buyimg.com/imagetools/jfs/t1/167241/5/1261/184084/5ff5aff5E6b33e249/f1dbc94ba7822e7b.png)

### 3.3.2 在线字体生成

往往一个字体包文件是偏大的，虽然小的字体可以有十几K，但是大的字体可以去到上百兆，直接使用会出现加载慢、体验差、浪费流量等问题，而且在我们的应用场景里一般不会使用到一个字体包里的全部字体。

因此，夸克平台的字体库提供了字体切片的功能。它可以对字体包文件进行按需提取，然后将提取的片段生成一个新的字体格式文件，从而大幅的降低了字体包文件大小。

![在线字体生成](https://img10.360buyimg.com/imagetools/jfs/t1/151297/19/14406/168166/5ff5aff5E636ee4c2/324343be1c96cec5.png)

# 4、**对外赋能**

## 4.1 物料市场

平台目前提供了物料市场功能，它将所有物料进行扁平化搜索，缩短使用路径，赋予更便捷的对外能力。目前已有300+京东各设计团队入驻，涉及400+业务线，共同组成物料资源共享生态，实现设计资源互通共赢。

![物料市场](https://img10.360buyimg.com/imagetools/jfs/t1/167652/27/1238/615870/5ff5aff4Eda257506/b8eb4a051a2625c5.png)

## 4.2 羚珑智能页面设计

夸克平台将组件库能力服务于可视化搭建，通过夸克平台为[「羚珑智能设计平台的页面设计」](https://ling.jd.com/design)输送组件物料，优化研发效能发挥，助力用户可视化地快速搭建页面。

![羚珑智能页面设计](https://img10.360buyimg.com/imagetools/jfs/t1/169711/16/1319/127323/5ff5aff3Ebdda5970/4956d6d20171d635.png)

## 4.3 京东内部其他设计团队

平台还将能力持续输出到京东内部其他团队中，如京东首页项目、京东数科、京东金融、7Fresh等。用物料原材料的方式不断提供快速发展的动力。

![京东内部其他设计团队](https://img14.360buyimg.com/imagetools/jfs/t1/156135/23/4623/137699/5ff5aff3E893cf2dc/f9b7b2d43978f860.png)

# 5、**未来展望**

未来，会有更丰富多样的数字资产沉淀。物料种类在未来还会继续拓宽，让数字资产的触角涵盖更广，比如后续会考虑接入音效物料，视频物料，版权信息等。

同时，会强化更多端的触达能力，在物料的沉淀与输出赋予多端化、云端化。比如扩展资产沉淀的方式，增加 Figma 和 AdobeXD 等插件工具，尽可能地融入现有设计工作流中，为设计师提供便捷的获取和沉淀物料的能力。还可以与兄弟中台进行上云协作，作为中台上云产品的一部分，赋予云端产品全矩阵物料的能力。