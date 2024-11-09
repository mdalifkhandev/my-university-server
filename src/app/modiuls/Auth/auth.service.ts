import httpStatus from 'http-status';
import AppError from '../../error/appEror';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interfach';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { sendEmail } from '../../utils/sendMailinUser';

const loginUser = async (paylods: TLoginUser) => {
  //cheak user
  const user = await User.findOne({ id: paylods?.id });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is NOt Found');
  }

  //cheak user delete
  const isdelete = user.isDeleted;
  if (isdelete) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Deleted');
  }

  //stutas cheak
  const stutasCheak = user.status;
  if (stutasCheak === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Blocked');
  }

  //cheak password
  const isPasswordMatched = await bcrypt.compare(
    paylods.password,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Password wrong');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_SECRET_ACCESS_KE as string,
    config.JWT_SECRET_ACCESS_TIME as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.JWT_SECRET_REFRESSRS_KE as string,
    config.JWT_SECRET_REFRESSRS_TIME as string,
  );

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user.needsPasswordChange,
  };
};

const changePasswordfromDB = async (
  payloads: JwtPayload,
  userPassword: { oldPassword: string; newPassword: string },
) => {
  console.log(payloads);
  
  //cheak user
  const user = await User.findOne({ id: payloads?.userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is NOt Found');
  }

  //cheak user delete
  const isdelete = user.isDeleted;
  if (isdelete) {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Deleted');
  }

  //stutas cheak
  const stutasCheak = user.status;
  if (stutasCheak === 'blocked') {
    throw new AppError(httpStatus.NOT_FOUND, 'This User is Blocked');
  }

  //cheak password
  const isPasswordMatched = await bcrypt.compare(
    userPassword.oldPassword,
    user.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_FOUND, 'This Password wrong');
  }

  const newHashedPassword = await bcrypt.hash(
    userPassword.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  await User.findOneAndUpdate(
    { id: payloads.userId, role: payloads.role },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );

  return null;
};

const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.JWT_SECRET_REFRESSRS_KE as string);

  const { userId, iat } = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)
  ) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.JWT_SECRET_ACCESS_KE as string,
    config.JWT_SECRET_ACCESS_TIME as string,
  );

  return {
    accessToken,
  };
};

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const resetToken = createToken(
    jwtPayload,
    config.JWT_SECRET_ACCESS_KE as string,
    '10m',
  );

  // const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken} `;
  const forgatePasswordUILink = `${config.RESED_PASSWORD_UI_LINK}?id=${user.id}&token=${resetToken} `;


  sendEmail(user.email, forgatePasswordUILink);
};

const resetPassword = async (
  payload: { id: string; newPassword: string },
  token: string,
) => {
  // checking if the user is exist
  const user = await User.isUserExistsByCustomId(payload?.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }
  // checking if the user is already deleted
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted !');
  }

  // checking if the user is blocked
  const userStatus = user?.status;

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }

  const decoded = jwt.verify(
    token,
    config.JWT_SECRET_ACCESS_KE as string,
  ) as JwtPayload;

  //localhost:3000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDI4NTA2MTcsImV4cCI6MTcwMjg1MTIxN30.-T90nRaz8-KouKki1DkCSMAbsHyb9yDi0djZU3D6QO4

  if (payload.id !== decoded.userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are forbidden!');
  }

  //hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.BCRYPT_SALT_ROUND),
  );

  await User.findOneAndUpdate(
    {
      id: decoded.userId,
      role: decoded.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  );
};

export const AuthService = {
  loginUser,
  changePasswordfromDB,
  refreshToken,
  forgetPassword,
  resetPassword,
};
