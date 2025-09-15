// SELEÇÃO DOS ELEMENTOS DO DOM 

const inputFoto = document.getElementById('foto-estudante');
const containerFoto = document.querySelector('.form-foto');
const iconeFoto = document.getElementById('icone-foto');
const botaoFoto = document.querySelector('.botao-foto');
const imagePreviewContainer = document.getElementById('image-preview-container');


// EVENTO PRINCIPAL
inputFoto.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        // FileReader é uma API do navegador para ler o conteúdo de arquivos locais de forma segura.
        const reader = new FileReader();

        // Define a função que será executada QUANDO a leitura do arquivo for concluída.
        reader.onload = function(e) {
            // LÓGICA DE ATUALIZAÇÃO DO PREVIEW
            
            // Procura se já existe uma imagem de preview no container.
            // Isso é importante para o caso de o usuário trocar de foto.
            const imgExistente = imagePreviewContainer.querySelector('img');
            if (imgExistente) {
                // Se uma imagem antiga for encontrada, ela é removida.
                imgExistente.remove();
            }

            const img = document.createElement('img');
            // 'e.target.result' contém o arquivo lido como uma string Data URL (Base64).
            // Atribui essa string ao 'src' da nova imagem.
            img.src = e.target.result;

            // Adiciona a nova imagem criada como um filho do container de preview, fazendo-a aparecer na tela.
            imagePreviewContainer.appendChild(img);

            if (iconeFoto) {
                iconeFoto.style.display = 'none';
            }
        }
        
        // Inicia o processo de leitura do arquivo.
        // A função 'reader.onload' acima será chamada automaticamente quando este processo terminar.
        reader.readAsDataURL(file);
    }
});