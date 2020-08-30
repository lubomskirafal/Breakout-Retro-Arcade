import '.././sass/index.scss';
import getRandomValue from './components/getRandomValue';
import renderPlayersList from './components/renderPlayersList';
import {initBricks, drawBricks} from './components/bricks';
import {drawBall, moveBall} from './components/ball';
import {drawScore} from './components/score';
import {drawChances} from './components/chances';
import {drawPaddle, movePaddle} from './components/paddle';
import {handleKeyDown, handleKeyUp, handleMove} from './components/handleMove';
import {handlePlayAgain, handlePause} from './components/asside';

const brickColumn = 8;
const brickRow = 8;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startForm = document.querySelector('.start-screen__form');
const input = document.querySelector('.start-screen__form-input');
const startScreen = document.querySelector('.start-screen');
const playAgainButton = document.querySelector('.gameOver__button');
const playersList = document.querySelector('.list ul');
const bricks = [];
let players = localStorage.getItem('players')!==null?JSON.parse(localStorage.getItem('players')):[];

const player = {
    name:'Johny',
    date : new Date().toLocaleDateString(),
    score:0
};

const settings = {
    score:0,
    start: false,
    balls: 3
};

const brick = {
    width: 30,
    height: 8,
    padding: 5,
    offsetY:40,
    vissible: true,
};

const paddle = {
    x: canvas.width/2,
    y: canvas.height - 20,
    width: 80,
    height: 8,
    speed: 8,
    dx: 0,
};

const ball = {
    x: Math.floor(Math.random()*canvas.width-9),
    y: getRandomValue(canvas.height/2, canvas.height-28),
    size: 9,
    dx: 1,
    dy: -5,
};

const render = ()=>{
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawChances(ctx, settings, canvas);
    drawPaddle(paddle, ctx, canvas);
    movePaddle(paddle, canvas);
    drawBall(ctx, ball);
    drawScore(ctx, settings, canvas);
    drawBricks(bricks, ctx);

    settings.start?moveBall(
        ball, 
        paddle, 
        bricks, 
        settings, 
        player, 
        players, 
        brickColumn, 
        brickRow, 
        ctx,
        canvas
        ): false;

    requestAnimationFrame(render);
};

const handleSubmit = (e)=> {
    e.preventDefault();
    startScreen.classList.add('start-screen--hidden');
    player.name = !input.value? 'Johny':input.value.trim();
    input.value = "";
    setTimeout(()=>{settings.start = true},1000)
};

document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('keydown', (e)=> {
        handleKeyDown(e,paddle);
        if(e.key === 'Pause') handlePause(settings);
    });
    document.addEventListener('touchstart', (e)=>{
        e.preventDefault();
        document.addEventListener('touchmove', (e)=> {
            e.preventDefault();
            handleMove(e, paddle, canvas);
        },{passive:false});
    }, {passive:false});
    document.addEventListener('touchend',()=>{
        document.removeEventListener('touchmove', handleMove);
    });
    document.addEventListener('keyup', (e)=> handleKeyUp(e, paddle));
    startForm.addEventListener('submit', handleSubmit);
    playAgainButton.addEventListener('click', handlePlayAgain);
    canvas.addEventListener('click', ()=> handlePause(settings));
    renderPlayersList(players, playersList);
    initBricks(brick, bricks, brickColumn, brickRow);
    render();
});
