const urlParams = new URLSearchParams(window.location.search);
const taskIndex = parseInt(urlParams.get("index"), 10);
const saveButton = document.querySelector("#saveChanges");
const newName = document.querySelector("#task-name").value;
const newDescription = document.querySelector("#task-description").value;
const newStatus = document.querySelector("#completed").checked;
const errorSpan = document.querySelector("#errorP");

function getTaskFromLocalStorage() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  return tasks[taskIndex];
}

const task = getTaskFromLocalStorage();
if (task) {
  document.querySelector("#task-name").value = task.title;
  document.querySelector("#task-description").value = task.description;
  if (task.completed) {
    document.querySelector("#completed").checked = true;
  } else {
    document.querySelector("#not-completed").checked = true;
  }
}

function saveChanges() {
  const newName = document.querySelector("#task-name").value;
  const newDescription = document.querySelector("#task-description").value;
  const newStatus = document.querySelector("#completed").checked;

  if (newName === "" || newDescription === "") {
    errorSpan.style.display = "block";
    errorSpan.textContent = "Пожалуйста, заполните все обязательные поля.";
    return;
  }

  errorSpan.textContent = "";

  const updatedTasks = (JSON.parse(localStorage.getItem("tasks")) || []).map(
    (t, index) => {
      if (index === taskIndex) {
        return {
          ...t,
          title: newName,
          description: newDescription,
          completed: newStatus,
        };
      }
      return t;
    }
  );

  localStorage.setItem("tasks", JSON.stringify(updatedTasks));

  window.location.href = "index.html";
}

saveButton.addEventListener("click", saveChanges);
