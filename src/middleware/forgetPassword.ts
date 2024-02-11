import { randomBytes } from 'crypto';

export const ForgetTokenService = () => {
  return randomBytes(15).toString('hex');
};

export const calculateExpiateTime = () => {
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 1);
  const year = expirationTime.getUTCFullYear();
  const month = ('0' + (expirationTime.getUTCMonth() + 1)).slice(-2);
  const day = ('0' + expirationTime.getUTCDate()).slice(-2);
  const hours = ('0' + expirationTime.getUTCHours()).slice(-2);
  const minutes = ('0' + expirationTime.getUTCMinutes()).slice(-2);
  const seconds = ('0' + expirationTime.getUTCSeconds()).slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};
