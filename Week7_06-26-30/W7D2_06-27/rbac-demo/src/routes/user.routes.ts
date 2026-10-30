
import { Router } from "express";

import { authenticate } from "../middleware/authnticate";
import { authorizeRoles } from "../middleware/authorize-roles";
import { userController } from "../controllers/user.controller";
import { authorizePermissions } from "../middleware/authorize-permission";

const router = Router();

// Any authenticated role
router.get("/me", authenticate, (req, res, next) =>
  userController.me(req, res, next)
);

// Moderator and admin
router.get(
  "/moderation",
  authenticate,
  authorizeRoles("moderator", "admin"),
  (req, res) => userController.moderationDashboard(req, res)
);

// Admin only
router.get(
  "/admin/dashboard",
  authenticate,
  authorizeRoles("admin"),
  (req, res) => userController.adminDashboard(req, res)
);


router.get(
  "/posts",
  authenticate,
  authorizePermissions("read:posts"),
  (_req, res) => {
    res.status(200).json({
      message: "You have permission to read posts.",
    });
  }
);

router.delete(
  "/comments/:id",
  authenticate,
  authorizePermissions("delete:comments"),
  (req, res) => {
    res.status(200).json({
      message: `Demo permission granted for comment ${req.params.id}.`,
    });
  }
);

router.delete(
  "/:id",
  authenticate,
  authorizePermissions("manage:users"),
  (req, res, next) => userController.deleteUser(req, res, next)
);


export default router;
