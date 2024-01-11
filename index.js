const btn = document.querySelector(".add-task-button");
const ul = document.querySelector(".list");
const taskInput = document.querySelector("#task-input");
const descriptionInput = document.querySelector("#description-input");
const errSpan = document.querySelector("#error");

class TaskList {
  #tasks;

  constructor(tasks) {
    this.#tasks = tasks;
  }

  addTask(task) {
    this.#tasks.push(task);
  }

  get tasks() {
    return this.#tasks;
  }
}

class Task {
  #id;
  #title;
  #description;
  #creationDate;
  #completed;

  constructor(title, description, creationDate, completed) {
    this.#id = "id" + Math.random().toString(16).slice(2);
    this.#title = title;
    this.#description = description;
    this.#creationDate = creationDate;
    this.#completed = completed;
  }

  addTaskToList(taskList) {
    const li = document.createElement("li");
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener("change", () => this.toggleCompleted(checkBox));

    li.appendChild(checkBox);
    li.dataset.taskId = this.#id;
    ul.appendChild(li);
    li.appendChild(document.createTextNode(`${this.#title}`));

    if (this.#completed) {
      checkBox.checked = true;
      li.style.textDecoration = "line-through";
      li.style.color = "gray";
    }

    taskList.addTask(this);
    this.saveData();
    taskInput.value = "";
    descriptionInput.value = "";
  }

  toggleCompleted(checkBox) {
    this.#completed = checkBox.checked;

    const liElement = ul.querySelector(`li[data-task-id="${this.#id}"]`);

    if (this.#completed) {
      liElement.style.textDecoration = "line-through";
      liElement.style.color = "gray";
    } else {
      liElement.style.textDecoration = "none";
      liElement.style.color = "";
    }

    this.saveData(true);
  }

  formatDate() {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    return this.#creationDate.toLocaleString("en-US", options).replace(",", "");
  }

  saveData(updateExistingTask = false) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    if (updateExistingTask) {
      tasks = tasks.map((task) => {
        if (task.id === this.#id) {
          return {
            ...task,
            completed: this.#completed,
          };
        }
        return task;
      });
    } else {
      tasks.push({
        id: this.#id,
        title: this.#title,
        description: this.#description,
        creationDate: this.formatDate(),
        completed: this.#completed,
      });
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get description() {
    return this.#description;
  }

  get creationDate() {
    return this.#creationDate;
  }

  get completed() {
    return this.#completed;
  }
}

const taskList = new TaskList([]);



btn.addEventListener("click", (e) => {
  e.preventDefault();

  if (taskInput.value === "" || descriptionInput.value === "") {
    errSpan.textContent = "Both fields must be filled";
    errSpan.style.display = "inline";
  } else {
    const task = new Task(
      taskInput.value,
      descriptionInput.value,
      new Date(),
      false
    );
    task.addTaskToList(taskList);
    errSpan.style.display = "none";
  }
});

function showData() {
  ul.innerHTML = JSON.parse(localStorage.getItem("tasks"))
  
}

showData()

// localStorage.clear()