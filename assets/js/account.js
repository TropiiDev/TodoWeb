import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

// check if the user is signed in. if not, redirect them to the home page
onAuthStateChanged(auth, (user) => {
  if (user) {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    let activePage = document.querySelector('.sidebar-active');
    
    // if someone clicks on a sidebarLink set that to be the active page
    sidebarLinks.forEach((sidebarLink) => {
      sidebarLink.addEventListener('click', () => {
        activePage = document.querySelector('.sidebar-active');

        // remove the sidebar-active class from the activePage
        activePage.classList.remove('sidebar-active');
        sidebarLink.classList.add('sidebar-active');

        updatePage(sidebarLink.querySelector('.name').innerHTML);
      })
    })

    updatePage(activePage.querySelector('.name').innerHTML);
  } else {
    // redirect to home page
    window.location.href = '../index.html';
  }
})

const updatePage = (name) => {
  if (name === 'Personal') {
    console.log('Page is personal');
  } else if (name === 'Account') {
    console.log('Page is account');
  } else if (name === 'Security') {
    console.log('Page is security');
  } else {
    console.error('Not a valid page');
    return;
  }
}