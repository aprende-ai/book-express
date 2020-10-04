const express = require('express');
const router = require('./router');
const path = require('path');
const db = require('./lib/db');
const Autor = require('./lib/autor');
const Editora = require('./lib/editora');
const Livro = require('./lib/livro');


const initializeDatabase = () => {

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

}

const initializeWebServer = (port, callback) => {
    const server = express();
    server.use(router);
    server.listen(port, callback);

}


module.exports = {
    initializeDatabase,
    initializeWebServer
}

//
// const port = 3000
//
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//
// app.listen(port, () => {
//   console.lhttps://runkit.com/og(`Example app listening at http://localhost:${port}`)
// })
