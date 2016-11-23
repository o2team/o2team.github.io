title: Webpack 实用配置技巧
subtitle: 如果你准备在自己的生产项目中使用Webpack，本文肯定会对你有所帮助！
cover: http://ww3.sinaimg.cn/large/66f2e5a7jw1f9n00j2uwnj20p00dwt9n.jpg
categories: Web开发
tags:
  - Webpack
  - 模块打包工具
  - Webpack 配置技巧
author:
  nick: Simba
  github_name: Simbachen
wechat:
    share_cover: http://ww2.sinaimg.cn/large/66f2e5a7gw1f9m525uohdj205k05kmx2.jpg
    share_title: Webpack 实用配置技巧
    share_desc: 从基础使用到配置技巧，如果你准备在自己的生产项目中使用Webpack，本文肯定会对你有所帮助！
date: 2016-11-14 16:16:31

---

### 前言

**Webpack做了什么**

一句话简单来解释就是处理模块依赖，并将它们合并成可用的静态资源。

**为什么选Webpack**

模块打包工具有很多，Webpack的特点是它依赖的模块可以是js文件，也可以是css文件，只要配置对应的webpack-loader(加载器)，.coffee、.sass、.jade等等任意的静态资源文件都可以被引用，并解析。

>例如：我在项目中使用Vue框架，在配置官方提供的loader后，就可以直接在js中依赖.vue后缀的单文件组件了。


### 上手

**安装**
1. 使用npm init命令来创建一个package.json文件
2. 安装Webpack，推荐只安装在当前项目中作为依赖

	npm install webpack --save
	
**添加一个配置文件 webpack.config.js**


	module.exports = {
    	entry: "./entry.js",
    	output: {
        	path: __dirname,
        	filename: "bundle.js"
    	},
    	module: {
        	loaders: [
            	{ test: /\.css$/, loader: "style!css" }
        	]
    	}
	};


**执行webpack命令**

>如果全局安装了Webpack的话,那么直接在当前项目执行webpack命令就可以依赖上述webpack.config.js文件中的配置，分析entry.js中的依赖，打包输出bundle.js


我使用npm scripts来启动任务，在package.json中添加：

	{
  	  ...
  	  "scripts": {
  	  	"build": "NODE_ENV=production webpack --watch"
  	  }
  	  ...
	}

执行npm run build。其中--watch参数表示持续的监听文件变化进行打包。

### 入口文件配置

**配置多个入口文件**


	module.exports = {
    	entry: {
    		entry1_bundle: "./entry1.js",
    		entry2_bundle: "./entry2.js"
    	},
    	output: {
        	path: __dirname,
        	filename: "[name].js"
    	},
    	module: {
        	loaders: [
            	{ test: /\.css$/, loader: "style!css" }
        	]
    	}
	};



在这个配置文件中有两个入口文件，输出的时候[name]会被替换为入口中配置的entry1_bundle和entry2_bundle

**使用glob方式配置**

	var path = require('path'),
  		glob = require('glob')  //需安装glob模块依赖
  
  	function getEntries (globPath) {
      var files = glob.sync(globPath);
      var _entries = {}, entry, dirname, basename;

      for (var i = 0; i < files.length; i++) {
          entry = files[i];
          dirname = path.dirname(entry);
          basename = path.basename(entry, '.js');
          _entries[path.join(dirname, basename)] = './' + entry;
      }
      return _entries;
  	}
	
	
执行getEntries('*.js')就会遍历到目录下全部的js文件做为入口文件配置。


### 使用插件

目前我有用到三个插件：CommonsChunkPlugin，UglifyJsPlugin，以及一个我自己定义的插件

	module.exports = {
		// plugins 字段传入一个数组，里面是实例化后的各种插件
		plugins: [new webpack.optimize.CommonsChunkPlugin({
      		name: 'vendor',
      		minChunks: 3
    	}),
    	new webpack.optimize.UglifyJsPlugin([options]),
    	
    	...
    	],
    	entry: {
    		entry1_bundle: "./entry1.js",
    		entry2_bundle: "./entry2.js"
    	},
    	...
	};



**提取公用资源**

为了便于使用缓存，我通过CommonsChunkPlugin这个插件将公用部分提取出来。

上述配置会自动的将被3个及以上入口文件引用的资源提取出来到一个新的文件vendor.js中。我们通常不希望公用的内容发生不预知的变化，这样配置就可以将希望提取出来的内容显性的配置在config文件中：
	
	entry: {
	  vendor: ["vue", "other-lib"],
	  ...
	}
	new CommonsChunkPlugin({
	  name: "vendor",
	  // 将minChunks设置为无穷大，就不会有不期望的内容进入vendor了
	  minChunks: Infinity,
	  
	})


**只在生产环境下启用UglifyJs插件**
	
	var plugins = [new webpack.optimize.CommonsChunkPlugin([options])]
	// npm scripts 配置的参数可以用上了
	if(process.env.NODE_ENV == 'production'){
	  plugins.push(new webpack.optimize.UglifyJsPlugin({
	    compress: {
	      warnings: false
	    }
	  }))
	}

关于UglifyJs的使用就不介绍了，参考[UglifyJS2](https://github.com/mishoo/UglifyJS2#usage)。

**自定义插件**

Webpack提供的插件已足够使用，不过针对不同的业务，我们可能需要定制一些功能，例如我所定制的功能就是在编译资源的同时生成一份用于上传到服务器的md5版本号配置文件。

来一个简单的小栗子，如何开始写一个Webpack插件：

  	var chunkCombo = function(){};
  		chunkCombo.prototype.apply = function(compiler, callback){
    	compiler.plugin("emit", function(compilation, callback){
        	compilation.chunks.map(function(chunk, key){
        
          	var filename = chunk.name + '.shtml';
          	var content = chunk.hash.slice(0,8);
          	
          	// 生成一个对应的新文件存储md5值
          	compilation.assets[filename] = {
            	source: function() {
                	return content;
              	},
              	size: function() {
                	return Buffer.byteLength(content, 'utf8') 
              	}
          	};
        	})
        	callback();
    	});
  		}


随着项目的深度定制和优化，我们可能需要开发更多的插件。

### 配置loaders

有了无所不能的加载器，Webpack可以处理任何类型的静态文件

	module.exports = {
      entry: {
        entry1_bundle: "./entry1.js",
        entry2_bundle: "./entry2.js"
      },
      output: {
          path: __dirname,
          filename: "[name].js"
      },
      module: {
          loaders: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
            //加载器之间用！连接，-loader可以省略不写
            { test: /\.scss$/, loader: 'style!css!sass?sourceMap'},
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}
          ]
      }
  	};


加载器使用前记得先通过npm安装对应的模块，并将依赖添加到package.json文件中，例如：

		npm install vue-loader --save

* vue-loader用于解析.vue单文件组件。
* 有了babel-loader就可以直接使用新的语法特性了。Babel的配置参见[Using Babel](http://babeljs.io/docs/setup/#installation)

### 使用webpack-dev-server

webpack-dev-server是一个轻量的node.js Express服务，通过Socket.IO来实时的通知客户端Webpack编译状态。
安装webpack-dev-server模块，此处不再重复，直接看配置文件：
	
	module.exports = {
      entry: {
        entry1_bundle: "./entry1.js",
        entry2_bundle: "./entry2.js"
      },
      output: {
        	path: __dirname,
        	filename: "bundle.js"
        },
      ...
      devServer: {
      	// serve 的根目录
        contentBase: _contentBase,
        port: 9000,
        // iframe模式和inline模式可选
        inline: true，
        ...
      }
  	};


在package.json中添加：

	{
  		...
  		"scripts": {
    		"dev": "NODE_ENV=dev webpack-dev-server"
  		}
  		...
	}

执行npm run dev 命令后，服务就启动了。访问[http://localhost:9000]()，就可以看到你的应用了。

**定制Express路由**

在inline模式下，需要手动的将用于更新的的脚本引入到页面中：
	

	module.exports = {
      entry: {
        entry1_bundle: "./entry1.js",
        entry2_bundle: "./entry2.js"
      },
      output: {
        	path: __dirname,
        	filename: "bundle.js"
        },
      ...
      devServer: {
      	// serve 的根目录
        contentBase: _contentBase,
        port: 9000,
        // iframe模式和inline模式可选
        inline: true,
        setup: function(app) {
          app.use(function(req, res, next) {
            //...
            return next();
          });
          app.get(['*.shtml','*.html'], function(req, res, next) {
            //...
            
            //将实时更新的脚本引入到页面中
            res.end('<script src="http://localhost:9000/webpack-dev-server.js"></script>')
          })
        }
      }
  	};


关于Express路由的使用，参考[Express Routing](http://expressjs.com/en/guide/routing.html)

在我的项目中，我希望HTML页面在开发环境下和服务器环境下保持一致，因此我在devServer中配置了对HTML页面的解析。

**以上，希望我的Webpack项目配置能对你解决相关问题的时候有所帮助和启发。**


### 参考资料

* [Webpack docs](http://webpack.github.io/docs/)
* [Express Routing](http://expressjs.com/en/guide/routing.html)
* [使用npm scripts替代gulp](https://aotu.io/notes/2016/02/26/use-npm-script-instead-of-gulp/?utm_source=tuicool&utm_medium=referral)