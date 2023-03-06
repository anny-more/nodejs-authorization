import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

export const generateToken = payload => {
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCES_SECRET as string,
    {
      expiresIn: '60m',
    }
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    {
      expiresIn: '30d',
    }
  );
  return {
    accessToken,
    refreshToken,
  };
};
