// Get the modal element
const editModal = document.getElementById("editModal");
const addModal = document.getElementById("addModal");
const errorsDiv = doucment.getElementById('errorsDiv');

// Get the <span> element that closes the modal
const span = document.querySelectorAll(".close");

// When the user clicks on <span> (x), close the modal
span.forEach((closeBtn) => {
  closeBtn.addEventListener('click', (e) => {
    if (editModal.style.display == 'block') {
      editModal.style.display = 'none';
    } else {
      addModal.style.display = 'none';
    }
  })
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == editModal || event.target == addModal) {
        editModal.style.display = "none";
        addModal.style.display = "none";
    }
};
