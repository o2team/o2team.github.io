title: 如何优雅地在Storyboard中设置圆角
subtitle: 在Storyboard中设置圆角的正确打开方式~
cover: //img.aotu.io/MarkLin/cornerRadius/CornerRadius.png
categories: 移动开发
tags:
  - iOS
  - Swift
author:
  nick: Marklin
  github_name: marklin2012
date: 2016-03-29 16:56:03
---
项目中经常遇到一些设计使用圆角，不得不说这样的设计经常能够为App的视图润色不少！
<!-- more -->
### 通常做法 
对于代码党来说，很简单的加上一行代码就能够搞定：

```
	view.layer.cornerRadius = 5

```

对于 Storyboard 狂魔，一般情况下，很多人会先把视图拉一个 IBOutlet 然后再到 `awakeFromeNib:` 或者 `viewDidLoad:` 方法中去设置圆角，代码如下：

```
	@IBOutlet weak var customView: UIView!
	
    override func viewDidLoad() {
        super.viewDidLoad()
        customView.layer.cornerRadius = 5
    }

```

但是对代码有一定洁癖的强迫症患者来说，这样的做法经常是要命的！实在无法忍受一个小小圆角都不能在IB中设置，需要另外单独加一行代码来完成，违背了低耦合，高内聚的原则。有人马上提出建议，那就使用IB的运行时属性（Runtime Attributes），有些新手可能对它还不太熟悉：

![IB的运行时属性设置](http://mark2012.qiniudn.com/runtime_attributes.png)

这的确也是个不错的方法，可以达到高内聚的效果。不过用过的人都知道，很容易就把 keyPath 拼写错，而且由于这个设置和其他属性的设置分开，可读性可以说很差很差。那有没有什么好的方法呢？

### 最佳实践

Xcode6之后运行时属性升级到了 **@IBInspectable** ，利用这个我们可以给 UIView 添加一个属性，然后就可以在IB中进行设置，例如我们想给 **ViewController** 添加一个数值到IB中设置，在上述代码的最前面插入代码：

```
@IBInspectable var customNumber: Int?

```
然后我们就能在属性检查器上看到如图所示内容，很容易地对数值进行设置:

![自定义属性设置](http://mark2012.qiniudn.com/custom_number.png)


> **@IBInspectable** 还支持以下类型属性：
> 
* **Boolean**
* **Number**
* **String**
* **Point**
* **Size** 
* **Rect**
* **Range**
* **Color**
* **Image**
* **nil**


回到正题，我们视图的圆角该怎么实现呢？也许你们马上想到了继承，实现一个 **UIView** 的基类，基类中添加圆角的 **@IBInspectable** 属性。但这样你马上嗅到了不好的味道，你所有想要使用该属性的视图都要继承自该基类，那岂不是更加麻烦！

其实最好的解决方法你应该心里有数，如果说在 Object-C 中给已有的类添加方法，你肯定马上能想到 **Category** ！不过可能有些人还没不清楚应该如何在 **Category** 中添加属性。由于这里我们用的是 Swift ，稍后我们再说OC中应该如何实现。 Swift 中应该使用 **extension** 来对 **UIView** 进行扩展，并且我们需要添加 **@IBInspectable** 来扩展属性，所以我们需要同时实现 **setter & getter** ，创建一个命名为 `UIView+O2CornerRadius.swift` 的文件，代码如下：

```
import UIKit

extension UIView {
    @IBInspectable var cornerRadius: CGFloat {
        get {
            return layer.cornerRadius
        }
        // also  set(newValue)
        set {
            layer.cornerRadius = newValue
        }
    }
}

```

只需要如此简单地添加一个扩展，不需要 **import** ，不必任何多余代码，我们就可以非常非常方便地在任意IB的属性检查器中对圆角进行设置了！这不就是我们梦寐以求的解耦吗？！！:)


![自定义圆角属性设置](http://mark2012.qiniudn.com/corner_radius.png)

实际上， **@IBInspectable** 是对运行时的一种扩展，你所有的设置都会在上述提到的运行时属性（Runtime Attributes）有所体现。

### 接下来做什么？

我们还可以增加很多内容的扩展，例如阴影、边框、边框颜色等等！学会了这样的奇淫技巧，还不赶紧到你的项目中去实践！

说说 Object-C 的代码实现，我们使用 **Category** 同样需要同时实现 **setter & getter** :

```
//UIView+O2CornerRadius.h
@interface UIView (O2CornerRadius)
 
@property (nonatomic, assign) IBInspectable CGFloat cornerRadius;
 
@end
```

```
//UIView+O2CornerRadius.m
@implementation UIView (O2CornerRadius)
 
- (void)setCornerRadius:(CGFloat)cornerRadius
{
    self.layer.cornerRadius = cornerRadius;
}
 
- (CGFloat)cornerRadius
{
    return self.layer.cornerRadius;
}
@end
```