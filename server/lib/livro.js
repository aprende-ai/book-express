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

Livro.prototype.link = function(rawData){
    const collection = rawData[this.collectionName];

    if( typeof collection === 'undefined' )
        return false;

    let livro = null;
    for(let i=0; i<=collection.length-1; i++){
        if( collection[i].titulo === this.getTitulo()
            && collection[i].isbn === this.getIsbn() ){
            livro = collection[i];
            break;
        }
    }

    const editoraCollection = this.instance.data['editoras'];
    for(let j=0; j<=editoraCollection.length - 1; j++){
        const editora = editoraCollection[j];
        if(livro.editora === editora.getNome()){
            this.setEditora(editora);
            break;
        }
    }

    const autorCollection = this.instance.data['autores'];
    for(let k=0; k<=autorCollection.length - 1; k++){
        const autor = autorCollection[k];
        if(livro.autores.indexOf(autor.getNome()) >= 0){
            this.addAutor(autor);
            break;
        }
    }
}

module.exports = Livro;
