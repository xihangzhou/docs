class person{
    constructor(name){
        this.name = name
    }
    askPair(){

    }
}

class marryAgency{
    constructor(){
        this.peronlist = []
    }
    register(person){
        this.peronlist.push(person)
    }
    pair(person){
        console.log(`${person.name}和${this.peronlist[1].name}配对成功`)
    }
}

let a = new person('周夕航');
let b = new person('张栀')
let marryAgent = new marryAgency();
marryAgent.register(a);
marryAgent.register(b);
marryAgent.pair(a)
