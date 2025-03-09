import { type Request, type Response } from 'express';
import { updateUserById as updateUserByIdFromDb } from '../../helpers/database/users';

export const updateUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { firstName, lastName, email, phone, notes, status, role } = req.body;

  try {
    const updatedUser = await updateUserByIdFromDb(id, {
      firstName,
      lastName,
      email,
      phone,
      notes,
      status,
      role,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
