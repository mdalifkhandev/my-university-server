import { z } from 'zod';

const createAcademicDepartmentValidationSchma = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be String',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty must be String',
      required_error: 'Faculty is required',
    }),
  }),
});
const updathAcademicDepartmentValidationSchma = z.object({
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Academic Department must be String',
        required_error: 'Name is required',
      })
      .optional(),
    academicFaculty: z
      .string({
        invalid_type_error: 'Academic faculty must be string',
        required_error: 'Faculty is required',
      })
      .optional(),
  }),
});

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchma,
  updathAcademicDepartmentValidationSchma,
};
