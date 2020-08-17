const path = require('path');
const db = require('./lib/db');

const jsonFilePath = path.join(__dirname,'db.json');
db.setJsonFilePath(jsonFilePath);

const Livro = require('./lib/livro');
const Autor = require('./lib/autor');
const Editora = require('./lib/editora');

const l = new Livro();
l.save();

const a = new Autor();
a.save();

const e = new Editora();
e.save();
