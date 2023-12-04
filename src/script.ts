window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();

    let darkModeStatus = localStorage.getItem("darkModeStatus");
    // check if darkModeSTATUS is set
    if (darkModeStatus) {
        if (darkModeStatus === "enabled") toggleDarkMode();
    }
});

class Calculator {
    private currExpression: string;
    private prevExpression: string;
    private expressionError: string;

    private result: number;

    public constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.result = 0;
    } // constructor

    public calculate(expression: string = this.currExpression): number {
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

    public resolveParenthesis(expression: string): string {
        while (expression.includes("(") || expression.includes(")")) {
            const startIndex: number = expression.lastIndexOf("(");
            const endIndex: number = expression.indexOf(")", startIndex);

            // mismatched parenthesis, exit loop
            if (startIndex === -1 || endIndex === -1) {
                this.expressionError = "missing parenthesis";
                break;
            }

            // get sub-expression inside parenthesis
            const subExpression: string = expression.slice(
                startIndex + 1,
                endIndex
            );

            let result: string = "";
            if (this.isNumber(subExpression)) {
                result = subExpression;
            } else {
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

    public resolveExponent(expression: string): string {
        while (expression.includes("^")) {
            const [base, exponent]: number[] = expression
                .split("^")
                .map(parseFloat);

            if (
                !this.isNumber(base.toString()) ||
                !this.isNumber(exponent.toString())
            ) {
                this.expressionError = "invalid expression";
                break;
            }
            const result: string = Math.pow(base, exponent).toString();

            expression = expression.replace(`${base}^${exponent}`, result);
        }
        console.log("exp: " + expression);

        return expression;
    } // resolveExponent

    public resolveSqrt(expression: string): number {
        if (expression === "") {
            this.expressionError = "empty expression";
            return 0;
        } else if (!this.isNumber(expression)) {
            this.expressionError = "invalid square operation";
            return 0;
        } else if (parseFloat(expression) < 0) {
            this.expressionError = "invalid negative square operation";
        }

        const result: number = Math.sqrt(parseFloat(expression));
        this.currExpression = result.toString();
        return result;
    } // resolveSqrt

    public resolveMulAndDiv(expression: string): string {
        while (expression.match(/[*/]/)) {
            const match = expression.match(/([\d.]+)([*/])([\d.]+)/);

            if (match) {
                const [_, operand1, operator, operand2]: string[] = match;

                let result: number = 0;
                if (operator === "*") {
                    result = parseFloat(operand1) * parseFloat(operand2);
                } else {
                    parseFloat(operand2) !== 0
                        ? (result = parseFloat(operand1) / parseFloat(operand2))
                        : (this.expressionError = "division by zero error");
                }

                expression = expression.replace(match[0], result.toString());
            } else {
                break;
            }
        }

        console.log("multi: " + expression);

        return expression;
    } //resolveMulAndDiv

    public resolveAddAndSub(expression: string): string {
        // Perform addition and subtraction
        while (expression.match(/[+-]/)) {
            const match = expression.match(/([\d.]+)([+-])([\d.]+)/);

            if (match) {
                let [_, operand1, operator, operand2]: string[] = match;

                // if expression has a preceding negative number
                // negate operand and remove operator
                // specifying negative/positive value
                let firstChar: string = expression.charAt(0);
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

                const result: number =
                    operator === "+"
                        ? parseFloat(operand1) + parseFloat(operand2)
                        : parseFloat(operand1) - parseFloat(operand2);

                expression = expression.replace(match[0], result.toString());
            } else {
                break;
            }
        }
        console.log("add: " + expression);

        return expression;
    } // resolveAddAndSub

    public appendCurrExpression(char: string): void {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "Enter":
                case "=":
                    this.prevExpression = this.currExpression;

                    const result: number = this.calculate();
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
                    const sqrtResult: number = this.resolveSqrt(
                        this.currExpression
                    );
                    this.result = sqrtResult;
                    break;
                default:
                    this.currExpression += char;

                    console.log(
                        "currExpression_append: " + this.currExpression
                    );
                    break;
            }
            // updateDisplay();
        } else {
            this.expressionError = "please enter valid input";
        }
    } // appendCurrExpression

    /* Getters */
    public getCurrExpression(): string {
        return this.currExpression;
    } // getCurrExpression

    public getPrevExpression(): string {
        return this.prevExpression;
    } // getPrevExpression

    public getExpressionError(): string {
        return this.expressionError;
    } // getExpressionError

    public getResult(): string {
        return this.result.toString();
    } //getResult

    /* Setters */
    public setPrevExpression(expression: string): void {
        this.prevExpression = this.currExpression;
    } // setPrevExpression

    public setResult(result: number) {
        this.result = result;
    } //setResult

    /* public helper functions */
    public isValidInput(input: string): boolean {
        return (
            this.isOperator(input) ||
            this.isValidKey(input) ||
            this.isNumber(input)
        );
    } // isValidInput

    /* private helper functions */
    private isOperator(char: string): boolean {
        const operators = ["+", "-", "*", "/"];
        return operators.includes(char);
    } // isOperator

    private isValidKey(char: string): boolean {
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

    private isNumber(char: string): boolean {
        return typeof parseFloat(char) === "number" && !isNaN(parseFloat(char));
    } // isNumber

    private replaceFirstChar(myString: string, replacement: string): string {
        return replacement + myString.slice(1);
    }
} // Calculator class

let calculator = new Calculator();

// current expression display
const inputDisplay = document.querySelector(
    "#calc-display"
) as HTMLInputElement;
// previous expression display
const inputPrevDisplay = document.querySelector(
    "#calc-prev-display"
) as HTMLInputElement;

const errorMessage = document.querySelector("#errorMessage") as HTMLElement;

const sunMoonContainer = document.querySelector(
    ".sun-moon-container"
) as HTMLElement;

// store darkmode status for page reload
let darkMode = localStorage.getItem("darkModeStatus");
const toggleBtn = document.querySelector(".theme-toggle-button") as HTMLElement;

toggleBtn.addEventListener("click", () => {
    toggleDarkMode();
    const currentRotation: number = parseInt(
        getComputedStyle(sunMoonContainer).getPropertyValue("--rotation")
    );
    sunMoonContainer.style.setProperty(
        "--rotation",
        (currentRotation + 180).toString()
    );
});

// check for user inputs from keyboard
inputDisplay.addEventListener("keydown", function (event: KeyboardEvent) {
    event.preventDefault();
    const key: string = event.key; // "a", "1", "Shift", etc.
    inputPrevDisplay.value = `type: ${event.type} val: ${key}`;

    appendCharacter(key);
});

function toggleDarkMode(): void {
    const isEnabled: boolean = document.body.classList.toggle("dark");
    // store in local storage
    localStorage.setItem("darkModeStatus", isEnabled ? "enabled" : "disabled");
} /* Darkmode Toggle */

function appendCharacter(char: string): void {
    console.log("appendChar: " + char);
    calculator.appendCurrExpression(char);
    updateDisplay();
}

function updateDisplay(): void {
    inputDisplay.value = calculator.getCurrExpression();
    // inputPrevDisplay.value = `${calculator.getPrevExpression()} = ${calculator.getResult()}`;
    errorMessage.innerHTML = calculator.getExpressionError();

    // toggle error message visibility
    if (calculator.getExpressionError() == "") {
        errorMessage.style.display = "none";
    } else {
        errorMessage.style.display = "block";
        setTimeout(function () {
            $("#errorMessage").fadeOut("slow");
        }, 5000); // <-- time in milliseconds
    }
    // TODO:
    // update prevExpression after calculate()
    // check what inputs are invalid
}
