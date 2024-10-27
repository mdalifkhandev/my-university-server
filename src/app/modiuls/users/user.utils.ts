import { TAcademicSemester } from '../academicSemester/academicSemester.interfach';
import { User } from './user.model';

// //Student ID
// const findLastStudentId = async () => {
//   const lastStudent = await User.findOne(
//     {
//       role: 'student',
//     },
//     {
//       id: 1,
//       _id: 0,
//     },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   //2030 01   0001

//   return lastStudent; // ? lastStudent.id.substring(6) : undefined;
// };

// //student id
// export const generateStudentId = async (payloads: TAcademicSemester) => {
  
//   let currentId = (0).toString(); //0000 by defaylt
  
//   const lastStudentId = await findLastStudentId();
  
//   const lastStudentSemesterCode = lastStudentId?.id.substring(4, 6);
//   const lastStudentSemesterYear = lastStudentId?.id.substring(0, 4);
//   const currentSemesterCode = payloads.code;
//   const currentSemesterYear = payloads.year;

//   if (
//     lastStudentId &&
//     lastStudentSemesterCode === currentSemesterCode &&
//     lastStudentSemesterYear === currentSemesterYear
//   ) {
//     currentId = lastStudentId?.id.substring(6);
//   }
  
//   const incrementIdOnly = (Number(currentId) + 1)
//   const incrementId=incrementIdOnly.toString().padStart(4,'0')
//   const id = `${payloads.year}${payloads.code}${incrementId}`;
//   console.log(id);
  
//   return id;
// };

// //Admin ID
// export const findLastAdminId = async () => {
//   const lastAdmin = await User.findOne(
//     {
//       role: 'admin',
//     },
//     {
//       id: 1,
//       _id: 0,
//     },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
// };

// //Admin Id
// export const generateAdminId = async () => {
//   let currentId = (0).toString();
//   const lastAdminId = await findLastAdminId();

//   if (lastAdminId) {
//     currentId = lastAdminId.substring(2);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   incrementId = `A-${incrementId}`;
//   return incrementId;
// };

// //faculty id
// export const findLastFacultyId = async () => {
//   const lastFaculty = await User.findOne(
//     {
//       role: 'faculty',
//     },
//     {
//       id: 1,
//       _id: 0,
//     },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
// };

// //Faculty id
// export const generateFacultyId = async () => {
//   let currentId = (0).toString();
//   const lastFacultyId = await findLastFacultyId();

//   if (lastFacultyId) {
//     currentId = lastFacultyId.substring(2);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   incrementId = `F-${incrementId}`;

//   return incrementId;
// };







// const findLastStudentId = async () => {
//   const lastStudent = await User.findOne(
//     {
//       role: 'student',
//     },
//     {
//       id: 1,
//       _id: 0,
//     },
//   )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return lastStudent?.id ? lastStudent.id : undefined;
// };

// export const generateStudentId = async (payload: TAcademicSemester) => {
//   let currentId = (0).toString();
//   const lastStudentId = await findLastStudentId();

//   const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
//   const lastStudentYear = lastStudentId?.substring(0, 4);

//   const currentSemesterCode = payload.code;
//   const currentYear = payload.year;

//   if (
//     lastStudentId &&
//     lastStudentSemesterCode === currentSemesterCode &&
//     lastStudentYear === currentYear
//   ) {
//     currentId = lastStudentId.substring(6);
//   }

//   let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

//   incrementId = `${payload.year}${payload.code}${incrementId}`;

//   return incrementId;
// };



const findLastStudentId = async (year: string, semesterCode: string) => {
  const lastStudent = await User.find(
    {
      role: 'student',
      id: new RegExp(`^${year}${semesterCode}`) // Matches year and semester code at the beginning of the ID
    },
    { id: 1, _id: 0 }
  )
    .sort({ id: -1 }) // Sort by descending ID to get the highest one
    .limit(1)
    .lean();

  return lastStudent.length > 0 ? lastStudent[0].id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  const { year, code: semesterCode } = payload;
  let currentId = "0000"; // Start from 0000 if no last student ID is found

  const lastStudentId = await findLastStudentId(year, semesterCode);

  if (lastStudentId) {
    // Extract the numeric part and increment
    const lastNumericPart = lastStudentId.substring(6);
    currentId = (Number(lastNumericPart) + 1).toString().padStart(4, '0');
  }

  const newStudentId = `${year}${semesterCode}${currentId}`;
  

  // Check if ID is unique
  const existingUser = await User.findOne({ id: newStudentId });
  if (!existingUser) {
    return newStudentId;
  } else {
    // If ID already exists, increment by 1
    const incrementedId = (Number(newStudentId) + 1).toString();
    
    return incrementedId;
  }
};







// Faculty ID
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

// Admin ID
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