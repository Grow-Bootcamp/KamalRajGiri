const { add, subtract , divide } = require("../src/utils/calculator");

test("adds two numbers correctly", () => {
    expect(add(2, 3)).toBe(5);
});

test("Subtract two numbers correctly",()=>{
    expect(subtract(-5,-2)).toBe(-3);
});

test("Divide two numbers correctly",()=>{
    expect(divide(10,2)).toBe(5);
});

test("Divide by zero throws an error", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
}); 

describe("calculator",()=>{
    it("adds two numbers", ()=>{
        expect(add(2,3)).toBe(5);
    });
});

describe("Addition", ()=>{
    test("adds two numbers correctly", () => {
        expect(add(2, 3)).toBe(5);
    });
});

describe("Division",()=>{
    test("Divide two numbers correctly",()=>{
        expect(divide(10,2)).toBe(5);
    });
    test("Divide by zero throws an error", () => {
        expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
    });
});