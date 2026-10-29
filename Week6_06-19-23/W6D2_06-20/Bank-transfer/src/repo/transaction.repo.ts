import TransactionModel from "../models/transaction.model.js";
import { Transaction } from "sequelize";

export class TransactionRepository {
    async create(
        fromAccountId: number,
        toAccountId: number,
        amount: number,
        transaction: Transaction
    ) {
        return TransactionModel.create(
            {
                from_account_id: fromAccountId,
                to_account_id: toAccountId,
                amount,
                status: "COMPLETED"
            },
            { transaction }
        );
    }
}