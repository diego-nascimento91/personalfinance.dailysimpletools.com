import { validatePassword } from './validatePassword';

const listValidPasswords = [
  '123456',
  'mypassword',
  'password@#%',
  'Password123FOR!@#$%&*',
];
const listInvalidPasswords = [
  '12345',
  'password()',
  'pass.word'
];
const validPassword = 'password';
const invalidPassword = '123';

describe('validatePassword()', () => {
  it('should return isValid_password = true for valid passwords', () => {
    const { isValid_password } = validatePassword(validPassword); // Act

    expect(isValid_password).toBe(true); // Arrange
  });

  it('should return alertMessage_password = Password valid for valid passwords', () => {
    const { alertMessage_password } = validatePassword(validPassword);

    expect(alertMessage_password).toBe('Password valid');
  });

  it('should return isValid_password = false for empty password', () => {
    const password = '';

    const { isValid_password } = validatePassword(password);

    expect(isValid_password).toBe(false);
  });

  it('should return Input Required for empty password', () => {
    const password = '';

    const { alertMessage_password } = validatePassword(password);

    expect(alertMessage_password).toContain('Input required');
  });

  it('should return isValid_password = false for invalid passwords', () => {
    const { isValid_password } = validatePassword(invalidPassword); // Act

    expect(isValid_password).toBe(false); // Arrange
  });

  it('should return alertMessage_password = Password not valid for invalid passwords', () => {
    const { alertMessage_password } = validatePassword(invalidPassword);

    expect(alertMessage_password).toContain('Password not valid');
  });
});