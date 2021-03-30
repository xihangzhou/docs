//浅拷贝的方式（浅拷贝只会拷贝第一层）
let obj1 = {
    1:'1',
    2:'2'
}
let arr = [1, 2, 3, obj1];
//1.用slice实现
let arr_slice = arr.slice(0);
//因为是浅拷贝，所以arr_slice[3]和obj1指向同一个内存地址
arr_slice[3].a = 'a';
console.log(arr,obj1);
console.log(arr_slice);
//2.用展开运算符实现
let arr_zhankai = [...arr];
console.log(arr_zhankai);
