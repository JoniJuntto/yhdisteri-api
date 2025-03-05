import { type Request, type Response } from "express";
import { getPlans } from "../../helpers/database/plans";

const fetchPlans = async (req: Request, res: Response) => {
  const plans = await getPlans();
  res.status(200).json(plans);
};

export { fetchPlans };
