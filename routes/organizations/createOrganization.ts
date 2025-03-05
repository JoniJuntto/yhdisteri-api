import { type Request, type Response } from "express";
import { fillOrganizationInfo } from "../../helpers/database/organizations";
import { getAuth } from "@clerk/express";

export const createOrganization = async (req: Request, res: Response) => {
  const { name, paymentsActive, street, city, zipCode, country, planId } =
    req.body;
  console.log("req.body", req.body);
  const auth = getAuth(req);
  console.log("auth", auth);
  if (!auth || !auth.userId) {
    console.error("Unauthorized");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    console.log("filling organization info");
    const organization = await fillOrganizationInfo(
      name,
      paymentsActive,
      street,
      city,
      zipCode,
      country,
      auth.userId,
      planId,
    );
    console.log("organization info return ", organization);
    res.status(200).json(organization);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
