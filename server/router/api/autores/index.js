const express = require('express');
const router = express.Router();
const db = require('../../../lib/db');
const Autor = require('../../../lib/autor');

router.get('/', (req, res) => {
    const instance = db.getInstance();
    const autoresList = instance.data.autores.map( autor => autor.toObject() );

    res.send({
        error: false,
        data: autoresList
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

    const result = instance.data.autores.find( autor => autor.getId() === id );

    if(!result)
        return res.status(404).send({
            error: true,
            message: "autor não encontrado"
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
        return res.status(400).send({
            error: true,
            message: "autor deve ter um nome"
        });
    }

    let dataNascimento = null;
    if(body.dataNascimento && body.dataNascimento != null){
        dataNascimento = new Date(body.dataNascimento);
        if(isNaN(dataNascimento.getTime())){
            return res.status(400).send({
                error: true,
                message: "Data de nascimento inválida!"
            });
        }
    }

    const autor = new Autor();
    const maxId = instance.data.autores.reduce( (maxId, autor) => {
        return maxId > autor.id ? maxId : autor.id
    }, 0);

    autor.setId(maxId + 1);
    autor.setNome(body.nome);
    autor.setDataNascimento(dataNascimento);

    autor.save();

    res.send({
        error: false,
        data: autor.toObject()
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
            message: "O parâmetro id deve ser numérico"
        });
    }

    const autor = instance.data.autores.find( autor => autor.getId() === id );

    if(!autor){
        return res.status(404).send({
            error: true,
            message: "O autor de ID '"+id+"' não existe"
        });
    }

    if(body.nome){
        autor.setNome(body.nome);
    }

    if(body.dataNascimento){
        const dataNascimento = new Date(body.dataNascimento);
        if(isNaN(dataNascimento.getTime())){
            return res.status(400).send({
                error: true,
                message: "Data de nascimento inválida!"
            });
        }

        autor.setDataNascimento(dataNascimento);
    }

    autor.save();

    res.send({
        error: false,
        data: autor.toObject()
    });


});

router.delete('/:id', (req, res) => {
    const instance = db.getInstance();
    let id = req.params.id;

    id = parseInt(id);

    if(isNaN(id)){
        return res.status(400).send({
            error: true,
            message: "O parâmetro ID deve ser numérico"
        });
    }

    const autor = instance.data.autores.find( l => l.id === id );

    if(!autor)
        return res.status(404).send({
            error: true,
            message: "autor não encontrado"
        });

    const writtenBooks = instance.data.livros.find(
        l => typeof l.autores.find( a => a.id === id) != 'undefined'
    );

    if(typeof writtenBooks != 'undefined'){
        return res.status(400).send({
            error: true,
            message: "O autor tem livros cadastrados. Remova os livros antes de remover o autor"
        });
    }

    const idx = instance.data.autores.indexOf(autor);
    instance.data.autores.splice(idx,1);
    instance.save();

    res.send({
        error: false,
        data: {}
    });


});

module.exports = router;
