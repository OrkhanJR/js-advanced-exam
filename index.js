const btn = document.querySelector(".add-task-button");
const ul = document.querySelector(".list");
const taskInput = document.querySelector("#task-input");
const descriptionInput = document.querySelector("#description-input");
const errSpan = document.querySelector("#error");
const sortSelect = document.querySelector("#sort-select");
const filterRadios = document.querySelectorAll('input[name="filter"]');



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
    const li = this.createListItem();
    ul.appendChild(li);

    taskList.addTask(this);
    this.saveData();
    taskInput.value = "";
    descriptionInput.value = "";
  }

  createListItem() {
    const li = document.createElement("li");
    const checkBox = this.createCheckbox();
    const editButton = this.createButton(
      "Edit",
      () => this.editTasks(),
      "edit"
    );
    const deleteButton = this.createButton(
      "Delete",
      () => this.deleteTask(taskList),
      "delete"
    );
    const detailsButton = this.createButton(
      "Details",
      () => this.showDetails(),
      "details"
    );

    li.appendChild(checkBox);
    li.appendChild(document.createTextNode(`${this.#title}`));
    li.appendChild(editButton);
    li.appendChild(deleteButton);
    li.appendChild(detailsButton);

    if (this.#completed) {
      checkBox.checked = true;
    }

    return li;
  }

  createCheckbox() {
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.addEventListener("change", () => this.toggleCompleted(checkBox));
    return checkBox;
  }

  createButton(text, clickHandler, className) {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    button.className = className;
    return button;
  }

  toggleCompleted(checkBox) {
    this.#completed = checkBox.checked;
    this.saveData(true);
  }

  editTasks() {
    const index = taskList.getTaskIndex(this);
    const detailsURL = `edit.html?index=${encodeURIComponent(index)}`;
    window.open(detailsURL, "_self");
  }

  showDetails() {
    const detailsURL = `details.html?id=${encodeURIComponent(
      this.#id
    )}&title=${encodeURIComponent(
      this.#title
    )}&description=${encodeURIComponent(
      this.#description
    )}&creationDate=${encodeURIComponent(
      this.formatDate()
    )}&completed=${encodeURIComponent(this.#completed)}`;
    window.open(detailsURL, "_self");
  }
  deleteTask(taskList) {
    taskList.removeTask(this);
    taskList.saveTasksToLocalStorage();
    taskList.renderTasks();
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

  static loadTasksFromLocalStorage() {
    const tasksData = JSON.parse(localStorage.getItem("tasks")) || [];
    return tasksData.map((taskData) => {
      const task = new Task(
        taskData.title,
        taskData.description,
        new Date(taskData.creationDate),
        taskData.completed
      );
      return task;
    });
  }

  static sortTasks(tasks, sortBy) {
    if (sortBy === "date") {
      return tasks.sort((a, b) => b.creationDate - a.creationDate);
    } else if (sortBy === "name") {
      return tasks.sort((a, b) => a.title.localeCompare(b.title));
    }
    return tasks;
  }

  static filterTasks(tasks, filterBy) {
    if (filterBy === "done") {
      return tasks.filter((task) => task.completed);
    } else if (filterBy === "undone") {
      return tasks.filter((task) => !task.completed);
    }
    return tasks;
  }
}

class TaskList {
  #tasks;

  constructor(tasks) {
    this.#tasks = tasks;
    this.renderTasks();
  }

  addTask(task) {
    this.#tasks.push(task);
    this.renderTasks();
  }

  removeTask(task) {
    const index = this.#tasks.indexOf(task);
    if (index !== -1) {
      this.#tasks.splice(index, 1);
    }
  }

  saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.#tasks));
  }

  renderTasks() {
    const sortBy = sortSelect.value;
    const filterBy = [...filterRadios].find((radio) => radio.checked).value;

    const sortedAndFilteredTasks = Task.filterTasks(
      Task.sortTasks(this.#tasks.slice(), sortBy),
      filterBy
    );

    ul.innerHTML = "";

    sortedAndFilteredTasks.forEach((task) => {
      const li = task.createListItem();
      ul.appendChild(li);
    });
  }

  getTaskIndex(task) {
    return this.#tasks.indexOf(task);
  }
}

function getSelectedFilter() {
  const selectedRadio = Array.from(filterRadios).find((radio) => radio.checked);
  return selectedRadio ? selectedRadio.value : "all";
}

const taskList = new TaskList(Task.loadTasksFromLocalStorage());

btn.addEventListener("click", (e) => {
  e.preventDefault();

  const titleValidationRegex =
    /^(?!.*\s{2,})(?!\d+$)(([A-Za-z]+)|([А-Яа-я]+)|(\d+))(?:\s+((?:(?!\s{2,})[A-Za-zА-Яа-я\d]){1,16})){1,}$/;
  const titleIsValid = titleValidationRegex.test(taskInput.value.trim());
  const descriptionIsValid = titleValidationRegex.test(
    descriptionInput.value.trim()
  );

  if (!titleIsValid || !descriptionIsValid) {
    errSpan.textContent =
      "Invalid input. Please check your input and try again.";
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

sortSelect.addEventListener("change", () => {
  taskList.renderTasks();
});

filterRadios.forEach((radio) => {
  radio.addEventListener("change", () => {
    taskList.renderTasks();
  });
});

// localStorage.clear();
