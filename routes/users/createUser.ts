import { type Request, type Response } from 'express';
import { fillUserInfo } from '../../helpers/database/users';
import { getAuth } from '@clerk/express';

export const createUser = async (req: Request, res: Response) => {
  console.log('createUser');
  console.log(req.body);
  const { user } = req.body;
  const auth = getAuth(req);
  const externalId = auth?.userId;
  const { firstName, lastName, organizationInfo, email, phone } = user;

  if (!externalId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const dbResponse = await fillUserInfo(
    externalId,
    firstName,
    lastName,
    organizationInfo,
    email,
    phone,
  );

  if (dbResponse) {
    res.status(200).json(dbResponse);
  } else {
    res.status(400).json({ message: 'User creation failed' });
  }
};
