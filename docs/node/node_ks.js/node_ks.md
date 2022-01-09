# Node.js 

@(Node.js)

## 1.nodejs 介绍
### 1.1下载和安装
![Alt text](./1592964631793.png)
![Alt text](./1592964645661.png)
![Alt text](./1592964717248.png)
![Alt text](./1592964833983.png)

### 1.2nodejs和js的区别
![Alt text](./1592964399450.png)
![Alt text](./1592964420532.png)
![Alt text](./1592964440277.png)
![Alt text](./1592964463382.png)
![Alt text](./1592964512798.png)

### 2.3 commonjs

commonjs是node实现模块化的方式，具体见es6

### 2.4 debugger

1.直接使用vscode打断点即可

![image-20211121165328532](node_ks.assets/image-20211121165328532.png)

2. debuger之inspect协议

之后遇到了再看看吧

### 2.5 server端和前端开发的区别
![Alt text](./1592967391161.png)
![Alt text](./1592967424298.png)
![Alt text](./1592967446393.png)
![Alt text](./1592967526682.png)
![Alt text](./1592967596394.png)
![Alt text](./1592967694995.png)
![Alt text](./1592967759607.png)
![Alt text](./1592967824865.png)
![Alt text](./1592967901197.png)

## 2.项目介绍
### 2.1需求分析
![Alt text](./1592968058006.png)
一个项目的诞生到上线是一个很长的流程，开发只是很小的一部分
![Alt text](./1592968181377.png)
![Alt text](./1592968260856.png)
![Alt text](./1592968368164.png)
![Alt text](./1592968382352.png)
![Alt text](./1592968395577.png)
![Alt text](./1592968409281.png)
![Alt text](./1592968422983.png)
![Alt text](./1592968465820.png)
### 2.2技术方案
![Alt text](./1592968560259.png)
![Alt text](./1592968613590.png)
![Alt text](./1592968627095.png)
![Alt text](./1592968705837.png)
![Alt text](./1592968749596.png)
![Alt text](./1592968917077.png)

## 3.开发接口
### 3.1 http概述
![Alt text](./1592969085646.png)
![Alt text](./1592969161681.png)
请求实例
![Alt text](./1592969221040.png)
DNS解析：
* DNS缓存
* DNS查找
TCP三次握手连接：
### 3.2 处理get请求
![Alt text](./1592969575781.png)
![Alt text](./1592969590960.png)
![Alt text](./1592969735488.png)
![Alt text](./1592969753473.png)

### 3.3 处理post请求
![Alt text](./1592976428005.png)
![Alt text](./1592976570149.png)
![Alt text](./1592978063783.png)
![Alt text](./1592978095169.png)
### 3.4搭建开发环境
![Alt text](./1592979224828.png)

1. Cross-env

由于不同的操作系统进行环境变量配置的方式是不同的，使用cross-env 设置环境变量可以兼容这些差异。

比如：cross-env NODE_ENV=dev nodemon ./bin/www.js

使用cross-env设置环境变量 NODE_ENV 为 dev

当然也可以设置别的环境变量比如 cross-env FIRST_ENV=one SECOND_ENV=two node ./my-program

2. nodemon

本来应该用node 运行文件运行

现在用nodemon 运行文件 运行就可以监听运行文件的变化重启服务

### 3.5开发接口
![Alt text](./1592985247699.png)
![Alt text](./1592985298902.png)
## 数据库的连接
### 1 Mysql介绍
![Alt text](./1593056915542.png)
## 登陆(cookie)
![Alt text](./1593140800591.png)
![Alt text](./1593140859493.png)
![Alt text](./1593140964378.png)
![Alt text](./1593141028486.png)
![Alt text](./1593141429133.png)
注意是发送请求域名的cookie
![Alt text](./1593141488064.png)
![Alt text](./1593141570250.png)
1:直接在浏览器network中查看请求响应头
请求头中有cookie字段
相应头中有set-cookie字段
2:application中的storage查看
3:document.cookie
document.cookie = 'key:val;'
在客户端累加cookie
即使后端已经设置了httponly也可以累加只是不能修改，在服务器端会用最后的username来覆盖掉客户端设置的username
![Alt text](./1593141936642.png)
![Alt text](./1593153241350.png)
注意

## Session
![Alt text](./1593153537074.png)
session解决用户隐私安全和cookie的容量问题
![Alt text](./1593153550717.png)
![Alt text](./1593157802606.png)
![Alt text](./1593157879381.png)
stack中为基础类型变量
heap为引用类型
![Alt text](./1593157933483.png)
![Alt text](./1593158063551.png)
![Alt text](./1593158727949.png)
![Alt text](./1593158769144.png)
![Alt text](./1593158785727.png)
![Alt text](./1593158990859.png)
大不了重新登陆即可，所以断电了也没关系（其实可以配置让他断电也可）
![Alt text](./1593159106730.png)
![Alt text](./1593160380859.png)
![Alt text](./1593160435102.png)
## 与前端联调
![Alt text](./1593170466007.png)
![Alt text](./1593174493665.png)
![Alt text](./1593174504796.png)
![Alt text](./1593393438785.png)
## 日志
![Alt text](./1593393727896.png)
![Alt text](./1593393823616.png)
![Alt text](./1593393877249.png)
日志很大redis太贵没必要
mysql是关系型数据库，是key value的，成本高没必要
应该用文件来存储日志，便宜，可迁移
![Alt text](./1593395763163.png)
![Alt text](./1593395783399.png)
![Alt text](./1593395943597.png)
![Alt text](./1593395973123.png)
解决网络IO，解放CPU内存
![Alt text](./1593396075467.png)
![Alt text](./1593396452153.png)

读文件和写文件 readStream通过pipe管道把值传给writeStream

![Alt text](./1593396534899.png)
![Alt text](./1593397786125.png)
![Alt text](./1593398000029.png)
操作系统脚本来做
![Alt text](./1593398364163.png)
![Alt text](./1593398860140.png)

## 安全
![Alt text](./1593398985064.png)
![Alt text](./1593399037016.png)
![Alt text](./1593399154521.png)
![Alt text](./1593405781328.png)
![Alt text](./1593405811064.png)
解决：使用xss包对存入的数据进行转义
![Alt text](./1593407895763.png)
## 基础总结
![Alt text](./1593409422442.png)
![Alt text](./1593409592479.png)
![Alt text](./1593409759540.png)
内存不够，网络IO不够
优化：stream来优化有限的带宽和内存
扩展：redis
![Alt text](./1593409866889.png)

## Express
![Alt text](./1593428044828.png)

![Alt text](./1593428262876.png)

![image-20211124130140032](node_ks.assets/image-20211124130140032.png)

![Alt text](./1593433707245.png)
![Alt text](./1593435915596.png)
![Alt text](./1593435945646.png)
![Alt text](./1593480689875.png)
![Alt text](./1593481667600.png)
![Alt text](./1593482127488.png)

### Express的实现

```js
const http = require('http')
const slice = Array.prototype.slice

class LikeExpress {
    constructor() {
        // 存放中间件的列表
        this.routes = {
            all: [],   // app.use(...)
            get: [],   // app.get(...)
            post: []   // app.post(...)
        }
    }

  // 根据传入的参数不同生成不同存储执行函数的对象
    register(path) {
        const info = {}
        // 如果第一个参数是string,则第一个参数是路径
        if (typeof path === 'string') {
            info.path = path
            // 从第二个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 1)
          // 否则第一个参数就是要执行的函数
        } else {
            info.path = '/'
            // 从第一个参数开始，转换为数组，存入 stack
            info.stack = slice.call(arguments, 0)
        }
        return info
    }

  // use方法是把生成的函数对象push进入all数组中
    use() {
        const info = this.register.apply(this, arguments)
        this.routes.all.push(info)
    }
  // get方法是把生成的函数对象push进入get数组中
    get() {
        const info = this.register.apply(this, arguments)
        this.routes.get.push(info)
    }
  
  // 同理
    post() {
        const info = this.register.apply(this, arguments)
        this.routes.post.push(info)
    }
  
	// 从this.routes中匹配到对应的能匹配路由的执行函数
    match(method, url) {
        let stack = []
        if (url === '/favicon.ico') {
            return stack
        }

        // 获取 routes
        let curRoutes = []
        curRoutes = curRoutes.concat(this.routes.all)
        curRoutes = curRoutes.concat(this.routes[method])

      // 遍历routes, 把能匹配上路由的对象中的方法取出
        curRoutes.forEach(routeInfo => {
            if (url.indexOf(routeInfo.path) === 0) {
                // url === '/api/get-cookie' 且 routeInfo.path === '/'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api'
                // url === '/api/get-cookie' 且 routeInfo.path === '/api/get-cookie'
                stack = stack.concat(routeInfo.stack)
            }
        })
        return stack
    }

    // 递归执行的中间件方法
    handle(req, res, stack) {
        const next = () => {
            // 拿到第一个匹配的中间件
            const middleware = stack.shift()
            if (middleware) {
                // 执行中间件函数，并且这个中间件函数传入了next方法可以在这个中间件方法执行的过程选择随时中去执行下一个中间件方法，当下一个执行完了再接着执行自己的
                middleware(req, res, next)
            }
        }
        next()
    }

  // 监听到请求过后的回调函数
    callback() {
        return (req, res) => {
            res.json = (data) => {
                res.setHeader('Content-type', 'application/json')
                res.end(
                    JSON.stringify(data)
                )
            }
            const url = req.url
            const method = req.method.toLowerCase()

            // 根据路由取到能执行的中间件方法合集resultList
            const resultList = this.match(method, url)
            this.handle(req, res, resultList)
        }
    }

  // 监听端口号执行示例的callback方法
    listen(...args) {
        const server = http.createServer(this.callback())
        server.listen(...args)
    }
}

// 工厂函数:工厂函数是一个最后返回值是对象的函数，但它既不是类，也不是构造函数。 在JavaScript中，任何函数都可以返回一个对象。 但当函数没有使用new关键字时，那它便是一个工厂函数。
module.exports = () => {
    return new LikeExpress()
}
```



## Koa

http://www.ruanyifeng.com/blog/2017/08/koa.html

直接看阮一峰老师的教程就好，实现原理和exporess类似

