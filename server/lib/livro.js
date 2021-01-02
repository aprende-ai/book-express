const DBObject = require('./db/db-object');
const Autor = require('./autor');
const Editora = require('./editora');

class Livro extends DBObject{

    constructor(){

        super('livros');

        this.titulo = null;
        this.autores = [];
        this.isbn = null;
        this.editora = null;

        this.preco = 0;
        this.unidadesEstoque = 0;



    }


    getTitulo(){
        return this.titulo;
    }

    setTitulo(titulo){
        this.titulo = titulo;
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

    getIsbn(){
        return this.isbn;
    }

    setIsbn(isbn){
        this.isbn = isbn;
        return this;
    }

    getEditora(){
        return this.editora;
    }

    setEditora(editora){
        if( editora instanceof Editora ){
            this.editora = editora;
            return this
        }

        throw new Error('A editora deve ser uma instancia da classe Editora');

    }

    getPreco(){
        return this.preco;
    }

    setPreco(preco){
        const precoAsFloat = parseFloat(preco);

        if(isNaN(precoAsFloat)){
            throw new Error('O preço deve ser um número válido');
        }

        if(preco < 0)
            throw new Error('O preço deve ser maior ou igual a zero');

        this.preco = precoAsFloat;

        return this;
    }

    getUnidadesEstoque(){
        return this.unidadesEstoque;
    }

    setUnidadesEstoque(unidadesEstoque){
        const unidadesAsInt = parseInt(unidadesEstoque);

       if(isNaN(unidadesAsInt)){
           throw new Error('As unidades em estoque devem ser representadas por um número');
       }

       if(unidadesEstoque < 0)
           throw new Error('As unidades em estoque não devem ser menores do que zero');

       this.unidadesEstoque = unidadesAsInt;

       return this;

    }

    toObject(){

        const autores = this.autores.map( autor => autor.getId());

        const editora = this.editora.getId();

        return {
            titulo: this.titulo,
            autores,
            isbn: this.isbn,
            editora,
            preco: this.preco,
            unidadesEstoque: this.unidadesEstoque
        }
    }

    link(rawData){
        const collection = rawData[this.collectionName];

        if( typeof collection === 'undefined' )
            return false;

        const livro = collection.find( livro =>
                livro.titulo === this.getTitulo()
                && livro.isbn === this.getIsbn()
        );

        const editoraCollection = this.instance.data['editoras'];
        const editora = editoraCollection.find( editora =>
            livro.editora === editora.getId()
        );
        if(editora != null)
            this.setEditora(editora);

        const autorCollection = this.instance.data['autores'];
        autorCollection
            .filter( autor => livro.autores.indexOf(autor.getId()) >= 0 )
            .forEach( autor => this.addAutor(autor) );
    }

}

module.exports = Livro;
