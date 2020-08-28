import gameOver from './gameOver';

const drawChances = (ctx, settings, canvas)=> {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Balls: ${settings.balls}`, canvas.width - 85, 25);
};

const updateChances = (settings, player, players)=> {
    settings.balls = settings.balls -1;
    if(settings.balls < 1) {
        settings.balls = 3;
        gameOver(player, settings, players);
    };
};

export {
    drawChances,
    updateChances
}