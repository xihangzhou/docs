class observer{
    constructor(name){
        this.name = name;
    }
    update(str){
        console.log(str);
    }
}

class observersList{
    constructor(){
        this.list = [];
    }
    add(observer){
        this.list.push(observer);
    }
    remove(observer){
        this.list.filter((one)=>{return one !== observer});
    }
    get(name){
        for(let i = 0;i < this.list.length;i++){
            if(this.list[i].name === name){
                return this.list[i];
            }
        }
    }
}
class subject{
    constructor(){
        this.observersList = new observersList;
    }
    add(obj){
        this.observersList.add(obj);
    }
    remove(obj){
        this.observersList.remove(obj);
    }
    notify(str){
        for(let i = 0;i < this.observersList.list.length;i++){
            this.observersList.list[i].update(str);
        }
    }
}

let a = new observer('123');
let b = new observer('123');
let sub = new subject();
sub.add(a);
sub.add(b);
sub.notify('你好');