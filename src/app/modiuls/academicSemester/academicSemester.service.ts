import httpStatus from 'http-status';
import AppError from '../../error/appEror';
import {
  academicSemesterNameCodeMapper,
  AcademicSemesterSearchableFields,
} from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interfach';
import { AcademicSemester } from './academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';

const createAcademicSemesterInToDB = async (payloas: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payloas.name] !== payloas.code) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code');
  }

  const resualt = await AcademicSemester.create(payloas);
  return resualt;
};

const getAllAcademicSemesterFromDB = async (query: Record<string, unknown>) => {
  const academicSemesterQuery = new QueryBuilder(AcademicSemester.find(), query)
    .search(AcademicSemesterSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const resualt = await academicSemesterQuery.modelQuery;
  const meta = await academicSemesterQuery.countTotal();

  return {
    meta,
    resualt,
  };
};

const getSingleAcademicSemesterFromDB = async (id: string) => {
  const resualt = await AcademicSemester.findOne({ _id: id });
  return resualt;
};

const updathAcademicSemesterFromDB = async (
  id: string,
  payloads: Partial<TAcademicSemester>,
) => {
  if (
    payloads.name &&
    payloads.code &&
    academicSemesterNameCodeMapper[payloads.name] !== payloads.code
  ) {
    throw new AppError(httpStatus.NOT_FOUND, 'Invalid Semester Code');
  }

  const result = await AcademicSemester.findOneAndUpdate(
    { _id: id },
    payloads,
    { new: true },
  );
  return result;
};

export const AcademicSemesterService = {
  createAcademicSemesterInToDB,
  getAllAcademicSemesterFromDB,
  getSingleAcademicSemesterFromDB,
  updathAcademicSemesterFromDB,
};
