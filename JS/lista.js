document.addEventListener('DOMContentLoaded', () => {
    // SELEÇÃO DOS ELEMENTOS GLOBAIS
    const formCadastro = document.getElementById('content-cadastro');
    const tabelaCorpo = document.getElementById('tabela-corpo');

    // CACHE DE DADOS
    // Guarda a lista de estudantes na memória para acesso rápido.
    // Usado para edição e para a validação de CPF duplicado no frontend.
    let estudantesCache = [];

    // FUNÇÕES AUXILIARES

    /**
     * Limpa a tabela e a reconstrói com os dados mais recentes.
     * @param {Array} membros
     */
    const atualizarTabela = (membros) => {
        tabelaCorpo.innerHTML = ''; // Esvazia a tabela para evitar duplicatas.
        estudantesCache = membros; // Atualiza o cache com os dados novos.

        // Se a lista estiver vazia, mostra uma mensagem.
        if (!membros || membros.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="4">Nenhum estudante cadastrado.</td></tr>';
            return;
        }

        // Para cada estudante na lista, cria uma nova linha na tabela.
        membros.forEach(membro => {
            const tr = document.createElement('tr');
            tr.dataset.id = membro.id; // Atribui o ID do estudante ao 'data-id' da linha.
            
            // Constrói o HTML da linha com os dados do estudante.
            tr.innerHTML = `
                <td><img src="${membro.foto_perfil}" class="tabela-img" alt="Foto de ${membro.nome}"></td>
                <td class="nome-estudante">${membro.nome}</td>
                <td class="cpf-estudante">${membro.cpf}</td>
                <td>
                    <i class="fa-solid fa-pen-to-square btn-edit" data-id="${membro.id}" title="Editar"></i>
                    <i class="fa-solid fa-trash btn-delete" data-id="${membro.id}" title="Deletar"></i>
                </td>
            `;
            tabelaCorpo.appendChild(tr);
        });
    };

    // Busca a lista inicial de estudantes na API.
    const carregarEstudantes = async () => {
        try {
            const resposta = await fetch('api.php'); // Faz a requisição para a API.
            const resultado = await resposta.json(); // Converte a resposta em JSON.
            if (resultado.sucesso) {
                atualizarTabela(resultado.dados); // Atualiza a tabela com os dados recebidos.
            } else {
                console.error('Erro ao carregar estudantes:', resultado.mensagem);
            }
        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
        }
    };

    // EVENT LISTENERS PRINCIPAIS

    // 1. OUVINTE DE SUBMISSÃO DO FORMULÁRIO DE CADASTRO
    formCadastro.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Validação de CPF duplicado no frontend.
        const cpfInput = document.getElementById('cpf');
        const isCpfDuplicado = estudantesCache.some(estudante => estudante.cpf === cpfInput.value);
        if (isCpfDuplicado) {
            alert('Este CPF já está na lista. Por favor, verifique os dados.');
            return;
        }

        const formData = new FormData(formCadastro); // Coleta todos os dados do formulário, incluindo a foto.
        formData.append('action', 'cadastrar'); // Informa à API qual ação executar.

        try {
            const resposta = await fetch('api.php', { method: 'POST', body: formData });
            const resultado = await resposta.json();

            if (resultado.sucesso) {
                atualizarTabela(resultado.dados); // Atualiza a tabela.
                formCadastro.reset(); // Limpa os campos do formulário.
                resetarPreviewDaFoto(); // Limpa a imagem de preview.
            } else {
                alert('Erro no cadastro: ' + resultado.mensagem);
            }
        } catch (error) {
            console.error('Falha na comunicação com o servidor:', error);
            alert('Não foi possível se conectar ao servidor.');
        }
    });

    // 2. OUVINTE DE CLIQUE NA TABELA (DELEGAÇÃO DE EVENTOS)
    tabelaCorpo.addEventListener('click', async (event) => {
        const id = event.target.dataset.id; // Pega o ID do ícone clicado.

        // Se o elemento clicado tiver a classe 'btn-edit' encontra o estudante no cache
        if (event.target.classList.contains('btn-edit')) {
            const estudanteParaEditar = estudantesCache.find(e => e.id == id);
            if (estudanteParaEditar) {
                abrirModalEdicao(estudanteParaEditar); // Chama a função do modal.js.
            }
        }

        // Se o elemento clicado tiver a classe 'btn-delete'
        if (event.target.classList.contains('btn-delete')) {
            if (confirm(`Tem certeza que deseja deletar este membro?`)) {
                try {
                    const formData = new FormData();
                    formData.append('action', 'deletar');
                    formData.append('id', id);

                    const resposta = await fetch('api.php', { method: 'POST', body: formData });
                    const resultado = await resposta.json();

                    if (resultado.sucesso) {
                        event.target.closest('tr').remove();
                    } else {
                        alert('Erro ao deletar: ' + resultado.mensagem);
                    }
                } catch (error) {
                    console.error('Falha na comunicação para deletar:', error);
                }
            }
        }
    });

    // 3. OUVINTE DE SUBMISSÃO DO FORMULÁRIO DE EDIÇÃO (NO MODAL)
    formEdicao.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formEdicao);
        formData.append('action', 'editar');

        try {
            const resposta = await fetch('api.php', { method: 'POST', body: formData });
            const resultado = await resposta.json();

            if (resultado.sucesso) {
                // Encontra a linha específica na tabela para atualizar.
                const linhaParaAtualizar = tabelaCorpo.querySelector(`tr[data-id="${resultado.dados.id}"]`);
                if (linhaParaAtualizar) {
                    // Atualiza apenas o conteúdo daquela linha, sem recarregar tudo.
                    linhaParaAtualizar.querySelector('.tabela-img').src = resultado.dados.foto_perfil;
                    linhaParaAtualizar.querySelector('.nome-estudante').textContent = resultado.dados.nome;
                    linhaParaAtualizar.querySelector('.cpf-estudante').textContent = resultado.dados.cpf;
                }
                
                // Atualiza o registro correspondente no cache de dados.
                const index = estudantesCache.findIndex(e => e.id == resultado.dados.id);
                if(index !== -1) {
                    estudantesCache[index] = resultado.dados;
                }

                fecharModalEdicao(); // Chama a função do modal.js.
            } else {
                alert('Erro ao atualizar: ' + resultado.mensagem);
            }
        } catch (error) {
            console.error('Falha na comunicação para editar:', error);
        }
    });

    // Chama a função para carregar os estudantes assim que o script é executado.
    carregarEstudantes();
});

/* Remove a imagem de preview selecionada pelo usuário e mostra o ícone padrão novamente.*/
const resetarPreviewDaFoto = () => {
    const container = document.getElementById('image-preview-container');
    const icone = document.getElementById('icone-foto');

    // Verifica se o container de preview foi encontrado na página.
    if (container) {
        const imagemExistente = container.querySelector('img');

        if (imagemExistente) {
            imagemExistente.remove();
        }
    }
    
    // Verifica se o ícone padrão foi encontrado.
    if (icone) {
        icone.style.display = ''; 
    }
};