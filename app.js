// Global general variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Global game variables
let fieldSizeX = canvas.width;
let fieldSizeY = canvas.height;

let ballSize = 10;
let paddleWidth = 80;
let paddleHeight = 10;

let ballX = fieldSizeX / 2;
let ballY = fieldSizeY - 50;
let ballDeltaX = 2;
let ballDeltaY = -2;

let paddleX = (fieldSizeX - paddleWidth) / 2;
let paddleY = fieldSizeY - paddleHeight;
let paddleDeltaX = 8;

let movePaddleRight = false;
let movePaddleLeft = false;

// Event listeners
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Draw the game field
function drawField() {
    ctx.beginPath()
    ctx.rect(0, 0, fieldSizeX, fieldSizeY);
    ctx.fillStyle = '#ccc';
    ctx.fill();
    ctx.closePath();
};

// Draw the paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
};

// Draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2)
    ctx.fillStyle = '#000';
    ctx.fill()
    ctx.closePath();
};

// Player action handlers (move left, move right)
function keyDownHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        movePaddleRight = true;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left')  {
        movePaddleLeft = true;
    }
}

function keyUpHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        movePaddleRight = false;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left')  {
        movePaddleLeft = false;
    }
}

// Game Loop
function gameLoop() {

// Drawing
    drawField();
    drawPaddle();
    drawBall();

// Paddle movement
    if (movePaddleRight && (paddleX + paddleWidth) < fieldSizeX) {
        paddleX += paddleDeltaX;
    }
    else if (movePaddleLeft && paddleX > 0) {
        paddleX -= paddleDeltaX;
    }

// Bouncing from field walls and the paddle / game restart
    if (ballX + ballDeltaX > fieldSizeX - ballSize || ballX + ballDeltaX < ballSize) {
        ballDeltaX = -ballDeltaX;
    }
    if (ballY + ballDeltaY < ballSize || (
            ballY + ballDeltaY > fieldSizeY - paddleHeight - ballSize &&
            ballX + ballDeltaX > paddleX &&
            ballX + ballDeltaX < paddleX + paddleWidth)
        ) {
           ballDeltaY = -ballDeltaY;
    }
    else if (ballY + ballDeltaY > fieldSizeY) {
        location.reload();
    }

// Ball movement
    ballX += ballDeltaX;
    ballY += ballDeltaY;

    requestAnimationFrame(gameLoop);
};

// Run game loop!
gameLoop();