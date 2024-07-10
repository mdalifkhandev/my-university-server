import e from 'express';
import validateRequest from '../../middlewere/validateRequest';
import { AcademicSemesterValidation } from './academicSemester.validiton';
import { AcademicSemesterControlller } from './academicSemester.controller';
import { USER_ROLE } from '../users/user.constant';
import auth from '../../middlewere/auth';

const router = e.Router();

router.post(
  '/create-academic-semester',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(
    AcademicSemesterValidation.createAcademicSemestervalidationSchema,
  ),
  AcademicSemesterControlller.createAcademicSemester,
);

router.get('/', AcademicSemesterControlller.getAllAcademicSemester);

router.get(
  '/:semesterID',
  AcademicSemesterControlller.getSingleAcademicSemester,
);

router.patch(
  '/:semesterID',
  validateRequest(
    AcademicSemesterValidation.updathAcademicSemestervalidationSchema,
  ),
  AcademicSemesterControlller.updathAcademicSemester,
);

export const AcademicSemesterRouter = router;
