const db = require('./index');

class DBObject{

    constructor(collection){
        this.collectionName = collection;
        this.instance = db.getInstance();
        this.collection = this.instance.data[this.collectionName];
    }

    save(){
        this.collection.push(this);
        this.instance.save();
    }
}

module.exports = DBObject;
