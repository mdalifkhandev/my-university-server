import { z } from 'zod';

const cteateStudentNamevaledationSchma = z.object({
  firstname: z
    .string()
    .min(1, 'First Name is Required')
    .max(20)
    .refine(
      (value) => {
        const firstnamestr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstnamestr === value;
      },
      { message: 'First name is not in capitalize format' },
    ),
  middname: z.string().optional(),
  lestname: z
    .string()
    .min(1, 'Last Name is Required')
    .max(20)
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'Last name is not valid',
    }),
});

const createGurdianvalidationSchma = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim(),
  fatherOccupation: z.string().min(1, 'Father occupation is Required').trim(),
  fatherContactNo: z.string().min(1, 'Father contact no is Required').trim(),
  motherName: z.string().min(1, 'Mother Name is Required').trim(),
  motherOccupation: z.string().min(1, 'Mother occupation is Required').trim(),
  motherContactNo: z.string().min(1, 'Mother contact no is Required').trim(),
});

const createLocalGuardianvaliditionSchema = z.object({
  name: z.string().min(1, 'Name is Required').trim(),
  occupation: z.string().min(1, 'Occupation is Required').trim(),
  contactNo: z.string().min(1, 'Contact no is Required').trim(),
  address: z.string().min(1, 'Address is Required').trim(),
});

export const createStudentValidationSchema = z.object({
  body: z.object({
    Student: z.object({
      password: z.string().max(20).optional(),
      name: cteateStudentNamevaledationSchma,
      gender: z.enum(['male', 'female', 'other']),
      dathOfBirth: z.string().optional(),
      email: z.string().email(),
      contactNo: z.string(),
      emargencyContactNo: z.string(),
      bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
      presentAddress: z.string(),
      permanentAddres: z.string(),
      guardian: createGurdianvalidationSchma,
      localGuardian: createLocalGuardianvaliditionSchema,
      // profileImg: z.string(),
    }),
  }),
});
const updathStudentNamevaledationSchma = z.object({
  firstname: z
    .string()
    .min(1, 'First Name is Required')
    .max(20)
    .refine(
      (value) => {
        const firstnamestr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstnamestr === value;
      },
      { message: 'First name is not in capitalize format' },
    )
    .optional(),
  middname: z.string().optional(),
  lestname: z
    .string()
    .min(1, 'Last Name is Required')
    .max(20)
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'Last name is not valid',
    })
    .optional(),
});

const updathGurdianvalidationSchma = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim().optional(),
  fatherOccupation: z
    .string()
    .min(1, 'Father occupation is Required')
    .trim()
    .optional(),
  fatherContactNo: z
    .string()
    .min(1, 'Father contact no is Required')
    .trim()
    .optional(),
  motherName: z.string().min(1, 'Mother Name is Required').trim().optional(),
  motherOccupation: z
    .string()
    .min(1, 'Mother occupation is Required')
    .trim()
    .optional(),
  motherContactNo: z
    .string()
    .min(1, 'Mother contact no is Required')
    .trim()
    .optional(),
});

const updathLocalGuardianvaliditionSchema = z.object({
  name: z.string().min(1, 'Name is Required').trim().optional(),
  occupation: z.string().min(1, 'Occupation is Required').trim().optional(),
  contactNo: z.string().min(1, 'Contact no is Required').trim().optional(),
  address: z.string().min(1, 'Address is Required').trim().optional(),
});

export const updathStudentValidationSchema = z.object({
  body: z.object({
    Student: z.object({
      name: updathStudentNamevaledationSchma.optional(),
      gender: z.enum(['male', 'female', 'other']).optional(),
      dathOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emargencyContactNo: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddres: z.string().optional(),
      guardian: updathGurdianvalidationSchma.optional(),
      localGuardian: updathLocalGuardianvaliditionSchema.optional(),
      profileImg: z.string().optional(),
    }),
  }),
});

export const StudentValidationSchema = {
  createStudentValidationSchema,
  updathStudentValidationSchema,
};
