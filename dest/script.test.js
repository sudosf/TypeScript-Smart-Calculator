"use strict";
// const { Calculator } = require("./script");
// const { exec } = require('child_process');
// let calculator = new Calculator();
// // Function to display test results on the webpage
// function displayResult(description: string, result: boolean) {
//     const resultContainer = document.createElement("div");
//     resultContainer.textContent = `${description}: ${
//         result ? "Passed" : "Failed"
//     }`;
//     document.body.appendChild(resultContainer);
// }
// // tests for calculate()
// // tests for parenthesis expression
// // tests for exponents
// // tests for Addition and Subtraction
// test("1 + 2 = 3", () => {
//     const result = calculator.resolveAddAndSub("1+2") === '3';
//     displayResult("Addition Test", result);
//     expect(calculator.resolveAddAndSub("1+2")).toBe('3');
// });
// test("4 - 2 = 2", () => {
//     const result = calculator.resolveAddAndSub("4-2") === '2';
//     displayResult("Substation Test", result);
//     expect(calculator.resolveAddAndSub("4-2")).toBe('2');
// });
// // tests for Multiplication and division
// // Test case for division by zero
// test("throws error when dividing by zero", () => {
//     const result = calculator.resolveMulAndDiv("1/0") === '0';
//     displayResult("Division by Zero Test", result);
//     expect(calculator.resolveMulAndDiv("1/0")).toBe('0');
// });
// const runTestsButton =document.getElementById('runTestsButton') as HTMLElement;
// runTestsButton.addEventListener('click', function() {
//     // Run npm script when the button is clicked
//     exec('npm run test:all', (error: any, stdout: any, stderr: any) => {
//       if (error) {
//         console.error(`Error: ${error}`);
//         return;
//       }
//       console.log(`stdout: ${stdout}`);
//       console.error(`stderr: ${stderr}`);
//     });
//   });
