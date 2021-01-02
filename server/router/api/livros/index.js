const express = require('express');
const router = express.Router();
const db = require('../../../lib/db');
const Livro = require('../../../lib/livro');

router.get('/', (req, res) => {
    const instance = db.getInstance();
    const booksList = instance.data.livros.map( livro => livro.toObject() );

    res.send({
        error: false,
        data: booksList
    });
});

router.get('/:isbn', (req, res) => {

    const instance = db.getInstance();
    let isbn = req.params.isbn;

    if(isbn.length < 13){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ter 13 digitos"
        });
    }

    isbn = parseInt(req.params.isbn);

    if(isNaN(isbn)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ser numérico"
        });
    }

    const result = instance.data.livros.find( livro => livro.getIsbn() === isbn );

    if(!result)
        return res.status(404).send({
            error: true,
            message: "Livro não encontrado"
        });

    return res.send({
        error: false,
        data: result.toObject()
    });

});

router.post('/', (req, res) => {

    const instance = db.getInstance();
    const body = req.body;
    const errors = [];


    if(!body.titulo){
        errors.push('O livro deve ter um titulo');
    }

    if(!body.isbn){
        errors.push('O livro deve ter um ISBN');
    }

    if(body.isbn){
        const dup = instance.data.livros.filter(
            livro => livro.getIsbn() === parseInt(body.isbn)
        );

        if(dup.length > 0){
            errors.push('ISBN "'+body.isbn+'" já registrado')
        }
    }

    if(!body.preco){
        errors.push('O livro deve ter um preço de venda');
    }

    if(!body.editora){
        errors.push('O livro deve ter uma editora');
    }

    if(!body.autores || body.autores.length === 0){
        errors.push('O livro deve ter ao menos um autor');
    }

    let editora = null;
    if(body.editora){
        editora = instance.data.editoras.find(
            editora => editora.getNome() === body.editora
        );

        if(!editora)
            errors.push('Editora "'+body.editora+'" desconhecida');
    }

    let autores = null;
    if(body.autores){
        autores = body.autores.map( autor => {
            return instance.data.autores.find(
                a => a.getNome() === autor
            );
        });

        const unknownAuthors = autores.filter(
            autor => typeof autor === 'undefined'
        ).length;

        if(unknownAuthors > 0){
            errors.push('Existem '+unknownAuthors+' autores desconhecidos');
        }
    }

    if(errors.length > 0){
        return res.status(400).send({
            error: true,
            message: errors.join('\r\n')
        });
    }

    const book = new Livro();
    book.setTitulo(body.titulo);
    book.setIsbn(body.isbn);
    book.setEditora(editora);
    autores.forEach( autor => book.addAutor(autor) );

    try{
        book.setPreco(body.preco);
    }catch(e){
        errors.push(e);
    }

    try{
        book.setUnidadesEstoque(body.unidadesEstoque || 0);
    }catch(e){
        errors.push(e);
    }

    if(errors.length > 0){
        return res.status(400).send({
            error: true,
            message: errors.join('\r\n')
        });
    }

    book.save();

    res.send({
        error: false,
        data: book.toObject()
    });

});

router.put('/:isbn', (req, res) => {
    const instance = db.getInstance();
    let isbn = req.params.isbn;
    const body = req.body;
    const errors = [];

    if(isbn.length < 13){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ter 13 digitos"
        });
    }

    isbn = parseInt(req.params.isbn);

    if(isNaN(isbn)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ser numérico"
        });
    }

    const book = instance.data.livros.find( livro => livro.getIsbn() === isbn );

    if(!book){
        return res.status(404).send({
            error: true,
            message: "O livro de ISBN '"+isbn+"' não existe"
        });
    }

    if(body.titulo){
        book.setTitulo(body.titulo);
    }

    if(body.preco){
        try{
            book.setPreco(body.preco);
        }catch(e){
            errors.push(e.message);
        }

    }

    if(body.unidadesEstoque){
        try{
            book.setUnidadesEstoque(body.unidadesEstoque);
        }catch(e){
            errors.push(e.message);
        }

    }

    if(body.editora){
        const editora = instance.data.editoras.find(
            editora => editora.getNome() === body.editora
        );

        if(!editora)
            errors.push('Editora '+body.editora+' não encontrada');
        else
            book.setEditora(editora);
    }

    if(body.autores){

        const autores = body.autores.map( autor => {
            return instance.data.autores.find(
                a => a.getNome() === autor
            );
        });

        const unknownAuthors = autores.filter(
            autor => typeof autor === 'undefined'
        ).length;

        if(unknownAuthors > 0)
            errors.push('Existem '+unknownAuthors+' autores desconhecidos');
        else
            autores.forEach( autor => book.addAutor(autor) );

    }

    if(errors.length > 0){
        return res.status(400).send({
            error: false,
            message: errors.join('\r\n')
        })
    }

    book.save();

    res.send({
        error: false,
        data: book.toObject()
    });


});

router.delete('/:isbn', (req, res) => {
    const instance = db.getInstance();
    let isbn = req.params.isbn;

    if(isbn.length < 13){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ter 13 digitos"
        });
    }

    isbn = parseInt(req.params.isbn);

    if(isNaN(isbn)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ISBN deve ser numérico"
        });
    }

    const livro = instance.data.livros.find( l => l.isbn === isbn );

    if(!livro)
        return res.status(404).send({
            error: true,
            message: "Livro não encontrado"
        });


    const idx = instance.data.livros.indexOf(livro);
    instance.data.livros.splice(idx,1);
    instance.save();

    res.send({
        error: false,
        data: {}
    });


});

module.exports = router;
