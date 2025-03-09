import { type Request, type Response } from 'express';
import { getUserByExternalId } from '../../helpers/database/users';

const getUserData = async (req: Request, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
  }
  const user = await getUserByExternalId(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
};

export default getUserData;
