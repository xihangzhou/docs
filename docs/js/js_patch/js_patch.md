# JS面试题-零散知识点

## 1. JS各种宽度高度的理解和获取

看js知识总结

## 2. 几种不同的js设计模式

看知识总结

## 3. 继承的实现方式，ES6的class继承？

1. Class

* 有constructor和没有constructor的区别？
  * 没有区别，函数会默认加一个
  * 所有实例属性可以直接写在最顶层不写在constructor里面
* static关键字
  * 有static  a = 12;关键字定义的是类上的属性，即函数上的属性

2. 借用构造函数继承

```js
function father(name){
  this.name = name
}

function son(age,name){
  father.call(this,name);
  this.age = age;
}
```

问题：不能定义继承父类原型上的方法

3. 组合继承

```js
function father(name){
  this.name = name
}

function son(age,name){
  father.call(this,name);
  this.age = age;
}

son.pototype = new father();
son.prototype.constructor = son;
```

构造函数继承父类属性，通过原型链继承方法，即把子类的原型定义为一个父类的实例。

4. 原型式继承

Object.create(类,{额外属性})

创建一个对象，这个对象的proto指向类的prototyoe,并且可以自定义额外属性。

5. 寄生继承

```js
function createASon(father){

​	let son = new father;

​	son.age = 12;

​	return son;

}
```

6. 寄生组合继承

```js
function father(name){
	this.name = name
}

father.prototype.sayHi = ()=>{console.log('Hi');}

function son(age,name){
	father.call(this,name);
	son.age = age;
}

son.prototype = Object.create(father);
son.prototype.constructor = son;
```

## 4. 手写new,apply,bind

1. 手写new

```js
function new (func,...args){
	let obj = new Object();
  let res = func.apply(obj,args);
  if(!res && typeof res ==='object' || typeof res === 'function'){
    return res;
  }else{
    return obj;
  }
}
```

2. 手写apply

```js
function apply(obj,...args){
  obj.$func = this;
  let res = obj.$func(...args);
  return res;
}
```

3. 手写bind

```js
function bind(obj,...args){
  //注意返回的函数中也有可能有参数
  return (...inArgs)=>{
    this.apply(obj,args.concat(inArgs));
  }
}
```

## 5. 操作DOM的常用方式

见知识总结

## 6.sum()求和那个题怎么做？
```js
//方法1:curry函数预处理
function curring(func,times){
    return function(...args){
        times--;
        if(times === 0){
            // 注意要用...
            return func(...args);
        }
        //使用.bind保存参数，并且传到下一个函数闭包保存
        return curring(func.bind(null,...args),times);
    }
}

//注意要用...
let sum = curring((...args)=>{
    return args.reduce((x,y)=>{
        return x + y;
    })
},3)

console.log(sum(1)(2)(2,3,4,5));
//方法2:改写toString函数
let arr = [];
let sum  = function sum(...args){
	arr = arr.concat(args);
	return sum;
}
sum.toString = function(){
	return arr.reduce((x,y)=>{
		return x + y;
	})
}

console.log(sum(1,2,3)(2,3));
```

## 7.load时间和Domcontentloaded事件的区别

* window.onload是整个页面（包括图片加载完成),

* Document中的DOMContentLoaded事件是DOM加载完成就触发

## 8.深浅拷贝

深拷贝：

```js
function deepClone(obj){
  let type = typeof obj;
  if(type !== 'object' || !obj || type === 'function'|| obj instanceof RegExp || obj instanceof Date){
    return obj;
  }
  let newObj = {};
  for(let key in obj){
    newObj[key] = deepClone(obj[key]);
  }
  return newObj;
}
```

浅拷贝只拷贝一层

## 9.防抖和节流的实现

防抖：在规定时间内再次触发重新计时

节流：在规定时间内再次触发不重新计时

```js
function fangdou(func,time){
  let timer = null;
  return function(...args){
    //注意每次都清空
    clearTimeOut(timer);
    if(!timer){
      //注意要apply
      func.apply(this,args);
      timer = setTimeOut(()=>{
        //注意设置为null只是改变指向，并不能结束一个计时器
        timer = null;
      },time)
    }
  }
}

function jieliu(func,time){
  let timer = null;
  return function(...args){
    if(!timer){
      func.apply(this,args);
      timer = setTimeOut(()=>{
        timer = null;
      },time)
    }
  }
}
```



## 10.事件的传播机制，怎么使用冒泡？

1. 捕获阶段
2. 目标阶段
3. 冒泡阶段

addEventListener('',func,false)

第三个参数为false就是冒泡触发

## 11.事件委托

```js
let bindEvent = function (ele, type, selector, func) {
  if(!func){
    func = selector;
    selector = null;
  }
  ele.addEventListener(type,function(event){
    let target = event.target;
    if(selector){
      func.call(target,event);
    }else{
      func.call(this,event);
    }
  })
}
```

## 12.JS的数据类型和检验

1. typeof

2. instanceof

3. Object.prototype.toString.call(obj);

返回[object Object/Array/RegExp/Date/Function/Null/Undefined/Number/String/Boolean/Symbol...]

## 13.promise.all .race的实现

```js
Promise.all = function(arr){
  return new Promise((resolve,reject)=>{
    let num = 0;
    let ans = [];
    for(let i = 0;i < arr.length;i++){
      arr[i].then((res)=>{
        num++;
        ans[i] = res;
        if(num === arr.length){
          resolve(ans);
        }
       //注意要写.catch 
      }).catch((error)=>{
        reject(error);
      })
    }
  })
}

Promise.race = function(arr){
  let num = 0;
  let errors = [];
  return new Promise((resolve,reject)=>{
    for(let i = 0;i < arr.length;i++){
      arr[i].then((res)=>{
        resolve(res);
      }).catch((error)=>{
        num++;
        errors[i] = error;
        if(num === length){
          reject(errors);
        }
      })
    }
  })
}
```



## 14.sleep函数的实现

```js
//1.通过死循环
function sleep(time){
  let cur = Date.now();
  while(Date.now() - cur < time){
  }
}

//2.通过async await方式
function helper(time){
  return new Promise((resolve,reject)=>{
    setTimeOut(()=>{resolve()},time);
  })
}
async function sleep(time){
  await helper(time);
}
```

## 17.什么是类数组和类数组的转化

长得像数组的类，属性名是'0','1'....，有长度

arguments就是类数组

转化：

Array.from(arguments);

[].slice.call(arguments,0);

## 18. 数组去重

```js
//ES6
function deDuplicate(arr){
  return Array.from(new Set(arr));
}

//ES5
function deDuplicate(arr){
  let map = [];
  let res = [];
  for(let i = 0;i < arr.length;i++){
    if(!map[arr[i]]){
      map[arr[i]] = 1;
      res.push(arr[i]);
    }
    return res;
  }
}
```



## 19. 怎么取消事件的默认行为？

1. event.preventDefault();
2. return false;
3. href = 'javascript:;

## 20. 手写Ajax？

```js
function request(url,method){
  return new Promise((resolve,reject)=>{
    let xhr = new XMLHttpRequest();
    xhr.open(method,url,true);//true为异步请求
    xhr.onreadystateChange = function(){
      if(xhr.readyState === 4){
        resolve(xhr.responseText);
      }else if(xhr.status === '404' || xhr.status === '505'){
          reject(new Error('not Found'))
      }
    }
    xhr.send();
  })
}
```

## 21. JsonP的实现？

JsonP的原理就是通过script标签的跨域性发送请求，服务端返回一个已经写好了带了参数的callback函数，这个函数可以直接被浏览器执行

```js
function request(url,data,callback='callback'){
  //首先处理url
  let params = [];
  url += '?';
  for(let key in data){
    url += `${key}=${data[key]}&`
  }
  let script = document.createElement('script');
  script.setAttribute('src',url);
  return new Promise((resolve,reject)=>{
    window.callback = function(res){
      resolve(res);
    }
  })
  document.body.appendChild(script);
}
```



## 22. 数组扁平化？

```js
function bianping(arr){
    let ans = [];
    function helper(arr){
    for(let i = 0;i < arr.length;i++){
      if(typeof arr === 'Object'){
        helper(arr[i]);
      }else{
        ans.push(arr[i]);
      }
    }
  }
  	helper(arr);
  	return ans;
}

```

## 23. Async await promise题目的练习

## 读代码练习题

1. 做错 

```javascript
/*阿里面试题*/
let a = {
    n: 10
};
let b = a;
b.m = b = {
    n: 20
};
console.log(a);//{ n: 10, m: { n: 20 } }
console.log(b);//{ n: 20 }
```

**注意连等赋值是从左到右进行的，先进行b.m的赋值再进行b的赋值**
**typeof typeof()才会从右向左**
**同级运算优先级是从左到右****可以在MDN中查找 运算符优先级**


2. 

```
/*360面试题*/
let x = [12, 23];
function fn(y) {
    y[0] = 100;
    y = [100];
    y[1] = 200;
    console.log(y);
}
fn(x);
console.log(x);
//[ 100, 200 ]
//[ 100, 23 ]
```

3. 

```
var x = 10;
~ function (x) {
    console.log(x);
    x = x || 20 && 30 || 40;
    console.log(x);
}();
console.log(x);
```

4. 

```
let x = [1, 2],
    y = [3, 4];
~ function (x) {
    x.push('A');
    x = x.slice(0);
    x.push('B');
    x = y;
    x.push('C');
    console.log(x, y);
}(x);
console.log(x, y);
```

**function(){}(x)意味着把x作为参数立即执行匿名函数**

5. 

```
let res = parseFloat('left:200px');
if(res===200){
   alert(200);
}else if(res===NaN){
   alert(NaN);
}else if(typeof res==='number'){
   alert('number');
}else{
   alert('Invalid Number');
}
```

**这是一个NaN与其他值都不相等，但是typeof为Number**


### 1

```
let x = 5;
function fn(x) {
    return function(y) {
        console.log(y + (++x));
    }
}
let f = fn(6);
f(7);
fn(8)(9);
f(10);
console.log(x);
```

注意即使是同一个函数运行两次也会各自创建不同的执行上下文

### 2.

```
let x = 5;
function fn() {
    return function(y) {
        console.log(y + (++x));
    }
}
let f = fn(6);
f(7);
fn(8)(9);
f(10);
console.log(x);
```

注意不传值不建立形参则沿着作用域向上招到全局中的x

### 3.

好题

```
let a=0,
    b=0;
function A(a){
    A=function(b){
        alert(a+b++);
    };
    alert(a++);
}
A(1);
A(2);
```

第一次A执行的是定义在全局上下文中的A，在执行A的过程中A变量被重新赋值给了另外一个函数，由于这个函数是在局部执行上下文中定义且A调用，所以构成闭包，该执行环境不出栈，保留形参变量a.
第二次执行A时会沿着作用域链找到a并执行函数，执行完毕后会出栈

### 4.

```
var x = 3,
    obj = {x: 5};
obj.fn = (function () {
    this.x *= ++x;
    return function (y) {
        this.x *= (++x)+y;
        console.log(x);
    }
})();
var fn = obj.fn;
obj.fn(6);
fn(4);
console.log(obj.x, x);
```

**注意this的指向和 x *= ++x 应该先算x再算++x**



### 1.编写一个ADD函数满足如下需求

```
add(1);       //1
add(1)(2);    //3
add(1)(2)(3); //6
add(1)(2,3);  //6
add(1,2)(3);  //6
add(1,2,3);   //6
```

```
/*
 * 实现方案一 
 */
/* function add(...outerArgs) {
	add = function (...innerArgs) {
		outerArgs.push(...innerArgs);
		return add;
	};
	add.toString = function () {
		return outerArgs.reduce((x, y) => x + y);
	};
	return add;
}
let res = add(1, 2)(3)(4)(5)(6, 7);
alert(res);  //=>alert会把输出的值转换为字符串（toString()） */
/*
 * 第一次执行ADD  outerArgs=[1,2]  重写了ADD
 * 第二次执行ADD  innerArgs=[3]   outerArgs=[1,2,3]
 * 第三次执行ADD  innerArgs=[4]   outerArgs=[1,2,3,4]
 * ......
 * outerArgs=[1,2,3,4,5,6,7]
 */
// console.log(res.toString());


/*
 * 实现方案二 
 */
function currying(anonymous, length) {
	return function add(...args) {
		if (args.length >= length) {
			return anonymous(...args);
		}
		return currying(anonymous.bind(null, ...args), length - args.length);
	}
}
let add = currying(function anonymous(...args) {
	return args.reduce((x, y) => x + y);
}, 4);
/*
 * AO(currying) 
 *   anonymous=求和函数
 *   length=4
 * ADD第一次执行  args=[1,2]
 *   currying第二次执行
 * 		anonymous=求和函数 预先传递的参数[1,2]
 *      length=2
 * 	 ADD第二次执行 args=[3]
 *      currying第三次执行 
 *        anonymous=求和函数 预先传递的参数[3]
 *        length=1
 *      ADD函数第三次执行 args=[4]
 *        把上一次的求和函数执行(4)
 */
console.log(add(1, 2,3)(3)(4));
```


### 2.下面代码输出结果是什么？为啥？

```
let obj = {
    2: 3,
    3: 4,
    length: 2,
    push: Array.prototype.push
}
obj.push(1);
obj.push(2);
console.log(obj);
```

* 调用了Array中的push方法，对length属性作出了修改
  * **obj[]的形式可以读或者是修改已有的或者是添加没有的，其中的值若是变量则找到变量对应的值变成字符串，若是常量则直接变成字符串**
   * **obj.xxx的形式可以读也可以写没有的属性，其中的值只能是除了纯数字以外的obj中的属性值，且不加'',所以若为纯数字的属性值只能通过[]进行访问且不能直接无中生有**
* push方法的实现原理

```
Array.prototype.push = function push(num) {
	//=>this:arr
	//this.length=this.length||0;
	//=>拿原有length作为新增项的索引
	this[this.length] = num;
	//=>length的长度会自动跟着累加1
};
```

```
/* let obj = {
	2: 3,
	3: 4,
	length: 2,
	push: Array.prototype.push
};
obj.push(1); //=>obj[2]=1  obj.length=3
obj.push(2); //=>obj[3]=2  obj.length=4
console.log(obj); //=>{2:1,3:2,length:4...} */
```

对于obj[length]的对象其实会取到obj[2]这个属性

  


### 3.a等于什么值会让下面条件成立

```
var a = ?;
if (a == 1 && a == 2 && a == 3) {
    console.log('OK');
}
```

方案一：利用比较的时候默认会转化为字符串的机制，我们通过重写toString来完成需求
1.1

```
var a = {
	i: 0,
	toString() {
		return ++this.i;
	}
};
//=>a == 1 ：a.toString()
if (a == 1 && a == 2 && a == 3) {
	console.log('OK');
}
```

1.2

```
var a = [1, 2, 3];
a.toString = a.shift;
if (a == 1 && a == 2 && a == 3) {
	console.log('OK');
}
```

方案二： Object.defineProperty劫持对象中某个属性的操作

```
var i = 0;
Object.defineProperty(window, 'a', {
	get() {
		//=>获取window.a的时候触发
		return ++i;
	},
	set() {
		//=>给window.a设置属性值的时候触发
	}
});
if (a == 1 && a == 2 && a == 3) {
	console.log('OK');
} 
```

### 4.写出下面代码执行输出的结果

```
function C1(name) {
    if (name) {
        this.name = name;
    }
}
function C2(name) {
    this.name = name;
}
function C3(name) {
    this.name = name || 'join';
}
C1.prototype.name = 'Tom';
C2.prototype.name = 'Tom';
C3.prototype.name = 'Tom';
alert((new C1().name) + (new C2().name) + (new C3().name));
```

若没有这个属性，在原型上找，若有的花用自己实例上的

### 5.写出下面代码执行输出的结果 x

```
function Foo() {
    getName = function () {
        console.log(1);
    };
    return this;
}
Foo.getName = function () {
    console.log(2);
};
Foo.prototype.getName = function () {
    console.log(3);
};
var getName = function () {
    console.log(4);
};
function getName() {
    console.log(5);
}
Foo.getName();//2
getName();//4 输出5的先是被提升然后在执行阶段被4覆盖
Foo().getName();//1 执行Foo()时并没有声明一个私有getName而是沿着作用域链到全局中修改了getName的指向，指向1,返回windows对象获取全局中的getName()
getName();//1
new Foo.getName();//2 new Foo的优先级比.低，所以先找到Foo中输出2的getName，然后再new生成实例的过程中输出2
new Foo().getName();//3 new Foo()的优先级和.一样，从左到右执行，先生成一个Foo实例为一个空对象，再沿着原型链向上找到getName()函数为输出3的函数
new new Foo().getName();//3 先new Foo()生成一个空实例，在沿原型链向上找到原型上的getName(),再执行 外侧 的new生成原型上getName()的实例并同时输出了3
```

**注意：**
**1:首先应该变量提升，输出5的getName会被提升，且被提升后在函数执行阶段就不会再执行**
**2:new的时候会改变this的指向，指向生成的空对象**
**3:函数中没有的参数会沿着作用域链向上查找，而对象实例中没有的属性会沿着原型链向上查找**

### 6.编写plus和minus实现如下需求

```
~ function anonymous(proto) {
	const checkNum = function checkNum(num) {
		num = Number(num);//对一个数据进行强制转换
		if (isNaN(num)) {//用isNaN检验转换的结果
			num = 0;
		}
		return num;
	};
	proto.plus = function plus(num) {
		//=>this:我们要操作的那个数字实例（对象）
		//=>返回Number类的实例，实现链式写法
		return this + checkNum(num);
	};
	proto.minus = function minus(num) {
		return this - checkNum(num);
	};
}(Number.prototype);
// let n = 10;
// let m = n.plus(10).minus(5);
// console.log(m); //=>15（10+10-5）
```

- 将里面的函数返回给全局的Number.prototype从而构成了闭包实现了对checkNum方法的私有包装
- 将checkNum提取出来实现了代码的去冗余
- 代码的编写先实现功能，再去除冗余，再实现私有包装和可扩展性


### 百度笔试题

#### 1.promise实例状态无更改

```
(async()=>{
    console.log(1);
    setTimeout(()=>{
        console.log(2);
    },0);
    await new Promise((resolve,reject)=>{
        console.log(3);
    }).then(()=>{
        console.log(4);
    });
    console.log(5);
})();
```

输出结果为1，3，2
注意此时的await后面的promise实例并没有执行resolve或者是reject方法，由此并没有改变状态，所以then中的语句会一直等待，console.log(5)同样也会一直等待

```
(async()=>{
    console.log(1);
    setTimeout(()=>{
        console.log(2);
    },0);
    await new Promise((resolve,reject)=>{
        console.log(3);
        resolve();
    }).then(()=>{
        console.log(4);
    });
    console.log(5);
})();
```

若为这样则结果为1,3,4,5,2 注意4在5前，2作为宏任务会在后面

#### 2.return的自动加;问题

```
function nums(a,b){
    if
    (a > b)
    console.log('a is bigger')
    else
    console.log('b is bigger')
    return     
    a + b
}

console.log(nums(4,2))
console.log(nums(1,2))
```

这时这个return语句会变成

```
return;
a+b
```

所以结果为 a is bigger undefined b is bigger undefined

### 循环中处理异步的问题

#### 1.使用for循环

```
let arr = [1, 2, 3];

function delay() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function f() {
    console.log('start');
    for(let i = 0;i < 3;i++){
        await delay();
        console.log(arr[i]);
    }
    console.log('end');
}

f();
```

结果为 start 1(等待1s)2(等待1s)3 end
for循环中的异步会使得整个循环任务进入任务队列

#### 2.使用forEach循环

```
let arr = [1, 2, 3];

function delay() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

function f() {
    console.log('start');
    arr.forEach(async function (item) {
        await delay();
        console.log(item);
    })
    console.log('end');
}

f();
```

注意forEach循环要把async写在回调函数中，并且是每一次函数内部中的任务被加到微任务队列中
结果为start end (等待1s) 1 2 3

#### 3.for..of循环

```
let arr = [1, 2, 3];

function delay() {

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 1000);
    })
}

async function f() {
    console.log('start');
    for(let item of arr){
        await delay();
        console.log(item);
    }
    console.log('end');
}

f();
```

for..of与for循环相同

## 24.单问号，双问号

```js
var street = user.address && user.address.street;
//等同于下面的代码
var street = user.address?.street
```

```js
var fooInput = myForm.querySelector('input[name=foo]')
var fooValue = fooInput ? fooInput.value : undefined
//等于如下
var fooValue = myForm.querySelector('input[name=foo]')?.value
```



对于如下的情况：

```js
const result = response?.settings?.n || 100
```

如果本意是存在n就返回n的话那么当n为0的时候仍然会返回100。所以||就会在这个时候出现一个bug。

```js
const result = response?.settings?.n ?? 100
```

可以直接写成如上的形式，这样的话只有当左边的值是null或者undefined的时候才会返回右边的值。