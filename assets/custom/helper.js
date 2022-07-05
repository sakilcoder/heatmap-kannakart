let numberToEuropeanFormat = function (number) {
    let num = number.toFixed(2);
    eurFormat='';

    if(num>=1000){
        let th = Math.floor(num/1000);
        eurFormat += th + '.';
        let hun = Math.floor(num%1000)
        if(hun>0)
            eurFormat += hun +',';
        else
            eurFormat += '000,'
        let dec = (num - Math.floor(num)).toFixed(2)*100;
        if(dec>0)
            eurFormat += dec;
        else
            eurFormat += '00';
    }else{
        // let hun = Math.floor(num%1000)
        // eurFormat += hun +',';
        // let dec = (num - Math.floor(num)).toFixed(2)*100;
        // eurFormat += dec;

        let hun = Math.floor(num%1000)
        if(hun>0)
            eurFormat += hun +',';
        else
            eurFormat += '000,'
        let dec = (num - Math.floor(num)).toFixed(2)*100;
        if(dec>0)
            eurFormat += dec;
        else
            eurFormat += '00';
    }

    return eurFormat;
}


function openCloseInfoPanel(){
    
    if (countryView == 1) {
        countryView = 0;
        countryPanel.style.display = "none";
    } else {
        countryView = 1;
        countryPanel.style.display = "block";
    }
}

