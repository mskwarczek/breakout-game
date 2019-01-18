import { CTX, FIELD_X, FIELD_Y, CONFIG, PALETTE } from './Global';
import Field from './class/Field';
import Paddle from './class/Paddle';
import Ball from './class/Ball';
import Wall from './class/Wall';
import Bonus from './class/Bonus';

let state = {
    field: new Field(PALETTE.baseFieldFillStyle),
    wall: new Wall,
    paddle: new Paddle(CONFIG.basePaddleWidth, CONFIG.basePaddleSpeed, PALETTE.basePaddleFillStyle),
    balls: [new Ball(CONFIG.baseBallSize, CONFIG.baseBallSpeed, CONFIG.baseBallPower, PALETTE.baseBallFillStyle)],
    bonus: [],
    level: CONFIG.baseLevel,
    lives: CONFIG.baseLives,
    score: CONFIG.baseScore,
    multiplier: CONFIG.baseMultiplier,
    levelBallSpeed: CONFIG.baseBallSpeed,
    levelMultiplier: CONFIG.baseMultiplier,
    alertText: '',
    alertColor: PALETTE.baseAlertFillStyle,
    draw() {
        CTX.font = '16px Arial';
        CTX.fillStyle = PALETTE.baseTextFillStyle;
        CTX.fillText('Score: ' + state.score, 10, 20);
        CTX.fillText('Multiplier: ' + state.multiplier, 140, 20);
        CTX.fillText('Lives: ' + state.lives, FIELD_X - 160, 20);
        CTX.fillText('Level: ' + state.level, FIELD_X - 80, 20);
        CTX.fillStyle = state.alertColor;
        CTX.fillText(state.alertText, (FIELD_X / 2) - 40, 20)
    },
};
console.log(state);

function addListeners() {
    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);
};
addListeners();

function keyDownHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        state.paddle.isMoving.right = true;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        state.paddle.isMoving.left = true;
    };
};

function keyUpHandler(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        state.paddle.isMoving.right = false;
    }
    else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        state.paddle.isMoving.left = false;
    };
};

function applyBonus(type) {
    switch(type) {
        case 1:
            state.balls.forEach(ball => {
                ball.speed.dx = ball.speed.dx > 0
                    ? state.levelBallSpeed + 2
                    : -state.levelBallSpeed - 2;
                ball.speed.dy = ball.speed.dy > 0
                    ? state.levelBallSpeed + 2
                    : -state.levelBallSpeed - 2;
                ball.fillStyle = "aqua";
            });
            state.alertText = 'Fast balls!';
            state.alertColor = PALETTE.negativeAlertFillStyle;
            break;
        case 2:
            state.paddle.size.x = CONFIG.basePaddleWidth / 2;
            state.alertText = 'Tiny paddle!';
            state.alertColor = PALETTE.negativeAlertFillStyle;
            break;
        case 3:
            state.balls.forEach(ball => ball.power = CONFIG.baseBallPower / 2);
            state.alertText = 'Weak balls!';
            state.alertColor = PALETTE.negativeAlertFillStyle;
            break;
        case 4:
            state.balls.forEach(ball => ball.size = CONFIG.baseBallSize / 2);
            state.alertText = 'Small balls!';
            state.alertColor = PALETTE.negativeAlertFillStyle;
            break;
        case 5:
            state.balls.forEach(ball => ball.size = CONFIG.baseBallSize * 2);
            state.alertText = 'Big balls!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        case 6:
            state.paddle.size.x = CONFIG.basePaddleWidth * 1.5;
            state.alertText = 'Big paddle!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        case 7:
            state.balls.forEach(ball => {
                ball.speed.dx = ball.speed.dx > 0
                    ? state.levelBallSpeed - 1.5
                    : -state.levelBallSpeed + 1.5;
                ball.speed.dy = ball.speed.dy > 0
                    ? state.levelBallSpeed - 1.5
                    : -state.levelBallSpeed + 1.5;
                ball.fillStyle = "darkblue";
            });
            state.alertText = 'Slow balls!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        case 8:
            state.balls.forEach(ball => {
                ball.power = CONFIG.baseBallPower * 10;
                ball.fillStyle = "red";
            });
            state.alertText = 'Powerfull balls!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        case 9:
            state.balls.push(new Ball(CONFIG.baseBallSize, state.levelBallSpeed, CONFIG.baseBallPower, PALETTE.baseBallFillStyle, state.balls[0].position.x));
            state.balls.push(new Ball(CONFIG.baseBallSize, state.levelBallSpeed, CONFIG.baseBallPower, PALETTE.baseBallFillStyle, state.paddle.position.x));
            state.alertText = 'Multiple balls!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        case 10: {
            state.multiplier = state.levelMultiplier * 10;
            state.alertText = 'Multiplier x 10!';
            state.alertColor = PALETTE.positiveAlertFillStyle;
            break;
        }
        default: console.error('Unknown bonus type in function applyBonus');
    };
};

function play() {
    CTX.clearRect(0, 0, FIELD_X, FIELD_Y);

    state.field.draw();

    state.draw();

    state.wall.draw();

    state.paddle.draw();
    state.paddle.move();

    state.balls.forEach((ball, index) => {
        ball.draw();
        ball.move();
        ball.collision(state.paddle);
        state.wall.lines.forEach((line,) => {
            line.bricks.forEach((brick) => {
                if (ball.collision(brick) === 'hit') {
                    state.score += brick.value * state.multiplier;
                    if (Math.floor(Math.random() * 10) < CONFIG.bonusDropRate) {
                        state.bonus.push(new Bonus(ball.position.x, ball.position.y));
                    };
                };
            });
        });
        if (ball.collision(state.field) === 'lost') {
            state.balls.splice(index, 1);
        };
    });

    state.bonus.forEach((bonus, index) => {
        bonus.draw();
        bonus.move();
        if (bonus.capture(state.paddle) === 'captured') {
            applyBonus(bonus.type);
            state.bonus.splice(index, 1);
        } else if (bonus.capture(state.paddle) === 'lost') {
            state.bonus.splice(index, 1);
        };
    });

    state.wall.lines.forEach(line => line.calculateStrength());
    if (state.wall.calculateStrength() === 0) {
        state.levelBallSpeed = CONFIG.baseBallSpeed + (state.level * CONFIG.ballSpeedIncrease);
        state.levelMultiplier = CONFIG.baseMultiplier + (state.level * CONFIG.multiplierIncrease)
        state.paddle = new Paddle(CONFIG.basePaddleWidth, CONFIG.basePaddleSpeed, PALETTE.basePaddleFillStyle);
        state.balls = [new Ball(CONFIG.baseBallSize, state.levelBallSpeed, CONFIG.baseBallPower, PALETTE.baseBallFillStyle)];
        state.wall = new Wall,
        state.score += state.level * 1000;
        state.level += 1;
        state.multiplier = state.levelMultiplier;
        state.alertText = 'Next level!';
        state.alertColor = PALETTE.baseAlertFillStyle;
        console.log(state);
    };

    if (state.balls.length === 0) {
        state.paddle = new Paddle(CONFIG.basePaddleWidth, CONFIG.basePaddleSpeed, PALETTE.basePaddleFillStyle);
        state.balls = [new Ball(CONFIG.baseBallSize, state.levelBallSpeed, CONFIG.baseBallPower, PALETTE.baseBallFillStyle)];
        state.multiplier = state.levelMultiplier;
        state.lives -= 1;
        state.alertText = 'Ball lost.';
        state.alertColor = PALETTE.baseAlertFillStyle;
        if (state.lives === 0) {
            alert('GAME OVER');
            console.log(state);
            location.reload();
        };
    };

    requestAnimationFrame(play);
};

play();
