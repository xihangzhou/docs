//深拷贝的方式
//1.用JSON实现
//问题:如果对象中的某一项值是正则或者函数，基于JSON.stringify和JSON.parse处理后就不在是正则（变为空对象）或者函数（变为null）了
function deepClone_JSON(obj){
    return JSON.parse(JSON.stringify(obj));
}
//2.自己手写，对数组和对象进行深浅拷贝
function deepClone(obj){
    function _type(obj){
        return {}.toString.call(obj);
    }
    //调用原型上的constructor生成对应的容器
    let newObj = new obj.constructor();
    //for(let key in obj) 对数组和对象都是key为下标，且要用hasOwnProperty进行判断是否是该对象上的属性
    //for(let value of array) 只对数组有效，且是遍历的值，且不用担心遍历到其他的不是自己的属性
    //所以不知道是数组还是对象用for let in 且用obj[]的方式遍历可以规避掉这两者之间的差异
    for(let key in obj){
        if(!obj.hasOwnProperty(key)) break;
        if((typeof obj[key] === 'object' && obj[key] !== null) || typeof obj[key] === 'function'){//如果是对象或者函数且不为null就要深度拷贝
            let type = _type(obj[key]);
            //检验是否是Date和Reg对象，不用深度拷贝
            if(/Date|RegExp/.test(type)){
                newObj[key] = obj[key];
                continue;
            }else{
                newObj[key] = deepClone(obj[key]);
            }

        }else{
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

let func = function(){
    console.log('123');
}
let reg = /asd/;
arr = [func,reg,12,3,4,5,'123',new Date()];
console.log(deepClone_JSON(arr)); // [null,{}]
console.log(deepClone(arr));
