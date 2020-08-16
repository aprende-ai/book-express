const Livro = require('./livro');

function Autor(){

    this.nome = null;
    this.dataNascimento = null;
    this.livros = [];

}

Autor.prototype.getNome = function(){
    return this.nome;
}

Autor.prototype.setNome = function(nome){
    this.nome = nome;

    return this;
}

Autor.prototype.getDataNascimento = function(){
    return this.dataNascimento
}

Autor.prototype.setDataNascimento = function(data){
    if(data instanceof Date)
        this.dataNascimento = data;

    return this;
}

module.exports = Autor;
