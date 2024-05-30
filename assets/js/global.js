import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const hamburgerButton = document.querySelector('.menu-toggle');

const auth = getAuth();

onAuthStateChanged(auth, (user) => {
  if (user) {
    // remove the sign in buttons and add the new buttons
    const signInBtn = document.querySelector('.signin');
    const menuLink = document.querySelector('.menu-link');
    signInBtn.style.display = 'none';
    menuLink.style.display = 'none';
  } else {
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