document.addEventListener('DOMContentLoaded', function() {
   //éléments du DOM
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const clearCompletedBtn = document.getElementById('clearbtn');
    
    
    //filtre actuel
    let currentFilter = 'all';
    
    //charger les taches depuis le localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    //initialiser le site web
    renderTasks();
    updateTaskCount();
    
    //event Listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') addTask();
    });
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');;
            renderTasks();
        });
    });
    
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    //fonctions
    function addTask() {
        const taskText = taskInput.value.trim();
        if (!taskText) {
            showInputError();
            return;
        }
        
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false,
        };
        
        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();
        taskInput.value = '';
        taskInput.focus();
    }
    
    function showInputError() {
        taskInput.style.borderColor = '#ef4444';
        taskInput.style.animation = 'pulse 0.5s';
        setTimeout(() => {
            taskInput.style.borderColor = '#e2e8f0';
            taskInput.style.animation = '';
        }, 500);
    }
    
    function renderTasks() {
        taskList.innerHTML = '';
        
        const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });
        
        if (filteredTasks.length === 0) {
            const emptyMsg = currentFilter === 'all' 
                ? 'No tasks yet. Add one above!' 
                : currentFilter === 'active' 
                    ? 'No active tasks' 
                    : 'No completed tasks';
                    
            taskList.innerHTML = `
                <li class="empty">
                    <i class="fas ${currentFilter === 'all' ? 'fa-tasks' : currentFilter === 'active' ? 'fa-list-ul' : 'fa-check-circle'}"></i>
                    <p>${emptyMsg}</p>
                </li>
            `;
            return;
        }
                
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            taskItem.dataset.id = task.id;
            taskItem.innerHTML = `
                <div class="task-content">
                    <label class="checkbox-container">
                        <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <span class="task-text ${task.completed ? 'completed' : ''}">${task.text}</span>
                </div>
                <div class="task-actions">
                    <button class="edit-btn"><i class="fas fa-pencil-alt"></i></button>
                    <button class="delete-btn"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            taskList.appendChild(taskItem);
        });
        
       //ajouter des event Listeners
        document.querySelectorAll('.checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const taskId = parseInt(this.closest('.task-item').dataset.id);
                toggleTaskCompletion(taskId);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const taskId = parseInt(this.closest('.task-item').dataset.id);
                deleteTask(taskId);
            });
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', editTask);
        });
    }
    
    
    function toggleTaskCompletion(taskId) {
        tasks = tasks.map(task => 
            task.id === taskId ? {...task, completed: !task.completed} : task
        );
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
    
    function deleteTask(taskId) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    function editTask(e) {
        const taskItem = e.target.closest('.task-item'); 
        const taskId = parseInt(taskItem.dataset.id);
        const task = tasks.find(task => task.id === taskId);   //find():Renvoie le premier élémentqui satisfait une condition.
        const textSpan = taskItem.querySelector('.task-text');
        const currentText = textSpan.textContent;
        
        textSpan.innerHTML = `
            <input type="text" value="${currentText}" class="edit-input">
        `;
        
        const editInput = textSpan.querySelector('.edit-input');
        editInput.focus(); //se produit lorsqu'un élément reçoit le focus.
        
        function saveEdit() {
            const newText = editInput.value.trim();
            if (newText && newText !== currentText) {
                task.text = newText;
                saveTasks();
                renderTasks();
            } else {
                renderTasks();
            }
        }
        
        editInput.addEventListener('blur', saveEdit);
        editInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') saveEdit();
        });
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    function updateTaskCount() {
        const totalTasks = tasks.length;
        const activeTasks = tasks.filter(task => !task.completed).length;
        const completedTasks = totalTasks - activeTasks;

        taskCount.textContent = activeTasks;

        const countAll = document.getElementById('countAll');
        const countActive = document.getElementById('countActive');
        const countCompleted = document.getElementById('countCompleted');

        if (countAll && countActive && countCompleted) {
            countAll.textContent = totalTasks;
            countActive.textContent = activeTasks;
            countCompleted.textContent = completedTasks;
        }

    taskCount.classList.add('pulse');
    setTimeout(() => taskCount.classList.remove('pulse'), 1000);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});