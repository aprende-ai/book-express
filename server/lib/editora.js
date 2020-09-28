const DBObject = require('./db/db-object');
const Autor = require('./autor');

class Editora extends DBObject{

    constructor(){

        super('editoras');

        this.nome = null;
        this.autores = [];


    }

    getNome(){
        return this.nome;
    }

    setNome(nome){

        this.nome = nome;
        return this;

    }

    getAutores(){
        return this.autores;
    }

    addAutor(autor){
        if(autor instanceof Autor){
            this.autores.push(autor);
        }

        return this;
    }

    removeAutor(autor){
        if(autor instanceof Autor){

            const index = this.autores.indexOf(autor);

            if(index === -1)
                return;

            this.autores.splice(index,1);

        }
    }

    toObject(){

        const autores = this.autores.map( autor => autor.getNome() );

        return {
            nome: this.nome,
            autores
        }

    }

    link(rawData){

        const collection = rawData[this.collectionName];

        if( typeof collection === 'undefined' )
            return false;

        const editora = collection.find( editora => editora.nome === this.getNome() );

        const autorCollection = this.instance.data['autores'];

        autorCollection.forEach( autor => {
            if(editora.autores.indexOf(autor.getNome()) >= 0){
                this.addAutor(autor);
            }
        });
    }

}

module.exports = Editora;
