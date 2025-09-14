document.addEventListener('DOMContentLoaded', () => {
    // ---- CORREÇÃO 1: IDs corrigidos para corresponder ao HTML ----
    const formCadastro = document.getElementById('content-cadastro');
    const tabelaCorpo = document.getElementById('tabela-corpo');

    // Função para atualizar a tabela com os dados do servidor
    const atualizarTabela = (membros) => {
        tabelaCorpo.innerHTML = '';

        if (!membros || membros.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="4">Nenhum membro cadastrado.</td></tr>';
            return;
        }

        membros.forEach(membro => {
            const tr = document.createElement('tr');
            // ---- MELHORIA: Adicionando classes e data-id para os botões ----
            tr.innerHTML = `
                <td><img src="${membro.foto_perfil}" class="tabela-img" alt="Foto de ${membro.nome}" "></td>
                <td>${membro.nome}</td>
                <td>${membro.cpf}</td>
                <td>
                    <i class="fa-solid fa-pen-to-square btn-edit" data-id="${membro.id}" title="Editar"></i>
                    <i class="fa-solid fa-trash btn-delete" data-id="${membro.id}" title="Deletar"></i>
                </td>
            `;
            tabelaCorpo.appendChild(tr);
        });
    };

    // Função para carregar os membros inicialmente
    const carregarMembros = async () => {
        try {
            const resposta = await fetch('api.php');
            const resultado = await resposta.json();
            if (resultado.sucesso) {
                atualizarTabela(resultado.dados);
            } else {
                console.error('Erro ao carregar membros:', resultado.mensagem);
            }
        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
        }
    };

    // Captura o envio do formulário (sem alterações aqui)
    // Captura o envio do formulário
    formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o recarregamento da página

    // --- VALIDAÇÃO INTEGRADA AQUI ---
    const nomeInput = document.getElementById('nome');
    const fotoInput = document.getElementById('foto-estudante');
    const cpfInput = document.getElementById('cpf');
    
    if (nomeInput.value.trim() === '' || fotoInput.value === '' || cpfInput.value.trim() === '') {
        alert('Por favor, preencha o nome, CPF e selecione uma foto.');
        return; // Para a execução aqui se a validação falhar
    }
    // --- FIM DA VALIDAÇÃO ---

    const formData = new FormData(formCadastro);
    formData.append('action', 'cadastrar')

    try {
        const resposta = await fetch('api.php', {
            method: 'POST',
            body: formData
        });

        const resultado = await resposta.json();

        if (resultado.sucesso) {
            atualizarTabela(resultado.dados);
            formCadastro.reset();
            resetarPreviewDaFoto();
            // Lógica para limpar o preview da imagem
            // (Você precisará adaptar seu código de preview para isso)
        } else {
            alert('Erro no cadastro: ' + resultado.mensagem);
        }

    } catch (error) {
        console.error('Falha na comunicação com o servidor:', error);
        alert('Não foi possível se conectar ao servidor. Tente novamente.');
    }
});

    // No seu lista.js, encontre este bloco de código e substitua-o

// ---- Delegação de Eventos para os cliques na tabela ----
tabelaCorpo.addEventListener('click', async (event) => { // Tornamos a função async

    // --- LÓGICA DE DELEÇÃO ---
    if (event.target.classList.contains('btn-delete')) {
        const idParaDeletar = event.target.dataset.id;
        const linhaParaRemover = event.target.closest('tr'); // Pega a linha (<tr>) mais próxima do ícone
        
        // Pergunta ao usuário para confirmar a ação
        const confirmar = confirm(`Tem certeza que deseja deletar este membro?`);
        
        if (confirmar) {
            try {
                const formData = new FormData();
                formData.append('action', 'deletar');
                formData.append('id', idParaDeletar);

                const resposta = await fetch('api.php', {
                    method: 'POST',
                    body: formData
                });

                const resultado = await resposta.json();

                if (resultado.sucesso) {
                    // Se o backend confirmou, remove a linha da tabela no frontend
                    linhaParaRemover.remove();
                } else {
                    alert('Erro ao deletar: ' + resultado.mensagem);
                }

            } catch (error) {
                console.error('Falha na comunicação para deletar:', error);
                alert('Não foi possível se conectar ao servidor para deletar.');
            }
        }
    }

    // --- LÓGICA DE EDIÇÃO (a ser implementada no futuro) ---
    if (event.target.classList.contains('btn-edit')) {
        const idParaEditar = event.target.dataset.id;
        console.log('Clicou em EDITAR o membro com ID:', idParaEditar);
        // Aqui você chamaria a função para abrir o modal de edição
    }
});

    // Carrega os dados assim que a página é carregada
    carregarMembros();
});

const resetarPreviewDaFoto = () => {
    // Encontra os elementos necessários
    const container = document.getElementById('image-preview-container');
    const icone = document.getElementById('icone-foto');
    
    if (container) {
        // Procura pela imagem de preview dentro do container
        const imagemExistente = container.querySelector('img');

        // Se uma imagem for encontrada, remova-a
        if (imagemExistente) {
            imagemExistente.remove();
        }
    }
    
    // Mostra o ícone novamente
    if (icone) {
        // Remove o estilo 'display: none' que foi adicionado,
        // fazendo com que ele volte a ser controlado pelo CSS.
        icone.style.display = ''; 
    }
};