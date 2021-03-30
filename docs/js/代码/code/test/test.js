function deepClone(obj){
    let type = typeof obj;
    if(type !== 'Object' || !obj){
      return obj;
    }
    let newObj = {};
    let keys = obj.keys();
    for(let key in keys){
      newObj[key] = deepClone(obj[key]);
    }
    return newObj;
  }

  let obj = {
      a:123,
      b:123,
      c:{
          a:123
      }
  }

  console.log(deepClone(obj));