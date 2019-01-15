import Line from './Line';

export default class Wall {
    constructor() {
        this.lineCount = Math.floor((Math.random() * 3 ) + 5);
        this.topMargin = 50;
        this.lineHeight = 20;
        this.padding = 10;
        this.lines = [];
        this.generate();
        this.calculateStrength();
    };
    generate() {
        for (let i = 0; i < this.lineCount; i++) {
            this.lines.push(new Line(this.topMargin + (this.lineHeight + this.padding) * i, this.lineHeight));
        };
    };
    calculateStrength() {
        return this.lines.reduce((total, line) => total += line.totalStrength, 0);
    };
    draw() {
        this.lines.forEach(line => line.draw());
    };
};
