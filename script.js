// Adiciona um 'ouvinte de evento' ao documento inteiro.
// O evento 'DOMContentLoaded' é disparado quando todo o HTML da página foi carregado e processado.
document.addEventListener('DOMContentLoaded', () => {

    // SELEÇÃO DOS ELEMENTOS
    // Seleciona TODOS os elementos que têm a classe '.trigger' dentro de '.borda-icon'.
    const triggers = document.querySelectorAll('.borda-icon .trigger');
    
    // Seleciona TODAS as seções de conteúdo (o formulário e a lista) que estão dentro da tag <main>.
    const contentSections = document.querySelectorAll('main .content-section');

    // ADICIONANDO O EVENTO DE CLIQUE A CADA ÍCONE
    triggers.forEach(trigger => {
        // Para cada ícone ('trigger'), adiciona um ouvinte de evento de clique.
        trigger.addEventListener('click', () => {
            
            // Parte 1: ATUALIZA O VISUAL DOS ÍCONES
            
            // Primeiro, remove a classe 'active' de TODOS os ícones.
            // Isso "limpa" o estado, garantindo que nenhum ícone pareça selecionado.
            triggers.forEach(t => t.classList.remove('active'));
            // Em seguida, adiciona a classe 'active' APENAS no ícone que foi clicado.
            trigger.classList.add('active');

            // Parte 2: ALTERNA O CONTEÚDO PRINCIPAL

            // Pega o valor do atributo 'data-target' que está no elemento <i> DENTRO do <span> que foi clicado.
            const targetId = trigger.firstElementChild.getAttribute('data-target');

            // Esconde todas as seções de conteúdo, removendo a classe 'active' de cada uma delas.
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Agora, encontra a seção específica que corresponde ao ícone clicado, usando o ID.
            const targetSection = document.getElementById(targetId);
            // Verifica se a seção foi realmente encontrada.
            if (targetSection) {
                // Adiciona a classe 'active' APENAS na seção alvo, tornando-a visível.
                targetSection.classList.add('active');
            }
        });
    });

    // ESTADO INICIAL DA PÁGINA
    // Garante que a primeira aba (Cadastro) esteja ativa quando a página é carregada.
    const firstTrigger = document.querySelector('.borda-icon .trigger');
    if(firstTrigger) {
        // Adiciona a classe 'active' ao primeiro ícone.
        // O conteúdo já é ativado pelo HTML, mas isso garante a consistência visual do ícone.
        firstTrigger.classList.add('active');
    }
});