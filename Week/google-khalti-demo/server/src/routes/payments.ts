import { Router } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

const router = Router();

const KHALTI_BASE_URL = "https://dev.khalti.com/api/v2";
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY!;
const JWT_SECRET = process.env.JWT_SECRET!;

const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:5173";
const SERVER_URL = process.env.SERVER_URL ?? "http://localhost:5000";

const PRODUCT_AMOUNT = 10000; // NPR 100 in paisa

type DemoOrder = {
  orderId: string;
  amount: number;
  userId: string;
  status: "pending" | "paid" | "failed";
};

const pendingOrders = new Map<string, DemoOrder>();

// Initiate payment
router.post("/initiate", async (req, res) => {
  try {
    const token = req.cookies.app_token;

    if (!token) {
      return res.status(401).json({ message: "Please log in first." });
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (typeof user === "string" || !user.sub) {
      return res.status(401).json({ message: "Invalid session." });
    }

    if (!KHALTI_SECRET_KEY) {
      return res.status(500).json({
        message: "Khalti sandbox key is not configured.",
      });
    }

    const orderId = `DEMO-${randomUUID()}`;

    const response = await fetch(
      `${KHALTI_BASE_URL}/epayment/initiate/`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `${SERVER_URL}/api/payments/callback`,
          website_url: CLIENT_URL,
          amount: PRODUCT_AMOUNT,
          purchase_order_id: orderId,
          purchase_order_name: "Demo Product",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Khalti initiation failed:", data);

      return res.status(502).json({
        message: "Khalti could not initiate the payment.",
      });
    }

    pendingOrders.set(data.pidx, {
      orderId,
      amount: PRODUCT_AMOUNT,
      userId: user.sub,
      status: "pending",
    });

    return res.json({
      payment_url: data.payment_url,
    });
  } catch (error) {
    console.error("Payment initiation error:", error);

    return res.status(500).json({
      message: "Payment initiation failed.",
    });
  }
});

// Verify payment through Khalti callback
router.get("/callback", async (req, res) => {
  try {
    const { pidx, purchase_order_id } = req.query;

    if (
      typeof pidx !== "string" ||
      typeof purchase_order_id !== "string"
    ) {
      return res.redirect(
        `${CLIENT_URL}/payment-result?status=failed`
      );
    }

    const order = pendingOrders.get(pidx);

    if (!order || order.orderId !== purchase_order_id) {
      return res.redirect(
        `${CLIENT_URL}/payment-result?status=failed`
      );
    }

    const response = await fetch(
      `${KHALTI_BASE_URL}/epayment/lookup/`,
      {
        method: "POST",
        headers: {
          Authorization: `Key ${KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("Khalti lookup failed:", result);

      return res.redirect(
        `${CLIENT_URL}/payment-result?status=pending`
      );
    }

    const isSuccessful =
      result.status === "Completed" &&
      result.total_amount === order.amount &&
      result.refunded !== true;

    if (isSuccessful) {
      // Keep the order and update its status.
      order.status = "paid";
      pendingOrders.set(pidx, order);

      return res.redirect(
        `${CLIENT_URL}/payment-result?status=success`
      );
    }

    if (
      result.status === "Pending" ||
      result.status === "Initiated"
    ) {
      return res.redirect(
        `${CLIENT_URL}/payment-result?status=pending`
      );
    }

    order.status = "failed";
    pendingOrders.set(pidx, order);

    return res.redirect(
      `${CLIENT_URL}/payment-result?status=failed`
    );
  } catch (error) {
    console.error("Payment verification error:", error);

    return res.redirect(
      `${CLIENT_URL}/payment-result?status=pending`
    );
  }
});

// Get the logged-in user's payment status
router.get("/status", (req, res) => {
  try {
    const token = req.cookies.app_token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = jwt.verify(token, JWT_SECRET);

    if (typeof user === "string" || !user.sub) {
      return res.status(401).json({
        message: "Invalid session",
      });
    }

    const userOrder = [...pendingOrders.values()].find(
      (order) =>
        order.userId === user.sub &&
        order.status === "paid"
    );

    return res.json({
      paid: Boolean(userOrder),
      order: userOrder
        ? {
            orderId: userOrder.orderId,
            amount: userOrder.amount,
            status: userOrder.status,
          }
        : null,
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session",
    });
  }
});

export default router;