const BadWordsFilter = require("bad-words");
const badWordsFilter = new BadWordsFilter();
const emailValidator = require("email-validator");
const SimpleErrorWrapper = require("../util/error_wrapper");

const specialChars = [
    '!', '@', '#', '$',
    '%', '^', '&', '*',
    '(', ')', '_', '-',
    '+', '='
];

const numbers = [
    '1', '2', '3', '4',
    '5', '6', '7', '8',
    '9', '0'
];



const validateLength = (str, min, max, errMessage) => {
    
    if(str.length < min || str.length > max){
        throw new SimpleErrorWrapper(errMessage, 400);
    }

}


const validateEmail = (str, errMessage) => {
    
    const emailValid = Boolean(
        emailValidator.validate(str) &&
        !badWordsFilter.isProfane(str)
    );

    if(!emailValid){
        throw new SimpleErrorWrapper(errMessage, 400);
    }

}


const validateProfanity = (str, errMessage) => {
    if(badWordsFilter.isProfane(str)){
        throw new SimpleErrorWrapper(errMessage, 400);
    }
}


const validateNoSymbols = (str, errMessage) => {

    if(specialChars.some((c) => str.includes(c))){
        throw new SimpleErrorWrapper(errMessage, 400);
    }

}

const validateHasSymbols = (str, errMessage) => {
    if(!specialChars.some((c) => str.includes(c))){
        throw new SimpleErrorWrapper(errMessage, 400);
    }
}

const validateHasNumbers = (str, errMessage) => {
    if(!numbers.some((c) => str.includes(c))){
        throw new SimpleErrorWrapper(errMessage, 400);
    }
}


module.exports = {
    validateLength,
    validateEmail,
    validateProfanity,
    validateNoSymbols,
    validateHasSymbols,
    validateHasNumbers,
}