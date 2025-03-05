import { eq } from "drizzle-orm";
import db from ".";
import {
  members,
  membersOrganizations,
  organizations as organizationsTable,
  OrganizationAddresses as organizationAddressesTable,
} from "./schema";
import { generateCode } from "../utils";

const getOrganizationMembers = async (organizationId: string) => {
  console.log("getOrganizationMembers :D", organizationId);
  const organizationMembers = await db
    .select({
      member: members,
    })
    .from(membersOrganizations)
    .innerJoin(members, eq(membersOrganizations.memberId, members.id))
    .where(eq(membersOrganizations.organizationId, organizationId));
  console.log("organizationMembers", organizationMembers);
  return organizationMembers.map((row) => row.member);
};

const getOrganizationsByUserExternalId = async (userId: string) => {
  const memberResult = await db
    .select({
      id: members.id,
    })
    .from(members)
    .where(eq(members.externalId, userId));
  console.log("memberId", memberResult);

  // Check if member exists
  if (!memberResult.length) {
    console.log("No member found with externalId:", userId);
    return [];
  }

  const organizationsData = await db
    .select({
      organization: organizationsTable,
    })
    .from(membersOrganizations)
    .innerJoin(
      organizationsTable,
      eq(membersOrganizations.organizationId, organizationsTable.id),
    )
    .where(eq(membersOrganizations.memberId, memberResult[0].id));

  return organizationsData.map((row) => row.organization);
};

const fillOrganizationInfo = async (
  name: string,
  paymentsActive: boolean,
  street: string,
  city: string,
  zipCode: string,
  country: string,
  userExternalId: string,
  planId: string,
) => {
  try {
    const code = generateCode(6);

    // First, get the member ID from the external ID
    const memberResult = await db
      .select({
        id: members.id,
      })
      .from(members)
      .where(eq(members.externalId, userExternalId));

    // Check if member exists
    if (!memberResult.length) {
      console.log("No member found with externalId:", userExternalId);
      throw new Error(`No member found with externalId: ${userExternalId}`);
    }

    const memberId = memberResult[0].id;
    console.log("Found member ID:", memberId);

    const [organization] = await db
      .insert(organizationsTable)
      .values({
        name,
        code,
        paymentsActive,
      })
      .onConflictDoNothing()
      .returning();
    console.log("organization created: ", organization);

    const [organizationAddress] = await db
      .insert(organizationAddressesTable)
      .values({
        organizationId: organization.id,
        street,
        city,
        zipCode,
        country,
      })
      .onConflictDoNothing()
      .returning();
    console.log("organizationAddress created: ", organizationAddress);

    const [organizationMember] = await db
      .insert(membersOrganizations)
      .values({
        memberId: memberId, // Use the member ID, not the external ID
        organizationId: organization.id,
      })
      .onConflictDoNothing()
      .returning();
    console.log("organizationMember created: ", organizationMember);

    return {
      organization: organization,
      organizationAddress: organizationAddress,
      organizationMember: organizationMember,
    };
  } catch (error) {
    console.error("error", error);
    throw error;
  }
};

export {
  getOrganizationMembers,
  getOrganizationsByUserExternalId,
  fillOrganizationInfo,
};
