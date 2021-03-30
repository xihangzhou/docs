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