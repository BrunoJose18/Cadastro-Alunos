const modalEdicao = document.getElementById('modal-edicao');
const formEdicao = document.getElementById('form-edicao');
const closeModalBtn = document.querySelector('.close-edit');

const abrirModalEdicao = (estudante) => {
        document.getElementById('edit-id').value = estudante.id;
        document.getElementById('edit-nome').value = estudante.nome;
        document.getElementById('edit-cpf').value = estudante.cpf;
        document.getElementById('edit-img-preview').src = estudante.foto_perfil;
        modalEdicao.style.display = 'block';
    };

    const fecharModalEdicao = () => {
        modalEdicao.style.display = 'none';
        formEdicao.reset();
    };

    document.getElementById('edit-foto-estudante').addEventListener('change', function(event) {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('edit-img-preview').src = e.target.result;
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    });