title: DI 原理分析，并实现一个简易版 DI 容器  
subtitle: 本文基于自身理解对IOC/DI相关知识点进行整理输出，仅供交流学习，如有不对的地方，还望各位看官指出。  
cover: https://img12.360buyimg.com/ling/s690x416_jfs/t1/164957/21/22062/76741/60801aa8E27df4f16/ac2d9c918ada4b91.jpg  
category: 经验分享  
tags:   
  - typescript  
  - 依赖注入  
author:  
  nick: 阿文  
  github_name: AwesomeDevin   
date: 2021-08-25 21:00:00   
wechat:
    share_cover: https://img12.360buyimg.com/ling/s690x416_jfs/t1/164957/21/22062/76741/60801aa8E27df4f16/ac2d9c918ada4b91.jpg  
    share_title: DI 原理分析，并实现一个简易版 DI 容器. 
    share_desc: 本文基于自身理解对IOC/DI相关知识点进行整理输出，仅供交流学习，如有不对的地方，还望各位看官指出。  
---
##### 本文基于自身理解进行输出，目的在于交流学习，如有不对，还望各位看官指出。

## DI
DI—Dependency Injection，即“依赖注入”：对象之间依赖关系由容器在运行期决定，形象的说，即由`容器动态的将某个对象注入到对象属性之中`。依赖注入的目的并非为软件系统带来更多功能，而是为了提升对象重用的频率，并为系统搭建一个灵活、可扩展的框架。

## 使用方式
首先看一下常用依赖注入 (DI)的方式：
```javascript
function Inject(target: any, key: string){
    target[key] = new (Reflect.getMetadata('design:type',target,key))()
}

class A {
    sayHello(){
        console.log('hello')
    }
}

class B {
    @Inject   // 编译后等同于执行了 @Reflect.metadata("design:type", A)
    a: A

    say(){
       this.a.sayHello()  // 不需要再对class A进行实例化
    }
}

new B().say() // hello
```
## 原理分析
TS在编译装饰器的时候，会通过执行`__metadata函数`多返回一个属性装饰器`@Reflect.metadata`，它的目的是将需要实例化的`service`以元数据`'design:type'`存入`reflect.metadata`，以便我们在需要依赖注入时，通过`Reflect.getMetadata`获取到对应的`service`， 并进行实例化赋值给需要的属性。

`@Inject`编译后代码:
```javascript
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// 由于__decorate是从右到左执行，因此, defineMetaData 会优先执行。
__decorate([
    Inject,
    __metadata("design:type", A)  //  作用等同于 Reflect.metadata("design:type", A)
], B.prototype, "a", void 0);
```
`即默认执行了以下代码:`
```javascript
Reflect.defineMetadata("design:type", A, B.prototype, 'a');
```
`Inject`函数需要做的就是从`metadata`中获取对应的构造函数并构造实例对象赋值给当前装饰的属性
```javascript
function Inject(target: any, key: string){
    target[key] = new (Reflect.getMetadata('design:type',target,key))()
}
```
不过该依赖注入方式存在一个问题：
- 由于`Inject函数`在代码编译阶段便会执行，将导致`B.prototype`在代码编译阶段被修改，这违反了`六大设计原则之开闭原则（避免直接修改类，而应该在类上进行扩展）`
那么该如何解决这个问题呢，我们可以借鉴一下`TypeDI`的思想。
## typedi - typedi 是一款支持TypeScript和JavaScript依赖注入工具
typedi 的依赖注入思想是类似的，不过多维护了一个`container`
#### 1. metadata
在了解其`container`前，我们需要先了解 typedi 中定义的`metadata`，这里重点讲述一下我所了解的比较重要的几个属性。
- `id: service的唯一标识`
- `type: 保存service构造函数`
- `value: 缓存service对应的实例化对象`

```javascript
const newMetadata: ServiceMetadata<T> = {
      id: ((serviceOptions as any).id || (serviceOptions as any).type) as ServiceIdentifier,    // service的唯一标识
      type: (serviceOptions as ServiceMetadata<T>).type || null,  // service 构造函数
      value: (serviceOptions as ServiceMetadata<T>).value || EMPTY_VALUE,  // 缓存service对应的实例化对象
};
```
#### 2. container 作用
```javascript
function ContainerInstance() {
        this.metadataMap = new Map();  //保存metadata映射关系，作用类似于Refect.metadata
        this.handlers = []; // 事件待处理队列
        get(){};  // 获取依赖注入后的实例化对象
         ...
}
```
- this. metadataMap -  `@service`会将`service构造函数`以metadata形式保存到`this.metadataMap`中。
  - 缓存实例化对象，保证单例; 
- this.handlers  - `@inject`会将依赖注入操作的`对象`、`目标`、`行为`以 object 形式 push 进 handlers 待处理数组。
  - 保存`构造函数`与`静态类型`及`属性`间的映射关系。
- get - 对象实例化操作及依赖注入操作
  - 避免直接修改类，而是对其实例化对象的属性进行拓展; 
```javascript
{
        object: target,  // 当前等待挂载的类的原型对象
        propertyName: propertyName,  // 目标属性值
        index: index, 
        value: function (containerInstance) {   // 行为
            var identifier = Reflect.getMetadata('design:type', target, propertyName)
            return containerInstance.get(identifier);
        }
}
```
将该对象 push 进一个等待执行的 handlers 待处理数组里，当需要用到对应 service 时执行 value函数 并修改 propertyName。
```javascript
if (handler.propertyName) {
     instance[handler.propertyName] = handler.value(this);
}
```


## 相关结论
- `typedi`中的实例化操作不会立即执行, 而是在一个`handlers`待处理数组，等待`Container.get(B)`，先对B进行实例化，然后从`handlers`待处理数组取出对应的`value函数`并执行修改实例化对象的属性值，这样不会影响Class B 自身
- 实例的属性值被修改后，将被缓存到`metadata.value`(typedi 的单例服务特性)。

相关资料可查看： [https://stackoverflow.com/questions/55684776/typedi-inject-doesnt-work-but-container-get-does](https://stackoverflow.com/questions/55684776/typedi-inject-doesnt-work-but-container-get-does)
```javascript
new B().say()  // 将会输出sayHello is undefined

Container.get(B).say()  // hello word
```
## 实现一个简易版 DI Container
此处代码依赖`TS`,不支持`JS环境`
```javascript
interface Handles {
    target: any
    key: string,
    value: any
}

interface Con {
    handles: Handles []   // handlers待处理数组
    services: any[]  // service数组，保存已实例化的对象
    get<T>(service: new () => T) : T   // 依赖注入并返回实例化对象
    findService<T>(service: new () => T) : T  // 检查缓存
    has<T>(service: new () => T) : boolean  // 判断服务是否已经注册
}

var container: Con = {
    handles: [],  // handlers待处理数组
    services: [], // service数组，保存已实例化的对象
    get(service){
        let res: any = this.findService(service)
        if(res){
            return  res
        }

        res = new service()
        this.services.push(res)
        this.handles.forEach(handle=>{
            if(handle.target !== service.prototype){
                return
            }
            res[handle.key] = handle.value
        })
        return res
    },

    findService(service){
        return this.services.find(instance => instance instanceof service)
    },

   // service是否已被注册
    has(service){
        return !!this.findService(service)
    }
}

function Inject(target: any, key: string){
    const service = Reflect.getMetadata('design:type',target,key)
    
    // 将实例化赋值操作缓存到handles数组
    container.handles.push({
        target,
        key,
        value: new service()
    })

    // target[key] = new (Reflect.getMetadata('design:type',target,key))()
}

class A {
    sayA(name: string){
        console.log('i am '+ name)
    }
}

class B {
    @Inject
    a: A

    sayB(name: string){
       this.a.sayA(name)
    }
}

class C{
    @Inject
    c: A

    sayC(name: string){
       this.c.sayA(name)
    }
}

// new B().sayB(). // Cannot read property 'sayA' of undefined
container.get(B).sayB('B')
container.get(C).sayC('C')
```
