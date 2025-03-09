import { type Request, type Response } from 'express';
import { getOrganizationById } from '../../helpers/database/organizations';

export const getOrganization = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('id', id);
  try {
    const organization = await getOrganizationById(id);
    console.log('organization', organization);
    res.status(200).json(organization);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return;
  }
};
