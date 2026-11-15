import bcrypt from "bcryptjs";
import { env } from "../../config/env";

export const hashPassword = (pass: string): Promise<string> => {
  const salt = env.BCRYPT_SALT_ROUNDS;
  return bcrypt.hash(pass, salt);
};

export const comparePassword = (
  pass: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(pass, hash);
};
