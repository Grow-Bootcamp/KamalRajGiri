export function isValidExpense(title, amount, category) {

    if (title.trim() === "") {
        return false;
    }

    if (amount <= 0) {
        return false;
    }

    if (category.trim() === "") {
        return false;
    }

    return true;
}