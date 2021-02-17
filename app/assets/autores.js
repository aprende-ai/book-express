const uiAuthorFormTxtAuthorId = document.getElementById('txtAuthorId');
const uiAuthorFormTxtAuthorName = document.getElementById('txtAuthorName');
const uiAuthorFormTxtAuthorBday = document.getElementById('txtAuthorBday');
const uiAuthorFormBtnSave = document.getElementById('btnAuthorFormSave');
const uiAuthorFormBtnCancel = document.getElementById('btnAuthorFormCancel');
const uiAuthorFormBtnNew = document.getElementById('btnAuthorFormNew');

let uiAuthorFormIsEditting = false;
let uiAuthorFormIsCreating = false;
let uiAuthorFormIsEmpty = true;
let uiAuthorFormIsProcessing = false;

function getAutores(){
    return fetch('/api/autores')
        .then( response => response.json() )
        .then( data => data.data )
}

function updateAuthor(id, payload){
    return fetch('/api/autores/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function createAuthor(payload){
    return fetch('/api/autores/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function removeAuthor(id){
    return fetch('/api/autores/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function startAuthors(){
    getAutores().then( authorsList => {
        const authorUl = divAutores.getElementsByTagName('ul')[0];
        const authorLi = authorUl.getElementsByTagName('li');
        Array.from(authorLi).forEach( li => li.remove() );

        authorsList.forEach( author => {
            const newLi = document.createElement('li');
            authorUl.appendChild(newLi);

            const button = document.createElement('button');
            button.textContent = 'X';
            newLi.appendChild(button);

            const span = document.createElement('span');
            span.textContent = author.nome;
            newLi.appendChild(span);

            button.onclick = function(event){
                event.stopPropagation();
                uiRemoveAuthor(author.id);
            }

            newLi.onclick = function(){
                uiSetAuthor(author.id, author.nome, author.dataNascimento);
            }


        })

    })
}

// ---

function uiSetAuthor(id, name, birthDay){


    const cleanBday = birthDay.replace('Z','');
    const bDayAsDate = new Date(cleanBday);

    let bDay = bDayAsDate.getDate().toString();
    let bMonth = (bDayAsDate.getMonth() + 1).toString();
    let bYear = bDayAsDate.getFullYear().toString();

    if(bDay.length === 1)
        bDay = "0" + bDay;

    if(bMonth.length === 1)
        bMonth = "0" + bMonth;

    const showableDate = bDay + '/' + bMonth + '/' + bYear;

    uiAuthorFormTxtAuthorId.value = id;
    uiAuthorFormTxtAuthorName.value = name;
    uiAuthorFormTxtAuthorBday.value = showableDate;

    uiAuthorFormSetState('U');
}

function uiRemoveAuthor(id){
    removeAuthor(id).then( response => {
        if(response.status === 200){
            alert('Autor removido com sucesso!');
            uiAuthorFormSetState('E');
            startAuthors();
        }
    })
}

function uiAuthorFormSetState(state){
    switch(state.toUpperCase()){
        case 'U':
            uiAuthorFormIsUpdating = true;
            uiAuthorFormIsCreating = false;
            uiAuthorFormIsEmpty = false;
            uiAuthorFormIsProcessing = false;
            break;
        case 'C':
            uiAuthorFormIsUpdating = false;
            uiAuthorFormIsCreating = true;
            uiAuthorFormIsEmpty = false;
            uiAuthorFormIsProcessing = false;
            break;
        case 'E':
            uiAuthorFormIsUpdating = false;
            uiAuthorFormIsCreating = false;
            uiAuthorFormIsEmpty = true;
            uiAuthorFormIsProcessing = false;
            break;
        case 'P':
            uiAuthorFormIsUpdating = false;
            uiAuthorFormIsCreating = false;
            uiAuthorFormIsEmpty = false;
            uiAuthorFormIsProcessing = true;
            break;
    }

    uiAuthorFormUpdateButtonState();
    uiAuthorFormUpdateInputState();
}

function uiAuthorFormUpdateButtonState(){

    if(uiAuthorFormIsEmpty){
        uiAuthorFormBtnSave.disabled = true;
        uiAuthorFormBtnCancel.disabled = true;
    }else{
        uiAuthorFormBtnSave.disabled = false;
        uiAuthorFormBtnCancel.disabled = false;
    }

}

function uiAuthorFormUpdateInputState(){

    if(uiAuthorFormIsEmpty){
        uiAuthorFormTxtAuthorName.disabled = true;
        uiAuthorFormTxtAuthorBday.disabled = true;
    }else{
        uiAuthorFormTxtAuthorName.disabled = false;
        uiAuthorFormTxtAuthorBday.disabled = false;
    }

}

function uiAuthorFormCleanInputs(){

    uiAuthorFormTxtAuthorId.value = '';
    uiAuthorFormTxtAuthorName.value = '';
    uiAuthorFormTxtAuthorBday.value = '';

}

//---

startAuthors();
uiAuthorFormUpdateButtonState();
uiAuthorFormUpdateInputState();
uiAuthorFormUpdateInputState();

uiAuthorFormBtnCancel.onclick = function(){
    uiAuthorFormSetState('E');
    uiAuthorFormCleanInputs();
}

uiAuthorFormBtnSave.onclick = function(){

    const id = uiAuthorFormTxtAuthorId.value;
    const name = uiAuthorFormTxtAuthorName.value;
    const birthDate = uiAuthorFormTxtAuthorBday.value;

    const birthDatePieces = birthDate.split('/');

    const usableBirthDate = new Date(
        birthDatePieces[2],
        parseInt(birthDatePieces[1])-1,
        birthDatePieces[0],
    );

    const authorPayload = {nome: name, dataNascimento: usableBirthDate};

    const isUpdating = uiAuthorFormIsUpdating;
    const apiCall = uiAuthorFormIsUpdating
        ? updateAuthor.bind(this, id, authorPayload)
        : createAuthor.bind(this, authorPayload);

    uiAuthorFormSetState('P');

    apiCall().then( result => {
        const success = false;
        if(result.status === 200){
            if(isUpdating)
                alert('Autor alterado com sucesso!');
            else
                alert('Autor criado com sucesso!');
            startAuthors();
            uiAuthorFormSetState('E');
            uiAuthorFormCleanInputs();
        }
    })


}

uiAuthorFormBtnNew.onclick = function(){
    uiAuthorFormSetState('C');
    uiAuthorFormCleanInputs();
}
