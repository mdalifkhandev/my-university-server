import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewere/validateRequest';
import { updateAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewere/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

// router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateAdminValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
