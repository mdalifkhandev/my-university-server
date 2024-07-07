import httpStatus from 'http-status';
import AppError from '../../error/appEror';
import { User } from '../users/user.model';
import { TLoginUser } from './auth.interfach';
import bcrypt from 'bcrypt';
import config from '../../config';
import { createToken } from './auth.utils';
import jwt, { JwtPayload } from 'jsonwebtoken';

const logonUser = async (paylods: TLoginUser) => {
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

  // const assessToken=jwt.sign(
  //     jwtPayload,
  //     config.JWT_SECRET_ACCESS_KE as string,
  //     {
  //         expiresIn:'10h'
  //     }
  // )

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
  const decoded = jwt.verify(
    token,
    config.JWT_SECRET_REFRESSRS_KE as string,
  ) as JwtPayload;

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

export const AuthService = {
  logonUser,
  changePasswordfromDB,
  refreshToken,
};
