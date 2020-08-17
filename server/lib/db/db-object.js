const db = require('./index');

function DBObject(collection){
    this.collection = collection;
    this.instance = db.getInstance();
}

DBObject.prototype.save = function(){
    console.log('save!', this.collection);
}

module.exports = DBObject;
