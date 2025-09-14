const cpfInput = document.getElementById('cpf');

if (cpfInput) {
    cpfInput.addEventListener('input', () => {
        let value = cpfInput.value;
    
        value = value.replace(/\D/g, '');
        value = value.slice(0, 11);
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    
        cpfInput.value = value;
    });
}