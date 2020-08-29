import getRandomValue from './getRandomValue';
import {updateScore} from './score';
import {updateChances} from './chances';

const drawBall = (ctx, ball)=> {
    const {x,y,size} = ball;
    ctx.beginPath();
    ctx.arc(x,y, size, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
};

const resetBall = (ball, canvas)=> {
    ball.x =  getRandomValue(0,canvas.width-9);
    ball.y = getRandomValue(canvas.height/2,canvas.height-28);
    ball.dx = 5;
};

const moveBall = (ball, paddle, bricks, settings, player, players, brickColumn, brickRow, ctx, canvas)=> {
    ball.x += ball.dx;
    ball.y += ball.dy;
    //top/bottom/left/right colision detection
    if(ball.x + ball.size > canvas.width || ball.x - ball.size <0) ball.dx *= -1;
    if(ball.y + ball.size > canvas.height || ball.y - ball.size <0 ) ball.dy *= -1;
    //paddle colision detection
    if(
        ball.x + ball.size > paddle.x - paddle.width/2&&
        ball.x + ball.size < paddle.x + paddle.width/2+10 &&
        ball.y + ball.size > paddle.y 
    ) {
        ball.dy = -ball.dy;
        ball.dx = ball.dx;
    };
    // bricks colision detection

    bricks.forEach(column => column.forEach(brick=>{
        if(brick.vissible) {
            if (
                ball.x + ball.size > brick.x &&
                ball.x < brick.x + brick.width &&
                ball.y + ball.size > brick.y &&
                ball.y - ball.size < brick.y + brick.height
            ) {
                ball.dy *= -1;
                brick.vissible = false;
                updateScore(
                    settings, 
                    brickColumn, 
                    brickRow, 
                    ball, 
                    ctx, 
                    bricks);
            };
        }
    }));

    if (ball.y + ball.size > canvas.height) {
        updateChances(settings, player, players);
        resetBall(ball, canvas);
    }
};


export {
    drawBall,
    resetBall,
    moveBall
}