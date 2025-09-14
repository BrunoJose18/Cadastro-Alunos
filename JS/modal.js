const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalName = document.getElementById('modal-name');
const modalDesc = document.getElementById('modal-description');
const closeBtn = document.querySelector('.close');
const modalLink = document.getElementById('modal-link');

const edits = document.querySelectorAll('tbody td tr i S.edit');

members.forEach((member) => {
  member.addEventListener('click', () => {
    const img = member.querySelector('img').src;
    const name = member.querySelector('h1').innerText;
    const desc = member.querySelector('p').innerText;

    modalImg.src = img;
    modalName.textContent = name;
    modalDesc.textContent = desc;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  });
});

closeBtn.onclick = () => {
  modal.style.display = 'none';
  document.body.style.overflow = '';
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};