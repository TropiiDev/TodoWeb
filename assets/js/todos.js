import { app, database } from './components/firebase.js';
import { 
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { ref, set, onValue, push } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

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
        let todoName = [];
        // get all the names of the objects
        for (let key in data) {
          todoName.push(key);
        }

        // loop through all the items in todoName
        for (let i = 0; i < todoName.length; i++) {
          // get the newTodosRef
          const newTodosRef = ref(database, `users/${user.uid}/${todoName[i]}`);
        onValue(newTodosRef, (newSnapshot) => {
          // get the newData
          const newData = newSnapshot.val();
          // get the description & todos of each object
          const todoDescription = Object.values(newData)[0];
          const todos = Object.values(newData)[1];

          // get the sectionHolder to append each section to
          const sectionHolder = document.querySelector('.section-holder');

          // create the new todo list
          const todoSection = document.createElement('section');
          todoSection.className = 'todo';
          sectionHolder.appendChild(todoSection);

          // create the div of the todo
          const todoDiv = document.createElement('div');
          todoDiv.className = `todo-div ${todoName[i]}`;

          // set the name of the todos
          const todoH2 = document.createElement('h2');
          todoH2.className = `title ${todoName[i]}`;
          todoH2.innerHTML = todoName[i];
          todoDiv.appendChild(todoH2);

          // set the description
          const todoP = document.createElement('p');
          todoP.className = `description ${todoName[i]}`;
          todoP.innerHTML = todoDescription
          todoDiv.appendChild(todoP);

          // create the div that holds the ul
          const todoContent = document.createElement('div');
          todoContent.className = 'todo-content';
          todoDiv.appendChild(todoContent);

          // create the ul that holds the items
          const todoUl = document.createElement('ul');
          todoUl.className = todoName[i];
          todoUl.id = 'todo-list';
          todoContent.appendChild(todoUl);

          // loop through all the todos
          for (let todo in todos) {
            const todoName = Object.values(todos)[todo].name;
  
            const taskItem = document.createElement('li');
            taskItem.className = i;
            taskItem.innerHTML = todoName;
            taskItem.id = 'todo-item';
            todoUl.appendChild(taskItem);
          }

          // create the todoActionsDiv
          const todoActionsDiv = document.createElement('div');
          todoActionsDiv.className = 'todo-actions';
          todoDiv.appendChild(todoActionsDiv);

          // create the Edit button
          const todoEditBtn = document.createElement('button');
          todoEditBtn.className = 'todo-action';
          todoEditBtn.id = todoName[i];
          todoEditBtn.innerHTML = 'Edit';
          todoActionsDiv.appendChild(todoEditBtn);

          // create the Delete button
          const todoDeleteBtn = document.createElement('button');
          todoDeleteBtn.className = 'todo-action';
          todoDeleteBtn.id = todoName[i]
          todoDeleteBtn.innerHTML = "Delete";
          todoDeleteBtn.style.marginLeft = '5px';
          todoActionsDiv.appendChild(todoDeleteBtn);

          // append all that to the todoSection
          todoSection.appendChild(todoDiv);

          // when the user clicks a todoActionBtn, do that action
          const todoActionBtn = document.querySelectorAll('.todo-action');

          todoActionBtn.forEach((todoAction) => {
            todoAction.addEventListener('click', () => {
              console.log(todoAction);
              const todoActionName = todoAction.innerHTML;
              const todoName = todoAction.id;
              if (todoActionName === "Edit") {
                editTodo(user.uid, todoName);
              } else if (todoActionName === "Delete") {
                deleteTodo(user.uid, todoName);
              }
            })
          })
        })
        }
      } else {
        // the user has no lists
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
          todos: {
            0: {
              "name": firstTask.value
            }
          }
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

const editTodo = (uid, name) => {
  // hide the old buttons
  console.log(name)
  const todoActions = document.querySelectorAll(`#${name}`);
  const todoActionsDiv = document.querySelector('.todo-actions');

  /*
    IF THERE ARE MULTIPLE TODOS IT WILL RUN TWICE, FIND A WAY TO LOOP THROUGH THE TODO LISTS
    AND FIND WHICH BUTTON WAS PRESSED
  */

  for (let i = 0; i < todoActions.length; i++) {
    const todoAction = todoActions[i];
    if (todoAction.id === name) {
      todoAction.style.display = 'none';
    } else {
      return;
    }
  }

  // create the add and save buttons
  const addBtn = document.createElement('button');
  addBtn.className = 'todo-action';
  addBtn.id = 'add';
  addBtn.innerHTML = 'Add';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'todo-action';
  saveBtn.id = 'save';
  saveBtn.style.marginLeft = '5px';
  saveBtn.innerHTML = 'Save';

  // append these buttons to the todoActionsDiv
  todoActionsDiv.appendChild(addBtn);
  todoActionsDiv.appendChild(saveBtn);

  // select the new buttons
  const newSaveBtn = document.querySelector('#save');
  const newAddBtn = document.querySelector('#add');

  // when the newSaveBtn is clicked, reload the page to "save" it
  newSaveBtn.addEventListener('click', () => {
    window.location.reload();
  })

  newAddBtn.addEventListener('click', () => {
    const addTodoModal = document.querySelector("#addModal");
    const addTodoBtn = document.querySelector('#addTodo');

    addTodoModal.style.display = 'flex';

    addTodoBtn.addEventListener('click', () => {
      const addTodoName = document.querySelector('#newName');

      // get the existing task
      const todosRef = ref(database, `users/${uid}/${name}/todos`);
      var indexNum;

      onValue(todosRef, (snapshot) => {
        const data = snapshot.val();
        
        console.log(data);

        for (let num in data) {
          indexNum = num
        }
      })
      set(ref(database, `/users/${uid}/${name}/todos/${Number(indexNum) + 1}`), {
        "name": addTodoName.value
      })
      alert('Added the new todo');
      window.location.reload();
    })
  })
}

const deleteTodo = (uid, name) => {
  set(ref(database, `users/${uid}/${name}`), null)
  alert('Deleted the todo list');
  window.location.reload();
}