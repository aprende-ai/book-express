const path = require('path');
const db = require('./lib/db');
const Autor = require('./lib/autor');
const Editora = require('./lib/editora');
const Livro = require('./lib/livro');


const jsonFilePath = path.join(__dirname,'db.json');
db.setJsonFilePath(jsonFilePath);
db.setObjectCreator( function(collection, item){
    switch(collection){
        case "livros":
            return new Livro()
                .setTitulo(item.titulo)
                .setIsbn(item.isbn)
                .setPreco(item.preco)
                .setUnidadesEstoque(item.unidadesEstoque);

        case "editoras":
            return new Editora()
                .setNome(item.nome);

        case "autores":
            return new Autor()
                .setNome(item.nome)
                .setDataNascimento(item.dataNascimento);
    }
})
db.getInstance();
