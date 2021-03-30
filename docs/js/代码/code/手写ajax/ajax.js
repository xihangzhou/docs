function ajax(url) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest;
        xhr.open('GET', url, true);//记得这里定义方法
        xhr.onreadystatechange = () => {//这里的onreadysratechange是一个变量不是一个函数是要赋值的
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(
                        JSON.parse(xhr.responseText)
                    )
                }
            } else if (xhr.status === 404 || xhr.status === 500) {
                reject(new Error('not Found'))
            }
        }
        xhr.send();
    })
}

const url = "./data/test.json"

ajax(url).then(result => {
    console.log(result);
})