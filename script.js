function addDollarSignOnBlur(event) {
    const input = event.target;

    // Get the current value of the input
    let value = input.value.trim();

    // Only proceed if the value is not empty
    if (value !== "") {
        // Parse the value as a number and format it
        const numericValue = parseFloat(value);

        if (!isNaN(numericValue)) {
            // Store the original numeric value in a custom attribute
            input.setAttribute("data-original-value", numericValue);

            // Change the input type to text and format the display value
            input.type = "text";
            input.value = `$${numericValue.toFixed(2)} /hr`;
        }
    }
}

function revertToNumberOnFocus(event) {
    const input = event.target;

    // Retrieve the original numeric value if it exists
    const originalValue = input.getAttribute("data-original-value");

    if (originalValue !== null) {
        // Change the input type back to number and restore the original value
        input.type = "number";
        input.value = originalValue;
    }
}

// Attach event listeners to the inputs
const input1 = document.querySelector("#input1");
const input2 = document.querySelector("#input2");

input1.addEventListener("blur", addDollarSignOnBlur);
input1.addEventListener("focus", revertToNumberOnFocus);

input2.addEventListener("blur", addDollarSignOnBlur);
input2.addEventListener("focus", revertToNumberOnFocus);