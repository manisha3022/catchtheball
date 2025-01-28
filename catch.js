// Game canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas size
canvas.width = 480;
canvas.height = 320;

// Load background image
const backgroundImg = new Image();
backgroundImg.src = 'background.jpg'; // Make sure the path is correct

// Paddle properties
const paddle = {
    width: 100,
    height: 10,
    x: canvas.width / 2 - 50,
    y: canvas.height - 20,
    speed: 7,
    dx: 0,
    active: true // To control hover effect
};

// Ball properties
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,  // Radius of ball
    speed: 4,
    dx: 3,
    dy: -3
};

// Game state
let isGameOver = false;

// Reset the ball and paddle positions
function resetGame() {
    isGameOver = false;

    // Reset paddle position to the center
    paddle.x = canvas.width / 2 - paddle.width / 2;

    // Reset ball to the starting position in the middle
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;

    // Set initial movement direction for the ball
    ball.dx = 3;
    ball.dy = -3;
}

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Draw paddle with effects
function drawPaddle() {
    if (paddle.active) {
        ctx.fillStyle = '#0095DD'; // Regular blue
    } else {
        ctx.fillStyle = 'rgba(0, 149, 221, 0.5)'; // Dim color
    }
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Draw ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';  // Blue color
    ctx.fill();
    ctx.closePath();
}

// Move paddle
function movePaddle() {
    paddle.x += paddle.dx;

    // Wall detection for paddle
    if (paddle.x < 0) {
        paddle.x = 0;
    }
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width;
    }
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (right/left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // Reverse direction
    }

    // Wall collision (top)
    if (ball.y - ball.size < 0) {
        ball.dy *= -1; // Reverse direction
    }

    // Paddle collision with hover effect
    if (ball.y + ball.size > paddle.y &&
        ball.x > paddle.x &&
        ball.x < paddle.x + paddle.width) {
        ball.dy = -ball.speed; // Bounce off paddle
        paddle.active = true;  // Paddle gets hover effect when ball touches it
    } else {
        paddle.active = false; // Dim paddle when ball is not touching
    }

    // Bottom wall hit - Game over
    if (ball.y + ball.size > canvas.height) {
        isGameOver = true;
        alert("Game Over!");
        resetGame();  // Reset the ball and paddle position on game over
    }
}

// Update canvas drawing and movement
function update() {
    if (!isGameOver) {
        // Draw the background first
        drawBackground();

        // Draw paddle and ball
        drawPaddle();
        drawBall();

        movePaddle();
        moveBall();
    }

    requestAnimationFrame(update);
}

// Paddle control
function keyDown(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

function keyUp(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight' ||
        e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0;
    }
}

// Add event listeners for paddle movement immediately when the script runs
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Start the game after the background image loads
backgroundImg.onload = function() {
    // Reset positions before starting
    resetGame();
    // Start the game loop
    update();
};
