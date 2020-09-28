const DBObject = require('./db/db-object');

class Autor extends DBObject{

    constructor(){

        super('autor');

        this.nome = null;
        this.dataNascimento = null;

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
            nome: this.nome,
            dataNascimento: this.dataNascimento
        }
    }

    link(){

    }

}

module.exports = Autor
