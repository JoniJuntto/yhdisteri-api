import { type Request, type Response } from "express";
import { fillUserInfo } from "../../helpers/database/users";

export const createUser = async (req: Request, res: Response) => {
    const { user } = req.body;
    const { externalId, firstName, lastName, organizationInfo, email, phone } = user;

    const dbResponse = await fillUserInfo(externalId, firstName, lastName, organizationInfo, email, phone);

    if (dbResponse) {
        res.status(200).json({ message: "User created successfully", user: dbResponse });
    } else {
        res.status(400).json({ message: "User creation failed", error: dbResponse });
    }
}