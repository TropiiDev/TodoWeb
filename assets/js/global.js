import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


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
    if (!signInBtn) {
      return;
    } else {
      signInBtn.style.display = 'none';
    }
    
    menuLink.style.display = 'none';

    // create the todos button
    const todosBtn = document.createElement('li');
    todosBtn.className = 'todo todo-button';
    todosBtn.innerHTML = 'Todos';

    const todosHamburgerBtn = document.createElement('li');
    todosHamburgerBtn.className = 'menu-link todo-button';
    todosHamburgerBtn.innerHTML = 'Todos';

    navLinks.appendChild(todosBtn);

    // create the logout button
    const logoutBtn = document.createElement('li');
    logoutBtn.className = 'logout logout-button';
    logoutBtn.innerHTML = 'Logout';

    const logoutHamburgerBtn = document.createElement('li');
    logoutHamburgerBtn.className = 'menu-link logout-button';
    logoutHamburgerBtn.innerHTML = 'Logout';

    // create the account button
    const username = document.createElement('li');
    username.className = 'username';

    // check if the user.displayName is not null
    if (user.displayName !== null) {
      
      // check if the user has a photoURL
      if (user.photoURL !== null) {
        // if so, remove the username element and create the new img element
        username.remove();

        const profilePicture = document.createElement('img');
        profilePicture.src = user.photoURL;
        profilePicture.className = 'profile-picture account account-button';

        navLinks.appendChild(profilePicture);
      } else {
        username.innerHTML = user.displayName;
        username.className = "account-button";

        navLinks.appendChild(username);
      }
    } else if (user.photoURL !== null) {
      username.remove();
      console.log(user.photoURL);
      const profilePicture = document.createElement('img');
      profilePicture.src = user.photoURL;
      profilePicture.className = 'profile-picture account account-button';

      navLinks.appendChild(profilePicture);
    } else {
      username.innerHTML = user.email;
      username.className = "account-button";

      navLinks.appendChild(username);
    }

    const accountHamburgerBtn = document.createElement('li');
    accountHamburgerBtn.className = 'menu-link account-button';
    accountHamburgerBtn.innerHTML = 'Account';

    // append the buttons to navLinks
    navLinks.appendChild(logoutBtn);

    // append the buttons to menuLinks
    menuLinks.appendChild(todosHamburgerBtn);
    menuLinks.appendChild(accountHamburgerBtn);
    menuLinks.appendChild(logoutHamburgerBtn);

    // add the event listeners to the buttons
    const logoutBtns = document.querySelectorAll('.logout-button');
    const accountBtns = document.querySelectorAll('.account-button');
    const todoBtns = document.querySelectorAll('.todo-button');

    logoutBtns.forEach((logoutBtn) => {
      logoutBtn.addEventListener('click', () => {
        signOut(auth).then(() => {
          window.location.href = './pages/signin.html';
        }).catch((error) => {
          console.error(error.message);
        })
      })
    })

    accountBtns.forEach((accountBtn) => {
      accountBtn.addEventListener('click', () => {
        window.location.href = './pages/account.html';
      })
    })

    todoBtns.forEach((todoBtn) => {
      todoBtn.addEventListener('click', () => {
        window.location.href = './pages/todo.html';
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