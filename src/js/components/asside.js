const handlePlayAgain = ()=> {
    location.reload();
};

const handlePause = (settings)=> {
 settings.start = !settings.start;
};


export {
    handlePause,
    handlePlayAgain
}