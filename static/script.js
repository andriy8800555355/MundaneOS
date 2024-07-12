// Constants
const WINDOW_MIN_WIDTH = 200;
const WINDOW_MIN_HEIGHT = 150;
const CLOCK_UPDATE_INTERVAL = 1000;
const SYSTEM_INFO_UPDATE_INTERVAL = 5000;

// State
let windowCount = 1;
let windows = [];

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('contextmenu', handleContextMenu);
window.addEventListener('resize', debounce(tileWindows, 250));

// Initialization
function initializeApp() {
    fetchAndPopulatePrograms();
    initializeClock();
    loadSettings();
    initializeSystemInfo();
}

// Fetch and populate programs
async function fetchAndPopulatePrograms() {
    try {
        const response = await fetch('/api/programs');
        const programs = await response.json();
        populateProgramList(programs);
    } catch (error) {
        console.error("Error fetching programs:", error);
    }
}

function populateProgramList(programs) {
    const programList = document.getElementById('program-list');
    const fragment = document.createDocumentFragment();
    programs.forEach(program => {
        const listItem = createProgramListItem(program);
        fragment.appendChild(listItem);
    });
    programList.appendChild(fragment);
}

function createProgramListItem(program) {
    const listItem = document.createElement('li');
    listItem.textContent = program.replace('.js', '');
    listItem.onclick = () => startProgram(program);
    return listItem;
}

// Clock functionality
function initializeClock() {
    updateClock();
    setInterval(updateClock, CLOCK_UPDATE_INTERVAL);
}

function updateClock() {
    const clock = document.getElementById('clock');
    clock.textContent = new Date().toLocaleTimeString();
}

// Start Menu
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    startMenu.style.display = startMenu.style.display === 'none' ? 'block' : 'none';
}

// Program Management
function startProgram(program) {
    if (event.button === 0) {
        toggleStartMenu();
        loadProgramScript(program);
        handleSpecialPrograms(program);
    }
}

function loadProgramScript(program) {
    const script = document.createElement('script');
    script.src = `/static/Programs/${program}`;
    script.onload = () => console.log(`${program} loaded successfully.`);
    script.onerror = () => console.error(`Failed to load ${program}.`);
    document.body.appendChild(script);
}

function handleSpecialPrograms(program) {
    const specialPrograms = {
        'MusicPlayer.js': createMusicPlayerWindow,
        'Settings.js': createSettingsWindow
    };
    if (program in specialPrograms) {
        specialPrograms[program]();
    }
}

// Window Management
function spawnWindow(title, content = '<p>Default content</p>') {
    const newWindow = createWindowElement(title, content);
    document.getElementById('desktop').appendChild(newWindow);
    makeDraggable(newWindow);
    makeResizable(newWindow);
    windows.push({ id: newWindow.id, element: newWindow });
    tileWindows();
}

function createWindowElement(title, content) {
    windowCount++;
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
    return newWindow;
}

function closeWindow(windowId) {
    document.getElementById(windowId).remove();
    windows = windows.filter(w => w.id !== windowId);
    tileWindows();
}

function makeDraggable(element) {
    let isDragging = false;
    let offset = { x: 0, y: 0 };

    const titleBar = element.querySelector('.title-bar');
    titleBar.addEventListener('mousedown', startDrag);
    titleBar.addEventListener('touchstart', startDrag);

    function startDrag(e) {
        isDragging = true;
        offset = getOffset(e);
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    function drag(e) {
        if (isDragging) {
            const pos = getPosition(e);
            element.style.left = `${pos.x + offset.x}px`;
            element.style.top = `${pos.y + offset.y}px`;
        }
    }

    function endDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('touchmove', drag);
        document.removeEventListener('mouseup', endDrag);
        document.removeEventListener('touchend', endDrag);
    }

    function getOffset(e) {
        const rect = element.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: rect.left - clientX,
            y: rect.top - clientY
        };
    }

    function getPosition(e) {
        return {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
        };
    }
}

function makeResizable(element) {
    const resizeHandle = document.createElement('div');
    resizeHandle.classList.add('resize-handle');
    element.appendChild(resizeHandle);

    let isResizing = false;
    let startPos = { x: 0, y: 0 };
    let startSize = { width: 0, height: 0 };

    resizeHandle.addEventListener('mousedown', startResize);

    function startResize(e) {
        isResizing = true;
        startPos = { x: e.clientX, y: e.clientY };
        startSize = {
            width: parseInt(getComputedStyle(element).width, 10),
            height: parseInt(getComputedStyle(element).height, 10)
        };
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    }

    function resize(e) {
        if (isResizing) {
            const newWidth = Math.max(startSize.width + e.clientX - startPos.x, WINDOW_MIN_WIDTH);
            const newHeight = Math.max(startSize.height + e.clientY - startPos.y, WINDOW_MIN_HEIGHT);
            element.style.width = `${newWidth}px`;
            element.style.height = `${newHeight}px`;
        }
    }

    function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', resize);
        document.removeEventListener('mouseup', stopResize);
    }
}

function tileWindows() {
    const desktop = document.getElementById('desktop');
    const { clientWidth, clientHeight } = desktop;
    const windowCount = windows.length;
    const rows = Math.ceil(Math.sqrt(windowCount));
    const cols = Math.ceil(windowCount / rows);
    const windowWidth = Math.floor(clientWidth / cols);
    const windowHeight = Math.floor(clientHeight / rows);

    windows.forEach((win, index) => {
        const row = Math.floor(index / cols);
        const col = index % cols;
        Object.assign(win.element.style, {
            width: `${windowWidth}px`,
            height: `${windowHeight}px`,
            left: `${col * windowWidth}px`,
            top: `${row * windowHeight}px`
        });
    });
}

// Settings
function loadSettings() {
    const wallpaper = localStorage.getItem('wallpaper');
    if (wallpaper) {
        document.getElementById('desktop').style.backgroundImage = `url(${wallpaper})`;
    }

    const language = localStorage.getItem('language') || 'en';
    applyLanguage(language);
}

async function applyLanguage(language) {
    try {
        const response = await fetch(`/static/Languages/${language}.json`);
        const translations = await response.json();
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            el.innerText = translations[key] || key;
        });
    } catch (error) {
        console.error("Error loading language file:", error);
    }
}

// Context Menu
function handleContextMenu(event) {
    event.preventDefault();
    spawnContextMenu(event.clientX, event.clientY);
}

function spawnContextMenu(x, y) {
    removeExistingContextMenu();
    const contextMenu = createContextMenu(x, y);
    document.body.appendChild(contextMenu);
    addContextMenuEventListener(contextMenu);
}

function removeExistingContextMenu() {
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function createContextMenu(x, y) {
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    const menuItems = [
        { text: 'Settings', onClick: () => startProgram('Settings.js') },
        { text: 'Spawn Widget', onClick: spawnWidget }
    ];

    menuItems.forEach(item => {
        const menuItem = createContextMenuItem(item.text, item.onClick);
        contextMenu.appendChild(menuItem);
    });

    return contextMenu;
}

function createContextMenuItem(text, onClick) {
    const item = document.createElement('div');
    item.textContent = text;
    item.addEventListener('click', onClick);
    return item;
}

function addContextMenuEventListener(contextMenu) {
    document.addEventListener('click', (event) => {
        if (!contextMenu.contains(event.target)) {
            contextMenu.remove();
        }
    }, { once: true });
}

// Widget
function spawnWidget() {
    const widget = createWidgetElement();
    makeDraggable(widget);
    addWidgetContextMenu(widget);
    document.body.appendChild(widget);
    updateWidgetClock(widget);
    setInterval(() => updateWidgetClock(widget), CLOCK_UPDATE_INTERVAL);
}

function createWidgetElement() {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.style.left = '50px';
    widget.style.top = '50px';
    widget.innerHTML = `
        <div class="widget-content">
            <p id="widget-clock" class="widget-clock">Loading...</p>
        </div>
    `;
    return widget;
}

function addWidgetContextMenu(widget) {
    widget.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        spawnWidgetContextMenu(event.clientX, event.clientY, widget);
    });
}

function updateWidgetClock(widget) {
    const clockElement = widget.querySelector('#widget-clock');
    clockElement.textContent = new Date().toLocaleTimeString();
}

function spawnWidgetContextMenu(x, y, widget) {
    removeExistingContextMenu();
    const contextMenu = createWidgetContextMenu(x, y, widget);
    document.body.appendChild(contextMenu);
    addContextMenuEventListener(contextMenu);
}

function createWidgetContextMenu(x, y, widget) {
    const contextMenu = document.createElement('div');
    contextMenu.classList.add('context-menu');
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;

    const removeOption = createContextMenuItem('Remove Widget', () => widget.remove());
    contextMenu.appendChild(removeOption);

    return contextMenu;
}

// System Info
function initializeSystemInfo() {
    fetchSystemInfo();
    setInterval(fetchSystemInfo, SYSTEM_INFO_UPDATE_INTERVAL);
}

async function fetchSystemInfo() {
    try {
        const response = await fetch('/system_info');
        const data = await response.json();
        updateSystemInfoDisplay(data);
    } catch (error) {
        console.error('Error fetching system info:', error);
    }
}

function updateSystemInfoDisplay(data) {
    document.getElementById('cpu-info').textContent = `CPU: ${data.cpu_percent}%`;
    document.getElementById('memory-info').textContent = `Memory: ${data.memory_used.toFixed(2)} / ${data.memory_total.toFixed(2)} GB`;
}

// Utility functions
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}