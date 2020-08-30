import {drawBall} from './ball';
import {resetBricks} from './bricks';
let xSpeed = 1;
let ySpeed = -4;
const updateScore = (settings, brickColumn, brickRow, ball, ctx, bricks)=> {
    settings.score =  settings.score + 1;
    if (settings.score % (brickColumn*brickRow)==0) {
        xSpeed++;
        ySpeed--
        ball.dy = ySpeed;
        ball.dx = xSpeed;
        resetBricks(bricks);
        drawBall(ctx, ball);
        settings.balls>2?settings.balls:settings.balls  = settings.balls + 1;
    };
};

const drawScore = (ctx, settings, canvas)=> {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${settings.score}`,( canvas.width-canvas.width)+20, 25);
};

export {
    updateScore,
    drawScore
}