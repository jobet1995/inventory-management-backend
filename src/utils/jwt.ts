import jwt, { SignOptions } from 'jsonwebtoken';

interface TokenPayload {
  id: string;
  role: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, (process.env.JWT_SECRET as string) || 'fallback_secret', {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions['expiresIn']) || '7d'
  });
};

export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, (process.env.JWT_SECRET as string) || 'fallback_secret') as TokenPayload;
};
