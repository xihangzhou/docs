# Http_Request

每一个前端项目都免不了和发送接收请求打交道，这里来看项目中的请求方案，也就是小程序的请求方案。

## 小程序提供的原生方案

https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html

这种方案太简单单薄：

* callback 的调用方式，容易造成 callback hell。

* get 请求和 post 请求，需要自行处理参数传递方式。

* 返回结果较底层，在业务开发中，对基本的 http status 需要手动处理。

*  实际业务开发中，无法满足对网关层的切面编程。

## Flyio

https://wendux.github.io/dist/#/doc/flyio/readme

Flyio是一个http库，用promise的方式支持http请求的发送。支持常见的发送请求的方式比如拦截器，并且引入了**engine的机制**，这个让这个库可以对任意发起请求的方式进行封装。这个库的实现是比较有意思的，之后可以阅读源码学习学习。

* 拦截器只支持单例即一个fly实例只有一个拦截器，这不利于抽象拦截器的逻辑。

* 使用方式还不足够简便，实际业务开发中，每次使用都需要引入 api url constant，和 fly 实例。

*  对于企业级应用，还有很多的工作要做。

## HttpClient

基于flyio进行一个新的封装，让flyio的使用更加的简单。在这个httpClient中维护了一个拦截器的队列让让一个fly实例可以对应多个拦截器，还可以对应不同的请求路径添加拦截器的拦截逻辑。拦截器的执行顺序先全局，后自定义，具体见readme。

详情参考同目录下的readme文件

[Http_Client](./http_client.md)

## 业务层再进行使用的封装

在业务层中提供了一个api.js文件存储每一个请求的配置信息，通过遍历这个配置信息来注册api。并且在httpClient初始化的过程中注册拦截器。在we-retail中没有对对应的url路径做出拦截动作，主要是通过api.ts中的config信息来决定是否要拦截的。

注意如果要发起动态的路径请求就不需要在api.ts中写配置信息的方式来发起请求。

