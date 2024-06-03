import { app } from './components/firebase.js';
import { 
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const auth = getAuth();

// check if the user is signed in. if not return the user to the signin page
onAuthStateChanged(auth, (user) => {
  if (user) {
    // signed in

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

        console.log(`Todo Name: ${newTodoName.value}\nTodo Description: ${newTodoDescription.value}\nFirst Task: ${firstTask.value}`);
      })
    })
  } else {
    // not signed in
    window.location.href = './signin.html';
    return;
  }
})