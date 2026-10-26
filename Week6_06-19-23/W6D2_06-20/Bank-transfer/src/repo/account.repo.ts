import Account from "../models/account.model.js";
import { Transaction } from "sequelize";

export class AccountRepository {
    async findById(id: number, transaction?: Transaction) {
        return Account.findByPk(id, { transaction });
    }

    async decreaseBalance(
        id: number,
        amount: number,
        transaction: Transaction
    ) {
        return Account.decrement(
            { balance: amount },
            {
                where: { id },
                transaction
            }
        );
    }

    async increaseBalance(
        id: number,
        amount: number,
        transaction: Transaction
    ) {
        return Account.increment(
            { balance: amount },
            {
                where: { id },
                transaction
            }
        );
    }
}