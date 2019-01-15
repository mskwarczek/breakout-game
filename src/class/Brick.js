import { CTX }  from '../Global';

export default class Brick {
    constructor(positionX, positionY, width, height) {
        this.shape = 'rectangle';
        this._strength = 10;
        this.value = 10;
        this.position = {
            x: positionX,
            y: positionY
        };
        this.size = {
            x: width,
            y: height
        };
    };
    get strength() {
        return this._strength;
    };
    set strength(value) {
        this._strength = value > 0
        ? value
        : 0;
    };
    draw() {
        if (this.strength > 0) {
            CTX.beginPath();
            CTX.rect(this.position.x, this.position.y, this.size.x, this.size.y);
            CTX.fillStyle = 'blue';
            CTX.fill();
            CTX.closePath();
        };
    };
};