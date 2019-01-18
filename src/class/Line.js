import { FIELD_X }  from '../Global';
import Brick from './Brick';

export default class Line {
    constructor(positionY, brickHeight) {
        this.positionY = positionY;
        this.padding = Math.floor((Math.random() * 3 ) + 1) * 5;
        this.brickData = {
            width: Math.floor((Math.random() * 4 ) + 2) * 20,
            height: brickHeight,
            type: Math.floor((Math.random() * 10 ) + 1)
        };
        this.brickCount = Math.floor(FIELD_X / (this.brickData.width + this.padding));
        this.sideMargin = (FIELD_X - (this.brickCount * (this.brickData.width + this.padding) - this.padding)) / 2;
        this.bricks = [];
        this.totalStrength = 0;
        this.generate();
        this.calculateStrength();
    };
    generate() {
        for (let i = 0; i < this.brickCount; i++) {
            this.bricks.push(new Brick(this.sideMargin + (this.brickData.width + this.padding) * i, this.positionY, this.brickData.width, this.brickData.height, this.brickData.type));
        };
    };
    calculateStrength() {
        this.totalStrength = this.bricks.reduce((total, brick) => total += brick.strength, 0);
    };
    draw() {
        this.bricks.forEach(brick => brick.draw());
    };
};
