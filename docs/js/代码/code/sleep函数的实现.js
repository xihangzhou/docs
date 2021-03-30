function sleep1(x) {
    let now = Date.now();//直接返回自从1970年1月1号至今（本地时间）的毫秒数
    while (true) {
        if (Date.now() - now > x) break;
    }
}
// console.log(1);
// sleep(2000);
// console.log(123);

//Date对象的总结
//生成一个Date对象会存储目前本地的时间，getTime()可以返回Date对象创建是存储的时间距离1970年1月1号的毫秒数
//Date.new()是直接定义在Date构造函数中的方法，可以直接返回现在的时间距离1970年1月1号的毫秒数而不去生成一个对象

function s(time) {
    return new Promise(function (resolve, reject){
        setTimeout(resolve(), time);
    })
}

async function sleep(time){
    await s(time);
}

sleep(5000);
console.log(1);