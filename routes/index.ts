import express, { type Request, type Response } from "express";

import { clerkClient, requireAuth, getAuth } from "@clerk/express";
import getOwnData from "./users/getOwnData";
import getUserData from "./users/getUserData";
import fetchOrganizationMembers from "./organizations/fetchOrganizationMembers";

const router = express.Router();

//Public routes
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy" });
});

// User Routes
const userRouter = express.Router();
userRouter.get("/me", requireAuth, getOwnData);
userRouter.get("/:id", requireAuth, getUserData);
router.use("/users", userRouter);

//Organization Routes
const organizationRouter = express.Router();
organizationRouter.get("/:id/members", requireAuth, fetchOrganizationMembers);
router.use("/organizations", organizationRouter);

export default router;
