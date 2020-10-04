

function getBancoLivros(){

    const localStorage = window.localStorage;

    let bancoLivros = localStorage.getItem('bancoLivros');
    if(bancoLivros == null){
        localStorage.setItem('bancoLivros', JSON.stringify([]));
    }

    return JSON.parse(localStorage.getItem('bancoLivros'));

}

function setBancoLivros(livros){

    const localStorage = window.localStorage;
    localStorage.setItem('bancoLivros', JSON.stringify(livros));

}

const bancoDeLivros = getBancoLivros();

function obterIndiceDoLivro(nome){
    let indiceDoLivro = -1;

    for(let i=0; i<=bancoDeLivros.length-1; i++){
        if( bancoDeLivros[i] === nome ){
            indiceDoLivro = i;
            break;
        }
    }

    return indiceDoLivro;
}

function adicionaLivro(nome){
    bancoDeLivros.push(nome);
    setBancoLivros(bancoDeLivros);
}

function removeLivro(nome){

    const indiceDoLivro = obterIndiceDoLivro(nome);

    if( indiceDoLivro > -1 ){
        setBancoLivros(bancoDeLivros);
        bancoDeLivros.splice(indiceDoLivro, 1);
        console.log('O item '+nome+' foi removido com sucesso');
        return;
    }

    console.log('O item '+nome+' não foi encontrado');

}

function alteraLivro(nome, substituicao){

    const indiceDoLivro = obterIndiceDoLivro(nome);

    if( indiceDoLivro > -1 ){
        setBancoLivros(bancoDeLivros);
        bancoDeLivros.splice(indiceDoLivro, 1, substituicao);
        console.log('O item '+nome+' foi alterado com sucesso');
        return;
    }

    console.log('O item '+nome+' não foi encontrado');

}

function obterLivros(){
    return bancoDeLivros;
}
