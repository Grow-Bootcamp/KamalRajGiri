import { sequelize } from "../config/db.js";
import { AccountRepository } from "../repo/account.repo.js";
import { TransactionRepository } from "../repo/transaction.repo.js";

export class TransferService {
    private accountRepo = new AccountRepository();
    private transactionRepo = new TransactionRepository();

    async transfer(
        fromAccountId: number,
        toAccountId: number,
        amount: number
    ) {
        const t = await sequelize.transaction();

        try {
            const sender = await this.accountRepo.findById(
                fromAccountId,
                t
            );

            if (!sender) {
                throw new Error("Sender account not found");
            }

            if (Number(sender.balance) < amount) {
                throw new Error("Insufficient balance");
            }

            await this.accountRepo.decreaseBalance(
                fromAccountId,
                amount,
                t
            );

            await this.accountRepo.increaseBalance(
                toAccountId,
                amount,
                t
            );

            await this.transactionRepo.create(
                fromAccountId,
                toAccountId,
                amount,
                t
            );

            await t.commit();

            return {
                message: "Transfer completed successfully"
            };

        } catch (error) {
            await t.rollback();
            throw error;
        }
    }
}