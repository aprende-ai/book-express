const DBObject = require('./db/db-object');
const Autor = require('./autor');

function Editora(){

    this.nome = null;
    this.autores = [];

    DBObject.call(this, 'editoras');
}

Editora.prototype = Object.create(DBObject.prototype);

Editora.prototype.getNome = function(){
    return this.nome;
}

Editora.prototype.setNome = function(nome){
    this.nome = nome;
    return this;
}

Editora.prototype.getAutores = function(){
    return this.autores;
}

Editora.prototype.addAutor = function(autor){

    if(autor instanceof Autor){
        this.autores.push(autor);
    }

    return this;
}

Editora.prototype.removeAutor = function(autor){

    if(autor instanceof Autor){

        const index = this.autores.indexOf(autor);

        if(index === -1)
            return;

        this.autores.splice(index,1);

    }

}

Editora.prototype.toObject = function(){

    let totalAutores = this.autores.length - 1;
    const autores = [];
    while(totalAutores >= 0){
        autores.push(this.autores[totalAutores].getNome());
        totalAutores--;
    }

    return {
        nome: this.nome,
        autores
    }
}

Editora.prototype.link = function(rawData){
    const collection = rawData[this.collectionName];

    if( typeof collection === 'undefined' )
        return false;

    let editora = null;
    for(let i=0; i<=collection.length-1; i++){
        if( collection[i].nome === this.getNome()){
            editora = collection[i];
            break;
        }
    }

    const autorCollection = this.instance.data['autores'];
    for(let k=0; k<=autorCollection.length - 1; k++){
        const autor = autorCollection[k];
        if(editora.autores.indexOf(autor.getNome()) >= 0){
            this.addAutor(autor);
            break;
        }
    }
}

module.exports = Editora;
