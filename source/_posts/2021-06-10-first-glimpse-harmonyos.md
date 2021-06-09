---
title: 初窥鸿蒙
date: 2021-06-09 15:54:14
tags: ['前端', 'harmonyos', '鸿蒙']
---

![](https://img12.360buyimg.com/imagetools/jfs/t1/176980/28/8267/1199737/60c0733eE88b976e8/1c8005c8742fb726.png) 

## 一、什么是鸿蒙
鸿蒙即 HarmonyOS ，是华为公司推出的支持手机、平板、智能穿戴、智慧屏、车机等多种终端设备的分布式操作系统，并且它提供了多语言开发的 API，支持 Java、XML、C/C++、JS、CSS、HML（类 html 的鸿蒙自己的标记语言）等开发语言，而且它提供多种响应式布局方案，支持栅格化布局，可以使用同一套代码部署在手机手表平板等多种不同尺寸屏幕的设备上。

## 二、开发准备

### 2.1 环境安装

>开发鸿蒙软件需要用到 HUAWEI DevEco Studio，它提供了模板创建、开发、编译、调试、发布等服务。

1、登录 [HarmonysOS 应用开发门户](https://developer.harmonyos.com/cn/home)，点击右上角注册按钮，注册开发者帐号。

2、进入 [HUAWEI DevEco Studio 产品页](https://developer.harmonyos.com/cn/develop/deveco-studio)，登录华为开发者账号后下载 DevEco Studio 安装包并进行安装。

3、启动 DevEco Studio，根据工具引导下载 HarmonyOS SDK。
![下载HarmonyOS SDK](https://img10.360buyimg.com/imagetools/jfs/t1/163346/25/15685/37125/606450e4E006ef985/6da1c5d8a0344392.png)

4、下载 HarmonyOS SDK 成功后会进入欢迎页，点击欢迎页中的 Configure > Settings 打开设置窗口，点击 Apparance&behavior > System settings > HarmonyOS SDK，选中 JS SDK 进行下载。
![下载JS SDK](https://img10.360buyimg.com/imagetools/jfs/t1/188102/8/7325/83229/60c079c6E7eb88c25/869532b2c4f41071.png)

至此开发环境安装完成。

### 2.2 新建项目
点击菜单栏中的 File > New > New Project
![新建项目](https://img13.360buyimg.com/imagetools/jfs/t1/169714/16/15660/130096/606450e5E5c1739b2/4265c3a9fc1aa229.png)
选择需要开发的项目设备，然后选择 Empty Featrue Ability(JS) 后，点击 Next，此时会出现项目的信息配置
![项目信息配置](https://img11.360buyimg.com/imagetools/jfs/t1/156235/30/18987/457171/606450e7E2ad793e7/3cb9bd3ca9299815.png)
点击 Finish，一个新的项目就被创建出来了。

### 2.3 项目目录
![项目目录](https://img12.360buyimg.com/imagetools/jfs/t1/162307/30/15773/94806/606450e7Ef49482db/cee872dd88af7654.png)

使用 JS SDK 进行开发的话，需要关注的是 entry > src > main > js 文件夹，其中：
* i18n 目录下存放的是多语言的 json 文件
    > en-US.json 为英文模式展示的内容
    > zh-CN.json 为中文模式展示的内容

* pages 下存放的是项目的多个页面，每个页面都由 hml、js 和 css 组成
    > hml 文件定义了页面的布局、页面中用到的组件，以及这些组件的层级关系
    > js 文件定义了页面的业务逻辑，比如数据绑定、事件处理等
    > css 文件定义了 index 页面的样式

* app.js 中存放的是全局的 js 逻辑和 app 的生命周期管理

除此之外，还可以自己创建 common 目录用于存放公共资源文件，比如：公共样式和公用方法。

### 2.4 生命周期
生命周期分为应用的生命周期以及页面的生命周期

![生命周期](https://img12.360buyimg.com/imagetools/jfs/t1/178869/6/8197/8308/60c079d0E24fa59ae/49751c68f90244ed.png)

其中，应用的生命周期主要分为应用创建时调用的 onCreate，以及应用销毁时触发的 onDestroy。

而页面的生命周期分为：
* onInit：页面数据准备完成时触发；
* onReady：页面编译完成时触发；
* onShow：页面展示时触发；
* onHide：页面被隐藏时触发；
* onDestroy：页面被销毁时触发；

由于JS UI只支持应用同时运行并展示一个页面，因此当应用从页面 A 跳转到页面 B 时，首先触发页面 A 的 onHide、onDestroy 函数，然后依次调用页面 B 的 onInit、onReady、onShow 函数来初始化和显示页面 B。

## 三、组件
在 hml 文件中，组件分为容器组件、基础组件、媒体组件、画布组件、栅格组件，由于篇幅有限，这里只列举一下组件名称和对应的描述，感兴趣的同学可以点击 [组件文档](https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-components-container-badge-0000001060267851) 进行查阅。

### 3.1 容器组件

| 组件名 | 描述 |
| --- | --- |
| div | 基础容器 |
| list | 列表容器 |
| list-item | list 的子组件，用来展示列表具体 item |
| list-item-group | list 的子组件，用来展示分组，宽度默认充满 list 组件 |
| badge | 新事件标记容器 |
| dialog | 自定义弹窗容器 |
| panel | 弹出式可滑动面板容器 |
| popup | 气泡提示容器 |
| refresh | 下拉刷新容器 |
| stack | 堆叠容器，子组件按照顺序依次入栈，后一个子组件覆盖前一个子组件 |
| stepper | 步骤导航器。当完成一个任务需要多个步骤时，可以使用步骤导航器展示当前进展 |
| stepper-item | 步骤导航器子组件，作为步骤导航器某一个步骤的内容展示组件 |
| swiper | 滑动切换容器 |
| tabs | tab 页标签切换容器 |
| tab-bar | tabs 的子组件，用来展示 tab 的标签区 |
| tab-content | tabs 的子组件，用来展示 tab 的内容区 |

### 3.2 基础组件


| 组件名 | 描述 |
| --- | --- |
| image | 图片组件，用来渲染展示图片 |
| image-animator | 图片帧动画播放器 |
| text | 文本组件，用于展示文本信息 |
| span | text 的子组件，提供文本修饰能力 |
| textarea | 多行文本输入框 |
| input | 交互式组件，包括单选框，多选框，按钮和单行文本输入框 |
| button | 按钮组件，包括胶囊按钮、圆形按钮、文本按钮、弧形按钮、下载按钮 |
| chart | 图表组件，用于呈现线形图、柱状图、量规图界面 |
| divider | 提供分隔器组件，分隔不同内容块/内容元素。可用于列表或界面布局 |
| label | 为 input、button、textarea 组件定义相应的标注，点击该标注时会触发绑定组件的点击效果 |
| marquee | 跑马灯组件，用于展示一段单行滚动的文字 |
| menu | 菜单组件，作为临时性弹出窗口，用于展示用户可执行的操作 |
| select | 下拉选择组件，可让用户在多个选项之间选择 |
| option | 可作为 menu 或 select 组件的子组件，用来展示具体项目 |
| picker | 滑动选择器组件，类型支持普通选择器，日期选择器，时间选择器，时间日期选择器，多列文本选择器 |
| picker-view | 嵌入页面的滑动选择器 |
| piece | 一种块状的入口组件，可包含图片和文本，常用于展示收件人 |
| progress | 进度条组件，用于显示内容加载或操作处理进度 |
| qrcode | 二维码组件，用于生成并显示二维码 |
| rating | 评分条组件 |
| search | 搜索框组件，用于提供用户搜索内容的输入区域 |
| slider | 滑动条组件，用来快速调节设置值，如音量、亮度等 |
| switch | 开关组件，用于开启或关闭某个功能 |
| toolbar | 工具栏组件，放在界面底部，用于展示针对当前界面的操作选项 |
| toolbar-item | toolbar 子组件，用于展示工具栏上的一个操作选项 |
| toggle | 状态按钮组件，用于从一组选项中进行选择 |

### 3.3 媒体组件
媒体组件暂时只有 **video** 组件一个，除了智能穿戴设备不支持外，手机、平板、智慧屏设备均支持该组件，它为设备提供了视频播放功能。

### 3.4 画布组件
画布组件展示只有 **canvas** 组件一个，手机、平板、智慧屏、智能穿戴设备均支持该组件，它为设备提供了自定义绘制图形的能力。

### 3.5 栅格组件

| 组件名 | 描述 |
| --- | --- |
| grid-container | 栅格布局容器根节点 |
| grid-row | grid-row 是栅格布局容器 grid-container 的子容器组件，使用 flex 横向布局，排列每个 grid-col 容器，justify-content 与 align-items 默认为 flex-start，支持折行显示 |
| grid-col | grid-row 的子容器组件 |

栅格系统有 Margins，Gutters，Columns 三个属性：
* Margins：用于控制元素距离屏幕最边缘的距离
* Gutters：用来控制元素和元素之间的距离关系
* Columns：用来辅助布局的主要定位工具，不同的屏幕尺寸匹配不同的 Columns 数量来辅助布局定位，它会根据实际设备的宽度和 Columns 数量自动计算每一个 Columns 的宽度

![栅格系统](https://img14.360buyimg.com/imagetools/jfs/t1/161083/15/15808/17741/606450e8E4fb696ba/da412aaa7ef68967.png)

不同的设备根据水平宽度 px，显示不同数量的栅格数：
xs : 0px < 水平分辨率 < 320px：2 Columns 栅格；
sm : 320px <= 水平分辨率 < 600px：4 Columns 栅格；
md : 600px <= 水平分辨率 < 840px：8 Columns 栅格；
lg : 840px <= 水平分辨率：12 Columns 栅格；

## 四、HML语法
HML（HarmonyOS Markup Language）是一套类 HTML 的标记语言，通过组件，事件构建出页面的内容。页面具备事件绑定、数据绑定、列表渲染、条件渲染和逻辑控制等能力。

### 4.1 事件绑定
hml 中事件绑定默认返回一个事件对象参数，可以通过该参数获取事件信息，同时也可以传递额外参数。
```html
<!-- xxx.hml -->
<div>
  <!-- 正常格式 -->
  <div onclick="clickfunc"></div>
  <!-- 缩写 -->
  <div @click="clickfunc('hello')"></div>
  <!-- 使用事件冒泡模式绑定事件回调函数 -->
  <div on:touchstart.bubble="touchstartfunc"></div>
  <!-- 使用事件捕获模式绑定事件回调函数 -->
  <div on:touchstart.capture="touchstartfunc"></div>
  <!-- on:{event}等价于on:{event}.bubble -->
  <div on:touchstart="touchstartfunc"></div>
  <!-- 绑定事件回调函数，但阻止事件向上传递 -->
  <div grab:touchstart.bubble="touchstartfunc"></div>
  <!-- 绑定事件回调函数，但阻止事件向下传递 -->
  <div grab:touchstart.capture="touchstartfunc"></div>
  <!-- grab:{event}等价于grab:{event}.bubble -->
  <div grab:touchstart="touchstartfunc"></div>
</div>
```
```javascript
// xxx.js
export default {
  data: {
    text: '',
  },
  clickfunc: function(str, e) {
    console.log(e);
    this.text = str;
  },
  touchstartfunc: function(e) {
    console.log(e);
  }
}
```

### 4.2 数据绑定
数据绑定的形式分两种：数据初始化，数据更新
![数据更新流程](https://img13.360buyimg.com/imagetools/jfs/t1/191060/1/7363/19978/60c079b5Ed456aa7a/25feb40ea02170d4.jpg)
>hml 只支持数据层到视图层的单向数据绑定。
>视图层想改变数据层，只能通过绑定事件的方式实现。

#### 4.1.1 数据初始化
hml 中的数据都来自于对应 js 中的 data 对象，因此在初始化页面时，在 data 对象中写入数据，hml 中就可以通过 {{}} 的形式绑定数据。
```javascript
// xxx.js
export default {
  data: {
    text: 'HELLO WORLD'
  }
}
```
```html
<!-- xxx.hml -->
<div>{{text}}</div>
```
#### 4.1.2 数据更新
通过为页面元素绑定事件，可以调用方法更新数据，从而触发视图更新数据
``` javascript
// xxx.js
export default {
  data: {
    text: 'HELLO WORLD'
  },
  changeText: function() {
    this.$set('text', '你好，世界');
  }
}
```
```html
<!-- xxx.hml -->
<div @click='changeText'>{{text}}</div>
```

### 4.3 列表渲染
hml 中需要进行列表渲染的话只需在组件上添加 for 属性并绑定需要渲染的数据，同时可自定义变量和索引的名称：
```javascript
// xxx.js
export default {
  data: {
    array: [
      {id: 1, name: '老周', age: 28}, 
      {id: 2, name: '老李', age: 29},
    ],
  },
  changeText: function(val, index) {
    if (val === "老李"){
      this.array.splice(index, 1, {id:2, name: '老王', age: 30});
    } else {
      this.array.splice(index, 1, {id:3, name: '老郑', age: 31});
    }
  },
}
```
```html
<!-- xxx.hml -->
<div class="array-container">
  <!-- div列表渲染 -->
  <!-- 默认$item代表数组中的元素, $idx代表数组中的元素索引 -->
  <div for="{{array}}" tid="id" onclick="changeText($item.name, $idx)">
    <text>{{$idx}}.{{$item.name}}</text>
  </div>
  <!-- 自定义元素变量名称 -->
  <div for="{{value in array}}" tid="id" onclick="changeText(value.name, $idx)">    
    <text>{{$idx}}.{{value.name}}</text>
  </div>
  <!-- 自定义元素变量、索引名称 -->
  <div for="{{(index, value) in array}}" tid="id" onclick="changeText(value.name, index)">    
    <text>{{index}}.{{value.name}}</text>
  </div>
</div>
```
>数组中的每个元素必须存在 tid 指定的数据属性，且必须具有唯一性。
>针对数组内的数据修改，请使用 splice 方法生效数据绑定变更

### 4.4 条件渲染
hml 中实现条件渲染有两种方式，分别是为组件添加 if/elif/else 或 show 属性，它们的区别在于 if/elif/else 属性不符合条件判断则不会在 vdom 中构建，而 show 属性为 false 时虽然不会渲染，但是会在 vdom 中构建，只是设置了 display 样式为 none。

因此出于性能因素考虑，显示隐藏状态需要频繁切换推荐使用 show，显示状态改变次数较少则使用 if/elif/else。
```javascript
// xxx.js
export default {
  data: {
    show: false,
    display: true,
    visible: false
  },
  toggle: function() {
    this.visible = !this.visible;
  }
}
```
```html
<!-- xxx.hml -->
<div class="container">
  <text if="{{show}}"> 你好，世界 </text>
  <text elif="{{display}}"> hi </text>
  <text else> Hello World </text>
  
  <button class="btn" type="capsule" value="toggle" onclick="toggle"></button>
  <text show="{{visible}}" > Hello World! </text>
</div>
```
>当使用 if/elif/else 写法时，节点必须是兄弟节点，否则编译无法通过
>禁止在同一个元素上同时设置 for 和 if 属性

### 4.4 逻辑控制块
hml 中提供了 <block> 控制块，它不会被当作真实的节点编译，但是只支持 for 和 if 属性。

### 4.5 自定义组件
HML 可以通过 element 标签引用模板文件，通过它可以实现自定义组件。
```html
<!-- template.hml -->
<div class="item"> 
  <text>Name: {{name}}</text>
  <text>Age: {{age}}</text>
</div>
```
```html
<!-- index.hml -->
<element name='man' src='../../common/template.hml'></element>
<div>
  <man name="老朱" age="28"></man>
</div>
```
其中 element 标签的 name 属性则为自定义组件的名称，src 属性为自定义组件相对该文件的路径，可以为自定义组件标签添加属性向其传递数据，自定义组件内也可使用 `$emit` 方法向父组件传递参数。

## 五、JS语法
鸿蒙中的 js 文件支持 ES6 语法。

### 5.1 引用
鸿蒙中可以使用 import 方法引入功能模块或 js 代码：
```javascript
import router from '@system.router'
import utils from '../../common/utils.js'
```

### 5.2 获取app对象
在页面中可以使用 `this.$app.$def` 获取在 app.js 中暴露的对象。
```javascript
// app.js
export default {
  onCreate() {
    console.info('App onCreate');
  },
  onDestroy() {
    console.info('App onDestroy');
  },
  globalData: {
    appData: 'appData',
    appVersion: '2.0',
  },
  changeAppVer () {
    this.globalData.appVersion = '3.0';
  }
};
```
```javascript
// index.js
export default {
  data: {
    appData: 'localData',
    appVersion:'1.0',
  },
  onInit() {
    this.appData = this.$app.$def.globalData.appData;
    this.appVersion = this.$app.$def.globalData.appVersion;
  },
  pageMethod() {
    this.$app.$def.changeAppVer();
  }
}
```

### 5.3 页面对象

| 属性 | 类型 | 描述 |
| --- | --- | --- |
| data | Object/Function | 页面的数据模型 |
| $refs | Object | 持有注册过 ref 属性的 DOM 元素或子组件实例的对象 |
| props | Array/Object | props 用于接收父组件传递过来的参数 |
| computed | Object | 计算属性，用于在读取或设置进行预先处理，计算属性的结果会被缓存 |
| private | Object | 页面的数据模型，private 下的数据属性只能由当前页面修改 |
| public | Object | 页面的数据模型，public 下的数据属性的行为与 data 保持一致 |

### 5.4 方法
#### 5.4.1 数据方法
| 属性 | 类型 | 参数 | 描述 |
| --- | --- | --- | --- |
| $set | Function | key: string, value: any | 添加新的数据属性或者修改已有数据属性。用法：this.$set('key',value)。 |
| $delete | Function | key: string | 删除数据属性。用法：this.$delete('key')。 |

```javascript
export default {
  data: {
    appInfo: {
      OS: 'HarmonyOS',
      Version: '2.0',
    },
  },
  changeAppInfo() {
    this.$set('appInfo.Version', '3.0');
    console.log(this.appInfo);
    this.$delete('appInfo');
    console.log(this.appInfo);
  }
}
```
#### 5.4.2 事件方法
鸿蒙中可以使用 $watch 方法观察 data 中的属性变化，如果属性值改变，则会触发绑定的事件。
```javascript
export default { 
  props: ['title'],
  onInit() {
    this.$watch('title', 'onPropChange');
  },
  onPropChange(newV, oldV) {
    console.info('title属性由'+ oldV +'变化为' + newV);
  },
}
```
### 5.5 路由
```json
{
  "pages": [
    "pages/index/index",
    "pages/detail/index"
  ]
}
```

鸿蒙 app 中页面的路由信息保存在 src > main > config.json 文件中的 pages 内，引入 @system.router 后，调用其 push 方法传入需要跳转页面的 uri，即可完成跳转，也可使用其 back 方法回到首页。
```javascript
import router from '@system.router';
export default {
  launch() {
    router.push ({
      uri: 'pages/detail/index',
    });
  },
  goBack() {
    router.back();
  }
}
```
## 六、CSS语法
CSS 是描述 HML 页面结构的样式语言，所有组件均存在系统默认样式，也可在页面 CSS 样式文件中对组件、页面自定义不同的样式。

### 6.1 尺寸单位
鸿蒙中尺寸单位有两种，px(逻辑像素) 以及百分比。
```json
{
  "window": {
    "designWidth": 720,
    "autoDesignWidth": false
  }
}
```

逻辑像素的配置在 src > main > config.json 文件中的 window 内，designWidth 为屏幕的逻辑宽度，默认为720px，实际显示时会将页面布局缩放至屏幕实际宽度，如100px在实际宽度为1440物理像素的屏幕上，实际渲染为200物理像素。

当 autoDesignWidth 设置为 true 时，逻辑像素 px 将按照屏幕密度进行缩放，如 100px 在屏幕密度为3的设备上，实际渲染为300物理像素。

而百分比单位表示该组件占父组件尺寸的百分比，如组件的 width 设置为50%，代表其宽度为父组件的50%。

### 6.2 样式导入
CSS 样式文件支持 @import 语句，导入 CSS 文件。
```css
@import '../../common/style.css';
```
## 七、总结
使用鸿蒙的 JS SDK 开发 App，整体的项目结构、生命周期以及开发流程很像微信的小程序，而 hml 和 JS 的语法又很像 Vue，整个流程走下来，感觉对 web 开发者而言还是很友好的，相信有 Web 前端开发基础的小伙伴们都可以快速的上手。

由于篇幅有限，文中还有很多没有提到的鸿蒙赋予开发者的硬件调用能力，希望鸿蒙可以越做越好，让越来越多的开发者和用户加入到鸿蒙的大生态中来。

## 八、参考
* [HarmonyOS Developer](https://developer.harmonyos.com/cn/documentation)