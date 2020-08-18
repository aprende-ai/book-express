const fs = require('fs');

function DB(dbFileLocation, objectCreator){
    this.dbFileLocation = dbFileLocation;
    this.objectCreator = objectCreator;
    this.data = {};
}

DB.prototype.sync = function(){

    const conteudoArquivo = fs.readFileSync(this.dbFileLocation);
    const data = JSON.parse(conteudoArquivo);
    const collections = Object.keys(data);

    let totalCollections = collections.length-1;

    while(totalCollections>=0){
        const collectionName = collections[totalCollections];
        const collection = data[collectionName]
        let totalItens = collection.length;

        for(let i=0; i<=totalItens-1; i++){
            const item = collection[i];
            const obj = this.objectCreator(collectionName, item);
            if( typeof this.data[collectionName] === 'undefined' ){
                this.data[collectionName] = [];
            }

            this.data[collectionName].push(obj);
        }
        totalCollections--;
    }

    console.log(this.data);
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
