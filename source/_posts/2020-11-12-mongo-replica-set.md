title: MongoDB 副本集之入门篇  
subtitle: MongoDB 副本集保证了数据的冗余以及高可用性，本篇文章主要从副本集介绍、本地副本集搭建、副本集读写数据这三个方面来带大家认识下 mongodb 副本集。 
cover: https://img12.360buyimg.com/ling/jfs/t1/136768/1/14633/63869/5fa14034Eb449b776/6d30e40309daa8a4.jpg  
category: 经验分享  
tags:  
  - mongodb  
  - replication
  - MongoDB 副本集
author:  
  nick: 小唐  
date: 2020-11-12 20:10:20  

---

# mongodb 副本集之入门篇

前言：mongodb 因为高性能、高可用性、支持分片等特性，作为非关系型数据库被大家广泛使用。其高可用性主要是体现在 mongodb 的副本集上面（可以简单理解为一主多从的集群），本篇文章主要从副本集介绍、本地搭建副本集、副本集读写数据这三个方面来带大家认识下 mongodb 副本集。


## 一、 mongodb 副本集介绍
mongodb 副本集（Replica Set）包括主节点（primary）跟副本节点（Secondaries）。

主节点只能有一个，所有的写操作请求都在主节点上面处理。副本节点可以有多个，通过同步主节点的操作日志（oplog）来备份主节点数据。

在主节点挂掉后，有选举权限的副本节点会自动发起选举，并从中选举出新的主节点。

副本节点可以通过配置指定其具体的属性，比如选举、隐藏、延迟同步等，最多可以有50个副本节点，但只能有7个副本节点能参与选举。虽然副本节点不能处理写操作，但可以处理读请求，这个下文会专门讲到。

搭建一个副本集集群最少需要三个节点：一个主节点，两个备份节点，如果三个节点分布合理，基本可以保证线上数据99.9%安全。三个节点的架构如下图所示：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-read-write-operations-primary.bakedsvg.svg)

如果只有一个主节点，一个副本节点，且没有资源拿来当第二个副本节点，那就可以起一个仲裁者节点（arbiter），不存数据，只用来选举用，如下图所示：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-primary-with-secondary-and-arbiter.bakedsvg.svg)

当主节点挂掉后，那么两个副本节点会进行选举，从中选举出一个新的主节点，流程如下：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-trigger-election.bakedsvg.svg)

对于副本集成员属性，特别需要说明下这几个：priority、hidden、slaveDelay、tags、votes。

- priority

 对于副本节点，可以通过该属性来增大或者减小该节点被选举成为主节点的可能性，取值范围为0-1000（如果是arbiters，则取值只有0或者1），数据越大，成为主节点的可能性越大，如果被配置为0，那么他就不能被选举成为主节点，而且也不能主动发起选举。
 
 这种特性一般会被用在有多个数据中心的情况下，比如一个主数据中心，一个备份数据中心，主数据中心速度会更快，如果主节点挂掉，我们肯定希望新主节点也在主数据中心产生，那么我们就可以设置在备份数据中心的副本节点优先级为0，如下图所示：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-three-members-geographically-distributed.bakedsvg.svg)

- hidden

  隐藏节点会从主节点同步数据，但对客户端不可见，在mongo shell 执行 db.isMaster() 方法也不会展示该节点，隐藏节点必须Priority为0，即不可以被选举成为主节点。但是如果有配置选举权限的话，可以参与选举。
  
  因为隐藏节点对客户端不可见，所以跟客户端不会互相影响，可以用来备份数据或者跑一些后端定时任务之类的操作，具体如下图，4个备份节点都从主节点同步数据，其中1个为隐藏节点：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-hidden-member.bakedsvg.svg
)

- slaveDelay
  
  延迟同步即延迟从主节点同步数据，比如延迟时间配置的1小时，现在时间是 09:52，那么延迟节点中只同步到主节点 08:52 之前的数据。另外需要注意延迟节点必须是隐藏节点，且Priority为0。
 
  那这个延迟节点有什么用呢？有过数据库误操作惨痛经历的开发者肯定知道答案，那就是为了防止数据库误操作，比如更新服务前，一般会先执行数据库更新脚本，如果脚本有问题，且操作前未做备份，那数据可能就找不回了。但如果说配置了延迟节点，那误操作完，还有该节点可以兜底，只能说该功能真是贴心。具体延迟节点如下图所展示：

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-delayed-member.bakedsvg.svg)

- tags
 
  支持对副本集成员打标签，在查询数据时会用到，比如找到对应标签的副本节点，然后从该节点读取数据，这点也非常有用，可以根据标签对节点分类，查询数据时不同服务的客户端指定其对应的标签的节点，对某个标签的节点数量进行增加或减少，也不怕会影响到使用其他标签的服务。Tags 的具体使用，文章下面章节也会讲到。
 
- votes

  表示节点是否有权限参与选举，最大可以配置7个副本节点参与选举。
 
## 二、副本集的搭建以及测试
安装mongodb 教程：[https://docs.mongodb.com/manual/installation/]()

我们来搭建一套 P-S-S 结构的副本集（1个 Primary 节点，2个 Secondary 节点），大致过程为：先启动三个不同端口的 mongod 进程，然后在 mongo shell 中执行命令初始化副本集。

启动单个mongod 实例的命令为： 

`mongod --replSet rs0 --port 27017 --bind_ip localhost,<hostname(s)|ip address(es)> --dbpath /data/mongodb/rs0-0  --oplogSize 128`

参数说明：
	
| 参数      | 说明                                                         | 示例                |
| --------- | ------------------------------------------------------------ | ------------------- |
| replSet   | 副本集名称                                                   | rs0                 |
| port      | mongod 实例端口                                              | 27017               |
| bind_ip   | 访问该实例的地址列表，只是本机访问可以设置为localhost 或者 127.0.0.1，生产环境建议使用内部域名 | Localhost           |
| dbpath    | 数据存放位置                                                 | /data/mongodb/rs0-0 |
| oplogSize | 操作日志大小                                                 | 128                 |

#### 搭建步骤如下：

1. 先创建三个目录来分别存放这三个节点的数据
    
	`mkdir -p /data/mongodb/rs0-0  /data/mongodb/rs0-1 /data/mongodb/rs0-2`

2. 分别启动三个mongod 进程，端口分别为：27018，27019，27020

  第一个：
    `mongod --replSet rs0 --port 27018 --bind_ip localhost --dbpath /data/mongodb/rs0-0  --oplogSize 128`

  第二个：
    `mongod --replSet rs0 --port 27019 --bind_ip localhost --dbpath /data/mongodb/rs0-1  --oplogSize 128`

  第三个：
    `mongod --replSet rs0 --port 27020 --bind_ip localhost --dbpath /data/mongodb/rs0-2  --oplogSize 128`

3. 使用 mongo 进入第一个 mongod 示例，使用 rs.initiate() 进行初始化

  登录到27018： mongo localhost:27018
 
  执行：
 
  ```js
  rsconf = {
      _id: "rs0",
      members: [
        {
          _id: 0,
          host: "localhost:27018"
        },
        {
          _id: 1,
          host: "localhost:27019"
        },
        {
          _id: 2,
          host: "localhost:27020"
        }
      ]
  }

  rs.initiate( rsconf )
  ```

  以上就已经完成了一个副本集的搭建，在 mongo shell 中执行 rs.conf() 可以看到每个节点中 host、arbiterOnly、hidden、priority、 votes、slaveDelay等属性，是不是超级简单。。
 
  执行 rs.conf()  ，结果展示如下：

  ```js
  rs.conf()
  {
      "_id" : "rs0",
      "version" : 1,
      "protocolVersion" : NumberLong(1),
      "writeConcernMajorityJournalDefault" : true,
      "members" : [
        {
          "_id" : 0,
          "host" : "localhost:27018",
          "arbiterOnly" : false,
          "buildIndexes" : true,
          "hidden" : false,
          "priority" : 1,
          "tags" : {
    
          },
          "slaveDelay" : NumberLong(0),
          "votes" : 1
        },
        {
          "_id" : 1,
          "host" : "localhost:27019",
          "arbiterOnly" : false,
          "buildIndexes" : true,
          "hidden" : false,
          "priority" : 1,
          "tags" : {
    
          },
          "slaveDelay" : NumberLong(0),
          "votes" : 1
        },
        {
          "_id" : 2,
          "host" : "localhost:27020",
          "arbiterOnly" : false,
          "buildIndexes" : true,
          "hidden" : false,
          "priority" : 1,
          "tags" : {
    
          },
          "slaveDelay" : NumberLong(0),
          "votes" : 1
        }
      ],
      "settings" : {
        "chainingAllowed" : true,
        "heartbeatIntervalMillis" : 2000,
        "heartbeatTimeoutSecs" : 10,
        "electionTimeoutMillis" : 10000,
        "catchUpTimeoutMillis" : -1,
        "catchUpTakeoverDelayMillis" : 30000,
        "getLastErrorModes" : {
    
        },
        "getLastErrorDefaults" : {
          "w" : 1,
          "wtimeout" : 0
        },
        "replicaSetId" : ObjectId("5f957f12974186fc616688fb")
      }
  }
  ```

特别注意下：在 mongo shell 中，有 rs 跟 db。

* rs 是指副本集，有rs.initiate()，rs.conf(), rs.reconfig(), rs.add() 等操作副本集的方法
* db 是指数据库，其下是对数据库的一些操作，比如下面会用到 db.isMaster(), db.collection.find(), db.collection.insert() 等。

#### 我们再来测试下 Automatic Failover

1. 可以直接停掉主节点localhost:27018 来测试下主节点挂掉后，副本节点重新选举出新的主节点，即自动故障转移（Automatic Failover）

  杀掉主节点 27018后，可以看到 27019 的输出日志里面选举部分，27019 发起选举，并成功参选成为主节点：

  ```
  2020-10-26T21:43:58.156+0800 I  REPL     [replexec-304] Scheduling remote command request for vote request: RemoteCommand 100694 -- target:localhost:27018 db:admin cmd:{ replSetRequestVotes: 1, setName: "rs0", dryRun: false, term: 17, candidateIndex: 1, configVersion: 1, lastCommittedOp: { ts: Timestamp(1603719830, 1), t: 16 } }
  2020-10-26T21:43:58.156+0800 I  REPL     [replexec-304] Scheduling remote command request for vote request: RemoteCommand 100695 -- target:localhost:27020 db:admin cmd:{ replSetRequestVotes: 1, setName: "rs0", dryRun: false, term: 17, candidateIndex: 1, configVersion: 1, lastCommittedOp: { ts: Timestamp(1603719830, 1), t: 16 } }
  2020-10-26T21:43:58.159+0800 I  ELECTION [replexec-301] VoteRequester(term 17) received an invalid response from localhost:27018: ShutdownInProgress: In the process of shutting down; response message: { operationTime: Timestamp(1603719830, 1), ok: 0.0, errmsg: "In the process of shutting down", code: 91, codeName: "ShutdownInProgress", $clusterTime: { clusterTime: Timestamp(1603719830, 1), signature: { hash: BinData(0, 0000000000000000000000000000000000000000), keyId: 0 } } }
  2020-10-26T21:43:58.164+0800 I  ELECTION [replexec-305] VoteRequester(term 17) received a yes vote from localhost:27020; response message: { term: 17, voteGranted: true, reason: "", ok: 1.0, $clusterTime: { clusterTime: Timestamp(1603719830, 1), signature: { hash: BinData(0, 0000000000000000000000000000000000000000), keyId: 0 } }, operationTime: Timestamp(1603719830, 1) }
  2020-10-26T21:43:58.164+0800 I  ELECTION [replexec-304] election succeeded, assuming primary role in term 17
  ```

2. 然后执行 rs.status() 查看当前副本集情况，可以看到27019变为主节点，27018 显示已挂掉 health = 0

  ```js
  rs.status()
  {
      "set" : "rs0",
      "date" : ISODate("2020-10-26T13:44:22.071Z"),
      "myState" : 1,
      "heartbeatIntervalMillis" : NumberLong(2000),
      "majorityVoteCount" : 2,
      "writeMajorityCount" : 2,
      "members" : [
        {
          "_id" : 0,
          "name" : "localhost:27018",
          "ip" : "127.0.0.1",
          "health" : 0,
          "state" : 8,
          "stateStr" : "(not reachable/healthy)",
          "uptime" : 0,
          "optime" : {
            "ts" : Timestamp(0, 0),
            "t" : NumberLong(-1)
          },
          "optimeDurable" : {
            "ts" : Timestamp(0, 0),
            "t" : NumberLong(-1)
          },
          "optimeDate" : ISODate("1970-01-01T00:00:00Z"),
          "optimeDurableDate" : ISODate("1970-01-01T00:00:00Z"),
          "lastHeartbeat" : ISODate("2020-10-26T13:44:20.202Z"),
          "lastHeartbeatRecv" : ISODate("2020-10-26T13:43:57.861Z"),
          "pingMs" : NumberLong(0),
          "lastHeartbeatMessage" : "Error connecting to localhost:27018 (127.0.0.1:27018) :: caused by :: Connection refused",
          "syncingTo" : "",
          "syncSourceHost" : "",
          "syncSourceId" : -1,
          "infoMessage" : "",
          "configVersion" : -1
        },
        {
          "_id" : 1,
          "name" : "localhost:27019",
          "ip" : "127.0.0.1",
          "health" : 1,
          "state" : 1,
          "stateStr" : "PRIMARY",
          "uptime" : 85318,
          "optime" : {
            "ts" : Timestamp(1603719858, 1),
            "t" : NumberLong(17)
          },
          "optimeDate" : ISODate("2020-10-26T13:44:18Z"),
          "syncingTo" : "",
          "syncSourceHost" : "",
          "syncSourceId" : -1,
          "infoMessage" : "",
          "electionTime" : Timestamp(1603719838, 1),
          "electionDate" : ISODate("2020-10-26T13:43:58Z"),
          "configVersion" : 1,
          "self" : true,
          "lastHeartbeatMessage" : ""
        },
        {
          "_id" : 2,
          "name" : "localhost:27020",
          "ip" : "127.0.0.1",
          "health" : 1,
          "state" : 2,
          "stateStr" : "SECONDARY",
          "uptime" : 52468,
          "optime" : {
            "ts" : Timestamp(1603719858, 1),
            "t" : NumberLong(17)
          },
          "optimeDurable" : {
            "ts" : Timestamp(1603719858, 1),
            "t" : NumberLong(17)
          },
          "optimeDate" : ISODate("2020-10-26T13:44:18Z"),
          "optimeDurableDate" : ISODate("2020-10-26T13:44:18Z"),
          "lastHeartbeat" : ISODate("2020-10-26T13:44:20.200Z"),
          "lastHeartbeatRecv" : ISODate("2020-10-26T13:44:21.517Z"),
          "pingMs" : NumberLong(0),
          "lastHeartbeatMessage" : "",
          "syncingTo" : "localhost:27019",
          "syncSourceHost" : "localhost:27019",
          "syncSourceId" : 1,
          "infoMessage" : "",
          "configVersion" : 1
        }
      ]
  }
  ```

3. 再次启动27018：
  `mongod --replSet rs0 --port 27018 --bind_ip localhost --dbpath /data/mongodb/rs0-0  --oplogSize 128`
 
  可以在节点 27019 日志中看到已检测到 27018，并且已变为副本节点，通过rs.status 查看结果也是如此。

  ```
  2020-10-26T21:52:06.871+0800 I  REPL     [replexec-305] Member localhost:27018 is now in state SECONDARY
  ```

## 三、副本集写跟读的一些特性
### 写关注（Write concern）

 副本集写关注是指写入一条数据，主节点处理完成后，需要其他承载数据的副本节点也确认写成功后，才能给客户端返回写入数据成功。
 
 这个功能主要是解决主节点挂掉后，数据还未来得及同步到副本节点，而导致数据丢失的问题。
 
 可以配置节点个数，默认配置 {“w”：1}，这样表示主节点写入数据成功即可给客户端返回成功，“w” 配置为2，则表示除了主节点，还需要收到其中一个副本节点返回写入成功，“w” 还可以配置为 "majority"，表示需要集群中大多数承载数据且有选举权限的节点返回写入成功。
 
如下图所示，P-S-S 结构（一个 primary 节点，两个 secondary 节点），写请求里面带了w : “majority" ，那么主节点写入完成后，数据同步到第一个副本节点，且第一个副本节点回复数据写入成功后，才给客户端返回成功。

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/crud-write-concern-w-majority.bakedsvg.svg
)


关于写关注在实际中如何操作，有下面两种方法：

1. 在写请求中指定 writeConcern 相关参数，如下：

  ```js
  db.products.insert(
      { item: "envelopes", qty : 100, type: "Clasp" },
      { writeConcern: { w: "majority" , wtimeout: 5000 } }
  )
  ```

2. 修改副本集 getLastErrorDefaults 配置，如下：

  ```js
  cfg = rs.conf()
  cfg.settings.getLastErrorDefaults = { w: "majority", wtimeout: 5000 }
  rs.reconfig(cfg)
  ```

### 读偏好 （Read preference）
读跟写不一样，为了保持一致性，写只能通过主节点，但读可以选择主节点，也可以选择副本节点，区别是主节点数据最新，副本节点因为同步问题可能会有延迟，但从副本节点读取数据可以分散对主节点的压力。

![](https://storage.360buyimg.com/o2-talos-report/aritcle-mongo-replica/replica-set-read-preference-secondary.bakedsvg.svg)

因为承载数据的节点会有多个，那客户端如何选择从那个节点读呢？主要有3个条件（Tag Sets、 maxStalenessSeconds、Hedged Read），5种模式（primary、primaryPreferred、secondary、secondaryPreferred、nearest）

#### 首先说一下 5种模式，其特点如下表所示：


| **模式**           | **特点**                                                     |
| ------------------ | ------------------------------------------------------------ |
| primary            | 所有读请求都从主节点读取                                     |
| primaryPreferred   | 主节点正常，则所有读请求都从主节点读取，如果主节点挂掉，则从符合条件的副本节点读取 |
| secondary          | 所有读请求都从副本节点读取                                   |
| secondaryPreferred | 所有读请求都从副本节点读取，但如果副本节点都挂掉了，那就从主节点读取 |
| nearest            | 主要看网络延迟，选取延迟最小的节点，主节点跟副本节点均可     |


#### 再说下3个条件，条件是在符合模式的基础上，再根据条件删选具体的节点
1. Tag Sets（标签）

  顾名思义，这个可以给节点加上标签，然后查找数据时，可以根据标签选择对应的节点，然后在该节点查找数据。可以通过mongo shell 使用 rs.conf() 查看当前每个节点下面的 tags， 修改或者添加tags 过程同上面修改 getLastErrorDefaults 配置 ，如：` cfg.members[n].tags = { "region": "South", "datacenter": "A" }`

2. maxStalenessSeconds （可容忍的最大同步延迟）

  顾名思义+1，这个值是指副本节点同步主节点写入的时间 跟 主节点实际最近写入时间的对比值，如果主节点挂掉了，那就跟副本集中最新写入的时间做对比。

  这个值建议设置，避免因为部分副本节点网络原因导致比较长时间未同步主节点数据，然后读到比较老的数据。特别注意的是该值需要设置 90s 以上，因为客户端是定时去校验副本节点的同步延迟时间，数据不会特别准确，设置比 90s 小，会抛出异常。

3. Hedged Read （对冲读取）

  该选项是在分片集群 MongoDB 4.4 版本后才支持，指 mongos 实例路由读取请求时会同时发给两个符合条件的副本集节点，然后那个先返回结果就返回这个结果给客户端。

#### 那问题来了，如此好用的模式以及条件在查询请求中如何使用呢？

1. 在代码中连接数据库，使用 connection string uri 时，可以加上下面的这三个参数

  | **参数**            | **说明**                                                     |
  | ------------------- | ------------------------------------------------------------ |
  | readPreference      | 模式，枚举值有：primary（默认值）、 primaryPreferred、secondary、secondaryPreferred、nearest |
  | maxStalenessSeconds | 最大同步延时秒数，取值0 - 90 会报错， -1 表示没有最大值      |
  | readPreferenceTags  | 标签，如果标签是 { "dc": "ny", "rack": "r1" }, 则在uri 为 readPreferenceTags=dc:ny,rack:r1 |
  
  例如下面：
 
  `mongodb://db0.example.com,db1.example.com,db2.example.com/?replicaSet=myRepl&readPreference=secondary&maxStalenessSeconds=120&readPreferenceTags=dc:ny,rack:r1`


2. 在mogo shell 中，可以使用 [cursor.readPref()](https://docs.mongodb.com/manual/reference/method/cursor.readPref/#cursor.readPref) 或者 [Mongo.setReadPref()](https://docs.mongodb.com/manual/reference/method/Mongo.setReadPref/#Mongo.setReadPref)

  cursor.readPref() 参数分别为： mode、tag set、hedge options, 具体请求例如下面这样
 
  ```js
  db.collection.find({ }).readPref(
      "secondary",                      // mode
      [ { "datacenter": "B" },  { } ],  // tag set
      { enabled: true }                 // hedge options
  )
  ```

  Mongo.setReadPref() 类似，只是预先设置请求条件，这样就不用每个请求后面带上 readPref 条件。


#### 可以在搭建好的集群中简单测试下该功能
1. 登录主节点： `mongo localhost:27018`

2. 插入一条数据： `db.nums.insert({name: “num0”})`

   在当前节点查询: `db.nums.find()`
   
   可以看到本条数据： `{ "_id" : ObjectId("5f958687233b11771912ced5"), "name" : "num0" }`
  
3. 登录副本节点： `mongo localhost:27019`

  查询：`db.nums.find()`
 
  因为查询模式默认为 primary，所以在副本节点查询会报错，如下：
 
  ```js
  Error: error: {
    "operationTime" : Timestamp(1603788383, 1),
    "ok" : 0,
    "errmsg" : "not master and slaveOk=false",
    "code" : 13435,
    "codeName" : "NotMasterNoSlaveOk",
    "$clusterTime" : {
      "clusterTime" : Timestamp(1603788383, 1),
      "signature" : {
        "hash" : BinData(0,"AAAAAAAAAAAAAAAAAAAAAAAAAAA="),
        "keyId" : NumberLong(0)
      }
    }
  }
  ```

  查询时指定模式为 “secondary”： `db.nums.find().readPref(“secondary")`
 
  就可以查询到插入的数据：` { "_id" : ObjectId("5f958687233b11771912ced5"), "name" : "num0" }`
 

## 结语

以上内容都是阅读 MongoDB 官方文档后，然后挑简单且重要的一些点做的总结，如果大家对 MongoDB 感兴趣，建议直接啃一啃[官方文档](https://docs.mongodb.com/manual/replication/)。




