let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add Task
document.getElementById("addBtn").addEventListener("click", addTask);

document.getElementById("taskInput").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

function addTask() {
    const input = document.getElementById("taskInput");
    const text = input.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const task = {
        id: Date.now(),
        title: text,
        completed: false,
        time: new Date().toLocaleString()
    };

    tasks.push(task);

    saveTasks();
    displayTasks();

    input.value = "";
}


// Display Tasks
function displayTasks() {

    const pendingList = document.getElementById("pendingList");
    const completedList = document.getElementById("completedList");

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    let pending = 0;
    let completed = 0;

    tasks.forEach(task => {

        const li = document.createElement("li");
        li.className = "task";

        li.innerHTML = `
            <div class="task-title">${task.title}</div>

            <div class="task-time">
                📅 ${task.time}
            </div>

            <button class="complete-btn" onclick="completeTask(${task.id})">
                ✓ Complete
            </button>

            <button class="edit-btn" onclick="editTask(${task.id})">
                ✎ Edit
            </button>

            <button class="delete-btn" onclick="deleteTask(${task.id})">
                🗑 Delete
            </button>

            <button class="undo-btn" onclick="undoTask(${task.id})">
                ↶ Undo
            </button>
        `;

        if (task.completed) {
            completedList.appendChild(li);
            completed++;
        } else {
            pendingList.appendChild(li);
            pending++;
        }
    });

    document.getElementById("pendingCount").textContent = `(${pending})`;
    document.getElementById("completedCount").textContent = `(${completed})`;
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


// Undo / Move back to Pending
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

    const newTitle = prompt("Edit your task:", task.title);

    if (newTitle !== null && newTitle.trim() !== "") {
        task.title = newTitle.trim();
        task.time = new Date().toLocaleString();

        saveTasks();
        displayTasks();
    }
}


// Delete Task
function deleteTask(id) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (confirmDelete) {
        tasks = tasks.filter(task => task.id !== id);

        saveTasks();
        displayTasks();
    }
}


// Save Tasks
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Load Tasks when page opens
displayTasks();
