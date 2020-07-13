title: 从 SQL 到 MongoDB 之概念篇
subtitle: 对于 SQL 转战 NoSQL的开发人员来说，最难的一步其实是将原有的 SQL 的概念和知识直接复用过来，最大化的减小学习的成本。
cover: https://img20.360buyimg.com/ling/jfs/t1/128762/35/4417/580392/5eddfb83Ed5f610d9/9bcaa04f6748380d.png
categories: 全栈开发
tags:
  - MongoDB
author:
  nick: Pines
  github_name: Pines-Cheng
  date: 2020-06-08 15:46:08
---

> 翻译原文：MongoDB 官方文档：[SQL to MongoDB Mapping Chart](https://docs.mongodb.com/manual/reference/sql-comparison/)

## 前言

很多开发者首次接触数据库（通常是在高校课堂）的概念，或者说接触第一个数据库，通常是 SQL 数据库，而现在，NoSQL 数据库越来越流行，很多原 SQL 数据的使用者难免有转向 NoSQL 的需求。而作为 NoSQL  数据库的代表，MongoDB 在社区越来越流行，生产环境的使用也日益广泛。

对于 SQL 转战 NoSQL的开发人员来说，最难的一步其实是将原有的 SQL 的概念和知识直接复用过来，最大化的减小学习的成本。

其实，这一步 MongoDB 官方已经为大家考虑到了，那就是在：`MongoDB CRUD Operations` > `MongoDB CRUD Operations` > [SQL to MongoDB Mapping Chart](https://docs.mongodb.com/manual/reference/sql-comparison/)，这篇文档非常好的总结了 SQL 对应 MongoDB 的术语和概念，还有可执行文件、SQL 语句/MongoDB 语句等，

可以说对于 SQL 数据库开发人员，如果理解了他们之间的对应关系，那么就一只脚就迈进了 MongoDB 的大门。

### Terminology and Concepts

下表介绍了各种 SQL 术语和概念以及相应的 MongoDB 术语和概念.

| SQL术语/概念                                                               | MongoDB 术语/概念                                                                                                                                                                                                                                    |
|----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| database                                                                   | [database](https://docs.mongodb.com/manual/reference/glossary/#term-database)                                                                                                                                                                        |
| table                                                                      | [collection](https://docs.mongodb.com/manual/reference/glossary/#term-collection)                                                                                                                                                                    |
| row                                                                        | [document](https://docs.mongodb.com/manual/reference/glossary/#term-document) 或 [BSON](https://docs.mongodb.com/manual/reference/glossary/#term-bson) document                                                                                      |
| column                                                                     | [field](https://docs.mongodb.com/manual/reference/glossary/#term-field)                                                                                                                                                                              |
| index                                                                      | [index](https://docs.mongodb.com/manual/reference/glossary/#term-index)                                                                                                                                                                              |
| table joins （表联接）                                                               | [$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup), `embedded documents （嵌入式文档）`                                                                                                                                |
| primary key  指定任何唯一的列或者列组合作为主键 | [primary key](https://docs.mongodb.com/manual/reference/glossary/#term-primary-key) 在 MongoDB 中, 主键自动设置为 [_id](https://docs.mongodb.com/manual/reference/glossary/#term-id) 字段                               |
| aggregation (如：group by)                                                | `aggregation pipeline （聚合管道）`参考：[SQL to Aggregation Mapping Chart](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)                                                                                                                |
| SELECT INTO NEW_TABLE                                                      | [$out](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out) 参考： [SQL to Aggregation Mapping Chart](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)                                            |
| MERGE INTO TABLE                                                           | [$merge](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) （从MongoDB 4.2开始可用）  参考：[SQL to Aggregation Mapping Chart](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/) |
| transactions                                                               | [transactions](https://docs.mongodb.com/manual/core/transactions/)                                                                                                                                                                              |


> TIP
> 
> 在许多情况下， `非规范化数据模型（嵌入式文档和数组） denormalized data model (embedded documents and arrays)` 将继续是您数据和用例的最佳选择，而不是多文档事务. 也就是说，对于许多场景，对数据进行适当的建模将最大限度地减少对 `多文档事务（multi-document transactions）`的需求。

## Executables

下表显示了一些数据库可执行文件和相应的 MongoDB 可执行文件。 这张表并不是详尽无遗的。

|                 |    MongoDB    | MySQL  | Oracle  | Informix  | DB2        |
|-----------------|--------|--------|---------|-----------|------------|
| Database Server | mongod | mysqld | oracle  | IDS       | DB2 Server |
| Database Client | mongo  | mysql  | sqlplus | DB-Access | DB2 Client |


## Examples

下表显示了各种 SQL 语句和相应的 MongoDB 语句。 表中的例子假定以下条件:

* Sql 示例假设一个名为 people 的表。
* MongoDB 的示例假定一个名为 people 的集合包含以下原型的文档：

```json
{
  _id: ObjectId("509a8fb2f3f4948bd2f983a0"),
  user_id: "abc123",
  age: 55,
  status: 'A'
}
```
### Create and Alter

#### CREATE TABLE

* SQL 模式语句：

```sql
CREATE TABLE people (
    id MEDIUMINT NOT NULL
        AUTO_INCREMENT,
    user_id Varchar(30),
    age Number,
    status char(1),
    PRIMARY KEY (id)
)
```

* MongoDB 模式语句：

```js
db.people.insertOne( {
    user_id: "abc123",
    age: 55,
    status: "A"
 } )
```

在第一个 [insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne) 或 [insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany) 操作上隐式创建。 如果没有指定 `_id` 字段，则自动添加主键 `_id`。

但是，您也可以显式地创建一个集合：

```js
db.createCollection("people")
```

#### ALTER TABLE / ADD

* SQL模式语句：

```sql
ALTER TABLE people
ADD join_date DATETIME
```

* MongoDB 模式语句：

```js
db.people.updateMany(
    { },
    { $set: { join_date: new Date() } }
)
```


集合不描述或强制执行其文档的结构；也就是说，在集合级别上没有结构上的改变。

但是，在文档级别，[updateMany()](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany) 操作可以使用 [$set](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set) 操作符向现有文档添加字段。

#### ALTER TABLE / DROP COLUMN

* SQL模式语句：

```sql
ALTER TABLE people
DROP COLUMN join_date
```

* MongoDB 模式语句：

```js
db.people.updateMany(
    { },
    { $unset: { "join_date": "" } }
)
```

集合不描述或强制执行其文档的结构；也就是说，在集合级别上没有结构上的改变。

但是，在文档级别，[updateMany()](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)  操作可以使用 [$unset](https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset) 操作符从文档中删除字段。

#### CREATE INDEX

* SQL 模式语句：

```sql
CREATE INDEX idx_user_id_asc
ON people(user_id)
```

* MongoDB 模式语句：

```js
db.people.createIndex( { user_id: 1 } )
```

#### CREATE INDEX / Multi

* SQL模式语句：

```sql
CREATE INDEX
       idx_user_id_asc_age_desc
ON people(user_id, age DESC)
```

* MongoDB 模式语句：

```js
db.people.createIndex( { user_id: 1, age: -1 } )
```

#### DROP TABLE

* SQL模式语句：

```sql
DROP TABLE people
```

* MongoDB 模式语句：

```js
db.people.drop()
```

更多有关使用的方法和操作符的详细信息，请参阅:

* [db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)
* [db.collection.insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)
* [db.createCollection()](https://docs.mongodb.com/manual/reference/method/db.createCollection/#db.createCollection)
* [db.collection.updateMany()](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)
* [db.collection.createIndex()](https://docs.mongodb.com/manual/reference/method/db.collection.createIndex/#db.collection.createIndex)
* [db.collection.drop()](https://docs.mongodb.com/manual/reference/method/db.collection.drop/#db.collection.drop)
* [$set](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set)
* [$unset](https://docs.mongodb.com/manual/reference/operator/update/unset/#up._S_unset)

另见：

* [Databases and Collections](https://docs.mongodb.com/manual/core/databases-and-collections/)
* [Documents](https://docs.mongodb.com/manual/core/document/)
* [Indexes](https://docs.mongodb.com/manual/indexes/)
* [Data Modeling Concepts](https://docs.mongodb.com/manual/core/data-models/)

### Insert

下表显示了与向表中插入记录相关的各种 SQL 语句以及相应的 MongoDB 语句。


* SQL INSERT 语句                                                               

```sql
INSERT INTO people(user_id,
                  age,
                  status)
VALUES ("bcd001",
        45,
        "A")
```

* Mongodb insertOne() 语句 

```js
db.people.insertOne(
   { user_id: "bcd001", age: 45, status: "A" }
)
```

有关更多信息，请参见 [db.collection.insertOne()](https://docs.mongodb.com/manual/reference/method/db.collection.insertOne/#db.collection.insertOne)。

另见：

* [Insert Documents](https://docs.mongodb.com/manual/tutorial/insert-documents/)
* [db.collection.insertMany()](https://docs.mongodb.com/manual/reference/method/db.collection.insertMany/#db.collection.insertMany)
* [Databases and Collections](https://docs.mongodb.com/manual/core/databases-and-collections/)
* [Documents](https://docs.mongodb.com/manual/core/document/)

### Select

下表显示了与从表中读取记录相关的各种 SQL 语句以及相应的 MongoDB 语句。

> NOTE：
> 
> [find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find) 方法总是包含返回文档中的 `_id` 字段，除非通过 [projection](https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/#projection) 特别排除。 下面的一些 SQL 查询可能包含一个 `_id` 字段来反映这一点，即使该字段没有包含在相应的  [find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)  查询中。

#### SELECT ... WHERE

* SQL 语句

```sql

SELECT user_id, status
FROM people
WHERE status = "A"
```

* Mongodb 语句 

```js
db.people.find(
    { status: "A" },
    { user_id: 1, status: 1, _id: 0 }
)
```
#### SELECT ... AND

* SQL 语句

```sql
SELECT *
FROM people
WHERE age > 25
AND   age <= 50
```

* Mongodb 语句 

```js
db.people.find(
   { age: { $gt: 25, $lte: 50 } }
)
```

#### SELECT ... OR

* SQL 语句

```sql
SELECT *
FROM people
WHERE status = "A"
OR age = 50
```

* Mongodb 语句 

```js
db.people.find(
    { $or: [ { status: "A" } , { age: 50 } ] }
)
```

#### SELECT ... LIKE

* SQL 语句

```sql
FROM people
WHERE user_id like "%bc%"
```

* Mongodb 语句 

```js
db.people.find( { user_id: /bc/ } )

-or-

db.people.find( { user_id: { $regex: /bc/ } } )
```

#### SELECT ... OEDER BY

* SQL 语句

```sql
SELECT *
FROM people
WHERE status = "A"
ORDER BY user_id ASC
```

* Mongodb 语句 

```js
db.people.find( { status: "A" } ).sort( { user_id: 1 } )
```

#### SELECT ... COUNT

* SQL 语句

```sql
SELECT COUNT(user_id)
FROM people
```

* Mongodb 语句 

```js
db.people.count( { user_id: { $exists: true } } )

or

db.people.find( { user_id: { $exists: true } } ).count()
```

#### SELECT DISTINCT

* SQL 语句

```sql
SELECT DISTINCT(status)
FROM people
```

* Mongodb 语句 

```js

db.people.aggregate( [ { $group : { _id : "$status" } } ] )

或者，对于不同的不超过 [BSON 大小限制](https://docs.mongodb.com/manual/reference/limits/#limit-bson-document-size) 的值集

db.people.distinct( "status" )
```

#### SELECT ... LIMIT SKIP


* SQL 语句

```sql
SELECT *
FROM people
LIMIT 5
SKIP 10
```

* Mongodb 语句 

```js
db.people.find().limit(5).skip(10)
```

#### EXPLAIN SELECT

* SQL 语句

```sql
EXPLAIN SELECT *
FROM people
WHERE status = "A"
```

* Mongodb 语句 

```js
db.people.find( { status: "A" } ).explain()
```

有关所使用的方法的详细信息，请参阅：

* [db.collection.find()](https://docs.mongodb.com/manual/reference/method/db.collection.find/#db.collection.find)
* [db.collection.distinct()](https://docs.mongodb.com/manual/reference/method/db.collection.distinct/#db.collection.distinct)
* [db.collection.findOne()](https://docs.mongodb.com/manual/reference/method/db.collection.findOne/#db.collection.findOne)
* [limit()](https://docs.mongodb.com/manual/reference/method/cursor.limit/#cursor.limit)
* [skip()](https://docs.mongodb.com/manual/reference/method/cursor.skip/#cursor.skip)
* [explain()](https://docs.mongodb.com/manual/reference/method/cursor.explain/#cursor.explain)
* [sort()](https://docs.mongodb.com/manual/reference/method/cursor.sort/#cursor.sort)
* [count()](https://docs.mongodb.com/manual/reference/method/cursor.count/#cursor.count)

运算符（operators）：

* [$ne](https://docs.mongodb.com/manual/reference/operator/query/ne/#op._S_ne)
* [$and](https://docs.mongodb.com/manual/reference/operator/query/and/#op._S_and)
* [$or](https://docs.mongodb.com/manual/reference/operator/query/or/#op._S_or)
* [$gt](https://docs.mongodb.com/manual/reference/operator/query/gt/#op._S_gt)
* [$lt](https://docs.mongodb.com/manual/reference/operator/query/lt/#op._S_lt)
* [$exists](https://docs.mongodb.com/manual/reference/operator/query/exists/#op._S_exists)
* [$lte](https://docs.mongodb.com/manual/reference/operator/query/lte/#op._S_lte)
* [$regex](https://docs.mongodb.com/manual/reference/operator/query/regex/#op._S_regex)

另见：

* [Query Documents](https://docs.mongodb.com/manual/tutorial/query-documents/)
* [Query and Projection Operators](https://docs.mongodb.com/manual/reference/operator/query/)
* [mongo Shell Methods](https://docs.mongodb.com/manual/reference/method/)

### Update Records

下面显示了与更新表中现有记录相关的各种 SQL 语句以及相应的 MongoDB 语句。

#### UPDATE ... SET

* SQL 语句

```sql
UPDATE people
SET status = "C"
WHERE age > 25
```

* Mongodb 语句 

```js
db.people.updateMany(
   { age: { $gt: 25 } },
   { $set: { status: "C" } }
)
```

#### UPDATE ... INC

* SQL 语句

```sql
UPDATE people
SET age = age + 3
WHERE status = "A"
```

* Mongodb 语句 

```js
db.people.updateMany(
   { status: "A" } ,
   { $inc: { age: 3 } }
)
```

有关示例中使用的方法和运算符的详细信息，请参阅：

* [db.collection.updateMany()](https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#db.collection.updateMany)
* [$gt](https://docs.mongodb.com/manual/reference/operator/query/gt/#op._S_gt)
* [$set](https://docs.mongodb.com/manual/reference/operator/update/set/#up._S_set)
* [$inc](https://docs.mongodb.com/manual/reference/operator/update/inc/#up._S_inc)

另见：

* [Update Documents](https://docs.mongodb.com/manual/tutorial/update-documents/) 
* [Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)
* [db.collection.updateOne()](https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#db.collection.updateOne)
* [db.collection.replaceOne()](https://docs.mongodb.com/manual/reference/method/db.collection.replaceOne/#db.collection.replaceOne)

### Delete Records

下面显示了与从表中删除记录相关的各种 SQL 语句以及相应的 MongoDB 语句。

#### DELETE WHERE 

* SQL 语句

```sql
DELETE FROM people
WHERE status = "D"
```

* Mongodb 语句 

```js
db.people.deleteMany( { status: "D" } )
```

#### DELETE

* SQL 语句

```sql
DELETE FROM people
```

* Mongodb 语句 

```js
db.people.deleteMany({})
```

有关更多信息，请参见 [db.collection.deleteMany()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteMany/#db.collection.deleteMany)。

* [Delete Documents](https://docs.mongodb.com/manual/tutorial/remove-documents/)
* [db.collection.deleteOne()](https://docs.mongodb.com/manual/reference/method/db.collection.deleteOne/#db.collection.deleteOne)

看到这里，想必大家应该已经将脑海中 SQL 相关的知识和 MongoDB 一一对应起来了，那么剩下的就需要大家多多的实践，深入挖掘。

但是无论何时，都要记住，[MongoDB 官方文档](https://docs.mongodb.com/manual/) 绝对是你能找到的最权威、最全面的资料。











