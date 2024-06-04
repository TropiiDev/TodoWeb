import { app, database } from './components/firebase.js';
import { 
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const auth = getAuth();

// check if the user is signed in. if not return the user to the signin page
onAuthStateChanged(auth, (user) => {
  if (user) {
    // signed in

    // load the existing todos
    const todosRef = ref(database, `users/${user.uid}`);

    onValue(todosRef, (snapshot) => {
      const data = snapshot.val();
      if (data !== null) {
        const todoName = Object.keys(data)[0];
        const newTodosRef = ref(database, `users/${user.uid}/${todoName}`);
        onValue(newTodosRef, (newSnapshot) => {
          const newData = newSnapshot.val();
          const todoDescription = Object.values(newData)[0];
          const tasks = Object.values(newData)[1];
          const todoSection = document.querySelector('.todo');

          // create the new todo list
          const todoDiv = document.createElement('div');
          todoDiv.className = `todo-div ${todoName}`;

          const todoH2 = document.createElement('h2');
          todoH2.className = `title ${todoName}`;
          todoH2.innerHTML = todoName;
          todoDiv.appendChild(todoH2);

          const todoP = document.createElement('p');
          todoP.className = `description ${todoName}`;
          todoP.innerHTML = todoDescription
          todoDiv.appendChild(todoP);

          const todoUl = document.createElement('ul');
          todoUl.className = todoName;
          todoUl.id = 'todo-list';
          todoDiv.appendChild(todoUl);

          for (let i = 0; i < tasks.length; i++) {
            const taskItem = document.createElement('li');
            taskItem.className = `${i} ${todoName}`;
            taskItem.innerHTML = tasks[i];
            taskItem.id = 'todo-item';
            todoUl.appendChild(taskItem);
          }

          todoSection.appendChild(todoDiv);
        })
      } else {
        console.info('User has no todo lists');
      }
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

        window.location.reload();
      })
    })
  } else {
    // not signed in
    window.location.href = './signin.html';
    return;
  }
})