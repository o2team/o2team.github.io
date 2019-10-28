title: Mongoose-modified-at 时间自动记录插件介绍
subtitle: Mongoose-modified-at 是一款自动更新字段变化时间并记录到数据库中的 Mongoose 插件，类似 Mongoose 自带的 timestamps 功能。
cover: https://img11.360buyimg.com/ling/jfs/t1/77538/15/14033/186706/5db64630E82ef9404/6d57267c9b77b63c.jpg
categories: NodeJS
date: 2019-10-28 10:00:00
tags:
  - nodejs
  - mongoose
  - mongodb
author:
  nick: Barrior
  github_name: Barrior
wechat:
    share_cover: https://img10.360buyimg.com/ling/jfs/t1/90167/19/889/71960/5db64760Ed167e1de/1137506f56d3b38e.jpg
    share_title: Mongoose-modified-at 时间自动记录插件介绍
    share_desc: Mongoose-modified-at 是一款自动更新字段变化时间并记录到数据库中的 Mongoose 插件，类似 Mongoose 自带的 timestamps 功能。

---

`Mongoose-modified-at` 是一款自动更新字段变化时间并记录到数据库中的 `Mongoose` 插件，类似 `Mongoose` 自带的 `timestamps` 功能。

### 使用场景

让我们考虑一个场景，我们有个文章发布与展示的需求，数据模型如下。

```javascript
const schema = new mongoose.Schema({
  // 文章标题
  title: String,
  // 是否为草稿
  is_draft: Boolean,
  // 是否推荐
  is_recommended: Boolean,
  // 更多字段...
})
```

当我们在展示最新文章列表时，应该是以文章第一次发布的时间倒序展示，因为文章可以存为草稿，多次编辑，所以不能用 `Mongoose` 提供的 `createdAt` 或 `updatedAt` 作为第一次发布的时间，正确的做法是在每次文章创建或更新时，确定用户是发布文章而不是存为草稿，然后记录此次时间，用该时间作为第一次发布的时间。

要实现该功能我们需要在代码逻辑层进行处理，这样可行不过有点耦合，或者自己封装一个 `Mongoose` 中间件来做这件事，不过现在你可以把这件事交给一个经受测试、`API` 优雅的插件 `ModifiedAt` 来处理。

首先安装插件。

```bash
npm install mongoose-modified-at --save
```

然后在 `Schema` 初始化时做简单的配置即可，如下。

```javascript
import modifiedAt from 'mongoose-modified-at'

// 在 mongoose.model 调用之前
schema.plugin(modifiedAt, {
  // 函数名将作为字段名写入数据库
  publishedAt(doc) {
    // 当函数返回值为 true 时，则记录该时间
    return !doc.is_draft
  },
  // 推荐文章也是如此
  recommendedAt(doc) {
    return doc.is_recommended
  },
})

const Article = mongoose.model('Article', schema)
```

当文档保存或更新携带着 `is_draft` 字段并且值为 `false` 时，插件就会记录此次时间到你声明的 `publishedAt` 字段上一起写入数据库。

示例如下：

```javascript
await Article.create({
  title: 'Document Title',
  is_draft: false,
  is_recommended: true,
  // 更多字段...
})
```

结果如下（数据库）：

```javascript
{
  "title": "Document Title",
  "is_draft": false,
  "is_recommended": true,
  "publishedAt": ISODate("2019-09-27T03:11:07.880Z"),
  "recommendedAt": ISODate("2019-09-27T03:11:07.880Z"),
  // 更多字段...
}
```

### API介绍

上面是 `ModifiedAt` 的富 `API` 形式，即对象格式，全部参数选项如下。

```javascript
schema.plugin(modifiedAt, {
  // 设置监听字段
  fields: ['name', 'status', 'another'],
  // 设置后缀
  suffix: '_your_suffix',
  // 设置路径默认行为
  select: true,
  // 自定义字段
  customField(doc) {
    // 做一些你想做的事，然后返回 Boolean 值，告诉插件是否记录时间
  },
})
```

🍎 参数解释：

- `fields`: 设置监听字段，在文档创建或更新时，如果存在被监听的字段，则自动以 `字段名 + 后缀` 的形式作为字段，并记录此次更新时间到该字段上。可选，`Array` 类型。
- `suffix`: 设置后缀，默认值为 `_modifiedAt`。可选，`String` 类型。
- `select`: 设置路径默认行为，默认为 `true` ，[参考 Mongoose 文档](https://mongoosejs.com/docs/api.html#schematype_SchemaType-select)。可选，`Boolean` 类型。
- `customField`: 自定义字段，此字段不会加后缀，以函数形式添加到参数中，用于自定义功能，函数接收唯一文档参数，当函数返回值为真值时，则记录此次时间到该字段上。


### 简化API

🚀 为了增加  `API`  的简洁易用同时避免过度重载，`ModifiedAt` 只增加了一种简化传参格式，如下。

```javascript
schema.plugin(modifiedAt, ['name', 'status'])
```

意思是将 `fields` 选项提取出来作为参数，写入数据库的结果如下。

```javascript
{
  "name": "Tom",
  "status": 1,
  "name_modifiedAt": ISODate("2019-09-27T03:13:17.888Z"),
  "status_modifiedAt": ISODate("2019-09-27T03:13:17.888Z"),
}
```

### 支持异步

你需要 `Node.js` 版本支持 `async/await` 即可。

```javascript
import P from 'bluebird'

const petSchema = new mongoose.Schema({
  name: String,
  age: Number,
  sex: String,
  // 1：表示采购中，2：已购买，3：已售出
  status: Number,
})

petSchema.plugin(modifiedAt, {
  // 记录购买于哪时
  async boughtAt(doc) {
    // 延时 1s
    await P.delay(1000)
    return doc.status === 2
  },
  // 记录售出于哪时
  soldAt(doc) {
    return doc.status === 3
  },
})
```

### 支持 Mongoose 4.x

如果你现在使用的是 **Mongoose 4.x**，那么你需要使用插件 **1.x** 版本，[文档可在这里查看](https://github.com/Barrior/mongoose-modified-at/blob/compatible-with-4x)。

```bash
npm install mongoose-modified-at@1 --save
```

### “100%”测试覆盖率

`29` 个测试用例，`777` 行代码，`“100%”` 测试覆盖率。

![](https://img13.360buyimg.com/ling/jfs/t1/61048/28/14044/35412/5db647e5E3db05e1b/5d33e201a410f809.png)

### 细节

更多细节处理请移步至 GitHub 文档，[这里](https://github.com/Barrior/mongoose-modified-at#细节说明)。

### 最后

本插件在京东智能设计项目 - 羚珑中实际应用，[ling.jd.com](https://ling.jd.com) 欢迎体验 😘。
