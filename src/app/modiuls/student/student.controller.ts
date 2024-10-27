import { RequestHandler } from 'express';
import { StudentServises } from './student.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

///get all user
const getAllStudents = catchAsync(async (req, res) => {
  const resualt = await StudentServises.getAllStudentFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student all Data Get now here',
    data:resualt.resualt,
    meta:resualt.meta
  });
});

//get single user

const getSingleStudent: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;

  const resualt = await StudentServises.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student single data get now here',
    data: resualt,
  });
});

const deletedSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;

  const resualt = await StudentServises.deletedSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student single data deleted successfully',
    data: resualt,
  });
});
const updathStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { Student } = req.body;

  const resualt = await StudentServises.updathStudentFromDB(id, Student);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student updath successfully',
    data: resualt,
  });
});

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deletedSingleStudent,
  updathStudent,
};
