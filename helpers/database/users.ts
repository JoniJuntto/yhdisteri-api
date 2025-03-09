import { and, eq } from 'drizzle-orm';
import db from '.';
import { members, membersOrganizations, organizations } from './schema';

const fillUserInfo = async (
  externalId: string,
  firstName: string,
  lastName: string,
  organizationInfo: { type: string; code: string; name: string },
  email: string,
  phone: string,
) => {
  if (organizationInfo.type === 'join') {
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.code, organizationInfo.code));
    if (!organization) {
      return { error: 'Organization not found' };
    }
    const user = await db
      .insert(members)
      .values({
        externalId,
        firstName,
        lastName,
        email,
        phone,
      })
      .onConflictDoUpdate({
        target: [members.externalId],
        set: {
          firstName,
          lastName,
          email,
          phone,
        },
      })
      .returning();
    await db.insert(membersOrganizations).values({
      memberId: user[0].id,
      organizationId: organization[0].id,
      status: 'pending',
      role: 'member',
    });
    return user[0];
  }

  if (organizationInfo.type === 'create') {
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
      })
      .onConflictDoUpdate({
        target: [members.externalId],
        set: {
          firstName,
          lastName,
        },
      })
      .returning();
    await db.insert(membersOrganizations).values({
      memberId: user[0].id,
      organizationId: organization[0].id,
      status: 'active',
      role: 'admin',
    });
    return user[0];
  }
};

const getUserByExternalId = async (externalId: string) => {
  const user = await db
    .select()
    .from(members)
    .where(eq(members.externalId, externalId));
  return user;
};

export { fillUserInfo, getUserByExternalId };
