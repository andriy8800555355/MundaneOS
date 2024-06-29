// static/Programs/Settings.js

function createSettingsWindow() {
    const desktop = document.getElementById('desktop');
    const newWindow = document.createElement('div');
    newWindow.classList.add('window');
    newWindow.id = `settingsWindow`;
    newWindow.innerHTML = `
        <div class="title-bar">
            <span data-translate="settings">Settings</span>
            <button class="close-btn" onclick="closeWindow('settingsWindow')">X</button>
        </div>
        <div class="content">
            <h2 data-translate="changeWallpaper">Change Wallpaper</h2>
            <input type="file" id="wallpaper-upload" accept="image/*">
            <h2 data-translate="selectLanguage">Select Language</h2>
            <select id="language-select">
                <option value="en">English</option>
                <option value="ua">Українська</option>
                <option value="pl">Polski</option>
                <option value="es">Español</option>
            </select>
            <button onclick="saveSettings()" data-translate="saveSettings">Save Settings</button>
        </div>
    `;
    desktop.appendChild(newWindow);
    makeDraggable(newWindow);

    // Load current settings
    loadSettings();

    document.getElementById('wallpaper-upload').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            changeWallpaper(file);
        }
    });

    document.getElementById('language-select').addEventListener('change', function (event) {
        changeLanguage(event.target.value);
    });
}

function changeWallpaper(file) {
    const reader = new FileReader();
    reader.onload = function (event) {
        const wallpaper = event.target.result;
        document.getElementById('desktop').style.backgroundImage = `url(${wallpaper})`;
        localStorage.setItem('wallpaper', wallpaper);
    };
    reader.readAsDataURL(file);
}

function changeLanguage(language) {
    localStorage.setItem('language', language);
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

function loadSettings() {
    const wallpaper = localStorage.getItem('wallpaper');
    if (wallpaper) {
        document.getElementById('desktop').style.backgroundImage = `url(${wallpaper})`;
    }

    const language = localStorage.getItem('language') || 'en';
    document.getElementById('language-select').value = language;
    applyLanguage(language);
}

createSettingsWindow();
