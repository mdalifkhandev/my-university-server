import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const createStudent = catchAsync(async (req, res) => {
  const { password, Student: studentData } = req.body;

  // console.log(password,studentData);

  const resualt = await UserService.createUserFromtoDB(password, studentData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User and student Created successfully',
    data: resualt,
  });
});

// const createFaculty = catchAsync(async (req, res) => {
//   const { password, faculty: facultyData } = req.body;

//   const result = await UserServices.createFacultyIntoDB(password, facultyData);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Faculty is created succesfully',
//     data: result,
//   });
// });

const createAdmin = catchAsync(async (req, res) => {
  const { password, admin: adminData } = req.body;

  const result = await UserService.createAdminIntoDB(password, adminData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin is created succesfully',
    data: result,
  });
});

export const UserController = {
  createStudent,
  createAdmin,
};
