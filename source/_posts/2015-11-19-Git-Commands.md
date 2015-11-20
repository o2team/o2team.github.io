title: "Git常用操作总结"
subtitle: "理解Git的内部原理，分清楚工作区、暂存区、版本库，还有就是理解Git跟踪并管理的是修改，而非文件。"
cover: git-flow.jpg
date: 2015-11-19 12:44:25
tags:
  - Git
  - Fork
author:
  nick: LV主唱大人
  github_name: mamboer

---

用Git比较久了，之前一直在Win用的TortoiseGit，现在命令行用的比较多，所以把一些指令总结一下，以便回顾和查询。
理解这些指令，觉得最重要的是理解Git的内部原理，比如Git的分布式版本控制，分清楚工作区、暂存区、版本库，还有就是理解Git跟踪并管理的是修改，而非文件。

<!-- more -->

### 设置
    $ git config --global user.name "Your Name"
    $ git config --global user.email "email@example.com"

### 提交
git tracked的是修改，而不是文件

    #将“当前修改”移动到暂存区(stage)
    $ git add somfile.txt
    #将暂存区修改提交
    $ git commit -m "Add somfile.txt."

### 状态
    $ git status
    $ git diff

### 回退
    # 放弃工作区修改
    $ git checkout -- file.name
    $ git checkout -- .

    # 取消commit(比如需要重写commit信息)
    $ git reset --soft HEAD
    
    # 取消commit、add(重新提交代码和commit)
    $ git reset HEAD
    $ git reset --mixed HEAD
    
    # 取消commit、add、工作区修改(需要完全重置)
    $ git reset --hard HEAD

### 记录
    $ git reflog
    $ git log

### 删除
    $ rm file.name
    $ git rm file.name
    $ git commit -m "Del"

### 远程操作
    $ git remote add origin git@github.com:michaelliao/learngit.git
    # 第一次推送，-u(--set-upstream)指定默认上游
    $ git push -u origin master
    $ git push origin master

### 克隆
    $ git clone https://github.com/Yikun/yikun.github.com.git path
    $ git clone git@github.com:Yikun/yikun.github.com.git path


### 分支操作
    # 产看当前分支
    $ git branch

    # 创建分支
    $ git branch dev
    # 切换分支
    $ git checkout dev

    # 创建并checkout分支
    $ git checkout -b dev


    # 合并分支
    $ git merge dev

    # 删除分支
    $ git branch -d dev

### 标签
    $ git tag 0.1.1
    $ git push origin --tags

> 本文Fork自 [yikun.github.io](http://yikun.github.io/)
