const gameOverScreen = document.querySelector('.gameOver');

const gameOver = (player, settings, players)=> {
    player.score = settings.score;
    settings.score = 0;
    settings.balls = 3;
    settings.start = false;
    gameOverScreen.classList.add('gameOver--active');
    players.push(player);
    localStorage.setItem('players',JSON.stringify(players));
};

export default gameOver;