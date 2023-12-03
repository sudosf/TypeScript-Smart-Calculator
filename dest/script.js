"use strict";
window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
});
class Calculator {
    constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.prevResult = 0;
        this.currResult = 0;
    } // constructor
    calculate(expression = this.currExpression) {
        // evaluate expression inside parenthesis
        this.currExpression = this.resolveParenthesis(expression);
        // evaluate exponents
        this.currExpression = this.resolveExponent(expression);
        // evaluate multiplication and division first
        // evaluate addition and subtraction
        return 0;
    } // calculate
    resolveParenthesis(expression) {
        let resolvedExpression = "";
        while (expression.includes("(")) {
            const startIndex = expression.lastIndexOf("(");
            const endIndex = expression.indexOf(")", startIndex);
            // mismatched parenthesis, exit loop
            if (startIndex === -1 || endIndex === -1)
                break;
            // get sub-expression inside parenthesis
            const subExpression = expression.slice(startIndex + 1, endIndex);
            const result = this.calculate(subExpression).toString();
            // update expression with resolved parenthesis result
            resolvedExpression =
                expression.slice(0, startIndex) +
                    result +
                    expression.slice(endIndex + 1);
        }
        return resolvedExpression !== "" ? resolvedExpression : expression;
    } // resolveParenthesis
    resolveExponent(expression) {
        let resolvedExpression = "";
        while (expression.includes("^")) {
            const [base, exponent] = expression
                .split("^")
                .map(parseFloat);
            const result = Math.pow(base, exponent).toString();
            resolvedExpression = expression.replace(`${base}^${exponent}`, result);
        }
        return resolvedExpression !== "" ? resolvedExpression : expression;
    } // resolveExponent
    resolveMulAndDiv(expression) {
        let resolvedExpression = "";
        while (expression.match(/[*/]/)) {
            const match = expression.match(/([\d.]+)([*/])([/d.]+)/);
        }
        return resolvedExpression !== "" ? resolvedExpression : expression;
    } //resolveMulAndDiv
    appendCurrExpression(char) {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "=":
                    console.log(this.calculate());
                    break;
                case "AC":
                    this.currExpression = "";
                    break;
                case "Backspace":
                    this.currExpression = this.currExpression.slice(0, -1);
                    break;
                default:
                    if (this.isOperator(char)) {
                        // ensure operators are separated by spaces
                        this.currExpression += ` ${char} `;
                    }
                    else {
                        this.currExpression === "0"
                            ? (this.currExpression = char)
                            : (this.currExpression += char);
                    }
                    break;
            }
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
        const keys = ["(", ")", "Backspace", "AC", "=", "^", "."];
        return keys.includes(char);
    } // isValidKey
    isNumber(char) {
        return isFinite(parseInt(char));
    } // isNumber
} // Calculator class
let calculator = new Calculator();
// current expression display
const inputDisplay = document.querySelector("#calc-display");
// previous expression display
const inputPrevDisplay = document.querySelector("#calc-prev-display");
const errorMessage = document.querySelector("#errorMessage");
// check for user inputs from keyboard
inputDisplay.addEventListener("keydown", function (event) {
    const key = event.key; // "a", "1", "Shift", etc.
    // console.log(key);
    appendCharacter(key);
});
function appendCharacter(char) {
    calculator.appendCurrExpression(char);
    updateDisplay();
}
function updateDisplay() {
    inputDisplay.value = calculator.getCurrExpression();
    inputPrevDisplay.value = calculator.getPrevExpression();
    errorMessage.innerHTML = calculator.getExpressionError();
    // toggle error message visibility
    if (calculator.getExpressionError() == "") {
        errorMessage.style.display = "none";
    }
    else {
        errorMessage.style.display = "block";
        setTimeout(function () {
            $("#errorMessage").fadeOut("slow");
        }, 3000); // <-- time in milliseconds
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
