import express from 'express';
import { FacultyControllers } from './faculty.controller';
import validateRequest from '../../middlewere/validateRequest';
import { updateAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewere/auth';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();

router.get(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.faculty),
  FacultyControllers.getSingleFaculty,
);

router.patch(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validateRequest(updateAdminValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  FacultyControllers.deleteFaculty,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.superAdmin),
  FacultyControllers.getAllFaculties,
);

export const FacultyRoutes = router;
