"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const script_1 = require("./script");
let calculator = new script_1.Calculator();
// tests for calculate()
// tests for parenthesis expression
// tests for exponents
// tests for Addition and Subtraction
// tests for Multiplication and division
// tests for square root
// Function to display test results on the webpage
function displayResult(description, result) {
    const resultContainer = document.createElement("div");
    resultContainer.textContent = `${description}: ${result ? "Passed" : "Failed"}`;
    document.body.appendChild(resultContainer);
}
// Test case for addition
test("adds 1 + 2 to equal 3", () => {
    const result = add(1, 2) === 3;
    displayResult("Addition Test", result);
    expect(add(1, 2)).toBe(3);
});
// Test case for subtraction
test("subtracts 4 - 2 to equal 2", () => {
    const result = subtract(4, 2) === 2;
    displayResult("Subtraction Test", result);
    expect(subtract(4, 2)).toBe(2);
});
// Test case for multiplication
test("multiplies 3 * 5 to equal 15", () => {
    const result = multiply(3, 5) === 15;
    displayResult("Multiplication Test", result);
    expect(multiply(3, 5)).toBe(15);
});
// Test case for division
test("divides 10 / 2 to equal 5", () => {
    const result = divide(10, 2) === 5;
    displayResult("Division Test", result);
    expect(divide(10, 2)).toBe(5);
});
// Test case for division by zero
test("throws error when dividing by zero", () => {
    const result = (() => {
        try {
            divide(5, 0);
            return false;
        }
        catch (error) {
            return true;
        }
    })();
    displayResult("Division by Zero Test", result);
    expect(() => divide(5, 0)).toThrow("Cannot divide by zero");
});
