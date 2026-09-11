//demonstrating OOP using a class 
export class Expense {

    constructor(id, title, amount, category) {
        this.id = id;
        this.title = title;
        this.amount = amount;
        this.category = category;
    }

    getInfo() {
        return `${this.title} - Rs. ${this.amount} - ${this.category}`;
    }
}

// Example usage of the Expense class
// const expense = new Expense(
//     1,
//     "Lunch",
//     300,
//     "Food"
// );
// console.log(expense.getInfo());