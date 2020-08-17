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

module.exports = Editora;
