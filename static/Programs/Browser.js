// static/Programs/Browser.js

(function() {
    // Provide default translations if the translations object is not defined
    const defaultTranslations = {
        "browser": "Browser",
        "enterUrl": "Enter URL",
        "go": "Go",
        "iframeError": "This site cannot be displayed in an iframe."
    };

    const translations = window.translations || defaultTranslations;

    // Function to create and display the browser window
    function createBrowserWindow() {
        const desktop = document.getElementById('desktop');
        const newWindow = document.createElement('div');
        newWindow.classList.add('window');
        newWindow.id = 'browserWindow';

        // Set window dimensions based on screen size
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const windowWidth = screenWidth >= 1280 ? 1280 : 640;
        const windowHeight = screenHeight >= 720 ? 720 : 480;

        newWindow.style.width = `${windowWidth}px`;
        newWindow.style.height = `${windowHeight}px`;

        newWindow.innerHTML = `
            <div class="title-bar" style="flex-shrink: 0;">
                <span>${translations["browser"]}</span>
                <button class="close-btn" onclick="closeWindow('browserWindow')">X</button>
            </div>
            <div class="content" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                <div id="browser-controls" style="display: flex; padding: 5px; flex-shrink: 0;">
                    <input type="text" id="url-input" placeholder="${translations["enterUrl"]}" style="flex: 1; padding: 5px;">
                    <button onclick="navigateToUrl()" style="padding: 5px;">${translations["go"]}</button>
                </div>
                <iframe id="browser-iframe" src="" style="flex: 1; border: none; width: 100%;"></iframe>
                <div id="error-message" style="display:none; color: red; padding: 5px; flex-shrink: 0;">${translations["iframeError"]}</div>
            </div>
        `;
        desktop.appendChild(newWindow);
        makeDraggable(newWindow);
        makeResizable(newWindow); // Make the window resizable

        const iframe = document.getElementById('browser-iframe');
        const errorMessage = document.getElementById('error-message');

        // Function to navigate to the entered URL
        window.navigateToUrl = function navigateToUrl() {
            const urlInput = document.getElementById('url-input').value;
            if (urlInput) {
                const url = urlInput.startsWith('http://') || urlInput.startsWith('https://') ? urlInput : `http://${urlInput}`;
                iframe.src = url;
                iframe.onload = function() {
                    // Hide error message on successful load
                    errorMessage.style.display = 'none';
                };
                iframe.onerror = function() {
                    // Display error message if iframe load fails
                    errorMessage.style.display = 'block';
                    iframe.src = '';
                };
            }
        };
    }

    // Initialize the browser window when the script loads
    createBrowserWindow();
})();
