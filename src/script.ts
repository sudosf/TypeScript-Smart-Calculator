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

    private result: string;

    public constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.result = "";
    } // constructor

    public calculate(expression: string = this.currExpression): string {
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

    public validateResult(expression: string) {
        console.log("isValidResult: " + this.isExpressionNumber(expression));
        // check if any errors where detected
        // update expression if
        // no error message is set
        if (expression.length === 0) {
            if (this.isExpressionErrorEmpty())
                this.expressionError = "please enter an expression";
        } else if (!this.isExpressionNumber(expression)) {
            if (this.isExpressionErrorEmpty()) this.expressionError = "ERROR";
        }
    } // validateResult

    public isExpressionErrorEmpty(): boolean {
        return this.expressionError === "";
    }

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
            if (this.isCharNumber(subExpression)) {
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
                !this.isCharNumber(base.toString()) ||
                !this.isCharNumber(exponent.toString())
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

    public resolveSqrt(expression: string): string {
        if (expression === "") {
            this.expressionError = "empty expression";
            return "";
        } else if (!this.isCharNumber(expression)) {
            this.expressionError = "invalid square operation";
            return "";
        } else if (parseFloat(expression) < 0) {
            this.expressionError = "invalid negative square operation";
        }

        const result: number = Math.sqrt(parseFloat(expression));
        this.currExpression = result.toString();
        return result.toString();
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
        while (expression.match(/[+\-]/)) {
            const match = expression.match(/([\d.]+)([+\-])([\d.]+)/);

            if (match) {
                let [_, operand1, operator, operand2]: string[] = match;

                if (!operand1 || !operand2) {
                    this.expressionError = "incomplete expression";
                    break;
                }

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

    public onInputReceived(char: string): void {
        if (this.isValidInput(char)) {
            this.expressionError = ""; // reset error message
            switch (char) {
                case "Enter":
                case "=":
                    this.setPrevExpression(this.currExpression);
                    const result: string = this.calculate();
                    this.setResult(result);
                    break;
                case "AC":
                    // use function or variable?
                    this.currExpression = "";
                    break;
                case "Backspace":
                    this.currExpression = this.currExpression.slice(0, -1);
                    break;
                case "pi":
                    this.currExpression += Math.PI.toString();
                    break;
                case "sqrt":
                    const sqrtResult: string = this.resolveSqrt(
                        this.currExpression
                    );
                    this.setResult(sqrtResult);
                    break
                case "%":
                    this.currExpression = this.convertToPercentage(this.currExpression).toString();
                    break;
                default:
                    this.isOperator(char)
                        ? (this.currExpression += ` ${char} `)
                        : (this.currExpression += char);
                    break;
            }
        } else {
            this.expressionError = "please enter valid input";
        }
    } // onInputReceived

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

    public setResult(result: string) {
        this.result = result;
    } //setResult

    /* public helper functions */
    public isValidInput(input: string): boolean {
        return (
            this.isOperator(input) ||
            this.isValidKey(input) ||
            this.isCharNumber(input)
        );
    } // isValidInput

    public convertToPercentage(numberInput: string): number {
        return parseFloat(numberInput)/100;
    }

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
            "pi",
            "sqrt",
            "%",
            " ",
            "Space",
        ];
        return keys.includes(char);
    } // isValidKey

    private isCharNumber(char: string): boolean {
        return typeof parseFloat(char) === "number" && !isNaN(parseFloat(char));
    } // isCharNumber

    private isExpressionNumber(expression: string): boolean {
        const matchResult = expression.match(/[0-9+\-*/.]+/);
        return matchResult ? true : false;
    } //isExpressionNumber

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
    console.log("keyPressed: " + event.key);
    onKeyPressed(event.key);
});

function toggleDarkMode(): void {
    const isEnabled: boolean = document.body.classList.toggle("dark");
    // store in local storage
    localStorage.setItem("darkModeStatus", isEnabled ? "enabled" : "disabled");
} /* Darkmode Toggle */

function onKeyPressed(char: string): void {
    calculator.onInputReceived(char);
    updateDisplay();
}

function updateDisplay(): void {
    inputDisplay.value = calculator.getCurrExpression();
    inputPrevDisplay.value = `${calculator.getPrevExpression()} = ${calculator.getResult()}`;

    if (calculator.getExpressionError() !== "") {
        inputPrevDisplay.value = calculator.getExpressionError();
    }
    // TODO:

    // check what inputs are invalid
}
