title: feWorkflow - 使用electron, react, redux, immutable构建桌面App
subtitle: "使用react, redux, immutable框架做ui开发，仍然基于运行gulpfile的方案，这样可以使每个使用自己团队的gulp工作流快速接入和自由调整。"
cover: //img.aotu.io/FqMe96r-4Spj-juPOP-rH50-oaKX
date: 2016-07-05 10:24:35
categories: NodeJS
tags:
  - React
  - Electron
author:
    nick: whatif
    github_name: whatifhappen
coeditor:
    name: whatifhappen
    url: https://github.com/whatifhappen
---

15年初创建了适用于目前团队的gulp工作流，旨在以一个gulpfile来操作和执行所有文件结构。随着项目依赖滚雪球式的增长，拉取npm包成了配置中最麻烦而极容易出错的一项。为了解决配置过程中遇到的种种问题，15年底草草实现了一个方案，用nw.js（基于Chromium和node.js的app执行工具）框架来编写了一个简单的桌面应用[gulp-ui](http://whatifhappen.github.io/GulpUI-WX/), 所做的操作是打包gulpfile和所依赖的所有node_modules在一起，然后简单粗暴的在app内部执行gulpfile。

<!-- more -->

[gulp-ui](http://whatifhappen.github.io/GulpUI-WX/)做出来后再团队中使用了一段时间，以单个项目来执行的方式确实在经常多项目开发的使用环境中多有不便。于是在这个基础上，重写了整个代码结构，开发了现在的版本feWorkflow.

[feWorkflow](http://whatifhappen.github.io/GulpUI-WX/)改用了electron做为底层，使用react, redux, immutable框架做ui开发，仍然基于运行gulpfile的方案，这样可以使每个使用自己团队的gulp工作流快速接入和自由调整。

![feWorkflow](https://sfault-image.b0.upaiyun.com/254/455/2544556661-577b5347d97a0_articlex)

## 功能

### 一键式开发/压缩

- less实时监听编译css
- css前缀自动补全
- 格式化html，并自动替换src源码路径为tc_idc发布路径
- 压缩图片(png|jpg|gif|svg)
- 压缩或格式化js，并自动替换src源码路径为tc_idc发布路径
- 同步刷新浏览器browserSync



## 框架选型

### electron

与 NW.js 相似，Electron 提供了一个能通过 JavaScript 和 HTML 创建桌面应用的平台，同时集成 Node 来授予网页访问底层系统的权限。

使用nw.js时遇到了很多问题，设置和api比较繁琐，于是改版过程用再开发便利性上的考虑转用了electron。

electron应用布署非常简单，存放应用程序的文件夹需要叫做 `app` 并且需要放在 Electron 的 资源文件夹下（在 macOS 中是指 `Electron.app/Contents/Resources/`，在 Linux 和 Windows 中是指 `resources/`） 就像这样：

macOS:

```javascript
electron/Electron.app/Contents/Resources/app/
├── package.json
├── main.js
└── index.html
```

在 Windows 和 Linux 中:

```javascript
electron/resources/app
├── package.json
├── main.js
└── index.html
```

然后运行 `Electron.app` （或者 Linux 中的 `electron`，Windows 中的 `electron.exe`）, 接着 Electron 就会以你的应用程序的方式启动。

##### 目录释义

`package.json`主要用来指定app的名称，版本，入口文件，依赖文件等

```json
{
  "name"    : "your-app",
  "version" : "0.1.0",
  "main"    : "main.js"
}
```

`main.js` 应该用于创建窗口和处理系统事件，官方也是推荐使用`es6`来开发，典型的例子如下：

```javascript
const electron = require('electron');
//引入app模块
const {app} = electron;
// 引入窗口视图
const {BrowserWindow} = electron;
//设置一个变量
let mainWindow;

function createWindow() {
  //实例化一个新的窗口
  mainWindow = new BrowserWindow({width: 800, height: 600});

  //加载electron主页面
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  //打开chrome开发者工具
  mainWindow.webContents.openDevTools();

  //监听窗口关闭状态
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}
//当app初始化完毕，开始创建一个新窗口
app.on('ready', createWindow);

//监听app窗口关闭状态
app.on('window-all-closed', () => {
  //mac osx中只有执行command+Q才会退出app，否则保持活动状态
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  //mac osx中再dock图标点击时重新创建一个窗口
  if (mainWindow === null) {
    createWindow();
  }
});
```

`index.html`则用来输出你的html：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>Hello World!</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    We are using node <script>document.write(process.versions.node)</script>,
    Chrome <script>document.write(process.versions.chrome)</script>,
    and Electron <script>document.write(process.versions.electron)</script>.
  </body>
</html>
```

electron官方提供了一个快速开始的模板：

```javascript
# Clone the Quick Start repository
$ git clone https://github.com/electron/electron-quick-start

# Go into the repository
$ cd electron-quick-start

# Install the dependencies and run
$ npm install && npm start
```

更多入门介绍可以查看这里[Electron快速入门](https://github.com/electron/electron/blob/master/docs-translations/zh-CN/tutorial/quick-start.md).

---------------

### React + ES6

React做为一个用来构建UI的JS库开辟了一个相当另类的途径，实现了前端界面的高效率高性能开发。React的虚拟DOM不仅带来了简单的UI开发逻辑，同时也带来了组件化开发的思想。

ES6做为js的新规范带来了许多新的变化，从代码的编写上也带来了许多的便利性。

一个简单的`react`模块示例：

```javascript
//jsx
var HelloMessage = React.createClass({
  render: function() {
    return <div>Hello {this.props.name}</div>;
  }
});

ReactDOM.render(<HelloMessage name="John" />, document.getElementById('root')));
```

```html
//html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

```html
//实际输出
<div id="root">Hello John</div>
```

通过`React.createClass`创建一个`react`模块，使用`render`函数返回这个模块中的实际html模板，然后引用`ReactDOM`的`render`函数生成到指定的html模块中。调用`HelloMessage`的方法，则是写成一个`xhtml`的形式`<HelloMessage name="John" />`，将`name`里面的"John"做为一个属性值传到`HelloMessage`中，通过`this.props.name`来调用。

当然，这个是未经编译的`jsx`文件，不能实际输出到html中，如果想要未经编译使用`jsx`文件，可以在`html`中引用`babel`的组件，例如：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello React!</title>
    <script src="build/react.js"></script>
    <script src="build/react-dom.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-core/5.8.34/browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/babel">
      ReactDOM.render(
        <h1>Hello, world!</h1>,
        document.getElementById('example')
      );
    </script>
  </body>
</html>
```

自从`es6`正式发布后，`react`也改用了`babel`做为编译工具，也因此许多开发者开始将代码开发风格项`es6`转变。

于是`React.createClass`的方法被取代为es6中的扩展类写法：

```javascript
class HelloWorld extends React.Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}
```

我们可以看到这些语法有了细微的不同：

```javascript
//ES5的写法
var HelloWorld = React.createClass({
  handleClick: function(e) {...},
  render: function() {...},
});

//ES6及以上写法
class HelloWorld extends React.Component {
  handleClick(e) {...}
  render() {...}
}
```



在feWorkflow中基本都是使用ES6的写法做为开发, 例如最终输出的container模块：

```javascript
import ListFolder from './list/list';
import Dropzone from './layout/dropzone';
import ContainerEmpty from './container-empty';
import ContainerFt from './layout/container-ft';
import Aside from './layout/aside';
import { connect } from 'react-redux';

const Container = ({ lists }) => (
  <div className="container">
    <div className="container-bd">
      {lists.size ? <ListFolder /> : <ContainerEmpty />}
      <Dropzone />
    </div>
    <ContainerFt />
    <Aside />
  </div>
);

const mapStateToProps = (states) => ({
  lists: states.lists
});

export default connect(mapStateToProps)(Container);
```

import做为ES6的引入方式，来取代commonJS的require模式，等同于

```javascript
var ListFoder = require('./list/list');
```

输出从`module.export = Container;` 替换成`export default Container;`

这种写法其实等同于：

```javascript
// ES5写法
var Container = React.createClass({
  render: function() { 
    ...
    {this.props.lists.size ? <ListFolder /> : <ContainerEmpty />}
    ...
  },
});
```

`{ lists }`的写法编译成ES5的写法等同于：

```javascript
var Container = function Container(_ref) {
  var lists = _ref.lists;
  ...
}
```

相当于减少了非常多的赋值操作, 极大了减少了开发的工作量。

--------

### Webpack

ES6中介绍了一下编译之后的代码，而每个文件里其实也并没有import必须的react模块，其实都是通过Webpack这个工具来执行了编译和打包。在webpack中引入了`babel-loader`来编译`react`和`es6`的代码，并将css通过`less-loader`,`css-loader`, `style-loader`自动编译到html的style标签中，再通过

```javascript
new webpack.ProvidePlugin({
  React: 'react'
}),
```

的形式，将react组件注册到每个js文件中，不需再重复引用，最后把所有的js模块编译打包输出到`dist/bundle.js`，再html中引入即可。

流程图：

![wepback](https://segmentfault.com/img/bVyPyt)

webpack部分设置：

```javascript
var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  target: 'atom',
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src'),
        loader: require.resolve('babel-loader'),
        ...
      },
   ...
    ]
  },
  ...
};
```

webpack需要设置入口文件`entry`，在此是引入了源码文件夹src中的`index.js`，和一个或多个出口文件`output`，输出devtool`source-map`使得源代码可见，而非编译后的代码，然后制定所需要的`loader`来做模块的编译。

与`electron`相关的一个比较重要的点是，必须指定`target: atom`，否则会出现无法resolve electron modules的报错提示。

更多介绍可以参考[Webpack 入门指迷](https://segmentfault.com/a/1190000002551952)

feWorkflow项目中选用了[react-transform-hmr](https://github.com/gaearon/react-transform-hmr)做为模板，已经写好了基础的`webpack`文件，支持`react`热加载，不再需要经常去刷新electron，不过该作者已经停止维护这个项目，而是恢复维护`react-hot-reload`，现在重新开发[React Hot Loader 3](https://github.com/gaearon/react-hot-loader/pull/240), 有兴趣可以去了解一下。

--------

### Redux

Redux是针对JavaScript apps的一个可预见的state容器。它可以帮助我们写一个行为保持一致性的应用，可以运行再不同的环境中（client，server，和原生），并非常容易测试。

Redux 可以用这三个基本原则来描述：

1. **单一数据源** 

   **整个应用的 state 被储存在一个 object tree 中，并且这个 object tree 只存在于唯一一个 store 中。**

   ```javascript
   let store = createStore(counter) //创建一个redux store来保存你的app中所有state

   //当state更新时，可以使用 subscribe()来绑定监听更新UI，通常情况下不会直接使用这个方法，而是会用view层绑定库（类似react-redux等)。
   store.subscribe(() =>
     console.log(store.getState()) //抛出所有数据
   )
   ```

2. **State是只读的**

   惟一改变 state 的方法就是触发 action，action 是一个用于描述已发生事件的普通对象。

   所有的修改都被集中化处理，且严格按照一个接一个的顺序执行. 而执行的方法是调用`dispatch`。

   ```javascript
   store.dispatch({
     type: 'COMPLETE_TODO',
     index: 1
   });
   ```

3. **使用纯函数来执行修改**

   为了描述 action 如何改变 state tree ，你需要编写 `reducers`。

   `Reducer` 只是一些纯函数，它接收先前的 `state` 和 `action`，并返回新的 `state`。

   ```javascript
   function counter(state = 0, action) {
     switch (action.type) {
     case 'INCREMENT':
       return state + 1
     case 'DECREMENT':
       return state - 1
     default:
       return state
     }
   }
   ```

redux流程图：

![redux](https://segmentfault.com/img/bVyPyi)

-----------

### React-Redux

redux在react中应用还需要加载`react-redux`模块，因为`store`为单一state结构头，我们仅需要在入口处调用react-redux的`Provider`方法抛出`store`

```javascript
render(
  <Provider store={store}>
    <Container />
  </Provider>,
  document.getElementById('root')
);
```

这样，在container的内部都能接收到`store`。

我们需要一个操作store的`reducer`. 当我们的reducer拆分好对应给不同的子组件之后，redux提供了一个`combineReducers`的方法，把所有的`reducers`合并起来:

```javascript
import { combineReducers } from 'redux';
import lists from './list';
import snackbar from './snackbar';
import dropzone from './dropzone';

export default combineReducers({
  lists,
  snackbar,
  dropzone,
});
```

然后通过`createStore`的方式链接`store`与`reducer`：

```javascript
import { createStore } from 'redux';
import reducer from '../reducer/reducer';

export default createStore(reducer);
```

上文介绍`redux`的时候也说过，**state**是只读的，只能通过action来操作，同样我们也可以把`dispatch`映射成为一个props传入Container中。

在子模块中, 则把这个store映射成react的props，再用`connect`方法，把store和component链接起来：

```javascript
import { connect } from 'react-redux'; //引入connect方法
import { addList } from '../../action/addList'; //从action中引入addList方法

const AddListBtn = ({ lists, addList }) => (
  <FloatingActionButton
    onClick={(event) => {
        addList('do something here');
      return false;
      });
    }}
  >;
);
const mapStateToProps = (states) => ({
  //从state.lists获取数据存储到lists中，做为属性传递给AddListBtn
  lists: states.lists
});

const mapDispatchToProps = (dispatch) => ({
  //将addList函数做为属性传递给AddListBtn
  addList: (name, location) => dispatch(addList(name, location));
});

//lists, addList做为属性链接到Conta
export default connect(mapStateToProps, mapDispatchToProps)(AddListBtn);
```

这样，就完成了redux与react的交互，很便捷的从上而下操作数据。

-------

### immutable.js

Immutable Data是指一旦被创造后，就不可以被改变的数据。

通过使用Immutable Data，可以让我们更容易的去处理缓存、回退、数据变化检测等问题，简化我们的开发。

所以当对象的内容没有发生变化时，或者有一个新的对象进来时，我们倾向于保持对象引用的不变。这个工作正是我们需要借助Facebook的 [Immutable.js](https://github.com/facebook/immutable-js)来完成的。

> 不变性意味着数据一旦创建就不能被改变，这使得应用开发更为简单，避免保护性拷贝（defensive copy），并且使得在简单的应用 逻辑中实现变化检查机制等。

```javascript
var stateV1 = Immutable.fromJS({  
users: [
  { name: 'Foo' },
  { name: 'Bar' }
]
});
 
var stateV2 = stateV1.updateIn(['users', 1], function () {  
  return Immutable.fromJS({
    name: 'Barbar'
  });
});
 
stateV1 === stateV2; // false  
stateV1.getIn(['users', 0]) === stateV2.getIn(['users', 0]); // true  
stateV1.getIn(['users', 1]) === stateV2.getIn(['users', 1]); // false
```

feWorkflow项目中使用最多的是`List`来创建一个数组，`Map()`来创建一个对象，再通过`set`的方法来更新数组，例如：

```javascript
import { List, Map } from 'immutable';

export const syncFolder = List([
  Map({
    name: 'syncFromFolder',
    label: '从目录复制',
    location: ''
  }),
  Map({
    name: 'syncToFolder',
    label: '复制到目录',
    location: ''
  })
]);

```

更新的时候使用`setIn`方法，传递`Map`对象的序号，选中`location`这个属性，通过`action`传递过来的新值`action.location`更新值，并返回一个全新的数组。

```javascript
case 'SET_SYNC_FOLDER':
      return state.setIn(['syncFolder', action.index, 'location'], action.location);
```

#### 数据存储:

**存：**

immutable的数据已经不是单纯的json数据格式，当我们要做json格式的数据存储的时候，可以使用`toJS()`方法抛出js对象，并通过`JSON.stringnify()`将js数据转换成json字符串，存入localstorage中。

```javascript
export const saveState = (name = 'state', state = 'state') => {
  try {
    const data = JSON.stringify(state.toJS());
    localStorage.setItem(name, data);
  } catch(err) {
    console.log('err', err);
  }
}
```

**取：**

读取本地的json格式数据后，当需要加载进页面，首先需要把这段json数据转换会immutable.js数据格式，`immutable`提供了`fromJS()`方法，将js对象和数组转换成immtable的`Maps`和`Lists`格式。

```javascript
import { fromJS, Iterable } from 'immutable';

export const loadState = (name = 'setting') => {
  try {
    const data = localStorage.getItem(name);

    if (data === null) {
      return undefined;
    }P

    return fromJS(JSON.parse(data), (key, value) => {
      const isIndexed = Iterable.isIndexed(value);
      return isIndexed ? value.toList() : value.toMap();
    });

  } catch(err) {
    return undefined;
  }
};
```

----------------

## 应用示例

上文介绍了整个feWorkflow的UI技术实现方案，现在来介绍下实际上gulp在这里是如何工作的。

**思路**

我们知道`node`中调用`child_process`的`exec`可以执行系统命令，gulpfile.js本身会调用离自身最近的node_modules，而gulp提供了API可以通过flag的形式(—cwd)来执行不同的路径。以此为思路，以最简单的方式，在按钮上绑定执行状态（dev或者build，包括flag等），通过`exec`直接运行gulp file.js.

**实现**

当按钮点击的时候，判断是否在执行中，如果在执行中则杀掉进程，如果不在执行中则通过`exec`执行当前按钮状态的命令。然后扭转按钮的状态，等待下一次按钮点击。

命令模式如下：

```javascript
const ListBtns = ({btns, listId, listLocation, onProcess, cancelBuild, setSnackbar}) => (
  <div className="btn-group btn-group__right">
    {
      btns.map((btn, i) => (
        <RaisedButton
          key={i}
          className="btn"
          style={style}
          label={btn.get('name')}
          labelPosition="after"
          primary={btn.get('process')}
          secondary={btn.get('fail')}
          pid={btn.get('pid')}
          onClick={() => {
            if (btn.get('process')) {
              kill(btn.get('pid'));
            } else {
              let child = exec(`gulp ${btn.get('cmd')} --cwd ${listLocation} ${btn.get('flag')} --gulpfile ${cwd}/gulpfile.js`,  {
                cwd
              });

              child.stderr.on('data', function (data) {
                let str = data.toString();

                console.error('exec error: ' + str);
                kill(btn.get('pid'));
                cancelBuild(listId, i, btn.get('name'), child.pid, str, true);
                dialog.showErrorBox('Oops， 出错了', str);
              });

              child.stdout.on('data', function (data) {
                console.log(data.toString())
                onProcess(listId, i, btn.get('text'), child.pid, data.toString())
              });

              //关闭
              child.stdout.on('close', function () {
                cancelBuild(listId, i, btn.get('name'), child.pid, '编译结束', false);
                setSnackbar('编译结束');

                console.info('编译结束');
              });
            }
          }}
        />
      ))
    }
  </div>
);
```

`—cwd`把gulp的操作路径指向了我们定义的src路径，`—gulpfile`则强行使用feWorkflow中封装的gulp file.js。我在js中对路径做了处理，以`src`做为截断点，拼接命令行，假设拖放了一个位于`D:\Code\work\vd\lottery\v3\src`下的路径，那么输出的命令格式为:

```javascript
//执行命令
let child = exec(`gulp ${btn.get('cmd')} --cwd ${listLocation} ${btn.get('flag')} --gulpfile ${cwd}/gulpfile.js`)

//编译输出命令：
gulp dev --cwd D:\Code\work\vd\lottery\v3\src --development
```

同时，通过`action`扭转了按钮状态：

```javascript
export function processing(id, index, name, pid, data) {
  return {
    id,
    type: 'PROCESSING',
    btns: {
      index,
      name,
      pid,
      data,
      process: true,
      cmd: name
    }
  };
}
```

调用`dispatch`发送给`reducer`：

```javascript
const initState = List([]);

export default (state = initState, action) => {
  switch (action.type) {
    ...
      case 'PROCESSING':
      return state.map(item => {
        if (item.get('id') == action.id) {
          return item.withMutations(i => {
            i
              .set('status', action.btns.cmd)
              .set('snackbar', action.snackbar)
              .setIn(['btns', action.btns.index, 'text'], action.btns.name)
              .setIn(['btns', action.btns.index, 'name'], '编译中...')
              .setIn(['btns', action.btns.index, 'process'], action.btns.process)
              .setIn(['btns', action.btns.index, 'pid'], action.btns.pid);
          });

        } else {
          return item;
        }
      });
     ...
```

这样，就是整个文件执行的过程。

--------

## 写在最后

这次的改版做了很多新的尝试，断断续续的花了不少时间，还没有达到最初的设想，也还缺失了一些重要的功能。后续还需要补充不少东西。成品确实还比较简单，代码也许也比较杂乱，所有代码开源在[github](https://github.com/whatifhappen/feWorkflow)上，欢迎斧正。

参考资料：

1. [electron docs](https://github.com/electron/electron/tree/master/docs-translations/zh-CN)
2. [babel react-on-es6-plus](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)
3. [webpack](https://webpack.github.io/)
4. [redux](http://redux.js.org/)