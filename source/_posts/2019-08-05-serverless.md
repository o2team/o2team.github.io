title: serverless
subtitle: Serverless 架构即“无服务器”架构，它是一种全新的架构方式，是云计算时代一种革命性的架构模式
cover: https://img11.360buyimg.com/jdphoto/s1400x778_jfs/t1/79878/5/14297/46119/5dba9405E0b02d3f0/bb14351358ebb864.jpg
categories: Web开发
tags:
  - serverless
  - 无服务
  - FaaS
  - BaaS
author:
  nick: 高大师
  github_name: pfan123
date: 2019-08-05 10:27:06
---

<!-- more -->

Serverless 架构即“无服务器”架构，它是一种全新的架构方式，是云计算时代一种革命性的架构模式。与云计算、容器和人工智能一样，Serverless 是这两年IT行业的一个热门词汇，它在各种技术文章和论坛上都有很高的曝光度。

> 目前行业可能更多处在容器 Docker+Kubernetes, 利用 IaaS、PaaS和SaaS 来快速搭建部署应用

## 什么是Serverless

Serverless 圈内俗称为“无服务器架构”，Serverless 不是具体的一个编程框架、类库或者工具。简单来说，Serverless 是一种软件系统架构思想和方法，它的核心思想是用户无须关注支撑应用服务运行的底层主机。这种架构的思想和方法将对未来软件应用的设计、开发和运营产生深远的影响。

所谓“无服务器”，并不是说基于 Serverless 架构的软件应用不需要服务器就可以运行，其指的是用户无须关心软件应用运行涉及的底层服务器的状态、资源（比如 CPU、内存、磁盘及网络）及数量。软件应用正常运行所需要的计算资源由底层的云计算平台动态提供。


## Serverless的技术实现

Serverless 的核心思想是让作为计算资源的服务器不再成为用户所关注的一种资源。其目的是提高应用交付的效率，降低应用运营的工作量和成本。以 Serverless 的思想作为基础实现的各种框架、工具及平台，是各种 Serverless 的实现（Implementation）。Serverless不是一个简单的工具或框架。用户不可能简单地通过实施某个产品或工具就能实现 Serverless 的落地。但是，要实现 Serverless 架构的落地，需要一些实实在在的工具和框架作为有力的技术支撑和基础。

随着 Serverless 的日益流行，这几年业界已经出现了多种平台和工具帮助用户进行 Serverless 架构的转型和落地。目前市场上比较流行的 [Serverless 工具、框架和平台](https://serverless.com)有：

- AWS Lambda，最早被大众所认可的 Serverless 实现。
- Azure Functions，来自微软公有云的 Serverless 实现。
- OpenWhisk，Apache 社区的开源 Serverless 框架。
- Kubeless，基于 Kubernetes 架构实现的开源 Serverless 框架。
- Fission，Platform9 推出的开源 Serverless 框架。
- OpenFaaS，以容器技术为核心的开源 Serverless 框架。
- Fn，来自 Oracle 的开源 Serverless 框架，由原 Iron Functions 团队开发。

> 列举的 Serverless 实现有的是公有云的服务，有的则是框架工具，可以被部署在私有数据中心的私有云中（私有云 Serverless 框架 OpenWhisk、Fission 及 OpenFaaS）。每个 Serverless 服务或框架的实现都不尽相同，都有各自的特点。

## FaaS与BaaS

IT是一个永远都不消停的行业，在这个行业里不断有各种各样新的名词和技术诞生，云计算（Cloud Computing）的出现是21世纪IT业界最重大的一次变革。云计算的发展从基础架构即服务（Infrastructure as a Service， IaaS），平台即服务（Platform as a Service，PaaS），软件即服务（Software as a Service，SaaS），慢慢开始演变到函数即服务（Function as a Service，FaaS）以及后台即服务（Backend as a Service，BaaS），Serverless 无服务化。

![云计算演变](http://img.pfan123.com/severlessprogress.png)

目前业界的各类 Serverless 实现按功能而言，主要为应用服务提供了两个方面的支持：函数即服务（Function as a Service，FaaS）以及后台即服务（Backend as a Service，BaaS）。

![serverless结构](<http://img.pfan123.com/serverlessconstruct.jpeg>)

#### 1.FaaS

FaaS 提供了一个计算平台，在这个平台上，应用以一个或多个函数的形式开发、运行和管理。FaaS 平台提供了函数式应用的运行环境，一般支持多种主流的编程语言，如 Java、PHP 及 Python 等。FaaS 可以根据实际的访问量进行应用的自动化动态加载和资源的自动化动态分配。大多数 FaaS 平台基于事件驱动（Event Driven）的思想，可以根据预定义的事件触发指定的函数应用逻辑。

> 目前业界 FaaS 平台非常成功的一个代表就是[AWS Lambda](https://aws.amazon.com/lambda/)平台。AWS Lambda 是 AWS 公有云服务的函数式计算平台。通过 AWS Lambda，AWS 用户可以快速地在 AWS 公有云上构建基于函数的应用服务。

#### 2.BaaS

为了实现应用后台服务的 Serverless 化，BaaS（后台即服务）也应该被纳入一个完整的 Serverless 实现的范畴内。通过 BaaS 平台将应用所依赖的第三方服务，如数据库、消息队列及存储等服务化并发布出来，用户通过向 BaaS 平台申请所需要的服务进行消费，而不需要关心这些服务的具体运维。

BaaS 涵盖的范围很广泛，包含任何应用所依赖的服务。一个比较典型的例子是数据库即服务（Database as a Service，DBaaS）。许多应用都有存储数据的需求，大部分应用会将数据存储在数据库中。传统情况下，数据库都是运行在数据中心里，由用户运维团队负责运维。在DBaaS的场景下，用户向 DBaaS 平台申请数据库资源，而不需要关心数据库的安装部署及运维。

## Serverless的技术特点

为了实现解耦应用和服务器资源，实现服务器资源对用户透明，与传统架构相比，Serverless 架构在技术上有许多不同的特点。

- 1.按需加载

在 Serverless 架构下，应用的加载（load）和卸载（unload）由 Serverless 云计算平台控制。这意味着应用不总是一直在线的。只有当有请求到达或者有事件发生时才会被部署和启动。当应用空闲至一定时长时，应用会到达或者有事件发生时才会被部署和启动。当应用空闲至一定时长时，应用会被自动停止和卸载。因此应用并不会持续在线，不会持续占用计算资源。

- 2.事件驱动

Serverless 架构的应用并不总是一直在线，而是按需加载执行。应用的加载和执行由事件驱动，比如HTTP请求到达、消息队列接收到新的信息或存储服务的文件被修改了等。通过将不同事件来源（Event Source）的事件（Event）与特定的函数进行关联，实现对不同事件采取不同的反应动作，这样可以非常容易地实现事件驱动（Event Driven）架构。

- 3.状态非本地持久化

云计算平台自动控制应用实例的加载和卸载，且应用和服务器完全解耦，应用不再与特定的服务器关联。因此应用的状态不能，也不会保存在其运行的服务器之上，不能做到传统意义上的状态本地持久化。

- 4.非会话保持

应用不再与特定的服务器关联。每次处理请求的应用实例可能是相同服务器上的应用实例，也可能是新生成的服务器上的应用实例。因此，用户无法保证同一客户端的两次请求由同一个服务器上的同一个应用实例来处理。也就是说，无法做到传统意义上的会话保持（Sticky Session）。因此，Serverless架构更适合无状态的应用。

- 5.自动弹性伸缩

Serverless 应用原生可以支持高可用，可以应对突发的高访问量。应用实例数量根据实际的访问量由云计算平台进行弹性的自动扩展或收缩，云计算平台动态地保证有足够的计算资源和足够数量的应用实例对请求进行处理。

- 6.应用函数化

每一个调用完成一个业务动作，应用会被分解成多个细颗粒度的操作。由于状态无法本地持久化，这些细颗粒度的操作是无状态的，类似于传统编程里无状态的函数。Serverless 架构下的应用会被函数化，但不能说 Serverless 就是 Function as a Service（FaaS）。Serverless 涵盖了 FaaS 的一些特性，可以说 FaaS 是 Serverless 架构实现的一个重要手段。

## Serverless的应用场景

通过将 Serverless 的理念与当前 Serverless 实现的技术特点相结合，Serverless 架构可以适用于各种业务场景。

- 1.Web应用

Serverless 架构可以很好地支持各类静态和动态Web应用。如 RESTful API 的各类请求动作（GET、POST、PUT及DELETE等）可以很好地映射成 FaaS 的一个个函数，功能和函数之间能建立良好的对应关系。通过 FaaS 的自动弹性扩展功能，Serverless Web 应用可以很快速地构建出能承载高访问量的站点。

- 2.移动互联网

Serverless 应用通过 BaaS 对接后端不同的服务而满足业务需求，提高应用开发的效率。前端通过FaaS提供的自动弹性扩展对接移动端的流量，开发者可以更轻松地应对突发的流量增长。在 FaaS 的架构下，应用以函数的形式存在。各个函数逻辑之间相对独立，应用更新变得更容易，使新功能的开发、测试和上线的时间更短。


- 3.物联网（Internet of Things，IoT）

物联网（Internet of Things，IoT）应用需要对接各种不同的数量庞大的设备。不同的设备需要持续采集并传送数据至服务端。Serverless 架构可以帮助物联网应用对接不同的数据输入源。

- 4.多媒体处理

视频和图片网站需要对用户上传的图片和视频信息进行加工和转换。但是这种多媒体转换的工作并不是无时无刻都在进行的，只有在一些特定事件发生时才需要被执行，比如用户上传或编辑图片和视频时。通过 Serverless 的事件驱动机制，用户可以在特定事件发生时触发处理逻辑，从而节省了空闲时段计算资源的开销，最终降低了运维的成本。

- 5.数据及事件流处理

Serverless 可以用于对一些持续不断的事件流和数据流进行实时分析和处理，对事件和数据进行实时的过滤、转换和分析，进而触发下一步的处理。比如，对各类系统的日志或社交媒体信息进行实时分析，针对符合特定特征的关键信息进行记录和告警。

- 6.系统集成

Serverless 应用的函数式架构非常适合用于实现系统集成。用户无须像过去一样为了某些简单的集成逻辑而开发和运维一个完整的应用，用户可以更专注于所需的集成逻辑，只编写和集成相关的代码逻辑，而不是一个完整的应用。函数应用的分散式的架构，使得集成逻辑的新增和变更更加灵活。

## Serverless的局限

世界上没有能解决所有问题的万能解决方案和架构理念。Serverless 有它的特点和优势，但是同时也有它的局限。有的局限是由其架构特点决定的，有的是目前技术的成熟度决定的，毕竟 Serverless 还是一个起步时间不长的新兴技术领域，在许多方面还需要逐步完善。

- 1.控制力

Serverless 的一个突出优点是用户无须关注底层的计算资源，但是这个优点的反面是用户对底层的计算资源没有控制力。对于一些希望掌控底层计算资源的应用场景，Serverless 架构并不是最合适的选择。

- 2.可移植性

Serverless 应用的实现在很大程度上依赖于 Serverless 平台及该平台上的 FaaS 和 BaaS 服务。不同IT厂商的 Serverless 平台和解决方案的具体实现并不相同。而且，目前 Serverless 领域尚没有形成有关的行业标准，这意味着用户将一个平台上的 Serverless 应用移植到另一个平台时所需要付出的成本会比较高。较低的可移植性将造成厂商锁定（Vendor Lock-in）。这对希望发展 Serverless 技术，但是又不希望过度依赖特定供应商的企业而言是一个挑战。

- 3.安全性

在 Serverless 架构下，用户不能直接控制应用实际所运行的主机。不同用户的应用，或者同一用户的不同应用在运行时可能共用底层的主机资源。对于一些安全性要求较高的应用，这将带来潜在的安全风险。

- 4.性能

当一个 Serverless 应用长时间空闲时将会被从主机上卸载。当请求再次到达时，平台需要重新加载应用。应用的首次加载及重新加载的过程将产生一定的延时。对于一些对延时敏感的应用，需要通过预先加载或延长空闲超时时间等手段进行处理。

- 5.执行时长

Serverless 的一个重要特点是应用按需加载执行，而不是长时间持续部署在主机上。目前，大部分 Serverless 平台对 FaaS 函数的执行时长存在限制。因此 Serverless 应用更适合一些执行时长较短的作业。

- 6.技术成熟度

虽然 Serverless 技术的发展很快，但是毕竟它还是一门起步时间不长的新兴技术。因此，目前 Serverless 相关平台、工具和框架还处在一个不断变化和演进的阶段，开发和调试的用户体验还需要进一步提升。Serverless 相关的文档和资料相对比较少，深入了解 Serverless 架构的架构师、开发人员和运维人员也相对较少。



### Other Resources

[精读《Serverless 给前端带来了什么》](https://segmentfault.com/a/1190000018455041)
[Docker — 从入门到实践](https://github.com/yeasy/docker_practice/blob/master/SUMMARY.md)
[serverless-chrome](https://github.com/adieuadieu/serverless-chrome)
[怎么理解 IaaS、SaaS 和 PaaS 的区别？](https://www.zhihu.com/question/20387284/answer/743669668)
