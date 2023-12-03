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
    }

    public calculate(): string {
        return "in progress";
    }

    public appendCurrExpression(char: string): void {
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

        //this.currExpression.replace(/[^0-9+-/*]/g, "");
        console.log(this.currExpression);
        // console.log();
    }

    public getCurrExpression(): string {
        return this.currExpression;
    }

    public getPrevExpression(): string {
        return this.prevExpression;
    }

    public getExpressionError(): string {
        return this.expressionError;
    }

    // public helper functions
    public isValidInput(input: string): boolean {
        return (
            this.isOperator(input) ||
            this.isValidKey(input) ||
            this.isNumber(input)
        );
    }

    // private helper functions
    private isOperator(char: string): boolean {
        const operators = ["+", "-", "*", "/"];
        return operators.includes(char);
    }

    private isValidKey(char: string): boolean {
        const keys = ["(", ")", "Backspace", "AC"];
        return keys.includes(char);
    }

    private isNumber(char: string): boolean {
        return isFinite(parseInt(char));
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
