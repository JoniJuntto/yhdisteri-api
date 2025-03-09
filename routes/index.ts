import express, { type Request, type Response } from 'express';

import { requireAuth } from '@clerk/express';
import getOwnData from './users/getOwnData';
import getUserData from './users/getUserData';
import fetchOrganizationMembers from './organizations/fetchOrganizationMembers';
import { createUser } from './users/createUser';
import { getUserOrganizations } from './organizations/getUserOrganizations';
import { createOrganization } from './organizations/createOrganization';
import { fetchPlans } from './plans/fetchAllPlans';
import { getOrganization } from './organizations/getOrganization';
import { approveMember } from './organizations/approveMember';
import { getUserById } from './users/getUserById';
import { updateUserById } from './users/updateUser';

const router = express.Router();

//Public routes
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Healthy' });
});

router.use(requireAuth());

// User Routes
const userRouter = express.Router();
userRouter.get('/organizations', getUserOrganizations);
userRouter.get('/me', getOwnData);
userRouter.get('/external/:id', getUserData);
userRouter.get('/:id/organization/:organizationId', getUserById);
userRouter.put('/:id', updateUserById);
userRouter.post('/create', createUser);
router.use('/users', userRouter);

//Organization Routes
const organizationRouter = express.Router();
organizationRouter.get('/:id/members', fetchOrganizationMembers);
organizationRouter.post('/create', createOrganization);
organizationRouter.get('/:id', getOrganization);
organizationRouter.post(
  '/:organizationId/members/:memberId/approve',
  approveMember,
);
router.use('/organizations', organizationRouter);

const plansRouter = express.Router();
plansRouter.get('/', fetchPlans);
router.use('/plans', plansRouter);

export default router;
