const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addbutton = document.getElementById("add-button");
const editbutton = document.getElementById("edit-button");
const alertMassage = document.getElementById("alert-massage");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todo");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
console.log(todos);

const generateId = () => {
  return Math.round(Math.random() * Math.pow(10, 15)).toString();
};

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const showAlert = (massage, type) => {
  alertMassage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = massage;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMassage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const showTodos = (data) => {
  const todolist = data || todos;
  todosBody.innerHTML = "";
  if (!todolist.length) {
    todosBody.innerHTML = "<tr><td colspan='4'>No Task Found</td></tr>";
  }

  todolist.forEach((todo) => {
    todosBody.innerHTML += `<tr>
    <td>${todo.task}</td>
    <td>${todo.date || "No Date"}</td>
    <td>${todo.completed ? "Completed" : "Pending"}</td>
    <td>
    <button onclick="editHandler('${todo.id}')">Edit</button>
    <button onclick="toggleHandler('${todo.id}')">${
      todo.completed ? "Undo" : "Do"
    }</button>
    <button onclick="deleteHandler('${todo.id}')">Delete</button>
    </td>
    </tr>`;
  });
};

const addhandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    task,
    date,
    completed: false,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    showTodos();
    taskInput.value = "";
    dateInput.value = "";
    console.log(todos);
    showAlert("todo Added successfully", "success");
  } else {
    showAlert("Pleas enter a todo!", "error");
  }
};

const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    showTodos();
    showAlert("All Todos Cleared Successfuly", "success");
  } else {
    showAlert("No Todos Found", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  showTodos();
  showAlert("Todo Deleted successfully", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  showTodos();
  showAlert("Todo status Changed Successfulyy", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addbutton.style.display = "none";
  editbutton.style.display = "inline-block";
  editbutton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addbutton.style.display = "inline-block";
  editbutton.style.display = "none";
  saveToLocalStorage();
  showTodos();
  showAlert("Todos edited Successfully", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  showTodos(filteredTodos);
};

window.addEventListener("load", () => showTodos());
addbutton.addEventListener("click", addhandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editbutton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
