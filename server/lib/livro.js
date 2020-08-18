const DBObject = require('./db/db-object');
const Autor = require('./autor');
const Editora = require('./editora');

function Livro(){

    this.titulo = null;
    this.autores = [];
    this.isbn = null;
    this.editora = null;

    this.preco = 0;
    this.unidadesEstoque = 0;

    DBObject.call(this, 'livros');

}

Livro.prototype = Object.create(DBObject.prototype);

Livro.prototype.getTitulo = function(){
    return this.titulo;
}

Livro.prototype.setTitulo = function(titulo){
    this.titulo = titulo;
    return this;
}

Livro.prototype.getAutores = function(){
    return this.autores;
}

Livro.prototype.addAutor = function(autor){

    if(autor instanceof Autor){
        this.autores.push(autor);
    }

    return this;
}

Livro.prototype.removeAutor = function(autor){

    if(autor instanceof Autor){

        const index = this.autores.indexOf(autor);

        if(index === -1)
            return;

        this.autores.splice(index,1);

    }

}

Livro.prototype.getIsbn = function(){
    return this.isbn;
}

Livro.prototype.setIsbn = function(isbn){
    this.isbn = isbn;
    return this;
}

Livro.prototype.getEditora = function(){
    return this.editora;
}

Livro.prototype.setEditora = function(editora){
    if( editora instanceof Editora )
        this.editora = editora;

    return this
}

Livro.prototype.getPreco = function(){
    return this.preco;
}

Livro.prototype.setPreco = function(preco){

    const precoAsFloat = parseFloat(preco);

    if(isNaN(precoAsFloat)){
        return false;
    }

    if(preco < 0)
        return false;

    this.preco = preco;

    return this;
}

Livro.prototype.getUnidadesEstoque = function(){
    return this.unidadesEstoque;
}

Livro.prototype.setUnidadesEstoque = function(unidadesEstoque){

    const unidadesAsInt = parseInt(unidadesEstoque);

    if(isNaN(unidadesAsInt)){
        return false;
    }

    if(unidadesEstoque < 0)
        return false;

    this.unidadesEstoque = unidadesEstoque;

    return this;
}

Livro.prototype.toObject = function(){

    const autores = [];
    if(this.autores.length > 0){
        let idx = 0;
        do{
            autores.push(this.autores[idx].getNome());
            idx++;
        }while(idx <= this.autores.length - 1)
    }

    const editora = this.editora.getNome()

    return {
        titulo: this.titulo,
        autores,
        isbn: this.isbn,
        editora,
        preco: this.preco,
        unidadesEstoque: this.unidadesEstoque
    }
}

module.exports = Livro;
