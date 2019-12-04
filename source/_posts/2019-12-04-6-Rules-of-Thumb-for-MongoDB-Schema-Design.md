title: 前端也要懂一点 MongoDB Schema 设计
subtitle: 当前技术分界线日益模糊，许多前端同学也免不了接触到 MongoDB 开发和 Schema 设计，本文翻译自 MongoDB 优质博客：6 Rules of Thumb for MongoDB Schema Design，为你提供全面的 MongoDB Schema 设计原则指导。
cover: https://user-images.githubusercontent.com/9441951/70128622-28a64400-16b8-11ea-833e-0a7380c436ee.png
categories: 全栈开发
tags:
  - MongoDB
author:
  nick: PinesCheng
  github_name: Pines-Cheng
date: 2019-12-04 16:35:59
---

> 翻译自 MongoDB 官方博客：
> * [6 Rules of Thumb for MongoDB Schema Design: Part 1](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-1)
> * [6 Rules of Thumb for MongoDB Schema Design: Part 2](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-2)
> * [6 Rules of Thumb for MongoDB Schema Design: Part 3](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design-part-3)

“我有很多 SQL 的开发经验，但是对于 MongoDB 来说，我只是个初学者。 我该如何在数据库里实现 `One-to-N` 的关系? ” 这是我从参加 MongoDB office hours 的用户那里得到的最常见的问题之一。

对于这个问题，我无法提供一个简单明了的答案，因为在 MongoDB 里，有很多种方法可以实现 `One-to-N` 关系。 Mongodb 拥有丰富且细致入微的词汇表，用来表达在 SQL 中被精简成术语 `One-to-N` 的内容。接下来让我带你参观一下 使用 Mongodb 实现 `One-to-N` 关系的各种方式。

这一块涉及到的内容很多，因此我把它分成三部分。

* 在第一部分中，我将讨论建立 `One-to-N` 关系模型的三种基本方法。
* 在第二部分中，我将介绍更复杂的模式设计，包括 反规范化（denormalization）和 双向引用（two-way referencing）。
* 在最后一部分，我将回顾一系列的选型，并给出一些建议，供你在建立 `One-to-N` 关系时，从成千上万的选择中做出正确的选择。

许多初学者认为，在 MongoDB 中建立 `One-to-N` 模型的唯一方法是在父文档中嵌入一组 子文档（sub-documents），但事实并非如此。 **你可以嵌入一个文档，并不意味着你应该嵌入一个文档**。

在设计 MongoDB 模式时，您需要从一个在使用 SQL 时从未考虑过的问题开始：关系（relationship）的基数（cardinality）是什么？ 简而言之: **你需要用更细微的差别来描述你的 `One-to-N` 关系: 是 `one-to-few`、`one-to-many` 还是 `one-to-squillions` ？ 根据它是哪一个，你可以使用不同的方式来进行关系建模**。

## Basics: Modeling One-to-Few

`one-to-few` 的一个例子可能是一个人的地址。 这是一个很好的使用 嵌入（embedding）的例子 -- 你可以把地址放在 Person 对象的数组中：

```sh
> db.person.findOne()
{
  name: 'Kate Monster',
  ssn: '123-456-7890',
  addresses : [
     { street: '123 Sesame St', city: 'Anytown', cc: 'USA' },
     { street: '123 Avenue Q', city: 'New York', cc: 'USA' }
  ]
}
```

这种设计具有嵌入的所有优点和缺点：**主要优点是不必执行单独的查询来获取嵌入的详细信息；主要缺点是无法将嵌入的详细信息作为 独立实体（stand-alone entities）来访问**。

例如，如果您为一个任务跟踪系统建模，每个 Person 都会有一些分配给他们的任务。 在 Person 文档中嵌入任务会使 “显示明天到期的所有任务” 这样的查询比实际需要的要困难得多。

## Basics: One-to-Many

“one-to-many” 的一个例子可能是替换零件（parts）订购系统中的产品（products）零部件。 每个产品可能有多达几百个替换零件，但从来没有超过几千（所有不同尺寸的螺栓、垫圈和垫圈加起来）。 这是一个很好的使用 引用（referencing）的例子 —— 您可以将零件的 ObjectIDs 放在产品文档的数组中。 (示例使用 2 字节的 ObjectIDs，以方便阅读)

每个零件都有自己的 document:

```sh
> db.parts.findOne()
{
    _id : ObjectID('AAAA'),
    partno : '123-aff-456',
    name : '#4 grommet',
    qty: 94,
    cost: 0.94,
    price: 3.99
}
```

每个产品都有自己的 document，其中包含对组成产品的各个零件的一系列 ObjectID 引用：

```sh
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // array of references to Part documents
        ObjectID('AAAA'),    // reference to the #4 grommet above
        ObjectID('F17C'),    // reference to a different Part
        ObjectID('D2AA'),
        // etc
    ]
    ...
```

然后，您可以使用 应用程序级别的联接（application-level join）来检索特定产品的零件：

```sh
 // Fetch the Product document identified by this catalog number
> product = db.products.findOne({catalog_number: 1234});
   // Fetch all the Parts that are linked to this Product
> product_parts = db.parts.find({_id: { $in : product.parts } } ).toArray() ;
```

为了高效运行，您需要在 `products.catalog_number` 上添加索引。 注意，零件上总是有一个索引 `parts._id`，这样查询通常效率很高。

这种类型的 引用（referencing）和 嵌入（embedding）相比有一系列的优点和缺点：**每个零件都是一个独立的文档，因此很容易对它们进行搜索和单独更新。 使用这个模式的一个弊端是必须执行两次查询来获取有关产品零件的详细信息**。 (但是在我们进入第二部分的 反规范化（denormalizing）之前，请保持这种想法。)

作为一个额外的好处，这个模式允许一个单独的零件被多个产品 使用，因此您的 `One-to-N` 模式就变成了 `N-to-N` 模式，而不需要任何 联接表（join table）！

## Basics: One-to-Squillions

`one-to-squillions` 的一个例子可能是为不同机器收集日志消息的事件日志系统。 任何给定的 主机（hosts）都可以生成足够的日志信息（logmsg），从而超过溢出 document 16 MB 的限制，即使数组中存储的所有内容都是 `ObjectID`。这就是 "父引用"(parent-referencing) 的经典用例 —— 你有一个 `host document`，然后将主机的 `ObjectID` 存储在日志信息的 document 中。

```sh
> db.hosts.findOne()
{
    _id : ObjectID('AAAB'),
    name : 'goofy.example.com',
    ipaddr : '127.66.66.66'
}

>db.logmsg.findOne()
{
    time : ISODate("2014-03-28T09:42:41.382Z"),
    message : 'cpu is on fire!',
    host: ObjectID('AAAB')       // Reference to the Host document
}
```

您可以使用（略有不同的） 应用程序级别的联接（application-level join）来查找主机最近的 5,000 条消息：

```sh
  // find the parent ‘host’ document
> host = db.hosts.findOne({ipaddr : '127.66.66.66'});  // assumes unique index
   // find the most recent 5000 log message documents linked to that host
> last_5k_msg = db.logmsg.find({host: host._id}).sort({time : -1}).limit(5000).toArray()
```

## 回顾

因此，即使在这个基本层次上，在设计 MongoDB Schema 时也需要比在设计类似的关系模式（ Relational Schema）时考虑更多的问题。 你需要考虑两个因素：

* `One-to-N` 中 “N” 一侧的实体是否需要独立存在？
* 这种关系的基数性是什么：`one-to-few` 、 `one-to-many`、 还是 `one-to-squillions` ？

基于这些因素，您可以从三种基本的 `One-to-N` 模式设计中选择一种：

* 如果基数是 `one-to-few`，并且不需要访问父对象上下文之外的 嵌入对象（embedded object），则将 N 端 嵌入父对象
* 如果基数是 `one-to-many` ，或者如果 N 端对象因为任何原因应该单独存在，则使用 N 端对象的引用数组
* 如果基数是 `one-to-squillions`，则使用 N-side 对象中对 One-side 的引用

# Part 2: Two-way referencing and denormalization

这是我们在 MongoDB 中构建 `One-to-N` 关系的第二站。 上次我介绍了三种基本的模式设计: 嵌入（embedding）、子引用（child-referencing）和父引用（parent-referencing）。 我还提到了在选择这些设计时要考虑的两个因素：

* `One-to-N` 中 N 侧的实体是否需要独立存在？
* 这种关系的基数性是什么: 是 `one-to-few`、`one-to-many` 还是 `one-to-squillions`？

有了这些基本技术，我可以继续讨论更复杂的模式设计，包括 双向引用（two-way referencing）和 反规范化（denormalization）。

## Intermediate: Two-Way Referencing

如果您希望获得一些更好的引用，那么可以结合两种技术，并在 Schema 中包含两种引用样式，既有从“one”端到“many”端的引用，也有从“many”端到“one”端的引用。

例如，让我们回到任务跟踪系统。 有一个 “people” 的 collection 用于保存 Person documents，一个 “tasks” collection 用于保存 Task documents，以及来自 Person -> Task 的 `One-to-N` 关系。 应用程序需要跟踪 Person 拥有的所有任务，因此我们需要引用 Person -> Task。

使用对 Task documents 的引用数组，单个 Person document 可能看起来像这样:

```sh
db.person.findOne()
{
    _id: ObjectID("AAF1"),
    name: "Kate Monster",
    tasks [     // array of references to Task documents
        ObjectID("ADF9"), 
        ObjectID("AE02"),
        ObjectID("AE73") 
        // etc
    ]
}
```
另一方面，在其他一些上下文中，这个应用程序将显示一个 Tasks 列表（例如，一个多人项目中的所有 Tasks） ，它将需要快速查找哪个人负责哪个任务。 您可以通过在 Task document 中添加对 Person 的附加引用来优化此操作。

```sh
db.tasks.findOne()
{
    _id: ObjectID("ADF9"), 
    description: "Write lesson plan",
    due_date:  ISODate("2014-04-01"),
    owner: ObjectID("AAF1")     // Reference to Person document
}
```

这种设计具有 `One-to-Many` 模式的所有优点和缺点，但添加了一些内容。 在 Task document 中添加额外的 owner 引用意味着可以快速简单地找到任务的所有者，但是这也意味着如果你需要将任务重新分配给其他人，你需要执行两个更新而不是一个。

具体来说，您必须同时更新从 Person 到 Task 文档的引用，以及从 Task 到 Person 的引用。 (对于正在阅读这篇文章的关系专家来说，您是对的: 使用这种模式设计意味着不再可能通过单个 原子更新（atomic update）将一个任务重新分配给一个新的 Person。 这对于我们的任务跟踪系统来说是可行的: 您需要考虑这是否适用于您的特定场景。)

## Intermediate: Denormalizing With “One-To-Many” Relationships

除了对关系的各种类型进行建模之外，您还可以在模式中添加 反规范化（denormalization）。 这可以消除在某些情况下执行 应用程序级联接（application-level join）的需要，但代价是在执行更新时会增加一些复杂性。 举个例子就可以说明这一点。

### Denormalizing from Many -> One

对于产品-零件示例，您可以将零件的名称非规范化为“parts[]”数组。 作为比较，下面是未采用 反规范化（denormalization）的 Product document 版本。

```sh
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [     // array of references to Part documents
        ObjectID('AAAA'),    // reference to the #4 grommet above
        ObjectID('F17C'),    // reference to a different Part
        ObjectID('D2AA'),
        // etc
    ]
}
```

而 反规范化（Denormalizing）意味着在显示 Product 的所有 Part 名称时不必执行应用程序级联接（application-level join），但是如果需要关于某个部件的任何其他信息，则必须执行该联接。

```sh
> db.products.findOne()
{
    name : 'left-handed smoke shifter',
    manufacturer : 'Acme Corp',
    catalog_number: 1234,
    parts : [
        { id : ObjectID('AAAA'), name : '#4 grommet' },         // Part name is denormalized
        { id: ObjectID('F17C'), name : 'fan blade assembly' },
        { id: ObjectID('D2AA'), name : 'power switch' },
        // etc
    ]
}
```

虽然这样可以更容易地获得零件名称，但只需要在 应用程序级别的联接（application-level join）中增加一点 客户端（client-side）工作:

```sh
// Fetch the product document
> product = db.products.findOne({catalog_number: 1234});  
  // Create an array of ObjectID()s containing *just* the part numbers
> part_ids = product.parts.map( function(doc) { return doc.id } );
  // Fetch all the Parts that are linked to this Product
> product_parts = db.parts.find({_id: { $in : part_ids } } ).toArray() ;
```

只有当读取和更新的比例很高时，反规范化（Denormalizing）才有意义。 **如果你经常阅读非标准化（denormalized）的数据，但是很少更新，那么为了得到更有效的查询，付出更慢的更新和更复杂的更新的代价是有意义的。 随着相对于查询的更新变得越来越频繁，非规范化节省的开销会越来越少**。

例如: 假设零件名称不经常更改，但手头的数量经常更改。 这意味着，尽管在 Product document 中对零件名称进行 非规范化（Denormalizing）是有意义的，但是对数量进行 反规范化（Denormalizing） 是没有意义的。

还要注意，如果对 字段（field）进行 反规范化（Denormalizing），将失去对该 字段（field）执行原子（atomic）更新和 独立（isolated）更新的能力。 就像上面的 双向引用（two-way referencing）示例一样，如果你先在 Part document 中更新零件名称，然后在 Product 文档中更新零件名称，那么将会有一个 sub-second 的间隔，在这个间隔中，Product document 中 反规范化（Denormalizing）的 “name”将不会是 Part document 中新的更新值。

## Denormalizing from One -> Many

你还可以将字段从 “One” 到 “Many” 进行 反规范化（denormalize）:

```sh
> db.parts.findOne()
{
    _id : ObjectID('AAAA'),
    partno : '123-aff-456',
    name : '#4 grommet',
    product_name : 'left-handed smoke shifter',   // Denormalized from the ‘Product’ document
    product_catalog_number: 1234,                     // Ditto
    qty: 94,
    cost: 0.94,
    price: 3.99
}
```

但是，如果您已经将 Product 名称 反规范化（denormalize）到 Part document 中，那么在更新 Product 名称时，您还必须更新 ‘ parts' collection 中出现的所有位置。 这可能是一个更昂贵的更新，因为您正在更新多个零件，而不是单个产品。 因此，在这种方式去规范化时，考虑 **读写比（ read-to-write ratio ）** 显得更为重要。

## Intermediate: Denormalizing With “One-To-Squillions” Relationships

你还可以对“one-to-squillions”示例进行 反规范化（denormalize）。 这可以通过两种方式之一来实现: 您可以将关于 “one” side 的信息('hosts’ document)放入“squillions” side(log entries) ，或者将来自 “squillions” side 的摘要信息放入 “one” side。

下面是一个将 反规范化（denormalize）转化为“squillions”的例子。 我将把主机的 IP 地址(from the ‘one’ side)添加到单独的日志消息中:

```sh
> db.logmsg.findOne()
{
    time : ISODate("2014-03-28T09:42:41.382Z"),
    message : 'cpu is on fire!',
    ipaddr : '127.66.66.66',
    host: ObjectID('AAAB')
}
```

你现在查询来自某个特定 IP 地址的最新消息变得更容易了: 现在只有一个查询，而不是两个。

```sh
> last_5k_msg = db.logmsg.find({ipaddr : '127.66.66.66'}).sort({time : -1}).limit(5000).toArray()
```

事实上，如果你只想在 “one” side 存储有限数量的信息，你可以把它们全部 反规范化（denormalize）为 “squillions” side ，从而完全摆脱 “one” collection：

```sh
> db.logmsg.findOne()
{
    time : ISODate("2014-03-28T09:42:41.382Z"),
    message : 'cpu is on fire!',
    ipaddr : '127.66.66.66',
    hostname : 'goofy.example.com',
}
```

另一方面，你也可以 反规范化（denormalize）到 “one” side。 让我们假设你希望在 'hosts’ document 中保留来自主机的最后 1000 条消息。 你可以使用 MongoDB 2.4中引入的 `$each / $slice` 功能来保持列表排序，并且只保留最后的1000条消息：

日志消息保存在 'logmsg’ collection 中以及 'hosts’ document 中的反规范化列表中: 这样，当消息超出 ‘hosts.logmsgs' 数组时，它就不会丢失。

```sh
 //  Get log message from monitoring system
logmsg = get_log_msg();
log_message_here = logmsg.msg;
log_ip = logmsg.ipaddr;
  // Get current timestamp
now = new Date()
  // Find the _id for the host I’m updating
host_doc = db.hosts.findOne({ipaddr : log_ip },{_id:1});  // Don’t return the whole document
host_id = host_doc._id;
  // Insert the log message, the parent reference, and the denormalized data into the ‘many’ side
db.logmsg.save({time : now, message : log_message_here, ipaddr : log_ip, host : host_id ) });
  // Push the denormalized log message onto the ‘one’ side
db.hosts.update( {_id: host_id }, 
        {$push : {logmsgs : { $each:  [ { time : now, message : log_message_here } ],
                           $sort:  { time : 1 },  // Only keep the latest ones 
                           $slice: -1000 }        // Only keep the latest 1000
         }} );
```

请注意，使用 projection specification `({ _id: 1})` 可以防止 MongoDB 通过网络发布整个 ‘hosts’ document。 通过告诉 MongoDB 只返回 _id 字段，我将网络开销减少到仅存储该字段所需的几个字节（再加上一点 wire protocol开销）。

正如在 “One-to-Many” 的情况下的反规范化一样，你需要考虑读取与更新的比率。 只有当日志消息的频率与应用程序查看单个主机的所有消息的次数相关时，将日志消息反规范化到 Host 文档才有意义。 如果您希望查看数据的频率低于更新数据的频率，那么这种特殊的反规范化是一个坏主意。

## 回顾

在这篇文章中，我已经介绍了嵌入（embed）、子引用（child-reference）和父引用（ parent-reference）的基础知识之外的其他选择。

* 如果使用双向引用优化了 Schema，并且愿意为不进行 原子更新（atomic updates）付出代价，那么可以使用双向引用
* 如果正在引用，可以将数据从 “One” side 到 “N” side，或者从 “N” side 到 “One” side 进行反规范化（denormalize）

在决定是否否否定标准时，应考虑以下因素：

* 无法对反规范化的数据执行原子更新（atomic update）
* 只有当读写比例很高时，反规范化才有意义

下一次，我会给你一些指导方针，让你在所有这些选项中做出选择。

# Part 3: 6 Rules of Thumb for MongoDB Schema Design

这是我们在 MongoDB 中建模 `One-to-N` 关系的最后一站。 在第一篇文章中，我介绍了建立 `One-to-N`  关系模型的三种基本方法。 上篇文章中，我介绍了这些基础知识的一些扩展: 双向引用（two-way referencing）和反规范化（denormalization）。

反规范化（denormalization）允许你避免某些 应用程序级别的连接（ application-level joins），但代价是要进行更复杂和昂贵的更新。 如果这些字段的读取频率远高于更新频率，则对一个或多个字段进行反规范化（denormalization）是有意义的。

那么，我们来回顾一下:

* 你可以嵌入（embed）、引用（reference）“one” side，或 “N” side，或混合使用这些技术
* 你可以将任意多的字段反规范化（denormalize）到 “one” side 或  “N” side

特别是反规范化，给了你很多选择: 如果一段关系中有 8 个反规范化（denormalization）的候选字段，那么有 2 的 8 次方（1024）种不同的方法去反规范化（包括根本不去进行反规范化）。 再乘以三种不同的引用方式，你就有了 3000 多种不同的方式来建立关系模型。

你猜怎么着？ 你现在陷入了 “选择悖论” —— 因为你有很多潜在的方法来建立 “one-to-N” 的关系模型，你选择如何建立模型只是变得更难了。。。

## Rules of Thumb: Your Guide Through the Rainbow

这里有一些“经验法则”来指导你进行选择：

* One：**首选嵌入（embedding）**，除非有足够的的理由不这样做
* Two：需要**独立访问对象**是不嵌入对象的一个令人信服的理由
* Three：数组不应该无限制地增长。 如果在 “many” side 有几百个以上的 documents，不要嵌入它们; 如果在 “many” side 有几千个以上的文档，不要使用一个 `ObjectID` 引用数组。 **高基数数组是不嵌入的一个令人信服的理由**
* Four：不要害怕 应用程序级别的连接（application-level joins）： 如果正确地使用索引并使用 projection specifier(如第2部分所示) ，那么 应用程序级别的连接（application-level joins）几乎不会比关系数据库 的服务器端连接（server-side joins ）更昂贵
* Five：考虑反规范化时的 读/写比率。 一个大多数时候会被读取但很少更新的字段是反规范化的好候选者: 如果你对一个频繁更新的字段进行反规范化，那么查找和更新所有实例的额外工作很可能会超过你从非规范化中节省的开销
* Six：**如何对数据建模完全取决于特定应用程序的数据访问模式**。 您希望根据应用程序查询和更新数据的方式对数据进行结构化

## Your Guide To The Rainbow

在 MongoDB 中建模 “One-to-N” 关系时，你有各种各样的选择，因此必须仔细考虑数据的结构。 你需要考虑的主要标准是:

* 这种关系的基数是什么: 是 “one-to-few”, “one-to-many” 还是 “one-to-squillions”？
* 你需要单独访问 “N” side 的对象，还是仅在父对象的上下文中访问？
* 特定字段的更新与读取的比率是多少？

你的数据结构的主要选择是：

* 对于 “one-to-few”，可以使用嵌入文档的数组
* 对于 “one-to-many” ，或者在 “N” side 必须单独存在的情况下，应该使用一个引用数组。 如果优化了数据访问模式，还可以在 “N” side 使用 父引用（parent-reference）
*  对于 "one-to-squillions"，你应该在存储 “N” side 的文档中使用 父引用（parent-reference）

一旦你确定了数据的总体结构，那么你可以通过将数据从  “One” side 反规范化到  “N” side，或者从  “N” side 反规范化到  “One” side 来反规范化跨多个文档的数据。 只有那些经常被阅读、被阅读的频率远高于被更新的频率的字段，以及那些不需要 强一致性（strong consistency）的字段，才需要这样做，因为更新非标准化的值更慢、更昂贵，而且不是原子的。

## Productivity and Flexibility

因此，MongoDB 使你能设计满足应用程序的需求的数据库 Schema。 你可以在 MongoDB 中构造你的数据，让它就可以很容易地适应更改，并支持你需要的查询和更新，以便最大限度地方便你的开发应用程序。

## 更多资料

* [Schema Design Consulting Services](https://www.mongodb.com/products/consulting#schema_design)
* [Thinking in Documents (recorded webinar)](http://www.mongodb.com/presentations/webinar-back-basics-1-thinking-documents)
* [Schema Design for Time-Series Data (recorded webinar) ](http://www.mongodb.com/presentations/webinar-time-series-data-mongodb)
* [Socialite, the Open Source Status Feed - Storing a Social Graph (recorded webinar)](http://www.mongodb.com/presentations/socialite-open-source-status-feed-part-2-managing-social-graph)
