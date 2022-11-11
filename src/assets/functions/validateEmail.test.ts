import { validateEmail } from './validateEmail';

const listValidEmails = [
  'email@email.com',
  'mysite@ourearth.com',
  'my.ownsite@ourearth.org',
  'mysite@you.me.net',
];

const listInvalidEmails = [
  'mysite.ourearth.com',
  'mysite@.com.my',
  '@you.me.net',
  'mysite@.org.org',
  '.mysite@mysite.org',
  'mysite()*@gmail.com',
  'mysite..1234@yahoo.com'
];

describe('validateEmail()', () => {
  it('should return isValid_email = true for valid emails', () => {
    // Assert (listValidEmails)

    listValidEmails.forEach(validEmail => {
      const {isValid_email} = validateEmail(validEmail); // Act

      expect(isValid_email).toBe(true); // Arrange
    });
  });

  it('should return alertMessage_email = Email valid for valid emails', () => {

    listValidEmails.forEach(validEmail => {
      const {alertMessage_email} = validateEmail(validEmail);

      expect(alertMessage_email).toBe('Email valid');
    });
  });

  it('should return isValid_email false for empty email', () => {
    const email = '';

    const {isValid_email} = validateEmail(email);

    expect(isValid_email).toBe(false);
  });

  it('should return Input Required for empty email', () => {
    const email = '';

    const {alertMessage_email} = validateEmail(email);

    expect(alertMessage_email).toContain('Input required');
  });

  it('should return isValid_email = false for invalid emails', () => {
    // Assert (listInvalidEmails)

    listInvalidEmails.forEach(invalidEmail => {
      const {isValid_email} = validateEmail(invalidEmail); // Act

      expect(isValid_email).toBe(false); // Arrange
    });
  });

  it('should return alertMessage_email = Email not valid for invalid emails', () => {

    listInvalidEmails.forEach(invalidEmail => {
      const {alertMessage_email} = validateEmail(invalidEmail);

      expect(alertMessage_email).toContain('Email not valid');
    });
  });
});