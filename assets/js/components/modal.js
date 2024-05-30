// Get the modal element
const modals = document.querySelectorAll('.modal');

// Get the <span> element that closes the modal
const span = document.querySelectorAll(".close");

// When the user clicks on <span> (x), close the modal
span.forEach((closeBtn) => {
  closeBtn.addEventListener('click', () => {
    for (let i = 0; i < modals.length; i++) {
      const modalId = modals[i].id;
      const modal = document.getElementById(modalId);
      console.log(modal);
      if (!modal) {
        console.error('Could not find an active modal');
        return;
      }

      modal.style.display = 'none';
    }
  })
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  const modalId = event.target.id;
  const modal = document.getElementById(modalId);

  if (!modal) {
    return;
  }

  modal.style.display = 'none';
};