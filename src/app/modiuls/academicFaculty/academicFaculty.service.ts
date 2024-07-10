import QueryBuilder from '../../builder/QueryBuilder';
import { AcademicFacultySearchableFields } from './academicFaculty.constant';
import { TAcademicFaculty } from './academicFaculty.interfach';
import { AcademicFaculty } from './academicFaculty.model';

const createAcademicFacultyInToDB = async (payloads: TAcademicFaculty) => {
  const resualt = await AcademicFaculty.create(payloads);
  return resualt;
};

const getAllAcademicFacultyesFromDB = async (
  query: Record<string, unknown>,
) => {
  const academicFacultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .search(AcademicFacultySearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const reaualt = await academicFacultyQuery.modelQuery;
  const meta = academicFacultyQuery.countTotal();
  return {
    meta,
    reaualt,
  };
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const resualt = await AcademicFaculty.findOne({ _id: id });
  return resualt;
};

const updateAcademicFecultyFromDB = async (
  id: string,
  payloads: Partial<TAcademicFaculty>,
) => {
  const resualt = await AcademicFaculty.findOneAndUpdate(
    { _id: id },
    payloads,
    { new: true },
  );
  return resualt;
};

export const AcademicFacultyService = {
  createAcademicFacultyInToDB,
  getAllAcademicFacultyesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFecultyFromDB,
};
