import e from 'express';
import validateRequest from '../../middlewere/validateRequest';
import { CourseValidaerion } from './course.validation';
import { CourseController } from './course.controller';
import auth from '../../middlewere/auth';
import { USER_ROLE } from '../users/user.constant';

const router = e.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidaerion.createCorceValidationSchema),
  CourseController.createCourses,
);

router.get(
  '/',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseController.getAllCourse,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseController.getSingleCourse,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  CourseController.deletedCourse,
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidaerion.updathCourseValidationSchema),
  CourseController.updathCourse,
);

router.put(
  '/:courseId/assign-faculties',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidaerion.facultyWithCourseValidationScema),
  CourseController.assignFacultyesWithCourse,
);

router.get(
  '/:courseId/get-faculties',
  auth(
    USER_ROLE.superAdmin,
    USER_ROLE.admin,
    USER_ROLE.faculty,
    USER_ROLE.student,
  ),
  CourseController.getFacultiesWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  validateRequest(CourseValidaerion.facultyWithCourseValidationScema),
  CourseController.removeFacultiesFromCourse,
);

export const CourseRouter = router;
