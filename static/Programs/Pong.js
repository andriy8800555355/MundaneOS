// Constants
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;
const AI_SPEED = 4; // Speed of AI paddle

// Game state
let player1Score = 0;
let player2Score = 0;
let paddle1Y = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let paddle2Y = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
let ballX = BOARD_WIDTH / 2;
let ballY = BOARD_HEIGHT / 2;
let ballSpeedX = BALL_SPEED;
let ballSpeedY = BALL_SPEED;
let gameInterval;
let menuVisible = true;
let aiMode = false;

// Setup
function createPongGameWindow() {
    const desktop = document.getElementById('desktop');

    // Dark overlay
    const darkOverlay = document.createElement('div');
    darkOverlay.classList.add('dark-overlay');
    desktop.appendChild(darkOverlay);

    // Pong game window with main menu
    const newWindow = document.createElement('div');
    newWindow.classList.add('fullscreen-window');
    newWindow.innerHTML = `
        <div class="title-bar">
            <span>Pong Game</span>
            <button class="close-btn" onclick="closeWindow(this)">X</button>
        </div>
        <div class="content">
            <div class="menu" style="display: ${menuVisible ? 'block' : 'none'};">
                <h2>Main Menu</h2>
                <button onclick="startPvP()">PvP</button>
                <button onclick="startAI()">Play with AI</button>
                <button onclick="exitGame()">Exit</button>
            </div>
            <canvas id="game-canvas" width="${BOARD_WIDTH}" height="${BOARD_HEIGHT}" style="display: ${menuVisible ? 'none' : 'block'};"></canvas>
        </div>
    `;
    desktop.appendChild(newWindow);
}

// Start PvP mode
function startPvP() {
    clearInterval(gameInterval); // Clear any existing game interval
    menuVisible = false;
    aiMode = false;
    const canvas = document.getElementById('game-canvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    startGame(ctx);
}

// Start AI mode
function startAI() {
    clearInterval(gameInterval); // Clear any existing game interval
    menuVisible = false;
    aiMode = true;
    const canvas = document.getElementById('game-canvas');
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    startGame(ctx);
}

// Start the game
function startGame(ctx) {
    gameInterval = setInterval(() => {
        update();
        drawGame(ctx);
    }, 1000 / 60); // 60 FPS
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp);
}

// Update game state
function update() {
    movePaddles();
    moveBall();
    checkCollisions();
}

// Move paddles based on input
function movePaddles() {
    if (keysPressed.w) {
        paddle1Y -= PADDLE_SPEED;
    }
    if (keysPressed.s) {
        paddle1Y += PADDLE_SPEED;
    }

    if (aiMode) {
        // AI paddle movement
        if (paddle2Y + PADDLE_HEIGHT / 2 < ballY) {
            paddle2Y += AI_SPEED;
        } else {
            paddle2Y -= AI_SPEED;
        }
    } else {
        // Player 2 paddle movement
        if (keysPressed.ArrowUp) {
            paddle2Y -= PADDLE_SPEED;
        }
        if (keysPressed.ArrowDown) {
            paddle2Y += PADDLE_SPEED;
        }
    }

    // Ensure paddles stay within the board
    paddle1Y = Math.max(0, Math.min(paddle1Y, BOARD_HEIGHT - PADDLE_HEIGHT));
    paddle2Y = Math.max(0, Math.min(paddle2Y, BOARD_HEIGHT - PADDLE_HEIGHT));
}

// Move the ball
function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;
}

// Check for collisions with paddles and walls
function checkCollisions() {
    // Collision with top/bottom walls
    if (ballY - BALL_SIZE / 2 < 0 || ballY + BALL_SIZE / 2 > BOARD_HEIGHT) {
        ballSpeedY *= -1;
    }

    // Collision with left paddle
    if (ballX - BALL_SIZE / 2 < PADDLE_WIDTH && ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT) {
        ballSpeedX *= -1;
    }

    // Collision with right paddle
    if (ballX + BALL_SIZE / 2 > BOARD_WIDTH - PADDLE_WIDTH && ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT) {
        ballSpeedX *= -1;
    }

    // Scoring
    if (ballX - BALL_SIZE / 2 < 0) {
        player2Score++;
        resetBall();
    }
    if (ballX + BALL_SIZE / 2 > BOARD_WIDTH) {
        player1Score++;
        resetBall();
    }
}

// Reset the ball to the center
function resetBall() {
    ballX = BOARD_WIDTH / 2;
    ballY = BOARD_HEIGHT / 2;
    ballSpeedX = BALL_SPEED;
    ballSpeedY = BALL_SPEED;
}

// Draw the game
function drawGame(ctx) {
    // Clear the canvas
    ctx.clearRect(0, 0, BOARD_WIDTH, BOARD_HEIGHT);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(BOARD_WIDTH - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();

    // Draw scores
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Player 1: ' + player1Score, 100, 50);
    ctx.fillText('Player 2: ' + player2Score, BOARD_WIDTH - 150, 50);
}

// Key state
const keysPressed = {};

// Handle key presses
function handleKeyPress(event) {
    keysPressed[event.key] = true;
}

// Handle key releases
function handleKeyUp(event) {
    keysPressed[event.key] = false;
}

// Close window function
function closeWindow(button) {
    const windowElement = button.closest('.fullscreen-window');
    if (windowElement) {
        windowElement.parentNode.removeChild(windowElement);
    }
    const darkOverlay = document.querySelector('.dark-overlay');
    if (darkOverlay) {
        darkOverlay.parentNode.removeChild(darkOverlay);
    }
    clearInterval(gameInterval); // Clear game interval when closing the window
}

// Exit the game
function exitGame() {
    const windowElement = document.querySelector('.fullscreen-window');
    if (windowElement) {
        windowElement.parentNode.removeChild(windowElement);
    }
    const darkOverlay = document.querySelector('.dark-overlay');
    if (darkOverlay) {
        darkOverlay.parentNode.removeChild(darkOverlay);
    }
    clearInterval(gameInterval); // Clear game interval when exiting the game
}

// Initialize Pong game window
createPongGameWindow();
