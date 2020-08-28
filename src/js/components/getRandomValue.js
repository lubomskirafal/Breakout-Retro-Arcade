const getRandomValue = (min,max)=> {
    let value  = Math.floor(Math.random()*(min - max) + max);
    if (value === 0) return getRandomValue(min,max);

    return value;
};

export default getRandomValue;