import { app } from './components/firebase.js';
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

// check if the user is signed in. if not, redirect them to the home page
onAuthStateChanged(auth, (user) => {
  if (user) {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    let activePage = document.querySelector('.sidebar-active');

    // if someone clicks on the sidebarToggle, show the sidebar
    sidebarToggle.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar.style.display === 'block') {
        sidebar.style.display = 'none';
        sidebarToggle.style.display = 'block';
      } else {
        sidebar.style.display = 'block';
        sidebarToggle.style.display = 'block';
      }
    })
    
    // if someone clicks on a sidebarLink set that to be the active page
    sidebarLinks.forEach((sidebarLink) => {
      sidebarLink.addEventListener('click', () => {
        activePage = document.querySelector('.sidebar-active');

        // remove the sidebar-active class from the activePage
        activePage.classList.remove('sidebar-active');
        sidebarLink.classList.add('sidebar-active');

        // load that page

        // get the old names
        const oldPageName = activePage.querySelector('.name').innerHTML;
        const newPageName = sidebarLink.querySelector('.name').innerHTML;
        
        // find the pages
        const oldPage = document.querySelector(`.${oldPageName.toLowerCase()}-section`);
        const newPage = document.querySelector(`.${newPageName.toLowerCase()}-section`);
      })
    })
  } else {
    // redirect to home page
    window.location.href = '../index.html';
  }
})