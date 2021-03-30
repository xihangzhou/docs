(function(prototype){

    function call(context,...args){
        //为了实现call把要执行的函数当作一个新的属性放在要执行的对象中
        context.$func = this;
        let result = context.$func(...args);
        delete context.$func;
        return result;
    }

    prototype.call = call;

})(Function.prototype)

let obj = {
    a:'a',
    func: function func () {
        console.log(this.a);
    }
}
let obj1 = {
    a:'b'
}
obj.func.call(obj1);


