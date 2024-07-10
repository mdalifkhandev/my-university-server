import { Schema, model } from 'mongoose';
import { TAcademicDepartment } from './academicDepartment.interfach';
import AppError from '../../error/appEror';
import httpStatus from 'http-status';

const academicDepartmentSchema = new Schema<TAcademicDepartment>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicFaculty',
    },
  },
  {
    timestamps: true,
  },
);

academicDepartmentSchema.pre('save', async function (next) {
  const isExisitDepartment = await AcademicDepartment.findOne({
    name: this.name,
  });

  if (isExisitDepartment) {
    throw new AppError(httpStatus.NOT_FOUND, 'The Department is Alrady Exisit');
  }
  next();
});

academicDepartmentSchema.pre('updateOne', async function (next) {
  const query = this.getQuery();
  const isExisitId = await AcademicDepartment.findOne(query);
  if (!isExisitId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'The Department ID is not Exisit m',
    );
  }
  next();
});

export const AcademicDepartment = model<TAcademicDepartment>(
  'AcademicDepartment',
  academicDepartmentSchema,
);
