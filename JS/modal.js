const modalEdicao = document.getElementById('modal-edicao');
const formEdicao = document.getElementById('form-edicao');
const closeModalBtn = document.querySelector('.close-edit');


// FUNÇÕES DE CONTROLE DO MODAL

/**
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
document.getElementById('edit-foto-estudante').addEventListener('change', function(event) {
    if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0]; // Armazena o objeto do arquivo selecionado.
        
        const reader = new FileReader();

        // Define a função que será executada QUANDO a leitura do arquivo terminar com sucesso.
        reader.onload = function(e) {
            // 'e.target.result' contém o arquivo lido como uma string de dados.
            document.getElementById('edit-img-preview').src = e.target.result;
        }

        // Inicia a operação de leitura do arquivo. Quando terminar, a função 'onload' acima será chamada.
        reader.readAsDataURL(file);
    }
});