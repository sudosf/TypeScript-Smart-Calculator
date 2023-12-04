"use strict";
window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
});
class Calculator {
    constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.result = 0;
    } // constructor
    calculate(expression = this.currExpression) {
        // evaluate expression inside parenthesis
        expression = this.resolveParenthesis(expression);
        // evaluate exponents
        expression = this.resolveExponent(expression);
        // evaluate multiplication and division first
        expression = this.resolveMulAndDiv(expression);
        // evaluate addition and subtraction
        expression = this.resolveAddAndSub(expression);
        this.currExpression = expression;
        return parseFloat(this.currExpression);
    } // calculate
    resolveParenthesis(expression) {
        while (expression.includes("(") || expression.includes(")")) {
            const startIndex = expression.lastIndexOf("(");
            const endIndex = expression.indexOf(")", startIndex);
            // mismatched parenthesis, exit loop
            if (startIndex === -1 || endIndex === -1) {
                this.expressionError = "missing parenthesis";
                break;
            }
            // get sub-expression inside parenthesis
            const subExpression = expression.slice(startIndex + 1, endIndex);
            let result = "";
            if (this.isNumber(subExpression)) {
                result = subExpression;
            }
            else {
                result = this.calculate(subExpression).toString();
            }
            // remove parenthesis and....
            // update expression with resolved result
            expression =
                expression.slice(0, startIndex) +
                    result +
                    expression.slice(endIndex + 1);
        }
        console.log("parenthesis: " + expression);
        return expression;
    } // resolveParenthesis
    resolveExponent(expression) {
        while (expression.includes("^")) {
            const [base, exponent] = expression
                .split("^")
                .map(parseFloat);
            if (!this.isNumber(base.toString()) ||
                !this.isNumber(exponent.toString())) {
                this.expressionError = "invalid expression";
                break;
            }
            const result = Math.pow(base, exponent).toString();
            expression = expression.replace(`${base}^${exponent}`, result);
        }
        console.log("exp: " + expression);
        return expression;
    } // resolveExponent
    resolveSqrt(expression) {
        if (expression === "") {
            this.expressionError = "empty expression";
            return 0;
        }
        else if (!this.isNumber(expression)) {
            this.expressionError = "invalid square operation";
            return 0;
        }
        else if (parseFloat(expression) < 0) {
            this.expressionError = "invalid negative square operation";
        }
        const result = Math.sqrt(parseFloat(expression));
        this.currExpression = result.toString();
        return result;
    } // resolveSqrt
    resolveMulAndDiv(expression) {
        while (expression.match(/[*/]/)) {
            const match = expression.match(/([\d.]+)([*/])([\d.]+)/);
            if (match) {
                const [_, operand1, operator, operand2] = match;
                let result = 0;
                if (operator === "*") {
                    result = parseFloat(operand1) * parseFloat(operand2);
                }
                else {
                    parseFloat(operand2) !== 0
                        ? (result = parseFloat(operand1) / parseFloat(operand2))
                        : (this.expressionError = "division by zero error");
                }
                expression = expression.replace(match[0], result.toString());
            }
            else {
                break;
            }
        }
        console.log("multi: " + expression);
        return expression;
    } //resolveMulAndDiv
    resolveAddAndSub(expression) {
        // Perform addition and subtraction
        while (expression.match(/[+-]/)) {
            const match = expression.match(/([\d.]+)([+-])([\d.]+)/);
            if (match) {
                let [_, operand1, operator, operand2] = match;
                // if expression has a preceding negative number
                // negate operand and remove operator
                // specifying negative/positive value
                let firstChar = expression.charAt(0);
                switch (firstChar) {
                    case "+":
                        // remove preceding operator
                        expression = this.replaceFirstChar(expression, "");
                        break;
                    case "-":
                        operand1 = (parseFloat(operand1) * -1).toString();
                        expression = this.replaceFirstChar(expression, "");
                        break;
                    default:
                        break;
                }
                const result = operator === "+"
                    ? parseFloat(operand1) + parseFloat(operand2)
                    : parseFloat(operand1) - parseFloat(operand2);
                expression = expression.replace(match[0], result.toString());
            }
            else {
                break;
            }
        }
        console.log("add: " + expression);
        return expression;
    } // resolveAddAndSub
    appendCurrExpression(char) {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "Enter":
                case "=":
                    this.prevExpression = this.currExpression;
                    const result = this.calculate();
                    this.result = result;
                    break;
                case "AC":
                    this.currExpression = "";
                    break;
                case "Backspace":
                    this.currExpression = this.currExpression.slice(0, -1);
                    break;
                case "pie":
                    this.currExpression += Math.PI.toString();
                    break;
                case "sqrt":
                    const sqrtResult = this.resolveSqrt(this.currExpression);
                    this.result = sqrtResult;
                    break;
                default:
                    this.currExpression += char;
                    console.log("currExpression_append: " + this.currExpression);
                    break;
            }
            // updateDisplay();
        }
        else {
            this.expressionError = "please enter valid input";
        }
    } // appendCurrExpression
    /* Getters */
    getCurrExpression() {
        return this.currExpression;
    } // getCurrExpression
    getPrevExpression() {
        return this.prevExpression;
    } // getPrevExpression
    getExpressionError() {
        return this.expressionError;
    } // getExpressionError
    getResult() {
        return this.result.toString();
    } //getResult
    /* Setters */
    setPrevExpression(expression) {
        this.prevExpression = this.currExpression;
    } // setPrevExpression
    setResult(result) {
        this.result = result;
    } //setResult
    /* public helper functions */
    isValidInput(input) {
        return (this.isOperator(input) ||
            this.isValidKey(input) ||
            this.isNumber(input));
    } // isValidInput
    /* private helper functions */
    isOperator(char) {
        const operators = ["+", "-", "*", "/"];
        return operators.includes(char);
    } // isOperator
    isValidKey(char) {
        const keys = [
            "(",
            ")",
            "Backspace",
            "AC",
            "=",
            "^",
            ".",
            "Enter",
            "pie",
            "sqrt",
        ];
        return keys.includes(char);
    } // isValidKey
    isNumber(char) {
        return typeof parseFloat(char) === "number" && !isNaN(parseFloat(char));
    } // isNumber
    replaceFirstChar(myString, replacement) {
        return replacement + myString.slice(1);
    }
} // Calculator class
let calculator = new Calculator();
// current expression display
const inputDisplay = document.querySelector("#calc-display");
// previous expression display
const inputPrevDisplay = document.querySelector("#calc-prev-display");
const errorMessage = document.querySelector("#errorMessage");
// check for user inputs from keyboard
inputDisplay.addEventListener("keydown", function (event) {
    event.preventDefault();
    const key = event.key; // "a", "1", "Shift", etc.
    inputPrevDisplay.value = `type: ${event.type} val: ${key}`;
    appendCharacter(key);
});
function appendCharacter(char) {
    console.log("appendChar: " + char);
    calculator.appendCurrExpression(char);
    updateDisplay();
}
function updateDisplay() {
    inputDisplay.value = calculator.getCurrExpression();
    // inputPrevDisplay.value = `${calculator.getPrevExpression()} = ${calculator.getResult()}`;
    errorMessage.innerHTML = calculator.getExpressionError();
    // toggle error message visibility
    if (calculator.getExpressionError() == "") {
        errorMessage.style.display = "none";
    }
    else {
        errorMessage.style.display = "block";
        setTimeout(function () {
            $("#errorMessage").fadeOut("slow");
        }, 5000); // <-- time in milliseconds
    }
    // TODO:
    // update prevExpression after calculate()
    // check what inputs are invalid
}
/* Darkmode Toggle */
const sunMoonContainer = document.querySelector(".sun-moon-container");
const toggleBtn = document.querySelector(".theme-toggle-button");
toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const currentRotation = parseInt(getComputedStyle(sunMoonContainer).getPropertyValue("--rotation"));
    sunMoonContainer.style.setProperty("--rotation", (currentRotation + 180).toString());
});
