title: URL编码的奥秘
subtitle: 秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘秘~
cover: //misc.aotu.io/Newcandy/2017-06-15-The-mystery-of-URL-encoding/cover_900x500.jpg
categories: Web开发
tags:
  - URL
  - 百分号编码
  - 字符编码
  - escape
  - encodeURI
  - encodeURIComponent
  - ASCII
  - unicode
  - utf-8
author:
  nick: 暖暖
  github_name: Newcandy
date: 2017-06-15 10:41:24
---

URL编码的世界很精彩，你不过来看一下么？
<!-- more -->

## 1、从escape和encodeURI讲起

假设你已经了解escape的编码：
* 不对 ASCII 字母、数字进行编码。
* 不对 `*@-_+./` 进行编码。
* 其他所有的字符都会被转义序列替换。

```
escape('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

escape('*@-_+./')
// "*@-_+./"
```

假设你已经了解encodeURI的编码：
* 不对 ASCII 字母和数字进行编码。
* 不对 `-_.!~*'();/?:@&=+$,#` 这20个ASCII 标点符号进行编码。
* 其他所有的字符都会被转义序列替换。

```
encodeURI('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

encodeURI("-_.!~*'();/?:@&=+$,#")
// "-_.!~*'();/?:@&=+$,#"
```

掐指一算，escape的不编码集（69个） 是 encodeURI的不编码集（82个） 的子集。

当然，escape和encodeURI 是对 凹凸 进行编码的：

```
escape('凹凸')
//"%u51F9%u51F8"

encodeURI('凹凸')
// "%E5%87%B9%E5%87%B8"
```

嗯，了解细节 看 下面 👇

## 2、百分号编码

很诧异，escape和encodeURI 对 凹凸 的编码结果竟然不一样。
但是他们有个共同点，转化后形式类似 `%*`。

嗯，这个就是百分号编码了。

> 百分号编码(Percent-encoding), 也称作URL编码(URL encoding), 是特定上下文的统一资源定位符 (URL)的编码机制。

escape和encodeURI的百分号编码的根本区别在于，encodeURI是W3C的标准（RFC 3986），而escape是非标准。
* 共同点：
	* 对于需要编码的ASCII字符，将其表示为两个16进制的数字，然后在其前面放置转义字符(`%`)，置入URI中的相应位置。
* 区别：
	* 标准：对于非ASCII字符, 需要转换为UTF-8字节序, 然后每个字节按照上述方式表示。
	* 非标准：对于非ASCII字符在URI中表示为: `%uxxxx`, 其中`xxxx`是用4个十六进制数字表示的Unicode的码位值。

因为凹凸不是ASCII字符，所以encodeURI 对 凹凸 先转换为UTF-8字节序，一个字符有三个字节，每个字节转化为`%xx`，所以最后有6个`%xx`。
escape直接对凹凸转成了`%u51F9%u51F8`。

## 3、保留、未保留及受限的字符

RFC3986文档规定，Url中只允许包含未保留字符以及所有保留字符。

* 未保留字符包含英文字母（a-zA-Z）、数字（0-9）、-_.~ 4个特殊字符。**对于未保留字符，不需要百分号编码**。

* 保留字符是那些具有特殊含义的字符。
RFC 3986 section 2.2 保留字符(18个)：

|  保留字符	|   含义  |  例子  |
| :------   | :------ | :------ |
| `:/?#[]@` | 分隔Url的协议、主机、路径等组件。比如：冒号:保留为方案、用户/口令，以及主机/端口组件的定界符使用；/保留为路径组件中分隔路径段的定界符；?	保留作为查询字符串定界符使用；#保留为分段定界符使用 | `encodeURI(':/?#[]@') // ":/?#%5B%5D@"其中[]被转义，因为它们是不安全字符`  |
| `!$&'()*+,;=` | 用于在每个组件中起到分隔作用的。比如：&符号用于分隔查询多个键值对；=用于表示查询参数中的键值对。 |  `encodeURI("!$&'()*+,;=") // "!$&'()*+,;="`  |

* 受限字符或不安全字符，直接放在Url中的时候，可能会引起解析程序的歧义：

|  受限字符	|  为何受限  |  例子  |
| :------   | :------ | :------ |
| `%`	        |  作为编码字符的转义标志，因此本身需要编码  |   `encodeURI('%') // "%25"`  |
| 空格 |  Url在传输的过程，或者用户在排版的过程，或者文本处理程序在处理Url的过程，都有可能引入无关紧要的空格，或者将那些有意义的空格给去掉。 |  `encodeURI(' ') // "%20"`  |
| `<>"`	        |   尖括号和引号通常用于在普通文本中起到分隔Url的作用，所以应该对其进行编码  | `encodeURI('<>"') // "%3C%3E%22"`  |
| `{}`&#124;`\^~[]'`    |   某一些网关或者传输代理会篡改这些字符。你可能会感到奇怪，为什么使用一些不安全字符的时候并没有发生什么不好的事情，比如无需对~字符进行编码，前面也说了，对某些传输协议来说不是问题。  |  `encodeURI("{}`&#124;`\^~[]'") // "%7B%7D&%7C%5E~%5B%5D'"`  |
| 0x00-0x1F, 0x7F	        |   受限，这些十六进制范围内的字符都在US-ASCII字符集的不可打印区间内  | 比如换行键是0x0A  |
| >0x7F	        |     受限，十六进制值在此范围内的字符都不在US-ASCII字符集的7比特范围内  |  `encodeURI('京东') // "%E4%BA%AC%E4%B8%9C"`  |


因此encodeURI的不编码集（82个） = 
66个未保留字符`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.~`  
加上 
18个保留字符`:/?#[]@!$&'()*+,;=` 
减去 
2个不安全的保留字符`[]`


## 3、encodeURI与encodeURIComponent

了解了encodeURI的不编码集合的由来，再来看看encodeURI与encodeURIComponent的区别。
其实看一下名字，大概已经知道两者的区别了。
encodeURIComponent 假定参数是 URI 的一部分（比如协议、主机名、路径或查询字符串）。因此 encodeURIComponent() 函数将转义用于分隔 URI 各个部分的标点符号（;/?:@&=+$,#），所以encodeURIComponent的不编码集只有71个，如下：

```
encodeURIComponent('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789,/?:@&=+$#')
// "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789%2C%2F%3F%3A%40%26%3D%2B%24%23"
```

再看个对比例子：
```
encodeURIComponent('https://aotu.io/')
// "https%3A%2F%2Faotu.io%2F"

encodeURI('https://aotu.io/')
// "https://aotu.io/"
```

## 4、字符编码

有没有人好奇 汉字有多少个字 ？ 具体数字小编也说不上。。谁能告诉我。。
不同编码收录的汉字数目也不一样。
GB 2312收录6763个汉字；
GBK收录20912个汉字；
GB 18030是中华人民共和国现时最新的内码字集，收录70244个汉字；
Big5（繁体）收录13053个汉字；
Unicode的中日韩统一表意文字基本字集则收录汉字20902个，另有四个扩展区，总数亦高达七万多字。

言归正传，ASCII，Unicode和UTF-8，它们究竟有没有关联呢？

* ASCII码

一个字节（byte） = 8个二进制位（bit），
因此1 byte可以表示256个字符，从00000000到11111111。
ASCII码的规定是最前面的1位二进制统一规定为0，所以只能表示128个字符编码了。
具体可查看[维基百科-ASCII](https://zh.wikipedia.org/wiki/ASCII#.E6.8E.A7.E5.88.B6.E5.AD.97.E7.AC.A6) 。

* Unicode

Unicode，中文翻译成万国码、国际码、统一码、单一码。
Unicode只是一个符号集，只规定了符号的二进制代码。
从Unicode的中文翻译上可以看出Unicode与ASCII的区别：Unicode对世界上大部分的文字系统进行了整理、编码，而ASCII只是英文字符。

* UTF-8

UTF-8是Unicode的实现方式之一。
UTF-8根据不同的符号而变化字节长度，编码规则如下：

| Unicode符号范围（十六进制） | UTF-8编码（二进制） |  解释    |
| :------   | :------ | :------ |
| 0000 0000~0000 007F | 0xxxxxxx  |  字节的第一位设为0，代表是单字节字符。  |
| 0000 0080~0000 07FF | 110xxxxx 10xxxxxx  | n=2个字节，第一个字节的前n位设为1，第n+1位设为0，其他字节的前2位为10。 | 
| 0000 0800~0000 FFFF | 1110xxxx 10xxxxxx 10xxxxxx  |   n=3个字节，第一个字节的前n位设为1，第n+1位设为0，其他字节的前2位为10。 |
| 0001 0000~0010 FFFF | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |  n=4个字节，第一个字节的前n位设为1，第n+1位设为0，其他字节的前2位为10。 |

例子，实现UTF-8编码：
“凹”的Unicode是\u51f9，
十六进制 51f9 转成二进制 101000111111001，
根据编码规则，51f9 在 0000 0800~0000 FFFF的范围内，格式是1110xxxx 10xxxxxx 10xxxxxx。
从“凹”的右边的二进制位开始，从右到左的顺序依次放入格式中的x，不够则补0。
所以最后得到了11100101 10000111 10111001，转成十六进制就是e587b9，验证如下：

```
encodeURI('凹')
// "%E5%87%B9"
```

怎么解读“凹”的UTF-8编码二进制11100101 10000111 10111001 ？

1. 第一个字节的第一位不是0，确认第一个字节不是一个字符；
2. 第一个字节的第一位是1，而且连续有3个1，就表示该字符占用了3个字节。
3. 于是，计算机清晰地知道 11100101 10000111 10111001 三个字节表示一个符号，而不是分别表示三个符号，解读完毕。

附：
中文转Unicode在线工具：http://tool.chinaz.com/tools/unicode.aspx
二进制与十六进制在线转换工具：http://tool.oschina.net/hexconvert

## 6、参考

http://www.w3school.com.cn/jsref/jsref_escape.asp
http://www.w3school.com.cn/jsref/jsref_encodeURI.asp
http://www.w3school.com.cn/jsref/jsref_encodeURIComponent.asp
https://zh.wikipedia.org/wiki/%E7%99%BE%E5%88%86%E5%8F%B7%E7%BC%96%E7%A0%81
https://www.zhihu.com/question/21861899
http://www.ituring.com.cn/book/miniarticle/44590
https://kb.cnblogs.com/page/133765/
http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html













