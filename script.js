
// Get the save button and other elements
const allFormContainer = document.getElementById('form-container');
// const allFormContainer = document.getElementById('all-container')
const saveButton = document.getElementById('save');
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
const toggleButtonJob = document.getElementById('toggle-job');
const toggleButtonExp = document.getElementById('toggle-exp');
const toggleButtonJobExp = document.getElementById(`toggle-report`);

const title = document.getElementById(`title-budget-calc`);

function enterFullScreen() {
    const docElement = document.documentElement;
    if (docElement.requestFullscreen) {
        docElement.requestFullscreen();
    } else if (docElement.webkitRequestFullscreen) {
        docElement.webkitRequestFullscreen(); // Safari
    } else if (docElement.msRequestFullscreen) {
        docElement.msRequestFullscreen(); // IE/Edge
    }
}

const listForm = document.getElementById(`earnings-expenses-form`);
toggleButtonJobExp.addEventListener("click", () => {

    if (listForm.style.display === "none") {
        listForm.style.display = "block";
        title.style.display = `block` // Show the container
        toggleButtonJobExp.textContent = "Expand"; // Update button text
        // totalDisplay.style.maxHeight = 'none';
        allFormContainer.style.maxHeight = 'none';
    } else {
        listForm.style.display = "none";
        title.style.display = "none";// Hide the container
        toggleButtonJobExp.textContent = "Collapse"; // Update button text
        if (totalDisplay.textContent === "") {
            computeSalaryButton.click();
            computeExpenseButton.click();
            netIncomeButton.click();
        }
        // totalDisplay.style.maxHeight = '80vh';
        allFormContainer.style.maxHeight = '80vh'

        enterFullScreen();
    }
});


function addUnitOnBlur(event) {
    console.log('blur');
    const input = event.target;

    if (input.name === "select") {
        console.log(`Blur Called by Frequency/Select`);

        if (input.value === '%earnings') {
            const prevSibling = input.previousElementSibling;

            const value = prevSibling.value.trim().replace(/[^0-9.]/g, '');

            if (value === "") {
                prevSibling.setAttribute("data-original-value", "");
                return;
            }
            const numericValue = parseFloat(value); if (isNaN(numericValue)) return;
            prevSibling.setAttribute("data-original-value", numericValue);
            prevSibling.type = "text";
            prevSibling.value = `${numericValue}% of Earnings(T)`;

        } else {
            const prevSibling = input.previousElementSibling;
            const value = prevSibling.value.trim();

            if (value === "") {
                prevSibling.setAttribute("data-original-value", "");
                return;
            }

            const numericValue = parseFloat(value); if (isNaN(numericValue)) return;

            prevSibling.setAttribute("data-original-value", numericValue);

            prevSibling.type = "text";
            prevSibling.value = `$${numericValue.toFixed(2)}`;
        }
    } else {

        const value = input.value.trim();
        // Set data-original-value to empty if value is empty, then exit
        if (value === "") {
            input.setAttribute("data-original-value", "");
            return; // Exits here if value is empty, no further code runs
        }

        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) return; // Exit if the value is not a number

        input.setAttribute("data-original-value", numericValue);

        const formats = {
            percentage: `${numericValue}% of Earnings(T)`,
            amount: `$${numericValue.toFixed(2)}`,
            rateperhour: `$${numericValue}/hr`,
            hourspershift: `${numericValue}hrs/shift`,
            shift: `${numericValue}x`,
        };

        const nextSiblingValue = input.nextElementSibling?.value;

        // If next sibling value is "%earnings", apply the percentage format and return
        if (nextSiblingValue === "%earnings") {
            input.type = "text";
            input.value = formats.percentage;
            return; // Exits the function here, no further code runs
        }

        // Apply the formatting for the input name if it exists
        if (formats[input.name]) {
            input.type = "text";
            input.value = formats[input.name];
        }
    }
}


function revertToNumberOnFocus(event) {
    const input = event.target;
    console.log('focus');
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
    // enterFullScreen();

});

// Function to save jobs to localStorage
function saveJobs() {
    const jobInputs = document.querySelectorAll('.job-input');
    const jobs = Array.from(jobInputs).map(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');
        return {
            jobName: inputs[0].value,
            hourlyRate: parseFloat(inputs[1].value.replace(/[^0-9.]/g, '')),
            hoursPerShift: parseFloat(inputs[2].value.replace(/[^0-9.]/g, '')),
            noOfShifts: parseFloat(inputs[3].value.replace(/[^0-9.]/g, '')),
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
            // amount: inputs[1].value,
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
function addJobInput(jobName = '', ratePerHour = '', hoursPerShift = '', noOfShifts = '', frequency = 'weekly') {

    if (jobInputsContainer.style.display === "none") {
        jobInputsContainer.style.display = "block"
        // jobButtons.style.display = "block";

        toggleButtonJob.textContent = "Hide list"; // Update button text
    }

    const newJobInputDiv = document.createElement('div');
    newJobInputDiv.classList.add('job-input');

    const jobNameInput = document.createElement('input');
    jobNameInput.type = 'text';
    jobNameInput.maxLength = 15;
    jobNameInput.classList.add('job-name');
    jobNameInput.placeholder = 'Job Name';
    jobNameInput.value = jobName;

    const ratePerHourInput = document.createElement('input');
    ratePerHourInput.type = 'number';
    ratePerHourInput.classList.add('rate-per-hour');
    ratePerHourInput.placeholder = '$/hr';

    ratePerHourInput.addEventListener("blur", addUnitOnBlur);
    ratePerHourInput.addEventListener("focus", revertToNumberOnFocus);
    ratePerHourInput.value = ratePerHour;
    ratePerHourInput.name = 'rateperhour';
    ratePerHourInput.dispatchEvent(new Event("blur"));

    const hoursPerShiftInput = document.createElement('input');
    hoursPerShiftInput.type = 'number';
    hoursPerShiftInput.classList.add('hours-per-shift');
    hoursPerShiftInput.placeholder = 'hrs/shift';
    hoursPerShiftInput.addEventListener("blur", addUnitOnBlur);
    hoursPerShiftInput.addEventListener("focus", revertToNumberOnFocus);
    hoursPerShiftInput.value = hoursPerShift;
    hoursPerShiftInput.name = 'hourspershift';
    hoursPerShiftInput.dispatchEvent(new Event("blur"));

    const noOfShiftsInput = document.createElement('input');
    noOfShiftsInput.type = 'number';
    noOfShiftsInput.classList.add('no-of-shifts');
    noOfShiftsInput.placeholder = 'shift Count';
    noOfShiftsInput.addEventListener("blur", addUnitOnBlur);
    noOfShiftsInput.addEventListener("focus", revertToNumberOnFocus);
    noOfShiftsInput.value = noOfShifts;
    noOfShiftsInput.name = 'shift';
    noOfShiftsInput.dispatchEvent(new Event('blur'));

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
    // document.querySelectorAll(input);
}

// Function to add a new expense input with the expense details
function addExpenseInput(expenseName = '', amount = '', frequency = 'monthly') {

    if (expenseInputsContainer.style.display === "none") {
        expenseInputsContainer.style.display = "block"; // Show the container
        // expButtons.style.display = `block`;
        toggleButtonExp.textContent = "Hide list"; // Update button text
    }

    const newExpenseInputDiv = document.createElement('div');
    newExpenseInputDiv.classList.add('expense-input');

    const expenseNameInput = document.createElement('input');
    expenseNameInput.type = 'text';
    expenseNameInput.maxLength = 15;
    expenseNameInput.classList.add('expense-name');
    expenseNameInput.placeholder = 'Expense Name';
    expenseNameInput.value = expenseName;

    const amountInput = document.createElement('input');
    amountInput.type = 'number';
    amountInput.classList.add('amount');
    amountInput.placeholder = 'Amount';
    amountInput.addEventListener("blur", addUnitOnBlur);
    amountInput.addEventListener("focus", revertToNumberOnFocus);
    // amountInput.value = amount;
    // amountInput.name = 'amount';
    // amountInput.dispatchEvent(new Event("blur"));

    const expenseFrequencySelect = document.createElement('select');

    const options = ['daily', 'weekly', 'biweekly', 'monthly', '%earnings'];
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option.charAt(0).toUpperCase() + option.slice(1);
        // console.log(optionElement.textContent);
        if (option === frequency) {
            optionElement.selected = true;
        }

        expenseFrequencySelect.appendChild(optionElement);
    });

    amountInput.value = amount;
    amountInput.name = 'amount';
    expenseFrequencySelect.name = 'select';
    expenseFrequencySelect.addEventListener('change', addUnitOnBlur);


    if (frequency === '%earnings') {
        if (amount === "") {
            amountInput.setAttribute("data-original-value", "");
        } else {
            const numericValue = parseFloat(amount);
            amountInput.setAttribute("data-original-value", numericValue);
            amountInput.type = "text";
            amountInput.value = `${amountInput.value}% of Earnings(T)`;
        }
    } else {
        amountInput.name = 'amount';
        amountInput.dispatchEvent(new Event("blur"));
    }


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

    // let totalDailySalary = 0;
    // let totalWeeklySalary = 0;
    // let totalBiweeklySalary = 0;
    let totalMonthlySalary = 0;
    // let totalYearlySalary = 0;
    let monthlySalary = 0;
    let totalSalaryForm = "";
    let formattedForm = "";
    let formattedAmount = ``;



    jobInputs.forEach(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');
        let salaryNameForm = "";
        if (inputs[0].value.trim() !== '') salaryNameForm = inputs[0].value;
        else salaryNameForm = 'No-name';

        const hourlyRate = parseFloat(inputs[1].value.replace(/[^0-9.]/g, ''));
        const hoursPerShift = parseFloat(inputs[2].value.replace(/[^0-9.]/g, ''));
        const noOfShifts = parseFloat(inputs[3].value.replace(/[^0-9.]/g, ''));
        const frequency = inputs[4].value; // frequency (daily, weekly, etc.)

        if (!isNaN(hourlyRate) && !isNaN(hoursPerShift) && !isNaN(noOfShifts)) {
            let dailySalary = 0;

            // Calculate salary based on frequency and number of shifts and rate
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

            // totalDailySalary += dailySalary;
            // totalWeeklySalary += dailySalary * 7;
            // totalBiweeklySalary += dailySalary * 14;
            totalMonthlySalary += dailySalary * 30;
            // totalYearlySalary += dailySalary * 365;



            formattedForm = salaryNameForm.padEnd(15, `\u00A0`);
            //start of new code
            formattedAmount = `$${monthlySalary.toFixed(2)}`.padStart(9, `\u00A0`);

            totalSalaryForm += `${formattedForm}:  ${formattedAmount}<br>`;

            // totalSalaryForm += `${formattedForm}:  $${monthlySalary.toFixed(2)}<br>`;
            // console.log(totalSalaryForm);
        }
    });

    return [totalMonthlySalary, totalSalaryForm];
}

// Function to compute total expenses based on all expense inputs and display it
function computeTotalExpensesReport() {
    const expenseInputs = document.querySelectorAll('.expense-input');
    // let totalDailyExpense = 0;
    // let totalWeeklyExpense = 0;
    let totalMonthlyExpense = 0;
    // let totalBiweeklyExpense = 0;
    // let totalYearlyExpense = 0;
    let monthlyExpense = 0;
    let totalExpenseForm = "";
    let formattedForm = "";
    let formattedAmount = ``;

    expenseInputs.forEach(inputDiv => {
        const inputs = inputDiv.querySelectorAll('input, select');

        let expenseNameForm = "";
        if (inputs[0].value.trim() !== '') {
            expenseNameForm = inputs[0].value;
        }
        else {
            expenseNameForm = 'No-name';
        }

        const amount = parseFloat(inputs[1].value.replace(/[^0-9.]/g, ''));
        // const amount = parseFloat(inputs[1].value);
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
            } else if (frequency === '%earnings') {
                const monthlyEarnings = computeTotalSalaryReport();
                // console.log(monthlyEarnings[0]);
                dailyExpense = (monthlyEarnings[0] * (amount / 100)) / 30;
            }


            monthlyExpense = dailyExpense * 30;

            // totalDailyExpense += dailyExpense;
            // totalWeeklyExpense += dailyExpense * 7;
            // totalBiweeklyExpense += dailyExpense * 14;
            totalMonthlyExpense += monthlyExpense;
            // totalYearlyExpense += dailyExpense * 365;


            formattedForm = expenseNameForm.padEnd(15, `\u00A0`);
            formattedAmount = `$${monthlyExpense.toFixed(2)}`.padStart(9, `\u00A0`);

            totalExpenseForm += `${formattedForm}:  ${formattedAmount}<br>`;
            // totalExpenseForm += expenseNameForm + ": $" + monthlyExpense.toFixed(2) + "\n";
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

    //     totalDisplay.innerHTML += ` 
    //     <p style="margin: 2px 0; padding: 0; color: #66bb6a;">MONTHLY EARNINGS <br>----------------<br> ${totalSalaryReport[1]}<strong>----------------<br>TOTAL:</strong> $${totalSalaryReport[0].toFixed(2)}</p>
    //     <p style="margin: 2px 0; padding: 0;">===================</p>
    // `;

    const str = `TOTAL`;
    const formattedTotal = str.padEnd(15, `\u00A0`);
    const formattedSalary = `$${totalSalaryReport[0].toFixed(2)}`.padStart(9, `\u00A0`);

    totalDisplay.innerHTML += ` 
<p style="margin: 2px 0; padding: 0; color: #66bb6a;">
    <strong>MONTHLY EARNINGS</strong> <br>--------------------------------<br> 
    ${totalSalaryReport[1]}--------------------------------<br>
    <strong>${formattedTotal}: ${formattedSalary}</strong>
</p>
<p style="margin: 5px 0; padding: 0; color: #66bb6a;">================================</p>
`;
    totalDisplay.scrollTop = totalDisplay.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
});


computeExpenseButton.addEventListener('click', () => {
    const totalExpenseReport = computeTotalExpensesReport();

    const str = `TOTAL`;
    const formattedTotal = str.padEnd(15, `\u00A0`);
    const formattedExpense = `$${totalExpenseReport[0].toFixed(2)}`.padStart(9, `\u00A0`);
    totalDisplay.innerHTML += ` 
<p style="margin: 2px 0; padding: 0; color:#e57373;">
    <strong>MONTHLY EXPENSES</strong> <br>--------------------------------<br> 
    ${totalExpenseReport[1]}--------------------------------<br>
    <strong>${formattedTotal}: ${formattedExpense}</strong>
</p>
<p style="margin: 5px 0; padding: 0; color: #e57373">================================</p>
`;

    //     totalDisplay.innerHTML += ` 
    // <p style="margin: 2px 0; padding: 0; color: #e57373;">MONTHLY EXPENSES <br>----------------<br> ${totalExpenseReport[1].replace(/\n/g, `<br>`)}<b>----------------<br>TOTAL:</b> $${totalExpenseReport[0].toFixed(2)}</p>
    // <p style="margin: 2px 0; padding: 0;">===================</p>
    // `;
    totalDisplay.scrollTop = totalDisplay.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);
});


netIncomeButton.addEventListener('click', () => {
    const totalSalaryReport = computeTotalSalaryReport();
    const totalExpenseReport = computeTotalExpensesReport();

    const netIncome = totalSalaryReport[0] - totalExpenseReport[0];



    const salaryName = `Earnings`;
    const formattedSalaryName = salaryName.padEnd(15, `\u00A0`);
    const salaryAmount = totalSalaryReport[0].toFixed(2);
    const formattedSalaryAmount = `$${salaryAmount}`.padStart(9, `\u00A0`);

    const expenseName = `Expenses`;
    const formattedExpenseName = expenseName.padEnd(15, `\u00A0`);
    const expenseAmount = totalExpenseReport[0].toFixed(2);
    const formattedExpenseAmount = `$${expenseAmount}`.padStart(9, `\u00A0`);

    const str = `TOTAL`;
    const formattedTotal = str.padEnd(15, `\u00A0`);
    const formattedNetIncome = `$${netIncome.toFixed(2)}`.padStart(9, `\u00A0`);

    totalDisplay.innerHTML += `
        <p style="margin: 2px 0; padding: 0;  color: #3388cc;">
        <strong>MONTHLY NET INCOME</strong> <br>
        --------------------------------<br>
        ${formattedSalaryName}: ${formattedSalaryAmount} <br>
        ${formattedExpenseName}: ${formattedExpenseAmount} <br>
        --------------------------------<br>
        <strong>${formattedTotal}: ${formattedNetIncome}</strong> <br>
        <p style="margin: 5px 0; padding: 0; color: #3388cc">================================</p>



    `;
    totalDisplay.scrollTop = totalDisplay.scrollHeight;
    window.scrollTo(0, document.body.scrollHeight);

    // totalDisplay.innerHTML += `
    //     <p style="margin: 2px 0; padding: 0;  color: #3388cc;">MONTHLY NET INCOME <br>----------------<br> Salary: <span style="color: rgb(25, 131, 25);">
    //     $${totalSalaryReport[0].toFixed(2)} </span> <br> Expenses: <span style="color: #e57373;">$${totalExpenseReport[0].toFixed(2)}
    //     </span> <br>----------------<br> ${formattedTotal} $${netIncome.toFixed(2)}</p>
    //     <p style="margin: 2px 0; padding: 0;">===================</p>
    // `;



    // Display net income
});


clearButton.addEventListener('click', () => {
    totalDisplay.innerHTML = '';  // Clears the content
});

// Event listener for saving data
saveButton.addEventListener('click', () => {
    saveJobs();
    saveExpenses();
    alert('Data saved successfully! Note: Clearing your browser\'s cache or history may delete the saved data.');

});

title.addEventListener(`click`, () => {
    alert(`Para sa Bills and Responsibilities!!`);
});


// toggleButton.addEventListener('click', () => {
//     jobInputsContainer.style.display = 'none';
// });

toggleButtonJob.addEventListener("click", () => {

    const availJob = jobInputsContainer.querySelectorAll('div');

    if (availJob.length > 0) {
        if (jobInputsContainer.style.display === "none") {
            jobInputsContainer.style.display = "block"; // Show the container
            // jobButtons.style.display = "block";
            toggleButtonJob.textContent = "Hide list"; // Update button text
        } else {
            jobInputsContainer.style.display = "none"; // Hide the container
            // jobButtons.style.display = "none"
            toggleButtonJob.textContent = "Show list"; // Update button text
        }
    } else {
        alert('Nothing to Hide! Wala kang trabaho. Maghanap ka.');
    }


});

toggleButtonExp.addEventListener("click", () => {

    const availExp = expenseInputsContainer.querySelectorAll(`div`);

    if (availExp.length > 0) {

        if (expenseInputsContainer.style.display === "none") {
            expenseInputsContainer.style.display = "block"; // Show the container
            // expButtons.style.display = `block`;
            toggleButtonExp.textContent = "Hide list"; // Update button text
        } else {
            expenseInputsContainer.style.display = "none"; // Hide the container
            // expButtons.style.display = `none`
            toggleButtonExp.textContent = "Show list"; // Update button text
        }
    } else {
        alert('Nothing to Hide! Gumastos ka naman.');
    }
});