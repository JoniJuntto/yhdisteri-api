import { type Request, type Response } from 'express';
import { changeMemberStatus } from '../../helpers/database/users';

export const approveMember = async (req: Request, res: Response) => {
  const { organizationId, memberId } = req.params;
  console.log('organizationId', organizationId);
  console.log('memberId', memberId);

  try {
    const approvedMember = await changeMemberStatus(
      organizationId,
      memberId,
      'active',
    );
    res.status(200).json(approvedMember);
  } catch (error) {
    console.error('Error approving member', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
