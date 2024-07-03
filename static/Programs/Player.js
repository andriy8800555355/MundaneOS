// Modern Hyprland-style Media Player

function createMediaPlayerWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML();

    desktop.appendChild(newWindow);
    makeDraggable(newWindow);

    let currentMedia = null;
    let isLooping = false;

    setupEventListeners();

    function setupWindowStyles(windowElement) {
        windowElement.classList.add('window', 'hyprland-theme');
        windowElement.id = 'mediaPlayerWindow';
        windowElement.style.width = '640px';
        windowElement.style.height = '480px';
        windowElement.style.position = 'absolute';
        windowElement.style.top = '50%';
        windowElement.style.left = '50%';
        windowElement.style.transform = 'translate(-50%, -50%)';
        windowElement.style.transition = 'all 0.3s ease-in-out';
        windowElement.style.display = 'flex';
        windowElement.style.flexDirection = 'column';
        windowElement.style.backgroundColor = 'rgba(30, 30, 30, 0.7)';
        windowElement.style.backdropFilter = 'blur(10px)';
        windowElement.style.borderRadius = '15px';
        windowElement.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
        windowElement.style.overflow = 'hidden';
    }

    function getWindowHTML() {
        return `
            <div class="title-bar">
                <span>Media Player</span>
                <div class="window-controls">
                    <button class="control-btn fullscreen-btn" onclick="toggleFullScreen()">⛶</button>
                    <button class="control-btn close-btn" onclick="closeWindow('mediaPlayerWindow')">✖</button>
                </div>
            </div>
            <div class="content">
                <label for="media-upload" class="upload-area">
                    <span>Drop file or click to upload</span>
                    <input type="file" id="media-upload" accept="audio/*,video/*">
                </label>
                <video id="media-player"></video>
                <div id="media-controls">
                    <input type="range" id="progress-bar" value="0">
                    <div class="control-buttons">
                        <button id="play-pause" class="control-btn">⏯</button>
                        <button id="stop" class="control-btn">⏹</button>
                        <button id="loop" class="control-btn">🔁</button>
                        <input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1">
                    </div>
                </div>
            </div>
        `;
    }

    function setupEventListeners() {
        document.getElementById('media-upload').addEventListener('change', handleFileUpload);
        setupMediaControls();
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            playMedia(file);
        }
    }

    function setupMediaControls() {
        const mediaElement = document.getElementById('media-player');
        const progressBar = document.getElementById('progress-bar');
        const playPauseButton = document.getElementById('play-pause');
        const volumeBar = document.getElementById('volume-bar');
        const stopButton = document.getElementById('stop');
        const loopButton = document.getElementById('loop');

        mediaElement.addEventListener('loadedmetadata', () => {
            progressBar.max = mediaElement.duration;
        });

        mediaElement.addEventListener('timeupdate', () => {
            progressBar.value = mediaElement.currentTime;
        });

        progressBar.addEventListener('input', () => {
            mediaElement.currentTime = progressBar.value;
        });

        playPauseButton.addEventListener('click', togglePlayPause);
        stopButton.addEventListener('click', stopMedia);
        loopButton.addEventListener('click', toggleLoop);
        volumeBar.addEventListener('input', () => {
            mediaElement.volume = volumeBar.value;
        });
    }

    function playMedia(file) {
        const mediaElement = document.getElementById('media-player');
        const mediaControls = document.getElementById('media-controls');
        const uploadArea = document.querySelector('.upload-area');

        if (currentMedia) {
            URL.revokeObjectURL(currentMedia);
        }

        currentMedia = URL.createObjectURL(file);
        mediaElement.src = currentMedia;
        mediaElement.load();

        uploadArea.style.display = 'none';
        mediaElement.style.display = 'block';
        mediaControls.style.display = 'flex';

        mediaElement.play();
    }

    function togglePlayPause() {
        const mediaElement = document.getElementById('media-player');
        const playPauseButton = document.getElementById('play-pause');

        if (mediaElement.paused) {
            mediaElement.play();
            playPauseButton.textContent = '⏸';
        } else {
            mediaElement.pause();
            playPauseButton.textContent = '▶';
        }
    }

    function stopMedia() {
        const mediaElement = document.getElementById('media-player');
        const playPauseButton = document.getElementById('play-pause');

        mediaElement.pause();
        mediaElement.currentTime = 0;
        playPauseButton.textContent = '▶';
    }

    function toggleLoop() {
        const loopButton = document.getElementById('loop');
        isLooping = !isLooping;
        loopButton.classList.toggle('active', isLooping);
        document.getElementById('media-player').loop = isLooping;
    }

    function makeDraggable(element) {
        let isDragging = false;
        let startX, startY, initialX, initialY;

        element.querySelector('.title-bar').addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);

        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            initialX = element.offsetLeft;
            initialY = element.offsetTop;
        }

        function drag(e) {
            if (isDragging) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                element.style.left = `${initialX + dx}px`;
                element.style.top = `${initialY + dy}px`;
            }
        }

        function stopDrag() {
            isDragging = false;
        }
    }
}

window.toggleFullScreen = function() {
    const mediaPlayerWindow = document.getElementById('mediaPlayerWindow');
    if (!document.fullscreenElement) {
        mediaPlayerWindow.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
};

window.closeWindow = function(id) {
    document.getElementById(id)?.remove();
};

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
    .hyprland-theme {
        font-family: 'Inter', sans-serif;
    }

    .hyprland-theme .title-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 15px;
        background-color: rgba(40, 40, 40, 0.7);
        color: #fff;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .hyprland-theme .content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
    }

    .hyprland-theme .upload-area {
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px dashed rgba(255, 255, 255, 0.3);
        border-radius: 10px;
        transition: all 0.3s ease-in-out;
    }

    .hyprland-theme .upload-area:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .hyprland-theme #media-player {
        max-width: 100%;
        max-height: calc(100% - 60px);
        display: none;
        background-color: black;
        object-fit: contain;
        border-radius: 10px;
    }

    .hyprland-theme #media-controls {
        display: none;
        flex-direction: column;
        width: 100%;
        align-items: center;
        margin-top: 15px;
    }

    .hyprland-theme #progress-bar {
        width: 100%;
        height: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 2.5px;
        cursor: pointer;
        appearance: none;
        outline: none;
    }

    .hyprland-theme #progress-bar::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background-color: #fff;
        border-radius: 50%;
        cursor: pointer;
    }

    .hyprland-theme .control-buttons {
        display: flex;
        justify-content: space-between;
        width: 100%;
        margin-top: 10px;
    }

    .hyprland-theme .control-btn {
        background: none;
        border: none;
        color: #fff;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .hyprland-theme .control-btn:hover {
        transform: scale(1.1);
    }

    .hyprland-theme .control-btn.active {
        color: #00ff00;
    }

    .hyprland-theme #volume-bar {
        width: 100px;
        height: 5px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 2.5px;
        cursor: pointer;
        appearance: none;
        outline: none;
    }

    .hyprland-theme #volume-bar::-webkit-slider-thumb {
        appearance: none;
        width: 12px;
        height: 12px;
        background-color: #fff;
        border-radius: 50%;
        cursor: pointer;
    }
`;
document.head.appendChild(style);

createMediaPlayerWindow();