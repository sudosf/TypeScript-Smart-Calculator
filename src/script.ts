window.addEventListener("DOMContentLoaded", () => {
    updateDisplay();
});

class Calculator {
    private currExpression: string;
    private prevExpression: string;
    private expressionError: string;

    private prevResult: number;
    private currResult: number;

    public constructor() {
        this.currExpression = "";
        this.prevExpression = "0";
        this.expressionError = "";
        this.prevResult = 0;
        this.currResult = 0;
    } // constructor

    public calculate(expression: string = this.currExpression): number {
        // evaluate expression inside parenthesis
        this.currExpression = this.resolveParenthesis(expression);
        // evaluate exponents
        this.currExpression = this.resolveExponent(expression);

        // evaluate multiplication and division first

        // evaluate addition and subtraction

        return 0;
    } // calculate

    public resolveParenthesis(expression: string): string {
        let resolvedExpression: string = "";

        while (expression.includes("(")) {
            const startIndex: number = expression.lastIndexOf("(");
            const endIndex: number = expression.indexOf(")", startIndex);

            // mismatched parenthesis, exit loop
            if (startIndex === -1 || endIndex === -1) break;

            // get sub-expression inside parenthesis
            const subExpression: string = expression.slice(
                startIndex + 1,
                endIndex
            );
            const result: string = this.calculate(subExpression).toString();

            // update expression with resolved parenthesis result
            resolvedExpression =
                expression.slice(0, startIndex) +
                result +
                expression.slice(endIndex + 1);
        }

        return resolvedExpression !== "" ? resolvedExpression : expression;
    } // resolveParenthesis

    public resolveExponent(expression: string): string {
        let resolvedExpression: string = "";

        while (expression.includes("^")) {
            const [base, exponent]: number[] = expression
                .split("^")
                .map(parseFloat);
            const result: string = Math.pow(base, exponent).toString();

            resolvedExpression = expression.replace(
                `${base}^${exponent}`,
                result
            );
        }

        return resolvedExpression !== "" ? resolvedExpression : expression;
    } // resolveExponent

    public resolveMulAndDiv(expression: string): string {
        let resolvedExpression: string = "";

        while (expression.match(/[*/]/)) {
        const match = expression.match(/([\d.]+)([*/])([/d.]+)/);
        }

        return resolvedExpression !== "" ? resolvedExpression : expression;
    } //resolveMulAndDiv

    public appendCurrExpression(char: string): void {
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
                    } else {
                        this.currExpression === "0"
                            ? (this.currExpression = char)
                            : (this.currExpression += char);
                    }
                    break;
            }
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
        const keys = ["(", ")", "Backspace", "AC", "=", "^", "."];
        return keys.includes(char);
    } // isValidKey

    private isNumber(char: string): boolean {
        return isFinite(parseInt(char));
    } // isNumber
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

// check for user inputs from keyboard
inputDisplay.addEventListener("keydown", function (event: KeyboardEvent) {
    const key: string = event.key; // "a", "1", "Shift", etc.
    // console.log(key);
    appendCharacter(key);
});

function appendCharacter(char: string): void {
    calculator.appendCurrExpression(char);
    updateDisplay();
}

function updateDisplay(): void {
    inputDisplay.value = calculator.getCurrExpression();
    inputPrevDisplay.value = calculator.getPrevExpression();
    errorMessage.innerHTML = calculator.getExpressionError();

    // toggle error message visibility
    if (calculator.getExpressionError() == "") {
        errorMessage.style.display = "none";
    } else {
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
const sunMoonContainer = document.querySelector(
    ".sun-moon-container"
) as HTMLElement;

const toggleBtn = document.querySelector(".theme-toggle-button") as HTMLElement;

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const currentRotation: number = parseInt(
        getComputedStyle(sunMoonContainer).getPropertyValue("--rotation")
    );
    sunMoonContainer.style.setProperty(
        "--rotation",
        (currentRotation + 180).toString()
    );
});
