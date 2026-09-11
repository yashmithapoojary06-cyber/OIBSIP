const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

let expression = "";

buttons.forEach(button => {
    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            expression = "";
            display.value = "0";
            return;
        }

        if (action === "backspace") {
            expression = expression.slice(0, -1);
            display.value = expression || "0";
            return;
        }

        if (action === "calculate") {
            calculateResult();
            return;
        }

        if (value !== undefined) {
            expression += value;
            display.value = expression;
        }
    });
});

function calculateResult() {
    if (expression === "") {
        return;
    }

    try {
        const result = evaluateExpression(expression);

        if (!Number.isFinite(result)) {
            display.value = "Error";
            expression = "";
            return;
        }

        display.value = result;
        expression = String(result);

    } catch (error) {
        display.value = "Error";
        expression = "";
    }
}

function evaluateExpression(input) {
    const tokens = input.match(/(\d+(\.\d+)?)|[+\-*/()]/g);

    if (!tokens || tokens.join("") !== input) {
        throw new Error("Invalid expression");
    }

    let index = 0;

    function parseExpression() {
        let result = parseTerm();

        while (index < tokens.length) {
            const operator = tokens[index];

            if (operator !== "+" && operator !== "-") {
                break;
            }

            index++;
            const next = parseTerm();

            if (operator === "+") {
                result += next;
            } else {
                result -= next;
            }
        }

        return result;
    }

    function parseTerm() {
        let result = parseFactor();

        while (index < tokens.length) {
            const operator = tokens[index];

            if (operator !== "*" && operator !== "/") {
                break;
            }

            index++;
            const next = parseFactor();

            if (operator === "*") {
                result *= next;
            } else {
                if (next === 0) {
                    throw new Error("Division by zero");
                }

                result /= next;
            }
        }

        return result;
    }

    function parseFactor() {
        const token = tokens[index];

        if (token === "(") {
            index++;
            const result = parseExpression();

            if (tokens[index] !== ")") {
                throw new Error("Missing parenthesis");
            }

            index++;
            return result;
        }

        if (token === "-") {
            index++;
            return -parseFactor();
        }

        const number = parseFloat(token);

        if (Number.isNaN(number)) {
            throw new Error("Invalid number");
        }

        index++;
        return number;
    }

    const result = parseExpression();

    if (index !== tokens.length) {
        throw new Error("Invalid expression");
    }

    return result;
}
