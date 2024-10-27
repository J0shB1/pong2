const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname)); // Serve static files from the root directory

const PORT = process.env.PORT || 3000;

let ball = {
    x: 300,
    y: 200,
    speedX: 4,
    speedY: 2,
    directionX: 1,
    directionY: 1,
};

let scores = {
    left: 0,
    right: 0,
};

const resetBall = () => {
    ball.x = 300;
    ball.y = 200;
    ball.directionX = ball.directionX === 1 ? -1 : 1; // Change direction
};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('movePaddle', (data) => {
        io.emit('movePaddle', data);
    });

    socket.on('score', () => {
        scores.left++;
        io.emit('score', scores);
        resetBall();
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

setInterval(() => {
    ball.x += ball.speedX * ball.directionX;
    ball.y += ball.speedY * ball.directionY;

    // Check for collision with top and bottom walls
    if (ball.y <= 0 || ball.y >= 400) {
        ball.directionY *= -1; // Bounce off top/bottom wall
    }

    // Broadcast ball position to all clients
    io.emit('updateBall', ball);
}, 1000 / 60); // 60 FPS

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});