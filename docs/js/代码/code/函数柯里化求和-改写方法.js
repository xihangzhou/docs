let arr = [];
let sum  = function sum(...args){
	arr = arr.concat(args);
	return sum;
}
sum.toString = function(){
	return arr.reduce((x,y)=>{
		return x + y;
	})
}

console.log(sum(1,2,3)(2,3));