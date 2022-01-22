# 接口代理 HttpClient

## 背景

1. 微信小程序的 `wx.request` 太单薄

   1. callback 的调用方式，容易造成 callback hell。
   2. get 请求和 post 请求，需要自行处理参数传递方式。
   3. 返回结果较底层，在业务开发中，对基本的 http status 需要手动处理。
   4. 实际业务开发中，无法满足对网关层的切面编程。
2. [fly.js](https://wendux.github.io/dist/#/doc/flyio/readme) 能对 `wx.request` 进行更高一级的包装，提供了 Promise 链式调用，拦截器等功能，但是存在以下问题：

   1. 拦截器只支持单例，且是静态时，如果网关层逻辑复杂，会造成代码耦合严重。
   2. 使用方式还不足够简便，实际业务开发中，每次使用都需要引入 api url constant，和 fly 实例。
   3. 对于企业级应用，还有很多的工作要做。
3. 在实际的企业级业务开发中，往往会有：鉴权、接口日志、接口协议、状态码处理、接口缓存、业务接口集中管理等通用场景需要满足。

## 功能与设计

针对 `wx.reqeust` 和 `fly.js` 的局限性，结合通用的企业级开发需要，通过设计一层「接口代理层 HttpClient」来消化业务接口与业务逻辑之间的问题。业务只需关心两个事情：

1. 请求哪个接口，入参是什么。
2. 接口返回业务数据是什么。

### 目标

1. 内核由 fly.js 驱动
2. 支持串行异步拦截器，满足对网关层的切面编程需要，提供更好的代码解耦能力。
3. 提供的业务接口的集中管理
4. 内建常用拦截器：
   1. 头部注入
   2. 请求体注入
   3. 动态 baseURL
   4. Http 日志打印
   5. (TODO) Http 状态码处理
   6. (TODO) 接口数据缓存
   7. (TODO) 请求阻断问题

### 实现拦截器异步串行

启发于 [Koa](https://koajs.com/) 的洋葱模型：

![](https://bluesun-1252625244.cos.ap-guangzhou.myqcloud.com/img/20200827101330.png)

我们期望一个拦截器的逻辑能满足单一原则，例如一个缓存拦截器：

1. 在 request 阶段，它能够先读取缓存，返回结果。
2. 在 resposne 阶段，它能够把接口数据缓存起来，供下一次使用。

这是一个高度解耦的逻辑，封装这部分逻辑，是一个很常见的需求。

所以，我们期望它能够可插拔式的使用，例如：

```javascript
httpClient.registerInterceptors({
  request: req => {
    //  读取缓存，返回结果
  },
  response: res => {
    // 数据缓存起来
  }
});
```

**RetailWe HttpClient** 由 fly.js 内核驱动，实现了多个拦截器的串行，同时支持异步。

内部维护了两个队列：

1. 全局拦截器：为所有 api 接口配置拦截器
2. api 级拦截器：可以为单个业务接口配置拦截器

执行顺序：api request → 全局 request → 全局 response → api response

![RetaiWe HttpClient](https://bluesun-1252625244.cos.ap-guangzhou.myqcloud.com/img/20200826210117.png)

## 安装

```shell
npm install @tencent/retailwe-common-libs-http-client
```

## 使用

### 1. 快速使用

```javascript
import { HttpClient } from '@tencent/retailwe-common-libs-http-client';

const httpClient = new HttpClient({
  config: {
    baseURL: 'https://myapi.com'
  }
});

// 注册 API
const getUser = httpClient.registerApi({
  url: '/user/get',
  config: {
    method: 'post'
  }
});

// 发起请求
const res = await getUser({ name: 'jc' });
```

### 2. 注册 API

1. 静态注册 API

   ```javascript
   // 注册 API，返回 api function
   const getUser = httpClient.registerApi({
     url: '/user/get',
     config: {
       method: 'post'
     }
   });

   // 发起请求
   const res = await getUser({ name: 'jc' });
   ```
2. 动态注册 API

   使用 `httpClient.fetch()`，会自动判断 API 是否已注册

   1. 已注册，取出 api，发起请求。
   2. 未注册，会先注册，保存，然后再发起请求。

   ```javascript
   const res = await httpClient.fetch({
     url: '/user/get',
     config: {
       method: 'post'
     }
   });

   // 简易写法
   const res = await httpClient.fetch('/user/get', { name: 'jc' });
   ```

### 3. 注册拦截器

使用拦截器之前，建议先搞懂 [flyjs-interceptor](https://wendux.github.io/dist/#/doc/flyio/interceptor)

1. 注册全局拦截器

   ```javascript
   const httpClient = new HttpClient({
     interceptors: [
       {
         request: req => console.log('in request'),
         response: res => console.log('in response'),
         responseErr: err => console.log('in responseErr')
       }
     ]
   });
   ```
2. 动态注册拦截器

   ```javascript
   httpClient.registerInterceptor({
     request: req => console.log('in request'),
     response: res => console.log('in response'),
     responseErr: err => console.log('in responseErr')
   });
   ```
3. 注册 API 拦截器

   ```javascript
   const getUser = httpClient.registerApi({
     url: '/user/get',
     interceptors: [
       {
         request: req => console.log('in request'),
         response: res => console.log('in response'),
         responseErr: err => console.log('in responseErr')
       }
     ]
   });
   ```
4. 注册多个拦截器

   以上 interceptors 类型是数组，支持传入多个拦截器，拦截器会串行执行，例如：

   ```javascript
   const httpClient = new HttpClient({
     interceptors: [
       {
         request: req => console.log('in request A'),
         response: res => console.log('in response A'),
         responseErr: err => console.log('in responseErr A')
       },
       {
         request: req => console.log('in request B'),
         response: res => console.log('in response B'),
         responseErr: err => console.log('in responseErr B')
       }
     ]
   });
   ```

### 4. 配置

配置继承于 flyio 的配置：[flyio-请求配置](https://wendux.github.io/dist/#/doc/flyio/config)，类型定义：

```javascript
export interface IFlyConfig {
  // 请求方法，默认 get
  method?: string;

  // http请求头
  headers?: object;

  // 请求基地址
  baseURL?: string;

  // 超时时间，为0时则无超时限制
  timeout?: number;

  // 是否自动将Content-Type为“application/json”的响应数据转化为JSON对象，默认为true
  parseJson?: boolean;

  // 开启 http2，默认false
  enableHttp2?: boolean;

  // 开启 quic，默认false
  enableQuic?: boolean;

  // 开启 cache，默认false
  enableCache?: boolean;

  // 支持自定义参数
  [propName: string]: any;
}
```

1.  全局配置

   ```javascript
   const httpClient = new HttpClient({
     config: {...},
   });
   ```
2. API 配置

   ```javascript
   httpClient.registerApi({
       url: '/user/get',
       config: {...},
   })
   ```
3. 运行时配置

   **静态 API**

   ```javascript
   const getUser = httpClient.registerApi({
     url: '/user/get',
     config: {...}
   });

   const res = await getUser({ name: 'jc' }, config);
   ```

   **动态 API**

   ```javascript
   const res = await httpClient.fetch('/user/get', { name: 'jc' }, config);
   ```

### 5. 内建拦截器

HttpClient 提供了常用的内建拦截器：

```javascript
import { interceptors, HttpClient } from '@tencent/retailwe-common-libs-http-client';

const httpClient = new HttpClient({
    interceptors: [{
        // 动态设置 baseURL，支持异步
        interceptors.baseURL(async () => 'https://myapi.com'),

        // 动态注入请求头，支持异步
        interceptors.injectReqHeaders(async () => ({ token: 'abc' })),

        // 动态注入请求体，支持异步
        interceptors.injectReqBody(async () => ({ token: 'abc' })),

        // 日志打印
        interceptors.httpLogger();
    }]
})
```

### 6. TS 类型

提供内建的 TS 类型定义，如创建自定义拦截器：

```javascript
import { IInterceptor } from '@tencent/retailwe-common-libs-http-client';

export default function genInterceptor(): IInterceptor {
  return {
    name: 'custemInterceptor',
    request: async res => {...},
    response: async res => {...},
    responseError: async res => {...},
  };
}
```

更多类型，见 API 文档：[API](modules/_index_.html)

## API

[API](modules/_index_.html)

## 单元测试覆盖率

[单元测试覆盖率](cov/index.html)
