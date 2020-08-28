const renderPlayersList = (players, list)=> {
    const playersList = players.sort((a,b)=>b.score - a.score);
    playersList.forEach((player, index)=> {
        const {name, date, score} = player
        const li = document.createElement('li');
        const content = `${index<9?"0"+(index+1):index+1}. Player: ${name} Score: ${score} Date: ${date}`;
        li.innerHTML = content;
        list.appendChild(li);
    })
};

export default renderPlayersList