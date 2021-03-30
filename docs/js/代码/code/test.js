let a = new Promise(function (resolve, reject) {
    let a = Math.random();
    console.log(a);
    if (a < 0.5) {
        resolve('成功');
    }
})

a.then((result) => {
    console.log(result);
})

class myPromise {
    constructor(executer) {

        this.PromiseStatus = 'pending';
        this.PromiseValue = null;
        this.resolveArr = [];
        this.rejecttArr = [];

        let change = (val, status) => {
            if (this.PromiseStatus !== 'pending') {
                return;
            }
            this.PromiseStatus = status;
            this.PromiseValue = val;

            let arr = this.PromiseStatus === 'resolve' ? this.resolveArr : this.rejecttArr;

            if (arr.length === 0) {
                setTimeout(arr.forEach((func, val) => {
                    func(val);
                }), 0);
            } else {
                arr.forEach((func, val) => {
                    func(val);
                })
            }
        }

        let reject = (reason) => {

            change(reason, 'reject')

        }

        let resolve = (result) => {

            change(result, 'resolve');

        }

        try {
            executer(resolve, reject);
        } catch (err) {
            reject(err.message);
        }
    }
    then(resolveFunc, rejectFunc) {
        //若没传值直接顺延
        if (typeof resolveFunc !== 'function') {
            resolveFunc = (result) => {
                return result;
            }
        }
        if (typeof rejectFunc !== 'function') {
            rejectFunc = (reason) => {
                return reason;
            }
        }

        //会返回一个promise实例，该实例的状态和值会根据执行状态决定
        //必须是箭头函数，这样才能访问到resolveArr
        //因为是用的.then调用的,所以this指向被调用的
        return new myPromise((resolve, reject) => {
            this.resolveArr.push((result) => {
                try {
                    let res = resolveFunc(result);
                    if (res instanceof myPromise) {
                        res.then(resolve, reject);
                    } else {
                        resolve(res);
                    }
                } catch (err) {
                    reject(err.message);
                }
            })
            this.rejectArr.push((reason) => {
                try {
                    let res = this.rejectFunc(reason);
                    if (res instanceof myPromise) {
                        res.then(resolve, reject);
                    } else {
                        reject(res);
                    }
                } catch (err) {
                    reject(err.message);
                }
            })

        })
    }

    static resolve(value){
        return new Promise((resolve,reject)=>{
            resolve(value);
        })

    }

    static reject(reason){
        return new Promise()
    }

    static all(arr){
        return new Promise((resolve,reject)=>{
            let len = arr.length;
            let results = [];
            for(let i = 0;i < len;i++){
                arr.then((result)=>{
                    results.push(result);
                },(reason)=>{
                    reject(reason);
                })
            }
            //最后
            resolve(results);
        })
    }
}