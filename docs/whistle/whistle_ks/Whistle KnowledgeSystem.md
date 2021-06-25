# Whistle KnowledgeSystem

## 关于whistle

### whistle简介

类似的工具有Windows平台上的[Fiddler](http://www.telerik.com/fiddler/)，主要用于查看、修改HTTP、HTTPS、Websocket的请求、响应，也可以作为HTTP代理服务器使用，不同于Fiddler通过断点修改请求响应的方式，whistle采用的是类似配置系统hosts的方式，一切操作都可以通过配置实现，支持域名、路径、正则表达式、通配符、通配路径等多种[匹配方式](http://wproxy.org/whistle/pattern.html)，且可以通过Node模块[扩展功能](http://wproxy.org/whistle/plugins.html)。

文档：

http://wproxy.org/whistle/install.html

### whistlede的基本匹配rule

##  安装启动

见文档

## 快速上手/whistle的应用

1. 设置hosts，相当于修改hosts文件强行定义DNS解析

http://wproxy.org/whistle/rules/host.html 详细使用方式看此处

2. 本地文件或文件路径替换，协议头可以加也可以不加，不加表示匹配所有协议，否则只对某个协议生效。类似willow的路径替换。

```shell
ctc.i.gtimg.cn/qzone/biz/gdt/atlas/mod/message.html  C:\Users\ouvenzhang\Desktop\edit.html # 单个文件的本地替换 
ctc.i.gtimg.cn/qzone/biz/   C:\Users\ouvenzhang\Desktop\biz\build\  # 文件路径的替换，一般用这条就可以了 
http://ctc.i.gtimg.cn/qzone/biz/ C:\Users\ouvenzhang\Desktop\biz\build\   #只针对http请求的文件路径替换
```

3. 请求转发，将指定域名请求转发到另一个域名

   ```shell
   www.qq.com ke.qq.com # 指定域名转发生效
   **.qq.com ke.qq.com  # 所有qq.com子域名转发生效
   ```

A B 将A这个指定域名转发到B，这个和host不同不能够交换AB的顺序。

4. 脚本注入，可以将一段脚本（可以使html、js、CSS片段）注入到dom页面中进行调试

```
ke.qq.com html://E:\xx\test\test.html 
ke.qq.com js://C:\Users\ouvenzhang\Desktop\gdt\console.js 
ke.qq.com css://E:\xx\test\test.css
```

5. 匹配模式

所有的操作匹配都可以使用正则进行

6. 忽略特性的请求内容

7. 请求改写与接口mock ❓

8. 远程手机调试
9. 设置https代理

## 配置方式

`pattern operatorURI`或组合方式`pattern operatorURI1 operatorURI2 operatorURI3`

如果只有一个operatorURI的情况下pattern和operatorURI的位置常常可以对调，但是如果pattern和operatorURI都是url，即如上请求转发的情况所示，这两者的位置就不能调整否则会产生歧义。之所以支持位置的调换是因为原生的hosts文件的书写顺序是`operatorURI pattern `，为了可以向原生的hosts文件对齐所以在whistle中两种书写顺序都支持。

### whistle的配置方式：

1. 默认方式

默认是将匹配模式写在左边，操作uri写在右边

```
 pattern operatorURI
```

2. 传统的hosts方式

传统方式指的是传统的hosts配置方式，操作URI写在左边

```
 operatorURI pattern
```

如果pattern为路径或域名，且operatorURI为域名或路径

```
 www.test.com www.example.com/index.html
 http://www.test.com www.example.com/index.html
```

这种情况下无法区分pattern和operatorURI，whistle不支持这种传统的方式，只支持默认方式

3. 组合方式

传统hosts的配置对多个域名对于同一个ip可以采用这种方式：

```
 127.0.0.1  www.test1.com www.test2.com www.testN.com
```

whistle完全兼容传统hosts配置方式，且支持更多的组合方式：

```
 # 传统组合方式
 pattern operatorURI1 operatorURI2 operatorURIN

 # 如果pattern部分为路径或域名，且operatorURI为域名或路径
 # 这种情况下也支持一个操作对应多个pattern
 operatorURI pattern1 pattern2 patternN
```

[whistle v1.13.4](http://wproxy.org/whistle/update.html)及以上版本支持，配置换行：

```
www.test.com file://(test) filter://*/cgi-bin
# 等价于
line`
www.test.com file://(test)
filter://*/cgi-bin
`
# 或
line`
www.test.com
file://(test)
filter://*/cgi-bin
`
```

## 匹配模式
`pattern`就是我们上面所看到的配置方式中的`pattern`,在这里我们将详细解析`pattern`的匹配规则。

>  HTTPS、Websocket需要[开启HTTPS拦截](http://wproxy.org/whistle/webui/https.html)才可以正常抓包及使用所有匹配模式，否则只能用域名匹配
>
> 有些老版本可能不支持以下的某种匹配模式，遇到这种情况可以[升级下whistle](http://wproxy.org/whistle/update.html)即可。

whistle的匹配模式(`pattern`)大体可以分成 **域名、路径、正则、精确匹配、通配符匹配**：

其中 正则匹配、精确匹配、通配符匹配支持取非，即 `!pattern`，表示不匹配 `pattern` 关键字符。其他的一些匹配符号如下所示：`^`（通配路径表示符）、`$`（精确匹配）、`*`（通配符）、`!`（取非）

### 域名匹配

域名匹配，不仅支持匹配某个域名，也可以限定端口号以及协议，比如`http`、`https`、`ws`、`wss`、`tunnel`等协议，如果`operatorURI`不只是url，pattern和operatorURI位置可以调换,如上传统方式所述。

```bash
# 匹配域名www.test.com下的所有请求，包括http、https、ws、wss，tunnel
www.test.com operatorURI

# 匹配域名www.test.com下的所有http请求
http://www.test.com operatorURI

# 匹配域名www.test.com下的所有https请求
https://www.test.com operatorURI

# 上述匹配也可以限定域名的端口号
www.test.com:8888 operatorURI # 8888端口
www.test.com/ operatorURI # http为80端口，其它443端口

# 这种情况不能交换顺序
www.test.com www.example.com/index.html
```

### 路径匹配

匹配某一个路径，可以选择指定域名，协议，端口号等也可以不指定。

```
# 限定请求协议，只能匹配http请求
http://www.test.com/xxx operatorURI
http://www.test.com:8080/xxx operatorURI

# 匹配指定路径下的所有请求
www.test.com/xxx operatorURI
www.test.com:8080/xxx operatorURI
```

*/xxx operatorURI # 使用了通配符匹配特性

路径匹配不支持tunnel协议的url。

### 正则匹配

和js正则一致，支持两种模式：/reg/,/reg/i，并且支持正则中的子匹配不支持/reg/g的全局匹配。
