const btn = document.querySelector(".add-task-button");
const ul = document.querySelector(".list");
const li = document.createElement("li");
const input = document.querySelector("input");
let inputValue;

input.addEventListener("input", () => {
  inputValue = input.value;
});

btn.addEventListener("click", (e) => {
    e.preventDefault();
    ul.appendChild(li);
    li.appendChild(document.createTextNode(inputValue))
  });