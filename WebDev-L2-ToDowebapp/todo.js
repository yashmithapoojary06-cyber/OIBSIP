const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
displayTasks();
addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }

});
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false,
        addedTime: new Date().toLocaleString(),
        completedTime: null
    };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    displayTasks();
}
function displayTasks() {

    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    const pendingTasks = tasks.filter(function(task) {
        return task.completed === false;
    });

    const completedTasks = tasks.filter(function(task) {
        return task.completed === true;
    });

    
    pendingCount.textContent =
        pendingTasks.length + " pending";

    completedCount.textContent =
        completedTasks.length + " completed";

   
    if (pendingTasks.length === 0) {

        pendingList.innerHTML =
            '<p class="empty-message">🎉 No pending tasks!</p>';
    }

    if (completedTasks.length === 0) {

        completedList.innerHTML =
            '<p class="empty-message">Completed tasks will appear here.</p>';
    }

    
    pendingTasks.forEach(function(task) {

        createTaskElement(task, pendingList);

    });

    
    completedTasks.forEach(function(task) {

        createTaskElement(task, completedList);

    });
}


function createTaskElement(task, list) {

    const taskDiv = document.createElement("div");

    taskDiv.className = "task";

    if (task.completed) {

        taskDiv.classList.add("completed-task");
    }

   
    const taskText = document.createElement("div");

    taskText.className = "task-text";

    taskText.textContent = task.text;

    
    const taskTime = document.createElement("div");

    taskTime.className = "task-time";

    if (task.completed) {

        taskTime.textContent =
            "Added: " + task.addedTime +
            " | Completed: " +
            task.completedTime;

    } else {

        taskTime.textContent =
            "Added: " + task.addedTime;
    }

    
    const buttonsDiv = document.createElement("div");

    buttonsDiv.className = "task-buttons";

    
    const completeButton =
        document.createElement("button");

    completeButton.className = "complete-btn";

    if (task.completed) {

        completeButton.textContent = "↩ Undo";

    } else {

        completeButton.textContent = "✓ Complete";
    }

    completeButton.addEventListener("click", function() {

        toggleComplete(task.id);

    });

    
    const editButton =
        document.createElement("button");

    editButton.className = "edit-btn";

    editButton.textContent = "✎ Edit";

    editButton.addEventListener("click", function() {

        startEdit(task.id);

    });

    
    const deleteButton =
        document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.textContent = "🗑 Delete";

    deleteButton.addEventListener("click", function() {

        deleteTask(task.id);

    });

    buttonsDiv.appendChild(completeButton);

    buttonsDiv.appendChild(editButton);

    buttonsDiv.appendChild(deleteButton);

    taskDiv.appendChild(taskText);

    taskDiv.appendChild(taskTime);

    taskDiv.appendChild(buttonsDiv);

    list.appendChild(taskDiv);
}

function startEdit(id) {

    const task = tasks.find(function(task) {

        return task.id === id;

    });

    if (!task) {
        return;
    }

    const taskElements =
        document.querySelectorAll(".task");

    taskElements.forEach(function(taskElement) {

        const textElement =
            taskElement.querySelector(".task-text");

        if (textElement &&
            textElement.textContent === task.text) {

           
            const input =
                document.createElement("input");

            input.type = "text";

            input.className = "edit-input";

            input.value = task.text;

            
            textElement.replaceWith(input);

            
            const buttons =
                taskElement.querySelector(".task-buttons");

           
            buttons.innerHTML = "";

            
            const saveButton =
                document.createElement("button");

            saveButton.className = "save-btn";

            saveButton.textContent = "✓ Save";

            saveButton.addEventListener(
                "click",
                function() {

                    saveEdit(id, input.value);

                }
            );

            
            const cancelButton =
                document.createElement("button");

            cancelButton.className =
                "cancel-btn";

            cancelButton.textContent = "Cancel";

            cancelButton.addEventListener(
                "click",
                function() {

                    displayTasks();

                }
            );

            buttons.appendChild(saveButton);

            buttons.appendChild(cancelButton);

            input.focus();

            input.select();
        }

    });

}

function saveEdit(id, newText) {

    newText = newText.trim();

    if (newText === "") {

        alert("Task cannot be empty.");

        return;
    }

    tasks.forEach(function(task) {

        if (task.id === id) {

            task.text = newText;

        }

    });

    saveTasks();

    displayTasks();
}


function toggleComplete(id) {

    tasks.forEach(function(task) {

        if (task.id === id) {

            task.completed =
                !task.completed;

            if (task.completed) {

                task.completedTime =
                    new Date().toLocaleString();

            } else {

                task.completedTime = null;
            }
        }

    });

    saveTasks();

    displayTasks();
}


function deleteTask(id) {

    if (!confirm("Delete this task?")) {
        return;
    }

    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });

    saveTasks();

    displayTasks();
}


function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}
