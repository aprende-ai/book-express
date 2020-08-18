const DB = require('./db');
let instance = null;
let jsonFilePath = null;
let objectCreator = null;

function setJsonFilePath(path){
    jsonFilePath = path;
}

function setObjectCreator(fn){
    objectCreator = fn;
}

function getInstance(){
    if(instance === null){
        instance = new DB(jsonFilePath, objectCreator);
        instance.sync();
    }

    return instance;
}

module.exports = {
    setJsonFilePath,
    setObjectCreator,
    getInstance,
    DB
}
