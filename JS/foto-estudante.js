const inputFoto = document.getElementById('foto-estudante');
const containerFoto = document.querySelector('.form-foto');
const iconeFoto = document.getElementById('icone-foto');
const botaoFoto = document.querySelector('.botao-foto');
const imagePreviewContainer = document.getElementById('image-preview-container');

inputFoto.addEventListener('change', function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgExistente = imagePreviewContainer.querySelector('img');
            if (imgExistente) {
                imgExistente.remove();
            }

            const img = document.createElement('img');
            img.src = e.target.result;

            imagePreviewContainer.appendChild(img);

            if (iconeFoto) {
                iconeFoto.style.display = 'none';
            }
        }
        reader.readAsDataURL(file);
    }
});
