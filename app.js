'use strict';

// Global variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let state = {
    level: 1,
    lives: 3,
    score: 0,
    totalScore: 0,
    multiplier: 1,
    ballSpeedMod: 1,
    activePowerUp: null
};
state.multiplier = state.level * 0.1 + 1;

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
            dx: 4 * state.ballSpeedMod,
            dy: -4 * state.ballSpeedMod
        };
    };
    moveBall() {
        this.position.x += this.speed.dx;
        this.position.y += this.speed.dy;
    };
};

class PowerUp {
    constructor(posX, posY) {
        this.size = 15;
        this.position = {
            x: posX,
            y: posY
        }
        this.speed = {
            dy: 4
        }
        this.type = Math.floor((Math.random() * 7 ) + 1);
        this.fillStyle = this.type < 4 ? 'red' : 'green';
    };
    movePowerUp() {
        this.position.y += this.speed.dy;
    };
};

class Level {
    constructor() {
        this.brickRowCount = Math.floor((Math.random() * 5) + 3);
        this.brickWidth = 75;
        this.brickHeight = 25;
        this.brickPadding = 10;
        this.brickOffsetTop = 50;
        this.brickOffsetLeft = 50;
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
let paddle = new Paddle
let ball = new Ball;
let level = new Level;
let powerUp = null;

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

function drawstate() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + state.totalScore, 10, 20);
    ctx.fillText('Multiplier: ' + state.multiplier, 120, 20);
    ctx.fillText('Lives: ' + state.lives, field.size.x - 160, 20);
    ctx.fillText('Level: ' + state.level, field.size.x - 80, 20);
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

function drawPowerUp() {
    ctx.beginPath();
    ctx.arc(powerUp.position.x, powerUp.position.y, powerUp.size, 0, Math.PI * 2)
    ctx.fillStyle = powerUp.fillStyle;
    ctx.fill();
    ctx.closePath();
};

function drawAlert() {
    let text, color;
    switch(state.activePowerUp) {
        case 1: text = 'Tiny paddle!'; color = 'red'; break;
        case 2: text = 'Fast ball!', color = 'red'; break;
        case 3: text = 'Small ball!', color = 'red'; break;
        case 4: text = 'Big ball!', color = 'green'; break;
        case 5: text = 'Slow ball!', color = 'green'; break;
        case 6: text = 'Big paddle!', color = 'green'; break
        case 7: text = 'Fast paddle!', color = 'green'; break;
        default: break;
    };
    ctx.font = '16px Arial';
    ctx.fillStyle = color;
    ctx.fillText(text, (field.size.x / 2) - 50, 20)
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
        lost();
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
                    state.score += 10;
                    state.totalScore += 10 * state.multiplier;
                    if (powerUp === null && Math.floor((Math.random() * 10 ) + 1) > 8) {
                        powerUp = new PowerUp(ball.position.x, ball.position.y);
                    };
                    if (state.score === (level.brickColumnCount * level.brickRowCount * 10)) {
                        nextLevel();
                    };
            };
        };
    };
};

function powerUpCollisionHandler() {
    if (powerUp.position.y + powerUp.size + powerUp.speed.dy > field.size.y - paddle.size.y &&
        powerUp.position.x + powerUp.size > paddle.position.x &&
        powerUp.position.x - powerUp.size < paddle.position.x + paddle.size.x) {
            switch(powerUp.type) {
                case 1: paddle.size.x = 40; break;
                case 2: ball.speed.dx *= 2; ball.speed.dy *= 2; break;
                case 3: ball.size = 5; break;
                case 4: ball.size = 20; break;
                case 5: if (ball.speed.dx > 2 || ball.speed.dx < -2) { ball.speed.dx *= 0.5; ball.speed.dy *= 0.5;}; break;
                case 6: paddle.size.x = 180; break
                case 7: paddle.speed.dx = 12; break;
                default: break;
            };
            state.activePowerUp = powerUp.type;
            powerUp = null;
    } else if (powerUp.position.y + powerUp.size + powerUp.speed.dy > field.size.y) {
        powerUp = null;
    };
};

// Next level
function nextLevel() {
    state.level += 1;
    state.score = 0;
    state.multiplier = state.level * 0.1 + 1;
    state.activePowerUp = null;
    state.ballSpeedMod += 0.2;
    paddle = new Paddle;
    level = new Level;
    ball = new Ball;
    powerUp = null;
}

// Lost
function lost() {
    state.lives -= 1;
    if (state.lives === 0) {
        alert('GAME OVER');
        location.reload();
    }
    state.activePowerUp = null;
    paddle = new Paddle;
    ball = new Ball;
    powerUp = null;
}

// Game Loop
function gameLoop() {

    // Drawing
    drawField();
    drawPaddle();
    drawBall();
    drawstate();
    drawBricks();
    if (powerUp) {
        drawPowerUp();
        powerUp.movePowerUp();
        powerUpCollisionHandler();
    };
    if (state.activePowerUp) {
        drawAlert();
    };

    // Objects movement and collision detection
    wallsCollisionHandler();
    brickCollisionHandler();

    paddle.movePaddle();
    ball.moveBall();

    requestAnimationFrame(gameLoop);
};

// Run game loop!
gameLoop();
