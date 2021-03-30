function func1(x) {
    return x + 10;
}
function func2(x) {
    return x + 10;
}
function func3(x) {
    return x + 10;
}

// function compose(...args) {
//     //因为最后要执行(10),所以肯定是返回一个函数
//     return function (...inArgs) {//这个x就是要执行的10
//         let len = args.length;
//         if (len === 0) return inArgs;
//         //分解符号只能传参时使用
//         else if (len === 1) return args[0](...inArgs);
//         else {
//             return args.reduce((x, y) => {
//                 return typeof x === 'function' ? y(x(...inArgs)) : y(x);
//             })
//         }
//     }
// }


//递归实现
function compose(...args) {
    let index = 0;
    
    return function anymous(...inArgs){
    if(index === args.length) return inArgs;
    let result = args[index++](...inArgs);
    return anymous(result);
    }

}



console.log(compose(func1, func2, func3)(10));