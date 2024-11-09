import mongoose from 'mongoose';
import { Student } from './student.model';
import AppError from '../../error/appEror';
import httpStatus from 'http-status';
import { User } from '../users/user.model';
import { TStudent } from './student.interfach';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchAbleFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
    .populate('user')
    .populate('admissionSemester')
    .populate('academicDepartment academicFaculty'),
    query,
  )
    .search(studentSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const resualt = await studentQuery.modelQuery;
  const meta = await studentQuery.countTotal();
  return {
    resualt,
    meta,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  console.log(id);
  
  const resualt = await Student.findById(id)
    .populate('admissionSemester')
    .populate('user')
    .populate({
      path: 'academicDepartment',
      populate: { path: 'academicFaculty' },
    });
  return resualt;
};

const deletedSingleStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete student');
    }
    // const userId = deletedStudent.user;
    const deleteUser = await User.findByIdAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete User');
    }

    await session.commitTransaction();
    await session.endSession();

    return { deletedStudent, deleteUser };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`Faild to deleted Student and user, Because:${error}`);
  }
};

const updathStudentFromDB = async (id: string, paylods: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = paylods;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  //git hub link : https://github.com/Apollo-Level2-Web-Dev/Level2-Batch-3-PH-university-server/blob/part-3/src/app/modules/student/student.service.ts

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }
  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
    if (localGuardian && Object.keys(localGuardian).length) {
      for (const [key, value] of Object.entries(localGuardian)) {
        modifiedUpdatedData[`localGuardian.${key}`] = value;
      }
    }

    const resualt = await Student.findOneAndUpdate(
      { id },
      modifiedUpdatedData,
      {
        new: true,
        runValidators: true,
      },
    );
    return resualt;
  }
};

export const StudentServises = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deletedSingleStudentFromDB,
  updathStudentFromDB,
};
