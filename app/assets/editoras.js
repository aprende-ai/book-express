const uiPublisherFormTxtPublisherId = document.getElementById('txtPublisherId');
const uiPublisherFormTxtPublisherName = document.getElementById('txtPublisherName');
const uiPublisherAuthorList = document.getElementById('publisher-author-list');
const uiPublisherFormBtnSave = document.getElementById('btnPublisherFormSave');
const uiPublisherFormBtnCancel = document.getElementById('btnPublisherFormCancel');
const uiPublisherFormBtnNew = document.getElementById('btnPublisherFormNew');

let uiPublisherFormIsEditting = false;
let uiPublisherFormIsCreating = false;
let uiPublisherFormIsEmpty = true;
let uiPublisherFormIsProcessing = false;

function getEditoras(){
    return fetch('/api/editoras')
        .then( response => response.json() )
        .then( data => data.data )
}

function updatePublisher(id, payload){
    return fetch('/api/editoras/'+id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function createPublisher(payload){
    return fetch('/api/editoras/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

function removePublisher(id){
    return fetch('/api/editoras/'+id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function startPublishers(){
    getEditoras().then( publishersList => {
        const publisherUl = divEditoras.getElementsByTagName('ul')[0];
        const publisherLi = publisherUl.getElementsByTagName('li');
        Array.from(publisherLi).forEach( li => li.remove() );

        publishersList.forEach( publisher => {
            const newLi = document.createElement('li');
            publisherUl.appendChild(newLi);

            const button = document.createElement('button');
            button.textContent = 'X';
            newLi.appendChild(button);

            const span = document.createElement('span');
            span.textContent = publisher.nome;
            newLi.appendChild(span);

            button.onclick = function(event){
                event.stopPropagation();
                uiRemovePublisher(publisher.id);
            }

            newLi.onclick = function(){
                uiPublisherFormCleanInputs();
                uiSetPublisher(publisher.id, publisher.nome, publisher.autores);
            }


        })

    })
}

function updatePublisherAuthorList(){
    getAutores().then(authors => {
        const labels = uiPublisherAuthorList.getElementsByTagName('label');
        const listHolder = uiPublisherAuthorList.getElementsByClassName('list')[0];

        Array.from(labels).forEach( label => label.remove() );

        authors.forEach( author => {
            const label = document.createElement('label');
            label.className="checkbox-label"
            listHolder.appendChild(label);

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = author.id;
            input.checked = false;
            label.appendChild(input);

            const span = document.createElement('span');
            span.textContent = author.nome;
            label.appendChild(span);
        });

        uiPublisherFormUpdateButtonState();

    })
}

// ---

function uiSetPublisher(id, name, authors){

    const labels = Array.from(
        uiPublisherAuthorList.getElementsByTagName('label')
    );

    uiPublisherFormTxtPublisherId.value = id;
    uiPublisherFormTxtPublisherName.value = name;

    authors.forEach(author => {
        const authorLabel = labels.find( l =>
            l.getElementsByTagName('input')[0].value === author.toString()
        );

        const authorCheckBox = authorLabel.getElementsByTagName('input')[0];

        authorCheckBox.checked = true;
    })

    uiPublisherFormSetState('U');
}

function uiRemovePublisher(id){
    removePublisher(id).then( response => {
        if(response.status === 200){
            alert('Editora removida com sucesso!');
            uiPublisherFormSetState('E');
            startPublishers();
        }
    })
}

function uiPublisherFormSetState(state){
    switch(state.toUpperCase()){
        case 'U':
            uiPublisherFormIsUpdating = true;
            uiPublisherFormIsCreating = false;
            uiPublisherFormIsEmpty = false;
            uiPublisherFormIsProcessing = false;
            break;
        case 'C':
            uiPublisherFormIsUpdating = false;
            uiPublisherFormIsCreating = true;
            uiPublisherFormIsEmpty = false;
            uiPublisherFormIsProcessing = false;
            break;
        case 'E':
            uiPublisherFormIsUpdating = false;
            uiPublisherFormIsCreating = false;
            uiPublisherFormIsEmpty = true;
            uiPublisherFormIsProcessing = false;
            break;
        case 'P':
            uiPublisherFormIsUpdating = false;
            uiPublisherFormIsCreating = false;
            uiPublisherFormIsEmpty = false;
            uiPublisherFormIsProcessing = true;
            break;
    }

    uiPublisherFormUpdateButtonState();
    uiPublisherFormUpdateInputState();
}

function uiPublisherFormUpdateButtonState(){
    const labels = Array.from(
        uiPublisherAuthorList.getElementsByTagName('label')
    );

    if(uiPublisherFormIsEmpty){
        uiPublisherFormBtnSave.disabled = true;
        uiPublisherFormBtnCancel.disabled = true;
        labels.forEach( label => {
            label.getElementsByTagName('input')[0].disabled = true
        });

    }else{
        uiPublisherFormBtnSave.disabled = false;
        uiPublisherFormBtnCancel.disabled = false;

        labels.forEach( label => {
            label.getElementsByTagName('input')[0].disabled = false
        });
    }

}

function uiPublisherFormUpdateInputState(){

    if(uiPublisherFormIsEmpty){
        uiPublisherFormTxtPublisherName.disabled = true;
    }else{
        uiPublisherFormTxtPublisherName.disabled = false;
    }

}

function uiPublisherFormCleanInputs(){
    const labels = Array.from(
        uiPublisherAuthorList.getElementsByTagName('label')
    );

    uiPublisherFormTxtPublisherId.value = '';
    uiPublisherFormTxtPublisherName.value = '';

    labels.forEach( label => {
        label.getElementsByTagName('input')[0].checked = false
    });

}

//---

startPublishers();
updatePublisherAuthorList();
uiPublisherFormUpdateButtonState();
uiPublisherFormUpdateInputState();
uiPublisherFormUpdateInputState();

uiPublisherFormBtnCancel.onclick = function(){
    uiPublisherFormSetState('E');
    uiPublisherFormCleanInputs();
}

uiPublisherFormBtnSave.onclick = function(){
    const labels = Array.from(
        uiPublisherAuthorList.getElementsByTagName('label')
    );

    const id = uiPublisherFormTxtPublisherId.value;
    const name = uiPublisherFormTxtPublisherName.value;
    const authors = labels.map( label => {
        const checkbox = label.getElementsByTagName('input')[0];
        return checkbox.checked ? parseInt(checkbox.value) : null;
    }).filter( a => a != null)

    const publisherPayload = {nome: name, autores: authors};

    const isUpdating = uiPublisherFormIsUpdating;
    const apiCall = uiPublisherFormIsUpdating
        ? updatePublisher.bind(this, id, publisherPayload)
        : createPublisher.bind(this, publisherPayload);

    uiPublisherFormSetState('P');

    apiCall().then( result => {
        const success = false;
        if(result.status === 200){
            if(isUpdating)
                alert('Editora alterada com sucesso!');
            else
                alert('Editora criada com sucesso!');
            startPublishers();
            uiPublisherFormSetState('E');
            uiPublisherFormCleanInputs();
        }
    })


}

uiPublisherFormBtnNew.onclick = function(){
    uiPublisherFormSetState('C');
    uiPublisherFormCleanInputs();
}
