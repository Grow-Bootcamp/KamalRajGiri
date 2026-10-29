import { Router } from "express";
import { TransferController } from "../controllers/transfer.controller.js";

const router = Router();

const controller = new TransferController();

router.post("/transfer", controller.transfer.bind(controller));

export default router;