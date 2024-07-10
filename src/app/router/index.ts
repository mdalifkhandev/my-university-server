import { Router } from 'express';
import { UserRought } from '../modiuls/users/user.router';
import { AcademicSemesterRouter } from '../modiuls/academicSemester/academicSemester.router';
import { StudentRought } from '../modiuls/student/student.rought';
import { AcademicFacultyRouter } from '../modiuls/academicFaculty/academicFaculty.router';
import { AcademicDepartmentRouter } from '../modiuls/academicDepartment/academicDepartment.router';
import { CourseRouter } from '../modiuls/course/course.rought';
import { semesterRegistrationRoutes } from '../modiuls/semesterRegistration/semesterRegistration.router';
import { AuthRouter } from '../modiuls/Auth/auth.router';
import { AdminRoutes } from '../modiuls/Admin/admin.route';
import { FacultyRoutes } from '../modiuls/Faculty/faculty.route';
import { EnrolledCourseRoutes } from '../modiuls/enrolledCourse/enrolledCourse.router';
import { offeredCourseRoutes } from '../modiuls/OfferedCourse/OfferedCourse.router';

const router = Router();

const mosuleRought = [
  {
    path: '/students',
    route: StudentRought,
  },
  {
    path: '/users',
    route: UserRought,
  },
  {
    path: '/academic-semister',
    route: AcademicSemesterRouter,
  },
  {
    path: '/academic-faculty',
    route: AcademicFacultyRouter,
  },
  {
    path: '/academic-department',
    route: AcademicDepartmentRouter,
  },
  {
    path: '/course',
    route: CourseRouter,
  },
  {
    path: '/semester-registrations',
    route: semesterRegistrationRoutes,
  },
  {
    path: '/auth',
    route: AuthRouter,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/faculty',
    route: FacultyRoutes,
  },
  {
    path: '/offered-course',
    route: offeredCourseRoutes,
  },
  {
    path: '/enrolled-course',
    route: EnrolledCourseRoutes,
  },
];

mosuleRought.forEach((route) => router.use(route.path, route.route));

export default router;
