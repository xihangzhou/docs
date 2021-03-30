// 构造器模式，使用了一个函数的方式构建不同的作用域

class AModule{
    constructor(){
        //this指向new的实例对象
        this.arr = [0];
    }
    call(){
        console.log(this.arr[0]);
    }
}

// 这两个实例实现了不同模块的封装
let a = new AModule();
let b = new AModule();
a.call();
b.call();