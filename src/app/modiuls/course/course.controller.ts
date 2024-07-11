import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CourseServices } from './course.service';

const createCourses = catchAsync(async (req, res) => {
  const resualt = await CourseServices.createCourseFromDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course is Addad successfully',
    data: resualt,
  });
});

const getAllCourse = catchAsync(async (req, res) => {
  const resualt = await CourseServices.getAllCousrseFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course all Data Get now here',
    data: resualt,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resualt = await CourseServices.getSingleCousrseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Single Data Get now ',
    data: resualt,
  });
});

const deletedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resualt = await CourseServices.deletedCourseFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'This Course Data deleted now ',
    data: resualt,
  });
});
const updathCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const paylods = req.body;
  const resualt = await CourseServices.updathCourseInToDB(id, paylods);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course Data updahted successfully',
    data: resualt,
  });
});

const assignFacultyesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const resualt = await CourseServices.assignFacultyesWithCourseInToDb(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculry is assign successfully',
    data: resualt,
  });
});

const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const result = await CourseServices.getFacultiesWithCourseFromDB(courseId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties retrieved succesfully',
    data: result,
  });
});

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const { faculties } = req.body;

  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties removed  succesfully',
    data: result,
  });
});

export const CourseController = {
  createCourses,
  getAllCourse,
  getSingleCourse,
  deletedCourse,
  updathCourse,
  assignFacultyesWithCourse,
  removeFacultiesFromCourse,
  getFacultiesWithCourse,
};
