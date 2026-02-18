/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/ClientSide/javascript.js to edit this template
 */


let darkMode = true;

function calculate() {

    let n1 = parseFloat(document.getElementById("num1").value);
    let n2 = parseFloat(document.getElementById("num2").value);
    let operation = document.getElementById("operation").value;
    let resultElement = document.getElementById("calcResult");

    if (isNaN(n1) || isNaN(n2)) {
        showError("Please enter valid numbers!");
        return;
    }

    let result;

    if (operation === "add") result = n1 + n2;
    else if (operation === "sub") result = n1 - n2;
    else if (operation === "mul") result = n1 * n2;
    else if (operation === "div") {
        if (n2 === 0) {
            showError("Cannot divide by zero!");
            return;
        }
        result = n1 / n2;
    }

    animateResult(result);
    addToHistory(n1, n2, operation, result);
}

function showError(message) {
    let resultElement = document.getElementById("calcResult");
    resultElement.innerText = message;
    resultElement.style.backgroundColor = "#ff4b2b";
}

function animateResult(result) {

    let resultElement = document.getElementById("calcResult");
    resultElement.style.backgroundColor = result >= 0 ? "#00c6ff" : "#ff4b2b";

    let counter = 0;
    let increment = result / 20;

    let animation = setInterval(() => {

        counter += increment;

        if ((increment > 0 && counter >= result) || 
            (increment < 0 && counter <= result)) {

            clearInterval(animation);
            resultElement.innerText = "Result: " + result;
        } else {
            resultElement.innerText = "Result: " + counter.toFixed(2);
        }

    }, 20);
}

function addToHistory(n1, n2, operation, result) {

    let history = document.getElementById("history");

    let symbol = operation === "add" ? "+"
                : operation === "sub" ? "-"
                : operation === "mul" ? "×"
                : "÷";

    let record = document.createElement("div");
    record.innerText = `${n1} ${symbol} ${n2} = ${result}`;

    history.prepend(record);
}

function clearAll() {
    document.getElementById("num1").value = "";
    document.getElementById("num2").value = "";
    document.getElementById("calcResult").innerText = "";
    document.getElementById("history").innerHTML = "";
}

function toggleTheme() {

    let body = document.body;

    if (darkMode) {
        body.style.background = "linear-gradient(135deg, #f6d365, #fda085)";
    } else {
        body.style.background = "linear-gradient(135deg, #0f2027, #203a43, #2c5364)";
    }

    darkMode = !darkMode;
}
