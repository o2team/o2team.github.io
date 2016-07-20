title: Node 生产环境调试
subtitle: "本文以问答的形式，介绍生产环境中该如何去调试 Node 应用。"
cover: //img.aotu.io/chuyik/node_debug_in_production_cover.png
date: 2016-02-24 12:25:35
categories: NodeJS
tags:
  - node
  - 调试
author:
    nick: 教授
    github_name: chuyik
---

本文以问答的形式，介绍生产环境中该如何去调试 Node 应用。
文章覆盖到了**性能问题**、**崩溃问题**、**内存泄露**的检查和解决手段。

## 随着用户请求数越来越多，Node 请求越来越慢。怎么处理？

每个用户的请求，都会经过这几个阶段：

```
网络请求 -> Node 中间层 -> 目标接口 -> 返回
```

前三个过程都会消耗一定的时间，因此我们应该分析每个阶段的耗时，进行针对性优化。

假设你是用 Express 作为 API 服务器，你可以利用 Express 官方的 [response-time](https://github.com/expressjs/response-time) 和 [StatsD](https://github.com/sivy/node-statsd)，
将每个中间层的请求数据都收集并统计起来。

但在 Express 世界之外，还有一个更专注于做 API 服务器的框架，叫 [restify](https://github.com/restify/node-restify)。
restify 是一个纯 Restful 的框架，它可以结合 DTrace 去记录一个用户请求中，每个环节消耗的时间。

图中高亮的部分是 restify 对于请求耗时的记录：

![resify_bunyan](https://cloud.githubusercontent.com/assets/6262943/11868141/c7fce5e2-a4f0-11e5-8299-5f13b06fa60f.png)

此外，restify 还有着更多强大功能，包括请求频率控制、内置 Ajax 错误类型、基于 [bunyan](https://github.com/trentm/node-bunyan) 的日志。


## 如何知道线上项目哪个函数消耗更多的 CPU 时间？

参考以下几个步骤，通过可视化的角度，揪出消耗 CPU 的凶手。

1. 确保你线上的 Node 版本是 5.0 以上
2. 启动 Node 项目时，增加 `--perf-basic-prof-only-functions` 参数，如：

    ```sh
    node --perf-basic-prof-only-functions app.js &   # Tips: `&`表示后台运行该代码
    ```

3. 用 [perf](https://perf.wiki.kernel.org/index.php/Tutorial) 生成 Node 进程的栈信息文件(stack trace)
    ```sh
    sudo yum install perf  # perf 非系统自带，需另外安装

    # 获取 Node 的进程 ID，用 30 秒时间记录栈信息并生成 `perf-xxxxx.map` 文件（被保存在 /tmp/）
    sudo perf record -F 99 -p `pgrep -n node` -g -- sleep 30

    ls /tmp/*.map                         # 检查该文件是否存在
    sudo chown root /tmp/perf-xxxxx.map   # 该文件设置权限
    sudo perf script > nodestacks         # 将该文件转换成可解析的 `nodestacks` 文件
    ```
4. 下载 FlameGraph 并生成可视化的栈信息火焰图

    ```sh
    git clone --depth 1 http://github.com/brendangregg/FlameGraph  # 下载 FlameGraph

    # 生成火焰图
    cd FlameGraph
    ./stackcollapse-perf.pl < ../nodestacks | ./flamegraph.pl --colors js > ../node-flamegraph.svg
    ```

最后会生成类似这样的图片：

![image](https://cloud.githubusercontent.com/assets/6262943/11839496/56be9ce4-a429-11e5-85b7-64e1cc730e52.png)

**解释这种图片的含义：**
  1. 每个方块为被调用的函数
  2. X 轴表示 CPU 的消耗时间
  3. Y 轴表示栈的深度
  4. 颜色为随机值

如果方块横向越长，说明这个函数消耗的 CPU 时间越多。
这样，你就可以定位到这个函数，深入代码去定位问题了。

## 如何收集线上的崩溃信息？

可以让 Node 在运行过程中，记录自身的运行状态，并崩溃的时候输出调试信息。
而这些调试信息被称为 [Core Dump](https://en.wikipedia.org/wiki/Core_dump)，会被保存在一个文件中，我们称之为 Core 文件。
Core 文件记录了进程运行时的一切状态，包括调用栈、内存变量、被调用的函数源码等。
有了这个文件，我们就可以最大化的还原出当时应用运行的过程。

下面我们利用 [mdb_v8][3] 工具，这个目前最好的 Node 命令行分析工具，结合一个简单案例来演示。

1. 配置 Solaris 环境

    由于 [mdb_v8][3] 只能运行在 Solaris 环境，因此你有两种选择：

    - 安装基于 Illumos 的系统，如 OmniOS 虚拟机
    - 使用 Joyent 公司收费的 Manta 服务，请参阅[这里][4]

    笔者使用第一种方式，即通过虚拟机运行 mdb_v8，详见 [Vagrant 安装 OmniOS 指南][2]。

2. 启动 Node 项目时，增加 `--abort-on-uncaught-exception` 参数，让应用在崩溃时输出 Core 文件
    
    本文用以下会崩溃的代码测试，生成 Core 文件。
    
    ```js
    var obj = {
        myproperty: "Hello World",
        count: 0,
    };
    
    function increment() {
        obj.count++;
        
        if (obj.count === 1000)
            throw new Error("sad trombone");  // 该行会让应用崩溃
        
        setImmediate(increment);
    }
    
    setImmediate(increment);
    ```

    ```bash
    # 运行上述代码
    node --abort-on-uncaught-exception throw.js
    ```

3. 将 Core 文件和 Node 二进制程序打包，传到 Vagrant 虚拟机内

    ```bash
    # 打包 Core Dump 和 Node 二进制程序
    mkdir debug
    cp core.* debug/
    cp $(which node) debug/
    zip -r debug.zip debug 
    
    # 传压缩包到 Vagrant 虚拟机内
    mv debug.zip xxxx  # xxxx 表示 Vagrantfile 所在的目录，即你启动虚拟机的目录
    
    # 在虚拟机里解压缩包
    unzip -o /vagrant/debug.zip -d ~
    ```

4. 使用 [mdb_v8][3] 解析 Core 文件

    ```bash
    # 下载最新的 mdb_v8 模块
    wget https://us-east.manta.joyent.com/Joyent_Dev/public/mdb_v8/v1.1.2/mdb_v8_amd64.so
    
    # 使用 mdb 工具加载 Core Dump，格式为：mdb [Node 二进制程序] [Core 文件]
    mdb ./node ./core
    
    # 进入 REPL 后, 运行以下代码加载 mdb_v8 模块
    > ::load ./mdb_v8_amd64.so
    ```

5. 分析崩溃原因

    5.1. 使用 mdb_v8 的 [jsstack][9] 指令，查看最后的调用栈情况
    
    ```bash
    > ::jsstack -v
    native: v8::base::OS::Abort+0xd
    native: v8::internal::Isolate::DoThrow+0x381
    native: v8::internal::Isolate::Throw+0x11
    native: v8::internal::Runtime_Throw+0x3d
            (1 internal frame elided)
    js:     increment
            file: /export/www/node/mongo-express/throw.js
            posn: line 6
            this: 2ac5150fc3f9 (JSObject: Immediate)
            (    1 function (exports, require, module, __filename, __dirname) { var obj = {
                2   myproperty: "Hello World",
                3   count: 0,
                4 };
                5
                6 function increment() {
                7   obj.count++;
                8
                9   if (obj.count === 1000)
                10     throw new Error("sad trombone");
                11
                12   setImmediate(increment);
                13 }
                14
                15 setImmediate(increment);
                16
                17 });
    
    js:     processImmediate
            file: timers.js
            posn: line 342
            this: 2d184056ef69 (JSObject: process)
            ...
    ```

    5.2. 从上面信息得知，最后一个被调用的函数是 `increment`，因此可以查下该函数的地址
    
    ```bash
    # 查询 increment 函数地址值
    > ::jsfunctions -n increment
            FUNC   #FUNCS NAME         FROM
    2ac51509c7a9        1 increment    /export/www/node/mongo-express/throw.js line 6
    ```

    5.3. 查到地址值后，就可以查出函数当时的局部变量
    
    ```bash
    # 查询 increment 函数当时的局部变量
    > 2ac51509c7a9::jsclosure
    "obj": 2ac51509c941: {
        "myproperty": 2ae60c1a3f39: "Hello World",
        "count": 3e800000000: 1000,
    }
    "increment": 2ac51509c7a9: function increment
    ```

    结合代码可知，由于 `count` 数值已经到达 1000，导致应用崩溃。

    5.4. 当然，通过以下命令，还能查到 `count` 属性所在对象的起始状态和结束状态
    
    ```bash
    > ::findjsobjects -p count | ::findjsobjects -l | ::jsprint
    {
        "myproperty": "Hello World",
        "count": 0,
    }
    {
        "myproperty": "Hello World",
        "count": 1000,
    }
    ```

    对于 mdb_v8 更多的 Node 指令，请参阅[这里][5]。
    

## 如何追踪内存泄露问题？

上个问题中，我们用 Node 的 `--abort-on-uncaught-exception` 参数，让应用在崩溃后输出 Core 文件。
但如果应用一直在运行（即无崩溃），可以用 Linux 自带的 [gcore][6] 命令，导出 Core 文件并分析内存泄露的原因。

1. 本文用以下代码测试，该代码会导致内存泄露

    ```js
    var bigData = null;
    var replaceData = function () {
        var originalData = bigData
        bigData = {
            longStr: new Array(1000000).join('*'),
            closure: function () {
                // 这里引用到了 originalData，导致旧的 bigData 没有被释放
                if (originalData)
                    console.log(originalData.longStr.length)
            }
        }
        
        bigData.closure()
    }
    
    setInterval(replaceData, 1000)
    console.log('process id: ', process.pid)
    ```
    用 `node xxx.js` 命令运行代码即可。 

2. 每隔一段时间，用 [gcore][6] 对上述代码所在进程进行 Core Dump

    ```bash
    # PID 为进程 ID，上面代码会打印出来
    # 文件会被保存为 leak_1.PID
    gcore -o leak_1 PID  
    
    # 进程运行一段时间后（如15秒），再 Core Dump 一次
    # 文件会被保存为 leak_2.PID
    gcore -o leak_2 PID
    ```

3. 利用 mdb_v8 提供的工具 [dumpjsobjects][7]，提取 Core 文件中的 JS 对象，并输出文件

    ```bash
    # 每行命令生成两个文件，分别为 obj_id_x / obj_content_x
    ./dumpjsobjects ./leak_1.PID ./mdb_v8_amd64.so obj_id_1 obj_content_1
    ./dumpjsobjects ./leak_2.PID ./mdb_v8_amd64.so obj_id_2 obj_content_2
    ```

4. 利用 mdb_v8 提供的工具 [mdbv8diff][8]，进行 JS 对象对比

    比较两个时期的 JS 对象的异同，即可获得未被释放的对象地址。

    ```bash
    # 下载安装 mdbv8diff
    git clone https://github.com/joyent/mdb_v8.git
    cd mdb_v8/tools/mdbv8diff
    npm install
    
    # 对比 Core 文件的 JS 对象
    ./mdbv8diff /path/to/obj_content_1 /path/to/obj_content_2
    ```

    打印出来的结果为：

    ```
    135f38df83d9: only in /Users/edc/Downloads/omnios/du_3
    ```

5. 用 mdb_v8 打印 `135f38df83d9` 内存地址对应的对象

    ```bash
    # 打印该地址对象的内容
    > 135f38df83d9::jsprint
    {
        "longStr": "*******....",
        "closure": function <anonymous> (as bigData.closure),
    }
    
    # 找出该对象所有的实例
    > 135f38df83d9::findjsobjects
    39fac26f83d9
    39ec3a4f83d9
    3720c57f83d9
    ...
    ```

    从结果可以发现，该对象的实例一直在内存里未被释放。

## 后语
本文参考了 Netflix 工程师 [Yunong Xiao](https://twitter.com/YunongX) 的[演讲分享][1]，在此感谢。
希望该文章可以给读者更多解决 Node 生产环境调试的思路。但对于生产环境中面临的各种复杂问题，也许需要更多的手段才能解决。 

---
References
1. http://techblog.netflix.com/2015/12/debugging-nodejs-in-production.html
2. http://yunong.io/2015/11/23/generating-node-js-flame-graphs/
3. http://www.slideshare.net/davidapacheco/surge2012
4. https://www.joyent.com/blog/mdb-and-linux
5. http://info.meteor.com/blog/an-interesting-kind-of-javascript-memory-leak

[1]: http://techblog.netflix.com/2015/12/debugging-nodejs-in-production.html
[2]: issues/5
[3]: https://github.com/joyent/mdb_v8
[4]: https://www.joyent.com/blog/mdb-and-linux
[5]: https://github.com/joyent/mdb_v8/blob/master/docs/usage.md#node-specific-mdb-command-reference
[6]: http://man7.org/linux/man-pages/man1/gcore.1.html
[7]: https://github.com/joyent/mdb_v8/blob/master/tools/dumpjsobjects
[8]: https://github.com/joyent/mdb_v8/blob/master/tools%2Fmdbv8diff%2Fmdbv8diff
[9]: https://github.com/joyent/mdb_v8/blob/master/docs/usage.md#jsstack