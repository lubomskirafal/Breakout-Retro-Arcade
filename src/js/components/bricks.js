

const initBricks = (brick, bricks, brickColumn, brickRow)=> {
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

const drawBricks = (bricks, ctx)=> {
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

export {
    initBricks,
    drawBricks,
    resetBricks
}