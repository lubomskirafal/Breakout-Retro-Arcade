const handleKeyDown = (e, paddle)=> {
    if(e.key === 'ArrowLeft') return paddle.dx = -paddle.speed;
    if(e.key === 'ArrowRight') return paddle.dx = paddle.speed;
};

const handleKeyUp= (e, paddle)=> {
    if(e.key === 'ArrowLeft'||e.key === 'ArrowRight') return paddle.dx = 0;
};

const handleMove = (e, paddle)=> {
    let currentTouch = e.touches[0].clientX;
    if(currentTouch<38) return currentTouch = 0;
    if(currentTouch>window.innerWidth-40) return currentTouch = window.innerWidth - 38;
    paddle.x = currentTouch;
};

export {
    handleKeyDown,
    handleKeyUp,
    handleMove
}