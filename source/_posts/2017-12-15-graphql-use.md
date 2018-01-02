title: GraphQL 使用介绍
subtitle: 介绍了 GraphQL 的基本使用。
date: 2017-12-15 18:27:36
cover: //misc.aotu.io/booxood/graphql-use/cover_900x500.jpg
categories: Web开发
tags:
  - web
  - api
  - graphql
author:
  nick: Avin
  github_name: booxood
wechat:
  share_cover: http://misc.aotu.io/booxood/graphql-use/cover_200x200.jpg
  share_title: GraphQL 使用介绍
  share_desc: 介绍了 GraphQL 的基本使用。

---

<!-- more -->

[GraphQL][graphql] 是 Fackbook 的一个开源项目，它定义了一种查询语言，用于描述客户端与服务端交互时的数据模型和功能，相比 `RESTful API` 主要有以下特点：

- 根据需要返回数据
- 一个请求获取多个资源
- 提供内省系统

这使得客户端的功能得到了加强，特别是在查询数据方面。

下面我们从使用的角度来介绍一下。

### 相关概念

在使用 GraphQL 之前，先介绍几个相关概念，便于理解使用。

- **Operations**

GraphQL 服务提供的操作一般有：`query`、`mutation`。`query` 可以理解为 `RESTful API` 中的 `GET` 的请求。`mutation` 可以理解为 `RESTful API` 中的 `POST`、`PUT`、`DELETE` 之类的请求。

- **Types**

定义了 GraphQL 服务支持的类型，例如：

```js
type User {
  id: ID
  name: String
}

type Query {
  user: User
}
```

定义了 `User` 类型和包含的字段以及字段的类型；定义 `Query` 返回一个 `User` 类型的 `user`，`Query` 也是一种类型。

- **Scalar types**

标量类型。GraphQL 默认提供的标量类型有：Int、Float、String、Boolean、ID，也可以实现自定义的标量类型，如：Date。

标量类型有什么用呢？**返回数据的字段必须是标量类型**。例如我们想返回一个 `user`：

```js
query {
  user // 报错
}
```

上面这样是会报错的，因为 `user` 不是标量类型，需要改成

```js
query {
  user {
    id
    name
  }
}
```

指定返回 `user` 的 id 和 name，这两个字段都是标量类型，就可以正确返回了。


### 开始使用

如果看完上面的介绍，心中有很多疑问，没关系，我们现在以 `GitHub GraphQL API` 为例，来实际使用一下。打开 `https://developer.github.com/v4/explorer/`，然后登录，会看到一个这样的界面

![github][github]

这是 GraphQL 提供的开发工具 `GraphiQL`，可以检查 GraphQL 的语法，发送 GraphQL 的请求，还提供文档查询功能。在开始使用之前先介绍一下文档查询功能。点击右上角的 `< Docs` 并可以看到

![github-doc][github-doc]

上面的 `ROOT TYPES` 表示最顶层支持的类型，只有两个 `Query` 和 `Mutation`。点击 `Query`，可以看到该类型包含的字段。仔细看，会发现这些字段的值又都是类型。

<div style="margin:0 auto;width:50%;">
![github-fields][github-fields]
</div>

往下滚动，找到 `user(login: String!): User`，点击 `User`

<div style="margin:0 auto;width:50%;">
![github-user][github-user]
</div>

终于找到一个标量类型的字段 `bio: String`，按照之前说法，我们是可以查询这个字段，写出如下的查询语言：

```js
{
  user {
    bio
  }
}
```

准备执行时，会看到 `user` 下方有条红线，鼠标放上去

![github-alert][github-alert]

提示 `user` 必须指定一个 `login` 的参数，再回头看文档中该字段的描述 `user(login: String!): User`，是不是就可以理解了，`(login: )` 表示该字段接受一个 `login` 参数，为 `String` 类型，`!` 表示是必须的。

将查询语言改成：

```js
{
  user(login: "booxood") {
    bio
  }
}
```

再执行，并得到了我们预期指定的结果

```json
{
  "data": {
    "user": {
      "bio": "Happy coding & Happy life"
    }
  }
}
```

现在是不是有点理解这种查询语言了。下面我们再以【 [Gitalk][gitalk]：一个基于 Github Issue 和 Preact 开发的评论插件】中的两个需求为例

- **展示某个 Issue 的评论和评论上的点赞数据**


```js
query {
  repository(owner: "gitalk", name: "gitalk") {
    issue(number: 1) {
      comments(last: 10) {
        totalCount
        nodes {
          author {
            login
            avatarUrl
          }
          body
          reactions(first: 100, content: HEART) {
            totalCount
            viewerHasReacted
          }
        }
      }
    }
  }
}
```

先通过 `repository(owner: "gitalk", name: "gitalk")` 找到 `repository`，再通过 `issue(number: 1)` 指定 `issue`，然后 `comments(last: 10)` 表示从后面取 10 条 `comments`，同时获取评论的 `body` 和 评论的 `reactions(first: 100, content: HEART)` 以及 `reactions` 的相关信息。


- **添加或取消某个评论上的点赞**

添加

```js
mutation {
  addReaction(input: {subjectId: "MDEyOklzc3VlQ29tbWVudDMxNTQxOTc2NQ==", content: HEART}) {
    reaction {
      content
    }
  }
}
```

取消

```js
mutation {
  removeReaction(input: {subjectId: "MDEyOklzc3VlQ29tbWVudDMxNTQxOTc2NQ==", content: HEART}) {
    reaction {
      content
    }
  }
}
```

之前的都是查询，这两个是 `mutation`，分别调用了 `addReaction` 和 `removeReaction`。
可以在从文档的 `ROOT TYPE` 上选择 `Mutation` 查看支持的所有 `mutation`。

以上主要介绍了 GraphQL 的基本使用，具体更多内容可以查看 GraphQL 提供的[教程][graphql-learn]。

  [graphql]: http://graphql.org/
  [graphql-learn]: http://graphql.org/learn/
  [gitalk]: https://gitalk.github.io/
  [github]: https://misc.aotu.io/booxood/graphql-use/github.png
  [github-alert]: https://misc.aotu.io/booxood/graphql-use/github-alert.png
  [github-doc]: https://misc.aotu.io/booxood/graphql-use/github-doc.png
  [github-fields]: https://misc.aotu.io/booxood/graphql-use/github-fields.png
  [github-user]: https://misc.aotu.io/booxood/graphql-use/github-user.png