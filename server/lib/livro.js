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
        if( editora instanceof Editora )
            this.editora = editora;

        return this
    }

    getPreco(){
        return this.preco;
    }

    setPreco(preco){
        const precoAsFloat = parseFloat(preco);

        if(isNaN(precoAsFloat)){
            return false;
        }

        if(preco < 0)
            return false;

        this.preco = preco;

        return this;
    }

    getUnidadesEstoque(){
        return this.unidadesEstoque;
    }

    setUnidadesEstoque(unidadesEstoque){
        const unidadesAsInt = parseInt(unidadesEstoque);

       if(isNaN(unidadesAsInt)){
           return false;
       }

       if(unidadesEstoque < 0)
           return false;

       this.unidadesEstoque = unidadesEstoque;

       return this;

    }

    toObject(){

        const autores = this.autores.map( autor => autor.getNome());

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
            livro.editora === editora.getNome()
        );
        if(editora != null)
            this.setEditora(editora);

        const autorCollection = this.instance.data['autores'];
        autorCollection
            .filter( autor => livro.autores.indexOf(autor.getNome()) >= 0 )
            .forEach( autor => this.addAutor(autor) );
    }

}

module.exports = Livro;
