var calculator = new Calculator();
var operations = new Set(['/', '+', '-', '*']);

// A different function will run depending on which key is pressed.
// This structure maps the response for each type of key.
var keyFunctionMapper = {
  'number' : handleNumberKey,
  'operator' : handleOperatorKey,
  'decimal':  handleDecimalKey,
  'equal': handleEqualKey,
  'clear': resetCalculator
}

function Calculator() {
  this.leftOfOperation = "";
  this.rightOfOperation = "";
  this.operation = "";
  this.currentDisplayValue = "";
  this.runningTotal = 0;
  this.expressionCompleted = false;
}

Calculator.prototype.keypadElement = document.querySelector("#keypad");

Calculator.prototype.displayElement = document.querySelector(".display");

function resetCalculator() {
  calculator.reset();
}

Calculator.prototype.reset = function() {
  this.leftOfOperation = "";
  this.rightOfOperation = "";
  this.operation = "";
  this.currentDisplayValue = "";
  this.runningTotal = 0;
  this.expressionCompleted = false;
}

Calculator.prototype.hasDecimal = function(value) {
  return value.indexOf(".") < 0 ? false : true;
}

Calculator.prototype.calculate = function(operation) {
  if (operation === "/" || operation === "÷") {
    if (+this.rightOfOperation === 0) {
      return "Infinity";
    }
    return +this.leftOfOperation / +this.rightOfOperation;
  }

  console.log('Expression: ', this.leftOfOperation , operation , this.rightOfOperation)

  if (operation === "-") {
    return +this.leftOfOperation - +this.rightOfOperation;
  }
  if (operation === "+") {
    return +this.leftOfOperation + +this.rightOfOperation;
  }
  if (operation === "*" || operation === "x") {
    return +this.leftOfOperation * +this.rightOfOperation;
  }
}

////////////////////////

document.addEventListener("DOMContentLoaded", function() {
  initializeCalculatorPage();
  calculator.keypadElement.addEventListener("click", handleClick);

  // FOR LATER: tying keyboard events to the input
  // document.addEventListener("keypress", function(e) {
  //   console.log(e);
  //   document.querySelector(".current-op").innerHTML = e.key;
  // });
});

function initializeCalculatorPage() {
  calculator.displayElement.innerHTML = calculator.currentDisplayValue;
}

////////////////////////

function handleClick(event) {
  // 1. Update calculator object.
  // 2. Append to the screen.

  let handlerFunction = keyFunctionMapper[event.target.classList[0]];
  if (event.target.classList[0] === 'clear') {
    handlerFunction();
  }
  else {
    let currentDisplayValue = event.target.innerHTML.trim();

    if (handlerFunction) {
      handlerFunction(currentDisplayValue);
    }

  }
  appendToScreen(event);    
}

function handleNumberKey(value) {
  if (calculator.expressionCompleted) { // equal sign has been entered
    calculator.reset();
  }

  if (!calculator.operation) { // no operation received yet
    calculator.leftOfOperation += value;
    calculator.currentDisplayValue = calculator.leftOfOperation;
  }
  else { // there IS an operation
    calculator.rightOfOperation += value;
    calculator.currentDisplayValue += calculator.rightOfOperation;
  }
}

function handleOperatorKey(value) {
  if (calculator.expressionCompleted) { // equal sign has been entered
    let previousTotal = calculator.runningTotal;
    calculator.reset();
    calculator.leftOfOperation = previousTotal;
    calculator.currentDisplayValue = previousTotal;
  }

  if (calculator.leftOfOperation) {
    if (!calculator.operation) {
      calculator.operation = value;
    }
    else if (calculator.rightOfOperation) {
      calculator.runningTotal = calculator.calculate(calculator.operation);
      calculator.leftOfOperation = String(calculator.runningTotal);
      calculator.rightOfOperation = "";
      calculator.operation = value;
      
    }
    calculator.currentDisplayValue += value;
  }
}

function handleDecimalKey(value) {
  if (calculator.operation) { // if there's already an operation, we can ignore left of op; check if right side already has decimal
    if (!calculator.hasDecimal(calculator.rightOfOperation)) {
      calculator.rightOfOperation += value;
      calculator.currentDisplayValue += value;
    }
  }
  else { // check left of op
    if (!calculator.hasDecimal(calculator.leftOfOperation)) {
      calculator.leftOfOperation += value;
      calculator.currentDisplayValue += value;
    }
  }
}

function handleEqualKey(value) {
  if (calculator.rightOfOperation) {
    calculator.runningTotal = calculator.calculate(calculator.operation);
    calculator.fullExpression = calculator.fullExpression + "=" + calculator.runningTotal;
    calculator.currentDisplayValue = calculator.runningTotal;
    calculator.leftOfOperation = calculator.runningTotal;
    calculator.expressionCompleted = true;
  }
}

function appendToScreen() {
  calculator.displayElement.value = calculator.currentDisplayValue;
}