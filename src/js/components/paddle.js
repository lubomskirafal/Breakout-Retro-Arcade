const drawPaddle = (paddle, ctx)=> {
    const {x, width, height} = paddle;
    ctx.beginPath();
    ctx.rect((x-(width/2)), window.innerHeight - 20, width, height)
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
};

const movePaddle = (paddle, canvas)=> {
    
    paddle.x += paddle.dx;
    
    if(paddle.x + paddle.width/2 > canvas.width) return paddle.x = canvas.width - paddle.width/2;

    if(paddle.x < paddle.width/2) return paddle.x = paddle.width/2;
};

export {
    drawPaddle,
    movePaddle
}