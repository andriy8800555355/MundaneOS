(function() {
    // Function to create and display the calculator window
    function createCalculatorWindow() {
        const desktop = document.getElementById('desktop');
        const newWindow = document.createElement('div');
        newWindow.classList.add('window');
        newWindow.id = 'calculatorWindow';

        // Set initial window dimensions
        newWindow.style.width = '400px';
        newWindow.style.height = '500px';

        // Calculator HTML structure
        newWindow.innerHTML = `
            <div class="title-bar" style="flex-shrink: 0;">
                <span>Calculator</span>
                <button class="close-btn" onclick="closeWindow('calculatorWindow')">X</button>
            </div>
            <div class="content" style="display: flex; flex-direction: column; height: 100%; overflow: hidden;">
                <input type="text" id="calc-display" style="flex-shrink: 0; padding: 10px; font-size: 24px;" readonly>
                <div id="calc-buttons" style="display: grid; grid-template-columns: repeat(4, 1fr); grid-gap: 5px; padding: 5px;">
                    ${['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', '=', '+'].map(btn => `
                        <button class="calc-btn" onclick="pressButton('${btn}')">${btn}</button>
                    `).join('')}
                </div>
            </div>
        `;

        desktop.appendChild(newWindow);
        makeDraggable(newWindow); // Make the window draggable
        makeResizable(newWindow, 300, 100, 1000, 700); // Make the window resizable with constraints

        // Calculator logic
        const display = document.getElementById('calc-display');
        let currentInput = '';

        window.pressButton = function(btn) {
            if (btn === '=') {
                try {
                    currentInput = eval(currentInput).toString();
                    // Easter egg: if the result is 19, show 21 instead
                    if (currentInput === '19') {
                        currentInput = '21';
                    }
                } catch (e) {
                    currentInput = 'Error';
                }
            } else if (btn === 'C') {
                currentInput = '';
            } else {
                currentInput += btn;
            }
            display.value = currentInput;
        };

        // Function to close the window
        window.closeWindow = function(id) {
            const win = document.getElementById(id);
            if (win) {
                win.remove();
            }
        };

        // Function to make the window resizable with constraints
        function makeResizable(element, minWidth, minHeight, maxWidth, maxHeight) {
            element.style.resize = 'both';
            element.style.overflow = 'auto';

            element.addEventListener('resize', function() {
                const width = parseInt(element.style.width);
                const height = parseInt(element.style.height);

                if (width < minWidth) element.style.width = `${minWidth}px`;
                if (width > maxWidth) element.style.width = `${maxWidth}px`;
                if (height < minHeight) element.style.height = `${minHeight}px`;
                if (height > maxHeight) element.style.height = `${maxHeight}px`;
            });
        }

        // Function to make the window draggable
        function makeDraggable(element) {
            let isMouseDown = false;
            let offset = [0, 0];

            element.addEventListener('mousedown', function(e) {
                if (e.target.classList.contains('title-bar')) {
                    isMouseDown = true;
                    offset = [
                        element.offsetLeft - e.clientX,
                        element.offsetTop - e.clientY
                    ];
                }
            });

            document.addEventListener('mouseup', function() {
                isMouseDown = false;
            });

            document.addEventListener('mousemove', function(event) {
                event.preventDefault();
                if (isMouseDown) {
                    element.style.left = (event.clientX + offset[0]) + 'px';
                    element.style.top = (event.clientY + offset[1]) + 'px';
                }
            });
        }
    }

    // Initialize the calculator window when the script loads
    createCalculatorWindow();
})();

// Add this CSS to style the calculator buttons
const style = document.createElement('style');
style.innerHTML = `
    .calc-btn {
        padding: 17px 40px;
        border-radius: 10px;
        border: 0;
        background-color: rgb(255, 56, 86);
        letter-spacing: 1.5px;
        font-size: 15px;
        transition: all 0.3s ease;
        box-shadow: rgb(201, 46, 70) 0px 10px 0px 0px;
        color: hsl(0, 0%, 100%);
        cursor: pointer;
    }

    .calc-btn:hover {
        box-shadow: rgb(201, 46, 70) 0px 7px 0px 0px;
    }

    .calc-btn:active {
        background-color: rgb(255, 56, 86);
        box-shadow: rgb(201, 46, 70) 0px 0px 0px 0px;
        transform: translateY(5px);
        transition: 200ms;
    }
`;
document.head.appendChild(style);
