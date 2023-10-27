import bcrypt from 'bcrypt';

/**
 * Verify a plaintext password against a hashed password.
 * @param {string} plainTextPassword - The plaintext password to verify.
 * @param {string} hashedPassword - The hashed password to compare against.
 * @returns {Promise<boolean>} - A promise that resolves to true if the passwords match, or false if they don't.
 */
const verifyPassword = async (
  plainTextPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  try {
    // Use bcrypt's compare function to verify the password
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  } catch (error) {
    throw error;
  }
};

export default verifyPassword;
