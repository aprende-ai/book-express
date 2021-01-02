const DBObject = require('./db/db-object');

class Autor extends DBObject{

    constructor(){

        super('autores');

        this.id = null;
        this.nome = null;
        this.dataNascimento = null;

    }

    getId(){
        return this.id;
    }

    setId(id){
        this.id = id;
        return this;
    }

    getNome(){
        return this.nome;
    }

    setNome(nome){
        this.nome = nome;
        return this;
    }

    getDataNascimento(){
        return this.dataNascimento;
    }

    setDataNascimento(data){
        if(data instanceof Date)
            this.dataNascimento = data;

        return this;
    }

    toObject(){
        return {
            id: this.id,
            nome: this.nome,
            dataNascimento: this.dataNascimento
        }
    }

    link(){

    }

}

module.exports = Autor
