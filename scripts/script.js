const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.calculator-screen');
const keys = calculator.querySelector('.calculator-keys');

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target;
        const action = key.dataset.action;
        const keyContent = key.textContent;
        const displayedNum = screen.textContent;
        const previousKeyType = calculator.dataset.previousKeyType;

        if (!action) {
            console.log('number key!');
            if (displayedNum === '0' || previousKeyType === 'operator') {
                screen.textContent = keyContent;
            } else {
                screen.textContent = displayedNum + keyContent;
            }
            calculator.dataset.previousKeyType = 'number';
        }

        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            console.log('operator key!');
            const firstValue = calculator.dataset.firstValue;
            console.log(firstValue);
            const secondValue = displayedNum;
            console.log(secondValue);
            const operator = calculator.dataset.operator;

            if (firstValue && 
                operator &&
                previousKeyType !== 'operator'
            ) {
                const calcValue = operate(firstValue, secondValue, operator);
                screen.textContent = calcValue;

                calculator.dataset.firstValue = calcValue;
            } else {
                calculator.dataset.firstValue = displayedNum;
            }

            key.classList.add('is-depressed');
            calculator.dataset.previousKeyType = 'operator';
            calculator.dataset.operator = action;
        }

        if (action === 'decimal') {
            console.log('decimal key!');
            if (!displayedNum.includes('.') && previousKeyType != 'operator') {
                screen.textContent = displayedNum + '.';
            } else if (previousKeyType === 'operator') {
                screen.textContent = '0.';
            }
            calculator.dataset.previousKeyType = 'decimal';
        }

        if (action === 'clear') {
            console.log('clear key!');
            calculator.dataset.previousKeyType = 'clear';
        }

        if (action === 'equal') {
            let firstValue = calculator.dataset.firstValue;
            let secondValue = displayedNum;
            const operator = calculator.dataset.operator;

            if (firstValue) {
                if (previousKeyType === 'equal') {
                    firstValue = displayedNum;
                    secondValue = calculator.dataset.modValue;
                }
                screen.textContent = operate(firstValue, secondValue, operator);
            }
            
            calculator.dataset.modValue = secondValue;
            calculator.dataset.previousKeyType = 'equal';
        }

        Array.from(key.parentNode.children)
            .forEach(k => key.classList.remove('is-depressed'));
    }
});



// operator functions
function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b
}

function divide(a, b) {
    return a / b;
}

function operate(a, b, operator) {
    let result = '';
    a = parseFloat(a);
    b = parseFloat(b);

    if (operator === 'add') {
        result = add(a, b);
    } else if (operator === 'subtract') {
        result = subtract(a, b);
    } else if (operator === 'multiply') {
        result = multiply(a, b);
    } else if (operator === 'divide') {
        result = divide(a, b);
    }

    return result;
}