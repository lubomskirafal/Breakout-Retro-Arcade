const getRandomValue = (min,max)=> {
    let value  = Math.floor(Math.random()*(min - max) + max);
    if (value<1&&value>-1) return getRandomValue(min,max);

    return value;
};

export default getRandomValue;