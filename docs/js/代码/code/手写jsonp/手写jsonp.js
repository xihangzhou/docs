function jsonp(url, data, callback = 'callback') {
    return new Promise((resolve, reject) => {
        data.callback = callback
        let params = []
        for(let key in data){
            params.push(`${key}=${data[key]}`)//要用${}就要用``
        }
        url = url + '?' + params.join('&')
        let script = document.createElement('script')
        script.src = url
        window[callback] = function (result) {//注意应该用[callback]
            if (result === undefined) {
                reject('没有找到')
            } else {
                resolve(result)
            }
            script.parentNode.removeChild(script)
        }
        document.body.appendChild(script)
    })
}

let data = {username:'zxh'}
jsonp('https://www.baidu.com/', data, 'abc').then((result) => { console.log(result) })