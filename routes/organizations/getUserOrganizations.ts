import { clerkClient } from "@clerk/express";
import { getAuth } from "@clerk/express";
import { type Request, type Response } from "express";
import { getOrganizationsByUserExternalId } from "../../helpers/database/organizations";

export const getUserOrganizations = async (req: Request, res: Response) => {
  console.log("getUserOrganizations");
  const auth = getAuth(req);
  console.log("auth", auth);
  if (!auth || !auth.userId) {
    console.warn("Unauthorized");
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  try {
    const user = await clerkClient.users.getUser(auth.userId);
    console.log("user", user);
    const organizations = await getOrganizationsByUserExternalId(user.id);
    console.log("organizations", organizations);
    if (!organizations) {
      console.log("No organizations found");
      res.status(404).json({ message: "No organizations found" });
      return;
    }
    
    res.status(200).json(organizations);
  } catch (error) {
    
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Internal server error", error: (error as Error).message });
  }
};
