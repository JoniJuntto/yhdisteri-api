import { type Request, type Response } from 'express';
import { getUserById as getUserByIdFromDb } from '../../helpers/database/users';

export const getUserById = async (req: Request, res: Response) => {
  const { id, organizationId } = req.params;
  try {
    const user = await getUserByIdFromDb(id, organizationId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
