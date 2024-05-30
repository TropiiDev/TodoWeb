import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

const hamburgerButton = document.querySelector('.menu-toggle');

// check if the user is logged in. if so, edit the nav bar
onAuthStateChanged(auth, (user) => {
  if (user) {
    const navLinks = document.querySelector('.nav-links');
    const menuLinks = document.querySelector('.ul-links');

    const signInBtn = document.querySelector('.signin');
    const menuLink = document.querySelector('.menu-link');
    
    // remove the sign in buttons and add the new buttons
    signInBtn.style.display = 'none';
    menuLink.style.display = 'none';

    // create the logout button
    const logoutBtn = document.createElement('li');
    logoutBtn.className = 'logout';
    logoutBtn.innerHTML = 'Logout';

    const logoutHamburgerBtn = document.createElement('li');
    logoutHamburgerBtn.className = 'menu-link';
    logoutHamburgerBtn.innerHTML = 'Logout';

    // create the account button
    const accountBtn = document.createElement('li');
    accountBtn.className = 'account';
    accountBtn.innerHTML = 'Account';

    const accountHamburgerBtn = document.createElement('li');
    accountHamburgerBtn.className = 'menu-link';
    accountHamburgerBtn.innerHTML = 'Account';

    // create the todos button
    const todosBtn = document.createElement('li');
    todosBtn.className = 'todo-button';
    todosBtn.innerHTML = 'Todos';

    const todosHamburgerBtn = document.createElement('li');
    todosHamburgerBtn.className = 'menu-link';
    todosHamburgerBtn.innerHTML = 'Todos';

    // append the buttons to navLinks
    navLinks.appendChild(todosBtn);
    navLinks.appendChild(accountBtn);
    navLinks.appendChild(logoutBtn);

    // append the buttons to menuLinks
    menuLinks.appendChild(todosHamburgerBtn);
    menuLinks.appendChild(accountHamburgerBtn);
    menuLinks.appendChild(logoutHamburgerBtn);

    // if the logoutBtn is clicked, sign the user out
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = './pages/signin.html';
      }).catch((error) => {
        console.error(error.message);
      })
    })

    logoutHamburgerBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = './pages/signin.html';
      }).catch((error) => {
        console.error(error.message);
      })
    })
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