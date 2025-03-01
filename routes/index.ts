import express, { type Request, type Response } from "express";

import { requireAuth } from "@clerk/express";
import getOwnData from "./users/getOwnData";
import getUserData from "./users/getUserData";
import fetchOrganizationMembers from "./organizations/fetchOrganizationMembers";
import { createUser } from "./users/createUser";
import { getUserOrganizations } from "./organizations/getUserOrganizations";

const router = express.Router();

//Public routes
router.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy" });
});

// Apply authentication middleware after public routes
router.use(requireAuth());

// User Routes
const userRouter = express.Router();
userRouter.get("/me", getOwnData);
userRouter.get("/:id", getUserData);
// Make sure this route doesn't redirect back to itself
userRouter.post("/create", createUser); // Changed from "/me/create" to "/create"
userRouter.get("/organizations", getUserOrganizations); // Changed from "/me/organizations" to "/organizations"
router.use("/users", userRouter);

//Organization Routes
const organizationRouter = express.Router();
organizationRouter.get("/:id/members", fetchOrganizationMembers);
router.use("/organizations", organizationRouter);

export default router;
