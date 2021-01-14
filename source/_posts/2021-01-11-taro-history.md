title: 凹凸技术揭秘 · Taro · 开放式跨端跨框架之路
subtitle: 
cover: http://img12.360buyimg.com/ling/jfs/t1/152763/23/14908/360163/6000642cE540fdc16/7e6cea05b1c06f31.jpg
categories: 凹凸
tags:
  - 凹凸
  - Taro
author:
  nick: 凹凸曼
  github_name: luckyadam
date: 2021-01-14 23:40:01
---

## 承载 Web 的主战场转移

2017 年 1 月 9 日凌晨，微信正式推出小程序，为移动端家族增加了新的业务形态和玩法，当大家还在探讨这一新兴平台能做什么的时候，京东率先上线了「京东购物」小程序，随后，更多的电商行业执牛耳者纷纷入驻小程序，从此，承载电商的主战场逐渐从需要自建流量的移动端 APP 向小程序倾斜。

小程序的出现，为电商行业的研发带来了巨大的挑战。继微信之后越来越多的头部流量互联网公司纷纷盯上小程序这一蛋糕，相继推出了各自的小程序平台，比如京东、阿里、百度、字节跳动、360等等，为了让我们的电商业务能快速移植到这些小程序平台，帮助我们的业务快速拓展渠道，我们开始了新的尝试。

![](https://img12.360buyimg.com/ling/jfs/t1/170191/39/2701/243568/600064ffE42940185/5dd1bccdf3904ee7.png)

我们开始尝试使用技术的手段，探索一种能够统一所有平台的新技术。


## 披荆斩棘——初代架构诞生

### 用 React 写小程序？

前面有提到，为了解决各大小程序平台带来的多端开发的痛点问题，社区先涌现出了 [WePy](https://github.com/Tencent/wepy) 和 [mpvue](http://mpvue.com/)，那我们为什么不直接采用，而要选择“造轮子”呢？

在当时的前端界言及前端框架，必离不开依然保持着统治地位的 [React](https://zh-hans.reactjs.org/) 与 [Vue](https://vuejs.org/)，这两个都是非常优秀的前端 UI 框架，而且在网上也经常能看到两个框架的粉丝之间热情交流，碰撞出一些思想火花，让社区异常活跃。

而我们团队也在 2017 年勇敢地抛弃了历史包袱，非常荣幸的引入了 React 技术栈。这让我们团队丢掉了煤油灯，开始通上了电，远离了刀耕火种的前端开发方式。为了解决当时业务环境对极致性能以及低版本 IE 浏览器兼容性的要求，我们还研发出了一款优秀的类 React 框架 [Nerv](https://github.com/NervJS/nerv) ，并因此对 React 开发思想以及技术栈理解更加深刻。

遗憾的是，当时社区并没有一款使用 React 开发小程序的框架。

与小程序的开发方式相比，React 明显显得更加现代化、规范化，而且 React 天生组件化更适合我们的业务开发，JSX 也比字符串模板有更强的表现力。**[那时候我们开始思考，我们能不能用 React 来写小程序？](https://aotu.io/notes/2018/06/25/the-birth-of-taro/)**

### 理性地探索

通过对比体验 小程序和 React ，我们还是能发现两者之间相似的地方，比如生命周期、数据更新方式以及事件绑定，都具有非常多相似的地方，这为我们使用 React 来小程序提供了非常良好的基础。

但是，我们也应该看到小程序和 React 之间的巨大的差异，那就是模板。在 `React` 中，是使用 `JSX` 来作为组件的模板的，而小程序则与 `Vue` 一样，是使用字符串模板的。这是两种完全不一样的东西，也是我们方案探索上的巨大障碍。所以，为了实现使用 React 来写小程序这一目标，我们必须解决两者之间巨大差异的问题。

### 解决差异

既然微信不支持 `JSX`，那我们只需要将 `JSX` 编译成小程序模板不久可以在微信上运行了吗，这一步可以通过 [Babel](https://www.babeljs.cn/) 来实现。

`Babel` 作为一个 `代码编译器` ，能够将 ES6/7/8 的代码编译成 ES5 的代码，其的编译过程主要包含三个阶段：

- 解析过程，在这个过程中进行词法、语法分析，以及语义分析，生成符合 [ESTree 标准](https://github.com/estree/estree) 虚拟语法树(AST)
- 转换过程，针对 AST 做出已定义好的操作，`babel` 的配置文件 `.babelrc` 中定义的 `preset` 、 `plugin` 就是在这一步中执行并改变 AST 的
- 生成过程，将前一步转换好的 AST 生成目标代码的字符串

再次回到我们的需求，将 `JSX` 编译成小程序模板，非常幸运的是 `babel` 的核心编译器 `babylon` 是支持对 `JSX` 语法的解析的，我们可以直接利用它来帮我们构造 AST，而我们需要专注的核心就是如何对 AST 进行转换操作，得出我们需要的新 AST，再将新 AST 进行递归遍历，生成小程序的模板。

以上仅仅是我们转换规则的冰山一角，`JSX` 的写法极其灵活多变，我们只能通过穷举的方式，将常用的、React 官方推荐的写法作为转换规则加以支持。

### 初代架构诞生

经过我们一次次的探索，我们已经可以将类 React 代码转成可以在小程序环境运行的代码了。但是我们激动之余，冷静下来继续思考，我们还能不能干点别的有意思的事情呢。

我们发现，在平常的工作中，我们业务通常有一些“多端”的需求。就是同一个业务或页面，需要同时适配 小程序、H5 、甚至 React Native 。这个时候，你就会发现，差不多的界面和逻辑，你可能需要重复写上好几轮。

因此，我们希望希望在解决使用 React  开发微信小程序的同时，还能同时是适配到 H5 端、移动端、以及各平台的小程序。`Write once, run anywhere`，相信是所有工程师的梦想。

但是仔细思考我们又会发现，仅仅将代码按照对应语法规则转换过去后，还远远不够，因为不同端会有自己的原生组件，端能力 API 等等，代码直接转换过去后，并不能直接执行，还需要运行时的适配。因此，我们按照微信小程序的组件库与 API 的标准，在其他端（H5、RN）分别实现了组件库和 API 库。

![Taro 1 架构](https://storage.360buyimg.com/taro-resource/book/taro2.png)

Taro 从立项之初到架构稳定差不多用了三个月左右的时间，从最初的激烈讨论方案，各种思想的碰撞，到方案逐渐成型，进入火热的开发迭代，再到现在的多个平台小程序端、H5 端和 RN 端的顺利支持，Taro 的未来已来。



## 初露锋芒——GitHub 开源

2018 年 6 月 7 日，**多端统一开发框架** - Taro 正式开源。

作为首个支持以 React  语法写微信小程序并适配到多端的开发框架，Taro 一鸣惊人。 开源不到两个月，在 GitHub 上有 6600 多个 Star，连续数周霸榜 Github Trending；同时已经处理近 300 个 Issue ，还有 100 多个在等待反馈与优化；在公司内、外主动反馈的使用 Taro 的项目已有十多个。

截至 2019 年 12 月 18 日，Taro 已拥有 22254 Stars 和 250 名 Contributors，社区主动提交的开发案例 150+：[taro-user-cases](https://taro-docs.jd.com/taro/showcase)，其中不乏多端案例。

截止 2021年 1 月 11 日，Taro 已拥有 27914 Star ，位列小程序开发框架前列。

![](https://img11.360buyimg.com/ling/jfs/t1/160925/27/2356/79333/5ffc3c47E4e6202a9/4f117952699af9c8.png)


Taro 团队不断跟进社区里提出的问题和反馈，一直保持着高速迭代，并围绕 **多端适配、开发体验以及社区共建** 三个方面持续优化 Taro 框架。

![](https://img20.360buyimg.com/ling/jfs/t1/167067/40/2478/261643/600064ffEc5a1baa8/95e545c5c58e3ec3.png)


为了方便开发者快速开发项目，我们基于 Taro 推出了业内首款小程序多端组件库 [Taro UI](https://github.com/NervJS/taro-ui)，

![Taro UI 二维码](https://img10.360buyimg.com/ling/jfs/t1/135018/11/4532/36181/5f0d6c9cE866ef96d/31a68377d6635f48.jpg)

在多端适配方面，我们一直持续跟进，成为社区适配端最多的小程序开发框架。

为了更好的开发体验，我们支持了 React Hooks、CSS Modules、Mobx 等。

在社区共建方面，我们推出了 Taro 论坛、Taro 物料市场等平台，后面发布了 [社区共建计划](https://taro-docs.jd.com/taro/docs/join-in)。

在跟进业务的同时，我们还需要不断跟进社区里提出的问题和反馈，因而就要不断加班加点地去完成，虽然有时会觉得很累，但是技术上的成就感以及能帮助到更多开发者时的满足感还是不断地激励着我们前进，让 Taro 项目越来越好。

## 筚路蓝缕——一段痛苦摸索的升级之旅

Taro 在 GitHub 上开源之后虽然收获了非常多的赞誉，短短的时间内就突破了 10000 Stars，但由于 Taro 初期的自定义组件架构设计得非常复杂，导致使用组件开发的时候总会引起非常多的问题，一直为许多用户诟病。

在 Taro 设计的初期，由于微信小程序刚推出的自定义组件功能并不完善，实现不了传入自定义函数等问题，无法满足组件化灵活使用的需求，所以 Taro 的组件化架构是采用 **template** 标签来实现的。

使用  **template** 方案来实现的组件化架构在通常情况下运行良好，但面对复杂循环嵌套输出组件的时候则问题频出，主要原因是：

- JS 逻辑与模板隔离，需要分别处理，导致组件传参非常麻烦，难以对齐
- template 实现的自定义组件无法嵌套子组件

所以，在 Taro 最初的时光，自定义组件的问题一直是我们抹不去的痛，作为官方团队，在痛苦思索解决方案的同时，还要面对社区不断的问题反馈和质疑，让我们总觉得前途一片灰暗。

但前人的经验告诉我们，不能就此放弃，鲁迅先生曾经说过「此后如竟没有炬火，我便是唯一的光」。我们在  **template** 方案挣扎良久之后，终于还是将目光投向了小程序自带的自定义组件身上。

正所谓山穷水复疑无路，柳暗花明又一村，小程序的自定义组件恰好有了一波更新，经过数个日夜加班探索之后，之前困扰我们的问题都得到了一一解决，完美实现了新的自定义组件架构，带来了更加稳定的版本。

在新的架构中，我们会把 Taro 的组件直接编译成小程序的原生组件的 `Component` 方法调用，再通过运行时的适配，来对组件参数、生命周期适配、以及事件传入等进行处理，借助小程序的组件化能力来实现 Taro 的组件处理。

经过这一版方案重构之后，Taro 的稳定性与可靠性得到了质的飞跃，社区的好评声不断，而 Taro 的关注数也得到陡峭的增长。这一版架构方案也成了 Taro 持续时间最久的方案，为 Taro 日后成为「一款值得信赖」的多端方案打下了坚实的基础。

这是一段筚路蓝缕的艰苦创业之旅，对于 Taro 团队来说也是一段非常宝贵的经验。没有一直一帆风顺的旅途，唯有不轻言放弃和勇于开拓才能云开见日，让我们走的更远。

## 高歌猛进——不断地突破自我
<!-- by 伟涛 -->
在完成了自定义组件架构的改造之后，Taro 开始了全速发展之路。

在 2018 年 11 月份，Taro 推出了 1.1 版本，完成了百度、支付宝小程序的适配支持，成为业界首个同时适配多个小程序平台的多端开发框架，并且在适配期间，Taro 团队和百度、支付宝小程序官方团队建立了联系，为对方小程序的发展提出了非常多的建设性意见。与此同时，Taro 成为百度小程序官方推荐使用框架之一。

![](http://storage.360buyimg.com/taro-resource/book/baidu.png)

而短短一个月之后，2018 年 12 月份，Taro 火速推出了 1.2 版本，这是一个非常具有创新意义的版本，在这个版本中，Taro 首创了小程序原生代码反向转换技术，能够将小程序原生代码反向转换成 Taro 代码。原有的微信小程序通过 Taro 转换，就能快速移植到其他平台，这为业务的快速扩张提供了巨大的想象空间，为业务的高效交付提供了极大的助力。

而「京东快递」业务正是反向转换特性成功应用的一个典范案例。最初「京东快递」只有微信小程序平台，通过 Taro 的反向转换特性，以极低的成本快速移植到百度、头条小程序平台，并且可以只维护一份代码，同时维护 3 端应用，极大地降低了维护成本。

在 Taro 1.2 发布之后，Taro 在业界收获了巨大的赞誉和关注：GitHub 上 Stars 数量超过 19000 粒，NPM 下载量也稳居同类开发框架之首，同时 Taro 团队也和腾讯、百度、华为等数十家业界巨头的研发团队展开了深入和有效的合作。

时间匆匆而逝，来到了 2019 年 6 月，时隔半年，我们终于发布了 Taro 1.3，这是我们酝酿最久的版本：经历了横跨 6 个月的开发时间，近 2000 次的代码提交，同时有近百位开发者的共同参与。在 Taro 1.3 中，我们不仅仅带来了对 QQ 小程序的支持，同时还支持了快应用，成为业界支持平台最多的多端开发框架，而更重要的是，在这个版本中我们成功将业界火热的 React Hooks 搬到了 Taro 中，支持让用户使用 React Hooks 的方式来开发小程序，成为业界首创。

从 Taro 正式版发布，到 Taro 1.3，可以看出 Taro 一直不断使用创新的理念打磨自我，以创新为使命，为业界带来体验优异的多端开发解决方案。
## 拥抱变化——为未来思考
<!-- by 伟涛 -->
尽管 Taro 一直保持超高的迭代速度，但自从自定义组件架构改造之后，Taro 的整体架构设计没有发生太大变化，这让 Taro 在这个时刻在变化的时代稍显佛系，且对于一个时刻想要突破自己的技术团队来说，常规性质的维护工作，显然无法安抚我们躁动的心，毕竟人的梦想，是永远不会停止的，所以我们决定启动一系列的颠覆式重构设计。

我们首先从 CLI 开始入手进行改造，众所周知，原来 Taro CLI 的编译构建系统是自研的，整个构建系统逻辑复杂，要考虑的边际条件众多，这就导致了以下问题：

- 维护困难，每次需要新增一个功能，例如支持解析 Markdown 文件，就需要直接改动 CLI，不够灵活
- 难以共建，CLI 的代码非常复杂，而且逻辑分支众多，让很多想要一起共建的人难以入手
- 可扩展性偏低，自研的构建系统，设计之初没有考虑到后续的扩展性，导致开发者想要添加自定义的功能无从下手

基于以上问题，我们决定使用 Webpack 来实现编译构建，于是诞生了 **2.0**。

Taro 2.0 的 CLI 将会变得非常轻量，只会做区分编译平台、处理不同平台编译入参等操作，随后再调用对应平台的 runner 编译器 做代码编译操作，而原来大量的 AST 语法操作将会改造成 Webpack Plugin 以及 Loader，交给 Webpack 来处理。

![](https://storage.360buyimg.com/2.0/taro-cli.001.png)

相较于旧的构建系统，新的小程序编译带来了以下优势：

- 利于维护，大量的逻辑交由 Webpack 来处理，我们只需要维护一些插件
- 更加稳定，相较于自研的构建系统，新的构建会更加稳定，降低一些奇怪错误的出现概率
- 可扩展性强，可以通过自行加入 Webpack Loader 与 Plugin 的方式做自己想要的扩展
- 各端编译统一，接入 Webpack 后，Taro 各端的编译配置可以实现非常大程度的统一

可以看到新的构建系统会有很大的进步。同时，更重要的是，基于 Webpack，我们可以在小程序中尝试更多的特性与技术，例如通过 tree shaking 来优化代码包大小等等，让小程序开发更加与业界发展同步，让 Taro 更加拥抱社区。

Taro 2.0 只是一个开始。

在 10 年代最后一场 GMTC 全球大前端技术大会上，Taro 团队向大家展示了 [小程序跨框架开发的探索与实践](https://taro-docs.jd.com/taro/blog/2020-01-02-gmtc) 的艰辛旅程，同时也提前曝光了正在紧密开发中的 Taro Next。

那是一个完全区别于以往的版本，一条与现在 Taro 截然不同的道路，预示着 Taro 正在革自己的命。

节物风光不相待，桑田碧海须臾改。

20 年代呼啸而来，下一个 10 年，很多框架都会死去，很多技术也会焕然而生，没有什么是不变的，唯一不变的只有变化，我们能做的也只能是拥抱变化，为未来思考。

## 乘风破浪——新架构起航

正如前文所提到的，Taro 迎来了全新的架构。

不同于 Taro 1、2 时代的架构，新的架构主要基于运行时，我们都知道使用 React 开发 web，渲染页面主要依靠的是 react-dom 去操作 DOM 树，而 React Native 依靠的是 Yoga 布局引擎，但是我们却能通过 React 将他们联系在一起，这主要是通过抽象的 Virtual DOM 技术来实现的，通过 Virtual DOM 达到跨平台统一的目的。而小程序中虽然没有直接暴露 DOM 和 BOM API，但是我们却可以类比 React 和 React Native 的思想，在小程序中模拟实现 DOM 以及 BOM 的 API，从而实现直接将 React 运行到小程序环境中的目的，这就是 Taro 新架构的由来。

![](https://storage.360buyimg.com/taro-resource/book/taro3.png)

在新架构加持下，Taro 不再仅局限于 React 阵营，可以不再限制使用的框架语法，而 Taro 官方内置了 React、Nerv、Vue2、Vue3 四种框架的支持。

Taro2 到 Taro3，是一次技术的跃迁，也是一次创新的胜利，更是 Taro 团队不断探索，永不止步精神的体现。Taro 这艘大船又重新杨帆起航，带着初心再次出发。

乘风破浪破浪会有时，直挂云帆济沧海。


## 众擎易举——开放式架构

自 2020 年 7 月初 Taro 正式发布了 Taro 3，至 12 月半年时间已然略去。期间我们不断地修复着问题，同时也在构想着下一个 minor 版本。

面对小程序平台越来越多的大环境，Taro 是选择偏安一隅，只支持部分的主流小程序，还是成为所有小程序平台开发、多端转换的基础设施，Taro 在 v3.1 给出了答案：开放式架构。

基于 Taro 3 的架构，对于单一平台的兼容性代码分布于 Taro 核心库的各个角落，涉及编译时与运行时等部分。支持一个新的平台需要改动所有的这些地方，开发复杂度高，同时社区也难以参与贡献。

因此我们萌生了打造一个**开放式框架**的想法。目标是可以通过插件的形式扩展 Taro 的端平台支持能力：

- 插件开发者无需修改 Taro 核心库代码，即可编写出一个端平台插件。
- 插件使用者只需安装、配置端平台插件，即可把代码编译到指定平台。
- 开发者可以继承现有的端平台插件，然后对平台的适配逻辑进行自定义。

![Taro 3.1 架构图](http://storage.jd.com/cjj-pub-images/platform-plugin-all.png)

我们把内置支持的 6 个平台封装成了插件，CLI 默认会全部加载这些插件。封装的过程中，我们检索了各小程序最新的组件、API，并全数进行更新与支持，对齐各小程序最新的能力。而借助开放式架构，我们编写了若干端平台插件，开发者安装后即可使用。

## 结语

开源不易，贵在坚持。Taro 一路走来，有众多开发者相伴，进入过 [中国活跃度 Top 5 的开源项目](https://www.infoq.cn/article/dCY0AHH71rBBjq3pIfh7)，像河水不断奔涌向前的 Taro 既争先也争滔滔不绝。 Taro 团队衷心感谢各位参与过本项目开源建设的朋友，无论是为 Taro 提交过代码、建设周边生态，还是反馈过问题，甚至只是茶余饭后讨论、吐槽 Taro 的各位。


