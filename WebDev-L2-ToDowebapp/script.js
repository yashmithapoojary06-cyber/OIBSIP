let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

// Add Task
addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        time: new Date().toLocaleString()
    };

    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    displayTasks();
}

// Display Tasks
function displayTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;

    pendingEmpty.style.display =
        pending.length === 0 ? "block" : "none";

    completedEmpty.style.display =
        completed.length === 0 ? "block" : "none";

    pending.forEach(task => {
        pendingTasks.appendChild(createTaskElement(task));
    });

    completed.forEach(task => {
        completedTasks.appendChild(createTaskElement(task));
    });
}

// Create Task
function createTaskElement(task) {

    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
        <div class="task-info">
            <div class="task-name">${escapeHTML(task.text)}</div>
            <div class="task-time">Added: ${task.time}</div>
        </div>

        <div class="task-buttons">

            ${
                task.completed
                ? `<button class="undo-btn" onclick="undoTask(${task.id})">
                    ↩ Undo
                   </button>`
                : `<button class="complete-btn" onclick="completeTask(${task.id})">
                    ✓ Complete
                   </button>`
            }

            <button class="edit-btn" onclick="editTask(${task.id})">
                ✏ Edit
            </button>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
                🗑 Delete
            </button>

        </div>
    `;

    return div;
}

// Complete Task
function completeTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = true;
        saveTasks();
        displayTasks();
    }
}

// Undo Task
function undoTask(id) {

    const task = tasks.find(task => task.id === id);

    if (task) {
        task.completed = false;
        saveTasks();
        displayTasks();
    }
}

// Edit Task
function editTask(id) {

    const task = tasks.find(task => task.id === id);

    if (!task) return;

    const newText = prompt("Edit your task:", task.text);

    if (newText === null) {
        return;
    }

    if (newText.trim() === "") {
        alert("Task cannot be empty.");
        return;
    }

    task.text = newText.trim();

    saveTasks();
    displayTasks();
}

// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== id);

    saveTasks();
    displayTasks();
}

// Save to Local Storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Prevent HTML injection
function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}

// Initial display
displayTasks();
