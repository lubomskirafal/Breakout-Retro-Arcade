

const initBricks = (brick, bricks, brickColumn, brickRow)=> {
    const {width, height, padding, offsetY} = brick;
    for(let i =0; i<brickColumn; i++) {
        bricks[i] = [];
        for(let j = 0; j<brickRow; j++) {
            const x = i * (width+padding)+width-18;
            const y = j * (height+padding)+offsetY;
            const offsetX = width-15;
            bricks[i][j] = {x,y, offsetX,...brick};
        };
    };
};

const drawBricks = (bricks, ctx)=> {
    bricks.forEach(column=>{
        column.forEach(brick=>{
            const {x,y, width, height, padding, vissible} = brick;
            ctx.beginPath();
            ctx.rect(x,y, width, height)
            ctx.fillStyle = vissible? '#fff':'transparent';
            ctx.fill();
            ctx.closePath();
        })
    });
};


const resetBricks = (bricks)=> {
    bricks.forEach(column=>column.forEach(brick=> brick.vissible = true))
};

export {
    initBricks,
    drawBricks,
    resetBricks
}