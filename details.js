document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const taskNameElement = document.querySelector("#taskName");
  const taskDescriptionElement = document.querySelector("#taskDescription");
  const creationDateElement = document.querySelector("#creationDate");
  const statusElement = document.querySelector("#status");

  if (
    params.has("id") 
  ) {
    const taskTitle = params.get("title");
    const taskDescription = params.get("description");
    const creationDate = params.get("creationDate");
    const completed = params.get("completed") === "true";

    taskNameElement.textContent = `Task: ${taskTitle}`;
    taskDescriptionElement.textContent = `Description: ${taskDescription}`;
    creationDateElement.textContent = `Creation Date: ${creationDate}`;
    statusElement.textContent = `Status: ${
      completed ? "Completed" : "Not Completed"
    }`;
  } else {
    document.body.textContent = "404 not found";
  }
});