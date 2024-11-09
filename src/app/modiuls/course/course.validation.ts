import { z } from 'zod';

const PreRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().default(false),
});

// const createCorceValidationSchema = z.object({
//   body: z.object({
//     title: z.string(),
//     prefix: z.string(),
//     code: z.number(),
//     credits: z.number(),
//     preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
//     isDeleted: z.boolean().default(false),
//   }),
// });


const createCorceValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(), 
    preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
    isDeleted: z.boolean().default(false),
  }),
});

const updathCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
    isDeleted: z.boolean().optional(),
  }),
});

const facultyWithCourseValidationScema = z.object({
  body: z.object({
    faculties: z.array(z.string()),
  }),
});

export const CourseValidaerion = {
  createCorceValidationSchema,
  updathCourseValidationSchema,
  facultyWithCourseValidationScema,
};
