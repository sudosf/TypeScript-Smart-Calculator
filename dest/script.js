"use strict";
window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
    let darkModeStatus = localStorage.getItem("darkModeStatus");
    // check if darkModeSTATUS is set
    if (darkModeStatus) {
        if (darkModeStatus === "enabled")
            toggleDarkMode();
    }
});
class Calculator {
    constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.result = "";
    } // constructor
    calculate(expression = this.currExpression) {
        expression = expression.replace(/\s/g, ""); // remove whitespace
        // evaluate expression inside parenthesis
        expression = this.resolveParenthesis(expression);
        // evaluate exponents
        expression = this.resolveExponent(expression);
        // evaluate multiplication and division first
        expression = this.resolveMulAndDiv(expression);
        // evaluate addition and subtraction
        expression = this.resolveAddAndSub(expression);
        this.currExpression = expression;
        console.log("expression: " + expression);
        this.validateResult(expression);
        return this.currExpression;
    } // calculate
    validateResult(expression) {
        console.log("isValidResult: " + this.isExpressionNumber(expression));
        // check if any errors where detected
        // update expression if
        // no error message is set
        if (expression.length === 0) {
            if (this.isExpressionErrorEmpty())
                this.expressionError = "please enter an expression";
        }
        else if (!this.isExpressionNumber(expression)) {
            if (this.isExpressionErrorEmpty())
                this.expressionError = "ERROR";
        }
    } // validateResult
    isExpressionErrorEmpty() {
        return this.expressionError === "";
    }
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
            if (this.isCharNumber(subExpression)) {
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
            if (!this.isCharNumber(base.toString()) ||
                !this.isCharNumber(exponent.toString())) {
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
            return "";
        }
        else if (!this.isCharNumber(expression)) {
            this.expressionError = "invalid square operation";
            return "";
        }
        else if (parseFloat(expression) < 0) {
            this.expressionError = "invalid negative square operation";
        }
        const result = Math.sqrt(parseFloat(expression));
        this.currExpression = result.toString();
        return result.toString();
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
        while (expression.match(/[+\-]/)) {
            const match = expression.match(/([\d.]+)([+\-])([\d.]+)/);
            if (match) {
                let [_, operand1, operator, operand2] = match;
                if (!operand1 || !operand2) {
                    this.expressionError = "incomplete expression";
                    break;
                }
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
    onInputReceived(char) {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "Enter":
                case "=":
                    this.setPrevExpression(this.currExpression);
                    const result = this.calculate();
                    this.setResult(result);
                    break;
                case "AC":
                    // use function or variable?
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
                    this.setResult(sqrtResult);
                    break;
                default:
                    this.isOperator(char)
                        ? (this.currExpression += ` ${char} `)
                        : (this.currExpression += char);
                    break;
            }
        }
        else {
            this.expressionError = "please enter valid input";
        }
    } // onInputReceived
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
            this.isCharNumber(input));
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
            " ",
            "Space",
        ];
        return keys.includes(char);
    } // isValidKey
    isCharNumber(char) {
        return typeof parseFloat(char) === "number" && !isNaN(parseFloat(char));
    } // isCharNumber
    isExpressionNumber(expression) {
        const matchResult = expression.match(/[0-9+\-*/.]+/);
        return matchResult ? true : false;
    } //isExpressionNumber
    replaceFirstChar(myString, replacement) {
        return replacement + myString.slice(1);
    }
} // Calculator class
let calculator = new Calculator();
// current expression display
const inputDisplay = document.querySelector("#calc-display");
// previous expression display
const inputPrevDisplay = document.querySelector("#calc-prev-display");
const sunMoonContainer = document.querySelector(".sun-moon-container");
// store darkmode status for page reload
let darkMode = localStorage.getItem("darkModeStatus");
const toggleBtn = document.querySelector(".theme-toggle-button");
toggleBtn.addEventListener("click", () => {
    toggleDarkMode();
    const currentRotation = parseInt(getComputedStyle(sunMoonContainer).getPropertyValue("--rotation"));
    sunMoonContainer.style.setProperty("--rotation", (currentRotation + 180).toString());
});
// check for user inputs from keyboard
inputDisplay.addEventListener("keydown", function (event) {
    event.preventDefault();
    console.log("keyPressed: " + event.key);
    onKeyPressed(event.key);
});
function toggleDarkMode() {
    const isEnabled = document.body.classList.toggle("dark");
    // store in local storage
    localStorage.setItem("darkModeStatus", isEnabled ? "enabled" : "disabled");
} /* Darkmode Toggle */
function onKeyPressed(char) {
    calculator.onInputReceived(char);
    updateDisplay();
}
function updateDisplay() {
    inputDisplay.value = calculator.getCurrExpression();
    inputPrevDisplay.value = `${calculator.getPrevExpression()} = ${calculator.getResult()}`;
    if (calculator.getExpressionError() !== "") {
        inputPrevDisplay.value = calculator.getExpressionError();
    }
    // TODO:
    // check what inputs are invalid
}
