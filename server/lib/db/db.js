const fs = require('fs');

function DB(dbFileLocation){
    this.dbFileLocation = dbFileLocation;
    this.data = null;
}

DB.prototype.sync = function(){
    const data = fs.readFileSync(this.dbFileLocation);
    this.data = JSON.parse(data);
}

DB.prototype.save = function(){

    const paraSalvar = {};

    const collections = Object.keys(this.data);
    let collectionIdx = collections.length -1;

    do{

        const collectionName = collections[collectionIdx];

        if(typeof paraSalvar[collectionName] === 'undefined'){
            paraSalvar[collectionName] = [];
        }

        let itensIdx = 0;
        while(itensIdx <= this.data[collectionName].length-1){
            const item = this.data[collectionName][itensIdx];
            paraSalvar[collectionName].push(item.toObject());
            itensIdx++;
        }

        collectionIdx--;

    }while(collectionIdx >= 0)

    const strData = JSON.stringify(paraSalvar);
    fs.writeFileSync(this.dbFileLocation, strData);
}

module.exports = DB;
