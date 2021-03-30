
/*
*跟牛客的一样，读取数据用的是readline(),读进来的是字符串
*输出用的是print()
*/

function main() {
}
main();





    /*
    代码部分
    */
//    　　var name = "The Window";

//    　　var object = {
//    　　　　name : "My Object",
   
//    　　　　getNameFunc : function(){
//    　　　　　　return function(){
//    　　　　　　　　return this.name;
//    　　　　　　};
   
//    　　　　}
   
//    　　};
   
//    　　console.log( object.getNameFunc()() );

function Person(name){
    this.getName = function(){
        return name;
    }
    this.setName = function(newName){
        name = newName;
    }
}

let person = new Person("zz");
console.log(person.getName());
person.setName("zxh");
console.log(person.getName());
















