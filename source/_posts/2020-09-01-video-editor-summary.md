title: 羚珑视频编辑器开发总结
subtitle: 羚珑视频编辑器简化视频制作步骤,实现丰富的动态效果设计
cover: http://img14.360buyimg.com/ling/s900x383_jfs/t1/117598/19/16824/638806/5f4de7e3E9df6c5cb/7cf1b6118eec8bce.png
categories: Web开发
tags:
  - web
  - 视频编辑器
author:
  nick: 凹凸曼-大力士
date: 2020-09-01 14:36:00
wechat:
  share_cover: http://img14.360buyimg.com/ling/s900x544_jfs/t1/128241/13/11440/853163/5f4de7e3E7b373079/1da4131643707dea.png
  share_title: 羚珑视频编辑器开发总结
  share_desc: 羚珑视频编辑器简化视频制作步骤,实现丰富的动态效果设计
---

## 项目背景

羚珑平台在静态类的设计中，已经取得了相应的成绩。在这个基础上结合当前大环境，我们认为可以去做一些动态类的设计，将动画和音效转化为可储存，可移植，可复用的数据。从而用户进行创作的时候，可以通过相对很简单的方式去使用这些高品质的动画和效果。

## 视频编辑器解决了什么问题？

视频编辑器的主要作用是用户可以通过操作静态的PSD从而得到我们想要的动态设计效果。对比AE等复杂的视频编辑软件，学习成本大大降低，且动效的可复用性、移植性等也减轻了用户的工作量。

以下为设计效果：
![示例](http://storage.360buyimg.com/ling-sck-video/demo.gif)

## 开发实录

### 如何让你的静态PSD"动"起来？

参考 AE 的制作动画的过程，首先会预设剧本和分镜，其次规划好分镜中的镜头如何运动，角色如何运动，以及处理和规划素材。我们可以提炼出几个关键点：多场景、镜头移动（即场景整体的动效）、规划素材（图层内容出现时刻及时间长短灵活可控）
视频编辑器操作主要涉及功能点如下：
* 多场景的切换与转场效果的融合，使视频效果更加生动灵活；
* 场景动效以及动效参数的设置，减少了同类型动效的开发（如位移动效合并为一个），也打开了设计师对动效使用的想象力，收获额外的视频效果；
* 图层操作，调整出现时刻及持续时间；

编辑器界面如下图：
![编辑器](http://storage.360buyimg.com/ling-sck-video/editor.png)

### 状态管理

视频编辑器的实现主要分为 5 个部分，视频预览区、动效添加区、参数编辑区、图层操作区、场景操作区，如下图其他部分的每一个操作都会映射到视频预览区，且各个部分数据共享。除此之外，编辑器的每一步操作都需要被”记住“，便于编辑的人回退、还原其操作。
![结构梳理](http://storage.360buyimg.com/ling-sck-video/operation.png)

经分析会涉及到以下场景，如：
* 预览区组件的状态需要共享
* 其他操作区的变动会改变预览区组件的状态
* 组件状态都需要可撤销/还原

我们可以采用 redux 集中管理状态以减少组件之间的数据流传递；对于撤销还原功能，我们可以采用 redux-undo，根据现有的 **reducer** 和配置对象，增强现有其撤消还原功能。
```
import ReduxUndo from 'redux-undo'
//定义原有的 reducer
const editReducer = (state = null, action) => {
  switch (action.type) {
    case VIDEO_INIT: {
       const { templates } = action.payload
       return { templates }
    }
    case VIDEO_TPL_CLEAR: {
      return {}
    }
}

//通过 ReduxUndo 增强 reducer 的可撤销功能
export const undoEditReducer = ReduxUndo(editReducer, {
  initTypes: [VIDEO_TPL_CLEAR],
  filter: function filterActions (action, currentState, previousHistory) {
    const { isUndoIgnore = false } = action
    return !isUndoIgnore
  },
  groupBy: groupByActionTypes([SOME_ACTION]),
  /*
  自定义分组
  groupBy:(action, currentState, previousHistory) => {
    
  },
  */
})
```

**参数说明**
* **initTypes**：历史记录将根据初始化操作类型进行设置（重置)
* **filter**：过滤器, 可以帮助过滤掉不想在撤消/重做历史中包含的操作；
* **groupBy**：可以通过默认的 groupByActionTypes 方法将动作组合为单个撤消/重做步骤。也可以实现自定义分组行为，如果返回值不为 null，则新状态将按该返回值分组。如果下一个状态与上一个状态归为同一组，则这两个状态将在一个步骤中归为一组；如果返回值为 null，则 redux-undo 不会将下一个状态与前一个状态分组。

使用 store.dispatch() 和 Undo/Redo Actions 对你的状态执行撤消/重做操作
```
import { ActionCreators } from 'redux-undo'
export const undo = () => (dispatch, getState) => {
  dispatch(ActionCreators.undo())
}
export const redo = () => (dispatch, getState) => {
  dispatch(ActionCreators.redo())
}
export const recovery = () => (dispatch, getState) => {
  dispatch(ActionCreators.jumpToPast(0))
  dispatch(ActionCreators.clearHistory())
}
```

**总结**

对于状态管理，首先我们可以从以下几点考虑是否需要引入redux、mobx等工具:
* 状态是否被多个组件或者跨页面共享；
* 组件状态需要跨越生命周期；
* 状态需要如持久化，可恢复/撤销等操作。
在使用redux管理状态时，避免将所有状态抽离至redux store中，如
* 组件的私有状态；
* 组件状态传递层级较少；
* 当组件被unmount后可以销毁的数据等
原则上是能放在组件内部就放在组件内部。其次为了状态的可读性和可操作性，在状态结构设计前，需要理清楚各个数据对象的关系，平衡数据获取及操作复杂度，推荐扁平化数据结构以减少嵌套和数据冗余。

### 图层交互

在使用编辑器的过程中，图层的交互操作是最多最频繁的，我们参考了常用的客户端视频编辑软件 AE、Final Cut 的交互，尽可能在 Web 上提供用户操作的便利性及图层可视化，具体效果如下：
![图层结构](http://storage.360buyimg.com/ling-sck-video/layer-action.gif)

梳理图层操作需求，主要包含：
* 图层轨道需要伸缩 （ 调整图层持续时间
* 图层上的动效轨道可以单独伸缩（ 调整动效持续时间
* 图层轨道需要左右移动，且动效轨道跟随移动（调整出现的时刻
* 动效轨道可以单独左右移动 （调整动效出现的时刻
* 不同图层轨道可以上下调整顺序，动效轨道跟随图层轨道移动 （调整图层顺序
* 拖动时显示不同的外观

初始的时候首先考虑到需要移动图层顺序，我们基于 react-sortable-hoc 实现了基本的图层顺序拖曳移动 , 但是对于图层的拉伸、左右拖动处理需要自定义鼠标事件进行处理，并需要自定义计算控制图层的移动，而且最初没有考虑到拖动过程中拖动源的外观需要调整，最终，我们放弃这种实现。我们需要一个可定制化程度更高的拖曳组件，经过一番比较后，我们最终选定了 [react-dnd](https://react-dnd.github.io/react-dnd/about) 拖拽组件，查看其官方说明：
> 可帮助您构建复杂的拖放界面，同时保持组件的分离；且适用于拖动时在应用程序的不同部分之间传输数据，更完美的是组件可以响应拖放事件更改其外观和应用程序状态。

详细说明下，react-dnd  建立在 HTML5 拖放 API 之上,它可以对已拖动的 DOM 节点进行屏幕快照，并直接将其用作“拖动预览”, 简化了我们在光标移动时进行绘制的操作。不过，HTML5 拖放 API 也有一些缺点。它在触摸屏上不起作用，并且在 IE 上提供的自定义机会少于其他浏览器。这就是为什么在 react-dnd  中以可插入方式实现 HTML5 拖放支持的原因，你也可以不使用它，根据触摸事件，鼠标事件等自己来编写其他实现。

下面，我们从外到内，介绍基本的实现。

### 场景层面

引入所需组件

```
import { DndProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
```

将 DndProvider 放在整个场景的外层，设置 backend 为 HTML5Backend
```
<DndProvider backend={HTML5Backend}> 
  <TemplateViewer   // ----- 单个场景展示组件
    template={tpl}
    handleLayerSort={handleLayerSort}
    onLayerDrop={onLayerDrop}
    onLayerStretch={onLayerStretch}
  />
  <CustomDragLayer />  // --- 自定义拖拽预览图层
</DndProvider>

```


<TemplateViewer /> 里包含不同类型的图层组件。每个图层组件都提供一个纯渲染组件的方法 renderLayerContent，大致结构如下：

```
export function renderLayerContent (layer) {
  return <div style={{...}}>...</div>
}

export default function XxxxLayerComponent (layer) {
  ...
  return <div>{renderLayerContent(layer)}</div>
}
```

<CustomDragLayer /> 里根据当前拖拽的对象的组件类型，调用相应 renderLayerContent 绘制拖拽可视内容，以实现拖拽前后的视图一致。


### 图层层面

![左右拖动](http://storage.360buyimg.com/ling-sck-video/layer.png)
图层可以上下拖动，也可以左右拖动，意味它本身即是拖拽源，也是放置的目标。

为了区分拖拽的目的，我们定义了两个拖拽源
```
  const [{ isHorizontalDragging }, horizontalDrag, preview] = useDrag({
    item: {
      type: DragTypes.Horizontal,
    },
    collect: monitor => ({
      isHorizontalDragging: monitor.isDragging(),
    }),
  })
  const [{ isVerticalDragging }, verticalDrag, verticalPreview] = useDrag({
    item: {
      type: DragTypes.Vertical,
    },
    collect: monitor => ({
      isVerticalDragging: monitor.isDragging(),
    }),
  })
```

在放置处理中根据拖拽类型进行判断处理
```
  const [, drop] = useDrop({
    accept: [DragTypes.Horizontal, DragTypes.Vertical],
    drop (item, monitor) {
      // 处理左右拖动
    },
    hover: throttle(item => {
      // 处理上下排序
    }, 300),
  })
```

将定义好的拖动源和放置目标关联 DOM 。最外层 DIV 为图层可拖动区域即放置目标，然后依次为水平拖拽层，垂直拖拽层
  ```
  <div ref={drop}> // --- 放置目标 DOM
    <div ref={verticalPreview}>

      <div ref={horizontalDrag}> // --- 水平拖拽 DOM
      
        <div ref={verticalDrag}> // --- 垂直拖拽 DOM
          <Icon type='drag'/>
        </div>

        /* 图层内容展示 */
        <div>{renderLayerContent(layer)}</div>
      </div>
    </div>
  </div>
  ```

以上关于图层上下拖动、左右拖动的大体框架已经实现。

上下拖动排序时，为了拖动过程中不展示拖动源只保留生成的屏幕快照，可以根据当前的拖动状态将拖动源的透明度设置为 0 

![上下移动](http://storage.360buyimg.com/ling-sck-video/ver-cover.gif)
```
<div ref={drop}> // --- 放置目标 DOM
  <div
    ref={verticalPreview}
    style={{ opacity: isVerticalDragging ? 0 : 1 }}
  >
   ...
  </div>
</div>

```
水平拖动时，设置拖动源半透明，处理方式与上下拖动时同理。
![水平拖动](http://storage.360buyimg.com/ling-sck-video/hor-cover.png)

### 图层内

图层内有两个区域，下方区域可通过左右两端的操作点进行拉伸，上方区域可以在下方区域的宽度内左右移动以及同样通过左右两端的操作点进行拉伸。
移动的实现方式前面已经介绍过就不重复了，针对拉伸的操作，我们封装一个 Stretch 类来统一处理
```
function Stretch ({
  children,
  left,
  width,
  onStretchEnd,
  onStretchMove,
}) {
  function handleMouseDown (align) {
    // 计算偏移
  }

  return (
    <div>
      {children}
      <div
        className={classnames(styles.stretch, styles.stretchHead)}
        onMouseDown={handleMouseDown('head')}
      />
      <div
        className={classnames(styles.stretch, styles.stretchEnd)}
        onMouseDown={handleMouseDown('end')}
      />
    </div>
  )
}
```

将需要支持拉伸的区域作为作为 Stretch 的 children 传递进来
```
<div>
  <div>
    {motions.map((motion, i) => <Stretch key={i}>{/* 上方某个区域 */}</Stretch>)}
  </div>
  <div>
    <Stretch>{/* 下方区域 */}</Stretch>
  </div>
</div>
```

## 体验优化

### 添加快捷键

整个编辑器内容比较的多，对频繁的操作，我们可以保留常用快捷键的操作习惯。如空格播放、delete 删除等等，该功能我们可以使用 react-hot-keys 实现。

首先引入该快捷键库，然后指定绑定的快捷键，添加事件处理。
```
import Hotkeys from 'react-hot-keys'

<Hotkeys
  keyName='space'
  onKeyDown={(keyName, e) => {
    e.preventDefault()
    play()
  }}
/>
```

### 文本转 SVG

另外图层内容展示时有个小技巧，产品需求中文案图层平铺展示。可怜我最初竟然是通过文本长度以及轨道长度计算出文本展示次数，然后再放到 push 到节点中。经大佬改造后才明白可以将文本转化为 SVG 然后以背景图展示，真香！
```
<div
  className={styles.contentText}
  style={{
    backgroundImage: `url("data:image/svg+xml;utf8,
      <svg xmlns='http://www.w3.org/2000/svg' version='1.1'     width='${size(layer.text) * 12 + 15}px' height='35px'>
      <text x='10' y='22' fill='black' font-size='12'>
      ${layer.text}
      </text>
      </svg>")`,
      }}
/>
```
实现效果：
![文本](http://storage.360buyimg.com/ling-sck-video/text-bg.png)

## 项目总结

本文讲述了视频编辑器中操作区主要模块的处理。关于状态管理，我们主要需要明确引入管理工具的是否必要以及使用状态管理工具后是否所有状态都必须移入store中等等。另外对于复杂的图层拖拽功能，要像剥洋葱一样，先层层拆解，从而层层完善其结构。
对项目而言，拿到需求后，我们从整体到局部进行分析，优先确定整体的框架、核心功能的实现方式等，进而考虑如何提高用户体验度。需求分清主次，以便于我们排列优先级从而开发提高效率。