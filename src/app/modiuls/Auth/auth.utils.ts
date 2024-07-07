import jwt from 'jsonwebtoken';

export const createToken = (
  jwtPayloads: { userId: string; role: string },
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayloads, secret, { expiresIn });
};
