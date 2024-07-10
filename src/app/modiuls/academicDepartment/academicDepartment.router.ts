import e from 'express';
import validateRequest from '../../middlewere/validateRequest';
import { AcademicDepartmentValidation } from './academicDepartment.validation';
import { AcademicDepartmentController } from './academicDepartment.controller';
import auth from '../../middlewere/auth';
import { USER_ROLE } from '../users/user.constant';

const router = e.Router();

router.post(
  '/create-academic-department',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.createAcademicDepartmentValidationSchma,
  ),
  AcademicDepartmentController.createAcademicDepartment,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicDepartmentController.getAllAcademicDepartment,
);

router.get(
  '/:departmentId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicDepartmentController.getSingleAcademicDepartment,
);

router.patch(
  '/:departmentId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicDepartmentValidation.updathAcademicDepartmentValidationSchma,
  ),
  AcademicDepartmentController.updathSingleAcademicDepartment,
);

export const AcademicDepartmentRouter = router;
