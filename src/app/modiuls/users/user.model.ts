import { Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interfach';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema = new Schema<TUser>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      required: true,
      default: true,
    },
    passwordChangedAt:{
type:Date
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'student', 'faculty'],
    },
    status: {
      type: String,
      required: true,
      enum: ['in-progress', 'blocked'],
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// pre save middlewere hook
userSchema.pre('save', async function (next) {
  // console.log(this,'pre hooks:this is save data');
  this.password = await bcrypt.hash(
    this.password,
    Number(config.BCRYPT_SALT_ROUND),
  );
  next();
});

// post save middlewere hook
userSchema.post('save', function (doc, next) {
  doc.password = '';
  // console.log(this,'post hooks:this is save data');
  next();
});

// userSchme.statics.isUserExistsByCustomId = async function (id: string) {
//   return await User.findOne({ id }).select('+password');
// };
userSchema.statics.isUserExistsByCustomId=async function (id:string) {
  return await User.findOne({id}).select('+password')
}

// userSchme.statics.isPasswordMatched = async function (
//   plainTextPassword,
//   hashedPassword,
// ) {
//   return await bcrypt.compare(plainTextPassword, hashedPassword);
// };


userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime =
    new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

export const User = model<TUser,UserModel>('Users', userSchema);
