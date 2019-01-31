import { CTX, FIELD_X, FIELD_Y }  from '../Global';

export default class Ball {
    constructor(size, speed, power, color, positionX) {
        this.shape = 'circle';
        this.position = {
            x: positionX || FIELD_X / 2,
            y: FIELD_Y - 20
        };
        this.size = size;
        this.speed = {
            dx: speed,
            dy: -speed
        };
        this.power = power;
        this.fillStyle = color;
    };
    move() {
        this.position.x += this.speed.dx;
        this.position.y += this.speed.dy;
    };
    collision(obstacle) {
        switch(obstacle.shape) {
            case 'rectangle':
                if (
                    ((obstacle.strength && obstacle.strength > 0) || obstacle.strength == undefined) &&
                    this.position.x - this.size + this.speed.dx < obstacle.position.x + obstacle.size.x &&
                    this.position.x + this.size + this.speed.dx > obstacle.position.x &&
                    this.position.y - this.size + this.speed.dy < obstacle.position.y + obstacle.size.y &&
                    this.position.y + this.size + this.speed.dy > obstacle.position.y) {
                        if (this.position.x > obstacle.position.x + obstacle.size.x ||
                            this.position.x < obstacle.position.x) {
                                this.speed.dx = -this.speed.dx;
                        } else {
                            this.speed.dy = -this.speed.dy;
                        };
                        if (obstacle.strength && obstacle.strength > 0) {
                            obstacle.strength -= this.power;
                            if (obstacle.strength === 0) {
                                return 'hit';
                            };
                        };
                };
                break;
            case 'field':
                if (
                    this.position.x + this.speed.dx + this.size > obstacle.size.x || 
                    this.position.x + this.speed.dx < this.size) {
                        this.speed.dx = -this.speed.dx;
                } else if (
                    this.position.y + this.speed.dy < this.size) {
                        this.speed.dy = -this.speed.dy;
                } else if (
                    this.position.y + this.speed.dy > obstacle.size.y) {
                        return 'lost';
                };
                break;
            default: console.error('Unknown obstacle.shape passed to Ball.collision(obstacle) method');
        };
    };
    draw() {
        CTX.beginPath();
        CTX.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2)
        CTX.fillStyle = this.fillStyle;
        CTX.fill();
        CTX.closePath();
    };
};