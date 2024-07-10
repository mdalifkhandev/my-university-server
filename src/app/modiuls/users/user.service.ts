import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/appEror';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interfach';
import { Student } from '../student/student.model';
import { TUser } from './user.interfach';
import { User } from './user.model';
import {
  generateAdminId,
  generateFacultyId,
  generateStudentId,
} from './user.utils';
import httpStatus from 'http-status';
import { TAcademicSemester } from '../academicSemester/academicSemester.interfach';
import { Admin } from '../Admin/admin.model';
import { TAdmin } from '../Admin/admin.interface';
import { Faculty } from '../Faculty/faculty.model';
import { TFaculty } from '../Faculty/faculty.interfach';
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';

const createStudentFromtoDB = async (
  file: any,
  password: string,
  payloads: TStudent,
) => {
  //create user object
  const userData: Partial<TUser> = {};

  //if password in not given , use default password
  userData.password = password || (config.DEFAULT_PASSWORD as string);

  //set student role
  userData.role = 'student';
  //set email
  userData.email = payloads.email;

  // set manually generate id
  // userData.id = '2020040001';
  const admissionSemesterID = payloads.admissionSemester;
  const admissionSemester =
    await AcademicSemester.findById(admissionSemesterID);
  if (!admissionSemester) {
    throw new AppError(400, 'Admission semester not found');
  }

  const academicDepartment = await AcademicDepartment.findById(
    payloads.academicDepartment,
  );
  if (!academicDepartment) {
    throw new AppError(400, 'Admission semester not found');
  }

  payloads.academicFaculty = academicDepartment.academicFaculty;

  const session = await mongoose.startSession();

  try {
    await session.startTransaction();
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );

    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    if (file) {
      const imageName = `${userData?.id}${payloads?.name?.firstname}`;
      const path = file?.path;
      // const {secure_url}=await sendImageToCloudinary(imageName,path)
      const cloudinaryImageDetails: any = await sendImageToCloudinary(
        imageName,
        path,
      );
      const secure_url = cloudinaryImageDetails?.secure_url;

      payloads.profileImg = secure_url;
    }
    payloads.id = newUser[0].id;
    payloads.user = newUser[0]._id;

    //cheak unik email
    const currentEmail = payloads.email;
    const isExisitEmail = await Student.find();
    const alluser = isExisitEmail.map((em) => em.email === currentEmail);
    if (alluser.includes(true)) {
      throw new AppError(httpStatus.BAD_REQUEST, `This email is requtred`);
    }

    const newStudent = await Student.create([payloads], { session });
    if (!newStudent.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create student');
    }

    await session.commitTransaction();
    await session.endSession();
    return { newStudent, newUser };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(`Failed to create Student becouse ${error}`);
  }

  //set  generated id
  // userData.id = await generateStudentId(admissionSemester);

  //create user data
  // const newUser = await User.create(userData);

  //create student data
  // if (Object.keys(newUser).length) {
  //   studentData.id = newUser.id;
  //   studentData.user = newUser._id;

  //create new student
  // const newStudent = await Student.create(studentData);
  // return { newStudent, newUser };
  // }
};

const createFacultyIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.DEFAULT_PASSWORD as string);
  // console.log(userData.password);

  //set faculty role
  userData.role = 'faculty';
  //set faculty email
  userData.email = payload.email;

  if (file) {
    const imageName = `${userData?.id}${payload?.name?.firstName}`;
    const path = file?.path;
    // const {secure_url}=await sendImageToCloudinary(imageName,path)
    const cloudinaryImageDetails: any = await sendImageToCloudinary(
      imageName,
      path,
    );
    const secure_url = cloudinaryImageDetails?.secure_url;
    payload.profileImg = secure_url;
  }

  // find academic department info
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  );

  if (!academicDepartment) {
    throw new AppError(400, 'Academic department not found');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateFacultyId();

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session }); // array

    //create a faculty
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create user');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id
    // payload.profileImg = secure_url;
    // create a faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create faculty');
    }

    await session.commitTransaction();
    await session.endSession();

    return newFaculty;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TAdmin,
) => {
  // create a user object
  const userData: Partial<TUser> = {};

  //if password is not given , use deafult password
  userData.password = password || (config.DEFAULT_PASSWORD as string);

  //set student role
  userData.role = 'admin';
  //set email
  userData.email = payload.email;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    //set  generated id
    userData.id = await generateAdminId();

    if (file) {
      const imageName = `${userData?.id}${payload?.name?.firstName}`;
      const path = file?.path;
      // const {secure_url}=await sendImageToCloudinary(imageName,path)
      const cloudinaryImageDetails: any = await sendImageToCloudinary(
        imageName,
        path,
      );
      const secure_url = cloudinaryImageDetails?.secure_url;
      payload.profileImg = secure_url;
    }
    // create a user (transaction-1)
    const newUser = await User.create([userData], { session });

    //create a admin
    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }
    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create admin');
    }

    await session.commitTransaction();
    await session.endSession();

    return newAdmin;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

const getMe = async (userId: string, role: string) => {
  // const decoded = verifyToken(token, config.jwt_access_secret as string);
  // const { userId, role } = decoded;

  let result = null;
  if (role === 'student') {
    result = await Student.findOne({ id: userId }).populate('user');
  }
  if (role === 'admin') {
    result = await Admin.findOne({ id: userId }).populate('user');
  }

  if (role === 'faculty') {
    result = await Faculty.findOne({ id: userId }).populate('user');
  }

  return result;
};

const changeStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

export const UserService = {
  createStudentFromtoDB,
  createAdminIntoDB,
  createFacultyIntoDB,
  changeStatus,
  getMe,
};
