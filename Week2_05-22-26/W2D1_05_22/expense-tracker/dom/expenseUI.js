export function renderExpense(expense) {
  const expenseList = document.querySelector("#expenseList");

  const li = document.createElement("li");

  li.textContent = `${expense.title} - Rs. ${expense.amount} - ${expense.category}`;

  expenseList.appendChild(li);
}
