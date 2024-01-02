const btn = document.querySelector(".add-task-button");
const ul = document.querySelector(".list");
const input = document.querySelector("#task-input");
const errSpan = document.querySelector("#error");

class Task {
  #id;
  #title;
  #description;
  #creationDate;
  #completed;

  constructor(id, title, description, creationDate, completed) {
    this.#id = id;
    this.#title = title;
    this.#description = description;
    this.#creationDate = creationDate;
    this.#completed = completed;
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

class TaskList {
  #tasks;

  constructor() {
    this.#tasks = [];
  }

  addTask(e) {
    e.preventDefault();
    if (input.value === "") {
      errSpan.style.display = "inline";
      errSpan.textContent = "Please add a task";
    } else {
      const taskId = Math.random().toString(16).slice(2);
      const currentDate = new Date();

      const formattedDate = `${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}.${(currentDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${currentDate.getFullYear()} ${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      const newTask = new Task(taskId, input.value, "", formattedDate, false);
      this.#tasks.push(newTask);

      let li = document.createElement("li");
      li.innerHTML = `${input.value}`;
      ul.appendChild(li);
      let date = document.createElement("span");
      date.textContent = formattedDate;
      date.style = `
      font-size: 12px;
      color: gray;
      `;
      li.appendChild(date);
      localStorage.setItem("tasks", JSON.stringify(this.#tasks));
      errSpan.style.display = "none";
    }
    input.value = "";
  }
  get tasks() {
    return this.#tasks;
  }
}

const taskList = new TaskList();

btn.addEventListener("click", function (e) {
  taskList.addTask(e);
});
