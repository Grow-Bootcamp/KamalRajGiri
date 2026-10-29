import { Request, Response } from "express";
import { TransferService } from "../services/transfer.services.js";

const transferService = new TransferService();

export class TransferController {
    async transfer(req: Request, res: Response) {
        try {
            const { fromAccountId, toAccountId, amount } = req.body;

            const result = await transferService.transfer(
                fromAccountId,
                toAccountId,
                amount
            );

            res.status(200).json(result);

        } catch (error) {
            res.status(400).json({
                message: (error as Error).message
            });
        }
    }
}