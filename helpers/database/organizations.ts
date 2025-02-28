import { eq } from "drizzle-orm";
import db from ".";
import { members } from "./schema";

const getOrganizationMembers = async (organizationId: string) => {
  const organizationMembers = await db
    .select()
    .from(members)
    .where(eq(members.organizationId, organizationId));
  return organizationMembers;
};

export { getOrganizationMembers };
