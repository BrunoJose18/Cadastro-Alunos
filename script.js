document.addEventListener('DOMContentLoaded', () => {

    const triggers = document.querySelectorAll('.borda-icon .trigger');
    
    const contentSections = document.querySelectorAll('main .content-section');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            
            triggers.forEach(t => t.classList.remove('active'));
            trigger.classList.add('active');

            const targetId = trigger.firstElementChild.getAttribute('data-target');

            contentSections.forEach(section => {
                section.classList.remove('active');
            });

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const firstTrigger = document.querySelector('.borda-icon .trigger');
    if(firstTrigger) {
        firstTrigger.classList.add('active');
    }
});