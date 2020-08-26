import '.././sass/index.scss';

const brickColumn = 8;
const brickRow = 8;
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const bricks = [];
let score = 0, start = false;

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
            ctx.fillStyle = vissible? '#0095dd':'transparent';
            ctx.fill();
            ctx.closePath();
        })
    });
};


function resetBricks() {
    bricks.forEach(column=>column.forEach(brick=> brick.vissible = true))
};

// //...ball...

const getRandomValue = (min,max)=> {
    let value  = Math.floor(Math.random()*(min - max)+max);
    if (value===0) return value+1;

    return value;
};

const ball = {
    x: Math.floor(Math.random()*window.innerWidth-9),
    y: Math.floor(Math.random()*((window.innerHeight/2)-(window.innerHeight-28))+(window.innerHeight-28)),
    size: 9,
    dx: getRandomValue(-10,10),
    dy: -8,
}

function drawBall() {
    const {x,y,size} = ball;
    ctx.beginPath();
    ctx.arc(x,y, size, 0, Math.PI*2);
    ctx.fillStyle = '#0095dd';
    ctx.fill();
    ctx.closePath();
};


const resetBall = ()=> {
    ball.x =  Math.floor(Math.random()*window.innerWidth-9);
    ball.y = Math.floor(Math.random()*((window.innerHeight/2)-(window.innerHeight-28))+(window.innerHeight-28));
    ball.dx = getRandomValue(-4,4);
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
    if(ball.x + ball.size > window.innerWidth || ball.x - ball.size <0) ball.dx *= -1;
    if(ball.y + ball.size > window.innerHeight || ball.y - ball.size <0 ) ball.dy *= -1;
    //paddle colision detection
    if(
        ball.x + ball.size > paddle.x - paddle.width/2&&
        ball.x + ball.size < paddle.x + paddle.width &&
        ball.y + ball.size > paddle.y -20
    ) {
        ball.dy = -ball.dy;
        ball.dx = ball.dx * getRandomValue(-1,1);
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
        score = 0;
        resetBricks();
        resetBall();
    }
};

// //...paddle...



const drawPaddle = ()=> {
    const {x, y, width, height} = paddle;
    ctx.beginPath();
    ctx.rect((x-(width/2)), window.innerHeight - 20, width, height)
    ctx.fillStyle = '#0095dd';
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
    ctx.fillText(`Score: ${score}`, canvas.width/2-30, 25);
};

// //main

const render = ()=> {
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPaddle();
    movePaddle();
    drawBall();
    moveBall();
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


const setCanvasSize = ()=>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};



document.addEventListener('DOMContentLoaded',()=>{
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    initBricks();
    setCanvasSize();
    render();
    
    // setTimeout(()=>start = true,5000);
    
    
    window.addEventListener('resize', ()=>{
        initBricks();
        setCanvasSize();
        drawPaddle();
        drawBricks();
    });
    window.addEventListener('orientationchange', ()=> {
        initBricks();
        setCanvasSize();
        drawPaddle();
        drawBricks();
    });
})