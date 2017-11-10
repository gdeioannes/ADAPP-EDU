function maxSizeText(maxLength,text,addTextEnd)
{
    if(text.length>maxLength){
        return text.substring(0,maxLength)+addTextEnd;
    }else{
        return text;
    }
}

function degreeToRadians(value){
	return (value/360)*2*Math.PI;
}