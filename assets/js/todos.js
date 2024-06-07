import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  onValue,
  ref,
  set,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app, database } from "./components/firebase.js";

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
          if (key.indexOf(' ') > 0) {
            const newTodoName = key.replace(/ /g, '-');
            todoName.push(newTodoName);
          } else {
            todoName.push(key);
          }
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
            const sectionHolder = document.querySelector(".section-holder");

            // create the new todo list
            const todoSection = document.createElement("section");
            todoSection.className = "todo";
            sectionHolder.appendChild(todoSection);

            // create the div of the todo
            const todoDiv = document.createElement("div");
            todoDiv.className = `todo-div ${todoName[i]}`;

            // set the name of the todos
            const todoH2 = document.createElement("h2");
            todoH2.className = `title ${todoName[i]}`;
            if (todoName[i].indexOf('-') > 0) {
              todoH2.innerHTML = todoName[i].replace(/-/g,' ');
            } else {
              todoH2.innerHTML = todoName[i];
            }
            todoDiv.appendChild(todoH2);

            // set the description
            const todoP = document.createElement("p");
            todoP.className = `description ${todoName[i]}`;
            todoP.innerHTML = todoDescription;
            todoDiv.appendChild(todoP);

            // create the div that holds the ul
            const todoContent = document.createElement("div");
            todoContent.className = "todo-content";
            todoDiv.appendChild(todoContent);

            // create the ul that holds the items
            const todoUl = document.createElement("ul");
            todoUl.className = todoName[i];
            todoUl.id = "todo-list";
            todoContent.appendChild(todoUl);

            // loop through all the todos then create the todo item
            for (let todo in todos) {
              if (todo > 1 && todo != 1) {
                if (todo >= 2) {
                  const todoNameObj = Object.values(todos)[todo - 1].name;
                  
                  const taskItem = document.createElement("li");
                  taskItem.className = `${todo} ${todoName[i]}-task`;
                  taskItem.innerHTML = todoNameObj;
                  taskItem.id = "todo-item";
                  todoUl.appendChild(taskItem);
                }
              } else {
                const todoNameObj = Object.values(todos)[i].name;

                const taskItem = document.createElement("li");
                taskItem.className = `${todo} ${todoName[i]}-task`;
                taskItem.innerHTML = todoNameObj;
                taskItem.id = "todo-item";
                todoUl.appendChild(taskItem);
              }
            }

            // create the todoActionsDiv
            
            const todoActionsDiv = document.createElement("div");
            todoActionsDiv.className = 'todo-actions';
            todoActionsDiv.id = `${todoName[i]}-actions`;
            todoActionsDiv.style.margin = "0";
            todoActionsDiv.style.padding = "0";
            todoDiv.appendChild(todoActionsDiv);
            
            // create the Edit button
            const todoEditBtn = document.createElement("button");
            todoEditBtn.className = "todo-action";
            todoEditBtn.id = todoName[i];
            todoEditBtn.innerHTML = "Edit";
            todoActionsDiv.appendChild(todoEditBtn);

            // create the Delete button
            const todoDeleteBtn = document.createElement("button");
            todoDeleteBtn.className = "todo-action";
            todoDeleteBtn.id = todoName[i];
            todoDeleteBtn.innerHTML = "Delete";
            todoDeleteBtn.style.marginLeft = "5px";
            todoActionsDiv.appendChild(todoDeleteBtn);

            // append all that to the todoSection
            todoSection.appendChild(todoDiv);
          });
        }
      } else {
        // the user has no lists
        console.info("User has no todo lists");
      }

      // when the user clicks a todoActionBtn, do that action
      const actionBtns = document.querySelectorAll(".todo-action");
      actionBtns.forEach((actionBtn) => {
        actionBtn.addEventListener("click", () => {
          const btnName = actionBtn.innerHTML;
          const btnId = actionBtn.id;
          if (btnName === "Edit") {
            editTodo(user.uid, btnId);
          } else if (btnName === "Delete") {
            deleteTodo(user.uid, btnId);
          }
        });
      });
    });

    // when the user clicks the createTodoBtn, show the modal.
    const createTodoBtn = document.querySelector("#createTodoButton");

    createTodoBtn.addEventListener("click", () => {
      const createNewTodoModal = document.querySelector("#createNewTodoModal");
      const createNewTodoBtn = document.querySelector("#createTodo");
      // show the modal
      createNewTodoModal.style.display = "flex";

      // when the user clicks the createNewTodoBtn, create the new todo
      createNewTodoBtn.addEventListener("click", () => {
        const newTodoName = document.querySelector("#newTodoName");
        const newTodoDescription = document.querySelector(
          "#newTodoDescription",
        );
        const firstTask = document.querySelector("#firstTask");

        if (newTodoName.value.indexOf(' ') > 0) {
          const newName = newTodoName.value.replace(/ /g, '-');

          set(ref(database, `users/${user.uid}/${newName}`), {
            description: newTodoDescription.value,
            todos: {
              0: {
                name: firstTask.value,
              },
            },
          });

          window.location.reload()

          return;
        }
        
        set(ref(database, `users/${user.uid}/${newTodoName.value}`), {
          description: newTodoDescription.value,
          todos: {
            0: {
              name: firstTask.value,
            },
          },
        });

        window.location.reload();
      });
    });
  } else {
    // not signed in
    window.location.href = "./signin.html";
    return;
  }
});

const editTodo = (uid, name) => {
  // hide the old buttons
  const todoActionsDiv = document.querySelector(`#${name}-actions`);
  const todoActions = document.querySelectorAll(`#${name}`);
  const todoItems = document.querySelectorAll(`.${name}-task`);

  // loop through the buttons and hide them
  for (let i = 0; i < todoActions.length; i++) {
    const todoAction = todoActions[i];
    if (todoAction.id === name) {
      todoAction.style.display = "none";
    } else {
      return;
    }
  }

  // create all the checkboxes when the edit btn is clicked
  const todosRef = ref(database, `users/${uid}/${name}/todos`);
  onValue(todosRef, (snapshot) => {
    const data = snapshot.val();
    let todoItem = "";

    for (let i = 0; i < todoItems.length; i++) {
      // creates the todo item.
      todoItem = todoItems[i];
    }

    /*
      \\ Creates the checkboxes
    const checkboxes = document.createElement('input');
    checkboxes.type = 'checkbox';
    checkboxes.style.marginLeft = '5px';
    checkboxes.className = 'delete-item';
    checkboxes.id = num;
    todoItem.appendChild(checkboxes);
    */

    for (let num in data) {
      // returns 0, 2, 3. need to set id of checkbox to these values;
    }

    
  })

  // when the checkbox is clicked. delete that todoItem
  const checkboxes = document.querySelectorAll('.delete-item');

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      const checkboxId = checkbox.id;
      console.log(checkboxId);
      
      // delete the item in the database
      //set(ref(database, `users/${uid}/${name}/todos/${checkboxId}`), null);
      const todosRef = ref(database, `users/${uid}/${name}/todos`);
      onValue(todosRef, (snapshot) => {
        const data = snapshot.val();

        for (let num in data) {
          console.log(num);
        }
      })
      //alert("Deleted that todo item");
      //window.location.reload();
    })
  })

  // create the add and save buttons
  const addBtn = document.createElement("button");
  addBtn.className = "todo-action";
  addBtn.id = "add";
  addBtn.innerHTML = "Add";

  const saveBtn = document.createElement("button");
  saveBtn.className = "todo-action";
  saveBtn.id = `${name}-save`;
  saveBtn.style.marginLeft = "5px";
  saveBtn.innerHTML = "Save";

  // append these buttons to the todoActionsDiv
  todoActionsDiv.appendChild(addBtn);
  todoActionsDiv.appendChild(saveBtn);

  // select the new buttons
  const newSaveBtn = document.querySelector(`#${name}-save`);
  const newAddBtn = document.querySelector("#add");

  // when the newSaveBtn is clicked, reload the page to "save" it
  newSaveBtn.addEventListener("click", () => {
    window.location.reload();
  });

  // when the newAddBtn is clicked, add the new task
  newAddBtn.addEventListener("click", () => {
    const addTodoModal = document.querySelector("#addModal");
    const addTodoBtn = document.querySelector("#addTodo");

    // set the modal to a flex
    addTodoModal.style.display = "flex";

    // when its clicked, just find the indexNum of the next todo in the list.
    addTodoBtn.addEventListener("click", () => {
      const addTodoName = document.querySelector("#newName");

      // get the existing task
      const todosRef = ref(database, `users/${uid}/${name}/todos`);
      var indexNum;

      onValue(todosRef, (snapshot) => {
        const data = snapshot.val();

        for (let num in data) {
          indexNum = num;
        }
      });
      // create the new task
      set(
        ref(database, `/users/${uid}/${name}/todos/${Number(indexNum) + 1}`),
        {
          name: addTodoName.value,
        },
      );
      alert("Added the new todo");
      window.location.reload();
    });
  });
};

const deleteTodo = (uid, name) => {
  set(ref(database, `users/${uid}/${name}`), null);
  alert("Deleted the todo list");
  window.location.reload();
};
