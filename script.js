// Espera o documento HTML ser completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // Seleciona todos os SPANS que servem como gatilhos (triggers)
    const triggers = document.querySelectorAll('.borda-icon .trigger');
    
    // Seleciona todas as seções de conteúdo dentro do <main>
    const contentSections = document.querySelectorAll('main .content-section');

    // Adiciona um evento de clique para cada gatilho (o span do ícone)
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            
            // --- Parte 1: Atualiza o visual dos ícones ---
            // Remove a classe 'active' de todos os outros gatilhos
            triggers.forEach(t => t.classList.remove('active'));
            // Adiciona a classe 'active' apenas no gatilho que foi clicado
            trigger.classList.add('active');

            // --- Parte 2: Alterna o conteúdo principal ---
            // Pega o valor do atributo 'data-target' do ícone (que é o primeiro filho do span)
            const targetId = trigger.firstElementChild.getAttribute('data-target');

            // Esconde todos os conteúdos removendo a classe 'active'
            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            // Mostra apenas o conteúdo correspondente ao ícone clicado
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Opcional: Garante que o primeiro ícone e conteúdo estejam ativos ao carregar
    const firstTrigger = document.querySelector('.borda-icon .trigger');
    if(firstTrigger) {
        firstTrigger.classList.add('active');
    }
});