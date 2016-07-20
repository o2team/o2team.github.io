title: 如何创建私有 CocoaPods 仓库
subtitle: 本文介绍如何创建私有的 CocoaPods 仓库
cover: //img.aotu.io/MarkLin/privateCocoaPods/PrivateCocoaPods.png
categories: 移动开发
tags:
  - iOS
  - CocoaPods
  - Swift
author:
  nick: MarkLin
  github_name: marklin2012
date: 2016-01-26 11:35:15
---

### 公共 CocoaPods

打开隐藏目录，可以使用命令: 

```
//打开隐藏的命令:
defaults write com.apple.finder AppleShowAllFiles -bool true
//关闭隐藏的命令:
defaults write com.apple.finder AppleShowAllFiles -bool false

```

接着需要重启一下 **Finder**， 可以按住 **option** + 右键 **Finder** 图标选择重启。然后打开隐藏目录 **.cocoapods** (这个目录在你的个人目录底下, `~/.cocoapods` 或 `/Users/[username]/.cocoapods`)


<!-- more -->

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-1cocoapodsMasterRepo.png)

可以看到上图， **.cocoapods** 目录下的 **repos** 其实是 **repository** （仓库）的缩写。 **repos** 中存放的时仓库的集合。这里的 **master** 就是 **CocoaPods** 官方建立的仓库，也就是我们所谓的公共库。

**specs** 目录下存放的就是所有提交到 **CocoaPods** 的开源库的 **podspec** 文件的集合。
其结构如下图所示：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-2repoSpecs.png)

其组成方式：

specName -- version -- specName.podspec

( **master** 里现在是 **specName.podspec.json**，这个 **.json** 文件就是 **podspec** 文件加了个后缀。我们可以采用 `pod ipc spec` 这个命令来将 **spec** 文件转换成 **.json**)

那这个文件夹是如何来得呢？其实，这个文件夹是在你安装了 **CocoaPods** 后，第一次执行 `pod install` 时， **CocoaPods** 通过命令 `pod setup` 来建立的（这条命令会自动执行）。

> 上述是官方的 **repo** ，私有库的话可以看下我们前面的翻译或者查看[官方文档](https://guides.cocoapods.org/making/private-cocoapods.html)，但是官方文档有一些过程写的不是特别详细，自己实现的时候遇到了一些坑，特此梳理一下过程，按照官方文档内容实现一个私有的 **spec repo** 。根据官方的原理，我们只需要创建一个和 **master** 相类似结构的目录就可以实现私有的 **spec repo**，当然你可以 **fork** 一个官方的 **repo**，但是它包含了太多没有必要地库在里面，这在编译仓库的时候需要浪费大量的时间，所以我们只要自己重新创建一个就可以了。

### 1.创建一个私有的 **Spec Repo**

在你的 git 服务器上创建一个 **repo**。这里你可以在 **github** 或者你自己的 git 服务器上实现。公司内部使用的话这里推荐大家使用私有的仓库,但是 **github** 的私有仓库是要收费的 **$7/month** （壕请无视 - -！）。大部分公司都是有自己的git服务器，不过一般只能在公司内网使用，或者可以选择[Gitlab](https://gitlab.com),[Coding](https://coding.net), [Bitbucket](https://bitbucket.org/)任意一种。我们以在 **github** 上创建为例：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-3createGithub.png)

如图所示，我们在 **github** 上创建一个空的仓库，命名为 **O2Specs** ，这个仓库是用来存放我们自己所有的私有库的 **spec** 文件，就如同官方的 [**https://github.com/CocoaPods/Specs**](https://github.com/CocoaPods/Specs) 是用来存放所有官方的 **specs** 文件一样。

然后我们就可以执行：

```bash
pod repo add REPO_NAME SOURCE_URL
```

其中的 REPO_NAME 是我们要添加的私有 **repo** 的名称（这里我们待会填的是: **O2Specs**），后面是仓库的 git 地址。这里做的其实是创建的工作，也就是在 `~/.cocoapods/repo` 目录下添加了一个以你的私有 **repo** 为名的文件夹，但是并没有添加 **spec** 文件。

在终端执行命令：
```bash
pod repo add O2Specs https://github.com/marklin2012/O2Specs.git
```

 这里用的是 **https** 地址，当然你也可以用 **git** 地址，不过这样有可能失败。如果失败，很大因素是你 **github** 的 **ssh** 在本地没有配置好，配置方法可以看这里：[**Generating SSH keys**](https://help.github.com/articles/generating-ssh-keys/)，成功后可以看得到 **.cocoapods** 目录如下图所示：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-4o2specsRepos.png)

至此，我们已经在本地得到我们自己的私有仓库 **O2Specs** ，这是一个空的仓库。

### 2.添加私有的 **Repo** 安装到你的 **CocoaPods** 中

这个步骤需要我们事先完成 **CocoaPods** 依赖库的搭建，具体可以查看我们另外一篇教程：[制作 **CocoaPods** 依赖库](http://www.jianshu.com/p/7a82e977281c)。如果这里你想先看看效果，也可以直接从 **github** 上 clone [示例工程](https://github.com/marklin2012/O2View)继续下面的操作。

让我们进入到上面 clone 的示例工程目录中（或者你自己搭建的依赖库目录中）：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-5O2ViewDoc.jpeg)

打开工程的 **podspec** 文件：

```ruby
Pod::Spec.new do |s|
  s.name         = "O2View"				#名称
  s.version      = "0.0.1"				#版本号
  s.summary      = "Just testing"		#简短介绍
  s.description  = <<-DESC
  					私有Pods测试
  					* Markdown 格式
                   DESC

  s.homepage     = "http://aotu.io/"
  # s.screenshots  = "www.example.com/screenshots_1.gif"
  s.license      = "MIT"				#开源协议
  s.author             = { "linyi31" => "linyi@jd.com" }

  s.source       = { :git => "https://github.com/marklin2012/O2View.git" }
  ## 这里不支持ssh的地址，只支持HTTP和HTTPS，最好使用HTTPS
  ## 正常情况下我们会使用稳定的tag版本来访问，如果是在开发测试的时候，不需要发布release版本，直接指向git地址使用
  ## 待测试通过完成后我们再发布指定release版本，使用如下方式
  #s.source       = { :git => "http://EXAMPLE/O2View.git", :tag => s.version }
  
  s.platform     = :ios, "9.0"			#支持的平台及版本，这里我们呢用swift，直接上9.0
  s.requires_arc = true					#是否使用ARC

  s.source_files  = "O2View/*.swift"	#OC可以使用类似这样"Classes/**/*.{h,m}"

  s.frameworks = 'UIKit', 'QuartzCore', 'Foundation'	#所需的framework,多个用逗号隔开
  s.module_name = 'O2View'				#模块名称

  # s.dependency "JSONKit", "~> 1.4"	#依赖关系，该项目所依赖的其他库，如果有多个可以写多个 s.dependency

end
```
这个文件本质上是一个 **ruby** 文件，这是我们事先已经实现好的依赖库的 **podspec** 文件，如果前面步骤都正常的话，也就是说我们认为这个 **podspec** 是合法的话，就可以直接将这些内容 **push** 到我们本地的 **repo** 中。为了避免错误，我们可以再验证一下，命令行输入：

```bash
pod lib lint
```
运行之后可能会得到下面的警告：

```
 -> O2View (0.0.1)
    - WARN  | source: Git sources should specify a tag.

[!] O2View did not pass validation, due to 1 warning (but you can use `--allow-warnings` to ignore it) and All results apply only to public specs, but you can use `--private` to ignore them if linting the specification for a private pod..
You can use the `--no-clean` option to inspect any issue.
```
由于我们的示例工程还没有生成正式的 **release** 版本， **github** 上并没有任何 **tag**，所以我们刚才填写 **.podspec** 文件填写 **git** 地址的时候没有填写指定 **tag** （上面文件的注释中有提到），解决方法我们可以先执行忽略警告的命令：

```bash
pod lib lint --allow-warnings
```

如果成功会出现如下输出：

```
 -> O2View (0.0.1)
    - WARN  | source: Git sources should specify a tag.

O2View passed validation.
```

到此，我们的 **O2View.podspec** 就符合规范了。

### 3.添加你的 **Podspec** 到你的 **repo**

在前面验证通过的基础上，我们接着执行命令：

```bash
pod repo push O2Specs O2View.podspec
```

执行完，如果失败会有相对应的警告和错误提示，只要按照警告和错误的详细信息进行修改和完善即可。成功的情况应该可以在终端看到类似的输出：

```
Validating spec
 -> O2View (0.0.1)
    - WARN  | source: Git sources should specify a tag.

Updating the `O2Specs' repo

Already up-to-date.

Adding the spec to the `O2Specs' repo

 - [Add] O2View (0.0.1)

Pushing the `O2Specs' repo

To https://github.com/marklin2012/O2Specs.git
   9f32092..8d0ced5  master -> master
```

再进入到 **.cocoapods** 的目录中，可以看到已经发生了变化：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-6O2SpecsRepoO2View.png)

同时，我们还发现 **O2Specs** 的 **github** 仓库也已经发生了变化：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-7O2SpecPushed.png)

按照平时使用 **CocoaPods** 的习惯，我们添加依赖库之前会先搜索一下库，让我们执行一下命令：

```bash
pod search O2View
```

哈哈，可以看到已经建立成功了！

```
-> O2View (0.0.1)
   Just testing
   pod 'O2View', '~> 0.0.1'
   - Homepage: http://aotu.io/
   - Source:   https://github.com/marklin2012/O2View.git
   - Versions: 0.0.1 [O2Specs repo]
```

### 4.测试私有 pod

看到前面的搜索结果，小伙伴们是不是开始有点激动了？让我们建立一个普通的工程，命名为 **TestPodDemo**，然后在终端 **cd** 到其目录路径下，添加一个 **Podfile** 文件：

```bash
pod init
```

建立后修改 **Podfile** 文件内容如下：

```
use_frameworks!

target 'TestPodDemo' do

pod ‘O2View’

end
```

执行：

```bash
pod install
```

我们得到如下提示：

```
Updating local specs repositories
Analyzing dependencies
[!] Unable to find a specification for `O2View`

[!] Your Podfile has had smart quotes sanitised. To avoid issues in the future, you should not use TextEdit for editing it. If you are not using TextEdit, you should turn off smart quotes in your editor of choice.
```
找不到 **O2View** ？ 额- -！。。。刚才 **search** 明明可以找到这个依赖库的，为什么现在找不到了呢？

别着急!其实原因是你在 **Podfile** 中没有指定路径，当你执行 `pod install` 的时候，**CocoaPods** 默认只会在 **master** 下搜索，而我们的 **spec** 是存在我们私有的 **O2Specs** 目录下的。所以解决方式很简单，就是引入搜索地址即可，在 **Podfile** 的顶部添加如下两行代码：

```
source 'https://github.com/CocoaPods/Specs.git'		#官方仓库地址
source ‘https://github.com/marklin2012/O2Specs.git’		#私有仓库地址
```

这里必须添加两个地址，默认情况下，你如果不添加 **source** ，系统会默认使用官方仓库地址，但是当你添加了 **source** 之后，系统就不会自动搜索官方地址，所以这两句都必须添加，否则其他基于官方的依赖库都不能使用了。

再次执行 `pod install` ，我们就可以看到很顺利的安装成功了：

```
Updating local specs repositories
Analyzing dependencies
Downloading dependencies
Using O2View (0.0.1)
Generating Pods project
Integrating client project
Sending stats
Pod installation complete! There is 1 dependency from the Podfile and 1 total pod installed.
```
恭喜！这样一来我们就可以使用这个私有库了！ 

### 发布稳定的依赖库版本

前面我们提到过，我们的这个实例依赖库 **O2View** 没有生成稳定的 **release** 版本。当我们调试完内容之后，一般都是要发布稳定版本的，更新之后再继续发布新版本。我们可以使用命令行或者在 **github** 页面手动生成，这里为了方便我们使用命令行，首先在终端中 **cd** 到之前的依赖库 **O2View** 的目录中，然后输入如下命令：

```
git tag '0.0.1'
git push --tags
git push origin master
```
这样我们就得到了一个稳定的 **release** 版本 **0.0.1**：

![repo](//img.aotu.io/MarkLin/privateCocoaPods/1-8githubTags.png)

> 这里我用的版本号是 **0.0.1** 基于研发版本，关于版本号的一些规范可以参考：[语义化版本 2.0.0](http://semver.org/lang/zh-CN/)

对于我们的 **podspec** 文件，我们也需要将 `s.source` 做一下小小的改动:

```
s.source       = { :git => "https://github.com/marklin2012/O2View.git", :tag => version }

```

这样我们使用这个依赖库的时候就能对应上版本号，并且知道在 **github** 中使用稳定的 **release** 版本代码。太棒了！

最后只需要再重复 `push` 一下我们的 **Podfile** 就可以！

### 接下来做什么？

好了，到这里我们已经完全掌握如何创建一个本地私有的 **CocoaPods** 了！我们完全可以把我们项目中得代码拆出来封装成一些 **pods**， 好好使用这个黑魔法！

祝大家玩得愉快！
