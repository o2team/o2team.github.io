# aotu.io

## 博客的一些特性

1. 使用github头像

  记得将你们在github的头像更新到最帅，将你github的用户名在文章内头部填好即可！

2. [hexo-wordcount](https://npmjs.org/package/hexo-wordcount) 显示博文字数
3. [不蒜子](http://ibruce.info/2015/04/04/busuanzi/) 统计博文的pv
4. 每日一句英文警句
5. [多说](http://duoshuo.com)评论

## 使用指引

1. 安装hexo

    ```
    npm i hexo-cli -g
    ```

2. 将o2team.github.io的源码拉到本地

    ```
    git clone git@github.com:o2team/o2team.github.io.git o2team
    ```

3. 初始化子模块(submodules)

    ```
    cd o2team
    git submodule init
    git submodule update
    
    # 切换至themes/o2目录，签出master分支
    cd ../themes/o2
    git checkout master
    ```

4. 安装nodejs包

    ```
    # 切换回根目录下
    cd ../../
    npm install
    ```

5. 运行`hexo s --watch`

    运行上述命令后，浏览器打开 [http://localhost:4000](http://localhost:4000) 即可本地访问我们的网站
    
## 创建文章

有两种方法创建文章，可任选其一：

> 注意：文件名不要出现中文!!!

1. 使用`hexo new` 命令
  
  ``` bash
  $ hexo new "My New Post"
  ```

2. 拷贝现有的文章进行修改
  
  hexo使用markdown来编辑文章，在source目录下，拷贝任意md文件进行创建新的文章。具体可参考下hexo的官方说明

## 文章规范

1. 使用markdown写博文 
2. 博文图片统一位置：`source/img/post/`
    
    在博客内容中可以通过`{{ post_img("xxx.jpg") }}`来引用图片。注意别覆盖了别人的图片!!!    

3. 为了保证博客整体美观，每个文章需要一张配图(大小：840x340)
4. 指明文章的副标题、作者信息、封面图片地址

    ```
    subtitle: "凹凸实验室博客是一个托管于Github的静态博客，基于HEXO搭建，主题的定做参考自[future-imperfect](http://html5up.net/future-imperfect)的扁平简约，暂且命名为`o2`。"
    date: 2015-11-20 00:24:35
    cover: "封面图片地址"
    tags:
    - Hexo
    author:
        nick: LV主唱大人
        github_name: mamboer

    ```

## 关于博客的发布

为了便于统一维护，博客的发布由`LV`负责。同学们写好博文并在本地预览OK后直接提交Github即可。  
