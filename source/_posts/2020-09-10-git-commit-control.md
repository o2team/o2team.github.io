title: 规范GIT代码提交信息&自动化版本管理
subtitle:
cover: https://img11.360buyimg.com/imagetools/jfs/t1/123611/18/12202/317391/5f5a1073E7dc03d83/9f2adf4821068f28.jpg
category: 经验分享
tags: 
    - git
    - git commit
    - Conventional Commits
    - semver
    - standard version
    - commitizen
author:
    nick: eijil
date: 2020-09-10 17:00:00
---
## 前言

`git`作为一个开发人员必不可少的工具，代码提交也是日常一个非常频繁的操作，如果你或你的团队目前对提交信息还没有一个规范或约束，那么你有必要看看本文的内容了。

## 为什么要规范提交信息

首先规范提交信息肯定是有必要的，简单总结下几点好处：

* 让项目的维护或使用人员能了解提交了哪些更改
* 清晰的历史记录，可能某天自己就需要查到呢
* 规范的提交记录可用于自动生成修改日志(CHANGELOG.MD)
* 基于提交类型，触发构建和部署流程


## 使用什么规范

**`Conventional Commits`(约定式提交规范)**，是目前使用最广泛的提交信息规范，其主要受[AngularJS规范](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines)的启发,下面是一个规范信息的结构：
```
<type>[optional scope]: <subject>
//空一行
[optional body]
//空一行
[optional footer(s)]
```
### 规范说明


**`type`** 提交的类别，必须是以下类型中的一个

```
feat：增加一个新功能
fix：修复bug
docs：只修改了文档
style：做了不影响代码含义的修改，空格、格式化、缺少分号等等
refactor：代码重构，既不是修复bug，也不是新功能的修改
perf：改进性能的代码
test：增加测试或更新已有的测试
chore：构建或辅助工具或依赖库的更新

```
**`scope`** 可选，表示影响的范围、功能、模块

**`subject`**
必填，简单说明，不超过50个字

**`body`**
选填，用于填写更详细的描述

**`footer`** 
选填，用于填关联`issus`,或`BREAK CHANGE`

**`BREAKING CHANGE`**

必须是大写，表示引入了破坏性 API 变更，通常是一个大版本的改动，`BREAKING CHANGE:` 之后必须提供描述，下面一个包含破坏性变更的提交示例
```
feat: allow provided config object to extend other configs

BREAKING CHANGE: `extends` key in config file is now used for extending other config files
```


>更详细的说明请看[约定式提交规范](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4/#%e7%ba%a6%e5%ae%9a%e5%bc%8f%e6%8f%90%e4%ba%a4%e8%a7%84%e8%8c%83)


### 如何约束规范

怎么确保每个提交都能符合规范呢，最好的方式就是通过工具来生成和校验，`commitizen`是一个nodejs命令行工具，通过交互的方式，生成符合规范的git commit，界面如下：

![](https://github.com/commitizen/cz-cli/raw/master/meta/screenshots/add-commit.png)

开始安装:

```
# 全局安装
npm install -g commitizen 
# 或者本地安装
$ npm install --save-dev commitizen
# 安装适配器
npm install cz-conventional-changelog
```
`packages.json`在配置文件中指定使用哪种规范

``` js
...
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
```
安装完成后可以使用`git cz` 来代替`git commit`,然后根据提示一步步输入即可

### 格式校验commitlint
可能你不想每次都通过交互界面来生成，还是想使用`git commit -m 'message'`，那么为了确保信息的正确性，可以结合`husky`对提交的信息进行格式验证

安装依赖
``` bash
npm install --save-dev @commitlint/{config-conventional,cli}
# 安装husky
npm install --save-dev husky

```
添加 `commitlint.config.js`文件到项目
``` bash
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
``` 
`package.json`配置
```

#git提交验证
"husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  },
```

OK到这一步就完成了，最后给你项目README.MD加上一个`commitizen-friendly`的标识吧
```
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
```

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

## 自动版本管理和生成CHANGELOG

规范化的提交信息除了能很好描述项目的修改，还有一个很好的作用就是能根据提交记录来生成CHANGELOG.MD和自动生成版本号等功能。


### standard-version

一个用于生成`CHANGELOG.md`和进行`SemVer(语义化版本号)`发版的命令行工具

主要功能：
* 自动修改最新版本号，可以是`package.json`或者自定义一个文件
* 读取最新版本号，创建一个最新的`git tag`
* 根据提交信息，生成`CHANGELOG.md`
* 创建一个新提交包括 `CHANGELOG.md`和`package.json`


### 语义化版本控制(SemVer)

先简单了解下什么是语义化的版本控制，其是由`GitHub`发起的一份用于规范版本号递增的规则，
##### 版本格式
主版本号.次版本号.修订号，版本号递增规则如下：

* 主版本号(major)：当你做了不兼容的 API 修改，
* 次版本号(minor)：当你做了向下兼容的功能性新增，可以理解为Feature版本，
* 修订号(patch)：当你做了向下兼容的问题修正，可以理解为Bug fix版本。

先行版本号可以加到“主版本号.次版本号.修订号”的后面，作为延伸。

##### 先行版本
当即将发布大版本改动前，但是又不能保证这个版本的功能 100% 正常，这个时候可以发布先行版本：

* alpha: 内部版本
* beta: 公测版本
* rc: 候选版本(Release candiate)

比如：1.0.0-alpha.0,1.0.0-alpha.1,1.0.0-rc.0,1.0.0-rc.1等。

 `standard-version` 会根据提交的信息类型来自动更改对应的版本号,如下:
* feat: 次版本(minor)+1
* fix: 修订号(patch) +1
* BREAK CHANGE: 主板号(marjor) +1

> `standard-verstion` 生成的`CHANGELOG`只会包含`feat`,`fix`,`BREACK-CHANGE`类型的提交记录


#### 使用
``` bash
npm i --save-dev standard-version
```

添加`npm script`

``` 
{
 scripts:{
   "release": "standard-version",
   "release:alpha": "standard-version --prerelease alpha",
   "release:rc": "standard-version --prerelease rc"
  }
}
```
执行：
``` bash
# npm run script
npm run release
# or global bin
standard-version
```
或者你想指定发行版本号：

``` bash
#指定类型 patch/minor/marjor
npm run release -- --release-as patch
#指定版本号
npm run release -- -- release-as 1.1.0
```

##### 生命周期

* `prerelease`:所有脚本执行之前
* `prebump`/`postbump`: 修改版本号之前和之后
* `prechangelog`/`postchangelog`:生成changelog和生成changelog之后
* `pretag`/`postag`:生成tag标签和之后

`standard-version`本身只针对本地，并没有`push`才操作，我们可以在最后一步生成tag后，执行push操作，在`paceage.json`中添加
``` 
"standard-version": {
    "scripts": {
      "posttag": "git push --follow-tags origin master && npm publish"
    }
  }
```



还有更多配置功能自行查阅 [官方文档](https://github.com/conventional-changelog/standard-version)

#### 其它类似工具
除了`standard-version`,还有其它类似的工具,有兴趣可以去了解下
* [semantic-release](https://github.com/semantic-release/semantic-release)
* [lerna](https://lerna.js.org/)


## 修改Git Commit

为了使`CHANGELOG.MD`更能加直观看到每个版本的修改，我们尽量保证每次提交都是有意义的，但实际开发过程中，不可避免会提交了一些错误的commit message，下面介绍几个`git`命令来修改`commit`


### 1 修改最后一次提交
`git commit --amend`

该命令会创建一个提交并覆盖上次提交，如果是因为写错或者不满意上次的提交信息，使用该命令就非常适合。
### 2 合并多条提交
`git reset --soft [commitID]`

如果你想合并最近几条提交信息的话，那么就需要使用上面的命令来操作，指定要撤销的ccommitId,该命令会保留当前改动并撤销指定提交后的所有commit记录，如果不指定ID的话可以使用HEAD~`{num}` 来选择最近`{num}`条提交
```
git reset --soft HEAD~2 #合并最近两条提交
git commit -m 'feat: add new feat'
```
>带 `--soft` 参数的区别在于把改动内容添加到暂存区 相当于执行了`git add .`

### git rebase -i

`git rebase`的功能会更加强大，如果我想修改最近3条提交记录，执行
``` bash
git rebase -i  HEAD~3
```
会出现如下编辑器界面(vim编辑器):


![](https://img14.360buyimg.com/imagetools/jfs/t1/146374/23/7928/299480/5f5994e4E612057a2/96c528644441ab76.png)

上面显示的是我最近3条提交信息 ，下面是命令说明，
修改方式就是将commit信息前的`pick`改为你需要的命令，然后退出`:wq`保存

下面是常用的命令说明：
```
p,pick = 使用提交
r,reword = 使用提交，但修改提交说明
e,edit = 使用提交，退出后使用git commit --amend 修改
s,squash = 使用提交，合并前一个提交
f,fixup = 和squash相同，但丢弃提交说明日志
d,drop = 删除提交，丢弃提交记录
```

## 最后
文本主要介绍了如何规范`git commit`和自动语义化版本管理，以及如何修改`git commit`,遵循一个规范其实没比之前随意填写信息增加多少工作量，但依赖规范却可以实现更多提升效率的事情。

## 参考
* [conventional commits](https://www.conventionalcommits.org/zh-hans/v1.0.0-beta.4)

* [standard version](https://github.com/conventional-changelog/standard-version)

* [semver.org](https://semver.org/lang/zh-CN/)

* [Semver(语义化版本号)扫盲](https://juejin.im/post/6844903591690534926)

