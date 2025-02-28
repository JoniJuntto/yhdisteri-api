import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response } from "express";
const getOwnData = async (req: Request, res: Response) => {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    res.status(401).json({ message: "Unauthorized" });
  }
  const user = await clerkClient.users.getUser(auth.userId);
  res.status(200).json(user);
};

export default getOwnData;
