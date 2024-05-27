const edit = () => {
  const todoContent = document.querySelector('.todo-content');
  const todoActionsDiv = document.querySelector('.todo-actions');
  const todoActions = document.querySelectorAll('#todo-action');
  const todoListItem = document.querySelectorAll('#todo-item');
  
  // loop through all the items in the todoListItem and add a checkbox to each list item
  for (let i = 0; i < todoListItem.length; i++) {
    const checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.className = 'todo-checkbox';
    todoListItem[i].appendChild(checkbox);
  }

  // loop through all the actions in todoActions and hide them
  for (let i = 0; i < todoActions.length; i++) {
    // hide the current buttons
    const todoAction = todoActions[i];
    todoAction.style.display = 'none';
  }

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
  })
}