import { eq } from "drizzle-orm";
import db from ".";
import {
  members,
  membersOrganizations,
  organizations as organizationsTable,
} from "./schema";

const getOrganizationMembers = async (organizationId: string) => {
  const organizationMembers = await db
    .select({
      member: members,
    })
    .from(membersOrganizations)
    .innerJoin(members, eq(membersOrganizations.memberId, members.id))
    .where(eq(membersOrganizations.organizationId, organizationId));

  return organizationMembers.map((row) => row.member);
};

const getOrganizationsByUserExternalId = async (userId: string) => {
  const memberId = await db.select({
    id: members.id,
  }).from(members).where(eq(members.externalId, userId));
  const organizationsData = await db
    .select({
      organization: organizationsTable,
    })
    .from(membersOrganizations)
    .innerJoin(
      organizationsTable,
      eq(membersOrganizations.organizationId, organizationsTable.id)
    )
    .where(eq(membersOrganizations.memberId, memberId[0].id));

  return organizationsData.map((row) => row.organization);
};

export { getOrganizationMembers, getOrganizationsByUserExternalId };
