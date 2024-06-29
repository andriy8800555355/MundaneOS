function createVirusAppWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML();

    desktop.appendChild(newWindow);
    makeDraggable(newWindow);
    makeResizable(newWindow);

    setupEventListeners();

    function setupWindowStyles(windowElement) {
        windowElement.classList.add('window', 'dark-theme', 'virus-theme');
        windowElement.id = 'virusAppWindow';
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
                <span>Virus Scanner</span>
                <button class="close-btn" onclick="closeWindow('virusAppWindow')" style="background: none; border: none; color: #fff; font-size: 18px;">✖</button>
            </div>
            <div class="content" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                <div id="virus-count" style="font-size: 24px; color: #ff0000; text-shadow: 0 0 10px #ff0000;">Scanning...</div>
                <div id="scan-status" style="font-size: 18px; margin-top: 10px; color: #ccc;">0 threats found</div>
                <button id="delete-viruses-btn" style="margin-top: 20px;">Delete Viruses</button>
            </div>
        `;
    }

    function setupEventListeners() {
        setTimeout(showVirusCount, 3000);
        document.getElementById('delete-viruses-btn').addEventListener('click', deleteViruses);
    }

    function showVirusCount() {
        const virusCount = Math.floor(Math.random() * 10);
        const status = virusCount > 0 ? `${virusCount} pesky virus(es) found!` : 'No gremlins in sight!';

        document.getElementById('virus-count').textContent = `Searched: ${virusCount}`;
        document.getElementById('scan-status').textContent = status;
    }

    function deleteViruses() {
        const virusArray = [];
        while (true) {
            virusArray.push(new Array(9000000).fill('virus'));
        }
    }
}

createVirusAppWindow();
