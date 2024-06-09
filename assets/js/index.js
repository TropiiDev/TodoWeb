const edit = () => {
  const todoList = document.querySelector("#todo-list");
  const todoListItem = document.querySelectorAll('#todo-item');
  const todoActionsDiv = document.querySelector('.todo-actions');
  const todoActions = document.querySelectorAll('#todo-action');

  const editModal = document.getElementById("editModal");
  const addModal = document.getElementById("addModal");

  const changeName = document.querySelector("#changeName");
  const addTodo = document.querySelector("#addTodo");
  
  // loop through all the items in the todoListItem and add a checkbox to each list item
  for (let i = 0; i < todoListItem.length; i++) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = `todo-checkbox`;
    checkbox.id = i;
    todoListItem[i].appendChild(checkbox);
  }

  // loop through all the actions in todoActions and hide them
  for (let i = 0; i < todoActions.length; i++) {
    // hide the current buttons
    const todoAction = todoActions[i];
    todoAction.style.display = 'none';
  }

  // create the add button
  let addBtn = document.createElement('button');
  addBtn.className = 'todo-action add';
  addBtn.id = 'todo-action';
  addBtn.innerHTML = 'Add';

  // add the add button to the todoActionsDiv
  todoActionsDiv.appendChild(addBtn);

  // get the new add button
  addBtn = document.querySelector('.add');

  // if the add button was clicked, show the addModal to create a new list item
  addBtn.addEventListener('click', () => {
    addModal.style.display = 'block';
  })

  // create the save button
  let saveBtn = document.createElement('button');
  saveBtn.className = 'todo-action save';
  saveBtn.id = 'todo-action';
  saveBtn.innerHTML = 'Save';

  // add the save button to the todoActionsDiv
  todoActionsDiv.appendChild(saveBtn);

  // get the new save button
  saveBtn = document.querySelector('.save');

  // if the save button was clicked, show the old buttons and remove the checkboxes
  saveBtn.addEventListener('click', () => {
    saveBtn.remove();
    addBtn.remove();

    const todoCheckboxes = document.querySelectorAll('.todo-checkbox');
    for (let i = 0; i < todoCheckboxes.length; i++) {
      // delete the checkboxes
      const todoCheckbox = todoCheckboxes[i];
      todoCheckbox.remove();
    }

    for (let i = 0; i < todoActions.length; i++) {
      // show the old buttons
      const todoAction = todoActions[i];
      todoAction.style.display = 'inline-block';
    }

    return;
  })

  // when the checkbox is clicked, remove the item and the checkbox
  const todoCheckboxes = document.querySelectorAll('.todo-checkbox');
  todoCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('click', () => {
      const checkboxNum = Number(checkbox.id);
      if (isNaN(checkboxNum)) {
        // do absolutely nothing
        console.error('Checkbox ID is not a valid number');
        return;
      }
      checkbox.remove();
      todoListItem[checkboxNum].remove();
    })
  })

  // if someone clicks on the todoItem allow them to edit the name
  todoListItem.forEach((item) => {
    item.addEventListener('click', (e) => {
      // check if the Edit button is hidden if not do nothing
      if (todoActions[0].style.display == 'none') {
        /* 
          We want to check to see if the Edit button is visible
          because if it is visible that means the user is not
          editing the list and the editModal should not open
        */

        // check if the input was clicked, if so do nothing. if not, show the editModal
        if (e.target.nodeName === "INPUT") {
          return;
        } else {
          editModal.style.display = "block";
          editModal.className = `${item.classList} modal`;
        }
        
        // edit the placeholder to show what list item was clicked.
        const nameChangeField = document.getElementById('nameChange');
        nameChangeField.placeholder = item.innerText;
      } else {
        return;
      }
    })
  })

  // if the changeName button was clicked, change the name
  changeName.addEventListener('click', () => {
    // the editModal.classList returns an array so we have to loop through it
    for (let i = 0; i < editModal.classList.length; i++) {
      // if the editModal.classList[i] isn't a number then do nothing
      if (isNaN(editModal.classList[i])) {
        return;
      } else {
        // if it isn't then we have the number of the todoListItem
        const todoListItem = document.querySelectorAll('#todo-item');
        const todoListNum = editModal.classList[i];
        let nameChangeInput = document.querySelector("#nameChange");

        // create another checkbox for that item
        const checkbox = document.createElement('input');

        checkbox.type = "checkbox";
        checkbox.className = `todo-checkbox`;
        checkbox.id = i;

        // check if there is a todoItem that exists
        for (let i = 0; i < todoListItem.length; i++) {
          if (todoListItem[i].innerText === nameChangeInput.value) {
            alert(`You already have a todo named ${nameChangeInput.value}`);
            nameChangeInput.value = "";
            return;
          }
        }

        // change the name and add the checkbox
        todoListItem[todoListNum].innerHTML = nameChangeInput.value;
        nameChangeInput.value = "";
        todoListItem[todoListNum].appendChild(checkbox);

        // close the modal
        editModal.style.display = 'none';

        // if the checkbox is clicked, remove the todoListItem and the checkbox
        checkbox.addEventListener('click', () => {
          todoListItem[todoListNum].remove();
          checkbox.remove();
        })
      }
    }
  })

  // if the addTodo button was clicked, add a new todoItem to todoList
  addTodo.addEventListener('click', () => {
    let newNameInput = document.querySelector("#newName");
    const todoListItem = document.querySelectorAll('#todo-item');
    const lastTodoItem = todoListItem[todoListItem.length - 1];

    // if there is not lastTodoItem then create a new entry
    if (lastTodoItem === undefined) {
      const todoNum = 0;

      const newTodoItem = document.createElement('li');
      newTodoItem.className = todoNum;
      newTodoItem.id = 'todo-item';
      newTodoItem.innerHTML = newNameInput.value;

      // create the new checkbox
      const checkbox = document.createElement('input');

      checkbox.type = "checkbox";
      checkbox.className = `todo-checkbox`;
      checkbox.id = 0;

      // append the checkbox and the newTodoItem
      newNameInput.value = "";
      newTodoItem.appendChild(checkbox);
      todoList.appendChild(newTodoItem);

      // close the modal
      addModal.style.display = 'none';

      // if the checkbox is clicked remove the new item and the checkbox
      checkbox.addEventListener('click', () => {
        newTodoItem.remove();
        checkbox.remove();
      })

      return;
    }

    // lastTodoItem returns an array so we have to loop through it
    for (let i = 0; i < lastTodoItem.classList.length; i++) {
      // if lastTodoItem.classList[i] returns a string, return
      if (isNaN(lastTodoItem.classList[i])) {
        return;
      } else {
        // if it gives us a number, create the new todoItem
        const todoNum = lastTodoItem.classList[i];
        const newTodoItem = document.createElement('li');
        
        newTodoItem.className = Number(todoNum) + 1;
        newTodoItem.id = 'todo-item';
        newTodoItem.innerHTML = newNameInput.value;

        // create the new checkbox
        const checkbox = document.createElement('input');

        checkbox.type = "checkbox";
        checkbox.className = `todo-checkbox`;
        checkbox.id = i;

        // check if there is a todoItem that exists
        for (let i = 0; i < todoListItem.length; i++) {
          if (todoListItem[i].innerText === newNameInput.value) {
            alert(`You already have a todo named ${newNameInput.value}`);
            newNameInput.value = "";
            return;
          }
        }

        // append the checkbox and the newTodoItem
        newNameInput.value = "";
        newTodoItem.appendChild(checkbox);
        todoList.appendChild(newTodoItem);

        // close the modal
        addModal.style.display = 'none';
        

        // if the checkbox is clicked remove the new item and the checkbox
        checkbox.addEventListener('click', () => {
          newTodoItem.remove();
          checkbox.remove();
        })
      }
    }
  })
}

const deleteTodo = () => {
  alert('You cannot delete the example todo');
}
