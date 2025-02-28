import { clerkClient } from "@clerk/express";
import type { Request, Response } from "express";

const getUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  const user = await clerkClient.users.getUser(userId);
  res.status(200).json(user);
};

export default getUserData;
