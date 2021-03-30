let bindEvent = function (ele, type, selector, func) {
    if (typeof selector === 'function') {//如果不穿selector就不是事件代理
        func = selector;
        selector = null;
    }

    ele.addEventListener(type, function (event) {

        let target = event.target;

        if (selector) {//若果是事件代理
            if (target.matches(selector)) {
                func.call(target,event);
            }
        }else{
            func.call(target);
        }
        
    })

}

let div3 = document.getElementById("div3");

bindEvent(div3, 'click', '#div3 a', () => {
    console.log(1);
})