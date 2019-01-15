import { CTX, FIELD_X, FIELD_Y }  from '../Global';

export default class Field {
    constructor(color) {
        this.shape = 'field';
        this.size = {
            x: FIELD_X,
            y: FIELD_Y
        };
        this.fillStyle = color;
    };
    draw() {
        CTX.beginPath()
        CTX.rect(0, 0, FIELD_X, FIELD_Y);
        CTX.fillStyle = this.fillStyle;
        CTX.fill();
        CTX.closePath();
    };
};
