import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const hamburgerButton = document.querySelector('.menu-toggle');

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    const signInBtn = document.querySelector('.signin');
    const menuLink = document.querySelector('.menu-link');
    const navLinks = document.querySelector('.nav-links')
    // remove the sign in buttons and add the new buttons
    signInBtn.style.display = 'none';
    menuLink.style.display = 'none';

    // create the logout button
    const logoutBtn = document.createElement('li');
    logoutBtn.className = 'logout';
    logoutBtn.innerHTML = 'Logout';

    // create the account button
    const accountBtn = document.createElement('li');
    accountBtn.innerHTML = 'Account';

    // create the todos button
    const todosBtn = document.createElement('li');
    todosBtn.innerHTML = 'Todos';

    // append the buttons to navLinks
    navLinks.appendChild(todosBtn);
    navLinks.appendChild(accountBtn);
    navLinks.appendChild(logoutBtn);
  } else {
    // no user signed in
    console.log('No user');
  }
})


// show the menu links when the hamburgerButton is clicked
hamburgerButton.addEventListener('click', () => {
  const menuLinks = document.getElementById('menu-links');
  if (menuLinks.style.display == 'flex') {
    menuLinks.style.display = 'none';
  } else {
    menuLinks.style.display = 'flex';
  }
})