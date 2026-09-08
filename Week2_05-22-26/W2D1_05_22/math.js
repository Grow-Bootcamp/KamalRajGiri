const PI = 3.14159;
export function add(a, b) {
    return a + b;
}

export function subtract(a, b) {
    return a - b;
}

function  multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

export {
    multiply, divide
};

export default function square(x) {
    return x * x;   
}