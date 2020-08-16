const Livro = require('./lib/livro');
const Editora = require('./lib/editora');
const Autor = require('./lib/autor');

const dataNascimentoPaulBarry = new Date("April 19, 1973");

const paulBarry = new Autor();
paulBarry.setNome('Paul Barry');
paulBarry.setDataNascimento(dataNascimentoPaulBarry);

const altaBooks = new Editora();
altaBooks.setNome('Alta Books');
altaBooks.addAutor(paulBarry);

const livro1 = new Livro();
livro1.setTitulo('Use a cabeça! Programação')
    .setIsbn(9788576084730)
    .addAutor(paulBarry);

paulBarry.addLivro(livro1);

console.log(livro1);
