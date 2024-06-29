(function() {
    function createDeviceInfoWindow() {
        const desktop = document.getElementById('desktop');
        const newWindow = document.createElement('div');
        setupWindowStyles(newWindow);
        newWindow.innerHTML = getWindowHTML();

        desktop.appendChild(newWindow);
        makeDraggable(newWindow);
        makeResizable(newWindow);

        function setupWindowStyles(windowElement) {
            windowElement.classList.add('window', 'dark-theme');
            windowElement.id = 'deviceInfoWindow';
            windowElement.style.width = '400px';
            windowElement.style.height = '300px';
            windowElement.style.position = 'relative';
            windowElement.style.transition = 'all 0.3s ease-in-out';
            windowElement.style.display = 'flex';
            windowElement.style.flexDirection = 'column';
        }

        function getWindowHTML() {
            const deviceInfo = getDeviceInfo();

            return `
                <div class="title-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #202020; color: #fff;">
                    <span>Device Information</span>
                    <button class="close-btn" onclick="closeWindow('deviceInfoWindow')" style="background: none; border: none; color: #fff; font-size: 18px;">✖</button>
                </div>
                <div class="content" style="flex-grow: 1; display: flex; flex-direction: column; padding: 10px; color: #ccc;">
                    <p><strong>Device Type:</strong> ${deviceInfo.deviceType}</p>
                    <p><strong>Browser:</strong> ${deviceInfo.browser}</p>
                    <p><strong>Screen Width:</strong> ${deviceInfo.screenWidth}px</p>
                    <p><strong>Screen Height:</strong> ${deviceInfo.screenHeight}px</p>
                    <p><strong>Operating System:</strong> ${deviceInfo.os}</p>
                </div>
            `;
        }

        function getDeviceInfo() {
            const ua = navigator.userAgent;
            let deviceType = 'Desktop';
            
            if (/Mobi|Android/i.test(ua)) {
                deviceType = 'Mobile';
            } else if (/Tablet|iPad/i.test(ua)) {
                deviceType = 'Tablet';
            }

            return {
                deviceType,
                browser: navigator.userAgent,
                screenWidth: window.screen.width,
                screenHeight: window.screen.height,
                os: navigator.platform
            };
        }
    }

    window.closeWindow = function(id) {
        document.getElementById(id)?.remove();
    };

    function makeResizable(element, minWidth = 300, minHeight = 100, maxWidth = 1000, maxHeight = 700) {
        element.style.resize = 'both';
        element.style.overflow = 'auto';
    }

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

    // Initialize the device info window when the script loads
    createDeviceInfoWindow();
})();

// Add this CSS to style the device info window
const style = document.createElement('style');
style.innerHTML = `
    .window {
        border: 1px solid #333;
        background-color: #121212;
        color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        border-radius: 5px;
    }
    .window .title-bar {
        background-color: #202020;
        color: #fff;
        padding: 10px;
        cursor: move;
    }

    .window .close-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
    }

    .window .content {
        padding: 10px;
    }
`;

document.head.appendChild(style);
