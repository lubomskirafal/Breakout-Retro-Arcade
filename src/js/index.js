import '.././sass/index.scss';
import getRandomValue from './components/getRandomValue';

const brickColumn = 8;
const brickRow = 8;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startForm = document.querySelector('.start-screen__form');
const input = document.querySelector('.start-screen__form-input');
const startScren = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.gameOver');
const playAgainButton = document.querySelector('.gameOver__button');
const playerList = document.querySelector('.list ul');

//game
const bricks = [];
let players = localStorage.getItem('players')!==null?JSON.parse(localStorage.getItem('players')):[];


const renderPlayersList = ()=> {
    const playersList = players.sort((a,b)=>b.score - a.score);
    playersList.forEach((player, index)=> {
        const {name, date, score} = player
        const li = document.createElement('li');
        const content = `${index+1}. Player: ${name} Score: ${score} Date: ${date}`;
        li.innerHTML = content;
        playerList.appendChild(li);
    })
};

const player = {
    name:'Johny',
    date : new Date().toLocaleDateString(),
    score:0
}

const settings = {
    score:0,
    start: false,
    balls: 3
};


const brick = {
    padding: 5,
    offsetY:40,
    vissible: true,
};

const paddle = {
    x: canvas.width/2,
    y: window.innerHeight,
    width: 80,
    height: 8,
    speed: 8,
    dx: 0,
};

const initBricks = ()=> {
    const brickWidth = window.innerWidth/10;
    const brickHeight = window.innerWidth/40;
    for(let i =0; i<brickColumn; i++) {
        bricks[i] = [];
        for(let j = 0; j<brickRow; j++) {
            const x = i * (brickWidth+brick.padding)+brickWidth-15;
            const y = j * (brickHeight+brick.padding)+brick.offsetY;
            const offsetX = brickWidth-15;
            const width =  brickWidth;
            const height =  brickHeight;
            bricks[i][j] = {x,y,width, height,offsetX,...brick};
        };
    };
};

const drawBricks = ()=> {
    bricks.forEach(column=>{
        column.forEach(brick=>{
            const {x,y, width, height, padding, offsetX, offsetY, vissible} = brick;
            ctx.beginPath();
            ctx.rect(x,y, width, height)
            ctx.fillStyle = vissible? '#fff':'transparent';
            ctx.fill();
            ctx.closePath();
        })
    });
};


const resetBricks = ()=> {
    bricks.forEach(column=>column.forEach(brick=> brick.vissible = true))
};

// //...ball...


const ball = {
    x: Math.floor(Math.random()*window.innerWidth-9),
    y: getRandomValue(window.innerHeight/2,window.innerHeight-28),
    size: 9,
    dx: 5,
    dy: -8,
}

function drawBall() {
    const {x,y,size} = ball;
    ctx.beginPath();
    ctx.arc(x,y, size, 0, Math.PI*2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
};


const resetBall = ()=> {
    ball.x =  getRandomValue(0,window.innerWidth-9);
    ball.y = getRandomValue(window.innerHeight/2,window.innerHeight-28);
    ball.dx = 5;
};

const updateScore = ()=> {
    settings.score =  settings.score + 1;
    if (settings.score % (brickColumn*brickRow)==0) {
        ball.dy = ball.dy -1;
        resetBricks();
        settings.balls>2?settings.balls:settings.balls  = settings.balls + 1;
    };
};

const updateChances = ()=> {
    settings.balls = settings.balls -1;
    if(settings.balls < 1) {
        settings.balls = 3;
        gameOver();
    };
};

const moveBall = ()=> {
    ball.x += ball.dx;
    ball.y += ball.dy;
    //top/bottom/left/right colision detection
    if(ball.x + ball.size > window.innerWidth || ball.x - ball.size <0) ball.dx *= -1;
    if(ball.y + ball.size > window.innerHeight || ball.y - ball.size <0 ) ball.dy *= -1;
    //paddle colision detection
    if(
        ball.x + ball.size > paddle.x - paddle.width/2&&
        ball.x + ball.size < paddle.x + paddle.width/2+10 &&
        ball.y + ball.size > paddle.y -20
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
                updateScore();
            };
        }
    }));

    if (ball.y + ball.size > window.innerHeight) {
        updateChances();
        resetBall();
    }
};

// //...paddle...

const drawPaddle = ()=> {
    const {x, width, height} = paddle;
    ctx.beginPath();
    ctx.rect((x-(width/2)), window.innerHeight - 20, width, height)
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
};

const movePaddle = ()=> {
    
    paddle.x += paddle.dx;
    
    if(paddle.x + paddle.width/2 > canvas.width) return paddle.x = canvas.width - paddle.width/2;

    if(paddle.x < paddle.width/2) return paddle.x = paddle.width/2;
};

// //...score..

const drawScore = ()=> {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${settings.score}`,( canvas.width-canvas.width)+20, 25);
};

const drawChances = ()=> {
    ctx.font = '20px Arial';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Balls: ${settings.balls}`, canvas.width - 85, 25);
};
// //main

const render = ()=> {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawChances();
    drawPaddle();
    movePaddle();
    drawBall();
    drawScore();
    drawBricks();
    settings.start?moveBall(): false;
    requestAnimationFrame(render);
};

const handleKeyDown = (e)=> {
    if(e.key === 'ArrowLeft') return paddle.dx = -paddle.speed;
    if(e.key === 'ArrowRight') return paddle.dx = paddle.speed;
};

const handleKeyUp= (e)=> {
    if(e.key === 'ArrowLeft'||e.key === 'ArrowRight') return paddle.dx = 0;
};


const setCanvasSize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const gameOver = ()=> {
    player.score = settings.score;
    settings.score = 0;
    settings.balls = 3;
    settings.start = false;
    gameOverScreen.classList.add('gameOver--active');
    players.push(player);
    localStorage.setItem('players',JSON.stringify(players));
};

const handleSubmit = (e)=> {
    e.preventDefault();
    startScren.classList.add('start-screen--hidden');
    player.name = !input.value? 'Johny':input.value.trim();
    input.value = "";
    setTimeout(()=>{settings.start = true},1000)
};

const handlePlayAgain = ()=> {
    location.reload();
};

document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    startForm.addEventListener('submit', handleSubmit);
    playAgainButton.addEventListener('click', handlePlayAgain);
    renderPlayersList();
    initBricks();
    setCanvasSize();
    render();
    
    window.addEventListener('resize', ()=>{
        initBricks();
        setCanvasSize();
        drawPaddle();
        drawBricks();
        drawBall();
    });
    window.addEventListener('orientationchange', ()=> {
        initBricks();
        setCanvasSize();
        drawPaddle();
        drawBricks();
        drawBall();
    });
})