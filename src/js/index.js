import '.././sass/index.scss';


document.addEventListener('DOMContentLoaded', ()=> {
   
});




const rules = document.querySelector('.rules'),
    rulesBtn = document.querySelector('button'),
    select = document.querySelector('select'),
    brickColumn = 5,
    brickRow = 9,
    canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

let score = 0, start = false;

const handleShowRules = (e)=> {
    e.target.classList.toggle('active');
    rules.classList.toggle('active');
};

rulesBtn.addEventListener('click', handleShowRules);

//canvas

// bricks

const brick = {
    width: 70,
    height: 20,
    padding: 10,
    offsetX: 45,
    offsetY:60,
    vissible: true,
};

const bricks = [];

for(let i =0; i<brickRow; i++) {
    bricks[i] = [];
    for(let j = 0; j<brickColumn; j++) {
        const x = i * (brick.width+brick.padding)+brick.offsetX;
        const y = j * (brick.height+brick.padding)+brick.offsetY;
        bricks[i][j] = {x,y,...brick};
    };
};

const drawBricks = ()=> {
    bricks.forEach(column=>{
        column.forEach(brick=>{
            const {x,y, width, height, padding, offsetX, offsetY, vissible} = brick;
            ctx.beginPath();
            ctx.rect(x,y, width, height)
            ctx.fillStyle = vissible? '#0095dd':'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
};

function resetBricks() {
    bricks.forEach(column=>column.forEach(brick=> brick.vissible = true))
};

//...ball...

const getRandomValue = (min,max)=> {
    let value  = Math.floor(Math.random()*(min - max)+max);
    if (value===0) return value+1;

    return value;
};

const ball = {
    x: Math.floor(Math.random()*canvas.width),
    y: Math.floor(Math.random()*((canvas.height/2)-(canvas.height-20))+(canvas.height-20)),
    size: 10,
    dx: getRandomValue(-4,4),
    dy: -8,
}

function drawBall() {
    const {x,y,size, speed, dx, dy} = ball;
    ctx.beginPath();
    ctx.arc(x,y, size, 0, Math.PI*2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
};

function getSpeed() {
    const speed = -parseInt(select.options[select.selectedIndex].value);
    ball.dy = speed;
};

const resetBall = ()=> {
    ball.x =  Math.floor(Math.random()*canvas.width);
    ball.y = Math.floor(Math.random()*((canvas.height/2)-(canvas.height-20))+(canvas.height-20));
    // ball.dx = getRandomValue(-4,4);
};

function updateScore() {
    score ++;
    let speed = ball.dy;
    if (score % (brickColumn*brickRow)==0) {
        ball.dy = speed + 5;
        resetBricks();
    };
};

const moveBall = ()=> {
    ball.x += ball.dx;
    ball.y += ball.dy;
    //top/bottom/left/right colision detection
    if(ball.x + ball.size > canvas.width || ball.x - ball.size <0) ball.dx *= -1;
    if(ball.y + ball.size > canvas.height || ball.y - ball.size <0 ) ball.dy *= -1;
    //paddle colision detection
    if(
        ball.x + ball.size > paddle.x - (paddle.width/2) &&
        ball.x + ball.size < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.dy;
        // ball.dx = ball.dx * getRandomValue(-1,1);
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

    if (ball.y + ball.size > canvas.height) {
        score = 0;
        getSpeed();
        resetBricks();
        resetBall();
    }
};

//...paddle...

const paddle = {
    x: canvas.width/2,
    y: canvas.height-20,
    width: 80,
    height: 10,
    speed: 8,
    dx: 0,
};

const drawPaddle = ()=> {

    const {x, y, width, height, speed, dx} = paddle;

    ctx.beginPath();
    ctx.rect((x-(width/2)), y, width, height)
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();

};

const movePaddle = ()=> {
    
    paddle.x += paddle.dx;
    
    if(paddle.x + paddle.width/2 > canvas.width) return paddle.x = canvas.width - paddle.width/2;

    if(paddle.x < paddle.width/2) return paddle.x = paddle.width/2;
};

//...score..

const drawScore = ()=> {
    ctx.font = '20px Arial';
    ctx.fillText(`Punkty: ${score}`, canvas.width-150, 30);
};

//main

const render = ()=> {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPaddle();
    movePaddle();
    drawBall();
    if(start) moveBall();
    drawScore();
    drawBricks();
    requestAnimationFrame(render);
};

const handleKeyDown = (e)=> {
    if(e.key === 'ArrowLeft') return paddle.dx = -paddle.speed;
    if(e.key === 'ArrowRight') return paddle.dx = paddle.speed;
};

const handleKeyUp= (e)=> {
    if(e.key === 'ArrowLeft'||e.key === 'ArrowRight') return paddle.dx = 0;
};

document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);
select.addEventListener('input', getSpeed);
document.addEventListener('DOMContentLoaded',()=>{
    render();
    setTimeout(()=>start = true,5000);
})