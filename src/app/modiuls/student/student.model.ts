import { Schema, model } from 'mongoose';
import validator from 'validator';
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interfach';

const studentNameSchma = new Schema<TUserName>({
  firstname: {
    type: String,
    required: [true, 'First Name is Required'],
    // maxlength: [20, 'maximum length 20'],
    trim: true,
    validate: {
      validator: function (value: string) {
        const firstnamestr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstnamestr === value;
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middname: {
    type: String,
    trim: true,
  },
  lestname: {
    type: String,
    required: [true, 'Lest Name is Required'],
    trim: true,
    validate: {
      validator: (value: string) => {
        validator.isAlpha(value);
        // validator.isAlphanumeric(value)
      },
      message: '{VALUE} is not valid',
    },
  },
});

const gurdianSchma = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Fathet Name is Required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation Name is Required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact no is Required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother contact no is Required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother contact no is Required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact no is Required'],
    trim: true,
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Name is Required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Occupation is Required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Contact no is Required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Address is Required'],
  },
});

const studentSchma = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'unique ID is Required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
    password: {
      type: String,
      required: false,
    },
    name: {
      type: studentNameSchma,
      required: [true, 'Name is Required'],
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not a valid gender',
      },
      required: [true, 'gender is Required'],
    },
    dathOfBirth: {
      type: String,
      required: [true, 'Dath of birth is Required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'email is Required'],
      validate: {
        validator: (value: string) => {
          validator.isEmail(value);
        },
        message: '{VALUE} in not valid',
      },
    },
    contactNo: {
      type: String,
      required: [true, 'Contact no is Required'],
      trim: true,
    },
    emargencyContactNo: {
      type: String,
      required: [true, 'Contact no is Required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
    },
    permanentAddres: {
      type: String,
      required: [true, 'Permanent Address is Required'],
    },
    guardian: {
      type: gurdianSchma,
      required: [true, 'Gurdian is Required'],
    },
    localGuardian: {
      type: localGuardianSchema,
      required: [true, 'local curdian is Required'],
    },
    profileImg: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    admissionSemester: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

studentSchma.virtual('fullName').get(function () {
  return `${this?.name?.firstname} ${this?.name?.middname} ${this?.name?.lestname}`;
});

//for creating custom instans method

studentSchma.statics.isUserExists = async function (id: string) {
  const eeixtinUser = await Student.findOne({ id });

  return eeixtinUser;
};

studentSchma.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  // console.log(this,'post hooks:this is find data');
  next();
});
// pre findone middlewere hook
studentSchma.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  // console.log(this,'post hooks:this is find data');
  next();
});

// pre aggregate middlewere hook
studentSchma.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  // console.log(this,'post hooks:this is find data');
  next();
});

//,StudentModel with tStudent
export const Student = model<TStudent>('Student', studentSchma);
