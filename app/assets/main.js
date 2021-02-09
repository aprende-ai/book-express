const divAutores = document.getElementById('autores');
const divEditoras = document.getElementById('editoras');
const divLivros = document.getElementById('livros');
const navLinkAutores = document.getElementById('navLinkAutores');
const navLinkEditoras = document.getElementById('navLinkEditoras');
const navLinkLivros = document.getElementById('navLinkLivros');


function goToPanel(panel){
    divAutores.style.display = 'none';
    divEditoras.style.display = 'none';
    divLivros.style.display = 'none';

    navLinkAutores.className='';
    navLinkEditoras.className='';
    navLinkLivros.className='';

    switch(panel){
        case 'autores':
            divAutores.style.display = 'block';
            navLinkAutores.className='active';
            break;
        case 'editoras':
            divEditoras.style.display = 'block';
            navLinkEditoras.className='active';
            break;
        case 'livros':
            divLivros.style.display = 'block';
            navLinkLivros.className='active';
            break;
        default:
            throw new Error('"'+panel+'" is not a valid panel');
    }
}
