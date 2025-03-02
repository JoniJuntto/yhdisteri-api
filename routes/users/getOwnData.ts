import { clerkClient, getAuth } from "@clerk/express";
import type { Request, Response } from "express";
import { getUserByExternalId } from "../../helpers/database/users";
const getOwnData = async (req: Request, res: Response) => {

  const auth = getAuth(req);
  
  if (!auth || !auth.userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await getUserByExternalId(auth.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  
  res.status(200).json(user);
};

export default getOwnData;
