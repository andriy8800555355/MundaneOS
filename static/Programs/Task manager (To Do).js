function createTaskManagerWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML();
    desktop.appendChild(newWindow);

    makeDraggable(newWindow);
    makeResizable(newWindow);

    const taskInput = newWindow.querySelector('#task-input');
    const addButton = newWindow.querySelector('#add-task-btn');
    const taskList = newWindow.querySelector('#task-list');

    taskInput.addEventListener('keypress', handleKeyPress);
    addButton.addEventListener('click', addTask);
    addButton.addEventListener('touchend', addTask);

    loadTasks();

    function setupWindowStyles(windowElement) {
        Object.assign(windowElement.style, {
            width: '400px',
            height: '500px',
            position: 'absolute',
            top: '50px',
            left: '50px',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease-in-out',
            resize: 'both',
            overflow: 'auto',
            backgroundColor: '#2b2b2b',
            borderRadius: '15px',
            boxShadow: '10px 10px 30px #1a1a1a, -10px -10px 30px #3c3c3c'
        });
        windowElement.classList.add('window', 'dark-theme');
        windowElement.id = 'taskManagerWindow';
    }

    function getWindowHTML() {
        return `
            <div class="title-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #202020; color: #fff; border-radius: 15px 15px 0 0;">
                <span>Task Manager</span>
                <button class="close-btn" style="background: none; border: none; color: #fff; font-size: 18px;">✖</button>
            </div>
            <div class="content" style="flex-grow: 1; padding: 10px; display: flex; flex-direction: column;">
                <div style="margin-bottom: 10px; display: flex; gap: 10px;">
                    <input type="text" id="task-input" placeholder="New task" style="flex: 1; padding: 10px; border: none; border-radius: 10px; box-shadow: inset 5px 5px 10px #1a1a1a, inset -5px -5px 10px #3c3c3c; background-color: #2b2b2b; color: #fff;">
                    <button id="add-task-btn" style="padding: 10px 20px; border: none; border-radius: 10px; box-shadow: 5px 5px 10px #1a1a1a, -5px -5px 10px #3c3c3c; background-color: #2b2b2b; color: #fff;">Add</button>
                </div>
                <div id="task-list" style="flex-grow: 1; overflow-y: auto;"></div>
            </div>
        `;
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText === '') return;

        const taskItem = createTaskElement(taskText);
        taskList.appendChild(taskItem);
        taskInput.value = '';

        saveTasks();
    }

    function createTaskElement(taskText) {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        taskItem.innerHTML = `
            <span>${taskText}</span>
            <div style="display: flex; gap: 5px;">
                <button class="complete-btn" style="background: none; border: none; color: #4CAF50; font-size: 18px;">✓</button>
                <button class="remove-btn" style="background: none; border: none; color: #F44336; font-size: 18px;">✖</button>
            </div>
        `;

        taskItem.querySelector('.complete-btn').addEventListener('click', () => toggleTaskCompletion(taskItem));
        taskItem.querySelector('.complete-btn').addEventListener('touchend', () => toggleTaskCompletion(taskItem));
        taskItem.querySelector('.remove-btn').addEventListener('click', () => removeTask(taskItem));
        taskItem.querySelector('.remove-btn').addEventListener('touchend', () => removeTask(taskItem));

        return taskItem;
    }

    function toggleTaskCompletion(taskItem) {
        taskItem.classList.toggle('completed');
        saveTasks();
    }

    function removeTask(taskItem) {
        taskItem.style.transition = 'opacity 0.5s';
        taskItem.style.opacity = '0';
        setTimeout(() => {
            taskItem.remove();
            saveTasks();
        }, 500);
    }

    function closeWindow() {
        newWindow.remove();
    }

    newWindow.querySelector('.close-btn').addEventListener('click', closeWindow);
    newWindow.querySelector('.close-btn').addEventListener('touchend', closeWindow);

    function makeDraggable(element) {
        let isDragging = false;
        let touchStartPos = { x: 0, y: 0 };
        let offset = { x: 0, y: 0 };
        const titleBar = element.querySelector('.title-bar');

        titleBar.addEventListener('mousedown', onMouseDown);
        titleBar.addEventListener('touchstart', onTouchStart);

        document.addEventListener('mouseup', onMouseUp);
        document.addEventListener('touchend', onTouchEnd);

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('touchmove', onTouchMove);

        function onMouseDown(e) {
            isDragging = true;
            offset = {
                x: element.offsetLeft - e.clientX,
                y: element.offsetTop - e.clientY
            };
        }

        function onMouseMove(e) {
            if (isDragging) {
                element.style.left = `${e.clientX + offset.x}px`;
                element.style.top = `${e.clientY + offset.y}px`;
            }
        }

        function onMouseUp() {
            isDragging = false;
        }

        function onTouchStart(e) {
            const touch = e.touches[0];
            touchStartPos = { x: touch.clientX, y: touch.clientY };
            offset = {
                x: element.offsetLeft - touchStartPos.x,
                y: element.offsetTop - touchStartPos.y
            };
        }

        function onTouchMove(e) {
            if (isDragging) {
                const touch = e.touches[0];
                element.style.left = `${touch.clientX + offset.x}px`;
                element.style.top = `${touch.clientY + offset.y}px`;
            }
        }

        function onTouchEnd() {
            isDragging = false;
        }
    }

    function makeResizable(element) {
        element.style.resize = 'both';
        element.style.overflow = 'auto';
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task').forEach(taskItem => {
            tasks.push({
                text: taskItem.querySelector('span').textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text);
            if (task.completed) {
                taskItem.classList.add('completed');
            }
            taskList.appendChild(taskItem);
        });
    }

    // Adding CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
        #taskManagerWindow .title-bar span,
        #taskManagerWindow .task span,
        #taskManagerWindow .task button,
        #taskManagerWindow .close-btn {
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            color: #fff;
        }
        #taskManagerWindow .task {
            transition: background-color 0.3s, text-decoration 0.3s, opacity 0.5s;
        }
        #taskManagerWindow .task.completed {
            background-color: #444;
            text-decoration: line-through;
        }
        #taskManagerWindow #task-input, #taskManagerWindow button {
            font-family: 'Arial', sans-serif;
        }
    `;
    document.head.appendChild(style);
}

createTaskManagerWindow();
