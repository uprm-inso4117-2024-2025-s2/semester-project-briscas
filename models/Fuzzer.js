function charFuzz(maxLength = 100, trueLength = false, ASCIIStart = "a", ASCIIRange = 25){
    if (typeof ASCIIStart === "string"){
        ASCIIStart = ASCIIStart.charCodeAt(0)
    }
    if (trueLength){
        var stringLength = maxLength;
    }else{
        var stringLength = require('crypto').randomInt(0, maxLength);
    }
    var fuzzedOutput = "";
    console.log(stringLength);
    for(let i = 0; i <= stringLength; i++){
        fuzzedOutput += String.fromCharCode(require('crypto').randomInt(ASCIIStart, ASCIIStart + ASCIIRange));
    }
    console.log(fuzzedOutput)
    return fuzzedOutput;
}
function numFuzz(numRangeStart = 0, numRangeEnd = 100){
    const fuzzedNum = require('crypto').randomInt(numRangeStart, numRangeEnd+1)
    console.log(fuzzedNum)
    return fuzzedNum;
}
module.exports.charFuzz = charFuzz;
module.exports.numFuzz = numFuzz;