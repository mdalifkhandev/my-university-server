import { TBloodGroup, TGender } from './admin.interface';

export const Gender: TGender[] = ['male', 'female', 'other'];
export const BloodGroup: TBloodGroup[] = [
  'A+',
  'B+',
  'A-',
  'B-',
  'AB-',
  'AB+',
  'O-',
  'O+',
];

export const AdminSearchableFields = [
  'email',
  'id',
  'contactNo',
  'emergencyContactNo',
  'name.firstName',
  'name.lastName',
  'name.middleName',
];
