const mySetInterval = (cb, time) => {
    const fn = () => {
        cb() // 执行传入的回调函数
        setTimeout(() => {
            fn() // 递归调用自己
        }, time)
    }
    setTimeout(fn, time)
}

let timeMap = {}
let id = 0 // 简单实现id唯一
const mySetInterval = (cb, time) => {
    let timeId = id // 将timeId赋予id
    id++ // id 自增实现唯一id
    let fn = () => {
        cb()
        timeMap[timeId] = setTimeout(() => {
            fn()
        }, time)
    }
    timeMap[timeId] = setTimeout(fn, time)
    return timeId // 返回timeId
}

const myClearInterval = (id) => {
    clearTimeout(timeMap[id]) // 通过timeMap[id]获取真正的id
    delete timeMap[id]
}