import express from 'express';

import { EnrolledCourseControllers } from './enrolledCourse.controller';
import auth from '../../middlewere/auth';
import validateRequest from '../../middlewere/validateRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { USER_ROLE } from '../users/user.constant';

const router = express.Router();
router.post(
  '/create-enrolled-course',
  auth('student'),
  auth(USER_ROLE.student),
  validateRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.get(
  '/my-enrolled-courses',
  auth(USER_ROLE.student),
  EnrolledCourseControllers.getMyEnrolledCourses,
);

router.patch(
  '/update-enrolled-course-marks',
  auth('faculty'),
  validateRequest(
    EnrolledCourseValidations.updateEnrolledCourseMarksValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarks,
);

export const EnrolledCourseRoutes = router;
