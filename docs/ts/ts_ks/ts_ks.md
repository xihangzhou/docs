#  TS

## 一.基础

### 1.数据类型分类
分为原始数据类型和对象类型
* 原始数据类型

  布尔值、数值、字符串、null、undefined 以及 ES6 中的新类型 Symbol

* 对象类型

### 2.原始数据类型在ts中的应用
#### 2.1 布尔值

```typescript
//创建boolean变量类型的两种方式
let flag1:boolean = true;
let flag2:boolean = Boolean(1);

//注意使用new Boolean创建的是对象,应该大写的Boolean定义类型
let objBol:Boolean = new Boolean();
```

#### 2.2数值

```ts
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

#### 2.3字符串
编译前：
```ts
let myName: string = 'Tom';
let myAge: number = 25;

// ES6模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```
编译后：

```ts
var myName = 'Tom';
var myAge = 25;
// 模板字符串
var sentence = "Hello, my name is " + myName + ".
I'll be " + (myAge + 1) + " years old next month.";
```
#### 2.4空值

```ts
//用于函数返回空值
function alertName():void {
    alert('zxh');
}

//若一个变量是空值类型，则只能是undefined或者是null
let unusable: void = undefined;
```

#### 2.5null和undefined

```ts
//null和undefined变量的创建
let n:null = null;
let u:undefined = undefined;

//null和undefined可以赋值给任意的变量类型
let num:number = n;
num = u;

// void类型不能随意赋值给任意变量类型，会报错
let v:void;
num = v;//报错
```
### 3.任意类型

* 可以任意给值的类型，相当于js
* 可以访问所有的可能的属性而不报错
* 对任意类型的任何操作的返回值都是任意类型
```ts
// 定义any类型的两种方式
//1.直接给any类型
let everything1:any = 123;
everything1 = 'asas';

//2.声明时不给类型，注意不能声明时同时给定类型
let everything2;
everything2 = 123;
everything2 = '123';
```
### 4.类型推论
以下代码虽然没有指定类型，但是会在编译的时候报错：

```ts
let myFavoriteNumber = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

事实上，它等价于：


```ts
let myFavoriteNumber: string = 'seven';
myFavoriteNumber = 7;

// index.ts(2,1): error TS2322: Type 'number' is not assignable to type 'string'.
```

**TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。**

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 any 类型而完全不被类型检查：

```ts
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```
### 5.联合类型
定义一种变量可以是多种类型

#### 5.1创建联合类型

```ts
let union:string | number;
union = '123';
union = 123;
union = true;//报错
```

#### 5.2联合类型访问属性

```ts
//1.若一种联合类型还没有被确定具体的类型，那么只能访问可能类型的公共属性
function func1(some:string | number) :string{
    return some.toString();
}

function func1(some:string | number) :{
	//报错，因为number类型没有length属性
    return some.length
}

//2.联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：
let union:string | number;
union = '123';
union.length;
union = 123;
union.length;//报错
```

### 6.对象的类型-接口
接口是对于对象的抽象
#### 6.1接口的创建
实例变量的属性要与定义的完全相同，属性的类型也要相同，多一个少一个都不行

```ts
 interface Person{
    name:string;
    age:number;
    gender:string;
}

let zxh:Person = {
    name:'zxh',
    age:18,
    gender:'male'
}
```
#### 6.2可选属性

```ts
interface Person{
    name:string;
    //age属性可选
    age?:number;
    gender:string;
}

let zxh:Person = {
    name:'zxh',
    gender:'male'
}
```

#### 6.3任意属性
* 让一个接口拥有任意可以扩充的属性
```ts
interface superMan{
    name:string;
    age:number;
    gender:string;
    //属性名为string,值类型为any
    [propName:string]:any;
}

let superZxh = {
    name:'zxh',
    age:18,
    gender:'male',
    skill:'fly'
}
```
* 但是一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集：

```ts
interface superMan{
    name:string;
    age?:number;//报错，因为number不是string的子集
    gender:string;
    [propName:string]:string;
}

let superZxh = {
    name:'zxh',
    age:18,
    gender:'male',
    skill:'fly'
}
```
* 一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型：

```ts
interface superMan{
    name:string;
    age?:number;
    gender:string;
    [propName:string]:string | number;
}
```
#### 6.4只读属性

```ts
interface superMan{
    readonly name:string;
    age?:number;
    gender:string;
    [propName:string]:string | number;
}

let superZxh:superMan = {
    name:'zxh',
    age:18,
    gender:'male',
    skill:'fly'
}

superZxh.name = 'zz';//报错，因为不可改

let superZz:superMan = {//报错，因为没有name属性
    age:18,
    gender:'male',
    skill:'fly'
}
```
#### 6.5函数类型接口

```ts
// 加密的函数类型接口
interface encrypt {
  (key: string, value: string): string;
}

let md5: encrypt = function (key: string, value: string): string {
  return `000${key}0010${value}1011001`;
};

let sha1: encrypt = function (key, value) {
  return key + value;
};

console.log(md5('key', 'value'));
```


### 7.数组

#### 7.1数组的定义
```ts
//不能出现其他类型的值
let arr: number[] = [1, 2, 3];
//任意类型
let arr: any[] = [1,2,'3'];
```
#### 7.2接口表示数组和类数组
* 数组
```ts
interface NumArr{
    [index:number]:number;
}

let myArr: NumArr = [1,2,3]; 
```

* 类数组

```ts
function func() {
    let args: {
        [index: number]: number;
        length: number;
        callee: Function;
    } = arguments;//一个函数中的arguments就是类数组
}
```
* 数组泛型

我们也可以使用数组泛型（Array Generic） `Array<elemType>` 来表示数组：

```ts
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

### 8.函数

#### 8.1函数声明和调用

```ts
function func(param1:string,param2:number):boolean{
    return true;
}
func('1',2);
func(1,2);//报错，参数的类型和数量都必须相同
```

#### 8.2函数表达式

```ts
let func: (x: string, y: number) => boolean = function (param1: string, param2: number): boolean {
    return true;
}
```
使用(x: string, y: number) => boolean去定义一个变量是函数类型，并且同时定义它的参数和返回值类型

#### 8.3接口定义函数形状

```ts
interface SearchFunc{
    (x:number,y:number):boolean;
}

let func:SearchFunc = function(x:number,y:number){
    return false;
}
```

#### 8.4可选参数

```ts
function func(x:number,y?:string):boolean{
    return x === 1;
}
```
**注意可选参数不能放在必选参数之前**

#### 8.5参数默认值

```ts
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
```
**此时就不受「可选参数必须接在必需参数后面」的限制了**

#### 8.6剩余参数

```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
```
#### 8.7重载

- 函数的重载，相同的方法，不同的参数，实现不同的功能
- 为同一个函数提供多个函数类型定义来进行函数重载，编译器会根据这个列表去处理函数的调用
- 为了让编译器能够选择正确的检查类型，它与JavaScript里的处理流程相似。 它查找重载列表，尝试使用第一个重载定义。 如果匹配的话就使用这个。 因此，在定义重载的时候，一定要把最精确的定义放在最前面。

```ts
//可以先精确的声明函数的输入输出值
function multi(x: number): number;
function multi(x: string): string;
//再定义函数的功能
function multi(x: number|string) :number | string{
    if(typeof x === 'number') return 1;
    else return '1';
}
```

### 9.类型断言
#### 9.1类型兼容

如果类型1中的属性和是类型2的属性和的子集，那么类型1兼容类型2
#### 9.2类型断言的使用
* 使用目的：将一个值的类型临时指定为另外一个类型
* 使用方式：
  * 值 as 类型
  * <类型> 值
* 使用条件：
	* 设值所在的类型为类型1，目标类型为类型2
	* 类型1兼容类型2或者类型2兼容类型1
* 使用场景
1. 将一个联合类型断言为其中一个类型

```typescript
interface fish{
    name:string;
    swim:boolean;
}

interface bird{
    name:string;
}

function isFish(some:fish | bird){
//
    if( typeof (some as fish).swim === 'boolean'){
        return true;
    }else{
        return false;
    }
}
```
2. 父类断言为更具体的子类

```typescript
interface ApiError extends Error {
    code: number;
}
interface HttpError extends Error {
    statusCode: number;
}

function isApiError(error: Error) {
    if (typeof (error as ApiError).code === 'number') {
        return true;
    }
    return false;
}
```

3. 将任何一个类型断言为any或者反过来

```ts
function getCacheData(key: string): any {
    return (window as any).cache[key];
}

interface Cat {
    name: string;
    run(): void;
}

const tom = getCacheData('tom') as Cat;
tom.run();
```

#### 9.3类型断言和类型转换的区别
类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除：类型断言不是类型转换，它不会真的影响到变量的类型。
#### 9.4类型断言和类型声明的区别
* 只要类型A兼容类型B或者类型B兼容类型A，则类型A和类型B可以相互断言
* 只有类型A兼容类型B，才能将类型B的值赋给A
## 二.进阶
### 1.类型别名
用来给一个类型起一个新名字

```ts
type nickName = string | number;
let x:nickName = 123;
```

### 2.字符串字面量类型

字符串字面量类型用来约束取值只能是某几个字符串中的一个

```ts
type nickName = '1' | '2' | '3';
let x:nickName = '4';//报错，只能是'1','2','3'中的其中一个
```
### 3.元组
数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```ts
let turp:[number,string] = [1,'1'];
turp.push('2');//添加越界元素只能是number或者string类型
```
### 4.枚举

创建取值被限定在一个范围内的场景

#### 4.1 定义方式

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
```

#### 4.2 使用方式

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

//拥有正向映射和反向映射
console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```

编译结果：

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";//Days["Tus"] = 2的返回值是2
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
```

#### 4.3 手动赋值和常数项计算项

[手动赋值](https://ts.xcatliu.com/advanced/enum.html)

### 5.类

#### 5.1 修饰符

1. public

   public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public

```ts
class Animal{

  public name;

  public constructor(name){

​    this.name = name;

  }

}
let cat = new Animal('tom');
```

2. private
   * private修饰的属性是私有的，实例不允许访问：

      ```ts
      class Animal{

        private name;

        public constructor(name){

      ​    this.name = name;

        }

      }

      let cat = new Animal('tom');

      console.log(cat.name);
      ```
	   
	* 子类中也是不能访问的
	
	```ts
	    class Animal{
	
	      private name;
	
	      public constructor(name){
	
	    ​    this.name = name;
	
	      }
	
	    }
	
	
	
	    class Monkey extends Animal{
	
	      public constructor(name){
	
	    ​    super(name);
	
	    ​    console.log(this.name);
	
	      }
	
	    }
	```
	
	* 若构造函数修饰为private则不能被继承或实例化
	
	```ts
	class Animal{
	
	  private name;
	
	  private constructor(name){
	
	    this.name = name;
	
	  }
	
	}
	
	
	
	class Monkey extends Animal{//不能继承
	
	  public constructor(name){
	
	​    super(name);
	
	​    console.log(this.name);
	
	  }
	
	}
	
	
	
	let cat = new Animal('tom');//不能实例化
	```
	
	
	
2. protected

   * protected修饰的属性只能在子类或者类中访问，不能在实例中访问

  ```ts
  class Animal{

    protected name;

    public constructor(name){

  ​    this.name = name;

    }

  }



  class Monkey extends Animal{

    public constructor(name){

  ​    super(name);

  ​    console.log(this.name);//可以访问

    }

  }



  let cat = new Animal('tom');

  console.log(cat.name);//不能访问
  ```
   * 当构造函数修饰为 `protected` 时，该类只允许被继承：

```ts
class Animal {
  public name;
  protected constructor(name) {
    this.name = name;
  }
}
class Cat extends Animal {
  constructor(name) {
    super(name);
  }
}

let a = new Animal('Jack');//报错，animal不能被实例化
```

#### 5.2 参数属性

1.简写形式

修饰符和`readonly`还可以使用在构造函数参数中，等同于类中定义该属性同时给该属性赋值，使代码更简洁

```ts
class Animal {
  // public name: string;
  public constructor(public name) {
    // this.name = name;
  }
}
```

2.readonly

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

```ts
class Animal {
  readonly name;
  public constructor(name) {
    this.name = name;
  }
}

let a = new Animal('Jack');
console.log(a.name); // Jack
a.name = 'Tom';//报错，因为name是只读属性

// index.ts(10,3): TS2540: Cannot assign to 'name' because it is a read-only property.
```

注意如果 `readonly` 和其他访问修饰符同时存在的话，需要写在其后面。

```ts
class Animal {
  // public readonly name;
  public constructor(public readonly name) {
    // this.name = name;
  }
}
```

#### 5.3 抽象类

抽象类不允许实例化，并且其中的抽象方法必须被子类所实现

```ts
abstract class Animal{

  public name;

  public constructor(name){

​    this.name = name;

  }

  public abstract eat(food);//不能有{}

}



class Monkey extends Animal{

  public constructor(name){

​    super(name);

  }

  public eat(food){//必须要实现抽象类中的方法，并且参数相同

​    console.log("eat" + food);

  }

}



let cat1 = new Animal('tom');//abstract不能被实例化

let monkey = new Monkey('atom');
```

#### 5.4类的类型

加类型与接口类似

```ts
abstract class Animal{

  public name:string;

  public constructor(name:string) {

​    this.name = name;

  }

  public abstract eat(food);//不能有{}

}



class Monkey extends Animal{

  public constructor(name){

​    super(name);

  }

  public eat(food){//必须要实现抽象类中的方法，并且参数相同

​    console.log("eat" + food);

  }

}



let monkey:Monkey = new Monkey('atom');
```
#### 5.5静态属性和静态方法

```typescript
// TypeScript中的静态属性和静态方法
class Person {
  public name: string;
  // 静态属性
  static age: number = 22;
  static hobby: string;

  constructor(name: string) {
    this.name = name;
  }

  yield() {
    console.log('HHHHHi!');
  }

  // 静态方法
  static printAge() {
    // console.log(this.name);  // 报错，静态方法中只能调用静态属性
    console.log(this.age);
  }
}

console.log(Person.age)
Person.printAge();
```
#### 5.6多态
定义：多态是指，父类定义一个方法不去实现，让继承它的子类去实现，每一个子类有不同的表现。多态属于继承，是继承的一种表现。

```ts
// 多态
class Animal {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }

  eat() {
    // 让子类去实现具体的操作，并且不同子类，操作不同
  }
}

class Cat extends Animal {
  constructor(name:string) {
    super(name);
  }
  eat():string {
    return `The cat ${this.name} is eating fish.`
  }
}

class Dog extends Animal {
  constructor(name:string) {
    super(name);
  }
  eat():string {
    return `The dog ${this.name} is eating bone.`
  }
}
```



### 6.类与接口

#### 6.1 类实现接口

```ts
interface  Alarm{
  alert():void;
}


interface Light{
  lighten():void;
}



class car implements Alarm,Light{//使用implements来实现接口

  alert(){
​    alert('didi');
  }

  lighten(){
​    console.log('light on');
  }

}
```

#### 6.2 接口继承接口

```ts
interface Alarm {
    alert(): void;
}

interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

#### 6.3接口继承类

常见的面向对象语言中，接口是不能继承类的，但是在 TypeScript 中却是可以的：

```ts
class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

interface Point3d extends Point {
    z: number;
}

let point3d: Point3d = {x: 1, y: 2, z: 3};//使用Point3d接口来规范了一个对象，这个接口继承了Point类中的x,y属性
```
### 7.泛型

#### 7.1 单类型泛型的使用

``` ts
function createArray<T>(len:number,val:T):Array<T>{//T为type,根据输入的val的类型动态的决定了输出array的类型

  let res:T[] = [];

  for(let i = 0;i < len;i++){

​    res[i] = val;

  }

  return res;

}
```

#### 7.2 多个类型参数

```ts
function swap<T,U>(turple:[T,U]):[U,T]{

  return [turple[1],turple[0]];

}
```

#### 7.3 泛型约束

使用接口来对泛型的类型进行约束从而使得该类型一定具备某种形状

```ts
interface withLen{

  length:number;

}



function getLen<T extends withLen>(some:T):number{//让T继承withLen接口从而规定其一定含有length属性

  return some.length;

}
```

#### 7.4 泛型接口

```ts
interface createArrayIf{

  <T>(len:number,val:T):Array<T>;

}



let createArray:createArrayIf;

createArray = function <T>(len:number,val:T):Array<T>{

  let res:T[] = [];

  for(let i = 0;i < len;i++){

​    res[i] = val;

  }

  return res;

}
```

#### 7.5 泛型类

将泛型用于类的定义中

```ts
class GenericNumber<T>{

  num:T;

  add:(x:T,y:T)=>void;

}



let myGenericNumber = new GenericNumber<number>();

myGenericNumber.num = 1;

myGenericNumber.add = function (x:number,y:number){

  console.log(x + y);

}
```

#### 7.6泛型参数的默认类型

```ts
interface createArrayIf{

  <T>(len:number,val:T):Array<T>;

}



let createArray:createArrayIf;

createArray = function <T = number>(len:number,val:T):Array<T>{//给了一个默认的参数类型为number

  let res:T[] = [];

  for(let i = 0;i < len;i++){

​    res[i] = val;

  }

  return res;

}
```

### 8.模块

#### 8.1 模块的暴露和引入

```typescript
// 暴露
let dbUrl = 'https://202.43.21.1';

export function getData():void {
}

export function save():void {
}

// 或者
export {getData, save, dbUrl};

// 或者
export default getData;
```

```typescript
// 引入
import {getData, save} from "./modules/db";
// 或者
import {getData as get, save} from "./modules/db";
// 或者
import get from './modules/db';
```

#### 8.2 命名空间

```typescript
// 命名空间
namespace A {
  export class Dog {
    name:string;
    constructor(name:string) {
      this.name = name;
    }
    eat():string {
      return `namespace A, dog ${this.name} is eating.`;
    }
  }
}

namespace B {
  export class Dog {
    name:string;
    constructor(name:string) {
      this.name = name;
    }
    eat():string {
      return `namespace B, dog ${this.name} is eating.`
    }
  }
}

let dogA = new A.Dog('A');
let dogB = new B.Dog('B');
console.log(dogA.eat());
console.log(dogB.eat());
```

### 9. 装饰器

#### 9.1 装饰器概念

- 装饰器是一种特殊类型的声明，它能够被附加到类声明、方法，属性或参数上，可以修改类的行为。
- 通俗一点，装饰器**是一个方法**，可以注入到类、方法、属性参数上，从而实现扩展类、属性、方法、参数的功能。
- "非侵入式的行为修改。"
- 常见的装饰器类型：
  - 类装饰器
  - 属性装饰器
  - 方法装饰器
  - 参数装饰器
- 使用场景举例：
  - 某一个函数被很多人用，当我们想要对这个函数执行耗时统计的时候，为了不影响其他人使用，我们自己加上一个耗时统计的装饰器，当不需要计时的时候，删除装饰器即可。

#### 9.2 类装饰器

##### 9.2.1 普通装饰器（传入当前类）

```typescript
// 类装饰器：普通装饰器（无法传参）
function logClass(params: any) {
  // params指代的就是当前的类，也就是被装饰的类
  console.log(params);
  params.prototype.apiUrl = 'www.art.com';
  params.prototype.run = function () {
    console.log('comes from function run()');
  };
}

@logClass
class HttpClient {
  constructor() {
  }

  getData() {
  }
}

let http: any = new HttpClient();
console.log(http.apiUrl);
http.run();
```

 

##### 9.2.2 装饰器工厂（传入参数）

```typescript
// 类装饰器：装饰器工厂（可传参）
function logClass(params: string) {
  // 注意这里的params不再是被装饰的类，而是传给装饰器的参数
  return function (target: any) {
    // 这里面的target才是被装饰的类，在例中即HttpClient
    console.log(target);
    console.log(params);
    target.prototype.apiUrl = `apiUrl: ${params}`;
  };
}

@logClass('https://www.art.com')
class HttpClient {
  constructor() {
  }

  getData() {
  }
}

let http: any = new HttpClient();
console.log(http.apiUrl);
```

##### 9.2.3 重载构造函数

```typescript
function logClass(target: any) {
  return class extends target {//如果类修饰器返回的是一个新的类，则用该类代替原类,但是新类必须是原类的子类
    apiUrl: any = "apiURL in decorator.";
    getData() {
      console.log(`Decorator: ${this.apiUrl}`);
    }
  };
}

@logClass
class HttpClient {
  public apiUrl: string | undefined;

  constructor() {
    this.apiUrl = 'apiURL in constructor.';
  }

  getData() {
    console.log(`Constructor: ${this.apiUrl}`);
  }
}

let http = new HttpClient();
console.log(http.apiUrl)//apiURL in decorator.
http.getData();//Decorator: apiURL in decorator
```

#### 9.3 属性装饰器

```ts
function logProperty(params: any): any {//params为参数
  return function (target: any, attr: any): void {
    console.log(target);//target为目标类
    console.log(attr);//为修饰属性名
    console.log(params);
    target[attr] = params;//注意通过[]的方式改属性，不能用target.attr否则attr会被当成一个字符串
  };
}

class HttpClient {
  @logProperty("123")
  public apiUrl: string | undefined;

  //注意如果要通过修饰器的方式来修改apiUrl,constructor不能定义该属性，否则修饰器中的属性会被覆盖
  constructor() {}

  getData() {
    console.log(`Constructor: ${this.apiUrl}`);
  }
}

let http = new HttpClient();
console.log(http.getData());
```

#### 9.4 方法装饰器

```typescript
// 方法装饰器

// 它会被应用到方法的属性描述符上，可以用于监视、修改、替换方法定义
// 方法装饰器会在运行时传入下列3个参数：
// 1.类的构造函数
// 2.成员的名字
// 3.成员的属性描述符: writable, enumerable, configurable ...

function logMethods(params: any) {
  return function (target: any, methodName: any, methodDesc: any) {
    console.log(target);     // 原型对象
    console.log(methodName); // 方法名称
    console.log(methodDesc); // 方法描述
    console.log(methodDesc.value); // 被装饰的方法

    let oMethod = methodDesc.value;
    methodDesc.value = function (...args:any[]) {
      console.log('Method has been changed by decorator. XD')
      oMethod.apply(this, args)//如果只需要修改方法而不是替换方法则可以再执行一下原方法
    }

    target.apiUrl = 'apiUrl_apiUrl';
    target.run = function () {
      console.log('Running... QAQ');
    };
  };
}

class HttpClient {
  public url: any | undefined;

  constructor() {
  }

  @logMethods('https://www.art.com')
  getData(str:string) {
    console.log(`${str}, getting data... TAT`);
  }
}

let http: any = new HttpClient();
http.run();
console.log(http.apiUrl);
http.getData('Hey');
```

#### 9.5 参数修饰器

```typescript
// 方法参数装饰器

// 参数装饰器表达式会在运行时当作函数被调用，可以使用参数装饰器为类的原型增加一些元素数据，传入下列3个参数：
// 1.对于静态成员来说是类的构造函数，对于实例成员是类的原型对象
// 2.方法的名字
// 3.参数在函数参数列表中的索引。

function logParams(params: any) {
  return function (target: any, methodName: any, paramsIndex: any) {
    console.log(params);
    console.log(target);
    console.log(methodName);
    console.log(paramsIndex);
  };
}

class HttpClient {
  public url: any | undefined;

  constructor() {
  }

  getData(@logParams('decorator_uuid') uuid: any) {//对uuid这个参数传入一个修饰器，该参数在参数列表中的索引是0，即第一个参数
    console.log(`Methods in getData. uuid: ${uuid}`);
  }
}

let http = new HttpClient();
http.getData(2043);
```

## 为什么使用TS

1.程序更容易理解

因为有代码就是全部的注释

