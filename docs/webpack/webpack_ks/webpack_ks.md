# Webpack知识总结

## 1. webpack的基本概念

* 什么是webpack以及为什么要使用它？

webpack是一个前端的打包工具。它的使用可以减少因为工程开发中的模块化所引起的文件数量，减少http请求的数量，并且在打包的过程也可以对代码的格式等进行丑化或者对图片进行压缩，进一步减小包体积。

- 出错原因
  - 丢包
  - 语法没用对
  - 版本问题 （主要）
- 代码转化  less / sass / stylus -->css; ts-->js 高版本的JS语法转成低版本
- 代码压缩  html js  css 压缩了
- 代码分割（一个文件中的两个依赖又都依赖同一文件则不会重复打包） 模块合并（模块化开发）
- 热更新（注意与自动刷新是两个概念）
  - 自动刷新是指代码改了过后页面会刷新一下
  - 热更新只是单独更新某一个模块

## 2. 模块化开发

### 2.1 什么是模块化开发

webpack _模块_能以各种方式表达它们的依赖关系。下面是一些示例：

- [ES2015 `import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) 语句
- [CommonJS](http://www.commonjs.org/specs/modules/1.0/) `require()` 语句
- [AMD](https://github.com/amdjs/amdjs-api/blob/master/AMD.md) `define` 和 `require` 语句
- css/sass/less 文件中的 [`@import` 语句](https://developer.mozilla.org/en-US/docs/Web/CSS/@import)。
- stylesheet `url(...)` 或者 HTML `<img src=...>` 文件中的图片链接。

### 2.2 主要的两种模块化开发方式

* common.js
  * 主要用在node上
  * 使用方式
    * 导入  require()
    * 导出  module.exports = {}
* esModule 
  * 主要用在浏览器
  * 使用方式
    * import XXX from './XXX'   XXX是自己随便起的名字； 这种导入对应的导出时 export default
    * import {} from './xxx'  这种导入对应的导出是 export 声明关键字 变量 = xxx
    * import * as  xxx  from './xxx' 这是把所有导出都放到 xxx 这个对象中

## 3. webpack的基本使用

### 3.1 npm等包管理工具的使用

*  cnpm 的安装 
  * npm install -g cnpm --registry=https://registry.npm.taobao.org

*  yarn的安装
  * npm i yarn -g // 可能需要你配置电脑的环境变量

*  cnpm和npm 混用 一般没啥事 但是不能跟yarn混用；尽量不混用

*  npm/cnpm/yarn安装卸载包
  * npm i xxx    npm install xxx  ;;  卸载  npm uninstall xxx

  *  cnpm i xxx    

  * yarn add xxx  // 卸载 yarn remove xxx

### 3.2 安装webpack步骤和基本使用

  - 初始化成一个项目  npm init -y

  - 安装webpack 和 webapack-cli 两个包

      - npm i  webpack webpack-cli  --save-dev // --save 就是说要把当前安装的包的信息存放到package.json中; -dev 相当于告诉webpack 这个包是开发所需要的依赖,会放在devDependencies中
      - npm i  webpack webpack-cli  -D = npm i  webpack webpack-cli  -dev

      * 其实webpack打包是按照依赖打包，所以安装在dependencies和dev~其实无所谓的，反正打包的时侯都会用上

- 使用webpack打包

     - 命令行输入webpack进行打包
     - **注意由于命令行输入执行的方式需要全局安装，所以一般在项目中使用npm run的方式来进行配置，从而局部执行**

* 注意
  * **webpack 是基于node运行的， 他的配置文件 都是需要遵循commonjs规范**
  * webpack  会默认取找 src下的index.js 作为入口文件              

### 3.3 webpack的基本配置和使用

* 配置方式
  * 手动创建一个webpack.config.js文件，所有的配置项都在这个文件中
* 基本入口出口配置

```js
// 这是一个webpack 会默认读取的配置文件
let path = require('path');// path是node自带的一个包

// require  exports  module  __dirname  __filename
//__dirname 当前文件所在文件夹的绝对路径
// __filename 当前文件的绝对路径
console.log('qqqqqq', __dirname, __filename)
console.log(path.resolve(__dirname, 'qwesdfse'))//path.resolve 字符串路径合并

// 这个对象里边都是 webapck的配置项
module.exports = {
  mode: 'production',// 模式 控制是生产环境还是开发环境的 默认是 production ,
  entry: './src/a.js',// 配置 主入口文件的 默认是 './src/index.js'
  output: {
    // 把打包压缩后的代码 放到那个文件 叫什么名字 这里加一个[hash:5]默认添加5位的哈希值从而防止重新上线后客户端因为缓存不更新版本
    filename: 'haha.[hash:5].js',// 默认是 mian.js
    path: path.resolve(__dirname, 'myapp') // 配置的是 把生产好的haha.js放到哪个位置；需要是一个绝对路径
  },
}
```

* 插件的使用plugin
  * 去npm官网上搜索想要的包，官网上有包的使用说明
  * cleanWebpackPlugin:每次清空上一次的打包文件
  * html-webpack-plugin:以一个html文件作为模版最后把打包好的js文件插入其中

```js
// 这是一个webpack 会默认读取的配置文件
let path = require('path');// path是node自带的一个包
const { CleanWebpackPlugin } = require('clean-webpack-plugin');//导入cleanWebpackPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')//以一个html文件作为模版到处一个html文件其中插入了需要的js文件

// require  exports  module  __dirname  __filename
//__dirname 当前文件所在文件夹的绝对路径
// __filename 当前文件的绝对路径
console.log('qqqqqq', __dirname, __filename)
console.log(path.resolve(__dirname, 'qwesdfse'))//path.resolve 字符串路径合并

// 这个对象里边都是 webapck的配置项
module.exports = {
  mode: 'production',// 模式 控制是生产环境还是开发环境的 默认是 production ,
  entry: './src/a.js',// 配置 主入口文件的 默认是 './src/index.js'
  output: {
    // 把打包压缩后的代码 放到那个文件 叫什么名字 这里加一个[hash:5]默认添加5位的哈希值从而防止重新上线后客户端因为缓存不更新版本
    filename: 'haha.[hash:5].js',// 默认是 mian.js
    path: path.resolve(__dirname, 'myapp') // 配置的是 把生产好的haha.js放到哪个位置；需要是一个绝对路径
  },
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ //规定导出html文件的格式
        filename: 'test.html',
        template: 'src/public/index.html'
      })
  ]
}
```
* 区分配置文件：webpack-merge包

  * 目录结构

    ![image-20210117154705957](/Users/zhouxihang/Library/Application Support/typora-user-images/image-20210117154705957.png)
	  
	*  代码

```js
//webpack.base.js	
let path = require('path');

  module.exports = {
    entry: './src/a.js',
    output: {
      filename: 'haha.[hash:5].js',
      path: path.resolve(__dirname, '../myapp') //注意目录文件位置
    },
  }

//webpack.dev.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.base')

module.exports = merge(base,{
  mode: 'development',
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
        filename: 'test-dev.html',
        template: 'public/index.html'
      })
  ]
})

//webpack.pro.js
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');

module.exports = merge(base,{
  mode: 'production',
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
        filename: 'test-pro.html',
        template: 'public/index.html'
      })
  ]
})

//配置package.json
{
  "name": "webpack01",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack --config ./config/webpack.pro.js",
    "dev": "webpack --config ./config/webpack.dev.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^5.15.0",
    "webpack-cli": "^4.3.1"
  },
  "dependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "html-webpack-plugin": "^4.5.1",
    "webpack-merge": "^5.7.3"
  }
}
```

### 3.4 webpack server

Web pack server是一个web pack自带的服务,利用本级构建一个服务器

#### 3.4.1 使用方式

npm安装webpack-dev-server,命令行输入webpack-dev-server，可以跟上--config指定配置文件路径

> webpack-dev-server --config config/webpack.dev.js

注意：

* Webpack-dev-server执行后打包后的html文件会放在内存中，文件目录中看不到
* 要访问打包后的html文件直接是用 host/文件名.html 访问，不管有没有contentBase

#### 3.4.2 常用配置
```js
//webpack-config-dev配置文件的内容
module.exports = merge(base,{
  mode: 'development',
  plugins:[
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({ 
        filename: 'index.html',
        template: 'public/index.html'
      })
  ],
  devServer:{
    port:9000, // 修改服务的端口号
    https:true,
    open:false, // 服务启动之后 自动打开浏览器
    contentBase:path.resolve(__dirname,'../public'),// 把public下的文件当作唯一可访问的服务器中的文件，并以此为根目录
    // proxy:{//代理写法1
    //   "/api":"https://baidu.com" //只要路径路含有/api的请求 都会被 代理 到  https://baidu.com
    // },
    proxy:{//代理写法2
      'api':{
        target:"https://baidu.com",
        pathRewrite:{//改写/api/haha => /haha 
          '^/api':''
        }
      }
    },
    before:function API(app){//在任何中间件执行前执行，创建假数据
      app.get('/api/haha', function(req, res) {//get指get方法
        res.json({ custom: 'response' });
      });
      app.post('/api/hehe', function(req, res) {//post指post方法
        res.json({ custom: 'qqqqqq' });
      });
    },
  }
})
```

### 3.5 多入口多出口打包

* 多入口
```js
//webpack.base.config.js文件
module.exports = {
  // entry: './src/index.js',
  entry: {
    index: './src/index.js',//为每一个入口命名
    other: './src/other.js',
    common: './src/common.js'
  },
  output: {
  //filename: 'haha.[hash:5].js',
  filename: '[name].[hash:5].js',//name为webpack内置变量,对应上边的index和other
  path: path.resolve(__dirname, '../myapp')
  },
}
```

* 多出口
```js
//webpack.dev.config.js 或者 webpack.pro.config.js
module.exports = merge(base,{
  mode: 'development',
  plugins:[
    new CleanWebpackPlugin(),
    //使用两次HtmlWebpackPlugin去定义不同的出口
    new HtmlWebpackPlugin({ 
        filename: 'index.html',
        template: 'public/index.html',//定义使用的模版html
        chunks:['index','common']//定义要引用的入口js文件
      }),
    new HtmlWebpackPlugin({ 
      filename: 'other.html',
      template: 'public/other.html',
      chunks:['other','common']
    })
  ],
```

### 3.6 CSS/less处理

* CSS加载

  * css-loader加载CSS文件
  * style-loader把CSS文件以style标签的形式插入到CSS文件中

* CSS单独打包成文件导入

  * 使用MiniCssExtractPlugin把CSS以一个文件的形式单拿出来，然后在html文件中以link标签引入

* 不同浏览器的适配

  * 使用posts-loader完成对不同浏览器的自动适配

  * postcss 的配置步骤 可以处理css的不同浏览器兼容写法

    ​    1 - 安装postcss 和 postcss-loader

    ​    2 - 在处理对应的css文件之前 先加上 postcss-loader

    ​    3 - 配置postcss所需要的配置项 postcss.config.js  (需要安装postcss-preset-env) (两种写法：单独拿出一个配置文件或者直接写)

    ​    4 - 设置浏览器的兼容版本  .browserslistrc 文件

*  压缩CSS

  * 使用CssMinimizerPlugin或者OptimizeCssAssetsPlugin
  * 注意配置最好写在optimization中

* less的处理

  * 和CSS类似，只需要多一个less-loader

* 注意

  * **注意loader的加载顺序是从右往左，从下往上的，所以要先用css-loader再用style-loader**

### 3.7 图片的处理

* 使用url-loader
  * 小于limit自动使用base64插入,可以少一次请求
* CSS + 图片处理的配置

```js
let path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');//这个插件可以把CSS单独拿出来成为一个文件，用link导入html
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');


module.exports = {
  // entry: './src/index.js',
  entry: {
    index: './src/index.js',
    other: './src/other.js',
    common: './src/common.js'
  },
  output: {
    //filename: 'haha.[hash:5].js',
    filename: '[name].[hash:5].js',//name为webpack内置变量,对应上边的index和other
    path: path.resolve(__dirname, '../myapp')
  },
  plugins: [new MiniCssExtractPlugin({
    filename: 'css/[name].css'
  })],
  module: {
    rules: [
      {
        test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: ["postcss-preset-env"],
            },
          },
        }]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader, 'css-loader', 'less-loader', 'postcss-loader'
        ]
      },
      {
        test:/\.(jpg|png|jpeg|ico)$/i,
        use:{
          loader:'url-loader',
          options:{
            //如果图片小于limit,会转图片为base64
            // 变成base64是为了减少一次http请求
            limit:100, //单位是b
            name:'img/[name].[ext]'//图片的自定义命名
          }
        }
      }
    ]
  },
  optimization:{
    // 使用OptimizeCssAssetsPlugin压缩CSS的写法
    // minimizer:[
    //   new OptimizeCssAssetsPlugin()
    // ]
    //使用CssMinimizerPlugin的写法
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  }
}
```
### 3.8 js处理

* 压缩js 

  * terser-webpack-plugin插件

```js
  const TerserPlugin = require("terser-webpack-plugin");
  module.exports = {
    optimization:{
    minimize: true,
    minimizer: [
      new TerserPlugin()
    ],
 }
```

* 把js高版本转低版本

  * 使用babel进行转换，有对应的npm包

  * 要用插件babel-loader @babel/core @babel/preset-env

    *  babel的preset（预设）是插件的集合，是一种已经组合好了的插件的组合，如果有一些插件不在preset中可以放在plugins中

  * 在babel/preset-env中没有对应class a { attribute: 1} 这样直接定义属性的写法，可以用@babel/plugin-proposal-class-properties插件

  * 装饰器的语法完善--@babel/plugin-proposal-decorators

    * 注意@babel/plugin-proposal-decorators要写在@babel/plugin-proposal-class-properties的上面

  * async await的语法处理 -- @babel/plugin-transform-runtime

  * **注意babel不能处理node_modules中的文件，不能处理包的js文件,否则可能会有兼容性错误**

    * 应该用exclude排除掉node_modules中的文件

    
```js
//webpack.dev.js配置文件
let path = require('path');
let {CleanWebpackPlugin} = require('clean-webpack-plugin')
let html = require('html-webpack-plugin')

module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:'index.[hash:6].js',
        path:path.resolve(__dirname,'../myapp')
    },
    plugins:[
        new CleanWebpackPlugin(),
        new html({
            template:'./public/index.html',
            filename:'index.html'
        })
    ],
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
                test:/\.js$/,
                use:'babel-loader',
                // use:{//直接写法，也可以单独写在配置文件中
                //     loader:'babel-loader',
                //     options:{
                //         presets: ['@babel/preset-env'],
                //         plugins:[
                //             ["@babel/plugin-proposal-decorators", { "legacy": true }],
                //             ['@babel/plugin-proposal-class-properties',{loose:true}],
                //             ['@babel/plugin-transform-runtime', { corejs: 3 }],
                //         ]
                //     }
                // },
                exclude:/node_modules/ //排除掉
            }
        ]
    },
}

//可以把配置取出单放在根目录下的babel.config.js中
//babel.config.js
module.exports = {
    presets: ['@babel/preset-env'],// 预设插件集合 告诉babel-loader把js转成哪个版本，本质上就是针对一个版本的插件集合
    plugins:[
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ['@babel/plugin-proposal-class-properties',{loose:true}],
        ['@babel/plugin-transform-runtime', { corejs: 3 }],
    ]
}                
```

## 4. webpack的基本优化方式

* Externals 外部扩展

  * 如果整个js包太大不适合全都直接打包成一个js文件，使用externals配置需要抽离的包文件，把这个文件从打包文件中分离
    1. 首先在模版中用script利用cdn引入，需要自己手写
    2.  配置文件中，externals:{'自定义名'：'原全局名'}
    3. 这个时候就可以用采用import '自定义名' 的写法导入这个包

* providePlugin

  * 如果某一个包被很多文件引用，可以使用providePlugin自动引入，不用每次都写import

* resolve.extensions

  * 自动识别文件的后缀，不用自己写后缀了

  * resolve: {

    ​    extensions: ['.wasm', '.mjs', '.js', '.json','.css'],

      },

* resolve.alias

  * 配置绝对路径别名

  * resolve: {

    ​    alias:{

    ​      '@':path.resolve(__dirname,'../src')//在资源文件中引入的时侯@就代表了src的绝对路径，通过绝对路径的查找可以提高查找速度

    ​    }

      },

* sourcemap - webpack-dev-server的一个配置项
  * devtool:'source-map'
  * 有助于调试，因为打包后的文件很乱，这个是为了建立打包后的代码和原代码的一个对应关系

*  resolve.modules属性

  * 配置路径，以后就不用自己再写了，默认有node_modules，所以node_modules不用再引入包的时候写

  *   resolve:{

    ​    modules:[path.resolve(__dirname,'./src/utils'),'node_modules',]

      }

* module.noParse

  * module:{

    ​    noParse:/jquery|lodash'/,//明确告诉webpack 这两个包不依赖其他任何包，所以提高构建速度

      }

* webpack.DefinePlugin插件可以自定义全局变量
  
  * 但是要注意所有的字符串都要用JSON.stringify()包起来，因为所有的语句都会被当成是执行语
*  thread-loader 
  * 多进程打包，可以提升构建速度， vue脚手架已经内置
  * 以前是用的happypack,但是已经被淘汰不维护了
* webapck.ignorePlugin
  * 在打包时忽略指定的文件
  * new webpack.IgnorePlugin(/local/,/moment/)//打包时忽略moment文件夹下的local文件夹，需要的文件夹手动引入即可
  * 减少打包的体积
* optimization.splitChunks 
  
  * 把已经install的包分离出来
* webpack.DullPlugin 结合 DllReferencePlugin

  * 一是实现分包，二是提升构建速度
  * 使用方式
    1. 使用dullPlugin对要提前打包的包进行单独打包
       * 注意单独配置打包文件
       * 在package.json中指定不同的配置文件进行打包运行
    2. 再利用DllReferencePlugin对包进行打包
       * 注意之前用dullPlugin生成的打包文件和manifest.json不应每次被删除
       * 并且在运行的时候提前打包的文件要被contentBase所指定否则内存中没有这两个文件

以上部分的代码配置：
```js
//webpack.config.js
let path = require('path')
let html = require('html-webpack-plugin')
let { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'index.[hash:5].js',
        path:path.resolve(__dirname,'dist')
    },
    // devtool:'source-map',
    plugins:[
        new webpack.DllReferencePlugin({
            //在打包编辑的时侯 先去清单(manifest.json) 中查看有没有这个包
            // 若有 直接跳过 不再打包
            // 若没有 才打对应的包
            manifest:path.resolve(__dirname,'./dist/manifest.json')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns:["**/*","!dll_*","!mani*"]
        }),
        new html({
            template:"./public/index.html",
            filename:'index.html'
        }),
        new webpack.DefinePlugin({
            BASEURL:JSON.stringify('https://baidu.com'),
            OPTIONS:{
                a:JSON.stringify('航')
            }
        }),
        new webpack.IgnorePlugin(/local/,/moment/)//打包时忽略moment文件夹下的local文件夹，需要的文件夹手动引入即可
    ],
    resolve:{
        modules:[path.resolve(__dirname,'./src/utils'),'node_modules',]
    },
    module:{
        noParse:/jquery|lodash'/,//明确告诉webpack 这两个包不依赖其他任何包，所以提高构建速度
    },
    optimization:{
        splitChunks:{
            chunks:'all',
            minSize:5000,//最小5kb
            minChunks:1,//最小引用次数
            cacheGroups:{
                //缓存组，符合这些条件生成的包在后续打包的过程中可以直接走这个缓存
                jquery123:{
                   // name:"jquery234",
                    filename:'[name].bbb.js',//定义这个组里面的文件名
                    test:/jquery/,//凡事符合这个正则表达式的属于jquery123这个缓存组
                    chunks:'all'
                }
            }
        }
    },
    devServer:{
        contentBase:'dist',//指定contentBase中的文件为server的资源文件来源
    }
}

//package.json
{
  "name": "webpack04",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "build": "webpack --mode=production",
    "dev": "webpack-dev-server --mode=development",
    "build:vue": "webpack --config vue.dll_config.js"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.12.10",
    "@babel/plugin-proposal-decorators": "^7.12.12",
    "@babel/plugin-syntax-decorators": "^7.12.1",
    "@babel/plugin-transform-runtime": "^7.12.10",
    "@babel/preset-env": "^7.12.11",
    "babel-loader": "^8.2.2",
    "clean-webpack-plugin": "^3.0.0",
    "css-loader": "^5.0.1",
    "html-webpack-plugin": "^4.5.1",
    "style-loader": "^2.0.0",
    "webpack": "^4.43.0",
    "webpack-cli": "^3.3.0",
    "webpack-dev-server": "^3.11.2"
  },
  "dependencies": {
    "-": "^0.0.1",
    "@babel/plugin-proposal-class-properties": "^7.12.1",
    "@babel/runtime": "^7.12.5",
    "@babel/runtime-corejs3": "^7.12.5",
    "jquery": "^3.5.1",
    "loadash": "^1.0.0",
    "moment": "^2.29.1",
    "vue": "^2.6.12"
  }
}

//vue.dll_config.js
let path = require('path')
let {CleanWebpackPlugin} = require('clean-webpack-plugin')

let webpack = require('webpack');
module.exports = {
  mode:'production',
  entry:{
    vue:['vue']
  },
  output:{
    filename:"dll_[name].js",
    path:path.resolve(__dirname,'dist'),
    library:'dll_[name]'
  },
  plugins:[
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name:'dll_[name]', // 需要跟上边的library保持一致
      path:path.resolve(__dirname,'dist','manifest.json')
    })
  ]
}

// 这个配置文件目前就是把vue单独打包成了一个文件
```

