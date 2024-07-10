import { z } from 'zod';
import { UserStatus } from './user.constant';

const UserValidationSchema = z.object({
  password: z.string().max(20).optional(),
});

const changeStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum([...UserStatus] as [string, ...string[]]),
  }),
});

export const UserValidation = {
  UserValidationSchema,
  changeStatusValidationSchema,
};
