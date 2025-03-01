import { eq } from "drizzle-orm";
import db from ".";
import { members, membersOrganizations, organizations } from "./schema";

const fillUserInfo = async (
  externalId: string,
  firstName: string,
  lastName: string,
  organizationInfo: { type: string; code: string; name: string },
  email: string,
  phone: string
) => {
  if (organizationInfo.type === "join") {
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.code, organizationInfo.code));
    if (!organization) {
      return { error: "Organization not found" };
    }
    const user = await db
      .insert(members)
      .values({
        externalId,
        firstName,
        lastName,
        email,
        phone,
        joinDate: new Date().toISOString(),
        status: "pending",
      })
      .returning();
    await db.insert(membersOrganizations).values({
      memberId: user[0].id,
      organizationId: organization[0].id,
    });
    return user;
  }

  if (organizationInfo.type === "create") {
    const code = Math.random().toString(36).substring(2, 8);
    const organization = await db
      .insert(organizations)
      .values({
        code,
        name: organizationInfo.name,
      })
      .returning();
    const user = await db
      .insert(members)
      .values({
        externalId,
        firstName,
        lastName,
        email,
        phone,
        joinDate: new Date().toISOString(),
        status: "pending",
      })
      .returning();
    await db.insert(membersOrganizations).values({
      memberId: user[0].id,
      organizationId: organization[0].id,
    });
    return user;
  }
};

export { fillUserInfo };
