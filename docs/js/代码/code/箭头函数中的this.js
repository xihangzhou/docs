let obj1 = {
    a:'a1',
    func: function(){
        console.log(this.a);
    },
}

let obj2 = {
    a:'a2',
    //注意箭头函数没有this,箭头函数中的this都是沿着作用域链向上找到this来用，
    //因为函数的作用域都是在定义的时候被确定的，所以箭头函数中的this就是定义的时候所在上下文的this(如果上下文不是this的话)
    func: ()=>{
        console.log(this);//=> 此处指向window浏览器的话，因为是在全局作用域中被定义
    }
}

let obj3 = {
    a:'a3',
    func:function(){
        return ()=>{
            console.log(this.a);
        }
    }
}

let func1 = obj1.func;
func1();

let func2 = obj2.func;
obj2.func();//在浏览器会指向window

let func3 = obj3.func();
func3();//函数执行，初始化this，箭头函数没有this,沿着作用域链向上找到obj3.func的作用域并获取其this,其在执行之初被指向obj3,
        // 所以箭头函数中运行的this也会指向obj3
