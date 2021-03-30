//手写一下slice
(function (prototype) {
    function slice(n){
        let newArray = [];
        for(let i = n;i < this.length;i++){
            newArray[newArray.length] = this[i];
        }
        return newArray;
    }
})(Array.prototype)




let a = function () {
    console.log([].slice.call(arguments, 0));
    //ES6中的Array.from方法可以直接转换arguments
    console.log(Array.from(arguments));
    console.log(Array.isArray(arguments));
}

a(123, 23);

