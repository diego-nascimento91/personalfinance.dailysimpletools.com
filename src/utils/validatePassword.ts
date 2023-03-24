export const validatePassword = (password: string) => {
  const passwordRegex = new RegExp(/^([\w!@#$%&*]){6,}$/);
  const isValid_password = passwordRegex.test(password);
  let alertMessage_password = '';

  if (password === '') {
    alertMessage_password = 'Input required! Please choose a password.';
  } else if (isValid_password) {
    alertMessage_password = 'Password valid';
  } else {
    alertMessage_password = 'Password not valid. Your password should contain at least 6 chacteres e may contain letters, numbers and the characters @ # $ % & *';
  }
  return { isValid_password, alertMessage_password };
};