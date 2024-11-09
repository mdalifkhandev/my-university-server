import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appEror';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interfach';
import { SemesterRegistration } from './semesterRegistration.model';
import { RegistrationStatus } from './semesterRegistration.constenst';
import mongoose from 'mongoose';
import { OfferedCourse } from '../OfferedCourse/OfferedCourse.model';

const createSemesterRegistrationIntoDB = async (
  paylods: TSemesterRegistration,
) => {
  const academicSemester = paylods?.academicSemester;

  //cheak any there any Upcoming and ongoing  alrsdy exixts

  const isThereAhyUpcomingOngoingSemester = await SemesterRegistration.findOne({
    $or: [{ status: 'UPCOMING' }, { status: 'ONGOING' }],
  });

  if (isThereAhyUpcomingOngoingSemester) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `There is alrady ${isThereAhyUpcomingOngoingSemester.status}`,
    );
  }

  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(httpStatus.CONFLICT, 'This Semester is Alrady register');
  }

  const isAcademocSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademocSemesterExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This academoc Semester is not found',
    );
  }

  const resualt = await SemesterRegistration.create(paylods);
  return resualt;
};
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();
  const resualt = await semesterRegistrationQuery.modelQuery;
  return resualt;
};

const getSingleSemesterRegistrationsFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id);

  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  paylods: Partial<TSemesterRegistration>,
) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);
  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.CONFLICT, `Semester is not found`);
  }

  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = paylods?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `The semestrt is alrady ${currentSemesterStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, paylods, {
    new: true,
    runValidators: true,
  });

  return result;
};
const deleteSemesterRegistrationFromDB = async (id: string) => {
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This registered semester is not found !',
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
    );
  }

  const session = await mongoose.startSession();

  //deleting associated offered courses

  try {
    session.startTransaction();

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      },
    );

    if (!deletedOfferedCourse) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemisterRegistration) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to delete semester registration !',
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const SemesterRegistrationService = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationsFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB,
};
