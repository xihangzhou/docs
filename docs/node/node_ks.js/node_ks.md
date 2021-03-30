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
### 2.4 debugger
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
![Alt text](./1593433707245.png)
![Alt text](./1593435915596.png)
![Alt text](./1593435945646.png)
![Alt text](./1593480689875.png)
![Alt text](./1593481667600.png)
![Alt text](./1593482127488.png)
