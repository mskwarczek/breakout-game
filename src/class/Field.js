import { CTX, FIELD_X, FIELD_Y, PALETTE }  from '../Global';

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
        CTX.strokeStyle = PALETTE.baseFieldStrokeStyle;
        CTX.lineWidth = 1;
        CTX.fillStyle = this.fillStyle;
        CTX.shadowColor = PALETTE.baseFieldShadowColor;
        CTX.shadowBlur = 20;
        CTX.shadowOffsetX = 15;
        CTX.shadowOffsetY = 15;
        CTX.fill();
        CTX.stroke();
        CTX.closePath();
    };
};
