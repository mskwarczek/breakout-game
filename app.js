'use strict';

// === GAME ENVIRONMENT === //

// Global variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const field = {
    size: {
        x: canvas.width,
        y: canvas.height
    },
    fillStyle: '#ccc'
}

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
    }
};

// Create game objects
let paddle = new Paddle();
let ball = new Ball();

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
    }
}

function keyUpHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        paddle.move.right = false;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        paddle.move.left = false;
    }
}

// Collisions handler
function collisionHandler() {
    if (ball.position.x + ball.speed.dx > field.size.x - ball.size || ball.position.x + ball.speed.dx < ball.size) {
        ball.speed.dx = -ball.speed.dx;
    };
    if (ball.position.y + ball.speed.dy < ball.size || (
        ball.position.y + ball.speed.dy > field.size.y - paddle.size.y - ball.size &&
        ball.position.x + ball.speed.dx > paddle.position.x &&
        ball.position.x + ball.speed.dx < paddle.position.x + paddle.size.x)
    ) {
        ball.speed.dy = -ball.speed.dy;
    }
    else if (ball.position.y + ball.speed.dy > field.size.y) {
        location.reload();
    };
}

// Game Loop
function gameLoop() {

    // Drawing
    drawField();
    drawPaddle();
    drawBall();

    // Objects movement and collision detection
    collisionHandler()
    
    paddle.movePaddle();
    ball.moveBall();

    requestAnimationFrame(gameLoop);
};

// Run game loop!
gameLoop();
