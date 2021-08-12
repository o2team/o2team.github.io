title: 说一说glTF文件压缩
subtitle: 对glTF文件压缩的细致探索、调研与沉淀
cover: https://img14.360buyimg.com/ling/jfs/t1/196774/14/17558/274778/61148241Eef6781b9/a5d5958503227c9b.jpg
categories: 性能优化
tags:
  - glTF
  - 3D模型
  - Three.js
author:
  nick: 赛米老冯
  github_name: sm450203924
date: 2021-08-12 18:17:44
wechat:
  share_cover: https://img12.360buyimg.com/ling/jfs/t1/180178/36/18881/189157/61148e16E55cfbfc8/6d7a392aac0e37a3.jpg
  share_title: 说一说glTF文件压缩
  share_desc: 对glTF文件压缩的细致探索、调研与沉淀
---

# 引言

最近做T级互动，需要使用到3D模型。相信大家和我一样，在开始着手的时候，一定会有这么些问题：
- 1. 如何选择3D模型的导出格式
- 2. 如何对模型文件进行优化
- 3. 在大流量的项目中兼容性怎么样

让我们通过这篇文章，进行细致的探索、调研与沉淀。

<br>

# 一、什么是 glTF 文件

[glTF](https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_002_BasicGltfStructure.md) 全称 `Graphics Language Transmission Format`，是三维场景和模型的标准文件格式。

glTF 核心是 JSON 文件，描述了 3D 场景的整个内容。它由场景结构本身的描述组成，其由定义场景图的节点的层次提供。

场景中出现的 3D 对象是使用连接到节点的 meshes(网格)定义的。Materials(材料)定义对象的外观。Animations(动画)描述 3D 对象如何随着时间的推移转换 3D 对象，并且 Skins(蒙皮)定义了对物体的几何形状的方式基于骨架姿势变形。Cameras(相机)描述了渲染器的视图配置。

除此以外，它还包括了带有二进制数据和图像文件的链接，如下图所示。

![](https://img10.360buyimg.com/ling/jfs/t1/179193/35/16309/138667/6100070eEad5e98cb/4ab767127cee7ba1.png)

<br>

# 二、.gltf 与.glb


从 blender 文件导出中可以看出：
![](https://img14.360buyimg.com/ling/jfs/t1/177735/6/16223/22815/6100078bE37353a34/c23da3f79fb85d7c.png)

glTF 文件有两种拓展形式，.gltf（JSON / ASCII）或.glb（二进制）。.gltf 文件可能是自包含的，也可能引用外部二进制和纹理资源，而 .glb 文件则是完全自包含的（但使用外部工具可以将其缓冲区/纹理保存为嵌入或单独的文件，后面会提到）。


## 2.1 .glb文件产生原因

glTF 提供了两个也可以一起使用的交付选项：

- glTF JSON 指向外部二进制数据（几何、关键帧、皮肤）和图像。
- glTF JSON 嵌入 base64 编码的二进制数据，并使用数据 URI 内联图像。

对于这些资源，由于 base64 编码，glTF 需要单独的请求或额外的空间。Base64 编码需要额外的处理来解码并增加文件大小（编码资源增加约 33%）。虽然 gzip 减轻了文件大小的增加，但解压缩和解码仍然会增加大量的加载时间。

为了解决这个问题，引入了一种容器格式 Binary glTF。在二进制 glTF 中，glTF 资产（JSON、.bin 和图像）可以存储在二进制 blob 中，就是[.glb 文件](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification)。

## 2.2 文件对比

### 2.2.1 同一个glTF文件，.glb格式要比.gltf小

* 自包含的：

![](https://img13.360buyimg.com/ling/jfs/t1/198039/31/252/23955/61010eb1Ef7d93f7c/8f1b9d1b2b0c4ec8.png)

* 引用外部二进制和纹理资源的：

![](https://img20.360buyimg.com/ling/jfs/t1/193972/30/15415/57650/61016ac5E3adc4bab/04232a7e01d48261.png)


### 2.2.2 .gltf文件预览：

* 自包含的：

![](https://img12.360buyimg.com/ling/jfs/t1/191592/21/15452/198430/610127cbE0a2c3de4/a66f5b7f3ef4c60c.png)

* 引用外部二进制和纹理资源：

![](https://img10.360buyimg.com/ling/jfs/t1/191802/32/15331/237180/61012c8bE4d6e6601/cc0cc6475c240a3a.png)

### 2.2.3 glb文件预览：

* 自包含的：

![](https://img14.360buyimg.com/ling/jfs/t1/186726/14/15610/469896/610127cbE722452de/7d38e745352525e7.png)

* 引用外部二进制和纹理资源：

![](https://img13.360buyimg.com/ling/jfs/t1/185262/26/16423/228270/61012d77Ed999b432/64902757665247bd.png)

从图中可以看到，当非自包含型的时候，请求glTF文件时，会一同请求图片文件。

那么，我们就可以利用这个特性，就可以实现一些性能优化，让我们往下继续。

<br>

# 三、glTF 文件拆分

上文提到，glTF文件可以拆分为.gltf/.glb文件+二进制文件+纹理图片，那么，我们就可以**将其拆分出来，并对纹理图片进行单独的压缩**，来进行性能的优化。

可以使用`gltf pipeLine` ，其具有以下功能：
- glTF 与 glb 的相互转换
- 将缓冲区/纹理保存为嵌入或单独的文件
- 将 glTF 1.0 模型转换为 glTF 2.0(使用`KHR_techniques_webgl`和`KHR_blend`)
- 使用 Draco 进行网格压缩

在这里，我们是要使用“将缓冲区/纹理保存为嵌入或单独的文件”这个功能。


让我们来看看拆分出来的文件
![](https://img11.360buyimg.com/ling/jfs/t1/190980/33/15243/71472/610025ceEa127835e/2dc97fb7baacd11b.png)

再回顾一下，.glb文件是这么引入外部单独的纹理与二进制文件的

![](https://img11.360buyimg.com/ling/jfs/t1/196317/6/15181/279070/610026a1E73e2f2ec/43cf8189eaf71e0a.png)

所以，只要将拆分出来的这几个文件，**放入同一个路径中**，然后像之前那样引入就好了。

- 压缩方式

```
gltf-pipeline -i male.glb -o male-processed.glb -s
```

- 使用方式（在 Three.js 中）
普普通通地用就好了，和不拆分的没什么区别

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()
loader.load(MODEL_FILE_PATH, (gltf) => {
 // ....
})
```

- 性能对比

![](https://img14.360buyimg.com/ling/jfs/t1/193725/15/15359/106576/6100f47aEab2b5aa6/f60d06eeffd12af9.png)

<br>

# 四、glTF 文件压缩

如上面介绍，glTF 文件包括.gltf/.glb 文件、.bin 文件以及纹理资源。glTF2.0 相关的插件主要有以下：
![](https://img11.360buyimg.com/ling/jfs/t1/171882/17/21087/94136/60fa727dEf1889b4c/41b4bbfe5350f51d.png)

那么我们从中取一些来分析一下。

<br>

## 4.1 网格压缩

### 4.1.1 [KHR_draco_mesh_compression](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_draco_mesh_compression/README.md)

最**常见**的一种网格压缩方式，采用开源的Draco算法，用于压缩和解压缩3D 网格和点云，并且可能会改变网格中顶点的顺序和数量。压缩的使文件小得多，但是在客户端设备上需要**额外的解码时间**。

- 压缩方式

可以使用`gltf-pipeline`gltf 文件优化工具进行压缩

```
gltf-pipeline -i male.glb -o male-processed.glb -d
```

- 使用方式（在 Three.js 中）

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

const loader = new GLTFLoader()

// 创建解码器实例
const dracoLoader = new DRACOLoader()
// 设置解压库文件路径
dracoLoader.setDecoderPath(DECODER_PATH)
// 加载解码器实例
loader.setDRACOLoader(dracoLoader)

loader.load(MODEL_FILE_PATH, (gltf) => {
 // ....
})
```

- 性能分析对比

这个 glb 文件原大小为 3.2M，draco 压缩后为 1.8M，约为原文件的**56%**。

从上面的代码中可以看出，创建解码器实例需要引入额外的库来进行解码，`setDecoderPath`会自动请求 wasm 文件来进行解密操作。而这两个 wasm 文件同时也增加了请求时间和请求数量，那么加上这两个文件，真实的压缩率约为**62.5%**。

![](https://img12.360buyimg.com/ling/jfs/t1/199290/11/23/43731/61000851Eabbc0d2f/84f3bab6f8d0986e.png)

所以，如果一个项目需要加载多个 glTF 文件，那么可以创建一个 DRACOLoader 实例并重复使用它。但如果项目只需要加载一个 glTF 文件，那么使用 draco 算法是否具有“性价比”就值得考量了。

用 demo 进行一下性能对比：

![](https://img14.360buyimg.com/ling/jfs/t1/183590/14/16038/107320/60ffabeaEb8f639d1/8df571643f7cb9a0.png)

可见 draco 算法首次加载和解密时间，要大于原文件。而在**实际**项目中，这个差距更加明显，并且**偶尔会出现解密堵塞的情况**，需要重新进入页面才能恢复功能。


除此以外，还有一个很直观的问题，模型画质的损失是肉眼可观的。

如图，分别是在 iPhone 12 和小米 MIX2 中的样子：
![](https://img20.360buyimg.com/ling/jfs/t1/185103/33/15792/426576/60ffaa2eE61f85824/2b933e4fcbb21e73.png)


总而言之，如果要将 draco 压缩算法运用到大规模项目中，需要结合实际项目进行以下对比：

- (1) 请求两个文件+解密耗时，与本身 glb 文件压缩后的体积大小相比，真实性能对比；
- (2) 画质是否会出现设计师无法接受的损失。

<br>

### 4.1.2 [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)

顶点属性通常使用`FLOAT`类型存储，将原始始浮点值转换为16位或8位存储以适应统一的3D或2D网格，也就是我们所说的quantization向量化，该插件主要就是将其向量化。

例如，静态 PBR-ready 网格通常需要每个顶点`POSITION`（12 字节）、`TEXCOORD`（8 字节）、`NORMAL`（12 字节）和`TANGENT`（16 字节），总共 48 字节。通过此扩展，可以用于`SHORT`存储位置和纹理坐标数据（分别为 8 和 4 字节）以及`BYTE`存储法线和切线数据（各 4 字节），每个顶点总共 20 字节。

- 压缩方式

可以使用`gltfpack`工具进行压缩

```
gltfpack -i male.glb -o male-processed.glb
```

- 使用方式（在 Three.js 中）

普普通通地用就好了，和不压缩的没什么区别
```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loader = new GLTFLoader()
loader.load(MODEL_FILE_PATH, (gltf) => {
 // ....
})
```

- 性能对比

原文件3.2M，压缩后1.9M，为原文件的59.3%，比原模型加载速度也快上不少。
放到实际项目中，没有画质损失和加载时间过长的问题。

![](https://img10.360buyimg.com/ling/jfs/t1/195559/3/15129/104561/60ffb359Eeb874438/a4a4c06d1c93d716.png)

### 4.1.3 [EXT_meshopt_compression](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)

此插件假定缓冲区视图数据针对 GPU 效率进行了优化——使用量化并使用最佳数据顺序进行 GPU 渲染——并在 bufferView 数据之上提供一个压缩层。每个 bufferView 都是独立压缩的，这允许加载器最大程度地将数据直接解压缩到 GPU 存储中。

除了优化压缩率之外，压缩格式还具有两个特性——非常快速的解码（使用 WebAssembly SIMD，解码器在现代桌面硬件上以约 1 GB/秒的速度运行），以及与通用压缩兼容的字节存储。也就是说，不是尽可能地减少编码大小，而是以通用压缩器可以进一步压缩它的方式构建比特流。

- 压缩方式


可以使用`gltfpack`工具进行压缩

```
gltfpack -i male.glb -o male-processed.glb -cc
```

- 使用方式（在 Three.js 中）

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js'

const loader = new GLTFLoader()
loader.setMeshoptDecoder(MeshoptDecoder)
loader.load(MODEL_FILE_PATH, (gltf) => {
 // ....
})
```

- 性能分析对比

原文件3.2M，压缩后1.1M，为原文件的**65.6%**，首次加载时间比原模型快上不少。
放到实际项目中，没有画质损失和加载时间过长的问题。

![](https://img20.360buyimg.com/ling/jfs/t1/188254/23/15144/97195/60ffb710E0253e6bb/684dbca7b0e8c543.png)


# 五、多个机型设备与优化对比结果
为了避免上文提到的“draco”压缩使得模型受损的情况，找了几台iPhone、安卓的手机来进行了一下性能与兼容的测试，让我们看一下结果。
PS：公司网络在不同时间段内网速不同（如上午和下午），可能会对数字产生小部分影响，但不影响文件优化横向对比。

## iPhone 12（iOS 14.4，自用）
![](https://img20.360buyimg.com/ling/jfs/t1/190804/17/15372/370058/6100f1d7Eb6abb5b2/268c3f56d59d2b0d.png)

## Huawei Mate 40 pro （HarmonyOS，自用）

![](https://img11.360buyimg.com/ling/jfs/t1/197347/4/187/339376/6100c8fcE7fa50d08/23d76b487b81fe05.png)

## Xiaomi Mix2（Android 8.0，测试机）

![](https://img11.360buyimg.com/ling/jfs/t1/183693/3/16333/407472/6100c8fcEbb0cf233/43f50b0b8e49480f.png)

## iPhone 6sp （iOS 13.7，自用机）

![](https://img14.360buyimg.com/ling/jfs/t1/182708/17/16210/489566/6100c8fcE2a7d1920/7d25ad55cba38e37.png)

## 5.1 总结
可见，对于小部分需要使用模型的，并且只需要加载一个模型的业务，采用`KHR_mesh_quantization`或`EXT_meshopt_compression`进行网格压缩，再使用`gltf-pipeline`进行模块区分并对纹理图片压缩，是目前找到的较好的优化方案。

<br>

# 六、其他
其实还有很多性能优化的插件，目前正在进行调试和调查，等后续迭代或有什么新进展，会继续更新：

网格优化的：
* [EXT_mesh_gpu_instancing](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_mesh_gpu_instancing/README.md)

  现 Three.js 的 [GLTFLoader](https://github.com/mrdoob/three.js/issues/21937) 尚未支持，Babylon.js 的[BABYLON.GLTF2.Loader.Extensions](https://doc.babylonjs.com/typedoc/classes/babylon.gltf2.loader.extensions.khr_mesh_quantization) 支持

还有一些纹理优化的插件：

- [KHR_texture_basisu](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_texture_basisu/README.md)

- [EXT_texture_webp](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_texture_webp/README.md)

# 七、参考资料
1. [The Basic Structure of glTF](https://github.com/KhronosGroup/glTF-Tutorials/blob/master/gltfTutorial/gltfTutorial_002_BasicGltfStructure.md)

2. [GLB File Format Specification](https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#glb-file-format-specification)

3. [Extensions for glTF 2.0](https://github.com/KhronosGroup/glTF/tree/master/extensions/)

4. [KHR_draco_mesh_compression](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_draco_mesh_compression/README.md)

5. [DRACOLoader – three.js docs](https://threejs.org/docs/#examples/en/loaders/DRACOLoader)

6. [CesiumGS/gltf-pipeline: Content pipeline tools for optimizing glTF assets.](https://github.com/CesiumGS/gltf-pipeline)

7. [KHR_mesh_quantization](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Khronos/KHR_mesh_quantization/README.md)

8. [📦 gltfpack | meshoptimizer](https://meshoptimizer.org/gltf/)

9. [GLTFLoader](https://threejs.org/docs/?q=GLTFLoader#examples/en/loaders/GLTFLoader)

10. [EXT_meshopt_compression](https://github.com/KhronosGroup/glTF/blob/master/extensions/2.0/Vendor/EXT_meshopt_compression/README.md)

11. [【网格压缩测评】MeshQuan、MeshOpt、Draco](https://juejin.cn/post/6931954784018628621)