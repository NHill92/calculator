const calculator = document.querySelector('.calculator');
const screen = document.querySelector('.calculator-screen');
const keys = calculator.querySelector('.calculator-keys');

const getKeyType = key => {
    const { action } = key.dataset
    if (!action) return 'number';
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator';
    return action;
}

const createResultString = (key, displayedNum, state) => {
    const keyType = getKeyType(key);
    const keyContent = key.textContent;
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = state;

    if (keyType === 'number') {
        return displayedNum === '0' ||
        previousKeyType === 'operator' ||
        previousKeyType === 'equal'
        ? keyContent
        : displayedNum + keyContent;
    }

    if (keyType === 'decimal') {
        if (!displayedNum.includes('.')) return displayedNum + '.';
        if (previousKeyType === 'operator' || previousKeyType === 'equal') return '0.';
        return displayedNum;
    }

    if (keyType === 'operator') {
        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'equal'
        ? operate(firstValue, displayedNum, operator)
        : displayedNum;
    }

    if (keyType === 'clear') return 0;

    if (keyType === 'equal') {
        return firstValue
            ? previousKeyType === 'equal'
                ? operate(displayedNum, modValue, operator)
                : operate(firstValue, displayedNum, operator)
            : displayedNum;
    }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
    const keyType = getKeyType(key);
    const {
        firstValue,
        operator,
        modValue,
        previousKeyType
    } = calculator.dataset;

    calculator.dataset.previousKeyType = keyType;

    if (keyType === 'operator') {
        calculator.dataset.operator = key.dataset.action;
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'equal'
            ? calculatedValue
            : displayedNum;
    }

    if (keyType === 'equal') {
        calculator.dataset.modValue = firstValue &&
            previousKeyType === 'equal'
                ? modValue
                : displayedNum;
    }

    if (keyType === 'clear' && key.textContent === 'AC') {
        calculator.dataset.firstValue = '';
        calculator.dataset.modValue = '';
        calculator.dataset.operator = '';
        calculator.dataset.previousKeyType = '';
    }
}

const updateVisualState = (key, calculator) => {
    const keyType = getKeyType(key);
    Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

    if (keyType === 'operator') key.classList.add('is-depressed');
    if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC';
    if (keyType !== 'clear') {
        const clearBtn = calculator.querySelector('[data-action=clear]');
        clearBtn.textContent = 'CE';
    }
}


keys.addEventListener('click', e => {
    if (!e.target.matches('button')) return
    const key = e.target
    const displayedNum = screen.textContent;
    const resultString = createResultString(key, displayedNum, calculator.dataset);

    screen.textContent = resultString;
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator);  
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
    a = parseFloat(a);
    b = parseFloat(b);
    if (operator === 'add') return add(a, b);
    if (operator === 'subtract') return subtract(a, b);
    if (operator === 'multiply') return multiply(a, b);
    if (operator === 'divide') return divide(a, b);
}