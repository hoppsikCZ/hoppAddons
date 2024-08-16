function redToGreen(value){
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

function chroma(){
    var hue = (Date.now() % 360).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

export default { redToGreen, chroma };