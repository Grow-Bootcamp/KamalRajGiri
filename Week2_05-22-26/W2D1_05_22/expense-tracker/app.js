import { renderExpense } from "./dom/expenseUI.js";
import { Expense } from "./models/Expense.js";
import { isValidExpense } from "./utils/validation.js";
import { apiRequest } from "./utils/api.js";

const expenseForm = document.querySelector("#expenseForm");

const titleInput = document.querySelector("#title");

const amountInput = document.querySelector("#amount");

const categoryInput = document.querySelector("#category");

const errorMessage = document.querySelector("#errorMessage");

// Load existing expenses when page opens

async function loadExpenses() {
  try {
    const expenses = await apiRequest("/expenses");

    expenses.forEach((expense) => {
      renderExpense(expense);
    });
  } catch (error) {
    console.error(error);

    errorMessage.textContent = error.message;
  }
}

// Add new expense

expenseForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const title = titleInput.value;

  const amount = Number(amountInput.value);

  const category = categoryInput.value;

  // Validation

  if (!isValidExpense(title, amount, category)) {
    errorMessage.textContent = "Please enter valid expense information.";

    return;
  }

  // Create Expense object

  const expense = new Expense(Date.now(), title, amount, category);

  try {
    // Send expense to API

    const savedExpense = await apiRequest("/expenses", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(expense),
    });

    // API success

    renderExpense(savedExpense);

    errorMessage.textContent = "";

    expenseForm.reset();
  } catch (error) {
    console.error(error);

    errorMessage.textContent = error.message;
  }
});

// Run when page loads

loadExpenses();
