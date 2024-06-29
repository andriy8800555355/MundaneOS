let windowCount = 1;
let windows = [];

document.addEventListener('DOMContentLoaded', function () {
    fetch('/api/programs')
        .then(response => response.json())
        .then(programs => {
            console.log("Fetched programs:", programs); // Debugging line
            const programList = document.getElementById('program-list');
            programs.forEach(program => {
                const listItem = document.createElement('li');
                listItem.textContent = program.replace('.js', '');
                listItem.onclick = () => startProgram(program);
                programList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error fetching programs:", error); // Error handling
        });

    // Initialize the clock
    updateClock();
    setInterval(updateClock, 1000);

    // Load saved settings
    loadSettings();

    // Add event listener for right mouse button click
    document.addEventListener('contextmenu', function(event) {
        event.preventDefault(); // Prevent default context menu
        spawnContextMenu(event.clientX, event.clientY);
    });

    // Add event listener for window resize
    window.addEventListener('resize', tileWindows);
});

function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    console.log("Toggling Start Menu"); // Debugging line
    if (startMenu.style.display === 'none' || startMenu.style.display === '') {
        startMenu.style.display = 'block';
        console.log("Start Menu displayed"); // Debugging line
    } else {
        startMenu.style.display = 'none';
        console.log("Start Menu hidden"); // Debugging line
    }
}

function startProgram(program) {
    // Check if the left mouse button was clicked
    if (event.button === 0) {
        toggleStartMenu(); // Close the start menu
        const script = document.createElement('script');
        script.src = `/static/Programs/${program}`;
        script.onload = () => {
            console.log(`${program} loaded successfully.`);
        };
        script.onerror = () => {
            console.error(`Failed to load ${program}.`);
        };
        document.body.appendChild(script);

        // If the program is MusicPlayer.js or Settings.js, call its function
        if (program === 'MusicPlayer.js') {
            createMusicPlayerWindow();
        } else if (program === 'Settings.js') {
            createSettingsWindow();
        }
    }
}

function closeWindow(windowId) {
    const windowElement = document.getElementById(windowId);
    windowElement.remove();
    windows = windows.filter(w => w.id !== windowId);
    tileWindows();
}

function spawnWindow(title, content = '<p>Default content</p>') {
    windowCount++;
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    newWindow.classList.add('window');
    newWindow.id = `window${windowCount}`;
    newWindow.innerHTML = `
        <div class="title-bar">
            <span>${title}</span>
            <button class="close-btn" onclick="closeWindow('window${windowCount}')">X</button>
        </div>
        <div class="content">
            <div class="content-inner">${content}</div>
        </div>
    `;

    desktop.appendChild(newWindow);
    makeDraggable(newWindow);

    // Add scrollbar functionality
    const contentArea = newWindow.querySelector('.content');
    contentArea.style.overflowY = 'auto';
    contentArea.style.maxHeight = '300px'; // Set your desired max height

    // Add window resizing functionality
    makeResizable(newWindow);

    windows.push({ id: `window${windowCount}`, element: newWindow });
    tileWindows();
}

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, startX = 0, startY = 0;
    let isDragging = false;

    function startDrag(e) {
        e.preventDefault();
        isDragging = true;
        if (e.type === 'touchstart') {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }
        offsetX = element.offsetLeft - startX;
        offsetY = element.offsetTop - startY;
        document.addEventListener('mousemove', drag, false);
        document.addEventListener('touchmove', drag, false);
        document.addEventListener('mouseup', endDrag, false);
        document.addEventListener('touchend', endDrag, false);
    }

    function drag(e) {
        e.preventDefault();
        if (isDragging) {
            let x, y;
            if (e.type === 'touchmove') {
                const touch = e.touches[0];
                x = touch.clientX;
                y = touch.clientY;
            } else {
                x = e.clientX;
                y = e.clientY;
            }
            element.style.left = (x + offsetX) + 'px';
            element.style.top = (y + offsetY) + 'px';
        }
    }

    function endDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }

    const titleBar = element.querySelector('.title-bar');
    const closeButton = element.querySelector('.close-btn');

    titleBar.addEventListener('mousedown', startDrag, false);
    titleBar.addEventListener('touchstart', startDrag, false);
    closeButton.addEventListener('click', () => {
        const windowId = element.id;
        closeWindow(windowId);
    });
    closeButton.addEventListener('touchstart', () => {
        const windowId = element.id;
        closeWindow(windowId);
    });
}

function makeResizable(element) {
    let startX, startY, startWidth, startHeight;

    function initResize(e) {
        startX = e.clientX;
        startY = e.clientY;
        startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
        startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);
        document.addEventListener('mousemove', doResize, false);
        document.addEventListener('mouseup', stopResize, false);
    }

    function doResize(e) {
        element.style.width = (startWidth + e.clientX - startX) + 'px';
        element.style.height = (startHeight + e.clientY - startY) + 'px';
    }

    function stopResize() {
        document.removeEventListener('mousemove', doResize, false);
        document.removeEventListener('mouseup', stopResize, false);
    }

    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    resizeHandle.addEventListener('mousedown', initResize, false);
    element.appendChild(resizeHandle);
}

function tileWindows() {
    const desktop = document.getElementById('desktop');
    const desktopWidth = desktop.clientWidth;
    const desktopHeight = desktop.clientHeight;
    const windowCount = windows.length;
    const rows = Math.ceil(Math.sqrt(windowCount));
    const cols = Math.ceil(windowCount / rows);
    const windowWidth = Math.floor(desktopWidth / cols);
    const windowHeight = Math.floor(desktopHeight / rows);

    windows.forEach((win, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        win.element.style.width = `${windowWidth}px`;
        win.element.style.height = `${windowHeight}px`;
        win.element.style.left = `${col * windowWidth}px`;
        win.element.style.top = `${row * windowHeight}px`;
    });
}

function updateClock() {
    const clock = document.getElementById('clock');
    const now = new Date();
    clock.textContent = now.toLocaleTimeString();
}

// Load settings from localStorage
function loadSettings() {
    const wallpaper = localStorage.getItem('wallpaper');
    if (wallpaper) {
        document.getElementById('desktop').style.backgroundImage = `url(${wallpaper})`;
    }

    const language = localStorage.getItem('language') || 'en';
    applyLanguage(language);
}

function applyLanguage(language) {
    fetch(`/static/Languages/${language}.json`)
        .then(response => response.json())
        .then(translations => {
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                el.innerText = translations[key];
            });
        });
}

// Function to spawn the context menu
function spawnContextMenu(x, y) {
    // Remove existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    const settingsOption = document.createElement('div');
    settingsOption.textContent = 'Settings';
    settingsOption.addEventListener('click', () => {
        startProgram('Settings.js');
    });

    const widgetOption = document.createElement('div');
    widgetOption.textContent = 'Spawn Widget';
    widgetOption.addEventListener('click', () => {
        spawnWidget();
    });

    contextMenu.appendChild(settingsOption);
    contextMenu.appendChild(widgetOption);

    document.body.appendChild(contextMenu);

    // Remove context menu when clicked outside
    document.addEventListener('click', (event) => {
        if (!contextMenu.contains(event.target)) {
            contextMenu.remove();
        }
    }, { once: true });
}

// Function to spawn a widget
function spawnWidget() {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.style.left = '50px'; // Initial position
    widget.style.top = '50px'; // Initial position

    // Example widget content (Text clock)
    widget.innerHTML = `
        <div class="widget-content">
            <p id="widget-clock" class="widget-clock">Loading...</p>
        </div>
    `;

    // Make the widget draggable
    makeDraggable(widget);

    // Add event listener for right mouse button click to remove or change the widget
    widget.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        // Spawn context menu for the widget
        spawnWidgetContextMenu(event.clientX, event.clientY, widget);
    });

    document.body.appendChild(widget);
}

// Function to spawn the context menu for the widget
function spawnWidgetContextMenu(x, y, widget) {
    // Remove existing context menus
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }

    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    const removeOption = document.createElement('div');
    removeOption.textContent = 'Remove Widget';
    removeOption.addEventListener('click', () => {
        widget.remove();
    });

    // Add more options for changing the widget if needed

    contextMenu.appendChild(removeOption);

    document.body.appendChild(contextMenu);

    // Remove context menu when clicked outside
    document.addEventListener('click', (event) => {
        if (!contextMenu.contains(event.target)) {
            contextMenu.remove();
        }
    }, { once: true });
}
