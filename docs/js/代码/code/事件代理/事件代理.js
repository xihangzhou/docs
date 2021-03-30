// let button = document.querySelector('#btn1');
// button.addEventListener('click',function(){
//     alert(this.innerHTML);
// })

// let a = document.querySelector('a');
// //不冒泡传播
// a.addEventListener('click',function(e){
//     // alert(this.innerHTML);
//     console.log(1);
//     // e.preventDefault();
//     // e.stopPropagation();
// },false)//默认false,false冒泡传播

// //冒泡时触发
// let div = document.querySelector('#div3');
// div.addEventListener('click',function(){
//     alert(this.innerHTML);
// })

//手写一个事件绑定
let bindEvent = function (ele, type, selector, func) {
    if (typeof selector === 'function') {
        func = selector;
        selector = null;
    }

    ele.addEventListener(type,function(e){
        let target = event.target;
        console.log('s');
        //闭包保存selector
        if(selector){//此时为代理执行，只有目标匹配才执行

            if(target.matches(selector)){
                func.call(target,event);
                alert(target);//target始终都是那一个被点击的无论是否冒泡
            }

        }else{//此时为直接绑定，直接执行

            func.call(target,event);

        }
    })

} 

// 普通绑定
const btn1 = document.getElementById('btn1')
//不能用箭头函数
bindEvent(btn1, 'click', function (event) {
    // console.log(event.target) // 获取触发的元素
    event.preventDefault() // 阻止默认行为
    alert(this.innerHTML)
})

// 代理绑定
const div3 = document.getElementById('div3')
bindEvent(div3, 'click', 'a', function (event) {
    event.preventDefault()
    alert(this.innerHTML)
})




