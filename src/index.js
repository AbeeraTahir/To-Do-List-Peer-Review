import './style.css';
import updateTaskStatus from './task_status_update.js';

// getting elements
const form = document.getElementById('add-to-list');
const listItems = document.getElementById('to-do-list');
const btnClear = document.querySelector('.btn-clear');

const setStorageItem = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const getStorageItem = () => {
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  return tasks;
};

// array for storing objects of to-do tasks
const taskArr = [];

// function for display added task to list
const displayTask = (task) => {
  const listItem = `
  <li>
    <div class="check">
      <input type="checkbox" name="checkbox" class="checkbox" id="${task.description}">
      <input type="text" class="task-description" name="${task.description}" class="task-name" id="task-name" value="${task.description}">
    </div>
    <div class="actions">
      <i class="fa-solid fa-pen-to-square edit"></i>
      <i class="fa-solid fa-trash-can del"></i>
    </div>
  </li>`;
  return listItem;
};

window.addEventListener('DOMContentLoaded', () => {
  const tasks = getStorageItem();
  // displaying tasks on window loading
  tasks.forEach((task) => {
    const listItem = displayTask(task);
    listItems.insertAdjacentHTML('beforeend', listItem);
  });
  // setting checkbox value to checked on window refresh if status is completed
  const completedTasksIndex = tasks.filter((task) => task.completed === true);
  completedTasksIndex.forEach((task, taskIndex) => {
    listItems.children.forEach((UITask, UIIndex) => {
      if (UIIndex === (completedTasksIndex[taskIndex].index - 1)) {
        listItems.children[UIIndex].children[0].children[0].checked = true;
      }
    });
  });
});

// function for adding task to list
const addTask = (task) => {
  const taskObj = {};
  taskObj.index = taskArr.length + 1;
  taskObj.description = task;
  taskObj.completed = false;
  const listItem = displayTask(taskObj);
  listItems.insertAdjacentHTML('beforeend', listItem);
  taskArr.push(taskObj);
  setStorageItem(taskArr);
};

// deleting task
const deleteTask = (task, element) => {
  const taskName = task.children[0].children[1].value;
  const tasks = JSON.parse(localStorage.getItem('tasks'));
  const taskIndex = tasks.findIndex((x) => x.description === taskName);
  tasks.splice(taskIndex, 1);
  tasks.forEach((item, ind) => {
    item.index = ind + 1;
  });
  setStorageItem(tasks);
  element.parentElement.parentElement.remove();
};

// editing task
// task will be edited when first the input field of task is updated and then edit icon is clicked
const editTask = (task) => {
  const tasks = getStorageItem();
  const taskItem = task.children[0].children[1].name;
  const taskIndex = tasks.findIndex((x) => x.description === taskItem);
  const taskName = task.querySelector('#task-name').value;
  tasks[taskIndex].description = taskName;
  setStorageItem(taskArr);
};

// Element target for task deletion and updation
listItems.addEventListener('click', (e) => {
  const task = e.target.parentElement.parentElement;
  if (e.target.classList.contains('del')) {
    deleteTask(task, e.target);
  }
  // task will be edited when first the input field of task is updated and then edit icon is clicked
  if (e.target.classList.contains('edit')) {
    editTask(task);
  }
  if (e.target.classList.contains('checkbox')) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    updateTaskStatus(e.target, tasks);
  }
});

// clearing the completed tasks from list
btnClear.addEventListener('click', () => {
  const tasks = getStorageItem();
  const filterTasks = tasks.filter((task) => task.completed === false);
  filterTasks.forEach((item, ind) => {
    item.index = ind + 1;
  });
  let updatedList = '';
  filterTasks.forEach((task) => {
    updatedList += displayTask(task);
  });
  listItems.innerHTML = updatedList;
  setStorageItem();
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = document.getElementById('task');
  addTask(task.value);
  task.value = '';
});
