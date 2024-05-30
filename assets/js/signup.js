import { app } from './components/firebase.js';
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const createAccountBtn = document.querySelector('.create-account');

// when the createAccountBtn is clicked, create the account.
createAccountBtn.addEventListener('click', (e) => {
  const auth = getAuth();
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  createUserWithEmailAndPassword(auth, email.value, password.value)
  .then((userCredentials) => {
    // signed up
    userCredentials.user;
    window.location.href = '../index.html';
  })
  .catch((error) => {
    console.error(error.message);
  })

  e.preventDefault();
})