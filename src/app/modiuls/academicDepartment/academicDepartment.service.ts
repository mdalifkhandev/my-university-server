import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interfach';
import { AcademicDepartment } from './academicDepartment.model';
import { AcademicDepartmentSearchableFields } from './academicDepartmets.constant';

const createAcademicDepartmentInToDB = async (
  payloads: TAcademicDepartment,
) => {
  const resualt = await AcademicDepartment.create(payloads);
  return resualt;
};

const getAllAcademicDepartmentFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicDepartmentQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )
    .search(AcademicDepartmentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const resualt = await academicDepartmentQuery.modelQuery;
  const meta = await academicDepartmentQuery.countTotal();
  return {
    resualt,
    meta,
  };
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const resualt =
    await AcademicDepartment.findById(id).populate('academicFaculty');
  return resualt;
};

const updathSingleAcademicDepartmentFromDB = async (
  id: string,
  payloads: Partial<TAcademicDepartment>,
) => {
  const resualt = await AcademicDepartment.findOneAndUpdate(
    { _id: id },
    payloads,
    {
      new: true,
    },
  );
  return resualt;
};

export const AcademicDepartmentService = {
  createAcademicDepartmentInToDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updathSingleAcademicDepartmentFromDB,
};
