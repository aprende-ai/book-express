const DB = require('./db');
let instance = null;
let jsonFilePath = null;

function setJsonFilePath(path){
    jsonFilePath = path;
}

function getInstance(){
    if(instance === null){
        instance = new DB(jsonFilePath);
        instance.sync();
    }

    return instance;
}

module.exports = {
    setJsonFilePath,
    getInstance,
    DB
}
