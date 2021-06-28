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

* 和js正则一致，支持两种模式：/reg/,/reg/i
* 并且支持正则中的分组引用，使用$1,$2....符号来动态获取前面（）中引用的内容，把之前引用的内容赋值给后面的operatorURI
* 不支持/reg/g的全局匹配
* 正则匹配支持非匹配 `!pattern`

```
#匹配所有请求
* operatorURI

#匹配url里面包含某个关键字的请求，且忽略大小写
/keyword/i operatorURI

# 利用分组引用把url里面的参数带到匹配的操作uri
# 下面正则将把请求里面的([^\/]+)，带到匹配的操作uri
# 最多支持10个子匹配 $0...9，其中$0表示整个请求url，其它跟正则的子匹配一样
/[^?#]\/([^\/]+)\.html/ protocol://...$1...

#对正则表达式取反
!/keyword/i operatorURI
```

### 精确匹配

路径匹配不仅匹配对应的路径，而且还会匹配该路径下面的子路径，而精确匹配只能指定的路径，只要在路径前面加`$`即可变成精确匹配，类似`$url operatorURI`，pattern和operatorURI位置可以调换。

例子如下：

1. 如果包含请求协议：

```
  $http://www.test.com operatorURI
  #只能匹配
  http://www.test.com
```

```
 $https://www.test.com/xxx? operatorURI
 #只能匹配
  https://www.test.com/xxx?
```

2：如果不包含请求协议：

```
$www.test.com/xxx operatorURI
#这种情况由于没有指定请求协议可以匹配如下的含有协议但路径一样的请求
  http://www.test.com/xxx
  https://www.test.com/xxx
  ws://www.test.com/xxx
  wss://www.test.com/xxx
```

同样精确匹配支持非匹配 `!$url`

### 通配符匹配

正则匹配可以解决所有的匹配情况，但是需要使用人懂正则，为了让使用的门槛低一些，wistle提供了通配符来进行匹配

#### **通配符匹配**

相比于正则表达式通过分组即`()`的方式来提取匹配的内容，通配符使用`*`的方式来进行匹配，匹配规则如下：

* `^`表示开头位置，`$`表示结尾位置

* 如果通配符串在请求url的protocol里面，不管是一个还是多个 `*` 都只能匹配 `[a-z\d]*`
* 如果通配符串在domain里面，一个 `*` 表示匹配 `[^/.]`(除了/.的部分)，两个及以上的 `*` 表示匹配 `[^/]*`(只要不是/就可以匹配)
* 如果通配符串在path里面，一个 `*` 表示匹配 `[^/]`，两个 `*` 表示匹配 `[^？]*`，三个及以上的 `*` 表示匹配 `.*`
* 如果通配符串在query里面，一个 `*` 表示匹配 `[^&]`，两个及以上的 `*` 表示匹配 `.*`

```bash
^*://*.test.**.com:*/**?a=*&**  opProtocol://opValue($0, $1, ..., $9)
# 第一个*匹配协议
# 第二个*匹配/ . 之间的内容，这个里面的内容不能出现/或者是.
# 第三个**匹配. .之间的内容，这个内容里面只要不出现/就可以
# 滴四个*匹配:/之间的内容，这个内容里面是端口号，同样不能出现. / 
# 第5个**匹配路径，只要不出现?就可以
# 第6个*匹配a的值
# 第7个**匹配剩下的所有内容
```

下面给一些例子：

1. 通配域名匹配

```bash
# 匹配二级域名以 .com 结尾的所有url，如: test.com, abc.com，但不包含 *.xxx.com
^*.com file:///User/xxx/test
//*.com file:///User/xxx/test

# 匹配 test.com 的子域名，不包括 test.com
# 也不包括诸如 *.xxx.test.com 的四级域名，只能包含: a.test.com，www.test.com 等test.com的三级域名
*.test.com file:///User/xxx/test
//*.test.com file:///User/xxx/test

# 如果要配置所有子域名生效，可以使用 **
**.com file:///User/xxx/test
**.test.com file:///User/xxx/test

# 限定协议，只对http生效
http://*.com file:///User/xxx/test
http://**.com file:///User/xxx/test
http://*.test.com file:///User/xxx/test
http://**.test.com file:///User/xxx/test

# 路径
*.com/abc/efg file:///User/xxx/test
**.com/abc/efg file:///User/xxx/test
*.test.com/abc/efg file:///User/xxx/test
**.test.com/abc/efg file:///User/xxx/test

http://*.com/abc/efg file:///User/xxx/test
http://**.com/abc/efg file:///User/xxx/test
http://*.test.com/abc/efg file:///User/xxx/test
http://**.test.com/abc/efg file:///User/xxx/test
```

2. 通配路径匹配

```bash
# 对所有域名对应的路径 protocol://a.b.c/xxx[/yyy]都生效
*/ 127.0.0.1
*/xxx 127.0.0.1:9999
tunnel://*/ 127.0.0.1:9999 # tunnel只支持根路径匹配
http://*/ 127.0.0.1
https://*/xxx 127.0.0.1
ws://*/xxx 127.0.0.1
wss://*/xxx 127.0.0.1

# 也可以指定路径，不包含该路径的子路径，在这里$表示的是精确匹配
$*/ 127.0.0.1
$*/xxx 127.0.0.1:9999
$tunnel://*/  127.0.0.1 # tunnel只支持根路径匹配
$http://*/ 127.0.0.1:9999
$https://*/xxx 127.0.0.1:9999
$ws://*/xxx 127.0.0.1:9999
$wss://*/xxx 127.0.0.1
```

## 操作值

whistle的操作值可以分两类，字符串和JSON对象。

### 字符串

1. 如果字符串不包含空格，可以直接用`()`包起来写到配置文件中，有些不能放到本地文件的值可以不用()：

```bash
 pattern opProtocol://(strValue)

 # 有些操作值不能放到本地文件，则可以不用括号，如：proxy、referer等等，具体参见协议列表
 pattern opProtocol://strValue
```

2. 如果**字符串**里面包含空格，则可以把操作值先放到whistle界面的[Values](https://wproxy.org/whistle/webui/values.html)或本地文件然后用{}引用，创建values的过程见[Values](https://wproxy.org/whistle/webui/values.html)：

```bash
 # 在Values里面创建一个key为 test.txt 的 key-value 对
 pattern opProtocol://{test.txt}

 # 或者放到本地文件 /User/docs/test.txt
 pattern opProtocol:///User/docs/test.txt
 # windows
 pattern opProtocol://E:\docs\test.txt
```

3. 如果操作值为**JSON对象**，则同样需要把操作值放到whistle界面或者本地文件中。可以用以下几种格式书写：

正常的JSON格式：

```bash
     {
       "key1": value1,
       "key2": value2,
       "keyN": valueN
     }
```

行格式：

```bash
     # 以 `冒号+空格` 分隔
     key1: value1
     key2: value2
     keyN: valueN

     # 如果没有 `冒号+空格` ，则以第一个冒号分隔，如果没有冒号，则value为空字符串
     key1: value1
     key2:value2
     key3
     keyN: valueN
```

内联格式(请求参数格式)：

```bash
     # key和value最好都encodeURIComponent
     key1=value1&key2=value2&keyN=valueN
```

注意：最后一种内联格式可以把JSON对象直接转化为字符串，这样可以用第一种方式直接写到配置里面，如果key或value里面出现 `空格`、`&`、`%` 或 `=`，则需要把它们 `encodeURIComponent`，whistle会对每个key和value尝试 `decodeURIComponent`。

### 内联多行操作值

whistle [v1.12.12](https://wproxy.org/whistle/update.html)开始支持Rules内联多行的Value，格式如下：

```
#使用键值
pattern protocol://{keyName}

# 定义键值
​``` keyName
content
​```
```

如：

```
www.test.com/index.html file://{test.html}
​``` test.html
Hello world.
Hello world1.
Hello world2.
​```
www.test.com/index2.html reqScript://{test.rules}
​```` test.rules
* file://{test.html} # 表示下面的test.html，无法获取上面的test.html
​``` test.html
reqScrip,
reqScript,
​```
​````
```

这种方式设置的Value只对当前阶段的规则生效，且优先级高于[Values](https://wproxy.org/whistle/webui/values.html)设置的Key-Value，所以如果是插件里面的规则最好能加个前缀如：

```
​```whistle.helloworld/test.html
Hello world.
Hello world1.
Hello world2.
​```
www.test.com/index.html file://{whistle.helloworld/test.html}
```

### 模版字符串

`v1.12.9` 版本开始，whistle支持类似es6的模板字符串，通过模板字符串可以读取请求的一些信息并设置到规则中：

```bash
pattern1 protocol://`xxx${reqCookie.cookieName}yyy`
www.test.com/api http://`${clientIp}:8080`
pattern3 protocol://`{test.json}`
```

test.json:

```bash
{
    "url": "${url}",
    "port": "${port}",
    "version": "${version}",
    "query": "${query}", // 相当于 location.search ，如果 url 里面没有 ? 则为空字符串
    "search": "${search}", // 相当于 location.search ，如果 url 里面没有 ? 则为空字符串
    "queryString": "${queryString}",  // 相当于 location.search ，但如果 url 里面没有 ? 则为 ?
    "searchString": "${searchString}",  // 相当于 location.search ，但如果 url 里面没有 ? 则为 ?
    "queryValue": "${query.name}",
    "host": "${host}",
    "hostname": "${hostname}",
    "path": "${path}",
    "pathname": "${pathname}",
    "reqId": "${reqId}",
    "now": ${now},
    "method": "${method}",
    "xff": "${reqHeaders.x-test}",
    "other": "${reqHeaders.other}",
    "cookie": "${reqCookie}",
    "cookieValue": "${reqCookie.cookieName}",
    "clientIp": "${clientIp}"
}
```

这里 `test.json` 在规则中一定要用模板字符串引入：

```
 protocol://`{test.json}`
```

如下配置：

```
www.test.com/api http://`${clientIp}:8080`
```

如果请求来自10.12.2.1，则clientIp的值就自动从请求的ip中获取，所以 `https://www.test.com/api/test` 会转成 http://10.12.2.1:8080/test

## 匹配原则

1. 相同协议规则的默认优先级从上到下，即前面的规则优先级匹配高于后面，如：

```bash
 www.test.com 127.0.0.1:9999
 www.test.com/xxx 127.0.0.1:8080
```

2. 除[rule](https://wproxy.org/whistle/rules/rule)及[proxy](https://wproxy.org/whistle/rules/proxy.html)对应规则除外，可以同时匹配不同协议的规则

```
 www.test.com 127.0.0.1:9999
 www.test.com/xxx 127.0.0.1:8080
 www.test.com proxy://127.0.0.1:8888
 www.test.com/xxx socks://127.0.0.1:1080
 www.test.com pac://http://www.pac-server.com/test.pac
 www.test.com/xxx http://www.abc.com
 www.test.com file:///User/xxx/test
```

请求 `https://www.test.com/xxx/index.html` 按从上到下的匹配顺序，及第二点原则，会匹配以下规则：

```
 www.test.com 127.0.0.1:9999
 www.test.com proxy://127.0.0.1:8888
 www.test.com pac://http://www.pac-server.com/test.pac
 www.test.com/xxx http://www.abc.com
```

[proxy](https://wproxy.org/whistle/rules/proxy.html)、[http-proxy](https://wproxy.org/whistle/rules/proxy.html)、[https-proxy](https://wproxy.org/whistle/rules/https-proxy.html)、[socks](https://wproxy.org/whistle/rules/socks.html)都属于[proxy](https://wproxy.org/whistle/rules/proxy.html)，[html](https://wproxy.org/whistle/rules/rule/replace.html)、[file](https://wproxy.org/whistle/rules/rule/file.html)等都属于[rule](https://wproxy.org/whistle/rules/rule)，所以这两个对应的协议只能各种匹配其中优先级最高的一个。

3. 一些属于不同协议，但功能有冲突的规则，如 [rule](https://wproxy.org/whistle/rule)、[host](https://wproxy.org/whistle/host.html)、[proxy](https://wproxy.org/whistle/proxy.html)，按常用优先级为 `rule > host > proxy`，如：

```
 www.test.com 127.0.0.1:9999
 www.test.com/xxx 127.0.0.1:8080
 www.test.com proxy://127.0.0.1:8888
 www.test.com/xxx socks://127.0.0.1:1080
 www.test.com file:///User/xxx/test
 www.test.com/xxx http://www.abc.com
```

4. 部分相同协议会匹配及合并所有可以匹配的规则，如：

```
 www.test.com 127.0.0.1:9999
 www.test.com/xxx 127.0.0.1:8080
 www.test.com proxy://127.0.0.1:8888
 www.test.com/xxx socks://127.0.0.1:1080
 www.test.com pac://http://www.pac-server.com/test.pac
 www.test.com/xxx http://www.abc.com
 www.test.com file:///User/xxx/test
 www.test.com/xxx reqHeaders://{test.json}
 www.test.com reqHeaders:///User/xxx/test.json
 www.test.com/xxx htmlAppend:///User/xxx/test.html
 www.test.com htmlAppend://{test.html}
 www.test.com/xxx reqHeaders:///User/xxx/test2.json
 www.test.com htmlAppend://{test2.html}
```

请求 `https://www.test.com/xxx/index.html` 会匹配以下规则：

```
 www.test.com 127.0.0.1:9999
 www.test.com proxy://127.0.0.1:8888
 www.test.com pac://http://www.pac-server.com/test.pac
 www.test.com/xxx http://www.abc.com
 www.test.com/xxx reqHeaders://{test.json}
 www.test.com reqHeaders:///User/xxx/test.json
 www.test.com/xxx htmlAppend:///User/xxx/test.html
 www.test.com htmlAppend://{test.html}
 www.test.com/xxx reqHeaders:///User/xxx/test2.json
 www.test.com htmlAppend://{test2.html}
```

其中，所有匹配的[reqHeaders](https://wproxy.org/whistle/rules/reqHeaders.html)协议的规则会将其对应的json合并后再合并到请求headers里，而所有匹配[htmlAppend](https://wproxy.org/whistle/rules/htmlAppend.html)的html内容会通过换行符 `\n` 合并并追加到响应的html内容里面，其它可以合并的协议如下（主要涉及json、注入内容、属性设置对应的协议）：

- [ignore](https://wproxy.org/whistle/rules/ignore.html)
- [enable](https://wproxy.org/whistle/rules/enable.html)
- [filter](https://wproxy.org/whistle/rules/filter.html)
- [disable](https://wproxy.org/whistle/rules/disable.html)
- [plugin](https://wproxy.org/whistle/rules/plugin.html)
- [delete](https://wproxy.org/whistle/rules/delete.html)
- [urlParams](https://wproxy.org/whistle/rules/urlParams.html)
- [params](https://wproxy.org/whistle/rules/params.html)
- [reqHeaders](https://wproxy.org/whistle/rules/reqHeaders.html)
- [resHeaders](https://wproxy.org/whistle/rules/resHeaders.html)
- [reqCors](https://wproxy.org/whistle/rules/reqCors.html)
- [resCors](https://wproxy.org/whistle/rules/resCors.html)
- [reqCookies](https://wproxy.org/whistle/rules/reqCookies.html)
- [resCookies](https://wproxy.org/whistle/rules/resCookies.html)
- [reqReplace](https://wproxy.org/whistle/rules/reqReplace.html)
- [urlReplace](https://wproxy.org/whistle/rules/urlReplace.html)
- [resReplace](https://wproxy.org/whistle/rules/resReplace.html)
- [resMerge](https://wproxy.org/whistle/rules/resMerge.html)
- [reqBody](https://wproxy.org/whistle/rules/reqBody.html)
- [reqPrepend](https://wproxy.org/whistle/rules/reqPrepend.html)
- [resPrepend](https://wproxy.org/whistle/rules/resPrepend.html)
- [reqAppend](https://wproxy.org/whistle/rules/reqAppend.html)
- [resAppend](https://wproxy.org/whistle/rules/resAppend.html)
- [resBody](https://wproxy.org/whistle/rules/resBody.html)
- [htmlAppend](https://wproxy.org/whistle/rules/htmlAppend.html)
- [jsAppend](https://wproxy.org/whistle/rules/jsAppend.html)
- [cssAppend](https://wproxy.org/whistle/rules/cssAppend.html)
- [htmlBody](https://wproxy.org/whistle/rules/htmlBody.html)
- [jsBody](https://wproxy.org/whistle/rules/jsBody.html)
- [cssBody](https://wproxy.org/whistle/rules/cssBody.html)
- [htmlPrepend](https://wproxy.org/whistle/rules/htmlPrepend.html)
- [jsPrepend](https://wproxy.org/whistle/rules/jsPrepend.html)
- [cssPrepend](https://wproxy.org/whistle/rules/cssPrepend.html)

