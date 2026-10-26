// ==========================================
// LESSON 1: EQUALITY AND TRUTHINESS
// ==========================================

// Helper function to select an HTML element by its ID.
const byId = (id) => document.getElementById(id);


// 1. == vs ===, || vs ??
byId("equality-button").addEventListener("click", () => {

  // Loose equality: JavaScript converts types when comparing.
  byId("loose-result").textContent = String("10" == 10);
  // Output: true

  // Strict equality: string and number are different types.
  byId("strict-result").textContent = String("10" === 10);
  // Output: false

  // OR: 0 is falsy, so return the fallback value.
  byId("or-result").textContent = String(0 || 50);
  // Output: 50

  // Nullish coalescing: 0 is not null or undefined.
  byId("nullish-result").textContent = String(0 ?? 50);
  // Output: 0
});


// 2. Truthy and falsy values
byId("truthy-button").addEventListener("click", () => {

  const values = [
    0,
    "",
    false,
    null,
    undefined,
    "0",
    "hello",
    [],
    {}
  ];

  const list = byId("truthy-results");

  // Clear previous results.
  list.replaceChildren();

  values.forEach((value) => {

    const item = document.createElement("li");

    // Give the empty string a clearer label.
    const valueText =
      value === "" ? '"" (empty string)' : String(value);

    // Boolean() converts a value to true or false.
    const result = Boolean(value);

    item.textContent =
      `${valueText} → ${result ? "TRUTHY" : "FALSY"}`;

    // CSS classes style the result.
    item.className = result ? "truthy" : "falsy";

    list.appendChild(item);
  });
});


// ==========================================
// LESSON 2: slice() VS splice()
// ==========================================


// 3. slice()
// slice(start, end)
// - Includes the start index.
// - Excludes the end index.
// - Does not change the original array.

byId("slice-button").addEventListener("click", () => {

  const items = ["A", "B", "C", "D"];

  const selected = items.slice(1, 3);

  byId("slice-result").textContent =
    `slice result: ${JSON.stringify(selected)}\n` +
    `original:     ${JSON.stringify(items)}\n\n` +
    `Index 1 ("B") is included.\n` +
    `Index 3 ("D") is excluded.`;

  // Result:
  // slice result: ["B","C"]
  // original:     ["A","B","C","D"]
});


// 4. splice()
// splice(start, deleteCount)
// - The second argument is a count, not an end index.
// - Changes the original array.
// - Returns the removed elements.

byId("splice-button").addEventListener("click", () => {

  const items = ["A", "B", "C", "D"];

  const removed = items.splice(1, 2);

  byId("splice-result").textContent =
    `removed:  ${JSON.stringify(removed)}\n` +
    `modified: ${JSON.stringify(items)}\n\n` +
    `Removed 2 elements starting at index 1.`;

  // Removed:  ["B","C"]
  // Modified: ["A","D"]
});


// 5. Insert without removing
// splice(start, 0, item)
// A deleteCount of 0 means remove nothing.

byId("insert-button").addEventListener("click", () => {

  const items = ["A", "B", "C", "D"];

  items.splice(2, 0, "X");

  byId("insert-result").textContent =
    `modified: ${JSON.stringify(items)}\n\n` +
    `Inserted "X" at index 2.\n` +
    `No elements were removed.`;

  // Result: ["A","B","X","C","D"]
});
