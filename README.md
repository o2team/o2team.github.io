# o2team.github.io

官网使用[hexo](https://hexo.io)作为静态站点引擎。

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
    
    # 切换至public目录，签出master分支
    cd public
    git checkout master
    
    # 切换至themes/o2目录，签出master分支
    cd ../themes/o2
    git checkout master
    ```

    hexo在生成的静态文件在public目录，所以本项目设置了master分支作为hexo分支的一个子模块，并且指向public目录，这样public目录下的文件发生变更提交后会在master分支，可通过域名进行直接访问。
    
    另外，本项目使用了hexo定制的皮肤[hexo-theme-o2](https://github.com/o2team/hexo-theme-o2)，为了方便维护，项目还设置了hexo-theme-o2作为hexo分支的一个子模块，指向`themes/o2`目录

4. 安装nodejs包

    ```
    # 在themes/o2目录下
    npm install
    
    # 切换回根目录下
    cd ../../
    npm install
    ```

5. 运行`hexo serve --watch`

    运行上述命令后，浏览器打开http://localhost:4000即可本地访问我们的网站
    
## 如何创建文章

hexo使用markdown来编辑文章，在source目录下，拷贝任意md文件进行创建新的文章。具体可参考下hexo的官方说明
    
## 如何定制主题

在`themes/o2`目录中进行主题模块的修改。注意修改后记得在`themes/o2`目录内提交变更文件至github

注意：themes/o2目录对应的github项目是[hexo-theme-o2](https://github.com/o2team/hexo-theme-o2)，它只是作为子模块被引用到o2team.github.io项目中
    
## 如何发布

在本地修改完成确认可以发布时，请通过以下步骤完成发布：

1. 运行`hexo g`生成待发布的静态文件
2. 在`public`目录中提交静态文件

    ```
    cd public
    git add -A
    git commit -a -m "更新"
    git push origin master
    ```
    
3. 在`themes/o2`目录中提交主题文件

    ```
    cd themes/o2
    git add -A
    git commit -a -m "更新主题"
    git push origin master
    ```
4. 在根目录下提交静态文件对应的md文件

    ```
    cd ../..
    git add -A
    git commit -a -m "更新远阿梅"
    git push origin hexo
    ```
    注意：根目录下是hexo分支！！！
