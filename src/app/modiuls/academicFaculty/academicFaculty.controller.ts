import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicFacultyService } from './academicFaculty.service';

const createAcademicFaculty = catchAsync(async (req, res) => {
  const resualt = await AcademicFacultyService.createAcademicFacultyInToDB(
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Feculty create successfully',
    data: resualt,
  });
});

const getAllAcademicFacultyes = catchAsync(async (req, res) => {
  const resualt = await AcademicFacultyService.getAllAcademicFacultyesFromDB(
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All Academic Feculty  Get successfully',
    // meta: result.meta,
    data: resualt,
  });
});

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const fecultyId = req.params.fecultyId;
  const resualt =
    await AcademicFacultyService.getSingleAcademicFacultyFromDB(fecultyId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Single Academic Feculty get successfully',
    data: resualt,
  });
});

const updathAcademicFaculty = catchAsync(async (req, res) => {
  const { fecultyId } = req.params;
  const body = req.body;
  const resualt = await AcademicFacultyService.updateAcademicFecultyFromDB(
    fecultyId,
    body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Feculty updath successfully',
    data: resualt,
  });
});

export const AcademicFacultycontroller = {
  createAcademicFaculty,
  getAllAcademicFacultyes,
  getSingleAcademicFaculty,
  updathAcademicFaculty,
};
