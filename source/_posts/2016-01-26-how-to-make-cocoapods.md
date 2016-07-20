title: 如何制作cocoaPods依赖库
subtitle: 本文介绍如何制作cocoaPods依赖库
cover: //img.aotu.io/MarkLin/cocoaPods/CocoaPods.png
date: 2016-01-26 19:40:49
categories: 移动开发
tags:
  - iOS
  - CocoaPods
author:
  nick: MarkLin
  github_name: marklin2012

---

学会使用别人的 **Pods** 依赖库以后， 你一定对创建自己的依赖库很有兴趣吧，现在我们就来尝试一下，以一个简单 **O2View** 为例自己创建一个 **Pods** 依赖库，这里我会使用 **Swift 2.0** 来写这个例子。

<!-- more -->

### 1.创建自己的 **github** 仓库

[**CocoaPods**](https://github.com/CocoaPods) 是托管在 **github** 上的，所有的 **Pods** 也都是托管在 **github** 上，因此我们首先需要创建一个属于自己的 github 仓库，如下图所示：

![github](//img.aotu.io/MarkLin/cocoaPods/1-1githubRepo.png)

上图中标识出了6处地方

1. **Repository name:** 仓库名称，这里写上我们的依赖库名字 **O2View** ，必填。
2. **Description：** 仓库的描述信息，可选。
3. **Public or Private:** 仓库的公开性，开源的话选 **Public** 。 如果是公司内部使用的话这里推荐大家使用私有的仓库,但是 **github** 的私有仓库是要收费的 **$7/month** （壕请无视 - -！）。大部分公司都是有自己的git服务器，不过一般只能在公司内网使用，或者可以选择[Gitlab](https://gitlab.com),[Coding](https://coding.net), [Bitbucket](https://bitbucket.org/)任意一种。
4. **Initialize：** 是否默认创建一个 **README** 文档，一个完整的库都会有这个说明文档，这里最好勾选一下。不过如果忘记的话也不要紧，后面手动创建也是可以的。
5. **.gitignore：** 忽略项文件，记录一些想忽略的文件类型，凡是该文件包含的文件类型， git 都不会将其纳入到版本管理中。看需要选择就行。
6.  **license：** 正规的仓库都有一个 **license** 文件， **Pods** 依赖库对这个文件要求比较严格，需要有这个文件。这里最好让 **github** 自动创建一个，不过后续手动创建也行。我们这次先使用 **MIT** 类型的 **license**。

上面各项根据大家需要填写完毕后，点击 **Create repository** 按钮即可，创建成功后如下所示：

![github](//img.aotu.io/MarkLin/cocoaPods/1-2githubO2View.png)

### 2.clone 仓库到本地
为了方便向仓库中删减内容，需要将仓库 **clone** 到本地，这里有多种操作方式，可以选择你喜欢的一种，但是为了方便这边选择使用命令行。首先需要切换到你想在本地存储的目录，然后再 **clone** ，假设你放在用户的根目录上：

``` bash
cd ~
git clone https://github.com/marklin2012/O2View.git
```
完成后，我们进入到 `~/O2View` 目录中应该可以看到目录结构如下:

```
|____LICENSE
|____README.md

```

其实还有一个隐藏的 **.git** 文件，后续我们的所有文件都在这个目录底下进行。

### 3.向本地仓库中添加创建 Pods 依赖库所需的文件

#### 1）主类文件

创建 **Pods** 依赖库就是为了方便别人使用我们的成果，比如我想共享给大家的O2View类，那这个类自然必不可少，我们把这个类放入一个 **O2View** 的目录中：

![主类](//img.aotu.io/MarkLin/cocoaPods/1-3O2ViewClassDoc.jpeg)

顺便看看 **O2View.swift** 主要内容：

```swift
import UIKit

public class O2View: UIView {
    
    public override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = UIColor.redColor()
    }

    required public init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
}
```

#### 2）.podspec 文件

每个 **Pods** 依赖库必须有且仅有一个名称和依赖库名保持一致，后缀名为 **.podspec** 的描述文件。这里我们依赖库的描述文件名称应该为 `O2View.podspec`。

创建这个文件有两种途径：

1. 复制已有的 **podspec** 文件然后修改对应的参数。
2. 执行命令行创建。

我们使用命令行：

```bash
pod spec create O2View
```
创建出 **O2View.podspec** 文件后，我们打开可以发现，该文件是 **ruby** 文件，里面有很多的内容，但是大多数都是我们不需要的，所以我们只需要根据项目的情况保留关键的一些内容就行：

```ruby
Pod::Spec.new do |s|
  s.name         = "O2View"				#名称
  s.version      = "0.0.1"				#版本号
  s.summary      = "Just testing"		#简短介绍
  s.description  = <<-DESC
  					私有Pods测试
  					* Markdown 格式
                   DESC

  s.homepage     = "http://aoto.io/"
  # s.screenshots  = "www.example.com/screenshots_1.gif"
  s.license      = "MIT"				#开源协议
  s.author             = { "linyi31" => "linyi@jd.com" }

  s.source       = { :git => "https://github.com/marklin2012/O2View.git" }
  ## 这里不支持ssh的地址，只支持HTTP和HTTPS，最好使用HTTPS
  ## 正常情况下我们会使用稳定的tag版本来访问，如果是在开发测试的时候，不需要发布release版本，直接指向git地址使用
  ## 待测试通过完成后我们再发布指定release版本，使用如下方式
  #s.source       = { :git => "http://EXAMPLE/O2View.git", :tag => version }
  
  s.platform     = :ios, "9.0"			#支持的平台及版本，这里我们呢用swift，直接上9.0
  s.requires_arc = true					#是否使用ARC

  s.source_files  = "O2View/*.swift"	#OC可以使用类似这样"Classes/**/*.{h,m}"

  s.frameworks = 'UIKit', 'QuartzCore', 'Foundation'	#所需的framework,多个用逗号隔开
  s.module_name = 'O2View'				#模块名称

  # s.dependency "JSONKit", "~> 1.4"	#依赖关系，该项目所依赖的其他库，如果有多个可以写多个 s.dependency

end
```

#### 3）Demo 工程

为了快速教会别人使用我们的 **Pods** 依赖库，通常需要提供一个 demo 工程。我们创建了一个名为 **O2ViewDemo** 的工程来演示 **O2View** 的使用，如下图所示：


![demo](//img.aotu.io/MarkLin/cocoaPods/1-4O2ViewDemo.jpeg)


#### 4）README.md

使用 **github** 的人应该都熟悉这个文件，它使一个成功的 **github** 仓库必不可少的一部分，使用 **markdown** 对仓库进行详细说明。

#### 5）LICENSE 文件

**CocoaPods** 强制要求所有的 **Pods** 依赖库都必须有 **license** 文件，否则验证不会通过。 **license** 文件有很多中，详情可以参考 [tldrlegal](https://tldrlegal.com/)。前面我们已经选择创建了一个 **MIT** 类型的 **license**。

以上的5个文件是创建 **Pods** 依赖库所需的基础文件，当然 **Demo** 工程没有添加也没关系。添加完这些内容后，我们本地仓库目录就变成这个样子：

![license](//img.aotu.io/MarkLin/cocoaPods/1-5O2ViewDoc.jpeg)

### 4.提交修改到 **github**

经过前面步骤，我们已将在本地的 **git** 仓库添加了不少文件，现在我们只要将他们提交到 **github** 上就可以。在此之前我们需要对刚才添加的 **pod** 进行一下验证：

```
pod lib lint
```
运行之后可能会得到下面的警告：

```
 -> O2View (0.0.1)
    - WARN  | source: Git sources should specify a tag.

[!] O2View did not pass validation, due to 1 warning (but you can use `--allow-warnings` to ignore it) and All results apply only to public specs, but you can use `--private` to ignore them if linting the specification for a private pod..
You can use the `--no-clean` option to inspect any issue.
```
由于我们现在还没有正式生成 **release** 版本， **github** 上并没有任何 **tag**，所以我们刚才填写 **.podspec** 文件填写 **git** 地址的时候没有填写指定 **tag** （上面文件的注释中有提到），解决方法我们可以先执行忽略警告的命令：

```bash
pod lib lint --allow-warnings
```

如果成功会出现如下输出：

```
 -> O2View (0.0.1)
    - WARN  | source: Git sources should specify a tag.

O2View passed validation.
```
> 当调试完成了之后，我们需要在 **github** 上把我们的代码生成相应稳定的 **release** 版本，到时候我们再回来添加指定 **tag** 发布就 Ok 了。

验证成功之后，我们只要把代码提交到 **github** 仓库，就可以了，参考命令：

```bash
git add -A && git commit -m "add pod files"

git push origin master
```
这里主要是 **git** 的范畴，不做过多叙述。如果前面操作都没有问题的话，**github** 上应该能看到类似如下内容：

![push](//img.aotu.io/MarkLin/cocoaPods/1-6githubO2ViewPush.png)

### 5.接下来做什么？

经过前面的步骤，我们的 **CocoaPods** 依赖库就已经准备好了，但是现在你还不能在你的工程中使用它。如果你想成为一个真正可用的依赖库，还需要最后一步操作：将刚才生产的 **podspec** 文件提交到 [官方的 **CocoaPods Specs** ](https://github.com/CocoaPods/Specs)中。

没错，我们平时用的能用 `pod search` 搜到的依赖库都会把它上传到这个仓库中， 也就是说只有将我们的 **podspec** 文件上传到这里，才能成为一个真正的依赖库，别人才能用！

按照 **github** 的规则，要想向别人的库中添加文件，就要先 **fork** 别人的仓库，做相应的修改，再 **pullrequest** 给仓库的原作者，等到作者审核通过，进行 **meger** 之后就可以了！

流程大概就是这个样子，具体可以参考：[CocoaPods Guides](https://guides.cocoapods.org/)，我们就先不展开详细的叙述了（后面会添加关于这部分的文章）。

除了官方的 **specs** 之外，我们还可以把 **podspec** 文件提交到私有的仓库中，详见我们博客的另一篇文章：[创建私有的 **CocoaPods repo spec**](http://www.jianshu.com/p/ddc2490bff9f) 。
