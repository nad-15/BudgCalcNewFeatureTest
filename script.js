function addDollarSignOnBlur(event){
    const input = event.target;

    let value = input.value;
    
    if(value){
        input.value = `$${parseFloat(value).toFixed(2)}`;
    }
}

document.querySelector('#input1').addEventListener(`blur`, addDollarSignOnBlur);