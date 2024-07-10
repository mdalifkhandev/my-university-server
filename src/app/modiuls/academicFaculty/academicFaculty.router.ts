import e from 'express';
import validateRequest from '../../middlewere/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultycontroller } from './academicFaculty.controller';
import { USER_ROLE } from '../users/user.constant';
import auth from '../../middlewere/auth';

const router = e.Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultycontroller.createAcademicFaculty,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicFacultycontroller.getAllAcademicFacultyes,
);

router.get(
  '/:fecultyId',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  AcademicFacultycontroller.getSingleAcademicFaculty,
);

router.patch(
  '/:fecultyId',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicFacultyValidation.updathAcademicFacultyValidationSchema,
  ),
  AcademicFacultycontroller.updathAcademicFaculty,
);

export const AcademicFacultyRouter = router;
