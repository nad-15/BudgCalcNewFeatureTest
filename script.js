// function addDollarSignOnBlur(event) {
//     const input = event.target;

//     // Get the current value of the input+-
//     let value = input.value.trim();

//     // Only proceed if the value is not empty
//     if (value !== "") {
//         // Parse the value as a number and format it
//         const numericValue = parseFloat(value);

//         if (!isNaN(numericValue)) {
//             // Store the original numeric value in a custom attribute
//             input.setAttribute("data-original-value", numericValue);

//             // Change the input type to text and format the display value
//             input.type = "text";
//             input.value = `$${numericValue.toFixed(2)} /hr`;
//         }
//     }
// }

// function revertToNumberOnFocus(event) {
//     const input = event.target;

//     // Retrieve the original numeric value if it exists
//     const originalValue = input.getAttribute("data-original-value");

//     if (originalValue !== null) {
//         // Change the input type back to number and restore the original value
//         input.type = "number";
//         input.value = originalValue;
//     }
// }

// // Attach event listeners to the inputs
// const input1 = document.querySelector("#input1");
// const input2 = document.querySelector("#input2");

// input1.addEventListener("blur", addDollarSignOnBlur);
// input1.addEventListener("focus", revertToNumberOnFocus);

// input2.addEventListener("blur", addDollarSignOnBlur);
// input2.addEventListener("focus", revertToNumberOnFocus);

// Get the save button and other elements
const saveButton = document.querySelector('button[type="submit"]'); // The Save button
const addJobButton = document.getElementById('add-job');
const jobInputsContainer = document.getElementById('job-inputs');
const computeSalaryButton = document.getElementById('compute-salary');
const netIncomeButton = document.getElementById(`net-income`);
const clearButton = document.getElementById(`clear`);
const totalDisplay = document.getElementById('total');

const addExpenseButton = document.getElementById('add-expense');
const expenseInputsContainer = document.getElementById('expense-inputs');
const computeExpenseButton = document.getElementById('compute-expense');
const totalExpenseDisplay = document.getElementById('total-expenses');

function addDollarSignOnBlur(event) {
    const input = event.target;

    // Get the current value of the input+-
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

// Load previously saved jobs and expenses when the page is loaded
window.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    loadExpenses();
});

// Function to save jobs to localStorage
function saveJobs() {
    const jobInputs = document.querySelectorAll('.job-input');
    const jobs = Array.from(jobInputs).map(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');
        return {
            jobName: inputs[0].value,
            hourlyRate: inputs[1].value,
            hoursPerShift: inputs[2].value,
            noOfShifts: inputs[3].value,
            frequency: inputs[4].value
        };
    });
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

// Function to save expenses to localStorage
function saveExpenses() {
    const expenseInputs = document.querySelectorAll('.expense-input');
    const expenses = Array.from(expenseInputs).map(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');
        return {
            expenseName: inputs[0].value,

            amount: parseFloat(inputs[1].value.replace(/[^0-9.]/g, '')),
            //doesnt save the formatted value
            //amount: inputs[1].value,
            frequency: inputs[2].value
        };
    });
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to load jobs from localStorage
function loadJobs() {
    const savedJobs = JSON.parse(localStorage.getItem('jobs'));
    if (savedJobs) {
        savedJobs.forEach(job => {
            addJobInput(job.jobName, job.hourlyRate, job.hoursPerShift, job.noOfShifts, job.frequency);
        });
    }
}

// Function to load expenses from localStorage
function loadExpenses() {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (savedExpenses) {
        savedExpenses.forEach(expense => {
            addExpenseInput(expense.expenseName, expense.amount, expense.frequency);

        });
    }
}

// Function to add a new job input with the job details
function addJobInput(jobName = '', ratePerHour = '', hoursPerShift = '', noOfShifts = '', frequency = 'daily') {

    const newJobInputDiv = document.createElement('div');
    newJobInputDiv.classList.add('job-input');

    const jobNameInput = document.createElement('input');
    jobNameInput.type = 'text';
    jobNameInput.classList.add('job-name');
    jobNameInput.placeholder = 'Job Name';
    jobNameInput.value = jobName;

    const ratePerHourInput = document.createElement('input');
    ratePerHourInput.type = 'number';
    ratePerHourInput.classList.add('rate-per-hour');
    ratePerHourInput.placeholder = '$/hr';
    ratePerHourInput.value = ratePerHour;

    const hoursPerShiftInput = document.createElement('input');
    hoursPerShiftInput.type = 'number';
    hoursPerShiftInput.classList.add('hours-per-shift');
    hoursPerShiftInput.placeholder = 'hr/shift';
    hoursPerShiftInput.value = hoursPerShift;

    const noOfShiftsInput = document.createElement('input');
    noOfShiftsInput.type = 'number';
    noOfShiftsInput.classList.add('no-of-shifts');
    noOfShiftsInput.placeholder = 'shft Ct';
    noOfShiftsInput.value = noOfShifts;

    const salaryFrequencySelect = document.createElement('select');
    salaryFrequencySelect.classList.add('sal-freq');
    const options = ['daily', 'weekly', 'biweekly', 'monthly'];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        if (option === frequency) {
            optionElement.selected = true;
        }
        salaryFrequencySelect.appendChild(optionElement);
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('remove-job');
    removeButton.innerText = '-';

    removeButton.addEventListener('click', () => {
        newJobInputDiv.remove();
        // saveJobs(); // Save after removal
    });

    newJobInputDiv.appendChild(jobNameInput);
    newJobInputDiv.appendChild(ratePerHourInput);
    newJobInputDiv.appendChild(hoursPerShiftInput);
    newJobInputDiv.appendChild(noOfShiftsInput);
    newJobInputDiv.appendChild(salaryFrequencySelect);
    newJobInputDiv.appendChild(removeButton);

    jobInputsContainer.appendChild(newJobInputDiv);
}

// Function to add a new expense input with the expense details
function addExpenseInput(expenseName = '', amount = '', frequency = 'daily') {
    const newExpenseInputDiv = document.createElement('div');
    newExpenseInputDiv.classList.add('expense-input');

    const expenseNameInput = document.createElement('input');
    expenseNameInput.type = 'text';
    expenseNameInput.classList.add('expense-name');
    expenseNameInput.placeholder = 'Expense Name';
    expenseNameInput.value = expenseName;

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.classList.add('amount');
    amountInput.placeholder = 'Amount';
    amountInput.addEventListener("blur", addDollarSignOnBlur);
    amountInput.addEventListener("focus", revertToNumberOnFocus);
    amountInput.value = amount;
    // amountInput.addEventListener("blur", addDollarSignOnBlur);
    // amountInput.addEventListener("focus", revertToNumberOnFocus);

    const expenseFrequencySelect = document.createElement('select');

    const options = ['daily', 'weekly', 'biweekly', 'monthly'];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        if (option === frequency) {
            optionElement.selected = true;
        }
        expenseFrequencySelect.appendChild(optionElement);
    });

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.classList.add('remove-expense');
    removeButton.innerText = '-';

    removeButton.addEventListener('click', () => {
        newExpenseInputDiv.remove();
        // saveExpenses(); // Save after removal
    });

    newExpenseInputDiv.appendChild(expenseNameInput);
    newExpenseInputDiv.appendChild(amountInput);
    newExpenseInputDiv.appendChild(expenseFrequencySelect);
    newExpenseInputDiv.appendChild(removeButton);

    expenseInputsContainer.appendChild(newExpenseInputDiv);
}

// Function to compute total salary based on all job inputs and display it
function computeTotalSalaryReport() {
    const jobInputs = document.querySelectorAll('.job-input');

    let totalDailySalary = 0;
    let totalWeeklySalary = 0;
    let totalBiweeklySalary = 0;
    let totalMonthlySalary = 0;
    let totalYearlySalary = 0;
    let monthlySalary = 0;
    let totalSalaryForm = "";

    jobInputs.forEach(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');
        let salaryNameForm ="";
        if (inputs[0].value.trim() !== ''){
            salaryNameForm = inputs[0].value;
        }
        else {
            salaryNameForm = 'No-name';
        }
        
        const hourlyRate = parseFloat(inputs[1].value); // rate per hour
        const hoursPerShift = parseFloat(inputs[2].value); // hours per shift
        const noOfShifts = parseFloat(inputs[3].value); // number of shifts
        const frequency = inputs[4].value; // frequency (daily, weekly, etc.)

        if (!isNaN(hourlyRate) && !isNaN(hoursPerShift) && !isNaN(noOfShifts)) {
            let dailySalary = 0;

            // Calculate salary based on frequency and number of shifts
            if (frequency === 'daily') {
                dailySalary = hourlyRate * hoursPerShift * noOfShifts;
            } else if (frequency === 'weekly') {
                dailySalary = hourlyRate * hoursPerShift * noOfShifts / 7;
            } else if (frequency === 'biweekly') {
                dailySalary = hourlyRate * hoursPerShift * noOfShifts / 14;
            } else if (frequency === 'monthly') {
                dailySalary = hourlyRate * hoursPerShift * noOfShifts / 30;
            }

            monthlySalary = dailySalary * 30;

            totalDailySalary += dailySalary;
            totalWeeklySalary += dailySalary * 7;
            totalBiweeklySalary += dailySalary * 14;
            totalMonthlySalary += dailySalary * 30;
            totalYearlySalary += dailySalary * 365;

            totalSalaryForm +=salaryNameForm + ": $" +  monthlySalary.toFixed(2) + "\n";

        }
    });

    return [totalMonthlySalary, totalSalaryForm];
}

// Function to compute total expenses based on all expense inputs and display it
function computeTotalExpensesReport() {
    const expenseInputs = document.querySelectorAll('.expense-input');
    let totalDailyExpense = 0;
    let totalWeeklyExpense = 0;
    let totalMonthlyExpense = 0;
    let totalBiweeklyExpense = 0;
    let totalYearlyExpense = 0;
    let monthlyExpense = 0;
    let totalExpenseForm="";

    expenseInputs.forEach(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');

        let expenseNameForm = "";
        if (inputs[0].value.trim() !== ''){
            expenseNameForm = inputs[0].value;
        }
        else {
            expenseNameForm = 'No-name';
        }

        const amount = parseFloat(inputs[1].value);
        const frequency = inputs[2].value;

        if (!isNaN(amount)) {
            let dailyExpense = 0;
            if (frequency === 'daily') {
                dailyExpense = amount;
            } else if (frequency === 'weekly') {
                dailyExpense = amount / 7;
            } else if (frequency === 'biweekly') {
                dailyExpense = amount / 14;
            } else if (frequency === 'monthly') {
                dailyExpense = amount / 30;
            }
            
            monthlyExpense=dailyExpense * 30;

            totalDailyExpense += dailyExpense;
            totalWeeklyExpense += dailyExpense * 7;
            totalBiweeklyExpense += dailyExpense * 14;
            totalMonthlyExpense += dailyExpense * 30;
            totalYearlyExpense += dailyExpense * 365;

            totalExpenseForm += expenseNameForm + ": $" + monthlyExpense.toFixed(2) + "\n";
        }

    });

    return [totalMonthlyExpense, totalExpenseForm];


}

// Event listeners for adding new jobs and expenses
addJobButton.addEventListener('click', () => addJobInput());
addExpenseButton.addEventListener('click', () => addExpenseInput());

// Event listeners to compute salary and expenses
computeSalaryButton.addEventListener('click', () => {
    const totalSalaryReport = computeTotalSalaryReport();

    totalDisplay.innerHTML += ` 
    <p style="margin: 2px 0; padding: 0; color:rgb(25, 131, 25);">MONTHLY SALARY <br>----------------<br> ${totalSalaryReport[1].replace(/\n/g, `<br>`)}<strong>----------------<br>TOTAL:</strong> $${totalSalaryReport[0].toFixed(2)}</p>
    <p style="margin: 2px 0; padding: 0;">===================</p>
`;

});


computeExpenseButton.addEventListener('click', () => {
    const totalExpenseReport = computeTotalExpensesReport();


totalDisplay.innerHTML += ` 
<p style="margin: 2px 0; padding: 0; color: red;">MONTHLY EXPENSES <br>----------------<br> ${totalExpenseReport[1].replace(/\n/g, `<br>`)}<b>----------------<br>TOTAL:</b> $${totalExpenseReport[0].toFixed(2)}</p>
<p style="margin: 2px 0; padding: 0;">===================</p>
`;

});



netIncomeButton.addEventListener('click', () => {
    const totalSalaryReport = computeTotalSalaryReport();
    const totalExpenseReport = computeTotalExpensesReport();

    const netIncome = totalSalaryReport[0] - totalExpenseReport[0];

    totalDisplay.innerHTML += `
        <p style="margin: 2px 0; padding: 0;  color: blue;">MONTHLY NET INCOME <br>----------------<br> Salary: <span style="color: rgb(25, 131, 25);">$${totalSalaryReport[0].toFixed(2)} </span> <br> Expenses: <span style="color: red;">$${totalExpenseReport[0].toFixed(2)}</span> <br>----------------<br> TOTAL: $${netIncome.toFixed(2)}</p>
        <p style="margin: 2px 0; padding: 0;">===================</p>
    `;

    // Display net income
});

 
clearButton.addEventListener('click', () => {
    totalDisplay.innerHTML = '';  // Clears the content
});

// Event listener for saving data
saveButton.addEventListener('click', () => {
    saveJobs();
    saveExpenses();
    alert('Data saved successfully!');
});


 