import { app } from './components/firebase.js';
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// get auth from firebase
const auth = getAuth();

const signInBtn = document.querySelector('.submit-button');

const resetPassword = document.querySelector('.reset-password');
const resetPassModal = document.getElementById('resetModal');

// when the resetPassword button is clicked show the modal
resetPassword.addEventListener('click', () => {
  resetPassModal.style.display = 'block';
})

// when the signInBtn sign the user in
signInBtn.addEventListener('click', (e) => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  signInWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredential) => {
    window.location.href = '../index.html';
    return;
  })
  .catch((error) => {
    alert(error.message);
  })

  e.preventDefault();
})