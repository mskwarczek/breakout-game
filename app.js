'use strict';

// Global variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let gameState = {
    level: 1,
    score: 0
}

const field = {
    size: {
        x: canvas.width,
        y: canvas.height
    },
    fillStyle: '#ccc'
};

// Game objects prototypes
class Paddle {
    constructor() {
        this.size = {
            x: 80,
            y: 10
        };
        this.position = {
            x: (field.size.x - this.size.x) / 2,
            y: field.size.y - this.size.y
        };
        this.speed = {
            dx: 8
        };
        this.move = {
            right: false,
            left: false
        };
    };
    movePaddle() {
        if (this.move.right && (this.position.x + this.size.x) < field.size.x) {
            this.position.x += this.speed.dx;
        }
        else if (this.move.left && this.position.x > 0) {
            this.position.x -= this.speed.dx;
        };
    };
};

class Ball {
    constructor() {
        this.size = 10;
        this.position = {
            x: field.size.x / 2,
            y: field.size.y - 50
        };
        this.speed = {
            dx: 4,
            dy: -4
        };
    };
    moveBall() {
        this.position.x += this.speed.dx;
        this.position.y += this.speed.dy;
    };
};

class Level {
    constructor() {
        this.brickRowCount = 3;
        this.brickWidth = 75;
        this.brickHeight = 25;
        this.brickPadding = 10;
        this.brickOffsetTop = 30;
        this.brickOffsetLeft = 30;
        this.brickOffsetRight = 30;
        this.brickColumnCount = Math.floor((field.size.x - this.brickOffsetLeft - this.brickOffsetRight) / (this.brickWidth + this.brickPadding));
        this.bricks = [];
        this.generateBricks();
    };
    generateBricks() {
        for (let col = 0; col < this.brickColumnCount; col++) {
            this.bricks[col] = [];
            for (let row = 0; row < this.brickRowCount; row++) {
                this.bricks[col][row] = { x: 0, y: 0, strength: 1 };
            };
        };
    };
};

// Create game objects
let paddle = new Paddle;
let ball = new Ball;
let level = new Level;

// Draw  field and objects
function drawField() {
    ctx.beginPath()
    ctx.rect(0, 0, field.size.x, field.size.y);
    ctx.fillStyle = field.fillStyle;
    ctx.fill();
    ctx.closePath();
};

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.position.x, paddle.position.y, paddle.size.x, paddle.size.y);
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.size, 0, Math.PI * 2)
    ctx.fillStyle = '#000';
    ctx.fill();
    ctx.closePath();
};

function drawGameState() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Level: ' + gameState.level, field.size.x - 80, 20)
    ctx.fillText('Score: ' + gameState.score, 10, 20);
}

function drawBricks() {
    for (let col = 0; col < level.brickColumnCount; col++) {
        for (let row = 0; row < level.brickRowCount; row++) {
            if (level.bricks[col][row].strength > 0) {
                level.bricks[col][row].x = (col * (level.brickWidth + level.brickPadding) + level.brickOffsetLeft);
                level.bricks[col][row].y = (row * (level.brickHeight + level.brickPadding) + level.brickOffsetTop);
                ctx.beginPath();
                ctx.rect(level.bricks[col][row].x, level.bricks[col][row].y, level.brickWidth, level.brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            };
        };
    };
};

// Add event listeners on player's actions
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

// Player action handlers (move left, move right)
function keyDownHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        paddle.move.right = true;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        paddle.move.left = true;
    };
};

function keyUpHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        paddle.move.right = false;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        paddle.move.left = false;
    };
};

// Collisions handler
function wallsCollisionHandler() {
    if (ball.position.x + ball.speed.dx > field.size.x - ball.size || ball.position.x + ball.speed.dx < ball.size) {
        ball.speed.dx = -ball.speed.dx;
    };
    if (ball.position.y + ball.speed.dy < ball.size || (
        ball.position.y + ball.speed.dy > field.size.y - paddle.size.y - ball.size &&
        ball.position.x + ball.speed.dx > paddle.position.x &&
        ball.position.x + ball.speed.dx < paddle.position.x + paddle.size.x)) {
            ball.speed.dy = -ball.speed.dy;
    }
    else if (ball.position.y + ball.speed.dy > field.size.y) {
        location.reload();
    };
};

function brickCollisionHandler() {
    for (let col=0; col<level.brickColumnCount; col++) {
        for (let row=0; row<level.brickRowCount; row++) {
            let brick = level.bricks[col][row];
            if (brick.strength > 0 &&
                ball.position.x - ball.size + ball.speed.dx < brick.x + level.brickWidth &&
                ball.position.x + ball.size + ball.speed.dx > brick.x &&
                ball.position.y - ball.size + ball.speed.dy < brick.y + level.brickHeight &&
                ball.position.y + ball.size + ball.speed.dy > brick.y) {
                    if (ball.position.x > brick.x + level.brickWidth ||
                        ball.position.x < brick.x) {
                            ball.speed.dx = -ball.speed.dx;
                    }
                    else ball.speed.dy = -ball.speed.dy;
                    brick.strength -= 1;
                    gameState.score += 10;
            };
        };
    };
};

// Game Loop
function gameLoop() {

    // Drawing
    drawField();
    drawPaddle();
    drawBall();
    drawGameState();
    drawBricks();

    // Objects movement and collision detection
    wallsCollisionHandler();
    brickCollisionHandler();

    paddle.movePaddle();
    ball.moveBall();

    requestAnimationFrame(gameLoop);
};

// Run game loop!
gameLoop();
