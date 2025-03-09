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

const getUserById = async (id: string, organizationId: string) => {
  const user = await db.select().from(members).where(eq(members.id, id));
  const userOrganizationData = await db
    .select()
    .from(membersOrganizations)
    .where(
      and(
        eq(membersOrganizations.memberId, id),
        eq(membersOrganizations.organizationId, organizationId),
      ),
    );
  return { ...user[0], ...userOrganizationData[0] };
};

const changeMemberStatus = async (
  organizationId: string,
  memberId: string,
  status: 'active' | 'inactive' | 'pending' | 'deleted' | 'suspended',
) => {
  const member = await db
    .update(membersOrganizations)
    .set({ status })
    .where(
      and(
        eq(membersOrganizations.memberId, memberId),
        eq(membersOrganizations.organizationId, organizationId),
      ),
    )
    .returning();
  return member[0];
};

const updateUserById = async (
  id: string,
  {
    firstName,
    lastName,
    email,
    phone,
    notes,
    status,
    role,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    notes: string;
    status: 'active' | 'inactive' | 'pending' | 'deleted' | 'suspended';
    role: 'admin' | 'member' | 'guest';
  },
) => {
  const user = await db
    .update(members)
    .set({ firstName, lastName, email, phone })
    .where(eq(members.id, id))
    .returning();

  await db
    .update(membersOrganizations)
    .set({ status, role, notes })
    .where(eq(membersOrganizations.memberId, id));

  return user[0];
};
export {
  fillUserInfo,
  getUserByExternalId,
  changeMemberStatus,
  getUserById,
  updateUserById,
};
