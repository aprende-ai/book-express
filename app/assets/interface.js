const livros = obterLivros();
const txtInput = document.getElementById('nome-livro');
const lstUls = document.getElementsByTagName('ul');
const lstFilmes = lstUls[0];
txtInput.addEventListener('keydown', inputKeyDown);

function atualizaListaFilmes(){
    for(let i=0; i<=livros.length - 1; i++){
        let li = document.createElement('li');
        li.innerText = livros[i];
        lstFilmes.append(li);
    }
}

function salvarLivro(){
    const nomeLivro = txtInput.value;
    adicionaLivro(nomeLivro);

    const liParaRemover = lstFilmes.getElementsByTagName('li');

    for(let i=liParaRemover.length-1; i>=0; i--){
        liParaRemover[i].remove();
    }

    atualizaListaFilmes();

    txtInput.value = '';

}

function inputKeyDown(event){
    const teclaPressionada = event.keyCode;

    if(teclaPressionada === 13)
        salvarLivro();
}

atualizaListaFilmes();
