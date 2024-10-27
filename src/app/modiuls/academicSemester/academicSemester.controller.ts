import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicSemesterService } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const resualt = await AcademicSemesterService.createAcademicSemesterInToDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Create Academic Semester successfully',
    data: resualt,
  });
});

const getAllAcademicSemester = catchAsync(async (req, res) => {
  const resualt = await AcademicSemesterService.getAllAcademicSemesterFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get All Academic Semester successfully',
    data: resualt.resualt,
    meta:resualt.meta
  });
});

const getSingleAcademicSemester = catchAsync(async (req, res) => {
  const { semesterID } = req.params;

  const resualt =
    await AcademicSemesterService.getSingleAcademicSemesterFromDB(semesterID);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Get Single Academic Semester successfully',
    data: resualt,
  });
});

const updathAcademicSemester = catchAsync(async (req, res) => {
  const body = req.body;
  const { semesterID } = req.params;
  const resualt = await AcademicSemesterService.updathAcademicSemesterFromDB(
    semesterID,
    body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Updath Single Academic Semester successfully',
    data: resualt,
  });
});

export const AcademicSemesterControlller = {
  createAcademicSemester,
  getAllAcademicSemester,
  getSingleAcademicSemester,
  updathAcademicSemester,
};
