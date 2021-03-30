let a = new Promise(function (resolve, reject) {
    let a = Math.random();
    console.log(a);
    if (a < 0.5) {
        resolve('成功');
    }
})

a.then((result) => {
    resolve();
    console.log(result);
})

class MyPromise {
    constructor(executor) {//传入执行函数
        this.status = 'pending';
        this.value = undefined;
        this.resolveArr = [];
        this.rejectArr = [];

        let change = (value, status) => {
            //注意只能修改一次
            if (this.status !== 'pending') return;
            this.value = value;
            this.status = status;
            let funcArr = status === 'resolved' ? this.resolveArr : this.rejectArr;
            if (this.funcArr.length === 0) {//如果还没有执行then放入回调函数
                setTimeout(//用一个计时器模拟微任务,先跳过执行回调函数，等执行了then后再把resolveArr中的方法执行
                    funcArr.forEach(func => {
                        func(value);
                    })
                    , 0)
            } else {//如果已经放入了就直接执行
                funcArr.forEach(func => {
                    func(value);
                })
            }
        }

        let resolve = (value) => {
            change(value, 'resolved');
        }

        let reject = (value) => {
            change(value, 'rejected');
        }

        try {
            //注意要传入resolve和reject参数
            executor(resolve, reject);
        } catch (err) {//如果执行失败则返回err.message
            reject(err.message);
        }
    }

    then(resolveFn, rejectFn) {
        //如果没有resolveFn就顺延,相当于简单执行一个返回参数的函数
        if (typeof resolveFn !== 'function') {
            resolveFn = (result) => {
                return result;
            }
        }
        //如果没有rejectFn就返回一个状态为rejected，值为reason的实例
        if (typeof rejectFn !== 'function') {
            rejectFn = (reason) => {
                return MyPromise.reject(reason);
            };
        }
        //实现then的链式写法并且要使得这个then的执行效果影响到这个新返回的Promise实例的状态
        //把then这个promise实例的两个改变状态的函数resolve,reject放在一个闭包中让上面的Promise执行时执行这个方法
        return new MyPromise((resolve, reject) => {
            //这个参数函数是箭头函数，它的作用域在被定义的时候被同时确定
            //又因为调用then是.then,所以这个箭头函数的上级作用域中的this是指向的promise实例
            this.resolveArr.push((result) => {
                try {
                    let x = resolveFn(result);
                    //如果执行的返回结果是一个promise实例的话就以这个promise实例来改变then返回的实例的状态
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                    } else {
                        resolve();
                    }
                } catch (err) {
                    reject(err.message);
                }
            });
            this.rejectArr.push((reason) => {
                try {
                    let x = rejectFn(reason);
                    if (x instanceof MyPromise) {
                        x.then(resolve, reject);
                    } else {
                        reject();
                    }
                } catch (err) {
                    reject(err.message);
                }
            });
        });
    }

    //静态方法直接返回一个值为value状态为rejected的实例，静态方法和上面的方法的区别在于静态方法是直接写在函数对象里的，而then是写在原型上
    //所以可以直接用MyPromise.resolve调用
    static resolve(value) {
        return new Promise(resolve => {
            resolve(value);
        })
    }
    //注意这个地方有一个占位符号否则reject会被resolve函数赋值
    static reject(value) {
        return new Promise((_, reject) => {
            reject(value);
        })
    }

    static all(arr) {
        return new MyPromise((resolve, reject) => {
            let index = 0,
                results = [];
            for (let i = 0; i < arr.length; i++) {
                let item = arr[i];
                if (!(item instanceof MyPromise)) continue;
                item.then(result => {
                    index++;
                    results[i] = result;
                    if (index === arr.length) {
                        resolve(results);
                    }
                }).catch(reason => {
                    // 只要有一个失败，整体就是失败
                    reject(reason);
                });
            }
        });
    }

    static race(arr) {
        let len = arr.length;
        let num = 0;
        let reasons = [];
        return new Promise((resolve, reject) => {
            for (let i = 0; i < len; i++) {
                arr[i].then((result) => {
                    resolve(result);
                }).catch((reason) => {
                    num++;
                    reasons.push(reason);
                    if (num === len) {
                        reject(reasons);
                    }
                })
            }
        })

    }
}
