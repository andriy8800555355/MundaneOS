function createMediaPlayerWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    setupWindowStyles(newWindow);
    newWindow.innerHTML = getWindowHTML();

    desktop.appendChild(newWindow);
    makeDraggable(newWindow);
    makeResizable(newWindow);

    let currentMedia = null;
    let isLooping = false;

    setupEventListeners();

    function setupWindowStyles(windowElement) {
        windowElement.classList.add('window', 'dark-theme');
        windowElement.id = 'mediaPlayerWindow';
        windowElement.style.width = '640px';
        windowElement.style.height = '480px';
        windowElement.style.position = 'relative';
        windowElement.style.transition = 'all 0.3s ease-in-out';
        windowElement.style.display = 'flex';
        windowElement.style.flexDirection = 'column';
    }

    function getWindowHTML() {
        return `
            <div class="title-bar" style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background-color: #202020; color: #fff;">
                <span>Media Player</span>
                <div>
                    <button class="fullscreen-btn" onclick="toggleFullScreen()" style="background: none; border: none; color: #fff; font-size: 18px;">⛶</button>
                    <button class="close-btn" onclick="closeWindow('mediaPlayerWindow')" style="background: none; border: none; color: #fff; font-size: 18px;">✖</button>
                </div>
            </div>
            <div class="content" style="flex-grow: 1; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
                <label for="media-upload" style="cursor: pointer; width: 100%; height: 100%; display: flex; justify-content: center; align-items: center; flex-direction: column; border: 2px dashed #555; transition: all 0.3s ease-in-out;">
                    <span style="font-size: 18px; color: #ccc;">Upload file</span>
                    <input type="file" id="media-upload" accept="audio/*,video/*" style="display: none;">
                </label>
                <video id="media-player" style="max-width: 100%; max-height: 100%; display: none; background-color: black; object-fit: contain; transition: all 0.3s ease-in-out;"></video>
                <div id="media-controls" style="display: none; flex-direction: column; width: 100%; align-items: center; margin-top: 10px; transition: all 0.3s ease-in-out;">
                    <input type="range" id="progress-bar" value="0" style="width: 100%; height: 5px; background-color: #555; cursor: pointer;">
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-top: 10px;">
                        <button id="play-pause" style="background: none; border: none; color: #fff; font-size: 18px;">⏯</button>
                        <button id="stop" style="background: none; border: none; color: #fff; font-size: 18px;">⏹</button>
                        <button id="loop" style="background: none; border: none; color: #fff; font-size: 18px;">🔁</button>
                        <input type="range" id="volume-bar" min="0" max="1" step="0.1" value="1" style="width: 100px;">
                    </div>
                </div>
            </div>
        `;
    }

    function setupEventListeners() {
        document.getElementById('media-upload').addEventListener('change', handleFileUpload);
    }

    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            playMedia(file);
        }
    }

    window.playMedia = function playMedia(file) {
        const mediaElement = document.getElementById('media-player');
        const mediaControls = document.getElementById('media-controls');
        const progressBar = document.getElementById('progress-bar');
        const playPauseButton = document.getElementById('play-pause');
        const volumeBar = document.getElementById('volume-bar');
        const stopButton = document.getElementById('stop');
        const loopButton = document.getElementById('loop');

        if (currentMedia) {
            currentMedia.pause();
            URL.revokeObjectURL(currentMedia.src);
        }

        mediaElement.src = URL.createObjectURL(file);
        mediaElement.load();
        currentMedia = mediaElement;

        mediaElement.onended = handleMediaEnd;
        mediaElement.addEventListener('loadedmetadata', handleMetadataLoaded);
        mediaElement.addEventListener('timeupdate', updateProgressBar);

        progressBar.addEventListener('input', () => {
            mediaElement.currentTime = (progressBar.value / 100) * mediaElement.duration;
        });

        playPauseButton.addEventListener('click', togglePlayPause);
        stopButton.addEventListener('click', stopMedia);
        loopButton.addEventListener('click', toggleLoop);
        volumeBar.addEventListener('input', () => {
            mediaElement.volume = volumeBar.value;
        });

        function handleMediaEnd() {
            if (!isLooping) {
                resetMediaPlayer();
            } else {
                mediaElement.currentTime = 0;
                mediaElement.play();
            }
        }

        function handleMetadataLoaded() {
            mediaElement.play();
            document.getElementById('media-upload').style.display = "none";
            mediaElement.style.display = "block";
            mediaControls.style.display = "flex";
        }

        function updateProgressBar() {
            progressBar.value = (mediaElement.currentTime / mediaElement.duration) * 100;
        }

        function togglePlayPause() {
            if (mediaElement.paused) {
                mediaElement.play();
                playPauseButton.textContent = '⏸';
            } else {
                mediaElement.pause();
                playPauseButton.textContent = '▶';
            }
        }

        function stopMedia() {
            mediaElement.pause();
            mediaElement.currentTime = 0;
            playPauseButton.textContent = '▶';
        }

        function toggleLoop() {
            isLooping = !isLooping;
            loopButton.style.color = isLooping ? '#0f0' : '#fff';
        }

        function resetMediaPlayer() {
            URL.revokeObjectURL(mediaElement.src);
            currentMedia = null;
            document.getElementById('media-upload').value = "";
            document.getElementById('media-upload').style.display = "flex";
            mediaElement.style.display = "none";
            mediaControls.style.display = "none";
        }
    };

    window.toggleFullScreen = function toggleFullScreen() {
        const mediaPlayerWindow = document.getElementById('mediaPlayerWindow');
        if (!document.fullscreenElement) {
            mediaPlayerWindow.requestFullscreen?.() || mediaPlayerWindow.webkitRequestFullscreen?.() || mediaPlayerWindow.msRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.msExitFullscreen?.();
        }
    };

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
}

createMediaPlayerWindow();
