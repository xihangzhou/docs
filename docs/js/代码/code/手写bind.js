// 手写bind ES5
(function(prototype){
    function bind(context){
        //注意node中无window
        // context = context || window;
        let args = [].slice.call(arguments,1);//调用array中的slice方法把this改到arguments上改为数组，因为arguments第一个参数为context所以不要第一个参数
        let that = this;//用一个变量保留要执行的函数
        return function(){
            let inArgs = [].slice.call(arguments,0);
            that.apply(context,args.concat(inArgs));
        }
    }
    prototype.bind = bind;

})(Function.prototype)

// 手写bind ES6
(function(prototype){
    //如果是在浏览器端可以通过context=window添加一个默认值
    function bind(context,...args){
        return (...inArgs)=>{
            this.apply(context,args.concat(inArgs));
        }
    }

    prototype.bind = bind;

})(Function.prototype)


let obj = {
    a:123,
    func(){
        console.log(this.a);
    }
}
let obj1 = {
    a:'b'
}

let b = obj.func.bind(obj1);
b();

