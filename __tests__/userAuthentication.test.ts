import { comparePasswords, hashPassword } from '../app/config/passport';
import * as bcrypt from 'bcrypt';

jest.mock('../app/models/User');

jest.mock('bcrypt');

const mockCompare = bcrypt.compare as jest.Mock;
const mockHashFn = bcrypt.hash as jest.Mock;

describe('Utility functions', () => {
  it('should hash the password', async () => {
    const mockHash = 'hashed_password';
    mockHashFn.mockResolvedValue(mockHash);

    const result = await hashPassword('password123');
    expect(result).toBe(mockHash);
  });

  it('should compare passwords correctly', async () => {
    mockCompare.mockResolvedValue(true);

    const result = await comparePasswords('password123', 'hashed_password123');
    expect(result).toBeTruthy();
  });
  it('should throw an error if hashing fails', async () => {
    mockHashFn.mockRejectedValue(new Error('Error hashing password'));

    await expect(hashPassword('password123')).rejects.toThrowError(
      'Error hashing password',
    );
  });
  it('should throw an error if comparing fails', async () => {
    mockCompare.mockRejectedValue(new Error('Error comparing passwords'));

    await expect(
      comparePasswords('password123', 'hashed_password123'),
    ).rejects.toThrowError('Error comparing passwords');
  });
  it('should compare false if passwords do not match', async () => {
    mockCompare.mockResolvedValue(false);

    const result = await comparePasswords('password123', 'hashed_password123');
    expect(result).toBeFalsy();
  });
});
