title: 从 SQL 到 MongoDB 之聚合篇
subtitle: 聚合管道（aggregation pipeline ）让 MongoDB 提供与 SQL 中的许多常见数据聚合操作相对应的，原生的聚合功能。
cover: https://img20.360buyimg.com/ling/jfs/t1/118385/24/9729/579901/5eddfbbcE44e1172b/c20bd5ecb954d873.png
categories: 全栈开发
tags:
  - MongoDB
author:
  nick: Pines
  github_name: Pines-Cheng
  date: 2020-06-08 16:46:08
---

# SQL to Aggregation Mapping Chart

> 翻译原文：MongoDB 官方文档： [SQL to Aggregation Mapping Chart](https://docs.mongodb.com/manual/reference/sql-aggregation-comparison/)
>
> 在上一篇翻译 [从 SQL 到 MongoDB 之概念篇](https://aotu.io/notes/2020/06/07/sql-to-mongo-1/)，我们详细讲解了 SQL 和 MongoDB 的一些概念的对应关系，方便大家入门和理解，这一篇属于进阶篇，主要讲解了 SQL 和 MongoDB 和 数据聚合 的对应关系。

聚合管道 （[aggregation pipeline ](https://docs.mongodb.com/manual/core/aggregation-pipeline/)） 让 MongoDB 提供与 SQL 中的许多常见数据聚合操作相对应的，原生的聚合功能。

下表概述了常见的 SQL 聚合术语、函数和概念以及相应的 MongoDB 聚合操作符（[aggregation operators](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/#aggregation-pipeline-operator-reference)）：

| SQL 术语、函数和概念 | MongoDB 聚合操作符                                                                                                                                                                          |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| WHERE                              | [$match](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                          |
| GROUP BY                           | [$group](https://docs.mongodb.com/manual/reference/operator/aggregation/group/#pipe._S_group)                                                                                                          |
| HAVING                             | [$match](https://docs.mongodb.com/manual/reference/operator/aggregation/match/#pipe._S_match)                                                                                                          |
| SELECT                             | [$project](https://docs.mongodb.com/manual/reference/operator/aggregation/project/#pipe._S_project)                                                                                                    |
| ORDER BY                           | [$sort](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/#pipe._S_sort)                                                                                                             |
| LIMIT                              | [$limit](https://docs.mongodb.com/manual/reference/operator/aggregation/limit/#pipe._S_limit)                                                                                                          |
| SUM()                              | [$sum](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum)                                                                                                                 |
| COUNT()                            | [$sum](https://docs.mongodb.com/manual/reference/operator/aggregation/sum/#grp._S_sum) [$sortByCount](https://docs.mongodb.com/manual/reference/operator/aggregation/sortByCount/#pipe._S_sortByCount) |
| join                               | [$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/#pipe._S_lookup)                                                                                                       |
| SELECT INTO NEW_TABLE              | [$out](https://docs.mongodb.com/manual/reference/operator/aggregation/out/#pipe._S_out)                                                                                                                |
| MERGE INTO TABLE                   | [$merge](https://docs.mongodb.com/manual/reference/operator/aggregation/merge/#pipe._S_merge) MongoDB 4.2 可用                                                                                         |

有关所有聚合管道和表达式操作符的列表，请参见：[Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)。

另见：[SQL to MongoDB Mapping Chart](https://docs.mongodb.com/manual/reference/sql-comparison/)

## Examples

下面提供了 SQL 聚合语句和相应的 MongoDB 语句，表中的例子假定以下条件：

* SQL 示例假定有两个表：`orders` 和 `order_lineitem`，然后通过 `order_lineitem.order_id` 和 `orders.id` 进行 `join` 操作。
* MongoDB 示例假设其中一个集合（collection） `orders ` 包含以下原型的文档（documents）：

```json
{
  cust_id: "abc123",
  ord_date: ISODate("2012-11-02T17:04:11.102Z"),
  status: 'A',
  price: 50,
  items: [ { sku: "xxx", qty: 25, price: 1 },
           { sku: "yyy", qty: 25, price: 1 } ]
}
```

### COUNT vs count

计算所有 `orders` 记录数量：

* SQL 示例

```sql
SELECT COUNT(*) AS count
FROM orders
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: null,
        count: { $sum: 1 }
     }
   }
] )

```

### SUM vs `$sum`

计算 `orders` 中 `price` 的总和：

* SQL 示例

```sql
SELECT SUM(price) AS total
FROM orders
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: null,
        total: { $sum: "$price" }
     }
   }
] )
```

### GROUP BY vs `$group`

对于每一个独特的 `cust_id`，计算 `price` 字段总和：

* SQL 示例

```sql
SELECT cust_id,
       SUM(price) AS total
FROM orders
GROUP BY cust_id
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: "$cust_id",
        total: { $sum: "$price" }
     }
   }
] )
```

### ORDER BY vs `$sort`

对于每一个独特的 `cust_id`，计算 `price` 字段总和，且结果按总和排序：

* SQL 示例

```sql
SELECT cust_id,
       SUM(price) AS total
FROM orders
GROUP BY cust_id
ORDER BY total
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: "$cust_id",
        total: { $sum: "$price" }
     }
   },
   { $sort: { total: 1 } }
] )
```

### GROUP BY Multi

对于每一个独特的 `cust_id`，按照 `ord_date` 进行分组，且不包含日期的时间部分，计算 `price` 字段总和。

* SQL 示例

```sql
SELECT cust_id,
       ord_date,
       SUM(price) AS total
FROM orders
GROUP BY cust_id,
         ord_date
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: {
           cust_id: "$cust_id",
           ord_date: { $dateToString: {
              format: "%Y-%m-%d",
              date: "$ord_date"
           }}
        },
        total: { $sum: "$price" }
     }
   }
] )
```

### HAVING vs `$match`

对于 `cust_id` 如果有多个记录，就返回 `cust_id` 以及相应的记录数量：

* SQL 示例

```sql

SELECT cust_id,
       count(*)
FROM orders
GROUP BY cust_id
HAVING count(*) > 1
```

* MongoDB 示例

```js
db.orders.aggregate( [
   {
     $group: {
        _id: "$cust_id",
        count: { $sum: 1 }
     }
   },
   { $match: { count: { $gt: 1 } } }
] )
```

### WHERE vs `$match`

对于每一个独特的 `cust_id`，且 `status = ‘A’`，计算 `price` 字段总和，只有在总和大于 250 的情况下，才可以返回。

* SQL 示例

```sql
SELECT cust_id,
       SUM(price) as total
FROM orders
WHERE status = 'A'
GROUP BY cust_id
HAVING total > 250
```

* MongoDB 示例

```js
db.orders.aggregate( [
   { $match: { status: 'A' } },
   {
     $group: {
        _id: "$cust_id",
        total: { $sum: "$price" }
     }
   },
   { $match: { total: { $gt: 250 } } }
] )
```

### `$unwind`

对于每一个独特的 `cust_id`，对相应的行的 item 项求和得到 `qty`：

* SQL 示例

```sql
SELECT cust_id,
       SUM(li.qty) as qty
FROM orders o,
     order_lineitem li
WHERE li.order_id = o.id
GROUP BY cust_id
```

* MongoDB 示例

```js
db.orders.aggregate( [
   { $unwind: "$items" },
   {
     $group: {
        _id: "$cust_id",
        qty: { $sum: "$items.qty" }
     }
   }
] )
```

### Multi aggregate

将 `cust_id`, `ord_date` 分组并计算数量 ，不包括日期的时间部分。

```sql
SELECT COUNT(*)
FROM (SELECT cust_id,
             ord_date
      FROM orders
      GROUP BY cust_id,
               ord_date)
      as DerivedTable
```

```js
db.orders.aggregate( [
   {
     $group: {
        _id: {
           cust_id: "$cust_id",
           ord_date: { $dateToString: {
              format: "%Y-%m-%d",
              date: "$ord_date"
           }}
        }
     }
   },
   {
     $group: {
        _id: null,
        count: { $sum: 1 }
     }
   }
] )
```



另见

* [SQL to MongoDB Mapping Chart](https://docs.mongodb.com/manual/reference/sql-comparison/)
* [Aggregation Pipeline Quick Reference](https://docs.mongodb.com/manual/meta/aggregation-quick-reference/)
* [db.collection.aggregate()](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/#db.collection.aggregate)
