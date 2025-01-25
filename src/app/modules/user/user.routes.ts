import express from 'express';
import auth from '../../middlewares/auth';
import UserController from './user.controller';

const router = express.Router();

router
  .route('/profile')
  .get(auth('ADMIN', 'CUSTOMER'), UserController.GetMyProfile);

export const UserRoutes = router;
