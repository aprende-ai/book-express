const bancoDeLivros = [
    'Os tres porquinhos',
    'Cinderela',
    'A pequena sereia'
];

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
}

function removeLivro(nome){

    const indiceDoLivro = obterIndiceDoLivro(nome);

    if( indiceDoLivro > -1 ){
        bancoDeLivros.splice(indiceDoLivro, 1);
        console.log('O item '+nome+' foi removido com sucesso');
        return;
    }

    console.log('O item '+nome+' não foi encontrado');

}

function alteraLivro(nome, substituicao){

    const indiceDoLivro = obterIndiceDoLivro(nome);

    if( indiceDoLivro > -1 ){
        bancoDeLivros.splice(indiceDoLivro, 1, substituicao);
        console.log('O item '+nome+' foi alterado com sucesso');
        return;
    }

    console.log('O item '+nome+' não foi encontrado');

}

function obterLivros(){
    return bancoDeLivros;
}
