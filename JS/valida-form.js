// Espera o documento carregar para garantir que os elementos existam
document.addEventListener('DOMContentLoaded', () => {
    // Seleciona o campo de CPF do cadastro
    const cpfInputCadastro = document.getElementById('cpf');
    // Seleciona o campo de CPF da edição
    const cpfInputEdicao = document.getElementById('edit-cpf');

    // Opções da máscara
    const maskOptions = {
        mask: '000.000.000-00'
    };

    // Aplica a máscara no campo de cadastro
    if (cpfInputCadastro) {
        IMask(cpfInputCadastro, maskOptions);
    }

    // Aplica a máscara no campo de edição
    if (cpfInputEdicao) {
        IMask(cpfInputEdicao, maskOptions);
    }
});