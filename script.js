const gameArea = document.getElementById('gameArea');
const paddleLeft = document.getElementById('paddleLeft');
const paddleRight = document.getElementById('paddleRight');
const ball = document.getElementById('ball');
const scoreLeftDisplay = document.getElementById('scoreLeft');
const scoreRightDisplay = document.getElementById('scoreRight');

const socket = io(); // Connect to the server

let paddleSpeed = 30; // Paddle movement speed
let paddleLeftY = gameArea.clientHeight / 2 - paddleLeft.clientHeight / 2;
let paddleRightY = gameArea.clientHeight / 2 - paddleRight.clientHeight / 2;

function updateBall(ballData) {
    ball.style.left = ballData.x + 'px';
    ball.style.top = ballData.y + 'px';
}

function updateScore(scores) {
    scoreLeftDisplay.textContent = scores.left;
    scoreRightDisplay.textContent = scores.right;
}

function movePaddle(paddle, direction) {
    if (direction === 'up') {
        if (paddle === 'left') {
            paddleLeftY = Math.max(0, paddleLeftY - paddleSpeed);
        } else {
            paddleRightY = Math.max(0, paddleRightY - paddleSpeed);
        }
    } else if (direction === 'down') {
        if (paddle === 'left') {
            paddleLeftY = Math.min(gameArea.clientHeight - paddleLeft.clientHeight, paddleLeftY + paddleSpeed);
        } else {
            paddleRightY = Math.min(gameArea.clientHeight - paddleRight.clientHeight, paddleRightY + paddleSpeed);
        }
    }
    // Update paddle positions
    paddleLeft.style.top = paddleLeftY + 'px';
    paddleRight.style.top = paddleRightY + 'px';

    // Emit paddle movement to the server
    socket.emit('movePaddle', { paddle, y: paddle === 'left' ? paddleLeftY : paddleRightY });
}

// Key controls
document.addEventListener('keydown', (event) => {
    if (event.key === 'w') {
        movePaddle('left', 'up');
    } else if (event.key === 's') {
        movePaddle('left', 'down');
    } else if (event.key === 'ArrowUp') {
        movePaddle('right', 'up');
    } else if (event.key === 'ArrowDown') {
        movePaddle('right', 'down');
    }
});

// Listen for paddle movements from the server
socket.on('movePaddle', (data) => {
    if (data.paddle === 'left') {
        paddleLeftY = data.y;
        paddleLeft.style.top = paddleLeftY + 'px';
    } else {
        paddleRightY = data.y;
        paddleRight.style.top = paddleRightY + 'px';
    }
});

// Listen for ball updates from the server
socket.on('updateBall', updateBall);

// Listen for score updates from the server
socket.on('score', updateScore);