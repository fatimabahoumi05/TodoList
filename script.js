// JavaScript simple pour ajouter/supprimer/filter les tâches
document.addEventListener('DOMContentLoaded', function(){
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addaskbtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const filterButtons = document.querySelectorAll('.filter-btns button');
    const clearBtn = document.getElementById('clearbtn');

    let tasks = [];

    function renderTasks(filter = 'all') {
      taskList.innerHTML = '';

      const filteredTasks = tasks.filter(task => {
        if (filter === 'active') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
      });

      if (filteredTasks.length === 0) {
        taskList.innerHTML = '<li class="empty">No tasks here!</li>';
      } else {
        filteredTasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.textContent = task.text;
          li.className = task.completed ? 'completed' : '';
          li.addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            updateTaskCount();
            renderTasks(currentFilter);
          });
          taskList.appendChild(li);
        });
      }
    }

    function updateTaskCount() {
      const count = tasks.filter(task => !task.completed).length;
      taskCount.textContent = count;
    }

    function addTask() {
      const text = taskInput.value.trim();
      if (text === '') return;

      tasks.push({ text, completed: false });
      taskInput.value = '';
      updateTaskCount();
      renderTasks(currentFilter);
    }

    addBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addTask();
    });

    let currentFilter = 'all';

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderTasks(currentFilter);
      });
    });

    clearBtn.addEventListener('click', () => {
      tasks = tasks.filter(task => !task.completed);
      updateTaskCount();
      renderTasks(currentFilter);
    });

    // Initial render
    renderTasks();
    updateTaskCount();

});