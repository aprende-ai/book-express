const fs = require('fs');

class DB{

    constructor(dbFileLocation, objectCreator){
        this.dbFileLocation = dbFileLocation;
        this.objectCreator = objectCreator;
        this.data = {};
    }

    sync(){

        const conteudoArquivo = fs.readFileSync(this.dbFileLocation);
        const data = JSON.parse(conteudoArquivo);
        const collections = Object.keys(data);

        collections.forEach( collectionName => {

            if( typeof this.data[collectionName] === 'undefined' ){
                this.data[collectionName] = [];
            }

            data[collectionName].forEach( item => {
                const obj = this.objectCreator(collectionName, item);
                this.data[collectionName].push(obj);
            });
        });

        const createdCollections = Object.keys(this.data);
        createdCollections.forEach(collectionName => {
            this.data[collectionName].forEach( item => item.link(data) );
        });

    }

    save(){

        const toSave = {};

        const collections = Object.keys(this.data);
        let collectionIdx = collections.length -1;

        collections.forEach( collectionName => {

            if(typeof toSave[collectionName] === 'undefined'){
                toSave[collectionName] = [];
            }

            this.data[collectionName].forEach( item => {
                toSave[collectionName].push(item.toObject())
            })

        })

        const strData = JSON.stringify(toSave);
        fs.writeFileSync(this.dbFileLocation, strData);
    }

}

module.exports = DB;
