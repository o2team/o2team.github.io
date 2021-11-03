title: Nodejs AOP 与 IOC 实践
subtitle: 从 angular.js 1.x 版本到 Nestjs ，JavaScript 世界越来越多的框架和类库开始应用 AOP 和 IoC 这样的软件编程设计思想，本文就带你一探究竟。
cover: https://img11.360buyimg.com/ling/s690x416_jfs/t1/154993/11/6221/322466/5fb3b229E00d60f5e/10617d32c79008a8.png.webp
category: 经验沉淀  
tags:   
  - typescript  
  - 依赖注入  
author:  
  nick: 大键客  
  github_name: hentaicracker   
date: 2021-11-03 10:00:00   
wechat:
    share_cover: https://img11.360buyimg.com/ling/s690x416_jfs/t1/154993/11/6221/322466/5fb3b229E00d60f5e/10617d32c79008a8.png.webp
    share_title: Nodejs AOP 与 IOC 实践
    share_desc: 从 angular.js 1.x 版本到 Nestjs ，JavaScript 世界越来越多的框架和类库开始应用 AOP 和 IoC 这样的软件编程设计思想，本文就带你一探究竟。
---

## 什么是 AOP 和 IoC

什么是 `AOP` 和 `IoC` ？两者皆为软件编程的一种设计思想，相信熟悉 java 的同学应该不陌生，大名鼎鼎的 [spring](https://spring.io/) 便是这两种编程思想的集大成者。熟悉 `Angular` 的同学应该也不陌生，听说 `Angular` 的早期开发者就是一群后端程序员搞出来的一个框架，全面借鉴了后台开发的一些设计思想（当然是 spring）。目前大火的 `Nestjs` ———— 一个 `Nodejs` 服务端开发框架，当你拿到一份 demo 乍一眼看过去，这不是 `java` 嘛！

```js
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto)
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id)
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id)
  }
}
```

笔者找了份 `Angular` 的代码以及 `Nestjs` 的代码，熟悉 ES6 的朋友可能就会说了，这不就是装饰器嘛！

```js
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string) {
    this.storage.getItem(key)
  }

  set(key: string, value: string) {
    this.storage.setItem(key, value)
  }

  remove(key: string) {
    this.storage.removeItem(key)
  }

  clear() {
    this.storage.clear()
  }
}
```

接下来笔者就详细地介绍一下到底什么是 `AOP` 和 `IOC`，以及我们在 `Nodejs` 端的实践。

### AOP

`AOP` (Aspect Oriented Programming)，中文译为：**面向切面编程**，以下是[维基百科](https://zh.wikipedia.org/wiki/%E9%9D%A2%E5%90%91%E5%88%87%E9%9D%A2%E7%9A%84%E7%A8%8B%E5%BA%8F%E8%AE%BE%E8%AE%A1)的定义：

> 面向切面程序设计是计算机科学中的一种程序设计思想，旨在将横切关注点与业务主体进行进一步分离，以提高程序代码的模块化程度。

`AOP` 主要的思想是将我们对于业务逻辑无关的一些操作，比如日志记录、性能统计、安全控制、异常处理、错误上报等，将这些操作从业务逻辑中剥离出来，将它们放在一些独立的方法中，然后如果我们对这些操作做修改的时候就可以不用影响到业务逻辑相关的代码。它主要体现了我们对代码的低耦合性的追求。

那我们使用 `JavaScript` 进行开发时，如何去实践这一种编程思想呢？答案就是**装饰器**（在 java 中叫做 **注解**）。

#### 装饰器

`JavaScript` 的装饰器尚且还在 [stage 2](https://tc39.es/proposal-decorators/) 阶段。然而 `TypeScript` 早在 2015 年与 `Angular` 的合作中就基于 **stage 1** 的版本实现了装饰器的功能，所以目前两个版本的实现有着相当大的差异。另外，`TypeScript` 的装饰器实现了对类型（这里是指 `TypeScript` 的类型）的元数据注入，使得程序在运行时也能去检查其类型相关信息，这对于我们在做数据校验时有着相当大的帮助。

使用 TypeScript 装饰器，需要在项目的 `tsconfig.json` 中添加：

```json
{
  "experimentalDecorators": true,
}
```

装饰器主要有：
- 方法装饰器
- 类装饰器
- 属性装饰器
- 参数装饰器
- Accessor 装饰器

**方法装饰器**

方法装饰器需要放在被装饰的方法之前，使用 `@` 加上装饰器的名字，如：

```ts
class C {
  @log
  foo (n: number) {
    return n * 2
  }
}
```

使用该 `log` 装饰器前需要提前定义好该装饰架方法：

```ts
function log (target: any, key: string, descriptor: PropertyDescriptor) {
  return {
    value: function (...args: any[]) {
      var a = args.map(a => JSON.stringify(a)).join()
      var result = descriptor.value.apply(this, args)
      var r = JSON.stringify(result)
      console.log(`Call: ${key}(${a}) => ${r}`)
      return result
    }
  }
}
```

当我们调用时则会打出日志：

```ts
new C().foo(2) // "Call: foo(2) => 4"
```

在这个例子中，我们通过将日志输出的逻辑独立到 `log` 装饰器中，而不影响 `foo` 方法本身的逻辑，降低了代码的耦合度，让代码结构更加清晰易于维护。


更多 `TypeScript` 装饰器详解可参考[这个系列的文章](http://blog.wolksoftware.com/decorators-reflection-javascript-typescript)，接下来我们看看它的一些应用。


#### 路由控制

回到文中开头的第一个 `Nestjs` 的 demo，我们可以对比一下如果使用 `koa` 来写路由的区别：

Koa:
```ts
const app = new koa()
const router = new Router()
const childRouter = new Router()

childRouter.get('/users', ctx => {

  const one = userService.getOne()

  ctx.body = {
    code: 0,
    data: one,
  }
})

router.use('/test', childRouter.routes())

app.use(router.routes())
```

Nestjs 风格：
```ts
@Controller('/test')
class SomeClass {

  @Get('/users')
  someGetMethod() {
    return userService.getOne(id)
  }

}
```

从上面两个例子，不难看出基于 [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming)（面向对象编程） 并使用装饰器来做路由控制使我们的代码更简洁也具备更高的可读性。如果要实现一个装饰器风格的路由控制器要如何实现？

在此之前，我们需要了解一个 `ES7` 的提案：[reflect-metadata](https://rbuckton.github.io/reflect-metadata/)，也就是**元数据反射**，目前 `TypeScript` 在 1.5+ 的版本已经支持它。

**元数据反射**主要用来在声明的时候添加和读取元数据，如：

- 实例的名字
- 实例的类型
- 实例实现的接口
- 实例的属性名字和类型
- 实例构造函数的参数名和类型

使用 `reflect-metadata`，需要安装：

```shell
$ npm i reflect-metadata --save
```

在项目的 `tsconfig.json` 中添加：

```json
{
  "emitDecoratorMetadata": true,
}
```

`reflect-metadata` 的 [API](https://github.com/rbuckton/reflect-metadata#api) 可以用于类或者类的属性上，当装饰类的时候，在类上添加元数据，当装饰属性时，在类原型上添加元数据，如：

```ts
// `Reflect.metadata` 是一个装饰器工厂，它返回各种类型的装饰器
@Reflect.metadata('class', 'A')
class Test {

  @Reflect.metadata('method', 'B')
  public hello(): string {
    return 'hello world'
  }

}

console.log(Reflect.getMetadata('class', Test)) // 'A'
console.log(Reflect.getMetadata('method', new Test(), 'hello')) // 'B'
```

在 `TypeScript` 中内置了三个元数据类型：

- 类型元数据 **"design:type"**
- 参数类型元数据 **"design:paramtypes"**
- 返回值类型元数据 **"design:returntype"**

比如我们来获取类中属性的类型：

```ts
function logType (target: any, key: string) {
  const t = Reflect.getMetadata('design:type', target, key)
  console.log(`${key} param types: ${t.name}`)
}

class Foo {

  @logType
  public barfoo: string = 'test'
}

new Foo().barfoo
// barfoo param types: String
// test
```

下表是 `TypeScript` 的各种数据类型，通过内置元数据 `key` 获取到的类型：

|type|序列化得到的值|
|-|-|
|number|Number|
|string|String|
|boolean|Boolean|
|any|Object|
|void|undefined|
|Array|Array|
|元组(Tuple)|Array|
|类|class constructor|
|枚举(Enum)|Number|
|至少有一个调用签名|Function|
|其他|Object|


接下来我们基于 Reflect Metadata 实现路由控制器，这里参考了[《TypeScript Deep Dive》](https://basarat.gitbook.io/typescript/getting-started)书中的例子：

```ts
const METHOD_METADATA = 'method'
const PATH_METADATA = 'path'

// 类装饰器
const Controller = (path: string): ClassDecorator => {
  return target => {
    // 在类上定义元数据
    Reflect.defineMetadata(PATH_METADATA, path, target)
  }
}

// 方法装饰器工厂函数
const createMappingDecorator = (method: string) => (path: string): MethodDecorator => {
  return (target, key, descriptor) => {
    // 在 descriptor value 上定义元数据
    Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
    Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value)
  }
}

const Get = createMappingDecorator('GET')
const Post = createMappingDecorator('POST')
```

然后创建一个函数映射出 `route`:

```ts
function mapRoute(instance: Object) {
  const prototype = Object.getPrototypeOf(instance)

  // 筛选出类的 methodName
  const methodsNames = Object.getOwnPropertyNames(prototype)
    .filter(item => !isConstructor(item) && isFunction(prototype[item]))

  return methodsNames.map(methodName => {
    const fn = prototype[methodName]

    // 取出定义的 metadata
    const route = Reflect.getMetadata(PATH_METADATA, fn)
    const method = Reflect.getMetadata(METHOD_METADATA, fn)；
    return {
      route,
      method,
      fn,
      methodName
    }
  })
}
```

基于此，我们可以拿到一份路由映射表：

```ts
Reflect.getMetadata(PATH_METADATA, SomeClass) // '/test'

mapRoute(new SomeClass())

/**
 * [{
 *    route: '/a',
 *    method: 'GET',
 *    fn: someGetMethod() { ... },
 *    methodName: 'someGetMethod'
 *  },{
 *    route: '/b',
 *    method: 'POST',
 *    fn: somePostMethod() { ... },
 *    methodName: 'somePostMethod'
 * }]
 *
 */
```

最后，只需将这些 `route` 信息绑在 `express` 或 `koa` 上就可以了。

### IoC

**IoC** (Inversion of Control)，意为控制反转。控制反转是 [OOP](https://en.wikipedia.org/wiki/Object-oriented_programming) 的一种设计原则。

`IoC` 到底是什么有什么用，我们先来看一个简单的例子：

```ts
class Wing {}

class Bird {
  private wing: Wing

  constructor () {
    this.wing = new Wing()
  }
}

const bird = new Bird()
```

该例中，`Bird` 类依赖于 `Wing` 类，如果 `Wing` 类有修改，则会影响 `Bird` 类，如果依赖的层级越深，每修改一个底层的类给上层类带来的影响将是毁灭性的（代码及其难维护）。

`IoC` 的思想就是将类的依赖动态注入，使得底层的类的修改不会影响到依赖它的类：

```ts
class Wing {}

class Bird {
  private wing: Wing

  constructor (wing) {
    this.wing = wing
  }
}

const wing = new Wing()
const bird = new Bird(wing) // 将实例化的 wing 传入 Bird 类
```

这样，我们便实现了类的**控制反转**。同时，我们需要有一个容器来维护各个对象实例，当用户需要使用实例时，容器会自动将对象实例化给用户。

```ts
import { Container, Service } from 'typedi'

@Service()
class Wing {}

class Bird {
  private wing: Wing

  constructor () {
    this.wing = Container.get('Wing')
  }
}
```

这种动态注入的思想叫做**依赖注入**（DI, Dependency Injection），它是 `IoC` 的一种应用形式。

再结合装饰器，我们便可以写出下面的代码：

```ts
@Controller('/users')
export class UsersController {

  @inject()
  usersService: UsersService

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll()
  }
}
```

目前社区比较出名的几个 DI 库有：

- [typedi](https://github.com/typestack/typedi)：typestack 出品，也是 typeORM 的兄弟产品。
- [inversify](https://github.com/inversify/InversifyJS)：star数最多也最受欢迎。


### 羚珑 SNS 后端服务 AOP 与 IoC 实践

羚珑 SNS 是羚珑智能营销设计服务，该服务是整个羚珑设计平台的一个模块，提供了一整套营销活动搭建方案。

目前该服务已在线上平稳运行了一年多的时间，通过高度清晰的代码结构以及低耦合性使得我们对该项目的可维护性大大提高。

#### 技术选型

由于该服务深度对接**羚珑 ATOM 搭建平台**、 **WQ 营销活动管理系统**以及**子午线数据平台**，同时需要保证数据的可靠性和实时性，所以在做前期设计时主要考虑以下几个点：

![前期设计](https://img12.360buyimg.com/img/s1430x838_jfs/t1/121610/16/19110/89846/5fb3410dEf80ef4f0/0f81bb6188e859df.png)

基于此，我们可以发现像是**权限验证**、**数据校验**、**错误处理**以及**日志分析**这些模块基本都可以独立于我们主要的业务逻辑之外，通过 `AOP` 和 `IoC` 可以很好地帮助我们做到这一点。

基于当时的需求做了以下的技术选型：

|场景|技术|方案|
|-|-|-|
|语言|TypeScript|类型系统、代码校验|
|路由框架|Koa2（[routing-controllers](https://github.com/typestack/routing-controllers)）|routing-controllers 是 typestack 开源路由控制器框架，支持 express 和 koa|
|依赖注入|[typedi](https://github.com/typestack/typedi)|依赖注入，将各 service 注入到 controller 里|
|数据校验|[class-validator](https://github.com/typestack/class-validator)|基于 OOP、AOP 的模式来校验数据|
|数据库|MongoDB/Mongoose|兼容其他系统数据库|
|环境部署|[talos](http://talos.jd.com)|同其他系统|

另外有一个之前一直提到的大而全的框架叫做 [Nestjs](https://nestjs.com/)，号称 `Nodejs` 届的 `Angular`，不过它的概念太多，不太容易消化，适合比较庞大的系统。


#### 结构设计

对不同职责的代码需要做清晰的界定：

![代码结构](https://img12.360buyimg.com/img/s1554x812_jfs/t1/137122/7/16158/197099/5fb34642Ef5dbf40d/bcad7ff13a867418.png)

这里参考了 `Nestjs` 的设计风格，只要是好的，我们照单全收（我全都要.jpg）。


#### 路由控制

通过 `routing-controllers` 的 API ，实现基于装饰器对路由的映射，以及 `request` 上的信息数据获取：

```ts
import {
  Get,
  Ctx,
  Param,
  Controller,
  HeaderParam,
} from 'routing-controllers'

import { Context } from 'koa'

@Controller()
export class AppController {

  /**
   * @example
   * GET http://example.com/init/xxx
   */
  @Get('/init/:id')
  async init (
    @Param('id') id: string, // 获取路由参数
    @HeaderParam('cookie') cookie: string, // 获取 cookie
    @Ctx() ctx: Context, // 获取 koa 上下文
  ) {
    // ...
    // return { code: 0 }
  }

}
```

#### 数据校验

借助 `class-validator` ，创建基于类的数据校验器 `app.dto.ts`。

```ts
import {
  Min,
  Max,
  IsNotEmpty,
  IsDateString,
} from 'class-validator'
import { Type, Transform } from 'class-transfromer'

export class AppDto {
  
  @IsNotEmpty({
    message: 'id is required'
  })
  id: string

  @Min(1)
  @Max(10)
  num: number

  @IsDateString()
  date: string

  // 嵌套校验 Foo 类
  @ValidateNested()
  @Type(() => Foo)
  foo: Foo
}
```

定义好了 `AppDto` 数据校验器，我们可以通过 `routing-controllers` 的 `@Body` 装饰器来自动校验 **request body** 里的数据。

```ts
import {
  Body,
  Post,
  JsonController,
} from 'routing-controllers'

import { AppDto } from './app.dto'

@JsonController()
export class AppController {

  /**
   * @example
   * POST http://example.com/init
   */
  @Post('/init')
  async init (
    // 通过装饰器拿到 AppDto 类相关元数据信息，自动进行数据校验
    @Body() body: AppDto,
  ) {
    // ...
    // return { code: 0 }
  }

}
```

当数据校验失败时，会抛出一个全局的错误，并返回 400 以及相关数据校验错误信息。

#### 依赖注入

通过 `typedi` 提供的依赖注入容器，可以很方便地将相关业务逻辑服务类注入到 controller 层。

```ts
import {
  Body,
  Post,
  JsonController,
} from 'routing-controllers'

import { AppService } from './app.service'
import { AppDto } from './app.dto'

@JsonController()
export class AppController {

  // 将 AppService 注入到 AppController 中
  @Inject()
  appService: AppService

  /**
   * @example
   * POST http://example.com/init
   */
  @Post('/init')
  async init (
    @Body() body: AppDto,
  ) {
    const { foo } = body
    // 消费已实例化的 appService
    const res = await this.appService.doSomething(foo)
    // ...
    // return { code: 0 }
  }

}
```

最后，在入口文件 `app.ts` 注册依赖注入的容器：

```ts
import 'reflect-metadata'

import Koa from 'koa'
import { Container } from 'typedi'
import { useKoaServer, useContainer } from 'routing-controllers'

import { AppController } from './app.controller'

export const app = new Koa()

// 注册 AppController
useKoaServer(app, {
  controllers: [AppController]
})

// 注册依赖注入容器
useContainer(Container)
```

至此，一个基于 `AOP` 与 `IoC` 的 `Nodejs` 后端服务的雏形就已搭建完成。

### 写在最后

通过以上的例子，`AOP` 与 `IoC` 带给我们最大的好处就是清晰的代码结构和高可维护性的代码，如果你想探究更多，可以想想如何去实现一个类似 `typedi` 的依赖注入容器，更深层次的修炼必然会提高你的抽象思维能力以及结构设计能力。

我们的最高指导思想就是：**不做重复的事情**。

### 参考资料

http://blog.wolksoftware.com/decorators-reflection-javascript-typescript

https://basarat.gitbook.io/typescript/getting-started

https://github.com/rbuckton/reflect-metadata#api

https://github.com/typestack/routing-controllers

https://nestjs.com

