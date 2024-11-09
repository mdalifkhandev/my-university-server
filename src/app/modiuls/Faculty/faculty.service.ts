/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Faculty } from './faculty.model';
import { TFaculty } from './faculty.interfach';
import AppError from '../../error/appEror';
import { User } from '../users/user.model';

// const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  // const facultyQuery = new QueryBuilder(
  //   Faculty.find().populate('academicDepartment'),
  //   query,
  // )
//     .search(FacultySearchableFields)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();
// console.log(facultyQuery);

  // const result = await facultyQuery.modelQuery;
  // const meta = await facultyQuery.countTotal();
  // return {
  //   meta,
  //   result,
  // };
// };
const getAllFacultiesFromDB = async () => {
  const resualt=await Faculty.find()
  return resualt
}

const getSingleFacultyFromDB = async (id: string) => {
  const result = await Faculty.findById(id).populate(
    'academicDepartment academicFaculty',
  );

  return result;
};

const updateFacultyIntoDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Faculty.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deletedFaculty = await Faculty.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty');
    }

    // get user _id from deletedFaculty
    const userId = deletedFaculty.user;

    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
};
