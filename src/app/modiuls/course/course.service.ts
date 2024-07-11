import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constens';
import { TCourseFaculty, TCouse } from './course.interfach';
import { Course, CourseFaculty } from './course.model';
import AppError from '../../error/appEror';
import httpStatus from 'http-status';

const createCourseFromDB = async (paylods: TCouse) => {
  const resualt = await Course.create(paylods);
  return resualt;
};

const getAllCousrseFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const resualt = await courseQuery.modelQuery;
  const meta = await courseQuery.countTotal();
  return {
    resualt,
    meta,
  };
};

const getSingleCousrseFromDB = async (id: string) => {
  const resualt = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return resualt;
};

const deletedCourseFromDB = async (id: string) => {
  const resualt = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  return resualt;
};

const updathCourseInToDB = async (id: string, paylods: Partial<TCouse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = paylods;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const updathBasicComputerInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );

    if (!updathBasicComputerInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Faild to updath course');
    }

    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequest = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);

      const deletedPreRequestCourse = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: {
                $in: {
                  deletedPreRequest,
                },
              },
            },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!deletedPreRequestCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Faild to updath course');
      }

      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisitesCourse = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisitesCourse) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
      }
    }

    await session.commitTransaction();
    await session.endSession();

    const resualt = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );
    return resualt;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course');
  }
};

const assignFacultyesWithCourseInToDb = async (
  id: string,
  paylods: Partial<TCourseFaculty>,
) => {
  const resualt = await CourseFaculty.findByIdAndUpdate(
    id,
    { course: id, $addToSet: { faculties: { $each: paylods } } },
    { upsert: true, new: true },
  );
  return resualt;
};

const getFacultiesWithCourseFromDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({ course: courseId }).populate(
    'faculties',
  );
  return result;
};

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    {
      new: true,
    },
  );
  return result;
};

export const CourseServices = {
  createCourseFromDB,
  getAllCousrseFromDB,
  getSingleCousrseFromDB,
  deletedCourseFromDB,
  updathCourseInToDB,
  assignFacultyesWithCourseInToDb,
  removeFacultiesFromCourseFromDB,
  getFacultiesWithCourseFromDB,
};
