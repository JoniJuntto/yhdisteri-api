import { clerkClient } from "@clerk/express";
import { getAuth } from "@clerk/express";
import { type Request, type Response } from "express";
import { getOrganizationsByUserId } from "../../helpers/database/organizations";

export const getUserOrganizations = async (req: Request, res: Response) => {
  console.log("getUserOrganizations");
  const auth = getAuth(req);
  console.log("auth", auth);
  if (!auth || !auth.userId) {
    console.warn("Unauthorized");
    res.status(401).json({ message: "Unauthorized" });
  }
  const user = await clerkClient.users.getUser(auth.userId);
  console.log("user", user);
  const organizations = await getOrganizationsByUserId(user.id);
  if (!organizations) {
    res.status(404).json({ message: "No organizations found" });
  }
  res.status(200).json(organizations);
};
