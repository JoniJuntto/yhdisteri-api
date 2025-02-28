import { type Request, type Response } from "express";
import { getOrganizationMembers } from "../../helpers/database/organizations";

const fetchOrganizationMembers = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const members = await getOrganizationMembers(id);
    if (!members) {
      return res.status(404).json({ error: "Organization members not found" });
    }
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export default fetchOrganizationMembers;
