import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentService } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const resualt =
    await AcademicDepartmentService.createAcademicDepartmentInToDB(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department cteated successfully',
    data: resualt,
  });
});

const getAllAcademicDepartment = catchAsync(async (req, res) => {
  const resualt =
    await AcademicDepartmentService.getAllAcademicDepartmentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Get All successfully',
    data:resualt.resualt,
    meta:resualt.meta
    
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const id = req.params.departmentId;
  const resualt =
    await AcademicDepartmentService.getSingleAcademicDepartmentFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department Get Single successfully',
    data: resualt,
  });
});

const updathSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params;
  const payloads = req.body;
  const resualt =
    await AcademicDepartmentService.updathSingleAcademicDepartmentFromDB(
      //   id,
      departmentId,
      payloads,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department updath successfully',
    data: resualt,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartment,
  getSingleAcademicDepartment,
  updathSingleAcademicDepartment,
};
