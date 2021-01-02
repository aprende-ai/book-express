const express = require('express');
const router = express.Router();
const db = require('../../../lib/db');
const Editora = require('../../../lib/editora');

router.get('/', (req, res) => {
    const instance = db.getInstance();
    const list = instance.data.editoras.map( editora => editora.toObject() );

    res.send({
        error: false,
        data: list
    });
});

router.get('/:id', (req, res) => {

    const instance = db.getInstance();
    let id = req.params.id;
    id = parseInt(id);

    if(isNaN(id)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ID deve ser numérico"
        });
    }

    const result = instance.data.editoras.find( editora => editora.getId() === id );

    if(!result)
        return res.status(404).send({
            error: true,
            message: "editora não encontrado"
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

    if(!body.nome){
        errors.push('A editora deve ter um nome');
    }

    if(!body.autores || body.autores.length === 0){
        errors.push('A editora deve ter ao menos um autor');
    }

    let autores = [];
    if(body.autores){
        autores = body.autores.map( autor => {
            return instance.data.autores.find(
                a => a.getId() === autor
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

    const newId = instance.data.editoras.reduce(
        (maxId, editora) => maxId > editora.getId() ? maxId : editora.getId(),
        0
    ) + 1;

    const editora = new Editora();
    editora.setId(newId);
    editora.setNome(body.nome);
    autores.forEach( autor => editora.addAutor(autor) );

    editora.save();

    res.send({
        error: false,
        data: editora.toObject()
    });

});

router.put('/:id', (req, res) => {
    const instance = db.getInstance();
    let id = req.params.id;
    const body = req.body;
    const errors = [];

    id = parseInt(id);

    if(isNaN(id)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ID deve ser numérico"
        });
    }

    const item = instance.data.editoras.find( editora => editora.getId() === id );

    if(!item){
        return res.status(404).send({
            error: true,
            message: "O editora de UD '"+id+"' não existe"
        });
    }

    if(body.nome){
        item.setNome(body.nome);
    }

    if(body.autores){

        while(item.getAutores().length > 0){
            item.removeAutor(item.getAutores()[0]);
        }

        const autores = body.autores.map( autor => {
            return instance.data.autores.find(
                a => a.getId() === autor
            );
        });

        const unknownAuthors = autores.filter(
            autor => typeof autor === 'undefined'
        ).length;

        if(unknownAuthors > 0)
            errors.push('Existem '+unknownAuthors+' autores desconhecidos');
        else
            autores.forEach( autor => item.addAutor(autor) );

    }

    if(errors.length > 0){
        return res.status(400).send({
            error: false,
            message: errors.join('\r\n')
        })
    }

    item.save();

    res.send({
        error: false,
        data: item.toObject()
    });


});

router.delete('/:id', (req, res) => {
    const instance = db.getInstance();
    let id = req.params.id;

    id = parseInt(id);

    const editora = instance.data.editoras.find( e => e.id === id );

    if(!editora)
        return res.status(404).send({
            error: true,
            message: "editora não encontrado"
        });


    const publishedBooks = instance.data.livros.filter(
        l => l.editora.getId() === id
    )

    if(publishedBooks.length > 0){
        return res.status(400).send({
            error: true,
            message: "A editora tem livros cadastrados. Remova os livros antes de remover a editora"
        });
    }


    const idx = instance.data.editoras.indexOf(editora);
    instance.data.editoras.splice(idx,1);
    instance.save();

    res.send({
        error: false,
        data: {}
    });


});

module.exports = router;
