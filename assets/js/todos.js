import { app, database } from './components/firebase.js';
import { 
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const auth = getAuth();

// check if the user is signed in. if not return the user to the signin page
onAuthStateChanged(auth, (user) => {
  if (user) {
    // signed in

    // when a user clicks the button, send them to the correct place
    const logoutBtn = document.querySelector('.logout');
    const navbarAccountBtn = document.querySelector('.account-button');
    const navbarTodoBtn = document.querySelector('.todo-button');
    
    navbarTodoBtn.addEventListener('click', () => {
      window.location.href = './todo.html';
    })

    navbarAccountBtn.addEventListener('click', () => {
      window.location.href = './account.html';
    })

    // if the logoutBtn is clicked, sign the user out
    logoutBtn.addEventListener('click', () => {
      signOut(auth).then(() => {
        window.location.href = './signin.html';
      }).catch((error) => {
        console.error(error.message);
      })
    })

    // when the user clicks the createTodoBtn, show the modal.
    const createTodoBtn = document.querySelector('#createTodoButton');

    createTodoBtn.addEventListener('click', () => {
      const createNewTodoModal = document.querySelector('#createNewTodoModal');
      const createNewTodoBtn = document.querySelector('#createTodo');
      // show the modal
      createNewTodoModal.style.display = 'flex';

      // when the user clicks the createNewTodoBtn, create the new todo
      createNewTodoBtn.addEventListener('click', () => {
        const newTodoName = document.querySelector('#newTodoName');
        const newTodoDescription = document.querySelector('#newTodoDescription');
        const firstTask = document.querySelector('#firstTask');

        set(ref(database, `users/${user.uid}/${newTodoName.value}`), {
          description: newTodoDescription.value,
          tasks: [firstTask.value]
        })

        

        createNewTodoModal.style.display = 'none';
      })
    })
  } else {
    // not signed in
    window.location.href = './signin.html';
    return;
  }
})