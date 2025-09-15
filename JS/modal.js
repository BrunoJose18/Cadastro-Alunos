// SELEÇÃO DOS ELEMENTOS DO MODAL


const modalEdicao = document.getElementById('modal-edicao');
const formEdicao = document.getElementById('form-edicao');
const closeModalBtn = document.querySelector('.close-edit');


// FUNÇÕES DE CONTROLE DO MODAL

/**
 * Abre o modal de edição e preenche os campos do formulário com os dados do estudante selecionado.
 * Esta função é projetada para ser chamada a partir de outro script (lista.js).
 * @param {object} estudante - O objeto contendo os dados (id, nome, cpf, foto_perfil) do estudante.
 */
const abrirModalEdicao = (estudante) => {
    // Pega os elementos do formulário pelo ID e atribui a eles os valores do objeto 'estudante'.
    document.getElementById('edit-id').value = estudante.id;
    document.getElementById('edit-nome').value = estudante.nome;
    document.getElementById('edit-cpf').value = estudante.cpf;
    document.getElementById('edit-img-preview').src = estudante.foto_perfil;

    modalEdicao.style.display = 'block';
};

/**
 * Fecha o modal de edição e limpa os campos do formulário para a próxima utilização.
 */
const fecharModalEdicao = () => {
    modalEdicao.style.display = 'none';
    formEdicao.reset();
};


// EVENT LISTENER PARA O PREVIEW DA IMAGEM

// Adiciona um 'ouvinte de evento' ao input de arquivo de foto que está DENTRO do modal.
// O evento 'change' é disparado sempre que o usuário seleciona um novo arquivo.
document.getElementById('edit-foto-estudante').addEventListener('change', function(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]; // Armazena o objeto do arquivo selecionado.
        
        const reader = new FileReader();

        // Define a função que será executada QUANDO a leitura do arquivo terminar com sucesso.
        reader.onload = function(e) {
            // 'e.target.result' contém o arquivo lido como uma string de dados (Data URL).
            // Esta string é atribuída ao 'src' da imagem de preview, fazendo-a aparecer na tela.
            document.getElementById('edit-img-preview').src = e.target.result;
        }

        // Inicia a operação de leitura do arquivo. Quando terminar, a função 'onload' acima será chamada.
        reader.readAsDataURL(file);
    }
});