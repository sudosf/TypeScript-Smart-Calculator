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
    }
    calculate() {
        return "in progress";
    }
    appendCurrExpression(char) {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "=":
                    this.calculate();
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
        //this.currExpression.replace(/[^0-9+-/*]/g, "");
        console.log(this.currExpression);
        // console.log();
    }
    getCurrExpression() {
        return this.currExpression;
    }
    getPrevExpression() {
        return this.prevExpression;
    }
    getExpressionError() {
        return this.expressionError;
    }
    // public helper functions
    isValidInput(input) {
        return (this.isOperator(input) ||
            this.isValidKey(input) ||
            this.isNumber(input));
    }
    // private helper functions
    isOperator(char) {
        const operators = ["+", "-", "*", "/"];
        return operators.includes(char);
    }
    isValidKey(char) {
        const keys = ["(", ")", "Backspace", "AC"];
        return keys.includes(char);
    }
    isNumber(char) {
        return isFinite(parseInt(char));
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
