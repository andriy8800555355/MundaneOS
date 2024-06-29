function createClockAppWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML();

    desktop.appendChild(newWindow);
    makeDraggable(newWindow);
    makeResizable(newWindow);

    setupEventListeners();

    function setupWindowStyles(windowElement) {
        windowElement.classList.add('window', 'dark-theme'); // Adjust themes as needed
        windowElement.id = 'clockAppWindow';
        windowElement.style.width = '300px';
        windowElement.style.height = '200px';
        windowElement.style.position = 'relative';
        windowElement.style.transition = 'all 0.3s ease-in-out';
        windowElement.style.display = 'flex';
        windowElement.style.flexDirection = 'column';
    }

    function getWindowHTML() {
        return `
            <div class="title-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #202020; color: #fff;">
                <span>Digital Clock</span>
                <button class="close-btn" onclick="closeWindow('clockAppWindow')" style="background: none; border: none; color: #fff; font-size: 18px;">✖</button>
            </div>
            <div class="content" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                <div id="digital-clock" style="font-size: 48px; color: #00ff00; text-shadow: 0 0 10px #00ff00;"></div>
                <div id="date-info" style="font-size: 18px; margin-top: 10px; color: #ccc;"></div>
            </div>
        `;
    }

    function setupEventListeners() {
        setInterval(updateClock, 1000);
    }

    function updateClock() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const year = now.getFullYear();

        document.getElementById('digital-clock').textContent = `${hours}:${minutes}:${seconds}`;
        document.getElementById('date-info').textContent = `${day}/${month}/${year}`;
    }
}

createClockAppWindow();
