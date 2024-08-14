const s = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?";

/**
 * @description Given parameter 'desiredLength', return a string of random lorem ipsum.
 * @parameter desiredLength - Integer
 */
const getRandomLoremIpsum = (desiredLength) => {
    if(!desiredLength || desiredLength === 0 || Math.round(desiredLength) !== desiredLength) return "";
    if(desiredLength >= s.length) return s;

    const firstValidStartingIdx = 0;
    const lastValidStartingIdx = s.length - desiredLength;

    const wordStartIdxsInRange = [];
    for(let i = firstValidStartingIdx; i < lastValidStartingIdx; i++){
        if(i === 0){
            wordStartIdxsInRange.push(0)
        }else{
            if(s[i - 1] === " "){ // does value at index 'i' start a new word?
                wordStartIdxsInRange.push(i);
            }
        }
    }

    const startingIdx = wordStartIdxsInRange[Math.round(Math.random() * (wordStartIdxsInRange.length - 1))];
    const endingIdx = startingIdx + desiredLength;

    const randomLoremIpsum = s.slice(startingIdx, endingIdx).trim();

    return randomLoremIpsum;
}

module.exports = {
    getRandomLoremIpsum
}