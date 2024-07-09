import { UserController } from './user.controller';
import validateRequest from '../../middlewere/validateRequest';
import e, { NextFunction, Request, Response } from 'express';
import { createStudentValidationSchema } from '../student/student.validation';
import { createAdminValidationSchema } from '../Admin/admin.validation';
import auth from '../../middlewere/auth';
import { USER_ROLE } from './user.constant';
import { createFacultyValidationSchema } from '../Faculty/faculty.valodation';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = e.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  upload.single('file'),
  (req:Request,res:Response,next:NextFunction)=>{
    req.body=JSON.parse(req.body.data)
    next()
  },
  validateRequest(createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  auth(USER_ROLE.admin),
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);



router.post(
  '/change-status/:id',
  auth('admin'),
  validateRequest(UserValidation.changeStatusValidationSchema),
  UserController.changeStatus,
);

router.get('/me', auth('student', 'faculty', 'admin'), UserController.getMe);




export const UserRought = router;
