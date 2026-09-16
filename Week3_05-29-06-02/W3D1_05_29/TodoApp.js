console.log("Todo App Initiated...");

(function update() {
  const date = new Date();
  document.getElementById("time").dateTime = date.toISOString();
  document.getElementById("time").textContent = date.toLocaleString();
  setTimeout(update, 1000);
})();

let tasks = [];
let taskId = 0;

let taskList = document.querySelector("ul.Task-ul");
let taskInput = document.querySelector("input#input");
let taskCategory = document.querySelector("select#category");
let taskAddButton = document.querySelector("button.task-button");

function displayTask(task) {
  const list = document.createElement("li");
  list.className = "task-item";
  taskList.append(list);
  list.setAttribute( "id", task.id);
  //header
  const taskInfoHead = document.createElement("div");
  taskInfoHead.className = "task-info-head";
  list.append(taskInfoHead);
  //checkbox
  let checkBox = document.createElement("input");
  checkBox.className = "task-checkbox";
  taskInfoHead.append(checkBox);
  checkBox.setAttribute("type", "checkbox");
  checkBox.checked = task.completed;
  checkBox.addEventListener('change',()=>{
    task.completed = checkBox.checked;
    updateSummary();
    // taskTitle.classList.toggle('completed',task.completed);
  });
  //task info
  const taskInfo = document.createElement("div");
  taskInfo.className = "task-info";
  taskInfoHead.append(taskInfo);
  //task title
  const taskTitle = document.createElement("label");
  taskTitle.className = "task-title";
  taskTitle.textContent = task.title;
  taskInfo.append(taskTitle);
  //Task category
  const CategoryElement = document.createElement("span");
  CategoryElement.className = "task-category-";
  CategoryElement.textContent = task.category;
  taskInfo.append(CategoryElement);
  //
  const udDiv =document.createElement('div');
  udDiv.className ="task-actions"
  list.append(udDiv);
  //Delete
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "task-delete";
  deleteBtn.textContent = "🗑️";
  udDiv.append(deleteBtn);

  deleteBtn.addEventListener("click",()=>{
tasks = tasks.filter(t =>t.id !== task.id);
list.remove();
updateSummary();
 })
 const edit = document.createElement('button');
 edit.className = "task-edit";
 edit.textContent = "📝"
 udDiv.append(edit);
 edit.addEventListener('click',()=>{
    const newTitle = prompt("Enter new task title : ", task.title);
    if (newTitle !== null && newTitle.trim()!== ''){
        task.title = newTitle.trim();
        taskTitle.textContent= task.title;
    }
 })
}

//Add Task Button Click Listner
taskAddButton.addEventListener("click", function () {
  console.log("Add Task Button Clicked");
  const taskTitle = taskInput.value.trim();
  const taskCategoryValue = taskCategory.value;

  if (taskTitle !== "") {
    const task = {
      id: taskId++,
      title: taskTitle,
      category: taskCategoryValue,
      completed: false,
    };
    tasks.push(task);
    displayTask(task);
    updateSummary();

    // Reset
    taskInput.value = "";
    taskInput.focus();
  }
});


let all = document.querySelector('button.filter-all');
let active = document.querySelector('button.filter-active');
let completed = document.querySelector('button.filter-completed');

function filterTasks(filter){
    taskList.innerHTML = "";
    let filteredTask;
    if (filter === "active")
   { filteredTask = tasks.filter(task => task.completed === false);
    } else if (filter === "completed"){
        filteredTask = tasks.filter(task => task.completed === true);

    }else {
       filteredTask = tasks;
    }
      filteredTask.forEach(task => {
        displayTask(task);})
}
all.addEventListener('click',()=>{
    filterTasks('all');
})
active.addEventListener('click',()=>{
    filterTasks('active');
})
completed.addEventListener('click',()=>{
    filterTasks('completed');
})


let taskSummary = document.querySelector('#task-summary');

function updateSummary(){
    let completedTask = tasks.filter(task => task.completed === true).length;
    let activeTask = tasks.filter(task => task.completed === false).length;

    taskSummary.textContent = `${activeTask} Remaining . ${completedTask} Completed` 
}
