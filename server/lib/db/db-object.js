const db = require('./index');

function DBObject(collection){
    this.collectionName = collection;
    this.instance = db.getInstance();
    this.collection = this.instance.data[this.collectionName];
}

DBObject.prototype.save = function(){

    this.collection.push(this);
    this.instance.save();

}

module.exports = DBObject;
