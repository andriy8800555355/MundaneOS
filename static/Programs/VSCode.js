// Function to create a new custom window
function createCustomWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    const windowId = 'customWindow' + Math.floor(Math.random() * 10000); // Generate a unique ID for the window

    // Setup initial styles and structure for the new window
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML(windowId);

    // Append the new window to the desktop container
    desktop.appendChild(newWindow);

    // Make the new window draggable and resizable
    makeDraggable(newWindow);
    makeResizable(newWindow);

    // Function to setup initial styles for the window
    function setupWindowStyles(windowElement) {
        windowElement.classList.add('window');
        windowElement.id = windowId; // Set the ID of the window
        windowElement.style.width = '1280px';
        windowElement.style.height = '720px';
        windowElement.style.position = 'absolute';
        windowElement.style.border = '1px solid #333';
        windowElement.style.backgroundColor = '#121212';
        windowElement.style.color = '#fff';
        windowElement.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        windowElement.style.borderRadius = '5px';
    }

    // Function to return the HTML structure of the window
    function getWindowHTML(id) {
        // Get the current location and append '/radio'
        const referrer = `${window.location.origin}${window.location.pathname.replace(/\/?$/, '/vscode')}`;

        return `
            <div class="title-bar" style="background-color: #202020; color: #fff; padding: 10px; cursor: move; display: flex; justify-content: space-between; align-items: center;">
                <span>Site IDLE</span>
                <button class="close-btn" style="background: none; border: none; color: #fff; font-size: 18px; cursor: pointer;" onclick="closeWindow('${id}')">✖</button>
            </div>
            <div class="content" style="padding: 10px; height: calc(100% - 50px);">
                <iframe src="${referrer}" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        `;
    }

    // Function to make the window draggable
    function makeDraggable(element) {
        let isMouseDown = false;
        let offset = [0, 0];

        element.addEventListener('mousedown', startDrag);
        element.addEventListener('touchstart', startDrag, { passive: true });

        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchend', stopDrag, { passive: true });

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('touchmove', doDrag, { passive: false });

        function startDrag(e) {
            if (e.target.classList.contains('title-bar')) {
                isMouseDown = true;
                const event = e.touches ? e.touches[0] : e;
                offset = [element.offsetLeft - event.clientX, element.offsetTop - event.clientY];
            }
        }

        function stopDrag() {
            isMouseDown = false;
        }

        function doDrag(e) {
            if (isMouseDown) {
                e.preventDefault();
                const event = e.touches ? e.touches[0] : e;
                element.style.left = `${event.clientX + offset[0]}px`;
                element.style.top = `${event.clientY + offset[1]}px`;
            }
        }
    }

    // Function to make the window resizable
    function makeResizable(element) {
        element.style.resize = 'both';
        element.style.overflow = 'auto';
    }
}

// Function to close the window
function closeWindow(id) {
    document.getElementById(id)?.remove();
}

// Example usage: create a new window when the script runs
createCustomWindow();
