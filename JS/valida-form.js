// Espera o documento carregar para garantir que os elementos existam
document.addEventListener('DOMContentLoaded', () => {
    const cpfInputCadastro = document.getElementById('cpf');
    const cpfInputEdicao = document.getElementById('edit-cpf');

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