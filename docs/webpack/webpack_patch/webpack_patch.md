# Webpack知识补丁
## 1. 你用过哪些loader/plugins?

1. webpack基本使用

   * 基本出入口的配置（单js文件）
   * json/script的配置
   * cleanWebpackPlugin:清除打包文件
   * html-webpack-plugin：以html文件作文模版
   * 区分配置文件：webpack-merge

   

## 2.CommonJS和ESmodule

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