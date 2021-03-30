// let _type = (function () {//用一个函数把这些东西都包起来规避这一个实现功能的模块中与外面的变量发生冲突
//     let _obj = {
//         //obj的属性都为字符串
//         isNumber: 'Number',
//         isString: 'String',
//         isBool: 'Boolean',
//         isUndefined: 'Undefined',
//         isNull: 'Null',
//         isSymbol: 'Symbol',
//         isObject: 'Object',
//         isDate: 'Date',
//         isRegExp: 'RegExp',
//         isArray: 'Array',
//         isFunction: "Function",
//         isWindow: 'Window',
//     }

//     let _type = {},
//         _toString = Object.prototype.toString;

//         //把这些方法返回给这个对象
//         //注意数组的遍历和对象用for in不同，对象只返回属性不是返回的值
//         for(let key in _obj){
//             //因为遍历对象只能使用key in obj所以有可能遍历到不是自己定义的属性上
//             //其实可以不加，因为key in obj只是针对的array而言因为对array有可能遍历到除了数组元素以外的属性
//             if(!_obj.hasOwnProperty(key)) break;

//             _type[key] = (function(){
//                 //注意用new RegExp的方式转义字符\要用\\来代替，并且在字符串中不用在开头结尾加/,会自动加上
//                 let reg = new RegExp('\\[object ' + _obj[key] + '\\]');
//                 return function(value){
//                     return reg.test(_toString.call(value));
//                 }
//             })();
//         }

//         return _type;
// })();



let _type = (function () {//用一个函数把这些东西都包起来规避这一个实现功能的模块中与外面的变量发生冲突
    let _obj = {
        //obj的属性都为字符串
        isNumber: 'Number',
        isString: 'String',
        isBool: 'Boolean',
        isUndefined: 'Undefined',
        isNull: 'Null',
        isSymbol: 'Symbol',
        isObject: 'Object',
        isDate: 'Date',
        isRegExp: 'RegExp',
        isArray: 'Array',
        isFunction: "Function",
        isWindow: 'Window',
    }

    let _type = {},
        _toString = Object.prototype.toString;

    //把这些方法返回给这个对象
    //注意数组的遍历和对象用for in不同，对象只返回属性不是返回的值
    for (let key in _obj) {
        //因为遍历对象只能使用key in obj所以有可能遍历到不是自己定义的属性上
        //其实可以不加，因为key in obj只是针对的array而言因为对array有可能遍历到除了数组元素以外的属性
        if (!_obj.hasOwnProperty(key)) break;

        let reg = new RegExp('\\[object ' + _obj[key] + '\\]');

        _type[key] = function (value) {
            return reg.test(_toString.call(value));
        }
    }

    return _type;
})();

let a = function () { };
console.log(_type.isFunction(a));


// var a  = {};
// for(var i = 0;i < 5;i++){
//     let obj = {
//         i
//     };
//     a[i] = function(){
//         console.log(obj.i);
//     };
// }
// console.log(a['2']());

let obj = [1,2,3,4]

obj.isHash = 'hash'
for(let key in obj){
    console.log(obj[key]);
}

let str = '[Object String]';
let reg = new RegExp('\\[Object ' + 'String' + '\\]');
console.log(reg.test(str));