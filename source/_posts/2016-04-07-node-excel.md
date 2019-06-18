title: Node读写Excel文件探究实践
subtitle: "本文介绍用 Node.js 中的依赖库来处理 Excel 文件，主要阐述用js-xlsx、excel-export 库来处理 Excel 文件。"
cover: https://img30.360buyimg.com/ling/jfs/t1/43845/18/6878/48372/5d0856d1Ef76392ea/8b485a3ad42b173f.png
categories: NodeJS
tags:
  - node 
  - excel
  - JS-XLSX
  - Node-Excel-Export
author:
  nick: 高大师
  github_name: pfan123
date: 2016-04-07 18:32:18
---
## 简介
本文介绍用 Node.js 中的依赖库来处理 Excel 文件，深入分析对比常见npm库处理Excel 文件存在的优缺点，主要阐述用js-xlsx、excel-export 库来处理 Excel 文件。 

## 思路
- 有哪些外部模块支持读写Excel
- 引入依赖模块
- 编写业务逻辑函数
- 实践应用

##  支持读写Excel的node.js模块
通过npm搜索，支持读写excel文件的模块有很多，但是都各有忧缺点，有些仅支持xls/xlsx的一种格式，有些仅支持读取数据，有些仅支持导出文件，有些需要依赖python解析。常见的npm依赖模块如下：
>- [js-xlsx](https://github.com/SheetJS/js-xlsx): 目前 Github 上 star 数量最多的处理 Excel 的库，支持解析多种格式表格XLSX / XLSM / XLSB / XLS / CSV，解析采用纯js实现，写入需要依赖nodejs或者[FileSaver](https://github.com/eligrey/FileSaver.js/).js实现生成写入Excel，可以生成子表Excel，功能强大，但上手难度稍大。不提供基础设置Excel表格api例单元格宽度，文档有些乱，不适合快速上手；
>- [node-xlsx](https://github.com/mgcrea/node-xlsx): 基于Node.js解析excel文件数据及生成excel文件，仅支持xlsx格式文件；
>- [excel-parser](https://github.com/leftshifters/excel-parser): 基于Node.js解析excel文件数据，支持xls及xlsx格式文件，需要依赖python，太重不太实用；
>- [excel-export](https://github.com/functionscope/Node-Excel-Export) : 基于Node.js将数据生成导出excel文件，生成文件格式为xlsx，可以设置单元格宽度，API容易上手，无法生成worksheet字表，比较单一，基本功能可以基本满足；
>- [node-xlrd](https://segmentfault.com/a/1190000004062768): 基于node.js从excel文件中提取数据，仅支持xls格式文件,不支持xlsx,有点过时，常用的都是XLSX 格式。

通过以上分析对比，本人比较推崇`js-xlsx`、`excel-export`来读写Excel文件，可以结合使用`js-xlsx`解析Excel、`excel-export`生成，效果更加，接下来分别实践`js-xlsx`、`excel-export`。

## 第一讲：利用 js-xlsx 处理 Excel 文件
### 安装
node中使用通过npm：
```
$ npm install xlsx

```
浏览器使用：
```
<script lang="javascript" src="dist/xlsx.core.min.js"></script>

```
通过bower安装：
```
bower install js-xlsx
```
`注意`，在客户端使用时，建议使用`dist/xlsx.full.min.js`，包含了js-xlsx所有模块。

### 一些概念

在使用这个库之前，先介绍库中的一些概念。

>- workbook 对象，指的是整份 Excel 文档。我们在使用 js-xlsx 读取 Excel 文档之后就会获得 workbook 对象。
>- worksheet 对象，指的是 Excel 文档中的表。我们知道一份 Excel 文档中可以包含很多张表，而每张表对应的就是 worksheet 对象。
>- cell 对象，指的就是 worksheet 中的单元格，一个单元格就是一个 cell 对象。

它们的关系如下：
```
// workbook
{
    SheetNames: ['sheet1', 'sheet2'],
    Sheets: {
        // worksheet
        'sheet1': {
            // cell
            'A1': { ... },
            // cell
            'A2': { ... },
            ...
        },
        // worksheet
        'sheet2': {
            // cell
            'A1': { ... },
            // cell
            'A2': { ... },
            ...
        }
    }
}
```

### 用法

**基本用法**

1.用 `XLSX.read` 读取获取到的 Excel 数据，返回 workbook
2.用 `XLSX.readFile` 打开 Excel 文件，返回 workbook
3.用 `workbook.SheetNames` 获取表名
4.用 `workbook.Sheets[xxx]` 通过表名获取表格
5.用 `worksheet[address]`操作单元格
6.用`XLSX.utils.sheet_to_json`针对单个表获取表格数据转换为json格式
7.用`XLSX.writeFile(wb, 'output.xlsx')`生成新的 Excel 文件

**具体用法**
读取 Excel 文件
```
	workbook ＝ XLSX.read(excelData, {type: 'base64'});
	workbook ＝ XLSX.writeFile('someExcel.xlsx', opts);

```
获取 Excel 文件中的表
```
// 获取 Excel 中所有表名
var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2',……]
// 根据表名获取对应某张表
var worksheet = workbook.Sheets[sheetNames[0]];
```
通过 `worksheet[address]` 来操作表格，以 ! 开头的 key 是特殊的字段。
```
// 获取 A1 单元格对象
let a1 = worksheet['A1']; // 返回 { v: 'hello', t: 's', ... }
// 获取 A1 中的值
a1.v // 返回 'hello'

// 获取表的有效范围
worksheet['!ref'] // 返回 'A1:B20'
worksheet['!range'] // 返回 range 对象，{ s: { r: 0, c: 0}, e: { r: 100, c: 2 } }

// 获取合并过的单元格
worksheet['!merges'] // 返回一个包含 range 对象的列表，[ {s: { r: 0, c: 0 }, c: { r: 2, c: 1 } } ]
```
获取 Excel 文件中的表转换为json数据
```
	XLSX.utils.sheet_to_json(worksheet)  //针对单个表，返回序列化json数据
```
生成新的 Excel 文件
```
	//服务端通过XLSX.writeFile
	XLSX = require("xlsx");
	XLSX.writeFile(wb, 'output.xlsx')   
	
	//客服端，只能通过XLSX.write(wb, write_opts) 写入 表格数据，借助FileSaver生成，且只支持在高版本浏览器。
	var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

	var wbout = XLSX.write(wb,wopts);

	function s2ab(s) {
	  var buf = new ArrayBuffer(s.length);
	  var view = new Uint8Array(buf);
	  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
	  return buf;
	}

	/* the saveAs call downloads a file on the local machine */
	saveAs(new Blob([s2ab(wbout)],{type:""}), "test.xlsx")     

```

## js-xlsx实战
**解析 Excel 生成 JSON**
```
function to_json(workbook) {
	var result = {};

	// 获取 Excel 中所有表名
	var sheetNames = workbook.SheetNames; // 返回 ['sheet1', 'sheet2']

	workbook.SheetNames.forEach(function(sheetName) {
		var worksheet = workbook.Sheets[sheetName];
		result[sheetName] = XLSX.utils.sheet_to_json(worksheet);
	});	

	console.log("打印表信息",JSON.stringify(result, 2, 2));  //显示格式{"表1":[],"表2":[]}
	return result;
}
```
**导出表格**
1.构建特定的数据结构，通过new Blob如下。
```
// workbook
{
    SheetNames: ['mySheet'],
    Sheets: {
        'mySheet': {
            '!ref': 'A1:E4', // 必须要有这个范围才能输出，否则导出的 excel 会是一个空表
            A1: { v: 'id' },
            ...
        }
    }
}
```

2.调用 XLSX.write， 借助FileSaver中new Blob生成即可。
```
var _headers = ['id', 'name', 'age', 'country', 'remark']
var _data = [ { id: '1',
                name: 'test1',
                age: '30',
                country: 'China',
                remark: 'hello' },
              { id: '2',
                name: 'test2',
                age: '20',
                country: 'America',
                remark: 'world' },
              { id: '3',
                name: 'test3',
                age: '18',
                country: 'Unkonw',
                remark: '???' } ];

var headers = _headers
                // 为 _headers 添加对应的单元格位置
                // [ { v: 'id', position: 'A1' },
                //   { v: 'name', position: 'B1' },
                //   { v: 'age', position: 'C1' },
                //   { v: 'country', position: 'D1' },
                //   { v: 'remark', position: 'E1' } ]
                .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
                // 转换成 worksheet 需要的结构
                // { A1: { v: 'id' },
                //   B1: { v: 'name' },
                //   C1: { v: 'age' },
                //   D1: { v: 'country' },
                //   E1: { v: 'remark' } }
                .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

var data = _data
              // 匹配 headers 的位置，生成对应的单元格数据
              // [ [ { v: '1', position: 'A2' },
              //     { v: 'test1', position: 'B2' },
              //     { v: '30', position: 'C2' },
              //     { v: 'China', position: 'D2' },
              //     { v: 'hello', position: 'E2' } ],
              //   [ { v: '2', position: 'A3' },
              //     { v: 'test2', position: 'B3' },
              //     { v: '20', position: 'C3' },
              //     { v: 'America', position: 'D3' },
              //     { v: 'world', position: 'E3' } ],
              //   [ { v: '3', position: 'A4' },
              //     { v: 'test3', position: 'B4' },
              //     { v: '18', position: 'C4' },
              //     { v: 'Unkonw', position: 'D4' },
              //     { v: '???', position: 'E4' } ] ]
              .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
              // 对刚才的结果进行降维处理（二维数组变成一维数组）
              // [ { v: '1', position: 'A2' },
              //   { v: 'test1', position: 'B2' },
              //   { v: '30', position: 'C2' },
              //   { v: 'China', position: 'D2' },
              //   { v: 'hello', position: 'E2' },
              //   { v: '2', position: 'A3' },
              //   { v: 'test2', position: 'B3' },
              //   { v: '20', position: 'C3' },
              //   { v: 'America', position: 'D3' },
              //   { v: 'world', position: 'E3' },
              //   { v: '3', position: 'A4' },
              //   { v: 'test3', position: 'B4' },
              //   { v: '18', position: 'C4' },
              //   { v: 'Unkonw', position: 'D4' },
              //   { v: '???', position: 'E4' } ]
              .reduce((prev, next) => prev.concat(next))
              // 转换成 worksheet 需要的结构
              //   { A2: { v: '1' },
              //     B2: { v: 'test1' },
              //     C2: { v: '30' },
              //     D2: { v: 'China' },
              //     E2: { v: 'hello' },
              //     A3: { v: '2' },
              //     B3: { v: 'test2' },
              //     C3: { v: '20' },
              //     D3: { v: 'America' },
              //     E3: { v: 'world' },
              //     A4: { v: '3' },
              //     B4: { v: 'test3' },
              //     C4: { v: '18' },
              //     D4: { v: 'Unkonw' },
              //     E4: { v: '???' } }
              .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});

// 合并 headers 和 data
var output = Object.assign({}, headers, data);
// 获取所有单元格的位置
var outputPos = Object.keys(output);
// 计算出范围
var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

// 构建 workbook 对象
var wb = {
    SheetNames: ['mySheet'],
    Sheets: {
        'mySheet': Object.assign({}, output, { '!ref': ref })
    }
};

// 导出 Excel
//XLSX.writeFile(wb, 'output.xlsx');

var wopts = { bookType:'xlsx', bookSST:false, type:'binary' };

var wbout = XLSX.write(wb,wopts);

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

/* the saveAs call downloads a file on the local machine */
saveAs(new Blob([s2ab(wbout)],{type:""}), "test.xlsx")  
```

实践Demo：[RD快速生成excel表](http://doc.pfan123.com/excel.html)

## 第二讲：利用 excel-export 生成 Excel 文件
excel-export模块，上手起来就比较容易了，其中原理是通过修改，修改header 信息、拼接字符串、修改字符集、输出字符串的形式实现的，在部分firefox低版本下载中文名会出现乱码情况。我们只需要按照API设置好数据参数，通过nodeExcel.execute调用执行，系统调用模版"styles.xml"就可以生成Excel文件，比较好的就是，它可以设置单元格的宽度，类型。
我们先看看，官方提供的例子：
```
var express = require('express');
var nodeExcel = require('excel-export');
var app = express();

app.get('/Excel', function(req, res){
    var conf ={};
    conf.stylesXmlFile = "styles.xml";
    conf.name = "mysheet";
    conf.cols = [{
        caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
             return cellData.toUpperCase();
        },
        width:28.7109375
    },{
        caption:'date',
        type:'date',
        beforeCellWrite:function(){
            var originDate = new Date(Date.UTC(1899,11,30));
            return function(row, cellData, eOpt){
                if (eOpt.rowNum%2){
                    eOpt.styleIndex = 1;
                }  
                else{
                    eOpt.styleIndex = 2;
                }
                if (cellData === null){
                  eOpt.cellType = 'string';
                  return 'N/A';
                } else
                  return (cellData - originDate) / (24 * 60 * 60 * 1000);
            } 
        }()
    },{
        caption:'bool',
        type:'bool'
    },{
        caption:'number',
         type:'number'              
    }];
    conf.rows = [
        ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
        ["e", new Date(2012, 4, 1), false, 2.7182],
        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
        ["null date", null, true, 1.414]  
    ];
    var result = nodeExcel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
});

app.listen(3000);
console.log('Listening on port 3000');
```
** 分析生成excel流程：**
1.配置excel文件名conf.name
2.设置表caption，每列单元格数据类型，宽度
3.填充表中每行数据conf.rows，nodeExcel.execute生成数据结构，设置头部，拼接生成表


**写在最后，以上仅为个人观点，如有纰漏之处，欢迎各位大侠拍砖！** 




参考资料：
- [Node-Excel-Export excel导出](https://github.com/functionscope/Node-Excel-Export)
- [node.js读写excel文件](https://segmentfault.com/a/1190000004062768)
- [JS-XLSX读取和解析Excel表格文件(xls/xlsx)的JavaScript插件](http://www.uedsc.com/js-xlsx.html) 
- [在 Node.js 中利用 js-xlsx 处理 Excel 文件](http://scarletsky.github.io/2016/01/30/nodejs-process-excel/) 
- [node-xlrd](https://segmentfault.com/a/1190000004062768)
- [excel-parser](https://github.com/leftshifters/excel-parser)
- [FileSaver浏览器保存excel](https://github.com/eligrey/FileSaver.js/) 
- [stackoverflow xlsx相关问题](http://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json) 
