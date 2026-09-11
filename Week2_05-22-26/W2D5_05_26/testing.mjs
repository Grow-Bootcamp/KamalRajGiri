import assert from 'node:assert';

// System Under Test (SUT)
const db = { users: [] };

function creationUserObject(name) {
    if (!name || name.trim() === "") {
        return null;
    }
    return { id: Date.now(), name: name.trim() }; // pure logic
}

function addUser(name) {
    const user = creationUserObject(name); // integration with db
    if (user) { db.users.push(user); }
    return user;
}

function userFlowApp(name) {
    const user = addUser(name); 
    if (!user) return "Invalid user name provided.";
    return `Welcome ${user.name}! Your user ID is ${user.id}.`;
}

// -------------------------------------------------------------
// TESTING SUITE
// -------------------------------------------------------------

// Positive Unit Test
function unitTest() {
    const result = creationUserObject("    Kamal    ");
    assert.strictEqual(result.name, "Kamal", "Unit Test Failed: Name should be trimmed.");
    console.log("✅ Unit Test Passed");
}

// Negative Unit Test
function negativeUnitTest() {
    const result = creationUserObject("   ");
    assert.strictEqual(result, null, "Negative Test Failed: Empty name should return null.");
    console.log("✅ Negative Unit Test Passed (Empty name rejected)");
}

// Integration Test
function integrationTest() {
    const initialCount = db.users.length;
    const user = addUser("Aagyat");
    assert.strictEqual(user.name, "Aagyat");
    assert.strictEqual(db.users.length, initialCount + 1, "Integration Test Failed: User count should increase by 1.");
    console.log("✅ Integration Test Passed");
}

// Positive E2E Test
function e2eTest() {
    const output = userFlowApp("TestUser");
    assert.ok(
        output.startsWith("Welcome TestUser!"),
        "E2E Test Failed: Greeting mismatch"
    );
    console.log("✅ E2E Test Passed");
}

// Negative E2E Test
function negativeE2eTest() {
    const output = userFlowApp("   ");
    assert.strictEqual(
        output, 
        "Invalid user name provided.", 
        "Negative E2E Test Failed: App did not reject bad input"
    );
    console.log("✅ Negative E2E Test Passed (Bad flow rejected)");
}

// Run All Tests
unitTest();
negativeUnitTest();
integrationTest();
e2eTest();
negativeE2eTest();