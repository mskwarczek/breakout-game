import { CTX, FIELD_X, FIELD_Y }  from '../Global';

export default class Paddle {
    constructor(width, speed, color) {
        this.shape = 'rectangle';
        this.size = {
            x: width,
            y: 10
        };
        this.position = {
            x: (FIELD_X - this.size.x) / 2,
            y: FIELD_Y - this.size.y
        };
        this.speed = {
            dx: speed
        };
        this.isMoving = {
            right: false,
            left: false
        };
        this.fillStyle = color;
    };
    move() {
        if (this.isMoving.right && (this.position.x + this.size.x) < FIELD_X) {
            this.position.x += this.speed.dx;
        }
        else if (this.isMoving.left && this.position.x > 0) {
            this.position.x -= this.speed.dx;
        };
    };
    draw() {
        CTX.beginPath();
        CTX.rect(this.position.x, this.position.y, this.size.x, this.size.y);
        CTX.fillStyle = this.fillStyle;
        CTX.fill();
        CTX.closePath();
    };
};
