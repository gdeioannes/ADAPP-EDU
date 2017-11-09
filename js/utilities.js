function maxSizeText(maxLength,text,addTextEnd){
    if(text.length>maxLength){
        return text.substring(0,maxLength)+addTextEnd;
    }else{
        return text;
    }
}