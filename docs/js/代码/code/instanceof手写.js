
//不好，这样写会改变obj.__proto__
// function _instanceof(obj,constructor){
//     while(obj.__proto__){
//         if(obj.__proto__ === constructor.prototype){
//             return true;
//         }
//         obj.__proto__ = obj.__proto__.__proto__;
//     }
//     return false;
// }

function _instanceof(obj, constructor) {
    let proto = obj.__proto__;
    while (proto) {
        if (proto === constructor.prototype) return true;
        proto = proto.__proto__;
    }
    return false;
}


var arr = [1, 2, 3];
console.log(arr);
console.log(arr instanceof Array);
console.log(_instanceof(arr, Array));
