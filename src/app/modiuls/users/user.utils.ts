import { TAcademicSemester } from '../academicSemester/academicSemester.interfach';
import { User } from './user.model';

//Student ID
const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  //2030 01   0001

  return lastStudent; // ? lastStudent.id.substring(6) : undefined;
};

//student id
export const generateStudentId = async (payloads: TAcademicSemester) => {
  let currentId = (0).toString(); //0000 by defaylt

  const lastStudentId = await findLastStudentId();

  const lastStudentSemesterCode = lastStudentId?.id.substring(4, 6);
  const lastStudentSemesterYear = lastStudentId?.id.substring(0, 4);
  const currentSemesterCode = payloads.code;
  const currentSemesterYear = payloads.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYear === currentSemesterYear
  ) {
    currentId = lastStudentId?.id.substring(6);
  }

  const incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  const id = `${payloads.year}${payloads.code}${incrementId}`;
  return id;
};

//Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

//Admin Id
export const generateAdminId = async () => {
  let currentId = (0).toString();
  const lastAdminId = await findLastAdminId();

  if (lastAdminId) {
    currentId = lastAdminId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `A-${incrementId}`;
  return incrementId;
};

//faculty id
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};

//Faculty id
export const generateFacultyId = async () => {
  let currentId = (0).toString();
  const lastFacultyId = await findLastFacultyId();

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `F-${incrementId}`;

  return incrementId;
};
