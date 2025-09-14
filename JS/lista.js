document.addEventListener('DOMContentLoaded', () => {
    const formCadastro = document.getElementById('content-cadastro');
    const tabelaCorpo = document.getElementById('tabela-corpo');
    let estudantesCache = [];

    const atualizarTabela = (membros) => {
        tabelaCorpo.innerHTML = '';
        estudantesCache = membros;

        if (!membros || membros.length === 0) {
            tabelaCorpo.innerHTML = '<tr><td colspan="4">Nenhum membro cadastrado.</td></tr>';
            return;
        }

        membros.forEach(membro => {
            const tr = document.createElement('tr');
            tr.dataset.id = membro.id;
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


    formCadastro.addEventListener('submit', async (event) => {
    event.preventDefault();

    const cpfInput = document.getElementById('cpf');
    const cpfValor = cpfInput.value;
    const isCpfDuplicado = estudantesCache.some(estudante => estudante.cpf === cpfValor);

    if (isCpfDuplicado) {
        alert('Este CPF já está na lista. Por favor, verifique os dados.');
        return;
    }

    const formData = new FormData(formCadastro);
    formData.append('action', 'cadastrar');

    try {
        const resposta = await fetch('api.php', { method: 'POST', body: formData });
        const resultado = await resposta.json();

        if (resultado.sucesso) {
            atualizarTabela(resultado.dados);
            formCadastro.reset();
            resetarPreviewDaFoto();
        } else {
            alert('Erro no cadastro: ' + resultado.mensagem);
        }
    } catch (error) {
        console.error('Falha na comunicação com o servidor:', error);
        alert('Não foi possível se conectar ao servidor. Tente novamente.');
    }
});

    tabelaCorpo.addEventListener('click', async (event) => {
        const id = event.target.dataset.id;

        if (event.target.classList.contains('btn-edit')) {
            const estudanteParaEditar = estudantesCache.find(e => e.id == id);
            if (estudanteParaEditar) {
                abrirModalEdicao(estudanteParaEditar);
            }
        }

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

    formEdicao.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formEdicao);
        formData.append('action', 'editar');

        try {
            const resposta = await fetch('api.php', { method: 'POST', body: formData });
            const resultado = await resposta.json();

            if (resultado.sucesso) {
                const linhaParaAtualizar = tabelaCorpo.querySelector(`tr[data-id="${resultado.dados.id}"]`);
                if (linhaParaAtualizar) {
                    linhaParaAtualizar.querySelector('.tabela-img').src = resultado.dados.foto_perfil;
                    linhaParaAtualizar.querySelector('.nome-estudante').textContent = resultado.dados.nome;
                    linhaParaAtualizar.querySelector('.cpf-estudante').textContent = resultado.dados.cpf;
                }
                
                const index = estudantesCache.findIndex(e => e.id == resultado.dados.id);
                if(index !== -1) {
                    estudantesCache[index] = resultado.dados;
                }

                fecharModalEdicao();
            } else {
                alert('Erro ao atualizar: ' + resultado.mensagem);
            }
        } catch (error) {
            console.error('Falha na comunicação para editar:', error);
        }
    });

    closeModalBtn.addEventListener('click', fecharModalEdicao);
    window.addEventListener('click', (event) => {
        if (event.target == modalEdicao) {
            fecharModalEdicao();
        }
    });

    carregarMembros();
});

const resetarPreviewDaFoto = () => {
    const container = document.getElementById('image-preview-container');
    const icone = document.getElementById('icone-foto');
    if (container) {
        const imagemExistente = container.querySelector('img');
        if (imagemExistente) {
            imagemExistente.remove();
        }
    }
    if (icone) {
        icone.style.display = '';
    }
};