import { app } from './components/firebase.js';
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const createAccountBtn = document.querySelector('.create-account');
const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    alert('Please log out before accessing this page');
    window.location.href = '../index.html';
  }
})

// when the createAccountBtn is clicked, create the account.
createAccountBtn.addEventListener('click', (e) => {
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