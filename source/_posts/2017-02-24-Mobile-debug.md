title: 移动端真机调试指南
subtitle: 图文并茂介绍了几种常用的移动端真机调试方案（多图预警）
cover: //misc.aotu.io/ONE-SUNDAY/MobileDebug/MobileDebug_900x500.jpg
categories: Web开发
tags:
  - 移动端调试
author:
  nick: TH
  github_name: ONE-SUNDAY
wechat:
  share_cover: //misc.aotu.io/ONE-SUNDAY/MobileDebug/MobileDebug_200x200.jpg
  share_title: 移动端真机调试指南
  share_desc: 图文并茂介绍了几种常用的移动端真机调试方案
date: 2017-02-24 14:45:36

---

<!-- more -->

*导语：随着移动设备的普及以及微信庞大的用户量，移动端的需求也随之爆发式增长，平时我们使用 Chrome 进行手机模拟页面开发，但模拟终究是模拟，不可避免的还是需要真机调试，下面就来讲讲几种调试方案，希望能对你有所帮助。*

## 系统自带调试功能

### iOS 系统

**运行环境要求**

* Mac + Safari 浏览器
* iPhone（iOS 6 +） + Safari 浏览器

**调试步骤**

**1、使用 Lightning 数据线将 iPhone 与 Mac 相连**

**2、iPhone 开启 Web 检查器（`设置` -> `Safari` -> `高级` -> `开启 Web 检查器`）**

![开启 Web 检查器](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Safari_WebInspector.jpg)

**3、iPhone 使用 Safari 浏览器打开要调试的页面**

![iPhone 打开调试页面](//misc.aotu.io/ONE-SUNDAY/MobileDebug/iPhone_Safari.jpg)

**4、Mac 打开 Safari 浏览器调试（`菜单栏` —> `开发` -> `iPhone 设备名` -> `选择调试页面`）**

![选择调试页面](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Safari_Page.jpg)

如果你的菜单栏没有“开发”选项，可以到左上角 `Safari` -> `偏好设置` -> `高级` -> `在菜单栏中显示“开发”菜单`。

![开启开发菜单](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Open_SafariDevTools.jpg)

**5、在弹出的 Safari Developer Tools 中调试**

![进入 Safari DevTools](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Safari_DevTools.jpg)

经过如上步骤就可在 Mac 端调试 iPhone 上 Safari 运行的页面了，但对于 WebView 页面就不适用了，另外 Windows 系统不适用此方案。

**当前测试环境：**

* Safari 版本 10.0.2
* iPhone 7（iOS 10.1.1） 

没有 iPhone 设备可以在 App Store 安装 Xcode 使用其内置的 iOS 模拟器，安装完成后通过以下两种方式开启：

* 右键 `Xcode 图标` ->  `Open Developer Tool` -> `Simulator`

* 右键 `Finder 图标` -> `前往文件夹` -> `/应用程序/Xcode.app/Contents/Developer/Applications/` -> 运行 `Simulator.app`

运行 iOS 模拟器后，在模拟器中打开调试页面，再通过 Mac Safari 开发功能就可以调试到。

![Simulator](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Xcode_Simulator.jpg)

如果我需要调试更低版本的 iOS 怎么办？实际使用的 iPhone 不可能去降版本，不必担心，Simulator 有。

点击左上角 `Xcode` -> `Preferences` -> `Downloads` 就可以看到提供了如下版本：

![iOS 版本下载](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Xcode_Simulator_Version.jpg)

### Android 系统

**运行环境要求**

* Chrome 版本 >= 32
* Android 版本 4.0 +

**调试步骤**

**1、使用 USB 数据线将手机与电脑相连**

**2、手机进入开发者模式，勾选 USB 调试，并允许调试**

**如何开启 USB 调试：**

**索尼 Z5：**`设置` -> `关于关机` -> `多次点击软件版本开启` -> `返回上一级` -> `开发者选项` -> `USB 调试`

**魅蓝 Note：**`设置` -> `辅助功能` -> `开发者选项` -> `USB 调试`

不同 Android 设备进入开发者模式的方式有稍稍不同，瞎捣鼓一下即可开启。

![开启 Android 调试](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Android_USB_Debug.jpg)

**3、电脑打开 Chrome 浏览器，在地址栏输入：`chrome://inspect/#devices` 并勾选 `Discover USB devices` 选项**

![开启 Discover USB devices](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Discover_USB_devices.jpg)

**4、手机允许远程调试，并访问调试页面**

官方的教程是想让你使用手机 Chrome 开启调试页面的，但实际需求更多的是调试一些 WebView 页面，在官方的 [Remote Debugging WebViews](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews) 有说明是可以调试 WebView 页面的，Android 版本需要在 4.4 以上，并且 APP 需要有配置相应的启动调试代码。

> WebView debugging must be enabled from within your application. To enable WebView debugging, call the static method setWebContentsDebuggingEnabled on the WebView class.

> 必须在 APP 内启动 WebView 调试。要启动 WebView 调试，需要调用 WebView 类上的静态方法 setWebContentsDebuggingEnabled。


```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

> This setting applies to all of the application's WebViews.

> 此设置适用于所有 APP 的 WebView。

> Tip: WebView debugging is not affected by the state of the debuggable flag in the application's manifest. If you want to enable WebView debugging only when debuggable is true, test the flag at runtime.

> 提示：WebView 是否可调试状态不受 mainfest 标志变量 debuggable 的影响，如果你想在 debuggable 为 true 的时候启动 WebView 调试，请使用以下代码：

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    if (0 != (getApplicationInfo().flags & ApplicationInfo.FLAG_DEBUGGABLE)) { 
    	WebView.setWebContentsDebuggingEnabled(true); 
   	}
}
```

![Android 打开调试页面](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Android_Page.jpg)

**5、电脑点击 inspect 按钮**

如果你出现无法识别到设备的情况，建议尝试以下几种方法：

* 使用原装数据线，不要使用山寨数据线或一线多头的数据线 
* 重新插拔 USB 数据线，让手机处于充电状态
* 关闭电脑相关的应用助手
* 重启手机
* Windows 系统下自动安装驱动失败，到 [Android Studio](https://developer.android.com/studio/run/oem-usb.html#Drivers) 手动下载

![点击 inspect 按钮](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Click_Inspect.jpg)

注意：使用 Chrome Inspect 查看页面时，Chrome 需要从 https://chrome-devtools-frontend.appspot.com 加载资源，如果你得到的调试界面是一片空白，那你可能需要科学上网。

**6、进入调试界面**

![Chrome DevTools](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Chrome_DevTools.jpg)

**当前测试环境：**

* Chrome 版本 55.0.2883.95
* 索尼 Z5（Android 5.1.1）
* 魅蓝 Note（Android 5.1）
* 三星 Galaxy S7（Android 6.0.1）

这里顺带提一下 [TBS Studio](http://bbs.mb.qq.com/thread-1416936-1-1.html) 调试工具，它在 Chrome DevTools 调试功能的基础上进行了一些功能扩展，特性如下：

> 1.3 TBS Studio 功能特性

> 1）自动检测手机与 PC 的连接；
> 2）自动检测网页是否可进行 Inspect 调试；
> 3）自动引导开发者打开 Inspector 调试开关；
> 4）一键开启 Inspector 调试，无需打开浏览器输入 URL，方便快捷；
> 5）扩展 X5 内核独有 Inspect 选项，方便页面分析和优化；
> 6）真机远程 Inspector 调试。

![TBS Studio](//misc.aotu.io/ONE-SUNDAY/MobileDebug/TBS_Studio.jpg)

详细介绍和使用步骤可到[开发者论坛](http://bbs.mb.qq.com/thread-1416936-1-1.html)查看，部分 Android 机型通过 USB 可能依旧无法识别到设备，可使用后面会讲到的其他方案。

关于 Android 虚拟机也是有的，这里推荐使用 [Genymotion](https://www.genymotion.com/) 软件，使用 Genymotion 前需要安装  [VirtuaBox](https://www.virtualbox.org/wiki/Downloads)，并且注册登陆后才能显示所有的虚拟设备。

![Genymotion](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Virtua_Android.jpg)

---

## 使用代理工具调试开发环境页面

对于需要配 Hosts 才能访问的开发环境页面，手机在默认情况下是没有权限修改 Hosts 文件的，除非是 iOS 设备越狱后和 Android 设备 root 后，所以一般情况下手机是无法访问开发环境页面，这时需要使用到 Mac 系统的 [Charles](https://www.charlesproxy.com/) 代理工具，Windows 系统可使用 [Fiddler](http://www.telerik.com/fiddler) 代理工具。

**实现思路**

* Mac 作为代理服务器
* 手机通过 HTTP 代理连接到 Mac 电脑
* 手机上的请求都经过代理服务器
* 通过给 Mac 配 Hosts 实现目的

**调试步骤**

**1、查看电脑 IP**（`菜单` -> `Help` -> `Local IP Addresses`）

![本地 IP](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Local_IP.jpg)

**2、查看端口**（`菜单` -> `Settings` -> `Proxy Settings` -> `Proxies`）

![代理端口](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Proxy_Port.jpg)

默认端口为：8888，勾选 `Enable transparent HTTP proxying`

**3、将 IP、端口号填入手机 HTTP 代理**

iOS 系统：`设置` -> `无线局域网` -> `点击叹号` -> `HTTP 代理` -> `手动`

Android 系统：`设置` -> `长按当前网络` -> `修改网络` -> `高级选项` -> `手动`

![手机设置代理](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Set_HTTP_Proxy.jpg)

**4、Charles 允许授权**

![允许授权](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Allow_all_IP.jpg)

每次有新设备首次连接都会提示是否授权，可以通过 `Proxy` -> `Access Control Settings` 配置以下参数 `0.0.0.0/0` 来关闭。

![所有 IP 通过](//misc.aotu.io/ONE-SUNDAY/MobileDebug/All_IP.jpg)

**5、使用 [SwitchHosts!](https://oldj.github.io/SwitchHosts/) 软件给 Mac 电脑配 Hosts**

**6、手机访问开发环境页面**

到这一步手机就可以访问到开发环境下的页面了，再结合前面所讲的方案来调试页面。

**7、Charles 的调试功能**

* **7.1 网络映射修改文件**

除了结合前面的方案调试，可以使用 Map Local 网络映射功能来实现对文件的修改，在`菜单` -> `Proxy` -> `Start Recording` 开启抓包后访问页面，找到抓取到的样式文件，点击右键 `Map Local`，在 `Local path` 中设置本地映射文件的路径，修改后刷新页面可以看到效果。

![Map Local](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Map_Local.jpg)

* **7.2 模拟网络速度**

`菜单` -> `Proxy` -> `Throttle Settings` -> 勾选 `Enable Throttling`，在 `Throttling preset` 中可以选择需要模拟的网络速度。

![模拟网络速度](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Charles_Throttling.jpg)

* **7.3 抓取 HTTPS 请求**

默认情况下，Charles 无法抓取到 HTTPS 的请求，解决步骤如下：

Mac 端安装证书：`菜单` -> `Help` -> `SSL Proxying` -> `Install Charles Root Certificate`

![Mac 安装 SSL](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Install_SSL.jpg)

然后导出 Charles SSL 证书安装到手机，`菜单` -> `Help` -> `SSL Proxying` -> `Save Charles Root Certificate`

![导出 SSL](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Save_SSL.jpg)

Android 设备导出的 Charles SSL 证书存储到手机中并安装。

![Android 安装 SSL](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Android_Setup_SSL.jpg)

iOS 设备用 Safari 打开 http://www.charlesproxy.com/getssl/ 页面，下载 Charles SSL 证书并安装。

![iOS 安装 SSL](//misc.aotu.io/ONE-SUNDAY/MobileDebug/iOS_Setup_SSL.jpg)

证书安装完成后，还需要给 Charles SSL 代理配置域名和端口号，`菜单` -> `Proxy` -> `SSL Proxying Settings` 勾选 `Enable SSL Proxying` 点击 `Add` 填入域名和端口号，经过以上步骤就可以抓取到 HTTPS 的请求了。

![设置 SSL 端口](//misc.aotu.io/ONE-SUNDAY/MobileDebug/SSL_Proxying_Settings.jpg)

* **7.4 断点调试请求和响应内容**

开启 Charles 断点 `Proxy` -> `Breakpoints Settings` -> `Enable Breakpoints`点击 `Add` 可设置断点条件或者单独对需要的文件右键 `Breakpoints` 设置断点。

![开启断点](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Breakpoints.jpg)

访问页面后，即可编辑请求和响应的内容，点击 `Execute` 按钮完成。

![编辑抓包内容](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Edit_Content.jpg)

---

### Weinre 调试工具

Weinre 是一款较老的远程调试工具，功能与 Chrome DevTools 相似，需要在页面中插入一段 JS 脚本来实时调试页面 DOM 结构、样式、JS 等，另外它使用的是代理的方式，所以兼容性很好，无论是新老设备系统通吃，但对于样式调试不友善，缺少断点调试及 Profiles 等常用功能。

**调试步骤：**

**1、安装 Weinre**

使用 NPM 全局安装 Weinre

```
$ sudo npm -g install weinre
```

![安装 Weinre](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Install_Weinre.jpg)

**2、启动 Weinre 监听服务**

```shell
$ ipconfig getifaddr en0 // 查看本机 IP
$ weinre --boundHost 10.14.217.14 --httpPort 8090
```

`--boundHost` 后填入你本机 IP 地址，`--httpPort` 后填入端口号，默认为 8080

![启动监听](//misc.aotu.io/ONE-SUNDAY/MobileDebug/run_weinre.jpg)

**3、进入 Weinre 管理页面**

使用 Chrome 浏览器访问 [http://10.14.217.14:8090](http://10.14.217.14:8090)，在管理页面你可以看到使用相关的说明，有进入客户端调试界面的地址、使用的文档、DEMO 页面等等，说明中要求将一段 JS 脚本 `<script src="http://10.14.217.14:8090/target/target-script-min.js#anonymous"></script>` 插入到需要调试的页面中，插入代码后手机访问调试页面。

![需要插入的脚本](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Target_Script.jpg)

**4、进入客户端调试界面**

点击 debug client user interface：[http://10.14.217.14:8090/client/#anonymous](http://10.14.217.14:8090/client/#anonymous) 的链接。

![Weinre Remote](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Weinre_Remote.jpg)

![Weinre Element](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Weinre_Element.jpg)

**5、JS 脚本注入**

手动加入 JS 脚本不优雅，这里可以结合我们前面提到的 Charles 代理工具实现动态 HTTP Script 注入。

打开`菜单` -> `Rewrite` -> 勾选 `Enable Rewrite`

![Charles Rewrite](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Charles_Rewrite.jpg)

输入 Rewrite 的名字并且在 Rules 一项添加匹配的规则，Location 一项是用于指定的域名和端口添加规则用的，这里我们不填默认匹配所有请求。

Type 允许对需要匹配的请求进行 Rewrite，一共提供了 11 种：

* `Add Header`
* `Modify Header`
* `Remove Header`
* `Host`
* `Path`
* `URL`
* `Add Query Param`
* `Modify Query Param`
* `Remove Query Param`
* `Response Status`
* `Body`

这里我们需要使用到的是 `Body`，它的作用是对请求或响应内容进行匹配替换，按照下图的配置，通过将匹配到的响应内容 `</body>` 标签替换成需要插入到页面中的 JS 脚本，从而实现动态插入。

![Rewrite Rule](//misc.aotu.io/ONE-SUNDAY/MobileDebug/Charles_Rewrite_Rule.jpg)

另外，也有基于 Weinre 进行功能扩展的工具，比如早期版本的 [微信 Web 开发者工具 v0.7.0](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455784140&token=&lang=zh_CN) 和 [spy-debugger](https://github.com/wuchangming/spy-debugger)，都在 Weinre 的基础上简化了要给每个调试页面添加 JS 脚本的步骤，spy-debugger 还增加了对 HTTPS 的支持。

---

感谢你的阅读，如果你还有其他更为实用的调试方案，欢迎下方留言交流。

### 参考资料

* [Safari Web Inspector Guide](https://developer.apple.com/library/content/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html)
* [Get Started with Remote Debugging Android Devices](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/)
* [Remote Debugging WebViews](https://developers.google.com/web/tools/chrome-devtools/remote-debugging/webviews)
* [weinre - Running](http://people.apache.org/~pmuellr/weinre/docs/latest/Running.html)
* [Charles Web Debugging Proxy](https://www.charlesproxy.com/documentation/welcome/)
* [wuchangming/spy-debugger](https://github.com/wuchangming/spy-debugger)
* [TBS 开发调试利器 —— TBS Studio - QQ 浏览器移动产品论坛](http://bbs.mb.qq.com/thread-1416936-1-1.html)
* [微信 web 开发者工具](https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1455784140&token=&lang=zh_CN)