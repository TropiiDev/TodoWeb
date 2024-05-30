import { app } from './components/firebase.js';
import { createUser } from './components/authentication.js';

const createAccountBtn = document.querySelector('.create-account');

createAccountBtn.addEventListener('click', (e) => {
  const email = document.getElementById('email');
  const password = document.getElementById('password');

  createUser(email.value, password.value);
  console.log('Completed');
  window.location.href = '../index.html';

  e.preventDefault();
})