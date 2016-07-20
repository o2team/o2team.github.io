title: 如何用ArrayBuffer构造一个form请求
subtitle: form表单数据编码类型为multi/formdata的分析
cover: //img.aotu.io/FrwIQ0XqdLlbyozfiGE8Jblf4SFy
categories: Web开发
tags:
- form
- xhr2
- ArrayBuffer
- 构造form数据
author:
 nick: 小绿
 github_name: cos2004
---
本文主要介绍form数据的格式以及如何用代码手动构造一个请求。

<!-- more -->

## 一、常用的form enctype类型：
1. application/x-www-form-urlencoded
form默认的编码方式，会编码特殊文字，也是jq等库ajax提交数据默认的编码格式
2. multi/formdata
这种方式可以提交文本+二进制格式
3. text/plain
只编码空格符，这种方式不太常用

其中比较复杂的是multi/formdata类型的，可混合提交文本数据与二进制数据(图片、zip等)，下面主要介绍一下这种编码的规律以及在js以及nodejs的构造的方法。

## 二、分析一个multi/formdata的例子
以下是一个formdata的格式（chrome中）：
```
------WebKitFormBoundary0yB3cIYoABZUBzEm
Content-Disposition: form-data; name="user"

aotu.io
------WebKitFormBoundary0yB3cIYoABZUBzEm
Content-Disposition: form-data; name="psw"

123456
------WebKitFormBoundary0yB3cIYoABZUBzEm
Content-Disposition: form-data; name="onefile"; filename="onefile-1460812719250.png"
Content-Type: image/png

.... (png binary data) ....
------WebKitFormBoundary0yB3cIYoABZUBzEm--
```

分析一下这种编码格式的特点：

1、request header里声明Content-Type，并且在其后加上数据分界符：boundary，即：Content-Type:multipart/form-data; boundary=----WebKitFormBoundary0yB3cIYoABZUBzEm。

boundary的字符应该是随机的，防止提交的数据里有相同字符而影响服务器的数据解析。

2、request body的部分，规律可看下面的图解：

![request body说明](//img.aotu.io/FqTCYAQuN8OeV8yFvva4_TUvCgxs)

可以看出：
- body里的boundary总比Content-Type声明的boundary前面多两个中划线；
- 而body结束部分的boundary则在后面再加上两个中划线;
- 每行后面都应该有一个换行符『\r\n』，field name行与field值行之间还有一行仅有一个换行符的空白行。

## 三、如何构造
以上介绍完了multi/formdata的编码结构，下面说说在js里面是怎么构造的这样的一个请求的。

有同学问了，为啥不用new FormData()直接构造数据呢？嗯。。。

- 1)第一种情况比较简单，就是表单字段只有文本（数字）的情况。我们可以按照上面的结构，进行简单的字符串拼接，并设置好header，最后xhr.send(form_str)；

- 2)这种是混合了文本与二进制数据的情况，即上图表示的情况，这时候需要结合xhr2、ArrayBuffer、FileReader等api。

请看以下代码以及注释：
```
    <form class="J_form">
        <p>用户名：<input type="text" name="user" value="aotu.io" readonly></p>
        <p>密码：<input type="text" name="psw" value="123456" readonly></p>
        <p><label for="onefile">png图片：</label><input type="file" name="onefile" id="onefile" class="J_file"></p>
        <p><input type="button" value="提交" class="J_submit" title="请选择文件后再提交" style="font-size:14px;" disabled><span style="font-size:12px;color:#999;">(请选择文件后再提交)</span></p>
        <p>返回结果：<span class="J_ret"></span></p>
        <p><img class="J_img" src=""></p>
    </form>
    <script>
        var picBuffer = null; // 图片数据
        document.querySelector('.J_file').onchange = function(evt) {
            var fileReader = new FileReader();
            var file = evt.target.files[0];
            document.querySelector('.J_submit').removeAttribute('disabled');
            fileReader.onload = function(e) {
                picBuffer = e.target.result; // 文件的ArrayBuffer数据
            }
            fileReader.readAsArrayBuffer(file);
        };

        document.querySelector('.J_submit').onclick = function() {
            var boundary_key = 'aotu_lab'; // 数据分割符，一般是随机的字符串
            var boundary = '--' + boundary_key;
            var end_boundary = '\r\n' + boundary + '--';
            // 以下是拼接文本域的的数据。为了方便演示以下数据都是单字节、并没有考虑兼容中文
            var retsult = '';
              retsult += boundary + '\r\n';
              retsult += 'Content-Disposition: form-data; name="user"' + '\r\n\r\n';
              retsult += document.querySelector('input[name=user]').value + '\r\n'; 
              // 另外一个拼接文本域的的数据
              retsult += boundary + '\r\n';
              retsult += 'Content-Disposition: form-data; name="psw"' + '\r\n\r\n';
              retsult += document.querySelector('input[name=psw]').value + '\r\n';
              // 拼接二进制数据，这里为了方便演示只用了png的数据
              retsult += boundary + '\r\n';
              retsult += 'Content-Disposition: form-data; name="onefile"; filename="pic.png"' + '\r\n';
              retsult += 'Content-Type: image/png' + '\r\n\r\n';
             
            var resultArray = [];
            for (var i = 0; i < retsult.length; i++) { // 取出文本的charCode（10进制）
               resultArray.push(retsult.charCodeAt(i));
            }
            var pic_typedArray = new Uint8Array(picBuffer); // 把buffer转为typed array数据、再转为普通数组使之可以使用数组的方法
            var endBoundaryArray = [];
            for (var i = 0; i < end_boundary.length; i++) { // 最后取出结束boundary的charCode
               endBoundaryArray.push(end_boundary.charCodeAt(i));
            }
            var postArray = resultArray.concat(Array.prototype.slice.call(pic_typedArray), endBoundaryArray); // 合并文本、图片数据得到最终要发送的数据
            var post_typedArray = new Uint8Array(postArray); // 把最终结果转为typed array，以便最后取得buffer数据
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    //do something
                }
            };
            xhr.open("POST", "/submit");
            xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary='+boundary_key); // 记得在头部带上boundary
            xhr.send(post_typedArray.buffer); // 发送buffer数据，这是xhr2的一个特性
        };
    </script>
```

在上面的代码里，由于暂时没能在官方文档找到拷贝或concat整段buffer的方法，所以合并字符数据与图片数据的方法并不十分高效，需要转为普通数组，合并数据后再次转为typed array以获得buffer数据。经过一番转换后计算效率在大文件下或者手机端这种方法的效率还待验证，因为处理普通数组会比直接操作二进制慢不少。

注意，以上代码并不兼容发送中文的情况，大概就是思路用合适字节长度去存储经过encodeURIComponent(或charCode)后的字符，字符code与二进制编码之间的转换这不在本文的讨论范围，有兴趣的同学可参考文后的参考资料。

FormData的api使我们可以处理blob(buffer)、text等数据的提交，平常开发已足够。但是通过了解formdata的数据底层组装方式，或许有助于我们在浏览器端更灵活的处理一些二进制数据、提供一些新思路。

最后再附上nodejs版的构造方式的主要代码：
```
    var boundary_key = 'aotu_lab';
    var boundary = '--' + boundary_key;
    var end_boundary = boundary + '--';
    var request = http.request({
        host: '127.0.0.1',
        port: 3000,
        path: '/submit',
        method: 'post'
    }, function(req) {
    req.on('data', function(buf) {
        console.log('response from node:');
        console.log(buf.toString()); // 接口返回的json string结果
    });
    });
    request.setHeader('Content-Type', 'multipart/form-data; boundary='+ boundary_key);
    var retsult = '';
    retsult += boundary + '\r\n';
    retsult += 'Content-Disposition: form-data; name="user"' + '\r\n\r\n';
    retsult += 'aotu.io' + '\r\n';
    retsult += boundary + '\r\n';
    retsult += 'Content-Disposition: form-data; name="psw"' + '\r\n\r\n';
    retsult += '123456' + '\r\n';
    retsult += boundary + '\r\n';
    retsult += 'Content-Disposition: form-data; name="onefile"; filename="pic.png"' + '\r\n';
    retsult += 'Content-Type: image/png' + '\r\n\r\n';
    request.write(retsult); // 写入文本数据，该方法会自动编码字符为二进制

    var picStream = fs.createReadStream('./public/images/o2logo.png'); // 读取一张图片
    picStream.on('end', function() {
                request.write('\r\n' + end_boundary); // 写入结束符
                request.end();
                res.end('post form data success!');
             })
             .pipe(request, {end: false}); // 写入图片数据request
```

有兴趣的同学可以clone这个git地址获取代码：https://github.com/cos2004/formrequest_app.git

代码介绍：

首先npm install，然后npm start启动服务器

http://127.0.0.1:3000/ ，可演示js版的提交，请选择png格式文件

http://127.0.0.1:3000/formdata 演示nodejs版提交，在terminal可以看到输出结果

http://127.0.0.1:3000/submit 表单数据提交接口

## 参考资料
[W3C关于Forms的说明](https://www.w3.org/TR/html401/interact/forms.html)

[字符编码笔记：ASCII，Unicode和UTF-8](http://www.ruanyifeng.com/blog/2007/10/ascii_unicode_and_utf-8.html)

[MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView)

[你所不知道的JavaScript数组](http://www.cnblogs.com/hustskyking/p/javascript-array.html)

[如何用nodejs通过post发送multipart/form-data类型的http请求](http://cnodejs.org/topic/4ffed8544764b729026b1da3)