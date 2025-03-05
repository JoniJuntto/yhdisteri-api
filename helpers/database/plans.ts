import db from ".";
import { plans as plansTable } from "./schema";

const getPlans = async () => {
  const plans = await db.select().from(plansTable);
  return plans;
};

export { getPlans };
