export const CANVAS = document.getElementById('canvas');
export const CTX = canvas.getContext('2d');
export const FIELD_X = canvas.width;
export const FIELD_Y = canvas.height;
export const CONFIG = {
    basePaddleWidth: 80,
    basePaddleSpeed: 8,
    baseBallSize: 10,
    baseBallSpeed: 3,
    baseBallPower: 10,
    baseLives: 3,
    baseMultiplier: 1,
    baseLevel: 1,
    baseScore: 0,
    bonusDropRate: 3,
    ballSpeedIncrease: 1,
    multiplierIncrease: 0.2
};
export const PALETTE = {
    baseFieldFillStyle: '#ccc',
    baseTextFillStyle: '#000',
    baseBallFillStyle: '#000',
    basePaddleFillStyle: '#000',
    baseAlertFillStyle: '#000'
};