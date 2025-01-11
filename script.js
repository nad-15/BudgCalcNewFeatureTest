function addDollarSignOnBlur(event){
    const input = event.target;

    let value = input.value;
    
    if(value){

        const displayValue = `$${parseFloat(value).toFixed(2)}`;

        input.setAttribute("data-original-value", value);
        input.type = "text";
        input.value = displayValue;
    }
}

document.querySelector('#input1').addEventListener(`blur`, addDollarSignOnBlur);