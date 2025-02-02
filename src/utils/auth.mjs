import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  // bcrypt internally:
  // 1. Extracts salt from hashedPassword
  // 2. Hashes 'password' with that salt
  // 3. Compares the result with hashedPassword
  return await bcrypt.compare(password, hashedPassword);
};